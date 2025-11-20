import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

const links = [
  { to: '/about', label: 'about' },
  { to: '/writing', label: 'writing' },
  { to: '/visual', label: 'visual' },
  { to: '/research', label: 'research' }
];

const Navigation: React.FC = () => {
  return (
    <nav className="navigation" aria-label="Primary">
      <ul className="navigation__list">
        {links.map((link) => (
          <li key={link.to} className="navigation__item">
            <Link className="navigation__link" to={link.to}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
