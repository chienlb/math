"use client"

import { useState } from "react"
import MatchingGame from "./matching-game"
import FillInTheBlank from "./fill-in-the-blank"
import ComparisonGame from "./comparison-game"
import GameMenu from "./game-menu"

type GameType = "menu" | "matching" | "fill-blank" | "comparison"

export default function MathGame() {
  const [currentGame, setCurrentGame] = useState<GameType>("menu")
  const [score, setScore] = useState(0)

  const handleGameSelect = (game: GameType) => {
    setCurrentGame(game)
    setScore(0)
  }

  const handleBackToMenu = () => {
    setCurrentGame("menu")
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white p-6 shadow-lg">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold">🎮 Toán Học Vui Vẻ</h1>
          {currentGame !== "menu" && (
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold bg-white bg-opacity-30 px-4 py-2 rounded-lg">⭐ {score}</div>
              <button
                onClick={handleBackToMenu}
                className="bg-white text-purple-600 px-6 py-2 rounded-lg font-bold hover:bg-opacity-90 transition"
              >
                ← Quay lại
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Game Content */}
      <div className="flex-1 overflow-auto">
        {currentGame === "menu" && <GameMenu onSelectGame={handleGameSelect} />}
        {currentGame === "matching" && <MatchingGame onScore={setScore} onBack={handleBackToMenu} />}
        {currentGame === "fill-blank" && <FillInTheBlank onScore={setScore} onBack={handleBackToMenu} />}
        {currentGame === "comparison" && <ComparisonGame onScore={setScore} onBack={handleBackToMenu} />}
      </div>
    </div>
  )
}
