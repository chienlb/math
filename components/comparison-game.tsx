"use client"

import { useState } from "react"
import { motion } from "framer-motion"

interface ComparisonQuestion {
  id: string
  number1: number
  number2: number
  multiple: number
  options: string[]
  correct: string
}

const COMPARISON_QUESTIONS: ComparisonQuestion[] = [
  {
    id: "1",
    number1: 5,
    number2: 20,
    multiple: 4,
    options: ["5 gấp 4 lần 20", "20 gấp 4 lần 5", "5 = 20"],
    correct: "20 gấp 4 lần 5",
  },
  {
    id: "2",
    number1: 3,
    number2: 15,
    multiple: 5,
    options: ["3 gấp 5 lần 15", "15 gấp 5 lần 3", "3 = 15"],
    correct: "15 gấp 5 lần 3",
  },
  {
    id: "3",
    number1: 6,
    number2: 30,
    multiple: 5,
    options: ["6 gấp 5 lần 30", "30 gấp 5 lần 6", "6 = 30"],
    correct: "30 gấp 5 lần 6",
  },
  {
    id: "4",
    number1: 4,
    number2: 12,
    multiple: 3,
    options: ["4 gấp 3 lần 12", "12 gấp 3 lần 4", "4 = 12"],
    correct: "12 gấp 3 lần 4",
  },
  {
    id: "5",
    number1: 7,
    number2: 35,
    multiple: 5,
    options: ["7 gấp 5 lần 35", "35 gấp 5 lần 7", "7 = 35"],
    correct: "35 gấp 5 lần 7",
  },
]

export default function ComparisonGame({ onScore, onBack }: { onScore: (score: number) => void; onBack: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState<{ type: "correct" | "wrong"; message: string } | null>(null)
  const [answered, setAnswered] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)

  const currentQuestion = COMPARISON_QUESTIONS[currentIndex]

  const handleSelectAnswer = (answer: string) => {
    if (answered) return

    setSelectedAnswer(answer)

    if (answer === currentQuestion.correct) {
      const newScore = score + 10
      setScore(newScore)
      onScore(newScore)
      setFeedback({ type: "correct", message: "✅ Chính xác!" })
      setAnswered(true)

      setTimeout(() => {
        if (currentIndex < COMPARISON_QUESTIONS.length - 1) {
          setCurrentIndex(currentIndex + 1)
          setFeedback(null)
          setAnswered(false)
          setSelectedAnswer(null)
        }
      }, 1500)
    } else {
      setFeedback({ type: "wrong", message: "❌ Sai rồi, thử lại!" })
    }
  }

  const isComplete = currentIndex === COMPARISON_QUESTIONS.length - 1 && answered

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <h2 className="text-3xl font-bold text-center mb-8 text-orange-600">⚖️ So Sánh Số Gấp Nhiều Lần</h2>

        <div className="bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl p-8 shadow-lg mb-8">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-8 mb-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl p-6 shadow-md"
              >
                <div className="text-5xl font-bold text-orange-600">{currentQuestion.number1}</div>
              </motion.div>
              <div className="text-4xl font-bold text-orange-600">?</div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl p-6 shadow-md"
              >
                <div className="text-5xl font-bold text-orange-600">{currentQuestion.number2}</div>
              </motion.div>
            </div>
            <p className="text-lg text-gray-700 font-semibold">Chọn câu so sánh đúng:</p>
          </div>

          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-center text-xl font-bold p-4 rounded-lg mb-6 ${
                feedback.type === "correct" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
              }`}
            >
              {feedback.message}
            </motion.div>
          )}

          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => (
              <motion.button
                key={idx}
                onClick={() => handleSelectAnswer(option)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full p-4 rounded-lg font-bold text-lg transition-all ${
                  selectedAnswer === option
                    ? option === currentQuestion.correct
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                    : "bg-white text-orange-600 hover:bg-orange-50 border-2 border-orange-300"
                }`}
              >
                {option}
              </motion.button>
            ))}
          </div>
        </div>

        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-yellow-300 to-orange-300 rounded-2xl p-8 text-center shadow-xl"
          >
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-3xl font-bold text-orange-700 mb-2">Tuyệt Vời!</h3>
            <p className="text-xl text-orange-600 mb-6">Bạn đã hoàn thành bài tập với {score} ⭐</p>
            <button
              onClick={onBack}
              className="bg-orange-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-700 transition"
            >
              Quay lại Menu
            </button>
          </motion.div>
        )}

        <div className="text-center mt-8">
          <p className="text-gray-600">
            Câu {currentIndex + 1} / {COMPARISON_QUESTIONS.length}
          </p>
          <div className="w-full bg-gray-300 rounded-full h-2 mt-2">
            <div
              className="bg-orange-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentIndex + 1) / COMPARISON_QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
