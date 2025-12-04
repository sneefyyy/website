/** @paper-design/shaders-react@0.0.67 */
import { Dithering } from '@paper-design/shaders-react';
import ColumnNavigation from '../../components/navigation/ColumnNavigation';

export default function About() {
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
          colorFront="#F8A396"
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
          {/* About Me Section */}
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
            marginBottom: '48px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}>
            <h1 style={{
              color: '#FFFFFF',
              fontSize: '84px',
              margin: '0 0 48px 0',
              fontWeight: '700',
              letterSpacing: '-0.03em',
              lineHeight: '1.05',
              textShadow: '0 2px 20px rgba(0, 0, 0, 0.2)'
            }}>
              About Me
            </h1>

            <div style={{
              color: 'rgba(255, 255, 255, 0.95)',
              fontSize: '32px',
              lineHeight: '1.7',
              letterSpacing: '-0.01em'
            }}>
              <p style={{ margin: '0 0 36px 0' }}>
                My name is Jack O’Keefe, a software engineer on GitHub’s Copilot team, focused on integrating MCP servers and GitHub’s native skills into Copilot.
                I work at the application layer of AI, but my interests sit closer to fundamental research. 
                I was part of the winning team for SemEval Task 6: Hallucination Detection in LLMs at NAACL 2024 and explored synthetic data generation for the ARC challenge during my master’s project at Northwestern. 
                Current areas of focus include Bayesian priors for language models, reinforcement learning, and emerging intersections between AI, biological design, and computational creativity. 
                My work in technology is shaped by a broader interest in how ideas develop across disciplines, and how they translate into systems that affect everyday life.
              </p>

              <p style={{ margin: '0 0 36px 0' }}>
                Writing is the most direct way I know to think. It requires almost no technology and forces ideas into a shape you can see. 
                Socrates worried writing would weaken memory, though the argument survives only because someone wrote it down. 
                I write on Substack about themes like alienation in modern life, placelessness, and the texture of the mundane. 
                I’m interested in how technology, economics, and governance shape the lived experience of modernity, and I plan to write more about industrial policy, geopolitics, and comparisons between systems like the United States and China.
              </p>

              <p style={{ margin: '0 0 36px 0' }}>
                Philosophy came through reading rather than formal study, but it has been a steady companion to my technical work and writing. 
                I’m working through the German Idealists, slowly, sometimes repeatedly.
                Recent interests include Plato, Kant, Hegel, Bergson, Heidegger, Arendt, and Deleuze. 
                I’m looking to join or start a reading group focused on these ideas, so anyone interested is welcome to reach out.
              </p>

              <p style={{ margin: '0 0 36px 0' }}>
                Outside of research and writing, I surf. 
                I grew up on the Southern California coast and still travel for waves when I can. 
                I’m a decent surfer, though the old line holds that the best surfer is the one having the most fun. 
                Other interests include volleyball, skiing and snowboarding, and yoga. 
                I enjoy finding restaurants, cafes, and art installations in new cities. 
                Consumption can become an identity, but the time spent on these experiences feels meaningful enough to share.
              </p>
            </div>
          </div>

          {/* Contact Section */}
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
            padding: '72px 64px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}>
            {/* Header Section */}
            <div style={{ marginBottom: '56px' }}>
              <h2 style={{
                color: '#FFFFFF',
                fontSize: '84px',
                margin: '0 0 24px 0',
                fontWeight: '700',
                letterSpacing: '-0.03em',
                lineHeight: '1.05',
                textShadow: '0 2px 20px rgba(0, 0, 0, 0.2)'
              }}>
                Get in Touch
              </h2>
              <p style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '32px',
                margin: 0,
                fontWeight: '400',
                letterSpacing: '-0.01em',
                lineHeight: '1.6'
              }}>
                Let's connect and create something amazing
              </p>
            </div>

            {/* Contact Links */}
            <div style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
            {[
              {
                icon: '✉️',
                label: 'Email',
                value: 'jackokeefe0711@gmail.com',
                href: 'mailto:jackokeefe0711@gmail.com',
                color: '#00FF7D'
              },
              {
                icon: '✍️',
                label: 'Substack',
                value: '@jackokeefe',
                href: 'https://substack.com/@jackokeefe',
                color: '#57CCFF'
              },
              {
                icon: '💻',
                label: 'GitHub',
                value: '@sneefyyy',
                href: 'https://github.com/sneefyyy',
                color: '#4ED9A4'
              },
              {
                icon: '📷',
                label: 'Instagram',
                value: '@jackmokeefe_',
                href: 'https://instagram.com/jackmokeefe_',
                color: '#FF0072'
              },
              {
                icon: '𝕏',
                label: 'Twitter',
                value: '@jackmokeefe1',
                href: 'https://twitter.com/jackmokeefe1',
                color: '#17BDD7'
              },
              {
                icon: '💼',
                label: 'LinkedIn',
                value: '@jackokeefeoc',
                href: 'https://linkedin.com/in/jackokeefeoc',
                color: '#00FF7D'
              }
            ].map((contact, index) => (
              <a
                key={index}
                href={contact.href}
                target={contact.href.startsWith('mailto:') ? undefined : '_blank'}
                rel={contact.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                style={{
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  padding: '24px 28px',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
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
                {/* Icon Circle */}
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  backgroundColor: `${contact.color}25`,
                  border: `1px solid ${contact.color}50`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  flexShrink: 0,
                  boxShadow: `0 4px 12px ${contact.color}15`
                }}>
                  {contact.icon}
                </div>

                {/* Text Content */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  flex: 1
                }}>
                  <span style={{
                    fontSize: '15px',
                    fontWeight: '700',
                    color: 'rgba(255, 255, 255, 0.65)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em'
                  }}>
                    {contact.label}
                  </span>
                  <span style={{
                    fontSize: '32px',
                    fontWeight: '500',
                    color: '#FFFFFF',
                    letterSpacing: '-0.01em',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                  }}>
                    {contact.value}
                  </span>
                </div>

                {/* Arrow Icon */}
                <div
                  data-arrow
                  style={{
                    fontSize: '26px',
                    color: 'rgba(255, 255, 255, 0.5)',
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    fontWeight: '300'
                  }}
                >
                  →
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
