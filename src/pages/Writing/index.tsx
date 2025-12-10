/** @paper-design/shaders-react@0.0.67 */
import { Dithering } from '@paper-design/shaders-react';
import ColumnNavigation from '../../components/navigation/ColumnNavigation';

const Writing: React.FC = () => {
  const writingCategories = [
    {
      title: 'Non-Fiction',
      icon: '',
      color: '#FFFFFF',
      pieces: [
        // {
        //   title: 'Silicon Shamanism',
        //   description: 'How Silicon Valley turned tools into theology, and why the next Renaissance will belong to the heretics who remember how to think.',
        //   date: 'October 2025',
        //   href: 'https://substack.com/home/post/p-177335357'
        // },
        {
          title: 'The Assault of Togetherness',
          description: '',
          date: 'January 2025',
          href: 'https://substack.com/home/post/p-173526439'
        },
        {
          title: 'Globular',
          description: '',
          date: 'November 2024',
          href: 'https://substack.com/home/post/p-152186859'
        }
      ]
    },
    {
      title: 'Fiction',
      icon: '',
      color: '#FFFFFF',
      pieces: [
        {
          title: 'Coming soon',
          description: 'A short story about...',
          date: '',
          href: ''
        }
      ]
    },
    {
      title: 'Poetry',
      icon: '',
      color: '#FFFFFF',
      pieces: [
        {
          title: 'Under the Bottle Cap',
          description: '',
          date: 'October 2025',
          href: 'https://substack.com/home/post/p-175838013'
        },
        {
          title: 'The Operator',
          description: '',
          date: 'September 2025',
          href: 'https://substack.com/home/post/p-173526516'
        },
        {
          title: 'The Peacock',
          description: '',
          date: 'September 2025',
          href: 'https://substack.com/home/post/p-173526439'
        }
      ]
    }
  ];

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
          colorFront="#57CCFF"
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

        {/* Content Container - Three Separate Columns */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '32px',
          width: '100%',
          minHeight: '100vh',
          padding: '168px 40px 60px 40px',
          alignItems: 'start'
        }}>
          {writingCategories.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                borderColor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '32px',
                borderStyle: 'solid',
                borderWidth: '1.5px',
                boxSizing: 'border-box',
                backdropFilter: 'blur(20px) saturate(120%)',
                WebkitBackdropFilter: 'blur(20px) saturate(120%)',
                padding: '60px 48px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Category Header */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '40px',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '56px' }}>{category.icon}</span>
                <h2 style={{
                  color: category.color,
                  fontSize: '52px',
                  margin: 0,
                  fontWeight: '700',
                  letterSpacing: '-0.02em'
                }}>
                  {category.title}
                </h2>
              </div>

                  {/* Pieces List */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                  }}>
                    {category.pieces.map((piece, pieceIndex) => (
                      <a
                        key={pieceIndex}
                        href={piece.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: '#FFFFFF',
                          textDecoration: 'none',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                          padding: '28px 32px',
                          backgroundColor: 'rgba(0, 0, 0, 0.3)',
                          borderRadius: '18px',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          cursor: 'pointer',
                          position: 'relative',
                          overflow: 'hidden',
                          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                          e.currentTarget.style.borderColor = `${category.color}80`;
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
                        {/* Title and Arrow Container */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          gap: '20px'
                        }}>
                          <h3 style={{
                            fontSize: '34px',
                            fontWeight: '600',
                            color: '#FFFFFF',
                            margin: 0,
                            lineHeight: '1.3',
                            letterSpacing: '-0.01em',
                            flex: 1
                          }}>
                            {piece.title}
                          </h3>

                          {/* Arrow Icon */}
                          <div
                            data-arrow
                            style={{
                              fontSize: '30px',
                              color: 'rgba(255, 255, 255, 0.5)',
                              transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              fontWeight: '300',
                              flexShrink: 0,
                              marginTop: '2px'
                            }}
                          >
                            →
                          </div>
                        </div>

                        {/* Description */}
                        <div style={{
                          fontSize: '22px',
                          color: 'rgba(255, 255, 255, 0.75)',
                          lineHeight: '1.5'
                        }}>
                          {piece.description}
                        </div>

                        {/* Date */}
                        <div style={{
                          fontSize: '18px',
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontStyle: 'italic'
                        }}>
                          {piece.date}
                        </div>
                      </a>
                    ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Writing;
