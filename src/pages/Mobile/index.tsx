import { lazy, Suspense } from 'react';
import arrowIcon from '../../images/arrow.svg';
import './Mobile.css';

const PaperBackground = lazy(() => import('../../components/background/PaperBackground'));

const WRITING_CATEGORIES = [
  {
    label: 'Musings',
    pieces: [
      { title: 'The Assault of Togetherness', date: 'January 2025', href: 'https://substack.com/home/post/p-173526439' },
      { title: 'Globular', date: 'November 2024', href: 'https://substack.com/home/post/p-152186859' },
    ],
  },
  {
    label: 'Stories',
    pieces: [] as { title: string; date: string; href: string }[],
  },
  {
    label: 'Poetry',
    pieces: [
      { title: 'Under the Bottle Cap', date: 'October 2025', href: 'https://substack.com/home/post/p-175838013' },
      { title: 'The Operator', date: 'September 2025', href: 'https://substack.com/home/post/p-173526516' },
      { title: 'The Peacock', date: 'September 2025', href: 'https://substack.com/home/post/p-173526439' },
    ],
  },
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

const RESEARCH_PAPERS = [
  {
    title: 'Halu-nlp at SemEval-2024 Task 6: MetaCheckGPT — A Multi-task Hallucination Detection Using LLM Uncertainty and Meta-models',
    status: 'PUBLISHED',
    year: '2024',
    authors: "Rahul Mehta, Andrew Hoblitzell, Jack O'Keefe, Hyeju Jang, Vasudeva Varma",
    venue: 'SemEval-2024 @ NAACL',
    href: 'https://aclanthology.org/2024.semeval-1.52/',
  },
  {
    title: 'MetaCheckGPT — A Multi-task Hallucination Detector Using LLM Uncertainty and Meta-models',
    status: 'PREPRINT',
    year: '2024',
    authors: "Rahul Mehta, Andrew Hoblitzell, Jack O'Keefe, Hyeju Jang, Vasudeva Varma",
    venue: 'arXiv preprint',
    href: 'https://arxiv.org/abs/2404.06948',
  },
  {
    title: 'A Multidimensional Approach to Ethical AI Auditing',
    status: 'PUBLISHED',
    year: '2025',
    authors: "Sónia Teixeira, Atia Cortés, Dilhan Thilakarathne, Gianmarco Gori, Marco Minici, Monowar Bhuyan, Nina Khairova, Tosin Adewumi, Devvjiit Bhuyan, Jack O'Keefe, Carmela Comito, João Gama, Virginia Dignum",
    venue: 'AAAI/ACM Conference on AI, Ethics, and Society',
    href: 'https://ojs.aaai.org/index.php/AIES/article/view/36732',
  },
  {
    title: 'A Domain Specific Language Approach to Solving Grid Type Problems with Large Language Models',
    status: 'COMPLETED',
    year: '2025',
    authors: "Jack O'Keefe",
    venue: "Master's Project, Northwestern University",
    href: '/A_Domain_Specific_Language_Approach_to_Solving_Puzzle_Type_Problems_with_Large_Language_Models.pdf',
  },
];

const CONTACT_LINKS = [
  { label: 'Email', href: 'mailto:jackokeefe0711@gmail.com' },
  { label: 'Instagram', href: 'https://instagram.com/jack.m.okeefe' },
  { label: 'Twitter', href: 'https://twitter.com/jackmokeefe1' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/jackokeefeoc' },
];

export default function MobilePage() {
  const handleArrowClick = () => {
    document.getElementById('mobile-content')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="mobile-page">
      {/* Hero */}
      <section className="mobile-hero">
        <Suspense fallback={<div className="mobile-hero-fallback" />}>
          <PaperBackground />
        </Suspense>
        <div className="mobile-arrow-container" onClick={handleArrowClick}>
          <img src={arrowIcon} alt="Scroll down" className="mobile-bounce-arrow" />
        </div>
      </section>

      {/* All sections */}
      <div id="mobile-content" className="mobile-content">

        {/* Writing */}
        <section className="mobile-section">
          <h2 className="mobile-section-title">Writing</h2>
          {WRITING_CATEGORIES.filter(c => c.pieces.length > 0).map((cat) => (
            <div key={cat.label} className="mobile-writing-category">
              <div className="mobile-category-label">{cat.label}</div>
              {cat.pieces.map((piece) => (
                <a
                  key={piece.title}
                  href={piece.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mobile-list-item"
                >
                  <span className="mobile-item-title">{piece.title}</span>
                  <span className="mobile-item-meta">{piece.date}</span>
                </a>
              ))}
            </div>
          ))}
        </section>

        {/* Projects */}
        <section className="mobile-section">
          <h2 className="mobile-section-title">Projects</h2>
          {PROJECTS.map((project) => (
            <a key={project.title} href={project.href} className="mobile-project-item">
              <img src={project.image} alt={project.title} className="mobile-project-image" />
              <div className="mobile-project-title">{project.title}</div>
              <div className="mobile-project-subtitle">{project.subtitle}</div>
            </a>
          ))}
        </section>

        {/* Research */}
        <section className="mobile-section">
          <h2 className="mobile-section-title">Research</h2>
          {RESEARCH_PAPERS.map((paper) => (
            <a
              key={paper.title}
              href={paper.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-list-item mobile-list-item--stack"
            >
              <span className="mobile-item-title">{paper.title}</span>
              <span className="mobile-item-meta">{paper.venue} · {paper.year}</span>
            </a>
          ))}
        </section>

        {/* About */}
        <section className="mobile-section">
          <h2 className="mobile-section-title">About</h2>
          <div className="mobile-bio">
            <p>
              My name is Jack O'Keefe, a software engineer on GitHub's Copilot team, focused on
              integrating MCP servers and GitHub's native skills into Copilot. I work at the
              application layer of AI, but my interests sit closer to fundamental research. I was
              part of the winning team for SemEval Task 6: Hallucination Detection in LLMs at
              NAACL 2024 and explored synthetic data generation for the ARC challenge during my
              master's project at Northwestern.
            </p>
            <p>
              Current areas of focus include Bayesian priors for language models, reinforcement
              learning, and emerging intersections between AI, biological design, and computational
              creativity. My work in technology is shaped by a broader interest in how ideas develop
              across disciplines, and how they translate into systems that affect everyday life.
            </p>
            <p>
              Writing is the most direct way I know to think. It requires almost no technology and
              forces ideas into a shape you can see. I write on Substack about themes like alienation
              in modern life, placelessness, and the texture of the mundane. I'm interested in how
              technology, economics, and governance shape the lived experience of modernity.
            </p>
            <p>
              Philosophy came through reading rather than formal study, but it has been a steady
              companion to my technical work and writing. Recent interests include Plato, Kant,
              Hegel, Bergson, Heidegger, Arendt, and Deleuze.
            </p>
            <p>
              Outside of research and writing, I surf. I grew up on the Southern California coast
              and still travel for waves when I can. Other interests include volleyball, skiing and
              snowboarding, yoga, and finding restaurants, cafes, and art installations in new cities.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="mobile-section">
          <h2 className="mobile-section-title">Contact</h2>
          {CONTACT_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('mailto') ? '_self' : '_blank'}
              rel="noopener noreferrer"
              className="mobile-contact-link"
            >
              {link.label}
            </a>
          ))}
        </section>

      </div>
    </div>
  );
}