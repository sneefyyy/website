import React, { lazy, Suspense } from 'react';

const PaperBackground = lazy(() => import('../../components/background/PaperBackground'));

const Home: React.FC = () => {
  return (
    <Suspense fallback={<div style={{ backgroundColor: '#000c38', height: '100vh', width: '100vw' }} />}>
      <PaperBackground />
    </Suspense>
  );
};

export default Home;
