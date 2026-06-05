import { useState, useEffect, useRef } from 'react';

/**
 * Custom typewriter hook that reveals text character by character.
 * @param {string} text - The full text to type out
 * @param {number} speed - Milliseconds between each character (default: 38ms)
 * @param {number} startDelay - Delay before typing starts (default: 600ms)
 * @returns {{ displayed: string, done: boolean }}
 */
export function useTypewriter(text, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayed('');
    setDone(false);

    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        indexRef.current += 1;
        if (indexRef.current >= text.length) {
          setDisplayed(text);
          setDone(true);
          clearInterval(intervalRef.current);
        } else {
          setDisplayed(text.slice(0, indexRef.current));
        }
      }, speed);
    }, startDelay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
}
