import { useState } from 'react';
import { Link } from 'react-router-dom';
import './ColumnNavigation.css';

type NavItem = {
  label: string;
  path: string;
};

const DEFAULT_ITEMS: NavItem[] = [
  { label: "Jack", path: '/' },
  { label: 'WRITING', path: '/writing' },
  { label: 'PROJECTS', path: '/projects' },
  { label: 'RESEARCH', path: '/research' },
  { label: 'ABOUT', path: '/about' },
];

type ColumnNavigationProps = {
  items?: NavItem[];
};

export default function ColumnNavigation({ items = DEFAULT_ITEMS }: ColumnNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <nav className="column-nav" aria-label="Column navigation">
        <button
          className="column-nav__hamburger"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
        >
          <span className={isOpen ? 'open' : ''}></span>
          <span className={isOpen ? 'open' : ''}></span>
          <span className={isOpen ? 'open' : ''}></span>
        </button>

        <div className={`column-nav__links ${isOpen ? 'open' : ''}`}>
          {items.map(({ label, path }) => (
            <Link key={path} to={path} className="column-nav__link" onClick={closeMenu}>
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
