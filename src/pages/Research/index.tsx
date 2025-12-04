/** @paper-design/shaders-react@0.0.67 */
import { Dithering } from '@paper-design/shaders-react';
import ColumnNavigation from '../../components/navigation/ColumnNavigation';

const Research: React.FC = () => {
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
          colorFront="#B5C955"
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

        {/* Content Container */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          minHeight: '100vh',
          padding: '168px 40px 60px 40px'
        }}>
          {/* Research Papers Section */}
          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            borderColor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '32px',
            borderStyle: 'solid',
            borderWidth: '1.5px',
            boxSizing: 'border-box',
            maxWidth: '1500px',
            width: '84%',
            backdropFilter: 'blur(20px) saturate(120%)',
            WebkitBackdropFilter: 'blur(20px) saturate(120%)',
            padding: '80px 72px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}>
            {/* Header */}
            <h1 style={{
              color: '#FFFFFF',
              fontSize: '84px',
              margin: '0 0 56px 0',
              fontWeight: '700',
              letterSpacing: '-0.03em',
              lineHeight: '1.05',
              textShadow: '0 2px 20px rgba(0, 0, 0, 0.2)'
            }}>
              Research
            </h1>

            {/* Papers List */}
            <div style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              {[
                {
                  title: 'SemEval Task 6: Hallucination Detection in LLMs',
                  authors: 'Your Name, Co-Author 1, Co-Author 2',
                  venue: 'NAACL 2024',
                  year: '2024',
                  href: 'https://example.com/paper1',
                  status: '🏆 Winning Team'
                },
                {
                  title: 'Synthetic Data Generation for the ARC Challenge',
                  authors: 'Your Name',
                  venue: "Master's Thesis, Northwestern University",
                  year: '2024',
                  href: 'https://example.com/paper2',
                  status: ''
                }
              ].map((paper, index) => (
                <a
                  key={index}
                  href={paper.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#FFFFFF',
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    padding: '32px 36px',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(181, 201, 85, 0.5)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.4)';
                    const arrow = e.currentTarget.querySelector('[data-arrow]') as HTMLElement;
                    if (arrow) arrow.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.3)';
                    const arrow = e.currentTarget.querySelector('[data-arrow]') as HTMLElement;
                    if (arrow) arrow.style.transform = 'translateX(0)';
                  }}
                >
                  {/* Status Badge */}
                  {paper.status && (
                    <div style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: '#B5C955',
                      marginBottom: '4px'
                    }}>
                      {paper.status}
                    </div>
                  )}

                  {/* Title and Arrow Container */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '20px'
                  }}>
                    <h2 style={{
                      fontSize: '38px',
                      fontWeight: '600',
                      color: '#FFFFFF',
                      margin: 0,
                      lineHeight: '1.3',
                      letterSpacing: '-0.01em',
                      flex: 1
                    }}>
                      {paper.title}
                    </h2>

                    {/* Arrow Icon */}
                    <div
                      data-arrow
                      style={{
                        fontSize: '32px',
                        color: 'rgba(255, 255, 255, 0.5)',
                        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        fontWeight: '300',
                        flexShrink: 0,
                        marginTop: '4px'
                      }}
                    >
                      →
                    </div>
                  </div>

                  {/* Authors */}
                  <div style={{
                    fontSize: '24px',
                    color: 'rgba(255, 255, 255, 0.75)',
                    lineHeight: '1.5'
                  }}>
                    {paper.authors}
                  </div>

                  {/* Venue and Year */}
                  <div style={{
                    fontSize: '22px',
                    color: 'rgba(255, 255, 255, 0.65)',
                    fontStyle: 'italic'
                  }}>
                    {paper.venue} • {paper.year}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Research;
