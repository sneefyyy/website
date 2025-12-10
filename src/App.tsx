import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import About from './pages/About';
import Writing from './pages/Writing';
import Research from './pages/Research';
import Projects from './pages/Projects';
import Transition from './pages/Transition';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/transition" element={<Transition />} />
        <Route path="/writing" element={<Writing />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/research" element={<Research />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

export default App;
