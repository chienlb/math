"use client";
import { useState } from "react";
import Tilt3D from "./ui/tilt";

interface ComparisonGameProps {
  onComplete: (score: number) => void;
}

export default function ComparisonGame3D({ onComplete }: ComparisonGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(
    null
  );

  const questions = [
    {
      question: "Số 6 lớn gấp mấy lần số 2?",
      options: [2, 3, 4],
      correct: 1,
    },
    {
      question: "Muốn được 15 từ 3 thì nhân lên mấy lần?",
      options: [3, 4, 5],
      correct: 2,
    },
    {
      question: "Số 20 là bội gấp mấy lần của 4?",
      options: [4, 5, 6],
      correct: 1,
    },
    {
      question: "Từ 3 nhân lên mấy lần sẽ được 12?",
      options: [3, 4, 5],
      correct: 1,
    },
    // Added from user's scenarios as multiple choice
    {
      question: "Hùng có số bi gấp mấy lần Nam nếu Nam có 5 và Hùng có 15?",
      options: [2, 3, 4],
      correct: 1,
    },
    {
      question: "Mẹ hơn Lan bao nhiêu lần tuổi nếu Lan 7 và mẹ 35?",
      options: [4, 5, 6],
      correct: 1,
    },
    {
      question: "Từ 6 bông hoa, nhân lên mấy lần sẽ có 24 bông?",
      options: [3, 4, 5],
      correct: 1,
    },
    {
      question: "Túi gạo 8kg cần nhân mấy lần để thành 16kg?",
      options: [2, 3, 4],
      correct: 0,
    },
    {
      question: "Đoạn thẳng 4cm nhân mấy lần để thành 20cm?",
      options: [4, 5, 6],
      correct: 1,
    },
    {
      question: "Từ 9 quyển vở, nhân lên mấy lần sẽ có 27 quyển?",
      options: [2, 3, 4],
      correct: 1,
    },
    {
      question: "Cần nhân 5 lên mấy lần để được 10?",
      options: [2, 3, 4],
      correct: 0,
    },
    {
      question: "Nhân 6 lên mấy lần sẽ ra 30?",
      options: [4, 5, 6],
      correct: 1,
    },
    {
      question: "3 được nhân mấy lần để thành 24?",
      options: [6, 7, 8],
      correct: 2,
    },
    {
      question: "Tính nhanh: 5 nhân 4 bằng bao nhiêu?",
      options: [20, 25, 30],
      correct: 0,
    },
    {
      question: "Tính nhanh: 8 nhân 3 bằng bao nhiêu?",
      options: [21, 24, 27],
      correct: 1,
    },
    {
      question: "Tính nhanh: 6 nhân 5 bằng bao nhiêu?",
      options: [30, 35, 40],
      correct: 0,
    },
    {
      question: "Tính nhanh: 7 nhân 2 bằng bao nhiêu?",
      options: [12, 14, 16],
      correct: 1,
    },
    {
      question: "Tính nhanh: 3 nhân 9 bằng bao nhiêu?",
      options: [24, 27, 30],
      correct: 1,
    },
  ];

  const question = questions[currentQuestion];

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    if (index === question.correct) {
      setFeedback("correct");
      setTimeout(() => {
        if (currentQuestion + 1 >= questions.length) {
          onComplete(10);
        } else {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedAnswer(null);
          setFeedback(null);
        }
      }, 1500);
    } else {
      setFeedback("incorrect");
      setTimeout(() => {
        setSelectedAnswer(null);
        setFeedback(null);
      }, 1000);
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
            ⚖️ So Sánh Số
          </h2>
          <p className="text-white/90 text-sm drop-shadow-md mb-4">
            Chọn đáp án đúng
          </p>
          <div className="flex justify-center gap-2">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`h-2 w-6 rounded-full transition-all ${
                  i === currentQuestion ? "bg-white w-10" : "bg-white/50 w-2"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Question */}
        <div className="glass-card comparison-glass rounded-xl p-7 mb-8">
          <p className="text-4xl font-bold text-white text-center drop-shadow-lg">
            {question.question}
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {question.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={selectedAnswer !== null}
              className={`py-5 px-4 rounded-xl font-bold text-2xl transition-all border shadow-lg comparison-glass ${
                selectedAnswer === i
                  ? feedback === "correct"
                    ? "bg-emerald-500 text-white"
                    : "bg-rose-500 text-white"
                  : "text-white hover:bg-white/20 hover:shadow-xl"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

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
