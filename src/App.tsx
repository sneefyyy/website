import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import About from './pages/About';
import Writing from './pages/Writing';
import Visual from './pages/Visual';
import Research from './pages/Research';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="App">
      <Navigation />
      {isHome ? (
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      ) : (
        <main className="main-content">
          <Routes>
            <Route path="/about" element={<About />} />
            <Route path="/writing" element={<Writing />} />
            <Route path="/visual" element={<Visual />} />
            <Route path="/research" element={<Research />} />
          </Routes>
        </main>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
