"use client";
import { Suspense, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  Float,
  Text3D,
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

          <FloatingShapes theme={gameMode} />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.3}
            maxPolarAngle={Math.PI * 0.6}
            minPolarAngle={Math.PI * 0.4}
          />
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
        {/* Score Display: shows always; on menu move to bottom-right to avoid title */}
        <div
          className={`absolute pointer-events-auto z-30 ${
            gameMode === "menu" ? "bottom-6 right-6" : "top-10 right-10"
          }`}
        >
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

function FloatingShapes({
  theme,
}: {
  theme: "menu" | "matching" | "comparison" | "fillblank" | "truefalse";
}) {
  const paletteByTheme: Record<
    "menu" | "matching" | "comparison" | "fillblank" | "truefalse",
    string[]
  > = {
    menu: [
      "#6366F1",
      "#8B5CF6",
      "#06B6D4",
      "#0EA5E9",
      "#22D3EE",
      "#818CF8",
      "#A78BFA",
      "#38BDF8",
    ],
    matching: [
      "#06B6D4", // cyan-500
      "#22D3EE", // cyan-400
      "#0EA5E9", // sky-500
      "#38BDF8", // sky-400
      "#0891B2", // cyan-700
      "#67E8F9", // cyan-200
      "#22D3EE",
      "#06B6D4",
    ],
    comparison: [
      "#6366F1", // indigo-500
      "#818CF8", // indigo-400
      "#8B5CF6", // violet-500
      "#A78BFA", // violet-400
      "#4F46E5", // indigo-600
      "#C4B5FD", // violet-300
      "#6366F1",
      "#8B5CF6",
    ],
    fillblank: [
      "#10B981", // emerald-500
      "#34D399", // emerald-400
      "#14B8A6", // teal-500
      "#2DD4BF", // teal-400
      "#059669", // emerald-600
      "#99F6E4", // teal-200
      "#10B981",
      "#14B8A6",
    ],
    truefalse: [
      "#D946EF", // fuchsia-500
      "#F472B6", // pink-400
      "#E879F9", // fuchsia-400
      "#FB7185", // rose-400
      "#A21CAF", // fuchsia-800
      "#F0ABFC", // fuchsia-300
      "#EC4899", // pink-500
      "#D946EF",
    ],
  };
  const colors = paletteByTheme[theme];

  // Deterministic PRNG (mulberry32)
  function mulberry32(a: number) {
    return function () {
      let t = (a += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function themeSeed(str: string) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
    return Math.abs(h) + 1;
  }

  function generatePositions(
    count: number,
    xRange: [number, number],
    yRange: [number, number],
    zRange: [number, number],
    seed: number,
    minRadiusFromCenter = 0
  ): [number, number, number][] {
    const rand = mulberry32(seed);
    const positions: [number, number, number][] = [];
    const maxTries = count * 20;
    let tries = 0;
    while (positions.length < count && tries < maxTries) {
      tries++;
      const x = xRange[0] + rand() * (xRange[1] - xRange[0]);
      const y = yRange[0] + rand() * (yRange[1] - yRange[0]);
      const z = zRange[0] + rand() * (zRange[1] - zRange[0]);
      const r2 = x * x + y * y;
      if (
        minRadiusFromCenter > 0 &&
        r2 < minRadiusFromCenter * minRadiusFromCenter
      )
        continue;
      positions.push([x, y, z]);
    }
    // If not enough due to min radius, fill remaining without radius constraint
    while (positions.length < count) {
      const x = xRange[0] + Math.random() * (xRange[1] - xRange[0]);
      const y = yRange[0] + Math.random() * (yRange[1] - yRange[0]);
      const z = zRange[0] + Math.random() * (zRange[1] - zRange[0]);
      positions.push([x, y, z]);
    }
    return positions;
  }

  const seedBase = useMemo(() => themeSeed(theme), [theme]);
  const cubePositions = useMemo(
    () => generatePositions(8, [-12, 12], [-7, 7], [-11, -6], seedBase + 11, 3),
    [seedBase]
  );
  const spherePositions = useMemo(
    () =>
      generatePositions(6, [-12, 12], [-7, 7], [-10, -6], seedBase + 23, 2.5),
    [seedBase]
  );
  const torusPositions = useMemo(
    () =>
      generatePositions(
        4,
        [-12, 12],
        [-7, 7],
        [-11.5, -6.5],
        seedBase + 37,
        3.5
      ),
    [seedBase]
  );
  const symbolPositions = useMemo(
    () =>
      generatePositions(
        14,
        [-12, 12],
        [-7, 7],
        [-11.5, -7.5],
        seedBase + 53,
        2
      ),
    [seedBase]
  );
  const numberPositions = useMemo(
    () =>
      generatePositions(10, [-12, 12], [-7, 7], [-12, -7], seedBase + 77, 2.5),
    [seedBase]
  );

  return (
    <>
      {/* Floating Cubes */}
      {cubePositions.map((pos, i) => (
        <Float
          key={`cube-${i}`}
          speed={2 + i * 0.3}
          rotationIntensity={2}
          floatIntensity={2}
        >
          <mesh position={pos}>
            <boxGeometry args={[0.8, 0.8, 0.8]} />
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
      {spherePositions.map((pos, i) => (
        <Float
          key={`sphere-${i}`}
          speed={1.5 + i * 0.2}
          rotationIntensity={1.5}
          floatIntensity={1.5}
        >
          <mesh position={pos}>
            <sphereGeometry args={[0.5, 32, 32]} />
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
      {torusPositions.map((pos, i) => (
        <Float
          key={`torus-${i}`}
          speed={1 + i * 0.25}
          rotationIntensity={2.5}
          floatIntensity={1}
        >
          <mesh position={pos}>
            <torusGeometry args={[0.65, 0.18, 16, 100]} />
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

      {/* Floating 3D math symbols */}
      {symbolPositions.map((pos, i) => {
        const symbols = ["+", "-", "×", ":"];
        const sym = symbols[i % symbols.length];
        const color = colors[(i + 2) % colors.length];
        const size = 1.2 + (i % 3) * 0.25;
        return (
          <Float
            key={`sym3d-${i}`}
            speed={0.9 + (i % 5) * 0.18}
            rotationIntensity={0.8}
            floatIntensity={1.0}
          >
            <Text3D
              font="https://unpkg.com/three@0.159.0/examples/fonts/helvetiker_bold.typeface.json"
              size={size}
              height={0.34}
              bevelEnabled
              bevelThickness={0.06}
              bevelSize={0.03}
              bevelSegments={5}
              position={pos}
            >
              {sym}
              <meshPhysicalMaterial
                color={color}
                emissive={colors[(i + 4) % colors.length]}
                emissiveIntensity={0.6}
                metalness={0.6}
                roughness={0.25}
                clearcoat={1}
                clearcoatRoughness={0.1}
                sheen={1}
                sheenColor={color}
                toneMapped={false}
              />
            </Text3D>
          </Float>
        );
      })}

      {/* Floating extruded 3D numbers */}
      {numberPositions.map((pos, i) => (
        <Float
          key={`num3d-${i}`}
          speed={0.85 + (i % 4) * 0.2}
          rotationIntensity={0.7}
          floatIntensity={0.9}
        >
          <Text3D
            font="https://unpkg.com/three@0.159.0/examples/fonts/helvetiker_bold.typeface.json"
            size={1.2}
            height={0.36}
            bevelEnabled
            bevelThickness={0.06}
            bevelSize={0.03}
            bevelSegments={5}
            position={pos}
          >
            {String(i)}
            <meshPhysicalMaterial
              color={colors[(i + 6) % colors.length]}
              emissive={colors[(i + 4) % colors.length]}
              emissiveIntensity={0.55}
              metalness={0.7}
              roughness={0.22}
              clearcoat={1}
              clearcoatRoughness={0.12}
              sheen={1}
              sheenColor="#ffffff"
              toneMapped={false}
            />
          </Text3D>
        </Float>
      ))}
    </>
  );
}
