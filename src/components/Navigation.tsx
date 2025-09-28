import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

const Navigation: React.FC = () => {
  return (
    <nav className="navigation">
      <ul>
        <li><Link to="/about">ABOUT</Link></li>
        <li><Link to="/writing">WRITING</Link></li>
        <li><Link to="/visual">VISUAL</Link></li>
        <li><Link to="/research">RESEARCH</Link></li>
      </ul>
    </nav>
  );
};

export default Navigation;