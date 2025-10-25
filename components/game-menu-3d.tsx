"use client";
import { useState } from "react";

interface GameMenuProps {
  onSelectGame: (
    game: "matching" | "comparison" | "fillblank" | "truefalse"
  ) => void;
}

export default function GameMenu3D({ onSelectGame }: GameMenuProps) {
  const [hoveredGame, setHoveredGame] = useState<string | null>(null);

  const games = [
    {
      id: "matching",
      title: "🔗 Nối Cặp Số",
      description: "Kéo thả nối giữa số ban đầu và số sau khi giảm",
      color: "from-sky-500 to-cyan-500",
      icon: "🎯",
    },
    {
      id: "comparison",
      title: "⚖️ So Sánh Số",
      description: "So sánh số gấp nhiều lần và ghép cặp đúng",
      color: "from-indigo-500 to-violet-500",
      icon: "🔢",
    },
    {
      id: "fillblank",
      title: "✏️ Điền Số Còn Thiếu",
      description: "Điền số còn thiếu vào dãy số",
      color: "from-emerald-500 to-teal-500",
      icon: "📝",
    },
    {
      id: "truefalse",
      title: "✓✗ Đúng Hay Sai?",
      description: "Xác định xem phép tính có đúng hay sai",
      color: "from-fuchsia-500 to-pink-500",
      icon: "🤔",
    },
  ];

  return (
    <div className="text-center pt-8">
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-white drop-shadow-lg mb-3">
          🎮 Trò Chơi Toán Học
        </h1>
        <p className="text-lg text-white/90 drop-shadow-md">
          Chọn một bài tập để bắt đầu
        </p>
      </div>

      {/* Game Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto px-6">
        {games.map((game) => (
          <button
            key={game.id}
            onClick={() => onSelectGame(game.id as any)}
            onMouseEnter={() => setHoveredGame(game.id)}
            onMouseLeave={() => setHoveredGame(null)}
            className={`
              relative group overflow-hidden rounded-2xl p-8
              transform transition-all duration-300
              ${hoveredGame === game.id ? "scale-105 shadow-xl" : "shadow-lg"}
              bg-gradient-to-br ${game.color}
              hover:shadow-xl
            `}
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Content */}
            <div className="relative z-10">
              <div className="text-5xl mb-3">{game.icon}</div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {game.title}
              </h2>
              <p className="text-white/90 text-sm">{game.description}</p>

              {/* Play Button */}
              <div className="mt-5 inline-block px-6 py-2 btn-glass font-semibold transition-all text-base">
                Chơi Ngay →
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Instructions */}
      <div className="mt-10 glass-card p-5 max-w-3xl mx-auto mx-4">
        <p className="text-white text-base">
          💡 Mẹo: Trả lời đúng để nhận sao ⭐ và tăng điểm số của bạn!
        </p>
      </div>
    </div>
  );
}
