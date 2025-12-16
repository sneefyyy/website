import React, { lazy, Suspense } from 'react';
import arrowIcon from '../../images/arrow.svg';
import './Home.css';

const PaperBackground = lazy(() => import('../../components/background/PaperBackground'));

const Home: React.FC = () => {
  const handleArrowClick = () => {
    const nextSection = document.querySelector('.experiment-container');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Suspense fallback={<div style={{ backgroundColor: '#000c38', height: '100vh', width: '100vw' }} />}>
      <section className="home-container">
        <PaperBackground />
        <div className="arrow-container">
          <img
            src={arrowIcon}
            alt="Go down"
            onClick={handleArrowClick}
            className="bounce-arrow"
          />
        </div>
      </section>
    </Suspense>
  );
};

export default Home;
