"use client"

import { useState } from "react"
import { motion } from "framer-motion"

interface BlankQuestion {
  id: string
  sequence: number[]
  blankIndex: number
  hint: string
}

const BLANK_QUESTIONS: BlankQuestion[] = [
  { id: "1", sequence: [2, 4, 6, 0, 10], blankIndex: 3, hint: "Dãy số chẵn" },
  { id: "2", sequence: [5, 10, 15, 0, 25], blankIndex: 3, hint: "Bội số của 5" },
  { id: "3", sequence: [1, 1, 2, 3, 5, 0, 13], blankIndex: 5, hint: "Dãy Fibonacci" },
  { id: "4", sequence: [10, 20, 30, 0, 50], blankIndex: 3, hint: "Bội số của 10" },
  { id: "5", sequence: [3, 6, 9, 0, 15], blankIndex: 3, hint: "Bội số của 3" },
]

export default function FillInTheBlank({ onScore, onBack }: { onScore: (score: number) => void; onBack: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [input, setInput] = useState("")
  const [feedback, setFeedback] = useState<{ type: "correct" | "wrong"; message: string } | null>(null)
  const [answered, setAnswered] = useState(false)

  const currentQuestion = BLANK_QUESTIONS[currentIndex]
  const correctAnswer = currentQuestion.sequence[currentQuestion.blankIndex]

  const handleSubmit = () => {
    const userAnswer = Number.parseInt(input)

    if (userAnswer === correctAnswer) {
      const newScore = score + 10
      setScore(newScore)
      onScore(newScore)
      setFeedback({ type: "correct", message: "✅ Chính xác!" })
      setAnswered(true)

      setTimeout(() => {
        if (currentIndex < BLANK_QUESTIONS.length - 1) {
          setCurrentIndex(currentIndex + 1)
          setInput("")
          setFeedback(null)
          setAnswered(false)
        }
      }, 1500)
    } else {
      setFeedback({ type: "wrong", message: `❌ Sai rồi! Đáp án là ${correctAnswer}` })
    }
  }

  const isComplete = currentIndex === BLANK_QUESTIONS.length - 1 && answered

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <h2 className="text-3xl font-bold text-center mb-8 text-green-600">✏️ Điền Số Còn Thiếu</h2>

        <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-8 shadow-lg mb-8">
          <div className="text-center mb-6">
            <p className="text-gray-600 text-lg mb-4">💡 Gợi ý: {currentQuestion.hint}</p>
            <div className="flex justify-center items-center gap-4 flex-wrap">
              {currentQuestion.sequence.map((num, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`w-16 h-16 rounded-lg flex items-center justify-center text-2xl font-bold shadow-md ${
                    idx === currentQuestion.blankIndex
                      ? "bg-yellow-300 text-yellow-700 border-4 border-yellow-500"
                      : "bg-white text-green-600"
                  }`}
                >
                  {idx === currentQuestion.blankIndex ? "?" : num}
                </motion.div>
              ))}
            </div>
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

          {!answered && (
            <div className="flex gap-4 justify-center mt-8">
              <input
                type="number"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="Nhập số..."
                className="px-6 py-3 rounded-lg text-xl font-bold border-2 border-green-400 focus:outline-none focus:border-green-600 w-32 text-center"
              />
              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition"
              >
                Kiểm Tra
              </button>
            </div>
          )}
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
            Câu {currentIndex + 1} / {BLANK_QUESTIONS.length}
          </p>
          <div className="w-full bg-gray-300 rounded-full h-2 mt-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentIndex + 1) / BLANK_QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
