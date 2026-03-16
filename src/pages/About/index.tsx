import { Link } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import './About.css';

const NAV_ITEMS = [
  { label: 'Jack', path: '/' },
  { label: 'Writing', path: '/writing' },
  { label: 'Projects', path: '/projects' },
  { label: 'Research', path: '/research' },
  { label: 'About', path: '/about' },
];

const FRAME_COUNT = 7;
const FRAMES = Array.from({ length: FRAME_COUNT }, (_, i) => `/about_me/${i + 1}.svg`);

const X_START = 15;
const X_END = 85;
const Y_START = 18;

// Seeded PRNG for deterministic per-particle direction changes
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

type Particle = {
  seed: number;
  speed: number;
  startAngle: number;
  startFrame: number;
  frameSpeed: number;
};

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, () => ({
    seed: Math.floor(Math.random() * 2147483647),
    speed: 0.4 + Math.random() * 0.6,
    startAngle: Math.random() * Math.PI * 2,
    startFrame: Math.floor(Math.random() * FRAME_COUNT),
    frameSpeed: 10 + Math.random() * 30,
  }));
}

function getParticlePosition(
  p: Particle,
  currentTick: number,
  fractional: number,
  spread: number,
  ticks: number,
  dirChangeRate: number,
) {
  const rng = mulberry32(p.seed);
  let angle = p.startAngle;
  let prob = 0;
  let x = 0;
  let y = 0;
  const stepSize = spread / Math.max(ticks, 1);

  for (let tick = 1; tick <= currentTick; tick++) {
    x += Math.cos(angle) * p.speed * stepSize;
    y += Math.sin(angle) * p.speed * stepSize;
    prob += dirChangeRate;
    const roll = rng();
    if (roll < prob) {
      angle = rng() * Math.PI * 2;
      prob = 0;
    }
  }

  x += Math.cos(angle) * p.speed * stepSize * fractional;
  y += Math.sin(angle) * p.speed * stepSize * fractional;

  return { x, y, angle };
}

const SLIDER_CONFIG = [
  { key: 'zigzags', label: 'Zig Zags', min: 1, max: 20, step: 1 },
  { key: 'explodeCount', label: 'Explode Count', min: 10, max: 2000, step: 10 },
  { key: 'explodeSpread', label: 'Explode Spread', min: 10, max: 400, step: 5 },
  { key: 'dirChangeRate', label: 'Dir Change Rate', min: 0.01, max: 1, step: 0.01 },
  { key: 'ticks', label: 'Dir Checkpoints', min: 1, max: 100, step: 1 },
] as const;

type Settings = {
  zigzags: number;
  explodeCount: number;
  explodeSpread: number;
  dirChangeRate: number;
  ticks: number;
  duration: number;
};

const DEFAULTS: Settings = {
  zigzags: 5,
  explodeCount: 1000,
  explodeSpread: 120,
  dirChangeRate: 0.33,
  ticks: 1,
  duration: 1500,
};

export default function About() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [particles, setParticles] = useState(() => generateParticles(DEFAULTS.explodeCount));
  const [runnerProgress, setRunnerProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [animTime, setAnimTime] = useState(0);
  const [paused, setPaused] = useState(false);
  const [animationHidden, setAnimationHidden] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const lastFrameRef = useRef<number | null>(null);

  const hasExploded = runnerProgress >= 1 && !paused;
  const prevExplodedRef = useRef(false);

  // Reset explosion when scrolling back up
  useEffect(() => {
    if (prevExplodedRef.current && !hasExploded) {
      setAnimTime(0);
      setParticles(generateParticles(settings.explodeCount));
    }
    prevExplodedRef.current = hasExploded;
  }, [hasExploded, settings.explodeCount]);

  const updateSetting = useCallback((key: keyof Settings, value: number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    if (key === 'explodeCount') {
      setParticles(generateParticles(value));
    }
  }, []);

  // Preload images + scroll handler
  useEffect(() => {
    FRAMES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    const handleScroll = () => {
      const el = pageRef.current;
      const textEl = textRef.current;
      if (!el || !textEl) return;

      const currentScroll = el.scrollTop;
      setScrollY(currentScroll);

      const textBottomPx = textEl.offsetTop + textEl.offsetHeight;
      const scrollTarget = textBottomPx - window.innerHeight;
      const progress = scrollTarget > 0 ? Math.min(currentScroll / scrollTarget, 1) : 0;
      setRunnerProgress(progress);
    };

    const el = pageRef.current;
    if (el) el.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (el) el.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Continuous time-based explosion animation
  useEffect(() => {
    if (!hasExploded) {
      cancelAnimationFrame(rafRef.current);
      lastFrameRef.current = null;
      return;
    }

    const animate = (now: number) => {
      if (lastFrameRef.current !== null) {
        const delta = now - lastFrameRef.current;
        setAnimTime(prev => prev + delta);
      }
      lastFrameRef.current = now;
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(rafRef.current);
      lastFrameRef.current = null;
    };
  }, [hasExploded]);

  const togglePause = useCallback(() => {
    setPaused(prev => {
      if (!prev) {
        // Pausing
      } else {
        setAnimTime(0);
        setParticles(generateParticles(settings.explodeCount));
      }
      return !prev;
    });
  }, [settings.explodeCount]);

  const explodeT = animTime / settings.duration;

  const effectiveProgress = Math.min(runnerProgress, 1);
  const totalT = effectiveProgress * settings.zigzags;
  const zigzagIndex = Math.min(Math.floor(totalT), settings.zigzags - 1);
  const t = totalT - zigzagIndex;

  const goingRight = zigzagIndex % 2 === 0;
  const xT = goingRight ? t : 1 - t;

  const xPercent = X_START + xT * (X_END - X_START);
  const textEl = textRef.current;
  const textBottomVh = textEl
    ? ((textEl.getBoundingClientRect().bottom) / window.innerHeight) * 100
    : 80;
  const yPercent = Y_START + effectiveProgress * (textBottomVh - Y_START);

  const frame = Math.floor(scrollY / 20) % FRAME_COUNT;

  return (
    <div className="about-page" ref={pageRef}>
      {/* Navigation */}
      <nav className="about-nav">
        {NAV_ITEMS.map(({ label, path }) => (
          <Link key={path} to={path} className="about-nav__link">
            {label}
          </Link>
        ))}
      </nav>

      {/* Controls panel */}
      <div className="about-controls">
        <button
          className="about-controls__toggle"
          onClick={() => setAnimationHidden(h => !h)}
        >
          {animationHidden ? 'Show Animation' : 'Remove Animation'}
        </button>

        {SLIDER_CONFIG.map(({ key, label, min, max, step }) => (
          <label key={key} className="about-controls__slider">
            <span className="about-controls__label">{label}</span>
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={settings[key]}
              onChange={e => updateSetting(key, parseFloat(e.target.value))}
            />
            <span className="about-controls__value">{settings[key]}</span>
          </label>
        ))}
      </div>

      {/* Running figure / explosion */}
      {!animationHidden && <div className="about-runner">
        {!hasExploded ? (
          <img
            src={FRAMES[frame]}
            alt=""
            className="about-runner-sprite"
            style={{
              left: `${xPercent}%`,
              top: `${yPercent}%`,
              transform: `translate(-50%, -50%)${goingRight ? '' : ' scaleX(-1)'}`,
            }}
          />
        ) : (
          particles.map((p, i) => {
            const rawTick = explodeT * settings.ticks;
            const currentTick = Math.floor(rawTick);
            const fractional = rawTick - currentTick;
            const { x, y, angle } = getParticlePosition(
              p, currentTick, fractional,
              settings.explodeSpread, settings.ticks, settings.dirChangeRate,
            );
            const px = xPercent + x;
            const py = yPercent + y;
            const particleFrame = (p.startFrame + Math.floor(animTime / (p.frameSpeed * 16))) % FRAME_COUNT;
            const facingRight = Math.cos(angle) > 0;
            const flip = facingRight ? '' : ' scaleX(-1)';
            return (
              <img
                key={i}
                src={FRAMES[particleFrame]}
                alt=""
                className="about-runner-sprite"
                style={{
                  left: `${px}%`,
                  top: `${py}%`,
                  transform: `translate(-50%, -50%)${flip}`,
                }}
              />
            );
          })
        )}

        {runnerProgress >= 1 && (
          <button
            className="about-pause-btn"
            onClick={togglePause}
            aria-label={paused ? 'Play animation' : 'Pause animation'}
          >
            {paused ? '\u25B6' : '\u275A\u275A'}
          </button>
        )}
      </div>}

      {/* Main Content */}
      <main className="about-content">
        <div className="about-text-section" ref={textRef}>
          <h1 className="about-title">About Me</h1>

          <div className="about-bio">
            <p>
              My name is Jack O'Keefe, a software engineer on GitHub's Copilot team, focused on integrating MCP servers and GitHub's native skills into Copilot. I work at the application layer of AI, but my interests sit closer to fundamental research. I was part of the winning team for SemEval Task 6: Hallucination Detection in LLMs at NAACL 2024 and explored synthetic data generation for the ARC challenge during my master's project at Northwestern.
            </p>

            <p>
              Current areas of focus include Bayesian priors for language models, reinforcement learning, and emerging intersections between AI, biological design, and computational creativity. My work in technology is shaped by a broader interest in how ideas develop across disciplines, and how they translate into systems that affect everyday life.
            </p>

            <p>
              Writing is the most direct way I know to think. It requires almost no technology and forces ideas into a shape you can see. I write on Substack about themes like alienation in modern life, placelessness, and the texture of the mundane. I'm interested in how technology, economics, and governance shape the lived experience of modernity.
            </p>

            <p>
              Philosophy came through reading rather than formal study, but it has been a steady companion to my technical work and writing. Recent interests include Plato, Kant, Hegel, Bergson, Heidegger, Arendt, and Deleuze.
            </p>

            <p>
              Outside of research and writing, I surf. I grew up on the Southern California coast and still travel for waves when I can. Other interests include volleyball, skiing and snowboarding, yoga, and finding restaurants, cafes, and art installations in new cities.
            </p>
          </div>
        </div>

        {/* Scroll room for zigzag phase */}
        <div className="about-spacer" />
      </main>
    </div>
  );
}
