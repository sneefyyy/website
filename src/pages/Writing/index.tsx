import React from 'react';
import ColumnNavigation from '../../components/navigation/ColumnNavigation';

const Writing: React.FC = () => {
  return (
    <>
      <ColumnNavigation />
      <main className="page-content">
        <h1>Writing</h1>
        <p>This is the writing page.</p>
      </main>
    </>
  );
};

export default Writing;
