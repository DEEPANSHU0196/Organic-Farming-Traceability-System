import { motion, useAnimationControls } from 'motion/react';
import { memo, useEffect, useState } from 'react';

const FULL_TEXT = 'Connecting Farmers Directly to Consumers';

export default memo(function TypingTagline({ reduced }) {
  const [displayText, setDisplayText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(false);
  const controls = useAnimationControls();

  useEffect(() => {
    if (reduced) {
      setDisplayText(FULL_TEXT);
      setCursorVisible(false);
      return;
    }

    // Wait for logo reveal (6.8s) then start typing
    const startDelay = setTimeout(() => {
      setCursorVisible(true);
      let i = 0;
      const typeInterval = setInterval(() => {
        i++;
        setDisplayText(FULL_TEXT.slice(0, i));
        if (i >= FULL_TEXT.length) {
          clearInterval(typeInterval);
          // Blink cursor for 1.5s then hide
          setTimeout(() => setCursorVisible(false), 1500);
        }
      }, 52);
      return () => clearInterval(typeInterval);
    }, 6800);

    return () => clearTimeout(startDelay);
  }, [reduced]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 6.8, duration: 0.3 }}
      style={{
        fontFamily: "'Inter', sans-serif",
        fontWeight: 300,
        fontSize: 'clamp(14px, 2.2vw, 20px)',
        letterSpacing: '0.04em',
        color: 'rgba(255,255,255,0.82)',
        textAlign: 'center',
        minHeight: '1.6em',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
      aria-label={FULL_TEXT}
      aria-live="polite"
    >
      <span>{displayText}</span>
      {cursorVisible && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'steps(1)' }}
          style={{
            display: 'inline-block',
            width: 2,
            height: '1.1em',
            background: '#8BC34A',
            borderRadius: 1,
            marginLeft: 2,
            verticalAlign: 'middle',
          }}
          aria-hidden="true"
        />
      )}
    </motion.div>
  );
});
