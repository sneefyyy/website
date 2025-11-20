import React from 'react';
import ColumnNavigation from '../../components/navigation/ColumnNavigation';

const Research: React.FC = () => {
  return (
    <>
      <ColumnNavigation />
      <main className="page-content">
        <h1>Research</h1>
        <p>This is the research page.</p>
      </main>
    </>
  );
};

export default Research;
