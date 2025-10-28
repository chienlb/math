"use client";
import { useMemo, useState } from "react";
import Tilt3D from "./ui/tilt";
import ProgressDots from "./ui/progress-dots";

interface ComparisonGameProps {
  onComplete: (score: number) => void;
}

export default function ComparisonGame3D({ onComplete }: ComparisonGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(
    null
  );
  const [numericInput, setNumericInput] = useState<string>("");

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
    // Section II
    {
      question: "Gấp 4 lên 3 lần được ___",
      options: [6, 7, 12, 8],
      correct: 2,
    },
    {
      question: "Gấp 5 lên 2 lần được ___",
      options: [7, 8, 9, 10],
      correct: 3,
    },
    {
      question: "Gấp 6 lên 4 lần được ___",
      options: [10, 18, 24, 26],
      correct: 2,
    },
    {
      question: "Gấp 7 lên 5 lần được ___",
      options: [35, 30, 25, 40],
      correct: 0,
    },
    {
      question: "Gấp 9 lên 3 lần được ___",
      options: [18, 21, 24, 27],
      correct: 3,
    },
    {
      question:
        "Một bạn có 2 quyển vở. Số vở của bạn Lan gấp 5 lần số vở của bạn ấy. Lan có ___ quyển vở.",
      options: [7, 8, 10, 9],
      correct: 2,
    },
    {
      question:
        "Một con thỏ có 4 chân. 6 con thỏ có số chân gấp bao nhiêu lần số chân của 1 con thỏ?",
      options: [3, 4, 5, 6],
      correct: 3,
    },
    {
      question:
        "Một hàng có 8 cái ghế. Nếu gấp 3 lần số ghế đó thì có ___ cái ghế.",
      options: [16, 20, 24, 28],
      correct: 2,
    },
    {
      question: "Một số khi gấp lên 4 lần được 20. Số đó là ___",
      options: [4, 5, 6, 8],
      correct: 1,
      allowNumeric: true,
      numericAnswer: 5,
    },
    {
      question: "Một số khi gấp lên 6 lần được 42. Số đó là ___",
      options: [7, 6, 8, 9],
      correct: 0,
      allowNumeric: true,
      numericAnswer: 7,
    },
  ] as const;

  const question = questions[currentQuestion];

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    if (index === question.correct) {
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
          setSelectedAnswer(null);
          setFeedback(null);
          setNumericInput("");
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
        setSelectedAnswer(null);
        setFeedback(null);
        setNumericInput("");
      }, 1000);
    }
  };

  const submitNumeric = () => {
    const q: any = questions[currentQuestion] as any;
    if (!q.allowNumeric) return;
    if (String(q.numericAnswer) === numericInput.trim()) {
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
          setSelectedAnswer(null);
          setFeedback(null);
          setNumericInput("");
        }
      }, 900);
    } else {
      setFeedback("incorrect");
      if (wrongSfx) {
        try {
          wrongSfx.currentTime = 0;
          wrongSfx.play();
        } catch {}
      }
    }
  };

  return (
    <Tilt3D className="shine-3d">
      <div className="comparison-gradient rounded-2xl p-7 max-w-3xl shadow-2xl border border-white/30 text-white glow-3d relative overflow-hidden">
        <div className="orb bg-indigo-300 size-48 -top-10 -left-8" />
        <div className="orb bg-violet-300 size-40 -bottom-10 -right-8" />
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white drop-shadow-lg mb-3">
            🧠 Trắc Nghiệm Gấp Lên Nhiều Lần
          </h2>
          <p className="text-white/90 text-sm drop-shadow-md mb-4">
            Chọn đáp án đúng (A, B, C, D)
          </p>
          <ProgressDots
            total={questions.length}
            current={currentQuestion}
            doneColor="bg-emerald-300"
          />
        </div>

        {/* Question */}
        <div className="glass-card comparison-glass rounded-xl p-7 mb-8">
          <p className="text-4xl font-bold text-white text-center drop-shadow-lg">
            {question.question}
          </p>
        </div>

        {/* Options: 2x2 grid with labels A-D */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {question.options.map((option, i) => {
            const labels = ["A", "B", "C", "D"] as const;
            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={selectedAnswer !== null}
                className={`py-5 px-4 rounded-xl font-bold text-2xl transition-all border shadow-lg comparison-glass flex items-center justify-center gap-3 ${
                  selectedAnswer === i
                    ? feedback === "correct"
                      ? "bg-emerald-500 text-white"
                      : "bg-rose-500 text-white"
                    : "text-white hover:bg-white/20 hover:shadow-xl"
                }`}
              >
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/20 border border-white/30 text-lg font-black">
                  {labels[i]}
                </span>
                <span>{option}</span>
              </button>
            );
          })}
        </div>

        {/* Numeric input for certain questions */}
        {(questions[currentQuestion] as any).allowNumeric && (
          <div className="mb-6 text-center">
            <div className="glass-card rounded-lg p-4 mb-3">
              <p className="text-white text-sm font-semibold">
                Bạn cũng có thể nhập trực tiếp đáp án số
              </p>
            </div>
            <div className="flex items-center justify-center gap-2">
              <input
                type="number"
                value={numericInput}
                onChange={(e) => setNumericInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitNumeric();
                }}
                placeholder="Nhập số"
                className="px-4 py-2 rounded-lg font-bold text-center w-40 bg-white/90 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <button
                onClick={submitNumeric}
                className="px-4 py-2 rounded-lg btn-glass text-sm font-bold"
              >
                Xác nhận
              </button>
            </div>
          </div>
        )}

        {/* Feedback */}
        {feedback && (
          <div
            className={`text-center py-3 rounded-lg font-bold text-sm mb-5 border ${
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
