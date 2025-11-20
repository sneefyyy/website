import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import About from './pages/About';
import Writing from './pages/Writing';
import Visual from './pages/Visual';
import Research from './pages/Research';
import Contact from './pages/Contact';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/writing" element={<Writing />} />
        <Route path="/visual" element={<Visual />} />
        <Route path="/research" element={<Research />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}

export default App;
