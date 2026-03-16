import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './Writing.css';

const NAV_ITEMS = [
  { label: 'Jack', path: '/' },
  { label: 'Writing', path: '/writing' },
  { label: 'Projects', path: '/projects' },
  { label: 'Research', path: '/research' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

type Category = {
  label: string;
  stroke: string;
  textClass: string;
  dateClass: string;
  centerY: number;
  pieces: { title: string; date: string; href: string }[];
};

const CATEGORIES: Category[] = [
  {
    label: 'Musings',
    stroke: '#000',
    textClass: 'writing-svg-title writing-svg-title--musings',
    dateClass: 'writing-svg-date writing-svg-date--musings',
    centerY: 150,
    pieces: [
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
    ],
  },
  {
    label: 'Stories',
    stroke: '#000',
    textClass: 'writing-svg-title writing-svg-title--stories',
    dateClass: 'writing-svg-date writing-svg-date--stories',
    centerY: 400,
    pieces: [],
  },
  {
    label: 'Poetry',
    stroke: '#000',
    textClass: 'writing-svg-title writing-svg-title--poetry',
    dateClass: 'writing-svg-date writing-svg-date--poetry',
    centerY: 650,
    pieces: [
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
    ],
  },
];

const WAVE_AMPLITUDE = 60;
const WAVE_CYCLES = 3;
const TITLE_ABOVE = 14;
const DATE_BELOW = 12;
const ITEM_ARC_SPACING = 500;
const SCROLL_SPEED = 1.2;
const SVG_H = 850;
const LABEL_X = 40;

function buildSinePath(viewW: number, amplitude: number, cycles: number, centerY: number, yShift: number, steps = 800) {
  const parts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * viewW;
    const y = centerY + yShift + Math.sin((x / viewW) * Math.PI * 2 * cycles) * amplitude;
    parts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return parts.join(' ');
}

function computeArcLength(viewW: number, amplitude: number, cycles: number, steps = 800) {
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

function arcToXY(targetArc: number, viewW: number, amplitude: number, cycles: number, centerY: number, steps = 800) {
  let cumLen = 0;
  let prevX = 0;
  let prevY = centerY;
  for (let i = 1; i <= steps; i++) {
    const x = (i / steps) * viewW;
    const y = centerY + Math.sin((x / viewW) * Math.PI * 2 * cycles) * amplitude;
    const dx = x - prevX;
    const dy = y - prevY;
    cumLen += Math.sqrt(dx * dx + dy * dy);
    if (cumLen >= targetArc) return { x, y };
    prevX = x;
    prevY = y;
  }
  return { x: viewW, y: centerY };
}

// Determine which category zone the mouse Y falls in (in SVG coords)
function getHoveredCategory(mouseClientY: number, svgEl: SVGSVGElement | null): number | null {
  if (!svgEl) return null;
  const rect = svgEl.getBoundingClientRect();
  // Convert client Y to SVG coordinate Y
  const svgY = ((mouseClientY - rect.top) / rect.height) * SVG_H;

  // Each category owns a vertical band around its centerY
  const HALF_BAND = 125; // half the vertical space each wave owns
  for (let i = 0; i < CATEGORIES.length; i++) {
    if (Math.abs(svgY - CATEGORIES[i].centerY) < HALF_BAND) return i;
  }
  return null;
}

export default function Writing() {
  const [viewW, setViewW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [hoveredCat, setHoveredCat] = useState<number | null>(null);
  // Per-category scroll offsets (only the hovered one accumulates scroll)
  const [catOffsets, setCatOffsets] = useState<number[]>(CATEGORIES.map(() => 0));
  const pageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const lastScrollRef = useRef(0);

  const handleScroll = useCallback(() => {
    const el = pageRef.current;
    if (!el) return;
    const currentScroll = el.scrollTop;
    const delta = currentScroll - lastScrollRef.current;
    lastScrollRef.current = currentScroll;

    // Only advance the hovered category's offset
    setCatOffsets(prev => {
      const next = [...prev];
      if (hoveredCat !== null) {
        next[hoveredCat] += delta * SCROLL_SPEED;
      }
      return next;
    });
  }, [hoveredCat]);

  const handleResize = useCallback(() => setViewW(window.innerWidth), []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const cat = getHoveredCategory(e.clientY, svgRef.current);
    setHoveredCat(cat);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredCat(null);
  }, []);

  useEffect(() => {
    const el = pageRef.current;
    if (el) el.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      if (el) el.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleScroll, handleResize, handleMouseMove, handleMouseLeave]);

  const waveArcLen = useMemo(() => computeArcLength(viewW, WAVE_AMPLITUDE, WAVE_CYCLES), [viewW]);

  const firstArc = waveArcLen * 0.4;

  // Scroll height — enough for the longest category
  const maxPieces = Math.max(...CATEGORIES.map(c => c.pieces.length));
  const lastArc = firstArc + (maxPieces - 1) * ITEM_ARC_SPACING;
  const totalArcTravel = lastArc + waveArcLen;
  const totalScrollPx = totalArcTravel / SCROLL_SPEED;

  const categoryPaths = useMemo(() => {
    return CATEGORIES.map((cat, ci) => ({
      wave: buildSinePath(viewW, WAVE_AMPLITUDE, WAVE_CYCLES, cat.centerY, 0),
      title: buildSinePath(viewW, WAVE_AMPLITUDE, WAVE_CYCLES, cat.centerY, -TITLE_ABOVE),
      date: buildSinePath(viewW, WAVE_AMPLITUDE, WAVE_CYCLES, cat.centerY, DATE_BELOW),
      waveId: `wave-${ci}`,
      titleId: `title-${ci}`,
      dateId: `date-${ci}`,
    }));
  }, [viewW]);

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
            ref={svgRef}
            className="writing-svg"
            viewBox={`0 0 ${viewW} ${SVG_H}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {categoryPaths.map((cp) => (
                <g key={cp.waveId}>
                  <path id={cp.waveId} d={cp.wave} />
                  <path id={cp.titleId} d={cp.title} />
                  <path id={cp.dateId} d={cp.date} />
                </g>
              ))}
            </defs>

            {CATEGORIES.map((cat, ci) => {
              const cp = categoryPaths[ci];
              const scrollArcOffset = catOffsets[ci];

              return (
                <g key={ci}>
                  {/* Static sine wave line */}
                  <use href={`#${cp.waveId}`} fill="none" stroke={cat.stroke} strokeWidth="1.5" />

                  {/* Category label */}
                  <text
                    x={LABEL_X}
                    y={cat.centerY - WAVE_AMPLITUDE + 14}
                    className="writing-svg-label"
                  >
                    {cat.label}
                  </text>

                  {/* Titles */}
                  {cat.pieces.map((piece, pi) => {
                    const homeArc = firstArc + pi * ITEM_ARC_SPACING;
                    const offset = homeArc - scrollArcOffset;
                    return (
                      <a key={`t-${ci}-${pi}`} href={piece.href} target="_blank" rel="noopener noreferrer">
                        <text className={cat.textClass}>
                          <textPath
                            href={`#${cp.titleId}`}
                            startOffset={offset}
                            textAnchor="middle"
                          >
                            {piece.title}
                          </textPath>
                        </text>
                      </a>
                    );
                  })}

                  {/* Dates */}
                  {cat.pieces.map((piece, pi) => {
                    const homeArc = firstArc + pi * ITEM_ARC_SPACING;
                    const offset = homeArc - scrollArcOffset;
                    return (
                      <a key={`d-${ci}-${pi}`} href={piece.href} target="_blank" rel="noopener noreferrer">
                        <text className={cat.dateClass}>
                          <textPath
                            href={`#${cp.dateId}`}
                            startOffset={offset}
                            textAnchor="middle"
                          >
                            {piece.date}
                          </textPath>
                        </text>
                      </a>
                    );
                  })}

                  {/* Dots */}
                  {cat.pieces.map((_, pi) => {
                    if (pi >= cat.pieces.length - 1) return null;
                    const midArc = firstArc + (pi + 0.5) * ITEM_ARC_SPACING;
                    const dotArc = midArc - scrollArcOffset;
                    if (dotArc < -50 || dotArc > waveArcLen + 50) return null;
                    const { x, y } = arcToXY(dotArc, viewW, WAVE_AMPLITUDE, WAVE_CYCLES, cat.centerY);
                    return <circle key={`dot-${ci}-${pi}`} cx={x} cy={y} r="3" fill="#000" />;
                  })}
                </g>
              );
            })}
          </svg>
        </div>

        <div className="writing-hint">Hover a line, then scroll</div>
      </div>
    </div>
  );
}
