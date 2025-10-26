"use client";
import { useRef } from "react";

interface Tilt3DProps {
  children: React.ReactNode;
  className?: string;
  maxTiltDeg?: number;
  scale?: number;
}

export default function Tilt3D({
  children,
  className,
  maxTiltDeg = 12,
  scale = 1.02,
}: Tilt3DProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const midX = rect.width / 2;
    const midY = rect.height / 2;
    const rotateY = ((x - midX) / midX) * maxTiltDeg;
    const rotateX = -((y - midY) / midY) * maxTiltDeg;
    el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform =
      "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      onMouseEnter={handleMouseMove}
      className={className}
      style={{
        transform: "perspective(900px)",
        transformStyle: "preserve-3d",
        transition: "transform 180ms ease",
      }}
    >
      {children}
    </div>
  );
}
