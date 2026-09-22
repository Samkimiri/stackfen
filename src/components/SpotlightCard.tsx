import { useRef, type MouseEvent, type ReactNode } from "react";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
}

// Tracks the pointer position as CSS custom properties so the .spotlight-track
// pseudo-element (see index.css) can paint a soft glow under the cursor.
// Plain mousemove rather than framer-motion — this fires on every pixel and
// a motion value would be overkill for setting two CSS variables.
export default function SpotlightCard({ children, className = "" }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--x", `${event.clientX - rect.left}px`);
    el.style.setProperty("--y", `${event.clientY - rect.top}px`);
  }

  return (
    <div ref={ref} onMouseMove={handleMouseMove} className={`spotlight-track ${className}`}>
      {children}
    </div>
  );
}
