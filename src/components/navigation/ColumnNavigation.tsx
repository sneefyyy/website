import React from 'react';
import { Link } from 'react-router-dom';
import './ColumnNavigation.css';

type NavItem = {
  label: string;
  path: string;
};

const DEFAULT_ITEMS: NavItem[] = [
  { label: 'ABOUT', path: '/about' },
  { label: 'WRITING', path: '/writing' },
  { label: 'VISUAL', path: '/visual' },
  { label: 'RESEARCH', path: '/research' },
  { label: 'CONTACT', path: '/contact' }
];

type ColumnNavigationProps = {
  items?: NavItem[];
};

export default function ColumnNavigation({ items = DEFAULT_ITEMS }: ColumnNavigationProps) {
  return (
    <nav className="column-nav" aria-label="Column navigation">
      {items.map(({ label, path }) => (
        <Link key={path} to={path} className="column-nav__link">
          {label}
        </Link>
      ))}
    </nav>
  );
}
