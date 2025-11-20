import React from 'react';
import ColumnNavigation from '../../components/navigation/ColumnNavigation';

const About: React.FC = () => {
  return (
    <>
      <ColumnNavigation />
      <main className="page-content">
        <h1>About</h1>
        <p>This is the about page.</p>
      </main>
    </>
  );
};

export default About;
