"use client";
import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  Float,
} from "@react-three/drei";
import GameMenu from "./game-menu-3d";
import MatchingGame3D from "./matching-game-3d";
import ComparisonGame3D from "./comparison-game-3d";
import FillBlankGame3D from "./fill-blank-game-3d";
import TrueFalseGame3D from "./true-false-game-3d";

export default function MathGame3D() {
  const [gameMode, setGameMode] = useState<
    "menu" | "matching" | "comparison" | "fillblank" | "truefalse"
  >("menu");
  const [score, setScore] = useState(0);

  const handleGameComplete = (points: number) => {
    setScore(score + points);
    setGameMode("menu");
  };

  return (
    <div className="w-full h-screen relative overflow-hidden">
      {/* 3D Canvas Background */}
      <Canvas className="absolute inset-0">
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 10]} />
          <Environment preset="sunset" />
          <ambientLight intensity={0.9} />
          <pointLight position={[10, 10, 10]} intensity={1.2} />
          <pointLight
            position={[-10, -10, 5]}
            intensity={0.6}
            color="#00d4ff"
          />

          <FloatingShapes />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.3}
          />
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
        {/* Score Display */}
        <div className="absolute top-10 right-10 pointer-events-auto">
          <div className="score-badge px-10 py-5">
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500">
              ⭐ {score}
            </div>
          </div>
        </div>

        {/* Game Content */}
        <div className="pointer-events-auto">
          {gameMode === "menu" && <GameMenu onSelectGame={setGameMode} />}
          {gameMode === "matching" && (
            <MatchingGame3D onComplete={handleGameComplete} />
          )}
          {gameMode === "comparison" && (
            <ComparisonGame3D onComplete={handleGameComplete} />
          )}
          {gameMode === "fillblank" && (
            <FillBlankGame3D onComplete={handleGameComplete} />
          )}
          {gameMode === "truefalse" && (
            <TrueFalseGame3D onComplete={handleGameComplete} />
          )}
        </div>
      </div>
    </div>
  );
}

function FloatingShapes() {
  const colors = [
    "#6366F1", // indigo-500
    "#8B5CF6", // violet-500
    "#06B6D4", // cyan-500
    "#0EA5E9", // sky-500
    "#22D3EE", // cyan-400
    "#818CF8", // indigo-400
    "#A78BFA", // violet-400
    "#38BDF8", // sky-400
  ];

  return (
    <>
      {/* Floating Cubes */}
      {[...Array(8)].map((_, i) => (
        <Float
          key={`cube-${i}`}
          speed={2 + i * 0.3}
          rotationIntensity={2}
          floatIntensity={2}
        >
          <mesh
            position={[
              Math.cos(i * 0.785) * 5,
              Math.sin(i * 0.785) * 5,
              -8 + i * 0.5,
            ]}
          >
            <boxGeometry args={[0.6, 0.6, 0.6]} />
            <meshStandardMaterial
              color={colors[i]}
              emissive={colors[i]}
              emissiveIntensity={0.4}
              metalness={0.3}
              roughness={0.4}
            />
          </mesh>
        </Float>
      ))}

      {/* Floating Spheres */}
      {[...Array(6)].map((_, i) => (
        <Float
          key={`sphere-${i}`}
          speed={1.5 + i * 0.2}
          rotationIntensity={1.5}
          floatIntensity={1.5}
        >
          <mesh
            position={[
              Math.cos(i * 1.047) * 6,
              Math.sin(i * 1.047) * 6,
              -6 + i * 0.3,
            ]}
          >
            <sphereGeometry args={[0.4, 32, 32]} />
            <meshStandardMaterial
              color={colors[(i + 4) % colors.length]}
              emissive={colors[(i + 4) % colors.length]}
              emissiveIntensity={0.3}
              metalness={0.5}
              roughness={0.3}
            />
          </mesh>
        </Float>
      ))}

      {/* Floating Torus */}
      {[...Array(4)].map((_, i) => (
        <Float
          key={`torus-${i}`}
          speed={1 + i * 0.25}
          rotationIntensity={2.5}
          floatIntensity={1}
        >
          <mesh
            position={[
              Math.cos(i * 1.57) * 7,
              Math.sin(i * 1.57) * 7,
              -7 + i * 0.4,
            ]}
          >
            <torusGeometry args={[0.5, 0.15, 16, 100]} />
            <meshStandardMaterial
              color={colors[(i + 2) % colors.length]}
              emissive={colors[(i + 2) % colors.length]}
              emissiveIntensity={0.35}
              metalness={0.6}
              roughness={0.2}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}
