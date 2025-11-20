import React from 'react';
import ColumnNavigation from '../../components/navigation/ColumnNavigation';

const Visual: React.FC = () => {
  return (
    <>
      <ColumnNavigation />
      <main className="page-content">
        <h1>Visual</h1>
        <p>This is the visual page.</p>
      </main>
    </>
  );
};

export default Visual;
