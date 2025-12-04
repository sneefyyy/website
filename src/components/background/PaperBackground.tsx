/** @paper-design/shaders-react@0.0.54 */
import { ImageDithering, LiquidMetal } from '@paper-design/shaders-react';
import { useState } from 'react';
import ColumnNavigation from '../navigation/ColumnNavigation';
import sideprofile from '../../sideprofile.jpg';
import open from '../../open.png';
import cactus from '../../cactus.jpg';
import tongue from '../../tongue.png';
import blueBoy from '../../blue-boy.jpg';

/**
 * Code exported from Paper
 * https://app.paper.design/file/01K5JCWVTFFY21WWTDBCEC6MVF?node=01K63FWR3T80WHW77VWTQPC4SC
 * on Sep 26, 2025 at 10:12 AM.
 * Modified to be full screen responsive.
 */
export default function GeneratedComponent() {
  const [hoveredIndex, setHoveredIndex] = useState(-1);

  return (
    <>
      <ColumnNavigation />

      <div style={{ 
        boxSizing: 'border-box', 
        contain: 'layout', 
        height: '100vh', 
        overflowWrap: 'break-word', 
        transformOrigin: '0% 0%', 
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0
      }}>

        {/*first image */}
        <div 
          onMouseEnter={() => setHoveredIndex(0)} 
          onMouseLeave={() => setHoveredIndex(-1)}
          style={{ backgroundColor: '#000c38', height: '100vh', left: '0vw', position: 'fixed', top: '0', transform: 'translate(0px, 0px)', width: '20vw' }}
        >
          <ImageDithering colorBack="#00000000" colorFront="#E39EF8" colorHighlight="#eaff94" originalColors={false} type="8x8" pxSize={3} colorSteps={2} image={sideprofile} scale={1} fit="cover" style={{ height: '100vh', width: '20vw', opacity: hoveredIndex !== 0 ? 1 : 0 }} />
          <ImageDithering colorBack="#00000000" colorFront="#94ffaf" colorHighlight="#E08FDB" originalColors={false} type="random" pxSize={2} colorSteps={2} image={open} scale={1} fit="cover" style={{ height: '100vh', width: '20vw', opacity: hoveredIndex === 0 ? 1 : 0, position: 'absolute', top: 0, left: 0 }} />
        </div>

        {/*second image */}
        <div 
          onMouseEnter={() => setHoveredIndex(1)} 
          onMouseLeave={() => setHoveredIndex(-1)}
          style={{ backgroundColor: '#000c38', height: '100vh', left: '20vw', position: 'fixed', top: '0', transform: 'translate(0px, 0px)', width: '20vw' }}
        >
          <ImageDithering colorBack="#00000000" colorFront="#57CCFF" colorHighlight="#eaff94" originalColors={false} type="8x8" pxSize={2} colorSteps={2} image={sideprofile} scale={1} fit="cover" style={{ height: '100vh', width: '20vw', opacity: hoveredIndex !== 1 ? 1 : 0 }} />;
          <ImageDithering colorBack="#00000000" colorFront="#FFD276" colorHighlight="#373F03" originalColors={false} type="8x8" pxSize={2.3} colorSteps={7} image={cactus} scale={1.01} fit="cover" style={{ height: '100vh', width: '20vw', opacity: hoveredIndex === 1 ? 1 : 0, position: 'absolute', top: 0, left: 0}} />;
        </div>

        {/*third image */}
        <div 
          onMouseEnter={() => setHoveredIndex(2)} 
          onMouseLeave={() => setHoveredIndex(-1)}
          style={{ backgroundColor: '#000c38', height: '100vh', left: '40vw', position: 'fixed', top: '0', transform: 'translate(0px, 0px)', width: '20vw' }}
        >
          <ImageDithering colorBack="#00000000" colorFront="#4ED9A4" colorHighlight="#eaff94" originalColors={false} type="8x8" pxSize={2} colorSteps={2} image={sideprofile} scale={1} fit="cover" style={{ height: '100vh', width: '20vw', opacity: hoveredIndex !== 2 ? 1 : 0 }} />
          <ImageDithering colorBack="#00000000" colorFront="#94FFAF" colorHighlight="#8B9B3E" originalColors={false} type="random" pxSize={2} colorSteps={2} image={tongue} scale={1} fit="cover" style={{ height: '100vh', width: '20vw', opacity: hoveredIndex === 2 ? 1 : 0, position: 'absolute', top: 0, left: 0}} />
        </div>

        {/*fourth image*/}
        <div 
          onMouseEnter={() => setHoveredIndex(3)} 
          onMouseLeave={() => setHoveredIndex(-1)}
          style={{ backgroundColor: '#000c38', height: '100vh', left: '60vw', position: 'fixed', top: '0', transform: 'translate(0px, 0px)', width: '20vw' }}
        >
          <ImageDithering colorBack="#00000000" colorFront="#B5C955" colorHighlight="#eaff94" originalColors={false} type="8x8" pxSize={2} colorSteps={2} image={sideprofile} scale={1} fit="cover" style={{ height: '100vh', width: '20vw', opacity: hoveredIndex !== 3 ? 1 : 0 }} />
          <ImageDithering colorBack="#00000000" colorFront="#1200DA" colorHighlight="#35FCF6" originalColors={false} type="2x2" pxSize={3} colorSteps={6} image={blueBoy} scale={1.53} fit="cover" style={{ backgroundColor: '#6ECFFF', height: '100vh', width: '20vw', opacity: hoveredIndex === 3 ? 1 : 0, position: 'absolute', top: 0, left: 0}} />
        </div>
        
        {/*fifth image */}
        <div 
          onMouseEnter={() => setHoveredIndex(4)} 
          onMouseLeave={() => setHoveredIndex(-1)}
          style={{ backgroundColor: '#000c38', height: '100vh', left: '80vw', position: 'fixed', top: '0', transform: 'translate(0px, 0px)', width: '20vw' }}
        >
          <ImageDithering colorBack="#00000000" colorFront="#F8A396" colorHighlight="#eaff94" originalColors={false} type="8x8" pxSize={6} colorSteps={2} image={sideprofile} scale={1} fit="cover" style={{ height: '100vh', width: '20vw', opacity: hoveredIndex !== 4 ? 1 : 0, boxShadow: '#00000033 0px 2px 3px inset, #00000033 0px 2px 3px' }} />
          <ImageDithering colorBack="#00000000" colorFront="#00FF7D99" colorHighlight="#FF0072" originalColors={false} type="8x8" pxSize={10.3} colorSteps={7} image={sideprofile} scale={1} fit="cover" style={{ height: '100vh', width: '20vw', opacity: hoveredIndex === 4 ? 1 : 0, position: 'absolute', top: 0, left: 0, backgroundColor: '#00309A' }} />
        </div>
        
        {/* Removed LiquidMetal shaders for performance */}
      </div>
    </>
  );
}
