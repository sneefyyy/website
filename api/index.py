from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sse_starlette.sse import EventSourceResponse, ServerSentEvent
from openai import OpenAI, AsyncOpenAI
from dotenv import load_dotenv
import numpy as np
import json
import random
import asyncio
import re
import httpx
import os
from typing import List, Dict
from collections import Counter

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables
poetry_words = []
embeddings_cache = None
neighbors_cache = {}
word_to_index = {}
free_write_words_colors = []

# API Configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

# Initialize OpenAI clients (sync for embeddings, async for chat)
openai_client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None
async_openai_client = AsyncOpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None

# Embedding model configuration
EMBEDDING_MODEL = "text-embedding-3-small"
EMBEDDING_DIMENSIONS = 384  # Match the cached embeddings dimensions

# Stop words to skip for performance
STOP_WORDS = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'is', 'was', 'are', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'them', 'their', 'my', 'your', 'his', 'her', 'its', 'our'}

# Data file paths - points to src/pages/Projects/latent-space
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(PROJECT_ROOT, 'src', 'pages', 'Projects', 'latent-space')
EMBEDDINGS_PATH = os.path.join(DATA_DIR, 'embeddings_cache.npz')
NEIGHBORS_PATH = os.path.join(DATA_DIR, 'neighbors_cache.json')

class ColorAssociation(BaseModel):
    word: str
    color: str

class ColorAssociations(BaseModel):
    associations: List[ColorAssociation]

def get_openai_embeddings(texts: List[str]) -> List[np.ndarray]:
    """Get embeddings for multiple texts using OpenAI API"""
    if not openai_client:
        raise ValueError("OpenAI API key not configured")

    response = openai_client.embeddings.create(
        model=EMBEDDING_MODEL,
        input=texts,
        dimensions=EMBEDDING_DIMENSIONS
    )
    return [np.array(e.embedding) for e in response.data]

def load_precomputed_data():
    """Load pre-computed embeddings and neighbors"""
    global embeddings_cache, neighbors_cache, poetry_words, word_to_index

    try:
        print(f"Loading embeddings from {EMBEDDINGS_PATH}...")
        data = np.load(EMBEDDINGS_PATH, allow_pickle=True)
        embeddings_cache = data['embeddings']
        poetry_words = data['words'].tolist()
        word_to_index = {word: i for i, word in enumerate(poetry_words)}
        print(f"✓ Loaded {len(poetry_words)} pre-computed embeddings")

        print(f"Loading neighbors from {NEIGHBORS_PATH}...")
        with open(NEIGHBORS_PATH, 'r') as f:
            neighbors_cache = json.load(f)
        print(f"✓ Loaded neighbors for {len(neighbors_cache)} words")

    except FileNotFoundError as e:
        print(f"⚠ Pre-computed data not found: {e}")
        raise

def ensure_initialized():
    """Lazy initialization for serverless"""
    global embeddings_cache
    if embeddings_cache is None:
        load_precomputed_data()

def get_embedding(text: str) -> np.ndarray:
    """Get embedding for text - uses cache or OpenAI API"""
    ensure_initialized()
    if text.lower() in word_to_index:
        return embeddings_cache[word_to_index[text.lower()]]
    # Not in cache, use OpenAI API
    return get_openai_embeddings([text])[0]

def extract_words(text: str) -> List[str]:
    """Extract all words from text"""
    words = re.findall(r'\b\w+\b', text.lower())
    return words

def find_semantic_neighbors(word: str, k: int = 3) -> List[str]:
    """Find k nearest semantic neighbors for a word"""
    ensure_initialized()
    word_lower = word.lower()

    if word_lower in neighbors_cache:
        return neighbors_cache[word_lower][:k]

    try:
        word_embedding = get_embedding(word)
        word_norm = word_embedding / (np.linalg.norm(word_embedding) + 1e-8)
        embeddings_norm = embeddings_cache / (np.linalg.norm(embeddings_cache, axis=1, keepdims=True) + 1e-8)
        similarities = np.dot(embeddings_norm, word_norm)
        top_indices = np.argsort(similarities)[-k:][::-1]
        return [poetry_words[i] for i in top_indices]
    except Exception as e:
        print(f"Error finding neighbors for '{word}': {e}")
        return []

def hex_to_rgb(hex_color: str) -> tuple:
    """Convert hex color to RGB tuple"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def rgb_to_hex(rgb: tuple) -> str:
    """Convert RGB tuple to hex color"""
    return '#{:02x}{:02x}{:02x}'.format(int(rgb[0]), int(rgb[1]), int(rgb[2]))

def compute_word_color(word: str, anchor_embeddings: np.ndarray, anchor_colors: np.ndarray) -> str:
    """Compute color for a word based on anchor colors"""
    embedding = get_embedding(word)

    embedding_norm = embedding / (np.linalg.norm(embedding) + 1e-8)
    anchor_embeddings_norm = anchor_embeddings / (np.linalg.norm(anchor_embeddings, axis=1, keepdims=True) + 1e-8)
    similarities = np.dot(anchor_embeddings_norm, embedding_norm)
    distances = 1 - similarities

    k = min(3, len(distances))
    nearest_indices = np.argsort(distances)[:k]
    nearest_distances = distances[nearest_indices]
    nearest_colors = anchor_colors[nearest_indices]

    power = 3.0
    weights = 1.0 / (nearest_distances ** power + 1e-6)
    weights = weights / weights.sum()

    interpolated_rgb = np.sum(nearest_colors * weights[:, np.newaxis], axis=0)
    return rgb_to_hex(tuple(interpolated_rgb))

async def generate_poem_via_openai(user_words: List[str], semantic_neighbors: List[str], target_color: str = None):
    """Generate poem using OpenAI API"""
    if not async_openai_client:
        raise ValueError("OpenAI API key not available")

    color_guidance = ""
    if target_color:
        color_guidance = f"\n\nEMOTIONAL TARGET: The user has chosen the color {target_color} to guide the poem's emotional tone. Let this color influence your word choices and emotional direction."

    prompt = f"""You are an innovative poet. Analyze the emotional landscape of these words and choose the poetry style that best matches their essence:

User's words: {', '.join(user_words[:15])}
Emotional resonances: {', '.join(semantic_neighbors[:15])}{color_guidance}

Choose your form based on what you sense:
- If intense/passionate → raw confessional with sharp breaks
- If melancholic/quiet → minimalist, spare language
- If anxious/fractured → fragmented, broken syntax
- If joyful/vivid → lyrical, sensory-rich flow
- If contemplative → meditative free verse with repetition
- If strange/surreal → dreamlike metaphor and juxtaposition
- If visceral/embodied → concrete, physical imagery
- Or invent your own approach that fits

CRITICAL RULES:
- NEVER start with "In the..." or "There is/are" or "The world" or "A place where"
- Start with: a command, question, concrete image, sudden action, or raw statement
- Be bold and specific, not vague and atmospheric
- Match your form to the emotional content
- 50-100 words

Write ONLY the poem - no title, quotes, explanation, or preamble."""

    try:
        response = await async_openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            stream=True,
            max_tokens=300,
            temperature=1.0
        )

        async for chunk in response:
            if chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content
            if chunk.choices[0].finish_reason:
                break
    except Exception as e:
        print(f"⚠️  OpenAI error: {e}")
        raise

async def generate_poem_locally(user_words: List[str], semantic_neighbors: List[str]):
    """Generate poem locally from semantic space - no API needed"""
    all_words = user_words[:15] + semantic_neighbors[:25]
    random.shuffle(all_words)

    target_length = random.randint(60, 80)
    poem_words = []

    for i in range(target_length):
        word = all_words[i % len(all_words)]
        poem_words.append(word)

    poem_text = ""
    for i, word in enumerate(poem_words):
        poem_text += word + " "

        if (i + 1) % random.randint(8, 12) == 0:
            poem_text += "\n"

        if (i + 1) % random.randint(3, 5) == 0 or i == len(poem_words) - 1:
            yield poem_text
            poem_text = ""
            await asyncio.sleep(0.1)

async def generate_poem_via_api(user_words: List[str], semantic_neighbors: List[str], target_color: str = None):
    """Generate poem - tries OpenAI first, then OpenRouter, then local fallback"""

    if async_openai_client:
        try:
            async for chunk in generate_poem_via_openai(user_words, semantic_neighbors, target_color):
                yield chunk
            return
        except Exception as e:
            print(f"⚠️  OpenAI failed: {e}")

    if OPENROUTER_API_KEY:
        prompt = f"""You are a poet exploring emotional landscapes. Write a medium-length poem (50-100 words) that mirrors and explores the emotional space expressed in these words.

User's words: {', '.join(user_words[:15])}
Semantic connections: {', '.join(semantic_neighbors[:15])}

Write an evocative poem that reveals deeper connections. Be poetic, not literal.
IMPORTANT: Write ONLY in English. Do not use any other languages, markdown formatting, quotation marks, or special characters."""

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                async with client.stream(
                    "POST",
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                        "HTTP-Referer": "https://latent-space.vercel.app",
                        "X-Title": "Emotional Poetry Mirror"
                    },
                    json={
                        "model": "nousresearch/hermes-3-llama-3.1-405b:free",
                        "messages": [{"role": "user", "content": prompt}],
                        "stream": True
                    }
                ) as response:
                    if response.status_code in [429, 402]:
                        async for chunk in generate_poem_locally(user_words, semantic_neighbors):
                            yield chunk
                        return

                    response.raise_for_status()

                    async for line in response.aiter_lines():
                        if line.startswith("data: "):
                            data_str = line[6:]
                            if data_str == "[DONE]":
                                break
                            try:
                                data = json.loads(data_str)
                                if "choices" in data and len(data["choices"]) > 0:
                                    delta = data["choices"][0].get("delta", {})
                                    content = delta.get("content", "")
                                    if content:
                                        yield content
                            except json.JSONDecodeError:
                                continue
                    return
        except Exception as e:
            print(f"⚠️  OpenRouter error: {e}")

    async for chunk in generate_poem_locally(user_words, semantic_neighbors):
        yield chunk

@app.get("/api/random-words")
async def get_random_words(count: int = 12):
    """Get random words from the poetry vocabulary"""
    ensure_initialized()
    selected_words = random.sample(poetry_words, count)
    return {"words": selected_words}

@app.post("/api/compute-embeddings")
async def compute_embeddings(associations: ColorAssociations):
    """Get embeddings for the associated words"""
    ensure_initialized()
    word_data = []
    for assoc in associations.associations:
        embedding = get_embedding(assoc.word)
        rgb = hex_to_rgb(assoc.color)
        word_data.append({
            "word": assoc.word,
            "embedding": embedding.tolist(),
            "color": assoc.color,
            "rgb": rgb
        })
    return {"word_data": word_data}

@app.post("/api/analyze-freewrite")
async def analyze_freewrite(data: Dict):
    """Analyze free-write text and return words with colors and average color"""
    global free_write_words_colors
    ensure_initialized()
    free_write_words_colors = []

    try:
        text = data["text"]
        anchor_embeddings = np.array([wd["embedding"] for wd in data["word_data"]])
        anchor_colors = np.array([wd["rgb"] for wd in data["word_data"]])

        words = extract_words(text)
        word_freq = Counter(words)
        unique_words = [word for word, count in word_freq.most_common(50)]
        unique_words = [w for w in unique_words if w not in STOP_WORDS and len(w) > 2]

        word_colors = []
        rgb_values = []

        unique_embeddings = {word: get_embedding(word) for word in unique_words}

        for word in words:
            if word in unique_embeddings:
                embedding = unique_embeddings[word]
            else:
                embedding = get_embedding(word)

            embedding_norm = embedding / (np.linalg.norm(embedding) + 1e-8)
            anchor_embeddings_norm = anchor_embeddings / (np.linalg.norm(anchor_embeddings, axis=1, keepdims=True) + 1e-8)
            similarities = np.dot(anchor_embeddings_norm, embedding_norm)
            distances = 1 - similarities

            k = min(3, len(distances))
            nearest_indices = np.argsort(distances)[:k]
            nearest_distances = distances[nearest_indices]
            nearest_colors = anchor_colors[nearest_indices]

            power = 3.0
            weights = 1.0 / (nearest_distances ** power + 1e-6)
            weights = weights / weights.sum()

            interpolated_rgb = np.sum(nearest_colors * weights[:, np.newaxis], axis=0)
            color = rgb_to_hex(tuple(interpolated_rgb))

            word_colors.append({"word": word, "color": color})
            rgb_values.append(hex_to_rgb(color))
            free_write_words_colors.append({"word": word, "color": color})

        if rgb_values:
            avg_rgb = np.mean(rgb_values, axis=0)
            avg_color = rgb_to_hex(tuple(avg_rgb))
        else:
            avg_color = "#FFFFFF"

        all_neighbors = []
        for word in unique_words[:20]:
            neighbors = find_semantic_neighbors(word, k=3)
            all_neighbors.extend(neighbors)

        semantic_neighbors = list(set(all_neighbors))[:20]

        return {
            "word_colors": word_colors,
            "average_color": avg_color,
            "semantic_neighbors": semantic_neighbors,
            "user_words": unique_words[:20]
        }
    except Exception as e:
        print(f"Error in analyze_freewrite: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-poem")
async def generate_poem(data: Dict):
    """Generate and stream poem word-by-word"""
    ensure_initialized()
    try:
        user_words = data["user_words"]
        semantic_neighbors = data["semantic_neighbors"]
        anchor_embeddings = np.array([wd["embedding"] for wd in data["word_data"]])
        anchor_colors = np.array([wd["rgb"] for wd in data["word_data"]])
        target_color = data.get("target_color")

        async def stream_poem():
            generated_words = []
            word_colors = []
            rgb_values = []
            buffer = ""
            words_sent = 0

            if free_write_words_colors:
                for item in free_write_words_colors:
                    event_data = json.dumps({'type': 'freewrite', 'word': item['word'], 'color': item['color']})
                    yield ServerSentEvent(data=event_data)

            async for chunk in generate_poem_via_api(user_words, semantic_neighbors, target_color):
                buffer += chunk

                parts = buffer.split()

                if buffer and not buffer[-1].isspace():
                    if parts:
                        buffer = parts[-1]
                        words_to_process = parts[:-1]
                    else:
                        continue
                else:
                    words_to_process = parts
                    buffer = ""

                for word in words_to_process:
                    if not word.strip():
                        continue

                    clean_word = re.sub(r'[^\w\s-]', '', word.lower())
                    if not clean_word:
                        continue

                    color = compute_word_color(clean_word, anchor_embeddings, anchor_colors)
                    rgb = hex_to_rgb(color)

                    generated_words.append(clean_word)
                    word_colors.append({"word": word, "color": color})
                    rgb_values.append(rgb)

                    words_sent += 1
                    event_data = json.dumps({'type': 'word', 'word': word, 'color': color})
                    yield ServerSentEvent(data=event_data)
                    await asyncio.sleep(0.3)

            if buffer.strip():
                word = buffer.strip()
                clean_word = re.sub(r'[^\w\s-]', '', word.lower())
                if clean_word:
                    color = compute_word_color(clean_word, anchor_embeddings, anchor_colors)
                    rgb = hex_to_rgb(color)
                    generated_words.append(clean_word)
                    word_colors.append({"word": word, "color": color})
                    rgb_values.append(rgb)
                    words_sent += 1
                    event_data = json.dumps({'type': 'word', 'word': word, 'color': color})
                    yield ServerSentEvent(data=event_data)
                    await asyncio.sleep(0.3)

            if rgb_values:
                avg_rgb = np.mean(rgb_values, axis=0)
                avg_color = rgb_to_hex(tuple(avg_rgb))
            else:
                avg_color = "#808080"

            event_data = json.dumps({'type': 'complete', 'average_color': avg_color, 'word_colors': word_colors})
            yield ServerSentEvent(data=event_data)

        return EventSourceResponse(stream_poem())

    except Exception as e:
        print(f"Error in generate_poem: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
