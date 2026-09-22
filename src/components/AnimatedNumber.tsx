import { useEffect, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  suffix?: string;
}

// Hero's trust-strip numbers are already visible on load (above the fold),
// so this counts up on mount rather than waiting for a scroll-into-view
// trigger — the numbers are real (site content), never invented for effect.
export default function AnimatedNumber({ value, suffix = "" }: AnimatedNumberProps) {
  const [display, setDisplay] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(value);
      return;
    }

    const controls = animate(0, value, {
      duration: 1.1,
      ease: [0.21, 0.47, 0.32, 0.98],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });

    return () => controls.stop();
  }, [value, reduceMotion]);

  return (
    <>
      {display}
      {suffix}
    </>
  );
}
