/** @paper-design/shaders-react@0.0.67 */
import { Dithering } from '@paper-design/shaders-react';
import ColumnNavigation from '../../components/navigation/ColumnNavigation';

const Projects: React.FC = () => {
  return (
    <>
      <ColumnNavigation />

      <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'auto' }}>
        {/* Dithering Background */}
        <Dithering
          speed={0.2}
          shape="warp"
          type="4x4"
          size={5.1}
          scale={1}
          colorBack="#00000000"
          colorFront="#4ED9A4"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            backgroundColor: '#301C2A',
            backgroundRepeat: 'no-repeat',
            height: '100vh',
            width: '100vw',
            zIndex: 0
          }}
        />

        <main className="page-content">
          <h1>Projects</h1>
          <p>This is the projects page.</p>
        </main>
      </div>
    </>
  );
};

export default Projects;