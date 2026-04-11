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
// audioContext replaced by Tone.js sampler
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
        const response = await fetch(`${API_URL}/random-words?count=${selectedWordCount}`);
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
    // Adapt columns: 4 words → 2 cols, 8 → 4 cols, 12 → 4 cols
    const cols = selectedWordCount === 4 ? 2 : 4;
    wordGrid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
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
            // Preview the chord assigned to this word
            const ci = chordAssociations[word] ?? 0;
            if (samplerReady && isAudioEnabled) {
                playPianoChord(CHORDS[ci].notes);
            }
        });

        // Initialize color
        colorAssociations[word] = colorInput.value;
        card.style.borderColor = colorInput.value;

        // Chord picker — one button per chord, default to first unoccupied chord
        const defaultChordIdx = Object.keys(chordAssociations).length % CHORDS.length;
        chordAssociations[word] = defaultChordIdx;

        const chordLabel = document.createElement('div');
        chordLabel.textContent = 'Chord';
        chordLabel.style.cssText = 'font-size:0.9rem;margin-top:0.8rem;margin-bottom:0.3rem;color:#aaa;';

        const chordBtns = document.createElement('div');
        chordBtns.className = 'chord-btn-group';

        CHORDS.forEach((ch, ci) => {
            const btn = document.createElement('button');
            btn.textContent = ch.name;
            btn.className = 'chord-btn' + (ci === defaultChordIdx ? ' active' : '');
            btn.addEventListener('click', () => {
                chordAssociations[word] = ci;
                chordBtns.querySelectorAll('.chord-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                if (samplerReady && isAudioEnabled) {
                    playPianoChord(ch.notes);
                }
            });
            chordBtns.appendChild(btn);
        });

        card.appendChild(wordText);
        card.appendChild(colorLabel);
        card.appendChild(colorInput);
        card.appendChild(chordLabel);
        card.appendChild(chordBtns);
        wordGrid.appendChild(card);
    });

    checkIfAllSelected();
}

// Check if all associations are selected
function checkIfAllSelected() {
    if (Object.keys(colorAssociations).length === words.length) {
        startFreewriteBtn.disabled = false;
    }
}

// Start button — go straight to freewrite (phase 1)
startBtn.addEventListener('click', () => {
    initAudio();
    switchPhase(phaseIntro, phase1);
    freewriteTextarea.focus();
    startTimer();
});

// "Continue" from color picking — compute embeddings then stream the precomputed poem
startFreewriteBtn.addEventListener('click', async () => {
    showLoading('Almost there...');
    try {
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

        // Compute average of user's chosen anchor colors
        const anchorRgbs = Object.values(colorAssociations).map(hex => hexToRgb(hex));
        if (anchorRgbs.length) {
            const avg = anchorRgbs.reduce((acc, c) => ({ r: acc.r + c.r, g: acc.g + c.g, b: acc.b + c.b }), { r: 0, g: 0, b: 0 });
            userAverageColor = `rgb(${Math.round(avg.r / anchorRgbs.length)}, ${Math.round(avg.g / anchorRgbs.length)}, ${Math.round(avg.b / anchorRgbs.length)})`;
        }

        hideLoading();
        switchPhase(phase2, phase3);
        generatePoem();
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

// Finish free-write: move to color picking (poem generates after colors are chosen)
async function finishFreewrite() {
    freewriteText = freewriteTextarea.value.trim();

    if (!freewriteText) {
        alert('Please write something first!');
        return;
    }

    showLoading('Reading your words...');

    try {
        await fetchRandomWords();
        hideLoading();
        switchPhase(phase1, phase2);
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to process. Check console.');
        hideLoading();
    }
}

// Generate and stream poem from the precomputed buffer
async function generatePoem() {
    poemContainer.innerHTML = '';
    allWordColors = [];
    if (averageColorsContainer) {
        averageColorsContainer.style.display = 'none';
    }

    initRadialMap();
    placeAnchors();

    try {
        const response = await fetch(`${API_URL}/stream-poem`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: freewriteText,
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
                            const wordSpan = document.createElement('span');
                            wordSpan.className = 'poem-word';
                            wordSpan.textContent = data.word + ' ';
                            wordSpan.style.color = data.color;
                            poemContainer.appendChild(wordSpan);

                            requestAnimationFrame(() => {
                                requestAnimationFrame(() => {
                                    scrollWordToMiddle(wordSpan);
                                });
                            });

                            // Play the chord for this word immediately as it appears
                            if (isAudioEnabled && samplerReady) {
                                const anchorColorList = words.map(w => colorAssociations[w]);
                                const anchorChordList = words.map(w => chordAssociations[w] ?? 0);
                                const chord = interpolateChord(data.color, anchorColorList, anchorChordList);
                                playPianoChord(chord.notes);
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

                            // Ensure freewrite colors are present (in case freewrite events were missed)
                            if (data.freewrite_word_colors) {
                                const hasFreewrite = allWordColors.some(w => w.source === 'freewrite');
                                if (!hasFreewrite) {
                                    data.freewrite_word_colors.forEach(item => {
                                        allWordColors.push({ word: item.word, color: item.color, source: 'freewrite' });
                                    });
                                }
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
    stopMusic();
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

    // Switch whatever is active back to intro
    [phase1, phase2, phase3, phase4].forEach(p => p.classList.remove('active'));
    phaseIntro.classList.add('active');
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

// Word count selection (4, 8, or 12)
let selectedWordCount = 8;

// ---------------------------------------------------------------------------
// CHORD PALETTE
// 10 chords in octave 3 (warm register). Each has:
//   notes — Tone.js note names
//   pos   — [x, y] in music-theory 2D space for interpolation:
//             x = circle-of-fifths position, y = +1 major / -1 minor
// ---------------------------------------------------------------------------
const CHORDS = [
    { name: 'C',  notes: ['C3',  'E3',  'G3'],  pos: [ 0.00,  1] },
    { name: 'Am', notes: ['A2',  'C3',  'E3'],  pos: [-0.17, -1] },
    { name: 'F',  notes: ['F2',  'A2',  'C3'],  pos: [-0.33,  1] },
    { name: 'Dm', notes: ['D2',  'F2',  'A2'],  pos: [-0.50, -1] },
    { name: 'G',  notes: ['G2',  'B2',  'D3'],  pos: [ 0.17,  1] },
    { name: 'Em', notes: ['E2',  'G2',  'B2'],  pos: [ 0.00, -1] },
    { name: 'D',  notes: ['D3',  'F#3', 'A3'],  pos: [ 0.33,  1] },
    { name: 'Cm', notes: ['C3',  'Eb3', 'G3'],  pos: [-0.83, -1] },
    { name: 'Fm', notes: ['F2',  'Ab2', 'C3'],  pos: [-0.67, -1] },
    { name: 'Gm', notes: ['G2',  'Bb2', 'D3'],  pos: [ 0.17, -1] },
];

// Tone.js sampler — loaded once, reused for all playback
let sampler = null;
let samplerReady = false;

function initAudio() {
    // Tone.js manages its own AudioContext — start it on user gesture
    if (Tone.context.state !== 'running') {
        Tone.start();
    }
    isAudioEnabled = true;

    if (sampler) return; // already initialised

    sampler = new Tone.Sampler({
        urls: {
            A0: 'A0.mp3', C1: 'C1.mp3', 'D#1': 'Ds1.mp3', 'F#1': 'Fs1.mp3',
            A1: 'A1.mp3', C2: 'C2.mp3', 'D#2': 'Ds2.mp3', 'F#2': 'Fs2.mp3',
            A2: 'A2.mp3', C3: 'C3.mp3', 'D#3': 'Ds3.mp3', 'F#3': 'Fs3.mp3',
            A3: 'A3.mp3', C4: 'C4.mp3', 'D#4': 'Ds4.mp3', 'F#4': 'Fs4.mp3',
            A4: 'A4.mp3', C5: 'C5.mp3', 'D#5': 'Ds5.mp3', 'F#5': 'Fs5.mp3',
            A5: 'A5.mp3', C6: 'C6.mp3', 'D#6': 'Ds6.mp3', 'F#6': 'Fs6.mp3',
            A6: 'A6.mp3', C7: 'C7.mp3', 'D#7': 'Ds7.mp3', 'F#7': 'Fs7.mp3',
            A7: 'A7.mp3', C8: 'C8.mp3',
        },
        baseUrl: 'https://tonejs.github.io/audio/salamander/',
        onload: () => { samplerReady = true; },
    }).toDestination();

    sampler.volume.value = -6; // dB, comfortable level
}

// Play a chord — notes is an array of Tone.js note strings e.g. ['C3','E3','G3']
// Strums each voice 15ms apart for a natural feel.
function playPianoChord(notes) {
    if (!sampler || !samplerReady || !isAudioEnabled) return;
    notes.forEach((note, i) => {
        sampler.triggerAttackRelease(note, '2n', Tone.now() + i * 0.015);
    });
}

// ---------------------------------------------------------------------------
// Chord interpolation — mirrors the backend color interpolation exactly.
// anchorChordIndices: array of chord indices (one per anchor word, in order)
// wordColor: the hex color the backend assigned to this poem word
// anchorColors: the hex colors the user picked (same order as anchorChordIndices)
//
// We compute how similar the word's color is to each anchor color, then
// interpolate between anchor chord positions (pos[]) with those weights,
// and return whichever CHORDS entry is nearest the interpolated point.
// ---------------------------------------------------------------------------
function interpolateChord(wordColor, anchorColors, anchorChordIndices) {
    if (!anchorChordIndices.length) return CHORDS[0];

    const wordRgb = hexToRgb(wordColor);

    // Inverse-distance-squared weights in RGB space (same as backend power=3 IDW)
    const weights = anchorColors.map(ac => {
        const ar = hexToRgb(ac);
        const d2 = Math.pow(wordRgb.r - ar.r, 2)
                 + Math.pow(wordRgb.g - ar.g, 2)
                 + Math.pow(wordRgb.b - ar.b, 2);
        return 1 / (d2 + 1);
    });
    const wSum = weights.reduce((a, b) => a + b, 0);
    const wNorm = weights.map(w => w / wSum);

    // Weighted average position in chord-theory space
    let px = 0, py = 0;
    anchorChordIndices.forEach((ci, i) => {
        const [cx, cy] = CHORDS[ci].pos;
        px += cx * wNorm[i];
        py += cy * wNorm[i];
    });

    // Find nearest chord to interpolated point
    let best = 0, bestDist = Infinity;
    CHORDS.forEach((ch, i) => {
        const d = Math.pow(ch.pos[0] - px, 2) + Math.pow(ch.pos[1] - py, 2);
        if (d < bestDist) { bestDist = d; best = i; }
    });
    return CHORDS[best];
}

function stopMusic() {
    if (sampler) sampler.releaseAll();
}

// Restart
restartBtn.addEventListener('click', restartApp);

// Sound toggle
soundToggle.addEventListener('click', () => {
    if (isAudioEnabled) {
        isAudioEnabled = false;
        if (sampler) sampler.volume.rampTo(-Infinity, 0.3);
        soundToggle.textContent = '🔇 Sound Off';
    } else {
        initAudio();
        isAudioEnabled = true;
        if (sampler) sampler.volume.rampTo(-6, 0.3);
        soundToggle.textContent = '🔊 Sound On';
    }
});

// Initialize audio on any user click (to get around browser restrictions)
document.addEventListener('click', () => {
    if (!sampler) {
        initAudio();
    }
}, { once: true });

// === WORD COUNT PICKER ===
document.querySelectorAll('.word-count-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.word-count-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedWordCount = parseInt(btn.dataset.count);
    });
});


// === RADIAL ANCHOR MAP ===

const radialCanvas = document.getElementById('radial-map-canvas');
const radialCtx = radialCanvas ? radialCanvas.getContext('2d') : null;

// Logical canvas size in CSS pixels — used for all coordinate math
const MAP_SIZE = 460;

// Scale canvas for devicePixelRatio so text and dots are sharp on retina screens
if (radialCanvas && radialCtx) {
    const dpr = window.devicePixelRatio || 1;
    radialCanvas.width = MAP_SIZE * dpr;
    radialCanvas.height = MAP_SIZE * dpr;
    radialCanvas.style.width = MAP_SIZE + 'px';
    radialCanvas.style.height = MAP_SIZE + 'px';
    radialCtx.scale(dpr, dpr);
}

// Map nodes: { word, color, x, y, targetX, targetY, radius, type: 'anchor'|'poem' }
const mapNodes = [];
let mapAnimFrame = null;

function initRadialMap() {
    mapNodes.length = 0;
    if (!radialCtx) return;
    radialCtx.clearRect(0, 0, MAP_SIZE, MAP_SIZE);
}

function placeAnchors() {
    if (!radialCtx) return;
    const cx = MAP_SIZE / 2;
    const cy = MAP_SIZE / 2;
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
    const cx = MAP_SIZE / 2;
    const cy = MAP_SIZE / 2;

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
    const w = MAP_SIZE;
    const h = MAP_SIZE;
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

