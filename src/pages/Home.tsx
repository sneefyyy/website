import React from 'react';
import PaperBackground from '../components/PaperBackground';

const Home: React.FC = () => {
  return (
    <div className="page home-page">
      <PaperBackground />
      <div className="home-content">
        <h1>Welcome</h1>
        {/* Add your home content here */}
      </div>
    </div>
  );
};

export default Home;