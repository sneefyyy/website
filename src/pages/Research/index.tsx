import { useState, useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Research.css';

const NAV_ITEMS = [
  { label: 'Jack', path: '/' },
  { label: 'Writing', path: '/writing' },
  { label: 'Projects', path: '/projects' },
  { label: 'Research', path: '/research' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

const RESEARCH_PAPERS = [
  {
    title: 'Halu-nlp at SemEval-2024 Task 6: MetaCheckGPT - A Multi-task Hallucination Detection Using LLM Uncertainty and Meta-models',
    subtitle: 'Multi-task Hallucination Detection System',
    description: 'Advanced system for detecting hallucinations in large language models using uncertainty quantification and meta-learning approaches. Winner of SemEval-2024 Task 6.',
    status: 'PUBLISHED',
    year: '2024',
    authors: 'Rahul Mehta, Andrew Hoblitzell, Jack O\'Keefe, Hyeju Jang, Vasudeva Varma',
    venue: 'SemEval-2024 @ NAACL',
    href: 'https://aclanthology.org/2024.semeval-1.52/',
    type: 'conference'
  },
  {
    title: 'MetaCheckGPT - A Multi-task Hallucination Detector Using LLM Uncertainty and Meta-models',
    subtitle: 'Extended Preprint Analysis',
    description: 'Extended analysis and methodology for multi-task hallucination detection using large language model uncertainty measures and ensemble meta-learning approaches.',
    status: 'PREPRINT',
    year: '2024',
    authors: 'Rahul Mehta, Andrew Hoblitzell, Jack O\'Keefe, Hyeju Jang, Vasudeva Varma',
    venue: 'arXiv preprint',
    href: 'https://arxiv.org/abs/2404.06948',
    type: 'preprint'
  },
  {
    title: 'A Multidimensional Approach to Ethical AI Auditing',
    subtitle: 'Framework for AI Ethics Assessment',
    description: 'Comprehensive framework for auditing AI systems across multiple ethical dimensions, addressing bias, fairness, and transparency in machine learning applications.',
    status: 'PUBLISHED',
    year: '2025',
    authors: 'Sónia Teixeira, Atia Cortés, Dilhan Thilakarathne, Gianmarco Gori, Marco Minici, Monowar Bhuyan, Nina Khairova, Tosin Adewumi, Devvjiit Bhuyan, Jack O\'Keefe, Carmela Comito, João Gama, Virginia Dignum',
    venue: 'AAAI/ACM Conference on AI, Ethics, and Society',
    href: 'https://ojs.aaai.org/index.php/AIES/article/view/36732',
    type: 'conference'
  },
  {
    title: 'A Domain Specific Language Approach to Solving Grid Type Problems with Large Language Models',
    subtitle: 'DSL-Based Puzzle Solving with LLMs',
    description: 'Novel approach to solving ARC-style grid puzzles using domain-specific languages and large language models. Explores synthetic data generation for combinatorial reasoning.',
    status: 'COMPLETED',
    year: '2025',
    authors: 'Jack O\'Keefe',
    venue: 'Master\'s Project, Northwestern University',
    href: '/A_Domain_Specific_Language_Approach_to_Solving_Puzzle_Type_Problems_with_Large_Language_Models.pdf',
    type: 'thesis'
  }
];

// Colors from the floating menu in Experiment page
const MENU_COLORS = [
  '#2fe8f5', // writing (cyan-blue) - main terminal color
  '#4ED9A4', // projects (green)
  '#e03470', // about (pink)
  '#ffa500', // contact (orange)
  '#9b59b6'  // research (purple)
];

// Glitch characters for matrix effect
const GLITCH_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?~`';

const useTypewriter = (text: string, delay: number = 50) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayText('');
    setIsComplete(false);
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, delay);

    return () => clearInterval(timer);
  }, [text, delay]);

  return { displayText, isComplete };
};

const GlitchText = ({ text, isActive }: { text: string; isActive: boolean }) => {
  const [glitchedText, setGlitchedText] = useState(text);

  useEffect(() => {
    if (!isActive) return;

    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.1) {
        const chars = text.split('');
        const randomIndex = Math.floor(Math.random() * chars.length);
        const randomChar = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        chars[randomIndex] = randomChar;
        setGlitchedText(chars.join(''));
        
        setTimeout(() => setGlitchedText(text), 100);
      }
    }, 200);

    return () => clearInterval(glitchInterval);
  }, [text, isActive]);

  return <span>{glitchedText}</span>;
};

const TerminalWindow = ({ paper, index, isVisible, shouldCompile, onCompileComplete }: {
  paper: typeof RESEARCH_PAPERS[0];
  index: number;
  isVisible: boolean;
  shouldCompile: boolean;
  onCompileComplete: () => void;
}) => {
  const [isCompiling, setIsCompiling] = useState(shouldCompile);
  const [showContent, setShowContent] = useState(!shouldCompile);
  const [compilationStep, setCompilationStep] = useState(0);
  const windowRef = useRef<HTMLDivElement>(null);

  const compilationSteps = [
    '> Initializing neural research pathways...',
    '> Loading academic database connections...',
    '> Compiling citation networks...',
    '> Establishing peer review protocols...',
    '> Research compilation complete.',
    ''
  ];

  const { displayText: compilingText } = useTypewriter(
    compilationSteps[compilationStep] || '', 
    30
  );

  // Only compile on initial load or when shouldCompile is true
  useEffect(() => {
    if (shouldCompile) {
      setIsCompiling(true);
      setShowContent(false);
      setCompilationStep(0);
    } else {
      setIsCompiling(false);
      setShowContent(true);
    }
  }, [shouldCompile]);

  useEffect(() => {
    if (!isVisible || !isCompiling || !shouldCompile) return;

    const timeout = setTimeout(() => {
      if (compilationStep < compilationSteps.length - 1) {
        setCompilationStep(prev => prev + 1);
      } else {
        setIsCompiling(false);
        setShowContent(true);
        onCompileComplete();
      }
    }, compilationStep === 0 ? 800 : 600);

    return () => clearTimeout(timeout);
  }, [compilationStep, isVisible, onCompileComplete, compilationSteps.length, isCompiling, shouldCompile]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return MENU_COLORS[1]; // green
      case 'PREPRINT': return MENU_COLORS[3]; // orange
      case 'COMPLETED': return MENU_COLORS[2]; // pink
      default: return '#ffffff';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'conference': return MENU_COLORS[4]; // purple
      case 'thesis': return MENU_COLORS[2]; // pink
      case 'preprint': return MENU_COLORS[3]; // orange
      default: return MENU_COLORS[1]; // green
    }
  };

  // Get alternating color for each line
  const getLineColor = (lineIndex: number) => {
    return MENU_COLORS[lineIndex % MENU_COLORS.length];
  };

  return (
    <div
      ref={windowRef}
      className={`research-terminal-window ${isVisible ? 'visible' : ''}`}
      style={{
        zIndex: 100,
      }}
    >
      {/* CRT scan lines overlay */}
      <div className="research-crt-scanlines" />
      
      {/* Terminal header */}
      <div className="research-terminal-header">
        <div className="research-terminal-buttons">
          <div className="research-terminal-button research-terminal-button--close" />
          <div className="research-terminal-button research-terminal-button--minimize" />
          <div className="research-terminal-button research-terminal-button--maximize" />
        </div>
        <div className="research-terminal-title">
          <GlitchText text={`RESEARCH_NET_${index + 1}.exe`} isActive={showContent} />
        </div>
      </div>

      {/* Terminal content */}
      <div className="research-terminal-content">
        {isCompiling ? (
          <div className="research-compilation-output">
            <div className="research-matrix-rain" />
            {compilationSteps.slice(0, compilationStep + 1).map((step, i) => (
              <div 
                key={i} 
                className="research-compile-line"
                style={{ color: getLineColor(i) }}
              >
                {i === compilationStep ? (
                  <span className="research-typewriter">{compilingText}</span>
                ) : (
                  step
                )}
                {i === compilationStep && <span className="research-cursor">█</span>}
              </div>
            ))}
          </div>
        ) : (
          showContent && (
            <a
              href={paper.href}
              target="_blank"
              rel="noopener noreferrer"
              className="research-paper-content"
            >
              <div className="research-paper-header">
                <div 
                  className="research-paper-status" 
                  style={{ color: getStatusColor(paper.status) }}
                >
                  [{paper.status}] {paper.year}
                </div>
                <div 
                  className="research-paper-type"
                  style={{ color: getTypeColor(paper.type) }}
                >
                  TYPE: {paper.type.toUpperCase()}
                </div>
              </div>
              
              <h3 className="research-paper-title">
                <GlitchText text={paper.title} isActive={true} />
              </h3>
              
              <div 
                className="research-paper-subtitle"
                style={{ color: MENU_COLORS[1] }}
              >
                {paper.subtitle}
              </div>
              
              <div 
                className="research-paper-description"
                style={{ color: MENU_COLORS[0] }}
              >
                {paper.description}
              </div>
              
              <div className="research-paper-authors">
                <span 
                  className="research-authors-label"
                  style={{ color: MENU_COLORS[4] }}
                >
                  AUTHORS:
                </span>
                <span 
                  className="research-authors-text"
                  style={{ color: MENU_COLORS[2] }}
                >
                  {paper.authors}
                </span>
              </div>

              <div className="research-paper-venue">
                <span 
                  className="research-venue-label"
                  style={{ color: MENU_COLORS[3] }}
                >
                  VENUE:
                </span>
                <span 
                  className="research-venue-text"
                  style={{ color: MENU_COLORS[1] }}
                >
                  {paper.venue}
                </span>
              </div>
              
              <div className="research-access-prompt">
                <span 
                  className="research-prompt"
                  style={{ color: MENU_COLORS[0] }}
                >
                  {'>'}
                </span>
                <span 
                  className="research-access-text"
                  style={{ color: '#ffffff' }}
                >
                  ACCESS_RESEARCH.pdf
                </span>
                <span 
                  className="research-cursor"
                  style={{ color: MENU_COLORS[0] }}
                >
                  █
                </span>
              </div>
            </a>
          )
        )}
      </div>
    </div>
  );
};

const Research: React.FC = () => {
  const [currentPaper, setCurrentPaper] = useState(0);
  const [hasInitiallyCompiled, setHasInitiallyCompiled] = useState(false);

  const goToPaper = useCallback((index: number) => {
    setCurrentPaper(Math.max(0, Math.min(index, RESEARCH_PAPERS.length - 1)));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'arrowright':
        case 'd':
          e.preventDefault();
          goToPaper(currentPaper + 1);
          break;
        case 'arrowleft':
        case 'a':
          e.preventDefault();
          goToPaper(currentPaper - 1);
          break;
        case 'arrowdown':
        case 's':
          e.preventDefault();
          goToPaper(currentPaper + 1);
          break;
        case 'arrowup':
        case 'w':
          e.preventDefault();
          goToPaper(currentPaper - 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentPaper, goToPaper]);

  // Mouse wheel navigation
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
        goToPaper(currentPaper + 1);
      } else {
        goToPaper(currentPaper - 1);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [currentPaper, goToPaper]);

  const handleInitialCompileComplete = useCallback(() => {
    setHasInitiallyCompiled(true);
  }, []);

  return (
    <div className="research-page matrix-research-theme">
      {/* Matrix background effect */}
      <div className="research-matrix-bg" />
      <div className="research-noise-overlay" />
      
      <nav className="research-nav">
        {NAV_ITEMS.map(({ label, path }) => (
          <Link key={path} to={path} className="research-nav__link matrix-research-nav">
            <GlitchText text={label} isActive={false} />
          </Link>
        ))}
      </nav>

      <div className="research-terminal-container">
        <div className="research-boot-sequence">
          <div className="research-boot-text">
            SNEEF_RESEARCH_INTERFACE_v7.11.02
            <br />
            Loading academic database...
            <br />
            <span style={{ color: MENU_COLORS[currentPaper % MENU_COLORS.length] }}>
              Paper {currentPaper + 1}/{RESEARCH_PAPERS.length}: {RESEARCH_PAPERS[currentPaper].title.substring(0, 30)}...
            </span>
          </div>
        </div>

        <TerminalWindow
          key={`terminal-window-${currentPaper}`}
          paper={RESEARCH_PAPERS[currentPaper]}
          index={currentPaper}
          isVisible={true}
          shouldCompile={!hasInitiallyCompiled}
          onCompileComplete={handleInitialCompileComplete}
        />

        {/* Navigation indicators */}
        <div className="research-navigation-hints">
          <div className="research-nav-hint">
            <span style={{ color: MENU_COLORS[0] }}>← →</span> or 
            <span style={{ color: MENU_COLORS[1] }}> WASD</span> to navigate
          </div>
          <div className="research-nav-hint">
            <span style={{ color: MENU_COLORS[2] }}>Mouse Wheel</span> to scroll papers
          </div>
        </div>

        {/* Paper dots indicator */}
        {RESEARCH_PAPERS.length > 1 && (
          <div className="research-dots">
            {RESEARCH_PAPERS.map((_, i) => (
              <div
                key={i}
                className={`research-dot ${i === currentPaper ? 'research-dot--active' : ''}`}
                onClick={() => goToPaper(i)}
                style={{
                  backgroundColor: i === currentPaper 
                    ? MENU_COLORS[i % MENU_COLORS.length]
                    : 'rgba(47, 232, 245, 0.3)',
                  boxShadow: i === currentPaper 
                    ? `0 0 10px ${MENU_COLORS[i % MENU_COLORS.length]}`
                    : 'none'
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* System status */}
      <div className="research-system-status">
        <div className="research-status-line">
          ACTIVE_PAPER: {currentPaper + 1}/{RESEARCH_PAPERS.length}
        </div>
        <div className="research-status-line">
          RESEARCH_PATHWAYS: {hasInitiallyCompiled ? 'ACTIVE' : 'INITIALIZING'}
        </div>
        <div className="research-status-line" style={{ color: MENU_COLORS[currentPaper % MENU_COLORS.length] }}>
          STATUS: {RESEARCH_PAPERS[currentPaper].status}
        </div>
      </div>
    </div>
  );
};
export default Research;
