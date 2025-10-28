"use client";
import { useMemo, useState } from "react";
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
  const [requireCorrection, setRequireCorrection] = useState(false);
  const [correctionInput, setCorrectionInput] = useState("");
  const [correctionError, setCorrectionError] = useState<string | null>(null);

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
      question:
        "Một con đường dài 12 km. Người ta làm ngắn lại 3 lần, đường còn 4 km.",
      answer: true,
      explanation: "Đúng, 12 ÷ 3 = 4",
    },
    {
      question:
        "Bà có 24 quả trứng, chia đều cho 6 giỏ, mỗi giỏ có 3 quả trứng.",
      answer: false,
      explanation: "Sai, 24 ÷ 6 = 4 (mỗi giỏ 4 quả)",
      correctValue: 4,
      correctionPrompt: "Nhập số quả đúng mỗi giỏ",
    },
    {
      question: "Một cây cao 18 m, nếu giảm đi 3 lần, thì còn 9 m.",
      answer: false,
      explanation: "Sai, 18 ÷ 3 = 6 (còn 6 m)",
      correctValue: 6,
      correctionPrompt: "Nhập chiều cao đúng (m)",
    },
    {
      question:
        "Một người thợ làm 20 cái bánh, giảm đi 5 lần, thì còn 4 cái bánh.",
      answer: true,
      explanation: "Đúng, 20 ÷ 5 = 4",
    },
    {
      question:
        "Một cửa hàng có 40 quyển vở, giảm đi 4 lần, thì còn 10 quyển vở.",
      answer: true,
      explanation: "Đúng, 40 ÷ 4 = 10",
    },
    {
      question: "Một thùng sữa có 12 lít, giảm đi 2 lần, thì còn 8 lít.",
      answer: false,
      explanation: "Sai, 12 ÷ 2 = 6 (còn 6 lít)",
      correctValue: 6,
      correctionPrompt: "Nhập số lít đúng",
    },
    {
      question: "Một khúc vải dài 30 m, chia đều làm 5 phần, mỗi phần dài 6 m.",
      answer: true,
      explanation: "Đúng, 30 ÷ 5 = 6",
    },
    {
      question: "Một lớp có 18 bạn, giảm đi 3 lần, thì còn 9 bạn.",
      answer: false,
      explanation: "Sai, 18 ÷ 3 = 6 (còn 6 bạn)",
      correctValue: 6,
      correctionPrompt: "Nhập số bạn đúng",
    },
    {
      question:
        "Một người nông dân gieo bằng tay cần 60 kg giống, gieo bằng máy tiết kiệm 3 lần, thì chỉ cần 20 kg giống.",
      answer: true,
      explanation: "Đúng, 60 ÷ 3 = 20",
    },
    {
      question: "Mẹ mua 16 quả cam, chia đều cho 4 người, mỗi người 3 quả.",
      answer: false,
      explanation: "Sai, 16 ÷ 4 = 4 (mỗi người 4 quả)",
      correctValue: 4,
      correctionPrompt: "Nhập số quả đúng mỗi người",
    },
    {
      question: "Một đoạn dây dài 8 cm, giảm đi 4 lần, thì còn 2 cm.",
      answer: true,
      explanation: "Đúng, 8 ÷ 4 = 2",
    },
    {
      question:
        "Một người thợ đan 15 chiếc rổ mỗi ngày. Nếu năng suất giảm đi 3 lần, thì còn làm được 5 chiếc rổ mỗi ngày.",
      answer: true,
      explanation: "Đúng, 15 ÷ 3 = 5",
    },
  ] as const;

  const question = questions[currentQuestion];

  const handleAnswer = (answer: boolean) => {
    setSelectedAnswer(answer);
    setCorrectionError(null);

    // If the statement is false, user must pick "Sai" AND then input the correct value
    if (question.answer === false) {
      if (answer === false) {
        // Correctly identified false; now require correction input
        setFeedback("correct");
        if (correctSfx) {
          try {
            correctSfx.currentTime = 0;
            correctSfx.play();
          } catch {}
        }
        setRequireCorrection(true);
      } else {
        // Picked Đúng on a false statement -> incorrect
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
        }, 1000);
      }
      return;
    }

    // If the statement is true, normal behavior
    const isCorrect = answer === true;
    if (isCorrect) {
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
          setFeedback(null);
          setSelectedAnswer(null);
          setQuestionsAnswered(questionsAnswered + 1);
          setRequireCorrection(false);
          setCorrectionInput("");
        }
      }, 1200);
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
      }, 1000);
    }
  };

  const submitCorrection = () => {
    const q: any = questions[currentQuestion] as any;
    if (q.correctValue === undefined) return;
    if (String(q.correctValue) === correctionInput.trim()) {
      setFeedback("correct");
      setCorrectionError(null);
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
          setFeedback(null);
          setSelectedAnswer(null);
          setQuestionsAnswered(questionsAnswered + 1);
          setRequireCorrection(false);
          setCorrectionInput("");
        }
      }, 800);
    } else {
      setCorrectionError("Chưa đúng, thử lại nhé!");
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

            {/* Correction input for false statements */}
            {requireCorrection &&
              (questions[currentQuestion] as any).correctValue !==
                undefined && (
                <div className="mt-6">
                  <div className="glass-card rounded-lg p-4 mb-3">
                    <p className="text-white font-semibold text-sm text-center">
                      {(questions[currentQuestion] as any).correctionPrompt ||
                        "Nhập đáp án đúng"}
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <input
                      type="number"
                      value={correctionInput}
                      onChange={(e) => setCorrectionInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") submitCorrection();
                      }}
                      placeholder="Nhập số đúng"
                      className="px-4 py-2 rounded-lg font-bold text-center w-40 bg-white/90 text-slate-800 focus:outline-none focus:ring-2 focus:ring-fuchsia-300"
                    />
                    <button
                      onClick={submitCorrection}
                      className="px-4 py-2 rounded-lg btn-glass text-sm font-bold"
                    >
                      Xác nhận
                    </button>
                  </div>
                  {correctionError && (
                    <p className="text-center text-sm text-rose-200 mt-2 font-bold">
                      {correctionError}
                    </p>
                  )}
                </div>
              )}
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
