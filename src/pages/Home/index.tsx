import React, { lazy, Suspense, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import arrowIcon from '../../images/arrow.svg';
import Transition from '../Transition';
import './Home.css';

const PaperBackground = lazy(() => import('../../components/background/PaperBackground'));

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);
  const [showTransition, setShowTransition] = useState(false);

  const handleArrowClick = () => {
    setShowTransition(true);
    setIsAnimating(true);
    setTimeout(() => {
      navigate('/transition');
    }, 1000);
  };

  return (
    <>
      {showTransition && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0 }}>
          <Transition />
        </div>
      )}
      <Suspense fallback={<div style={{ backgroundColor: '#000c38', height: '100vh', width: '100vw' }} />}>
        <div className={`home-container ${isAnimating ? 'slide-up' : ''}`}>
          <PaperBackground />
          <div style={{
            position: 'fixed',
            bottom: '0px',
            left: '50%',
            transform: 'translateX(-50%)',
            cursor: 'pointer',
            zIndex: 1000,
          }}>
            <img
              src={arrowIcon}
              alt="Go to writing page"
              onClick={handleArrowClick}
              className="bounce-arrow"
              style={{
                width: '200px',
                height: '200px',
                transform: 'rotate(90deg)',
                objectFit: 'fill',
              }}
            />
          </div>
        </div>
      </Suspense>
    </>
  );
};

export default Home;
