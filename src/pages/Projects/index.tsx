import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Projects.css';

const NAV_ITEMS = [
  { label: 'Jack', path: '/' },
  { label: 'Writing', path: '/writing' },
  { label: 'Projects', path: '/projects' },
  { label: 'Research', path: '/research' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

const PROJECTS = [
  {
    title: 'The Synesthesia Machine',
    subtitle: 'An interactive poetry experience that maps words to colors and sounds',
    image: '/noise.png',
    href: '/latent-space',
  },
  {
    title: 'The Synesthesia Machine II',
    subtitle: 'An interactive poetry experience that maps words to colors and sounds',
    image: '/noise.png',
    href: '/latent-space',
  },
  {
    title: 'The Synesthesia Machine III',
    subtitle: 'An interactive poetry experience that maps words to colors and sounds',
    image: '/noise.png',
    href: '/latent-space',
  },
  {
    title: 'The Synesthesia Machine IV',
    subtitle: 'An interactive poetry experience that maps words to colors and sounds',
    image: '/noise.png',
    href: '/latent-space',
  },
];

const PEEK_OFFSET = 30; // px offset for each card behind
const SCALE_STEP = 0.04; // scale reduction per level back

export default function Projects() {
  const [current, setCurrent] = useState(0);

  const goTo = useCallback((index: number) => {
    setCurrent(Math.max(0, Math.min(index, PROJECTS.length - 1)));
  }, []);

  useEffect(() => {
    let cooldown = false;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (cooldown) return;

      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < 15) return;

      cooldown = true;
      setTimeout(() => { cooldown = false; }, 600);

      if (delta > 0) {
        setCurrent(prev => Math.min(prev + 1, PROJECTS.length - 1));
      } else {
        setCurrent(prev => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        goTo(current + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        goTo(current - 1);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [current, goTo]);

  return (
    <div className="projects-page">
      <nav className="projects-nav">
        {NAV_ITEMS.map(({ label, path }) => (
          <Link key={path} to={path} className="projects-nav__link">
            {label}
          </Link>
        ))}
      </nav>

      <div className="projects-stack">
        {PROJECTS.map((project, i) => {
          const diff = i - current;
          const absDiff = Math.abs(diff);

          // Cards behind: stacked with slight offset and scale down
          // Cards that have been passed: slide off to the left
          let translateX = 0;
          let scale = 1;
          let zIndex = PROJECTS.length - absDiff;
          let opacity = 1;

          if (diff < 0) {
            // Already passed — off to the left
            translateX = diff * 110; // percentage-based, in vw via style
            scale = 1;
            opacity = 0;
          } else if (diff === 0) {
            // Current card — front and center
            translateX = 0;
            scale = 1;
            opacity = 1;
          } else {
            // Upcoming cards — stacked behind, peeking right
            translateX = diff * PEEK_OFFSET;
            scale = 1 - diff * SCALE_STEP;
            opacity = Math.max(1 - diff * 0.25, 0.15);
          }

          return (
            <a
              key={i}
              className={`projects-card ${diff === 0 ? 'projects-card--active' : ''}`}
              href={project.href}
              style={{
                transform: `translateX(${translateX}px) scale(${scale})`,
                zIndex,
                opacity,
              }}
            >
              <div className="projects-card__image-wrap">
                <img
                  src={project.image}
                  alt={project.title}
                  className="projects-card__image"
                />
              </div>
              <div className="projects-card__title">{project.title}</div>
              <div className="projects-card__subtitle">{project.subtitle}</div>
            </a>
          );
        })}
      </div>

      {PROJECTS.length > 1 && (
        <div className="projects-dots">
          {PROJECTS.map((_, i) => (
            <div
              key={i}
              className={`projects-dot ${i === current ? 'projects-dot--active' : ''}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
