"use client";
import React from "react";

export default function ProgressDots({
  total,
  current,
  doneColor = "bg-emerald-300",
  activeColor = "bg-white",
  idleColor = "bg-white/50",
  size = "h-2 w-6",
}: {
  total: number;
  current: number;
  doneColor?: string;
  activeColor?: string;
  idleColor?: string;
  size?: string;
}) {
  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`${size} rounded-full transition-all ${
            i === current
              ? `${activeColor} w-10`
              : i < current
              ? `${doneColor} w-2`
              : `${idleColor} w-2`
          }`}
        />
      ))}
    </div>
  );
}
