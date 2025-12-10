import React from 'react';
import { Link } from 'react-router-dom';
import './ColumnNavigation.css';

type NavItem = {
  label: string;
  path: string;
};

const DEFAULT_ITEMS: NavItem[] = [
  { label: 'Jack', path: '/' },
  { label: 'WRITING', path: '/writing' },
  { label: 'PROJECTS', path: '/projects' },
  { label: 'RESEARCH', path: '/research' },
  { label: 'ABOUT', path: '/about' },
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
