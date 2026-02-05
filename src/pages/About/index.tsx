import { Link } from 'react-router-dom';
import './About.css';

const NAV_ITEMS = [
  { label: 'Jack', path: '/' },
  { label: 'Writing', path: '/writing' },
  { label: 'Projects', path: '/projects' },
  { label: 'Research', path: '/research' },
  { label: 'About', path: '/about' },
];

export default function About() {
  return (
    <div className="about-page">
      {/* Navigation */}
      <nav className="about-nav">
        {NAV_ITEMS.map(({ label, path }) => (
          <Link key={path} to={path} className="about-nav__link">
            {label}
          </Link>
        ))}
      </nav>

      {/* Main Content - Three columns */}
      <main className="about-content">
        {/* Left Image - bleeding off left */}
        <div className="about-image-left">
          <img
            src="/about_me.png"
            alt="About Me"
            className="about-image"
          />
        </div>

        {/* Text Section - Middle */}
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

        {/* Right Image - bleeding off right */}
        <div className="about-image-right">
          <img
            src="/about_me2.png"
            alt="About Me 2"
            className="about-image"
          />
        </div>
      </main>
    </div>
  );
}
