"use client";
import { useState } from "react";
import Tilt3D from "./ui/tilt";

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
      title: "🔗 Nối Cặp Số (Phép chia)",
      description:
        "Nối phép chia với kết quả, mở ô chữ: SỐ CHIA, THƯƠNG, PHÉP CHIA, GIẢM LẦN",
      color: "from-sky-500 to-cyan-500",
      icon: "🎯",
    },
    {
      id: "comparison",
      title: "🧠 Trắc Nghiệm Gấp Lên Nhiều Lần",
      description:
        "Chọn A–D theo đáp án; một số câu cho phép nhập số trực tiếp",
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
      description: "Nếu câu sai, nhập đáp án đúng mới được qua câu kế",
      color: "from-fuchsia-500 to-pink-500",
      icon: "🤔",
    },
  ];

  return (
    <div className="text-center pt-16 md:pt-20 relative z-20">
      <div className="mb-8 relative z-30">
        <h1 className="text-5xl font-extrabold text-white drop-shadow-lg mb-2 tracking-wide">
          🎮 Trò Chơi Toán Học
        </h1>
        <p className="text-lg text-white/90 drop-shadow-md">
          Chọn một bài tập để bắt đầu
        </p>
      </div>

      {/* Game Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto px-6 items-stretch">
        {games.map((game) => (
          <Tilt3D key={game.id} className="shine-3d h-full">
            <button
              onClick={() => onSelectGame(game.id as any)}
              onMouseEnter={() => setHoveredGame(game.id)}
              onMouseLeave={() => setHoveredGame(null)}
              className={`
              relative group overflow-hidden rounded-2xl p-8 ring-1 ring-white/20
              transform transition-all duration-300
              ${
                hoveredGame === game.id
                  ? "scale-105 shadow-2xl ring-white/40"
                  : "shadow-lg"
              }
              bg-gradient-to-br ${game.color}
              hover:shadow-xl
              w-full h-full flex flex-col justify-between min-h-[220px]
            `}
            >
              {/* Animated Background */}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/15 blur-2xl group-hover:bg-white/20 transition-colors" />

              {/* Content */}
              <div className="relative z-10 flex-1 flex flex-col items-center text-center">
                <div className="text-6xl mb-3 drop-shadow">{game.icon}</div>
                <h2 className="text-2xl font-extrabold text-white mb-2 tracking-wide">
                  {game.title}
                </h2>
                <p className="text-white/95 text-sm max-w-[28ch]">
                  {game.description}
                </p>

                {/* Play Button */}
                <div className="mt-6 inline-flex items-center justify-center px-6 py-2 rounded-xl bg-white/25 border border-white/40 text-white font-bold backdrop-blur-md hover:bg-white/35 hover:border-white/60 transition-all text-base self-center mt-auto shadow-md">
                  Chơi Ngay →
                </div>
              </div>
            </button>
          </Tilt3D>
        ))}
      </div>

      {/* Instructions */}
      <div className="mt-10 glass-card p-5 max-w-3xl mx-auto mx-4 border border-white/20">
        <p className="text-white/95 text-base text-center">
          💡 Mẹo: Trả lời đúng để nhận sao ⭐ và tăng điểm số của bạn!
        </p>
      </div>
    </div>
  );
}
