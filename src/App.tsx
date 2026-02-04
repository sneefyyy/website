import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Experiment from './pages/Experiment';
import Writing from './pages/Writing';
import Projects from './pages/Projects';
import About from './pages/About';
import Contact from './pages/Contact';
import Research from './pages/Research';
import Scrollable from './pages/Scrollable';

const MainPage = () => {
  return (
    <main>
      <Home />
      <Experiment />
    </main>
  );
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/writing" element={<Writing />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/research" element={<Research />} />
      <Route path="/scrollable" element={<Scrollable />} />
    </Routes>
  );
};

export default App;
