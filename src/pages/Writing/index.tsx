import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './Writing.css';

const NAV_ITEMS = [
  { label: 'Jack', path: '/' },
  { label: 'Writing', path: '/writing' },
  { label: 'Projects', path: '/projects' },
  { label: 'Research', path: '/research' },
  { label: 'About', path: '/about' },
];

const ESSAYS = [
  {
    title: 'The Assault of Togetherness',
    date: 'January 2025',
    href: 'https://substack.com/home/post/p-173526439',
  },
  {
    title: 'Globular',
    date: 'November 2024',
    href: 'https://substack.com/home/post/p-152186859',
  },
  {
    title: 'Under the Bottle Cap',
    date: 'October 2025',
    href: 'https://substack.com/home/post/p-175838013',
  },
  {
    title: 'The Operator',
    date: 'September 2025',
    href: 'https://substack.com/home/post/p-173526516',
  },
  {
    title: 'The Peacock',
    date: 'September 2025',
    href: 'https://substack.com/home/post/p-173526439',
  },
];

const WAVE_AMPLITUDE = 100;
const WAVE_CYCLES = 3; // full cycles across the viewport
const SVG_H = 400;
const CENTER_Y = SVG_H / 2;
const TITLE_ABOVE = 24;
const DATE_BELOW = 20;
const ITEM_ARC_SPACING = 500; // arc-length spacing between essay centers
const SCROLL_SPEED = 1.2; // arc-length units per px of scroll

function buildSinePath(viewW: number, amplitude: number, cycles: number, centerY: number, yShift: number, steps = 800) {
  const parts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * viewW;
    const y = centerY + yShift + Math.sin((x / viewW) * Math.PI * 2 * cycles) * amplitude;
    parts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return parts.join(' ');
}

function totalArcLength(viewW: number, amplitude: number, cycles: number, steps = 800) {
  let length = 0;
  for (let i = 1; i <= steps; i++) {
    const prevX = ((i - 1) / steps) * viewW;
    const currX = (i / steps) * viewW;
    const prevY = Math.sin((prevX / viewW) * Math.PI * 2 * cycles) * amplitude;
    const currY = Math.sin((currX / viewW) * Math.PI * 2 * cycles) * amplitude;
    const dx = currX - prevX;
    const dy = currY - prevY;
    length += Math.sqrt(dx * dx + dy * dy);
  }
  return length;
}

export default function Writing() {
  const [scrollY, setScrollY] = useState(0);
  const [viewW, setViewW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const pageRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const el = pageRef.current;
    if (el) setScrollY(el.scrollTop);
  }, []);

  const handleResize = useCallback(() => setViewW(window.innerWidth), []);

  useEffect(() => {
    const el = pageRef.current;
    if (el) el.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    return () => {
      if (el) el.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [handleScroll, handleResize]);

  // Build paths that span exactly the viewport width
  const wavePath = useMemo(() => buildSinePath(viewW, WAVE_AMPLITUDE, WAVE_CYCLES, CENTER_Y, 0), [viewW]);
  const titlePath = useMemo(() => buildSinePath(viewW, WAVE_AMPLITUDE, WAVE_CYCLES, CENTER_Y, -TITLE_ABOVE), [viewW]);
  const datePath = useMemo(() => buildSinePath(viewW, WAVE_AMPLITUDE, WAVE_CYCLES, CENTER_Y, DATE_BELOW), [viewW]);

  // Total arc length of the wave path across the viewport
  const waveArcLen = useMemo(() => totalArcLength(viewW, WAVE_AMPLITUDE, WAVE_CYCLES), [viewW]);

  // Scroll shifts the startOffset of each textPath
  const scrollArcOffset = scrollY * SCROLL_SPEED;

  // Each essay has a "home" arc-length position. They start off to the right
  // (beyond the path end) and scroll left into view.
  const firstEssayArc = waveArcLen * 0.4; // first essay starts at 40% of the wave

  // Dot: position on the wave for the midpoint between essays
  // We need to find x,y on the wave given an arc length — approximate it
  const arcToXY = useCallback((targetArc: number) => {
    const steps = 800;
    let cumLen = 0;
    let prevX = 0;
    let prevY = CENTER_Y + Math.sin(0) * WAVE_AMPLITUDE;
    for (let i = 1; i <= steps; i++) {
      const x = (i / steps) * viewW;
      const y = CENTER_Y + Math.sin((x / viewW) * Math.PI * 2 * WAVE_CYCLES) * WAVE_AMPLITUDE;
      const dx = x - prevX;
      const dy = y - prevY;
      cumLen += Math.sqrt(dx * dx + dy * dy);
      if (cumLen >= targetArc) {
        return { x, y };
      }
      prevX = x;
      prevY = y;
    }
    return { x: viewW, y: CENTER_Y };
  }, [viewW]);

  // Total scroll distance: enough to move all essays through
  const lastEssayArc = firstEssayArc + (ESSAYS.length - 1) * ITEM_ARC_SPACING;
  const totalArcTravel = lastEssayArc + waveArcLen;
  const totalScrollPx = totalArcTravel / SCROLL_SPEED;

  return (
    <div className="writing-page" ref={pageRef}>
      <div style={{ height: `${totalScrollPx + window.innerHeight}px` }}>
        <nav className="writing-nav">
          {NAV_ITEMS.map(({ label, path }) => (
            <Link key={path} to={path} className="writing-nav__link">
              {label}
            </Link>
          ))}
        </nav>

        <div className="writing-fixed">
          <svg
            className="writing-svg"
            viewBox={`0 0 ${viewW} ${SVG_H}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <path id="wave-path" d={wavePath} />
              <path id="title-path" d={titlePath} />
              <path id="date-path" d={datePath} />
            </defs>

            {/* Static sine wave line */}
            <use href="#wave-path" fill="none" stroke="#000" strokeWidth="1.5" />

            {/* Essay titles — startOffset decreases as you scroll */}
            {ESSAYS.map((essay, i) => {
              const homeArc = firstEssayArc + i * ITEM_ARC_SPACING;
              const offset = homeArc - scrollArcOffset;
              return (
                <a key={`t-${i}`} href={essay.href} target="_blank" rel="noopener noreferrer">
                  <text className="writing-svg-title">
                    <textPath
                      href="#title-path"
                      startOffset={offset}
                      textAnchor="middle"
                    >
                      {essay.title}
                    </textPath>
                  </text>
                </a>
              );
            })}

            {/* Essay dates */}
            {ESSAYS.map((essay, i) => {
              const homeArc = firstEssayArc + i * ITEM_ARC_SPACING;
              const offset = homeArc - scrollArcOffset;
              return (
                <a key={`d-${i}`} href={essay.href} target="_blank" rel="noopener noreferrer">
                  <text className="writing-svg-date">
                    <textPath
                      href="#date-path"
                      startOffset={offset}
                      textAnchor="middle"
                    >
                      {essay.date}
                    </textPath>
                  </text>
                </a>
              );
            })}

            {/* Dots between essays */}
            {ESSAYS.map((_, i) => {
              if (i >= ESSAYS.length - 1) return null;
              const midArc = firstEssayArc + (i + 0.5) * ITEM_ARC_SPACING;
              const dotArc = midArc - scrollArcOffset;
              // Only render if dot is roughly on screen
              if (dotArc < -50 || dotArc > waveArcLen + 50) return null;
              const { x, y } = arcToXY(dotArc);
              return <circle key={`dot-${i}`} cx={x} cy={y} r="3" fill="#000" />;
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
