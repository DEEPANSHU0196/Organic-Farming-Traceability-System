import { motion } from 'motion/react';
import { memo, useMemo } from 'react';

// Individual grass blade component
const GrassBlade = memo(({ x, height, width, color, delay, reduced }) => (
  <motion.rect
    x={x}
    y={0}
    width={width}
    height={height}
    rx={width / 2}
    fill={color}
    style={{ transformOrigin: `${x + width / 2}px ${height}px` }}
    animate={
      reduced
        ? {}
        : {
            rotateZ: [-1.5, 1.5, -1.5],
            scaleY: [1, 1.02, 1],
          }
    }
    transition={{
      duration: 3 + Math.random() * 2,
      delay,
      repeat: Infinity,
      ease: 'easeInOut',
      repeatType: 'mirror',
    }}
  />
));
GrassBlade.displayName = 'GrassBlade';

// A horizontal strip of grass for one row
function GrassStrip({ bladeCount, yOffset, baseHeight, colorDark, colorLight, reduced }) {
  const blades = useMemo(() => {
    const stripW = 1400;
    const spacing = stripW / bladeCount;
    return Array.from({ length: bladeCount }, (_, i) => {
      const x = i * spacing + (Math.random() - 0.5) * spacing * 0.4;
      const h = baseHeight * (0.65 + Math.random() * 0.55);
      const w = 3 + Math.random() * 3;
      const color = Math.random() > 0.5 ? colorDark : colorLight;
      const delay = Math.random() * 2;
      return { x, h, w, color, delay };
    });
  }, [bladeCount, baseHeight, colorDark, colorLight]);

  return (
    <svg
      viewBox={`0 0 1400 ${baseHeight + 10}`}
      preserveAspectRatio="none"
      style={{
        position: 'absolute',
        bottom: yOffset,
        left: 0,
        width: '100%',
        height: baseHeight + 10,
        pointerEvents: 'none',
        zIndex: 4,
      }}
      aria-hidden="true"
    >
      {blades.map((b, i) => (
        <GrassBlade
          key={i}
          x={b.x}
          height={b.h}
          width={b.w}
          color={b.color}
          delay={b.delay}
          reduced={reduced}
        />
      ))}
    </svg>
  );
}

export default memo(function Grass({ reduced }) {
  return (
    <>
      {/* Back row — shorter, lighter */}
      <GrassStrip
        bladeCount={90}
        yOffset="9%"
        baseHeight={40}
        colorDark="#2D5A1B"
        colorLight="#4A7C30"
        reduced={reduced}
      />
      {/* Mid row */}
      <GrassStrip
        bladeCount={70}
        yOffset="6%"
        baseHeight={55}
        colorDark="#1E4A12"
        colorLight="#3A6B24"
        reduced={reduced}
      />
      {/* Front row — tallest, darkest */}
      <GrassStrip
        bladeCount={50}
        yOffset="2%"
        baseHeight={70}
        colorDark="#163A0D"
        colorLight="#2A5419"
        reduced={reduced}
      />
    </>
  );
});
