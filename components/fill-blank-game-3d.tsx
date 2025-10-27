"use client";
import { useMemo, useState } from "react";
import Tilt3D from "./ui/tilt";
import ProgressDots from "./ui/progress-dots";

interface FillBlankGameProps {
  onComplete: (score: number) => void;
}

export default function FillBlankGame3D({ onComplete }: FillBlankGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(
    null
  );

  // Sound effects
  const correctSfx = useMemo(
    () =>
      typeof window !== "undefined"
        ? new Audio("/mixkit-correct-answer-notification-947.wav")
        : null,
    []
  );
  const wrongSfx = useMemo(
    () =>
      typeof window !== "undefined"
        ? new Audio("/mixkit-wrong-answer-fail-notification-946.wav")
        : null,
    []
  );

  const questions = [
    {
      sequence: [2, 4, 6, "?", 10],
      correct: "8",
      hint: "Quy luật: +2 mỗi bước",
    },
    {
      sequence: [5, 10, 15, "?", 25],
      correct: "20",
      hint: "Quy luật: +5 mỗi bước",
    },
    {
      sequence: [1, 2, 4, "?", 16],
      correct: "8",
      hint: "Quy luật: ×2 (gấp đôi)",
    },
    {
      sequence: [3, 6, 9, "?", 15],
      correct: "12",
      hint: "Quy luật: +3 mỗi bước",
    },
    {
      sequence: [5, "?"],
      correct: "10",
      hint: "Nhân 2 lần: 5 × 2",
    },
    {
      sequence: [6, "?"],
      correct: "30",
      hint: "Nhân 5 lần: 6 × 5",
    },
    {
      sequence: [3, "?"],
      correct: "24",
      hint: "Nhân 8 lần: 3 × 8",
    },
    {
      sequence: [7, "?"],
      correct: "14",
      hint: "Nhân 2 lần: 7 × 2",
    },
    {
      sequence: [12, ":", 3, "=", "?"],
      correct: "4",
      hint: "Giảm 12 đi 3 lần: 12 ÷ 3",
    },
    {
      sequence: [16, ":", 4, "=", "?"],
      correct: "4",
      hint: "Giảm 16 đi 4 lần: 16 ÷ 4",
    },
    {
      sequence: [20, ":", 5, "=", "?"],
      correct: "4",
      hint: "Giảm 20 đi 5 lần: 20 ÷ 5",
    },
    {
      sequence: [18, ":", 2, "=", "?"],
      correct: "9",
      hint: "Giảm 18 đi 2 lần: 18 ÷ 2",
    },
  ];

  const question = questions[currentQuestion];

  const handleSubmit = () => {
    if (userAnswer === question.correct) {
      setFeedback("correct");
      if (correctSfx) {
        try {
          correctSfx.currentTime = 0;
          correctSfx.play();
        } catch {}
      }
      setTimeout(() => {
        if (currentQuestion + 1 >= questions.length) {
          onComplete(10);
        } else {
          setCurrentQuestion(currentQuestion + 1);
          setUserAnswer("");
          setFeedback(null);
        }
      }, 1500);
    } else {
      setFeedback("incorrect");
      if (wrongSfx) {
        try {
          wrongSfx.currentTime = 0;
          wrongSfx.play();
        } catch {}
      }
      setTimeout(() => {
        setUserAnswer("");
        setFeedback(null);
      }, 1000);
    }
  };

  return (
    <Tilt3D className="shine-3d">
      <div className="fillblank-gradient rounded-2xl p-7 max-w-3xl shadow-2xl border border-white/30 text-white glow-3d relative overflow-hidden">
        <div className="orb bg-emerald-300 size-48 -top-10 -left-8" />
        <div className="orb bg-teal-300 size-40 -bottom-10 -right-8" />
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white drop-shadow-lg mb-3">
            ✏️ Điền Số Còn Thiếu
          </h2>
          <p className="text-white/90 text-sm drop-shadow-md mb-4">
            Tìm số còn thiếu trong dãy
          </p>
          <ProgressDots
            total={questions.length}
            current={currentQuestion}
            doneColor="bg-emerald-300"
          />
        </div>

        {/* Sequence */}
        <div className="flex justify-center items-center gap-3 mb-8 flex-wrap">
          {question.sequence.map((num, i) => (
            <div
              key={i}
              className={`w-16 h-16 rounded-xl flex items-center justify-center font-bold text-2xl border ${
                num === "?"
                  ? "bg-yellow-200 text-yellow-800 border-yellow-300"
                  : "bg-white/10 text-white border-white/30"
              }`}
            >
              {num}
            </div>
          ))}
        </div>

        {/* Hint */}
        <div className="glass-card fillblank-glass p-4 mb-5 text-center">
          <p className="text-white font-semibold text-sm">
            💡 Gợi ý: {question.hint}
          </p>
        </div>

        {/* Input */}
        <div className="mb-5">
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Nhập số"
            className="w-full px-5 py-4 text-2xl font-bold text-center bg-white/10 text-white placeholder-white/70 border border-white/30 rounded-xl focus:outline-none focus:border-white/60"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!userAnswer}
          className="w-full btn-brand disabled:opacity-50 py-3 text-sm mb-4"
        >
          Kiểm Tra ✓
        </button>

        {/* Feedback */}
        {feedback && (
          <div
            className={`text-center py-3 rounded-lg font-bold text-sm mb-4 border ${
              feedback === "correct"
                ? "bg-emerald-500 text-white border-white/30"
                : "bg-rose-500 text-white border-white/30"
            }`}
          >
            {feedback === "correct" ? "✅ Chính xác!" : "❌ Thử lại!"}
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={() => onComplete(0)}
          className="w-full btn-glass py-3 text-sm"
        >
          ← Quay Lại
        </button>
      </div>
    </Tilt3D>
  );
}
