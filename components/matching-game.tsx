"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";

interface MatchingPair {
  id: string;
  original: number;
  reduced: number;
  reduction: number;
}

const MATCHING_PAIRS: MatchingPair[] = [
  { id: "1", original: 20, reduced: 10, reduction: 2 },
  { id: "2", original: 30, reduced: 10, reduction: 3 },
  { id: "3", original: 40, reduced: 8, reduction: 5 },
  { id: "4", original: 50, reduced: 10, reduction: 5 },
  { id: "5", original: 24, reduced: 6, reduction: 4 },
];

export default function MatchingGame({
  onScore,
  onBack,
}: {
  onScore: (score: number) => void;
  onBack: () => void;
}) {
  const [pairs, setPairs] = useState<MatchingPair[]>(MATCHING_PAIRS);
  const [matches, setMatches] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [draggedFrom, setDraggedFrom] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "correct" | "wrong";
    message: string;
  } | null>(null);

  const handleDragStart = (id: string) => {
    setDraggedFrom(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetId: string) => {
    if (!draggedFrom || draggedFrom === targetId) return;

    const fromPair = pairs.find((p) => p.id === draggedFrom);
    const toPair = pairs.find((p) => p.id === targetId);

    if (fromPair && toPair) {
      // Check if they match (original from one should match reduced from another)
      if (
        fromPair.original === toPair.reduced ||
        fromPair.reduced === toPair.original
      ) {
        const newMatches = new Set(matches);
        newMatches.add(draggedFrom);
        newMatches.add(targetId);
        setMatches(newMatches);

        const newScore = score + 10;
        setScore(newScore);
        onScore(newScore);

        setFeedback({ type: "correct", message: "✅ Chính xác!" });
        setTimeout(() => setFeedback(null), 1500);
      } else {
        setFeedback({ type: "wrong", message: "❌ Sai rồi, thử lại!" });
        setTimeout(() => setFeedback(null), 1500);
      }
    }

    setDraggedFrom(null);
  };

  const isComplete = matches.size === pairs.length;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 select-none">
      <div className="max-w-6xl w-full">
        <h2 className="text-3xl font-bold text-center mb-8 text-purple-600">
          🔗 Nối Cặp Số - Kéo Thả Mũi Tên
        </h2>

        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`text-center text-2xl font-bold mb-6 p-4 rounded-lg ${
              feedback.type === "correct"
                ? "bg-green-200 text-green-800"
                : "bg-red-200 text-red-800"
            }`}
          >
            {feedback.message}
          </motion.div>
        )}

        <div className="grid grid-cols-2 gap-12 mb-8">
          {/* Left Column - Original Numbers */}
          <div className="bg-blue-100 rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-blue-700 mb-6 text-center">
              📊 Số Ban Đầu
            </h3>
            <div className="space-y-4">
              {pairs.map((pair) => (
                <motion.div
                  key={pair.id}
                  draggable
                  onDragStart={() => handleDragStart(pair.id)}
                  className={`bg-white rounded-xl p-6 text-center cursor-move shadow-md hover:shadow-lg transition-all ${
                    matches.has(pair.id) ? "opacity-50 line-through" : ""
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileDrag={{ scale: 1.1, opacity: 0.8 }}
                >
                  <div className="text-4xl font-bold text-blue-600">
                    {pair.original}
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    Giảm {pair.reduction} lần
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column - Reduced Numbers */}
          <div className="bg-green-100 rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-green-700 mb-6 text-center">
              ✨ Số Sau Khi Giảm
            </h3>
            <div className="space-y-4">
              {pairs.map((pair) => (
                <motion.div
                  key={`reduced-${pair.id}`}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(pair.id)}
                  className={`bg-white rounded-xl p-6 text-center cursor-pointer shadow-md hover:shadow-lg transition-all border-2 border-dashed border-green-300 ${
                    matches.has(pair.id) ? "opacity-50 line-through" : ""
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-4xl font-bold text-green-600">
                    {pair.reduced}
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    Kéo thả số từ trái
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-yellow-300 to-orange-300 rounded-2xl p-8 text-center shadow-xl"
          >
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-3xl font-bold text-orange-700 mb-2">
              Tuyệt Vời!
            </h3>
            <p className="text-xl text-orange-600 mb-6">
              Bạn đã hoàn thành bài tập với {score} ⭐
            </p>
            <button
              onClick={onBack}
              className="bg-orange-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-700 transition"
            >
              Quay lại Menu
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
