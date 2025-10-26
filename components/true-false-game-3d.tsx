"use client";
import { useState } from "react";
import Tilt3D from "./ui/tilt";
import ProgressDots from "./ui/progress-dots";

interface TrueFalseGameProps {
  onComplete: (score: number) => void;
}

export default function TrueFalseGame3D({ onComplete }: TrueFalseGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(
    null
  );
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);

  const questions = [
    {
      question: "10 + 5 = 15",
      answer: true,
      explanation: "Đúng! 10 cộng 5 bằng 15",
    },
    {
      question: "20 - 8 = 11",
      answer: false,
      explanation: "Sai! 20 trừ 8 bằng 12",
    },
    {
      question: "3 × 4 = 12",
      answer: true,
      explanation: "Đúng! 3 nhân 4 bằng 12",
    },
    {
      question: "15 ÷ 3 = 4",
      answer: false,
      explanation: "Sai! 15 chia 3 bằng 5",
    },
    {
      question: "7 + 8 = 15",
      answer: true,
      explanation: "Đúng! 7 cộng 8 bằng 15",
    },
    // Added from user's list
    // Các câu ngữ cảnh thực tế đã phân bổ sang Matching/Comparison
    {
      question: "Hùng có nhiều bi gấp 3 lần Nam (Nam có 5) nên Hùng có 15 viên",
      answer: true,
      explanation: "5 × 3 = 15",
    },
    {
      question: "Mẹ 35 tuổi, gấp 5 lần tuổi Lan (Lan 7 tuổi)",
      answer: true,
      explanation: "7 × 5 = 35",
    },
    {
      question: "Có 6 bông hoa, nếu nhân 4 lần thì được 20 bông",
      answer: false,
      explanation: "6 × 4 = 24, không phải 20",
    },
    {
      question: "Có 9 quyển vở, gấp 3 lần thành 27 quyển",
      answer: true,
      explanation: "9 × 3 = 27",
    },
  ];

  const question = questions[currentQuestion];

  const handleAnswer = (answer: boolean) => {
    setSelectedAnswer(answer);
    const isCorrect = answer === question.answer;

    if (isCorrect) {
      setFeedback("correct");
      setTimeout(() => {
        if (questionsAnswered + 1 >= questions.length) {
          onComplete(10);
        } else {
          setCurrentQuestion(currentQuestion + 1);
          setFeedback(null);
          setSelectedAnswer(null);
          setQuestionsAnswered(questionsAnswered + 1);
        }
      }, 1500);
    } else {
      setFeedback("incorrect");
      setTimeout(() => {
        if (questionsAnswered + 1 >= questions.length) {
          onComplete(5);
        } else {
          setCurrentQuestion(currentQuestion + 1);
          setFeedback(null);
          setSelectedAnswer(null);
          setQuestionsAnswered(questionsAnswered + 1);
        }
      }, 1500);
    }
  };

  return (
    <Tilt3D className="shine-3d">
      <div className="truefalse-gradient rounded-2xl p-7 max-w-3xl shadow-2xl border border-white/30 text-white glow-3d relative overflow-hidden">
        <div className="orb bg-fuchsia-300 size-48 -top-12 -left-10" />
        <div className="orb bg-pink-300 size-36 -bottom-10 -right-8" />
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black gradient-text drop-shadow-lg mb-2 tracking-wide">
            ✓✗ Đúng Hay Sai?
          </h2>
          <p className="text-white/90 text-sm drop-shadow-md mb-4 float-soft">
            Chọn Đúng hoặc Sai
          </p>

          {/* Progress Indicator */}
          <ProgressDots
            total={questions.length}
            current={currentQuestion}
            doneColor="bg-emerald-300"
          />
        </div>

        {/* Question Area */}
        <div className="glass-card truefalse-glass rounded-xl p-7 mb-8">
          <div className="text-center">
            <p className="text-white text-sm font-bold mb-4 drop-shadow-md">
              Câu {currentQuestion + 1} / {questions.length}
            </p>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-5 border border-white/30 mb-6 shine-3d">
              <p className="text-4xl font-extrabold text-white drop-shadow-lg">
                {question.question}
              </p>
            </div>

            {/* Answer Buttons */}
            <div className="grid grid-cols-2 gap-5">
              <button
                onClick={() => handleAnswer(true)}
                disabled={selectedAnswer !== null}
                className={`py-5 px-6 rounded-xl font-extrabold text-2xl transition-all border shadow-lg truefalse-glass button-shimmer ${
                  selectedAnswer === true
                    ? feedback === "correct"
                      ? "bg-emerald-500 text-white"
                      : "bg-rose-500 text-white"
                    : "text-white hover:bg-white/20 hover:shadow-xl"
                }`}
              >
                ✓ Đúng
              </button>
              <button
                onClick={() => handleAnswer(false)}
                disabled={selectedAnswer !== null}
                className={`py-5 px-6 rounded-xl font-extrabold text-2xl transition-all border shadow-lg truefalse-glass button-shimmer ${
                  selectedAnswer === false
                    ? feedback === "correct"
                      ? "bg-emerald-500 text-white"
                      : "bg-rose-500 text-white"
                    : "text-white hover:bg-white/20 hover:shadow-xl"
                }`}
              >
                ✗ Sai
              </button>
            </div>
          </div>
        </div>

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

        {/* Explanation */}
        {selectedAnswer !== null && (
          <div className="glass-card rounded-lg p-4 mb-5">
            <p className="text-white font-semibold text-sm text-center drop-shadow-md">
              {question.explanation}
            </p>
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
