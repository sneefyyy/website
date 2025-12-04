/** @paper-design/shaders-react@0.0.67 */
import { Warp } from '@paper-design/shaders-react';
import ColumnNavigation from '../../components/navigation/ColumnNavigation';

/**
 * Code exported from Paper
 * on Dec 3, 2025 at 8:45 PM.
 */
export default function () {
  return (
    <>
      <ColumnNavigation />

      <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
        {/* Warp Background */}
        <Warp
        speed={0.4}
        scale={1.89}
        softness={0.49}
        proportion={0.7}
        swirl={0.59}
        swirlIterations={11}
        shape="checks"
        distortion={0}
        shapeScale={0.25}
        frame={1363350.8600003605}
        colors={['#00FF7D', '#17BDD7', '#FF0072']}
        style={{ position: 'fixed', top: 0, left: 0, height: '100vh', opacity: '100%', width: '100vw', zIndex: 0 }}
      />

      {/* Content Container */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        padding: '20px'
      }}>
        {/* Glassmorphic Box */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          backgroundRepeat: 'no-repeat',
          borderColor: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '32px',
          borderStyle: 'solid',
          borderWidth: '1.5px',
          boxSizing: 'border-box',
          maxWidth: '800px',
          width: '100%',
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          padding: '80px 72px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.25)'
        }}>
          {/* Header Section */}
          <div style={{ marginBottom: '56px', textAlign: 'center' }}>
            <h1 style={{
              color: '#FFFFFF',
              fontSize: '64px',
              margin: '0 0 20px 0',
              fontWeight: '700',
              letterSpacing: '-0.03em',
              lineHeight: '1.1',
              textShadow: '0 2px 20px rgba(0, 0, 0, 0.2)'
            }}>
              Get in Touch
            </h1>
            <p style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '19px',
              margin: 0,
              fontWeight: '400',
              letterSpacing: '-0.01em',
              lineHeight: '1.5'
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
                value: 'jackokeefeoc',
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
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.18)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.35)';
                  e.currentTarget.style.transform = 'translateX(4px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)';
                  const arrow = e.currentTarget.querySelector('[data-arrow]') as HTMLElement;
                  if (arrow) arrow.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
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
                  gap: '4px',
                  flex: 1
                }}>
                  <span style={{
                    fontSize: '13px',
                    fontWeight: '700',
                    color: 'rgba(255, 255, 255, 0.65)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em'
                  }}>
                    {contact.label}
                  </span>
                  <span style={{
                    fontSize: '20px',
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
                    fontSize: '22px',
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
