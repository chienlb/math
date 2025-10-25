"use client";
import dynamic from "next/dynamic";

const MathGame3D = dynamic(() => import("@/components/math-game-3d"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-b from-blue-400 via-purple-300 to-pink-200">
      <div className="text-center">
        <div className="text-4xl font-bold text-white mb-4">
          🎮 Đang tải game...
        </div>
        <div className="animate-spin text-6xl">🎲</div>
      </div>
    </div>
  ),
});

export default function Home() {
  return (
    <div className="w-full min-h-screen overflow-y-auto hero-gradient">
      <MathGame3D />
    </div>
  );
}
