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
const FRAMES = Array.from({ length: FRAME_COUNT }, (_, i) => `/about_me/${i + 1}.png`);

// ---- EDIT THESE ----
const ZIGZAGS = 11;            // number of left-right passes before reaching bottom (odd = ends right)
const X_START = 15;            // left edge padding (%)
const X_END = 85;              // right edge padding (%)
const Y_START = 18;            // top starting position (%)
const Y_END = 82;              // bottom ending position (%) — mirrors Y_START from bottom
const EXPLODE_AT = 0.18;       // scroll progress (0-1) where the figure explodes
const EXPLODE_COUNT = 1000;      // number of figures after explosion
const EXPLODE_SPREAD = 120;    // how far (in vh/vw %) the figures spread
const DIRECTION_CHANGE_RATE = 0.03; // probability increment per tick of changing direction
const TICKS = 40;              // number of direction-change checkpoints during explosion
const EXPLODE_DURATION = 1500; // milliseconds for full explosion animation
// ---------------------

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

function generateParticles(): Particle[] {
  return Array.from({ length: EXPLODE_COUNT }, () => ({
    seed: Math.floor(Math.random() * 2147483647),
    speed: 0.4 + Math.random() * 0.6,
    startAngle: Math.random() * Math.PI * 2,
    startFrame: Math.floor(Math.random() * FRAME_COUNT),
    frameSpeed: 10 + Math.random() * 30,
  }));
}

// Walk the particle tick-by-tick, accumulating position. Returns {x, y, angle}.
function getParticlePosition(p: Particle, currentTick: number, fractional: number) {
  const rng = mulberry32(p.seed);
  let angle = p.startAngle;
  let prob = 0;
  let x = 0;
  let y = 0;
  const stepSize = EXPLODE_SPREAD / TICKS;

  for (let tick = 1; tick <= currentTick; tick++) {
    // Move in current direction for this tick
    x += Math.cos(angle) * p.speed * stepSize;
    y += Math.sin(angle) * p.speed * stepSize;

    // Maybe change direction for next tick
    prob += DIRECTION_CHANGE_RATE;
    const roll = rng();
    if (roll < prob) {
      angle = rng() * Math.PI * 2;
      prob = 0;
    }
  }

  // Add fractional movement within the current tick
  x += Math.cos(angle) * p.speed * stepSize * fractional;
  y += Math.sin(angle) * p.speed * stepSize * fractional;

  return { x, y, angle };
}

export default function About() {
  const [particles, setParticles] = useState(generateParticles);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [animTime, setAnimTime] = useState(0); // continuous time in ms
  const [paused, setPaused] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const lastFrameRef = useRef<number | null>(null);

  const hasExploded = scrollProgress >= EXPLODE_AT && !paused;

  // Preload images + scroll handler
  useEffect(() => {
    FRAMES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    const handleScroll = () => {
      const el = pageRef.current;
      if (!el) return;

      const currentScroll = el.scrollTop;
      const maxScroll = el.scrollHeight - el.clientHeight;
      const progress = maxScroll > 0 ? Math.min(currentScroll / maxScroll, 1) : 0;

      setScrollProgress(progress);
      setScrollY(currentScroll);
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
        // Pausing — stop animation, regenerate particles for next time
      } else {
        // Resuming — reset animation time and generate fresh particles
        setAnimTime(0);
        setParticles(generateParticles());
      }
      return !prev;
    });
  }, []);

  // explodeT loops continuously: time wraps around EXPLODE_DURATION
  const explodeT = (animTime % EXPLODE_DURATION) / EXPLODE_DURATION;

  // Map scroll progress to zigzag position
  // When paused (single runner mode), use full scroll range; otherwise cap at EXPLODE_AT
  const effectiveProgress = paused ? scrollProgress : Math.min(scrollProgress, EXPLODE_AT) / EXPLODE_AT;
  const totalT = effectiveProgress * ZIGZAGS;
  const zigzagIndex = Math.min(Math.floor(totalT), ZIGZAGS - 1);
  const t = totalT - zigzagIndex;

  // Even zigzags go right, odd go left
  const goingRight = zigzagIndex % 2 === 0;
  const xT = goingRight ? t : 1 - t;

  // Position of main figure (or explosion origin)
  const xPercent = X_START + xT * (X_END - X_START);
  const yPercent = Y_START + effectiveProgress * (Y_END - Y_START);

  // Frame for the single runner
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

      {/* Running figure / explosion */}
      <div className="about-runner">
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
            const rawTick = explodeT * TICKS;
            const currentTick = Math.floor(rawTick);
            const fractional = rawTick - currentTick;
            const { x, y, angle } = getParticlePosition(p, currentTick, fractional);
            const px = xPercent + x;
            const py = yPercent + y;
            const elapsed = animTime % EXPLODE_DURATION;
            const particleFrame = (p.startFrame + Math.floor(elapsed / (p.frameSpeed * 16))) % FRAME_COUNT;
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

        {scrollProgress >= EXPLODE_AT && (
          <button
            className="about-pause-btn"
            onClick={togglePause}
            aria-label={paused ? 'Play animation' : 'Pause animation'}
          >
            {paused ? '\u25B6' : '\u275A\u275A'}
          </button>
        )}
      </div>

      {/* Main Content */}
      <main className="about-content">
        <div className="about-text-section">
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
