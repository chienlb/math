"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import Tilt3D from "./ui/tilt";

interface MatchingGameProps {
  onComplete: (score: number) => void;
}

interface Connection {
  from: number;
  to: number;
}

export default function MatchingGame3D({ onComplete }: MatchingGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(
    null
  );
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [dragging, setDragging] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const leftItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const rightItemsRef = useRef<(HTMLDivElement | null)[]>([]);

  const questions = [
    {
      title: "Nối số ban đầu với số sau khi giảm",
      description: "Ví dụ: 10 giảm 5 = 5",
      pairs: [
        { original: 10, reduced: 5, operation: "Giảm 5" },
        { original: 20, reduced: 10, operation: "Giảm 10" },
        { original: 15, reduced: 12, operation: "Giảm 3" },
      ],
    },
    {
      title: "Nối số ban đầu với số sau khi giảm",
      description: "Ví dụ: 8 giảm 4 = 4",
      pairs: [
        { original: 8, reduced: 4, operation: "Giảm 4" },
        { original: 12, reduced: 6, operation: "Giảm 6" },
        { original: 18, reduced: 15, operation: "Giảm 3" },
      ],
    },
    {
      title: "Gấp số lên để được kết quả",
      description: "Kéo nối số gốc với kết quả sau khi nhân",
      pairs: [
        { original: 5, reduced: 10, operation: "Nhân 2 lần" },
        { original: 6, reduced: 30, operation: "Nhân 5 lần" },
        { original: 3, reduced: 24, operation: "Nhân 8 lần" },
      ],
    },
    {
      title: "Gấp số lên để được kết quả",
      description: "Ví dụ: 7 × 2 = 14",
      pairs: [
        { original: 7, reduced: 14, operation: "Nhân 2 lần" },
        { original: 4, reduced: 20, operation: "Nhân 5 lần" },
        { original: 8, reduced: 16, operation: "Nhân 2 lần" },
      ],
    },
  ];

  const question = questions[currentQuestion];

  // Shuffle right column order so answers are not aligned with the same row
  const rightOrder = useMemo(() => {
    const n = question.pairs.length;
    const arr = Array.from({ length: n }, (_, i) => i);
    // Fisher–Yates shuffle
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    // Ensure not identity when possible
    const isIdentity = arr.every((v, i) => v === i);
    if (isIdentity && n > 1) {
      // simple rotate
      const first = arr.shift()!;
      arr.push(first);
    }
    return arr;
  }, [currentQuestion, question.pairs.length]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      if (dragging !== null) {
        const target = e.target as HTMLElement;
        const rightIndex = Number.parseInt(target.dataset.rightIndex || "-1");
        if (rightIndex !== -1) {
          handleConnect(dragging, rightIndex);
        }
        setDragging(null);
      }
    };
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, [dragging]);

  const handleConnect = (leftIndex: number, rightIndex: number) => {
    const leftOriginal = question.pairs[leftIndex].original;
    const rightReduced = question.pairs[rightIndex].reduced;

    const isCorrect = question.pairs.some(
      (pair) => pair.original === leftOriginal && pair.reduced === rightReduced
    );

    if (isCorrect) {
      const newConnections = [
        ...connections.filter(
          (c) => c.from !== leftIndex && c.to !== rightIndex
        ),
        { from: leftIndex, to: rightIndex },
      ];
      setConnections(newConnections);
      setFeedback("correct");

      if (newConnections.length === question.pairs.length) {
        setTimeout(() => {
          if (questionsAnswered + 1 >= questions.length) {
            onComplete(10);
          } else {
            setCurrentQuestion(currentQuestion + 1);
            setConnections([]);
            setFeedback(null);
            setQuestionsAnswered(questionsAnswered + 1);
          }
        }, 1500);
      } else {
        setTimeout(() => setFeedback(null), 800);
      }
    } else {
      setFeedback("incorrect");
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  const getConnectionPath = (fromIndex: number, toIndex: number) => {
    const fromEl = leftItemsRef.current[fromIndex];
    const toEl = rightItemsRef.current[toIndex];

    if (!fromEl || !toEl || !containerRef.current) return "";

    const containerRect = containerRef.current.getBoundingClientRect();
    const fromRect = fromEl.getBoundingClientRect();
    const toRect = toEl.getBoundingClientRect();

    const x1 = fromRect.right - containerRect.left;
    const y1 = fromRect.top - containerRect.top + fromRect.height / 2;
    const x2 = toRect.left - containerRect.left;
    const y2 = toRect.top - containerRect.top + toRect.height / 2;

    return `M ${x1} ${y1} Q ${(x1 + x2) / 2} ${(y1 + y2) / 2} ${x2} ${y2}`;
  };

  const getDragPreviewPath = () => {
    if (dragging === null) return "";

    const fromEl = leftItemsRef.current[dragging];
    if (!fromEl || !containerRef.current) return "";

    const containerRect = containerRef.current.getBoundingClientRect();
    const fromRect = fromEl.getBoundingClientRect();

    const x1 = fromRect.right - containerRect.left;
    const y1 = fromRect.top - containerRect.top + fromRect.height / 2;
    const x2 = mousePos.x - containerRect.left;
    const y2 = mousePos.y - containerRect.top;

    return `M ${x1} ${y1} Q ${(x1 + x2) / 2} ${(y1 + y2) / 2} ${x2} ${y2}`;
  };

  return (
    <Tilt3D className="shine-3d">
      <div className="matching-gradient select-none rounded-2xl p-7 max-w-4xl shadow-2xl border border-white/30 text-white glow-3d relative overflow-hidden">
        {/* Decorative orbs */}
        <div className="orb bg-cyan-300 size-56 -top-10 -left-10" />
        <div className="orb bg-sky-300 size-40 -bottom-10 -right-10" />
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white drop-shadow-lg mb-3">
            🔗 Nối Cặp Số
          </h2>
          <p className="text-white/90 text-sm drop-shadow-md mb-4">
            Kéo từ trái sang phải để nối cặp
          </p>

          {/* Progress Indicator */}
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

        {/* Matching Area */}
        <div
          ref={containerRef}
          className="relative glass-card rounded-xl p-5 mb-6 matching-glass"
        >
          {/* SVG for connection lines */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ overflow: "visible" }}
          >
            {/* Completed connections */}
            {connections.map((conn, idx) => (
              <path
                key={`connection-${idx}`}
                d={getConnectionPath(conn.from, conn.to)}
                stroke="#10b981"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                filter="drop-shadow(0 0 3px rgba(16, 185, 129, 0.8))"
              />
            ))}

            {/* Drag preview line */}
            {dragging !== null && (
              <path
                d={getDragPreviewPath()}
                stroke="#22d3ee"
                strokeWidth="2"
                fill="none"
                strokeDasharray="6,3"
                opacity={0.7}
              />
            )}
          </svg>

          <div className="grid grid-cols-3 gap-4 relative z-10">
            {/* Left Column */}
            <div className="space-y-3">
              <h3 className="font-bold text-center mb-3 text-sm text-white drop-shadow-md">
                📍 Số Ban Đầu
              </h3>
              {question.pairs.map((pair, i) => {
                const isConnected = connections.some((c) => c.from === i);
                return (
                  <div
                    key={`left-${i}`}
                    ref={(el) => {
                      leftItemsRef.current[i] = el;
                    }}
                    onMouseDown={() => setDragging(i)}
                    className={`bg-white/10 border border-white/30 rounded-xl p-4 text-white font-bold text-2xl text-center cursor-grab active:cursor-grabbing shadow-lg hover:bg-white/20 hover:shadow-xl transition-all ${
                      isConnected ? "ring-4 ring-emerald-300" : ""
                    }`}
                  >
                    {pair.original}
                  </div>
                );
              })}
            </div>

            {/* Middle Column */}
            <div className="flex flex-col justify-center items-center space-y-3">
              {question.pairs.map((pair, i) => (
                <div
                  key={`label-${i}`}
                  className="text-sm font-bold text-white text-center bg-white/10 px-3 py-1.5 rounded-lg shadow-md border border-white/30"
                >
                  {pair.operation}
                </div>
              ))}
            </div>

            {/* Right Column */}
            <div className="space-y-3">
              <h3 className="font-bold text-center mb-3 text-sm text-white drop-shadow-md">
                ✓ Kết Quả
              </h3>
              {rightOrder.map((pairIndex, i) => {
                const isConnected = connections.some((c) => c.to === pairIndex);
                return (
                  <div
                    key={`right-${i}`}
                    ref={(el) => {
                      if (el) rightItemsRef.current[pairIndex] = el;
                    }}
                    data-right-index={pairIndex}
                    className={`bg-white/10 border border-white/30 rounded-xl p-4 text-white font-bold text-2xl text-center cursor-pointer shadow-lg hover:bg-white/20 hover:shadow-xl transition-all ${
                      isConnected ? "ring-4 ring-emerald-300" : ""
                    }`}
                  >
                    {question.pairs[pairIndex].reduced}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <div
            className={`text-center py-2 rounded-lg font-bold text-xs mb-3 border ${
              feedback === "correct"
                ? "bg-emerald-500 text-white border-white/30"
                : "bg-rose-500 text-white border-white/30"
            }`}
          >
            {feedback === "correct" ? "✅ Chính xác!" : "❌ Thử lại!"}
          </div>
        )}

        {/* Progress Stats */}
        <div className="flex justify-between items-center mb-4 px-4 text-sm">
          <div className="text-center flex-1">
            <p className="text-white font-bold">Đã nối</p>
            <p className="text-xl font-bold text-white drop-shadow-md">
              {connections.length}/{question.pairs.length}
            </p>
          </div>
          <div className="text-center flex-1">
            <p className="text-white font-bold">Câu hỏi</p>
            <p className="text-xl font-bold text-white drop-shadow-md">
              {currentQuestion + 1}/{questions.length}
            </p>
          </div>
        </div>

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
