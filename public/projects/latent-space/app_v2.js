// API Base URL - use relative path for Vercel, or localhost for dev
const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:8000/api' : '/api';

// Create floating particles for intro
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const colors = ['#8a2be2', '#00bfff', '#ff6b6b', '#4ecdc4', '#ffc371', '#ffffff'];
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        const duration = 10 + Math.random() * 10;
        particle.style.animationDuration = duration + 's';
        // Negative delay to start mid-animation (already flowing)
        particle.style.animationDelay = -(Math.random() * duration) + 's';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.width = (6 + Math.random() * 10) + 'px';
        particle.style.height = particle.style.width;
        particle.style.boxShadow = `0 0 ${10 + Math.random() * 15}px currentColor`;
        particlesContainer.appendChild(particle);
    }
}

// Initialize particles on load
document.addEventListener('DOMContentLoaded', createParticles);

// Global state
let words = [];
let colorAssociations = {};
let chordAssociations = {}; // Store chord associations for each word
let instrumentAssociations = {}; // Store instrument associations for each word
let wordData = [];
let freewriteText = '';
let userAverageColor = '';
let poemAverageColor = '';
let allWordColors = []; // Store all words with colors for rainbow
let timerInterval = null;
let timeRemaining = 60;

// Music state
let audioContext = null;
let isAudioEnabled = true; // Start with sound on

// Chord presets (root note, quality)
const CHORD_PRESETS = [
    { name: 'C Major', root: 0, intervals: [0, 4, 7], octave: 4 },
    { name: 'C Minor', root: 0, intervals: [0, 3, 7], octave: 4 },
    { name: 'D Major', root: 2, intervals: [0, 4, 7], octave: 4 },
    { name: 'D Minor', root: 2, intervals: [0, 3, 7], octave: 4 },
    { name: 'E Minor', root: 4, intervals: [0, 3, 7], octave: 4 },
    { name: 'F Major', root: 5, intervals: [0, 4, 7], octave: 4 },
    { name: 'G Major', root: 7, intervals: [0, 4, 7], octave: 4 },
    { name: 'G Minor', root: 7, intervals: [0, 3, 7], octave: 4 },
    { name: 'A Minor', root: 9, intervals: [0, 3, 7], octave: 4 },
    { name: 'A Major', root: 9, intervals: [0, 4, 7], octave: 4 },
    { name: 'B Minor', root: 11, intervals: [0, 3, 7], octave: 4 },
    { name: 'E Major', root: 4, intervals: [0, 4, 7], octave: 4 },
];

// Instrument presets
const INSTRUMENTS = [
    {
        name: 'Warm Synth',
        config: {
            osc1: { type: 'sawtooth', gain: 0.15, detune: 0 },
            osc2: { type: 'square', gain: 0.08, detune: 1.01 },
            filter: { freq: 2000, q: 1 }
        }
    },
    {
        name: 'Soft Pad',
        config: {
            osc1: { type: 'sine', gain: 0.2, detune: 0 },
            osc2: { type: 'sine', gain: 0.15, detune: 1.005 },
            filter: { freq: 1000, q: 0.5 }
        }
    },
    {
        name: 'Bright Lead',
        config: {
            osc1: { type: 'square', gain: 0.12, detune: 0 },
            osc2: { type: 'sawtooth', gain: 0.1, detune: 0.99 },
            filter: { freq: 3000, q: 2 }
        }
    },
    {
        name: 'Deep Bass',
        config: {
            osc1: { type: 'triangle', gain: 0.25, detune: 0 },
            osc2: { type: 'sine', gain: 0.2, detune: 0.995 },
            filter: { freq: 500, q: 1.5 }
        }
    },
    {
        name: 'Bell Tone',
        config: {
            osc1: { type: 'sine', gain: 0.18, detune: 0 },
            osc2: { type: 'triangle', gain: 0.12, detune: 2.01 },
            filter: { freq: 4000, q: 0.7 }
        }
    }
];

// DOM Elements
const phaseIntro = document.getElementById('phase-intro');
const phase1 = document.getElementById('phase-1');
const phase2 = document.getElementById('phase-2');
const phase3 = document.getElementById('phase-3');
const phase4 = document.getElementById('phase-4');
const wordGrid = document.getElementById('word-grid');
const startBtn = document.getElementById('start-btn');
const startFreewriteBtn = document.getElementById('start-freewrite-btn');
const timer = document.getElementById('timer');
const freewriteTextarea = document.getElementById('freewrite-textarea');
const startEarlyBtn = document.getElementById('start-early-btn');
const wordsContainer = document.getElementById('words-container');
const poemContainer = document.getElementById('poem-container');
const poemBottomSpacer = document.getElementById('poem-bottom-spacer');
const userColorCircle = document.getElementById('user-color');
const poemColorCircle = document.getElementById('poem-color');
const userAverageColorCircle = document.getElementById('user-average-color');
const poemAverageColorCircle = document.getElementById('poem-average-color');
const averageColorsContainer = document.getElementById('average-colors-container');
const rainbowContainer = document.getElementById('rainbow-container');
const restartBtn = document.getElementById('restart-btn');
const loading = document.getElementById('loading');
const soundToggle = document.getElementById('sound-toggle');

// Initialize Coloris
Coloris({
    theme: 'pill',
    themeMode: 'dark',
    alpha: false,
    format: 'hex',
    formatToggle: false,
    clearButton: false,
    clearLabel: '',
    closeButton: true,
    closeLabel: 'Close',
    swatches: [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
        '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B88B', '#FAD7A1',
        '#00ff00', '#ff00ff', '#00ffff', '#ffff00', '#ff0000'
    ]
});

function syncColorInputDisplay(input, color) {
    input.style.backgroundColor = color;
    const field = input.closest('.clr-field');
    if (field) {
        field.style.color = color;
    }
}

// Show/hide loading
function showLoading(message = 'Loading...') {
    loading.style.display = 'block';
    loading.querySelector('.progress-text').textContent = message;
}

function hideLoading() {
    loading.style.display = 'none';
}

// Switch phases
function switchPhase(fromPhase, toPhase) {
    fromPhase.classList.remove('active');
    toPhase.classList.add('active');
}

// Fetch random words
async function fetchRandomWords() {
    // showLoading('Fetching words...');
    try {
        const response = await fetch(`${API_URL}/random-words?count=12`);
        const data = await response.json();
        words = data.words;
        renderWordGrid();
    } catch (error) {
        console.error('Error fetching words:', error);
        alert('Failed to fetch words. Make sure the backend is running.');
    } finally {
        hideLoading();
    }
}

// Render word grid
function renderWordGrid() {
    wordGrid.innerHTML = '';
    words.forEach((word, index) => {
        const card = document.createElement('div');
        card.className = 'word-card';
        card.style.position = 'relative';

        const wordText = document.createElement('div');
        wordText.className = 'word-text';
        wordText.textContent = word;

        // Color picker
        const colorLabel = document.createElement('div');
        colorLabel.textContent = 'Color';
        colorLabel.style.fontSize = '0.9rem';
        colorLabel.style.marginTop = '0.5rem';
        colorLabel.style.marginBottom = '0.3rem';
        colorLabel.style.color = '#aaa';

        const colorInput = document.createElement('input');
        colorInput.type = 'text';
        colorInput.className = 'color-input';
        colorInput.dataset.coloris = '';
        colorInput.placeholder = 'Pick a color';
        const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
        colorInput.value = randomColor;

        // Style the color input to show the color properly
        syncColorInputDisplay(colorInput, randomColor);

        colorInput.addEventListener('change', function(e) {
            const color = e.target.value;
            colorAssociations[word] = color;
            card.style.borderColor = color;
            syncColorInputDisplay(colorInput, color);
            checkIfAllSelected();
        });

        // Initialize color
        colorAssociations[word] = colorInput.value;
        card.style.borderColor = colorInput.value;

        // Chord selector
        const chordLabel = document.createElement('div');
        chordLabel.textContent = 'Chord';
        chordLabel.style.fontSize = '0.9rem';
        chordLabel.style.marginTop = '1rem';
        chordLabel.style.marginBottom = '0.3rem';
        chordLabel.style.color = '#aaa';

        const chordSelect = document.createElement('select');
        chordSelect.className = 'chord-select';
        chordSelect.style.width = '100%';
        chordSelect.style.padding = '0.5rem 1rem';
        chordSelect.style.fontSize = '1rem';
        chordSelect.style.background = '#000';
        chordSelect.style.color = '#fff';
        chordSelect.style.border = '1px solid #fff';
        chordSelect.style.borderRadius = '0';
        chordSelect.style.cursor = 'pointer';
        chordSelect.style.boxSizing = 'border-box';

        // Add chord options
        CHORD_PRESETS.forEach((preset, i) => {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = preset.name;
            chordSelect.appendChild(option);
        });

        // Random initial chord
        const randomChordIndex = Math.floor(Math.random() * CHORD_PRESETS.length);
        chordSelect.value = randomChordIndex;
        chordAssociations[word] = CHORD_PRESETS[randomChordIndex];

        chordSelect.addEventListener('change', function(e) {
            const chordIndex = parseInt(e.target.value);
            chordAssociations[word] = CHORD_PRESETS[chordIndex];
            console.log(`🎵 Chord selected for "${word}":`, CHORD_PRESETS[chordIndex].name);

            checkIfAllSelected();
        });

        // Instrument selector
        const instrumentLabel = document.createElement('div');
        instrumentLabel.textContent = 'Instrument';
        instrumentLabel.style.fontSize = '0.9rem';
        instrumentLabel.style.marginTop = '1rem';
        instrumentLabel.style.marginBottom = '0.3rem';
        instrumentLabel.style.color = '#aaa';

        const instrumentSelect = document.createElement('select');
        instrumentSelect.className = 'chord-select';
        instrumentSelect.style.width = '100%';
        instrumentSelect.style.padding = '0.5rem 1rem';
        instrumentSelect.style.fontSize = '1rem';
        instrumentSelect.style.background = '#000';
        instrumentSelect.style.color = '#fff';
        instrumentSelect.style.border = '1px solid #fff';
        instrumentSelect.style.borderRadius = '0';
        instrumentSelect.style.cursor = 'pointer';
        instrumentSelect.style.boxSizing = 'border-box';

        // Add instrument options
        INSTRUMENTS.forEach((instrument, i) => {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = instrument.name;
            instrumentSelect.appendChild(option);
        });

        // Random initial instrument
        const randomInstrumentIndex = Math.floor(Math.random() * INSTRUMENTS.length);
        instrumentSelect.value = randomInstrumentIndex;
        instrumentAssociations[word] = INSTRUMENTS[randomInstrumentIndex];

        instrumentSelect.addEventListener('change', function(e) {
            const instrumentIndex = parseInt(e.target.value);
            instrumentAssociations[word] = INSTRUMENTS[instrumentIndex];
            console.log(`🎹 Instrument selected for "${word}":`, INSTRUMENTS[instrumentIndex].name);

            checkIfAllSelected();
        });

        // Play button
        const playBtn = document.createElement('button');
        playBtn.textContent = '▶ Play';
        playBtn.className = 'btn';
        playBtn.style.marginTop = '0.5rem';
        // playBtn.style.padding = '0.5rem 1rem';
        playBtn.style.fontSize = '1rem';
        playBtn.style.width = '100%';
        playBtn.style.boxSizing = 'border-box';
        playBtn.style.textAlign = 'center';
        playBtn.style.display = 'block';
        playBtn.style.margin = '0 rem';

        playBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('🎵 Play button clicked for word:', word);

            if (!initAudio()) {
                alert('Could not initialize audio. Please check your browser permissions.');
                return;
            }

            const chord = chordAssociations[word];
            const instrument = instrumentAssociations[word];
            console.log('🎵 Playing chord:', chord, 'with instrument:', instrument.name);
            playChordWithInstrument(chord, instrument, 1.0);
        });

        card.appendChild(wordText);
        card.appendChild(colorLabel);
        card.appendChild(colorInput);
        card.appendChild(chordLabel);
        card.appendChild(chordSelect);
        card.appendChild(instrumentLabel);
        card.appendChild(instrumentSelect);
        card.appendChild(playBtn);
        wordGrid.appendChild(card);
    });

    checkIfAllSelected();
}

// Check if all associations are selected
function checkIfAllSelected() {
    const allColorsSelected = Object.keys(colorAssociations).length === words.length;
    const allChordsSelected = Object.keys(chordAssociations).length === words.length;
    const allInstrumentsSelected = Object.keys(instrumentAssociations).length === words.length;

    if (allColorsSelected && allChordsSelected && allInstrumentsSelected) {
        startFreewriteBtn.disabled = false;
    }
}

// Start button
startBtn.addEventListener('click', () => {
    phaseIntro.classList.remove('active');
    phase1.classList.add('active');
});

// Start free-write phase
startFreewriteBtn.addEventListener('click', async () => {
    showLoading('Preparing your canvas...');

    // Initialize audio on first user interaction
    initAudio();

    try {
        // Compute embeddings for color associations
        const associations = words.map(word => ({
            word: word,
            color: colorAssociations[word]
        }));

        const response = await fetch(`${API_URL}/compute-embeddings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ associations })
        });

        wordData = (await response.json()).word_data;

        hideLoading();
        switchPhase(phase1, phase2);
        freewriteTextarea.focus();
        startTimer();
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to process. Check console.');
        hideLoading();
    }
});

// Timer
function startTimer() {
    timeRemaining = 60;
    timer.textContent = timeRemaining;
    startEarlyBtn.style.display = 'inline-block';
    startEarlyBtn.style.margin = '1rem auto 0 auto';

    timerInterval = setInterval(() => {
        timeRemaining--;
        timer.textContent = timeRemaining;

        if (timeRemaining <= 10) {
            timer.classList.add('urgent');
        }

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            finishFreewrite();
        }
    }, 1000);
}

startEarlyBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    finishFreewrite();
});

// Finish free-write and analyze
async function finishFreewrite() {
    freewriteText = freewriteTextarea.value.trim();

    if (!freewriteText) {
        alert('Please write something first!');
        return;
    }

    showLoading('Analyzing your words...');

    try {
        const response = await fetch(`${API_URL}/analyze-freewrite`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: freewriteText,
                word_data: wordData
            })
        });

        const data = await response.json();
        userAverageColor = data.average_color;

        // Store user's word colors for rainbow
        allWordColors = [...data.word_colors];

        console.log('User average color:', userAverageColor);
        console.log('Semantic neighbors:', data.semantic_neighbors);

        hideLoading();

        // Go straight to poem phase
        switchPhase(phase2, phase3);
        generatePoem(data.user_words, data.semantic_neighbors);
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to analyze. Check console.');
        hideLoading();
    }
}

// Generate and stream poem
async function generatePoem(userWords, semanticNeighbors) {
    poemContainer.innerHTML = '';
    allWordColors = [];
    if (averageColorsContainer) {
        averageColorsContainer.style.display = 'none';
    }

    // Set up radial map with anchor words
    initRadialMap();
    placeAnchors();

    try {
        const response = await fetch(`${API_URL}/generate-poem`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_words: userWords,
                semantic_neighbors: semanticNeighbors,
                word_data: wordData
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;
            const lines = buffer.split('\n');

            // Keep the last incomplete line in buffer
            buffer = lines.pop() || '';

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const jsonStr = line.slice(6).trim();
                        if (!jsonStr) continue;

                        const data = JSON.parse(jsonStr);

                        if (data.type === 'freewrite') {
                            // collect for display later
                            allWordColors.push({ word: data.word, color: data.color, source: 'freewrite' });
                        } else if (data.type === 'word') {
                            // Add word to poem
                            const wordSpan = document.createElement('span');
                            wordSpan.className = 'poem-word';
                            wordSpan.textContent = data.word + ' ';
                            wordSpan.style.color = data.color;
                            poemContainer.appendChild(wordSpan);

                            // Scroll so the newest word stays at the vertical center
                            requestAnimationFrame(() => {
                                requestAnimationFrame(() => {
                                    scrollWordToMiddle(wordSpan);
                                });
                            });

                            // Play chord based on color-to-chord mapping
                            if (isAudioEnabled) {
                                playChord(data.color, 0.6);
                            }

                            // Add to rainbow collection
                            allWordColors.push({ word: data.word, color: data.color });

                            // Add to radial map
                            const anchorColors = Object.values(colorAssociations);
                            addPoemWordToMap(data.word, data.color, anchorColors);
                        } else if (data.type === 'complete') {
                            poemAverageColor = data.average_color;
                            console.log('🏁 Poem complete! Average color:', poemAverageColor);

                            updatePoemSpacer(0);

                            // Show average colors container with both colors
                            if (averageColorsContainer) {
                                averageColorsContainer.style.display = 'flex';
                            }
                            if (userAverageColorCircle) {
                                userAverageColorCircle.style.backgroundColor = userAverageColor;
                            }
                            if (poemAverageColorCircle) {
                                poemAverageColorCircle.style.backgroundColor = poemAverageColor;
                            }

                            // Hide subtitle
                            const subtitle = document.getElementById('poem-subtitle');
                            if (subtitle) {
                                subtitle.style.opacity = '0';
                                subtitle.style.transition = 'opacity 0.5s';
                            }

                            // Store poem word colors
                            if (data.word_colors) {
                                allWordColors.push(...data.word_colors);
                            }

                            // Wait a moment, then show reflection BELOW the poem
                            setTimeout(() => {
                                showReflectionBelowPoem();
                            }, 1500);
                        }
                    } catch (e) {
                        console.error('❌ Error parsing SSE data:', e, line);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error generating poem:', error);
        alert('Failed to generate poem. Please try again.');
    }
}

function getScrollParent(el) {
    let parent = el.parentElement;
    while (parent) {
        const style = getComputedStyle(parent);
        const canScroll = /(auto|scroll)/.test(style.overflowY) && parent.scrollHeight > parent.clientHeight;
        if (canScroll) return parent;
        parent = parent.parentElement;
    }
    return document.scrollingElement || document.documentElement;
}

function scrollWordToMiddle(wordSpan) {
    if (!wordSpan) return;

    const scroller = getScrollParent(wordSpan);
    const isDocumentScroller = scroller === document.scrollingElement || scroller === document.documentElement;
    const visualViewport = window.visualViewport || null;
    const viewportHeight = isDocumentScroller
        ? (visualViewport ? visualViewport.height : window.innerHeight)
        : scroller.clientHeight;
    const mid = viewportHeight / 2;

    const rect = wordSpan.getBoundingClientRect();
    const scrollerRect = isDocumentScroller ? { top: 0 } : scroller.getBoundingClientRect();
    const visualOffsetTop = isDocumentScroller && visualViewport ? visualViewport.offsetTop : 0;
    const topWithinScrollerViewport = rect.top - scrollerRect.top - visualOffsetTop;
    const target = Math.max(0, scroller.scrollTop + topWithinScrollerViewport - mid);

    scroller.scrollTo({
        top: target,
        behavior: 'auto'
    });
}

function updatePoemSpacer(multiplier = 0.5) {
    if (!poemBottomSpacer) return;
    const visualViewport = window.visualViewport || null;
    const viewportHeight = visualViewport ? visualViewport.height : window.innerHeight;
    poemBottomSpacer.style.height = `${Math.max(0, Math.round(viewportHeight * multiplier))}px`;
}

// Show color reflection below the poem (instead of switching phases)
function showReflectionBelowPoem() {
    // Create a reflection container below the poem
    const reflectionDiv = document.createElement('div');
    reflectionDiv.style.marginTop = '2rem';
    reflectionDiv.style.textAlign = 'center';
    reflectionDiv.style.width = '100%';

    // Add spectrum title
    const spectrumTitle = document.createElement('h2');
    spectrumTitle.textContent = 'The Emotional Spectrum';
    spectrumTitle.style.fontSize = '1.8rem';
    spectrumTitle.style.fontWeight = '300';
    spectrumTitle.style.marginTop = '1rem';
    spectrumTitle.style.marginBottom = '1rem';
    spectrumTitle.style.color = '#ffffff';
    reflectionDiv.appendChild(spectrumTitle);

    const spectrumSubtitle = document.createElement('p');
    spectrumSubtitle.className = 'subtitle';
    spectrumSubtitle.textContent = 'Sampled words from your journey, colored by their meaning';
    reflectionDiv.appendChild(spectrumSubtitle);

    // Create rainbow container
    const rainbowDiv = document.createElement('div');
    rainbowDiv.id = 'rainbow-display';
    rainbowDiv.style.maxWidth = '1200px';
    rainbowDiv.style.width = '100%';
    rainbowDiv.style.margin = '2rem auto';
    rainbowDiv.style.display = 'flex';
    rainbowDiv.style.flexWrap = 'wrap';
    rainbowDiv.style.gap = '1rem';
    rainbowDiv.style.justifyContent = 'center';
    rainbowDiv.style.alignItems = 'center';
    reflectionDiv.appendChild(rainbowDiv);

    // Add freewrite text section
    const freewriteTitle = document.createElement('h2');
    freewriteTitle.textContent = 'What You Wrote';
    freewriteTitle.style.fontSize = '1.3rem';
    freewriteTitle.style.fontWeight = '300';
    freewriteTitle.style.marginTop = '3rem';
    freewriteTitle.style.marginBottom = '1.5rem';
    freewriteTitle.style.color = '#ffffff';
    freewriteTitle.style.letterSpacing = '0.05em';
    reflectionDiv.appendChild(freewriteTitle);

    const freewriteDisplay = document.createElement('div');
    freewriteDisplay.style.maxWidth = '700px';
    freewriteDisplay.style.width = '100%';
    freewriteDisplay.style.margin = '0 auto 3rem';
    freewriteDisplay.style.fontSize = '1.1rem';
    freewriteDisplay.style.lineHeight = '2.2';
    freewriteDisplay.style.textAlign = 'center';
    const freewriteWords = allWordColors.filter(w => w.source === 'freewrite');
    freewriteWords.forEach(item => {
        const span = document.createElement('span');
        span.textContent = item.word + ' ';
        span.style.color = item.color;
        freewriteDisplay.appendChild(span);
    });
    reflectionDiv.appendChild(freewriteDisplay);

    // Add restart button
    const restartBtn = document.createElement('button');
    restartBtn.className = 'btn btn-large';
    restartBtn.textContent = 'Start Over';
    restartBtn.style.marginTop = '1rem';
    restartBtn.onclick = restartApp;
    reflectionDiv.appendChild(restartBtn);

    // Append to phase-3 container
    phase3.appendChild(reflectionDiv);

    // Create rainbow in the new container
    createRainbowInContainer(rainbowDiv);
}

// Show color reflection with rainbow (old method - kept for compatibility)
function showReflection() {
    userColorCircle.style.backgroundColor = userAverageColor;
    poemColorCircle.style.backgroundColor = poemAverageColor;

    // Create rainbow visualization
    createRainbow();

    switchPhase(phase3, phase4);
}

// Create rainbow of colored words in a specific container
function createRainbowInContainer(container) {
    container.innerHTML = '';

    // Sort words by hue for rainbow effect
    const sortedWords = [...allWordColors].sort((a, b) => {
        const hueA = rgbToHue(hexToRgb(a.color));
        const hueB = rgbToHue(hexToRgb(b.color));
        return hueA - hueB;
    });

    // Take unique words (avoid duplicates) - limit to 50 for visual clarity
    const uniqueWords = [];
    const seenWords = new Set();

    for (const item of sortedWords) {
        if (!seenWords.has(item.word.toLowerCase()) && uniqueWords.length < 50) {
            uniqueWords.push(item);
            seenWords.add(item.word.toLowerCase());
        }
    }

    // Display words with staggered animation
    uniqueWords.forEach((item, index) => {
        setTimeout(() => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'rainbow-word';
            wordSpan.textContent = item.word;
            wordSpan.style.color = item.color;
            wordSpan.style.animationDelay = `${index * 0.05}s`;
            container.appendChild(wordSpan);
        }, index * 50);
    });
}

// Create rainbow of colored words (old method - uses default container)
function createRainbow() {
    createRainbowInContainer(rainbowContainer);
}

// Restart the entire app
function restartApp() {
    // Reset state
    colorAssociations = {};
    chordAssociations = {};
    instrumentAssociations = {};
    wordData = [];
    freewriteText = '';
    userAverageColor = '';
    poemAverageColor = '';
    allWordColors = [];
    timeRemaining = 60;

    freewriteTextarea.value = '';
    timer.classList.remove('urgent');
    startEarlyBtn.style.display = 'none';
    rainbowContainer.innerHTML = '';

    // Clear any reflection content from phase 3
    const reflectionDivs = phase3.querySelectorAll('div:not(#poem-container):not(#sound-toggle)');
    reflectionDivs.forEach(div => div.remove());
    const h2s = phase3.querySelectorAll('h2, p');
    h2s.forEach(h2 => h2.remove());
    const buttons = phase3.querySelectorAll('button:not(#sound-toggle)');
    buttons.forEach(btn => btn.remove());

    // Clear poem content
    poemContainer.innerHTML = '';

    // Reset subtitle visibility
    const subtitle = document.getElementById('poem-subtitle');
    if (subtitle) {
        subtitle.style.opacity = '1';
    }

    // Determine current phase and switch to intro
    if (phase3.classList.contains('active')) {
        switchPhase(phase3, phaseIntro);
    } else if (phase4.classList.contains('active')) {
        switchPhase(phase4, phaseIntro);
    }

    fetchRandomWords();
}

// Helper: Convert hex to RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 128, g: 128, b: 128 };
}

// Helper: Convert RGB to Hue
function rgbToHue(rgb) {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    if (delta === 0) return 0;

    let hue;
    if (max === r) {
        hue = ((g - b) / delta) % 6;
    } else if (max === g) {
        hue = (b - r) / delta + 2;
    } else {
        hue = (r - g) / delta + 4;
    }

    hue = Math.round(hue * 60);
    if (hue < 0) hue += 360;

    return hue;
}

// === MUSIC FUNCTIONS ===

// Initialize audio context (must be called after user interaction)
function initAudio() {
    if (!audioContext) {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            isAudioEnabled = true;
            console.log('🔊 Audio initialized successfully');
            return true;
        } catch (e) {
            console.error('❌ Failed to initialize audio:', e);
            isAudioEnabled = false;
            return false;
        }
    }
    return true;
}

// Map color (RGB) to musical chord
function colorToChord(hexColor) {
    const rgb = hexToRgb(hexColor);

    // Map R (0-255) to root note (C=0, D=2, E=4, F=5, G=7, A=9, B=11)
    const notes = [0, 2, 4, 5, 7, 9, 11]; // Major scale intervals
    const rootIndex = Math.floor((rgb.r / 255) * notes.length);
    const root = notes[rootIndex];

    // Map G (0-255) to chord quality
    const green = rgb.g / 255;
    let intervals;
    if (green < 0.33) {
        intervals = [0, 4, 7]; // Major chord
    } else if (green < 0.66) {
        intervals = [0, 3, 7]; // Minor chord
    } else {
        intervals = [0, 5, 7]; // Sus chord
    }

    // Map B (0-255) to octave (3-5)
    const octave = 3 + Math.floor((rgb.b / 255) * 2);

    // Create chord notes (MIDI note numbers)
    const chordNotes = intervals.map(interval => {
        const midiNote = (octave * 12) + root + interval;
        return midiNote;
    });

    return {
        notes: chordNotes,
        root: root,
        octave: octave,
        quality: green < 0.33 ? 'major' : (green < 0.66 ? 'minor' : 'sus')
    };
}

// Play a chord with a specific instrument
function playChordWithInstrument(chord, instrument, duration = 0.5) {
    if (!isAudioEnabled || !audioContext) {
        console.log('⚠️  Audio not enabled or context not initialized');
        return;
    }

    // Convert to notes if needed
    let notes;
    if (chord.intervals) {
        notes = chord.intervals.map(interval => {
            return (chord.octave * 12) + chord.root + interval;
        });
    } else {
        notes = chord.notes;
    }

    console.log(`🎵 Playing ${chord.name || 'chord'} with ${instrument.name}`);

    const now = audioContext.currentTime;
    const config = instrument.config;

    // Play each note in the chord
    notes.forEach((midiNote, i) => {
        const frequency = 440 * Math.pow(2, (midiNote - 69) / 12);

        // Create two oscillators based on instrument config
        const osc1 = audioContext.createOscillator();
        const osc2 = audioContext.createOscillator();

        osc1.type = config.osc1.type;
        osc2.type = config.osc2.type;

        osc1.frequency.setValueAtTime(frequency, now);
        osc2.frequency.setValueAtTime(frequency * config.osc2.detune, now);

        // Create filter based on instrument config
        const filter = audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(config.filter.freq, now);
        filter.Q.setValueAtTime(config.filter.q, now);

        // Create gain nodes
        const gain1 = audioContext.createGain();
        const gain2 = audioContext.createGain();
        const masterGain = audioContext.createGain();

        gain1.gain.setValueAtTime(config.osc1.gain, now);
        gain2.gain.setValueAtTime(config.osc2.gain, now);
        masterGain.gain.setValueAtTime(0, now);
        masterGain.gain.linearRampToValueAtTime(1, now + 0.05); // Attack
        masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration); // Decay

        // Connect the synth chain
        osc1.connect(gain1);
        osc2.connect(gain2);
        gain1.connect(filter);
        gain2.connect(filter);
        filter.connect(masterGain);
        masterGain.connect(audioContext.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + duration + 0.1);
        osc2.stop(now + duration + 0.1);
    });
}

// Legacy function for color-based chords (used during poem generation)
function playChord(hexColor, duration = 0.5) {
    const chord = mapColorToAnchorChord(hexColor);
    const word = findWordByColor(hexColor);
    const instrument = instrumentAssociations[word] || INSTRUMENTS[0]; // Default to first instrument
    playChordWithInstrument(chord, instrument, duration);
}

// Helper to find word by its color (for poem generation)
// Uses color similarity to find the nearest anchor word
function findWordByColor(hexColor) {
    const rgb = hexToRgb(hexColor);

    let minDistance = Infinity;
    let closestWord = null;

    for (const [word, anchorColor] of Object.entries(colorAssociations)) {
        const anchorRgb = hexToRgb(anchorColor);

        // Euclidean distance in RGB space
        const distance = Math.sqrt(
            Math.pow(rgb.r - anchorRgb.r, 2) +
            Math.pow(rgb.g - anchorRgb.g, 2) +
            Math.pow(rgb.b - anchorRgb.b, 2)
        );

        if (distance < minDistance) {
            minDistance = distance;
            closestWord = word;
        }
    }

    return closestWord || words[0];
}

// Map a color to the nearest anchor chord
// Since colors are computed from embeddings, mapping color → anchor chord
// effectively maps embeddings → chords (same semantic space!)
function mapColorToAnchorChord(hexColor) {
    const rgb = hexToRgb(hexColor);

    // Find the anchor word with the most similar color
    let minDistance = Infinity;
    let closestWord = null;

    for (const [word, anchorColor] of Object.entries(colorAssociations)) {
        const anchorRgb = hexToRgb(anchorColor);

        // Euclidean distance in RGB space
        const distance = Math.sqrt(
            Math.pow(rgb.r - anchorRgb.r, 2) +
            Math.pow(rgb.g - anchorRgb.g, 2) +
            Math.pow(rgb.b - anchorRgb.b, 2)
        );

        if (distance < minDistance) {
            minDistance = distance;
            closestWord = word;
        }
    }

    // Return the chord associated with the closest anchor word
    return chordAssociations[closestWord];
}

// Compute chord for a word based on anchor word chords (similar to color computation)
function computeWordChord(word, anchorWords, anchorChords) {
    // Find the 3 nearest anchor words to this word using embeddings
    // For now, we'll use a simple approach: find closest by checking if word exists in wordData
    // In a full implementation, we'd compute embedding similarity

    // Simple approach: return a random anchor chord (placeholder)
    // TODO: Implement proper embedding-based interpolation
    const randomIndex = Math.floor(Math.random() * anchorChords.length);
    return anchorChords[randomIndex];
}

// Restart
restartBtn.addEventListener('click', restartApp);

// Sound toggle
soundToggle.addEventListener('click', () => {
    if (isAudioEnabled) {
        isAudioEnabled = false;
        soundToggle.textContent = '🔇 Sound Off';
    } else {
        initAudio();
        soundToggle.textContent = '🔊 Sound On';
    }
});

// Initialize audio on any user click (to get around browser restrictions)
document.addEventListener('click', () => {
    if (!audioContext) {
        initAudio();
    }
}, { once: true });

// === RADIAL ANCHOR MAP ===

const radialCanvas = document.getElementById('radial-map-canvas');
const radialCtx = radialCanvas ? radialCanvas.getContext('2d') : null;

// Map nodes: { word, color, x, y, targetX, targetY, radius, type: 'anchor'|'poem' }
const mapNodes = [];
let mapAnimFrame = null;

function initRadialMap() {
    mapNodes.length = 0;
    if (!radialCtx) return;
    radialCtx.clearRect(0, 0, radialCanvas.width, radialCanvas.height);
}

function placeAnchors() {
    if (!radialCtx) return;
    const cx = radialCanvas.width / 2;
    const cy = radialCanvas.height / 2;
    const orbitR = 170;
    const anchorWords = Object.keys(colorAssociations);
    anchorWords.forEach((word, i) => {
        const angle = (i / anchorWords.length) * Math.PI * 2 - Math.PI / 2;
        const x = cx + orbitR * Math.cos(angle);
        const y = cy + orbitR * Math.sin(angle);
        mapNodes.push({ word, color: colorAssociations[word], x, y, targetX: x, targetY: y, radius: 6, type: 'anchor', angle });
    });
    drawRadialMap();
}

function addPoemWordToMap(word, color, anchorColors) {
    if (!radialCtx) return;
    const cx = radialCanvas.width / 2;
    const cy = radialCanvas.height / 2;

    // Find which anchor color is closest to this word's color (proxy for semantic pull)
    const rgb = hexToRgb(color);
    let weights = anchorColors.map(ac => {
        const ar = hexToRgb(ac);
        const dist = Math.sqrt(
            Math.pow(rgb.r - ar.r, 2) +
            Math.pow(rgb.g - ar.g, 2) +
            Math.pow(rgb.b - ar.b, 2)
        );
        return 1 / (dist * dist + 1);
    });
    const wSum = weights.reduce((a, b) => a + b, 0);
    weights = weights.map(w => w / wSum);

    const anchorNodes = mapNodes.filter(n => n.type === 'anchor');
    const maxWeight = Math.max(...weights);
    const maxIdx = weights.indexOf(maxWeight);

    // Place word between dominant anchor and center.
    // maxWeight near 1 = close to that anchor; near 1/N = near center.
    // Remap so the full weight range uses the full radial space.
    const N = anchorNodes.length;
    const minExpected = 1 / N;
    // t=1 → at anchor, t=0 → at center. Clamp to [0.1, 0.95].
    const t = Math.min(0.95, Math.max(0.1, (maxWeight - minExpected) / (1 - minExpected)));

    const domNode = anchorNodes[maxIdx];
    const tx0 = cx + (domNode.x - cx) * t;
    const ty0 = cy + (domNode.y - cy) * t;

    // Blend slightly toward secondary anchors for words that straddle two
    let tx = tx0, ty = ty0;
    anchorNodes.forEach((n, i) => {
        if (i === maxIdx) return;
        tx += (cx + (n.x - cx) * t - tx0) * weights[i] * 0.4;
        ty += (cy + (n.y - cy) * t - ty0) * weights[i] * 0.4;
    });

    // Add small jitter so overlapping words don't stack perfectly
    tx += (Math.random() - 0.5) * 20;
    ty += (Math.random() - 0.5) * 20;

    mapNodes.push({ word, color, x: cx, y: cy, targetX: tx, targetY: ty, radius: 3, type: 'poem', vx: 0, vy: 0 });
    animateRadialMap();
}

function animateRadialMap() {
    if (mapAnimFrame) cancelAnimationFrame(mapAnimFrame);
    let steps = 0;
    function step() {
        let stillMoving = false;
        mapNodes.forEach(n => {
            if (n.type !== 'poem') return;
            const dx = n.targetX - n.x;
            const dy = n.targetY - n.y;
            n.x += dx * 0.12;
            n.y += dy * 0.12;
            if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) stillMoving = true;
        });
        drawRadialMap();
        steps++;
        if (stillMoving && steps < 60) {
            mapAnimFrame = requestAnimationFrame(step);
        }
    }
    mapAnimFrame = requestAnimationFrame(step);
}

function drawRadialMap() {
    if (!radialCtx) return;
    const w = radialCanvas.width;
    const h = radialCanvas.height;
    const cx = w / 2;
    const cy = h / 2;

    radialCtx.clearRect(0, 0, w, h);

    // Draw faint orbit ring
    radialCtx.beginPath();
    radialCtx.arc(cx, cy, 155, 0, Math.PI * 2);
    radialCtx.strokeStyle = 'rgba(255,255,255,0.06)';
    radialCtx.lineWidth = 1;
    radialCtx.stroke();

    // Draw faint lines from each poem word to its dominant anchor
    const anchorNodes = mapNodes.filter(n => n.type === 'anchor');
    mapNodes.forEach(n => {
        if (n.type !== 'poem') return;
        // Find closest anchor by color distance
        let minDist = Infinity, closest = null;
        anchorNodes.forEach(an => {
            const ar = hexToRgb(an.color);
            const nr = hexToRgb(n.color);
            const d = Math.sqrt(Math.pow(nr.r-ar.r,2)+Math.pow(nr.g-ar.g,2)+Math.pow(nr.b-ar.b,2));
            if (d < minDist) { minDist = d; closest = an; }
        });
        if (closest) {
            radialCtx.beginPath();
            radialCtx.moveTo(n.x, n.y);
            radialCtx.lineTo(closest.x, closest.y);
            radialCtx.strokeStyle = n.color + '22';
            radialCtx.lineWidth = 1;
            radialCtx.stroke();
        }
    });

    // Draw poem word dots first (underneath)
    mapNodes.forEach(n => {
        if (n.type !== 'poem') return;
        radialCtx.beginPath();
        radialCtx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        radialCtx.fillStyle = n.color;
        radialCtx.globalAlpha = 0.75;
        radialCtx.fill();
        radialCtx.globalAlpha = 1;
    });

    // Draw anchor nodes on top
    anchorNodes.forEach(n => {
        // Glow
        const grd = radialCtx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 18);
        grd.addColorStop(0, n.color + 'aa');
        grd.addColorStop(1, n.color + '00');
        radialCtx.beginPath();
        radialCtx.arc(n.x, n.y, 18, 0, Math.PI * 2);
        radialCtx.fillStyle = grd;
        radialCtx.fill();

        // Dot
        radialCtx.beginPath();
        radialCtx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        radialCtx.fillStyle = n.color;
        radialCtx.fill();
        radialCtx.strokeStyle = 'rgba(255,255,255,0.4)';
        radialCtx.lineWidth = 1;
        radialCtx.stroke();

        // Label — push outward from center, clamp within canvas
        radialCtx.font = '11px -apple-system, sans-serif';
        radialCtx.fillStyle = 'rgba(255,255,255,0.75)';
        radialCtx.textBaseline = 'middle';
        const dx = n.x - cx;
        const dy = n.y - cy;
        const labelDist = 22;
        const mag = Math.sqrt(dx*dx + dy*dy) || 1;
        let lx = n.x + (dx / mag) * labelDist;
        let ly = n.y + (dy / mag) * labelDist;
        // Clamp so text doesn't clip
        const margin = 36;
        lx = Math.max(margin, Math.min(w - margin, lx));
        ly = Math.max(10, Math.min(h - 10, ly));
        // Align text away from center
        radialCtx.textAlign = dx > 0 ? 'left' : (dx < -4 ? 'right' : 'center');
        radialCtx.fillText(n.word, lx, ly);
    });
}

// Keep poem spacer in sync with viewport size
updatePoemSpacer();
window.addEventListener('resize', updatePoemSpacer);
if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', updatePoemSpacer);
}

// Initialize
fetchRandomWords();
