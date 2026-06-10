import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook to track normalized mouse position with smooth interpolation.
 * Returns { x, y } values from -1 to 1 (center is 0,0).
 * Uses lerp for smooth 60fps transitions.
 */
export function useMousePosition(lerpFactor = 0.08) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  const lerp = useCallback((start, end, factor) => {
    return start + (end - start) * factor;
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Normalize to -1 to 1 range
      targetRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };

    const handleMouseLeave = () => {
      // Reset to center when mouse leaves window
      targetRef.current = { x: 0, y: 0 };
    };

    const animate = () => {
      currentRef.current = {
        x: lerp(currentRef.current.x, targetRef.current.x, lerpFactor),
        y: lerp(currentRef.current.y, targetRef.current.y, lerpFactor),
      };

      // Only update state when there's meaningful change
      const dx = Math.abs(currentRef.current.x - position.x);
      const dy = Math.abs(currentRef.current.y - position.y);
      if (dx > 0.001 || dy > 0.001) {
        setPosition({ ...currentRef.current });
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [lerp, lerpFactor]);

  return position;
}
