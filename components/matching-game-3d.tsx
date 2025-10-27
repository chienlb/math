"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import Tilt3D from "./ui/tilt";
import ProgressDots from "./ui/progress-dots";

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
  const [puzzleVisible, setPuzzleVisible] = useState(false);
  const [revealedLetters, setRevealedLetters] = useState(0);
  const [guessInput, setGuessInput] = useState("");
  const [isWordSolved, setIsWordSolved] = useState(false);
  const PUZZLE_TIME = 20; // seconds
  const [timeLeft, setTimeLeft] = useState(PUZZLE_TIME);
  const [guessingEnabled, setGuessingEnabled] = useState(true);
  const [awaitingPuzzle, setAwaitingPuzzle] = useState(false);
  const [postRevealSeconds, setPostRevealSeconds] = useState<number | null>(
    null
  );
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);

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
  useEffect(() => {
    if (correctSfx) correctSfx.volume = 0.6;
    if (wrongSfx) wrongSfx.volume = 0.6;
  }, [correctSfx, wrongSfx]);

  const questions = [
    {
      title: "Giảm số đi một số lần",
      description: "Ví dụ: 10 ÷ 5 = 2",
      word: "CHIAHET",
      wordHint: "Phép tính mà đáp án là số nguyên",
      pairs: [
        { original: 10, reduced: 2, operation: "giảm 5 lần" },
        { original: 8, reduced: 2, operation: "giảm 4 lần" },
        { original: 12, reduced: 6, operation: "giảm 2 lần" },
      ],
    },
    {
      title: "Giảm số đi một số lần",
      description: "Ví dụ: 16 ÷ 4 = 4",
      word: "BICHIA",
      wordHint: "Số được lấy để thực hiện phép tính",
      pairs: [
        { original: 16, reduced: 4, operation: "giảm 4 lần" },
        { original: 20, reduced: 4, operation: "giảm 5 lần" },
        { original: 18, reduced: 9, operation: "giảm 2 lần" },
      ],
    },
    {
      title: "Giảm số đi một số lần",
      description: "Ví dụ: 15 ÷ 3 = 5",
      word: "SOCHIA",
      wordHint: "Số dùng để thực hiện phép tính",
      pairs: [
        { original: 15, reduced: 5, operation: "giảm 3 lần" },
        { original: 12, reduced: 4, operation: "giảm 3 lần" },
        { original: 9, reduced: 3, operation: "giảm 3 lần" },
      ],
    },
    {
      title: "Giảm số đi một số lần",
      description: "Ví dụ: 14 ÷ 7 = 2",
      word: "CHIATRON",
      wordHint: "Phép tính không còn thừa lại",
      pairs: [
        { original: 14, reduced: 2, operation: "giảm 7 lần" },
        { original: 24, reduced: 6, operation: "giảm 4 lần" },
        { original: 21, reduced: 3, operation: "giảm 7 lần" },
      ],
    },
    {
      title: "Giảm số đi một số lần",
      description: "Ví dụ: 24 ÷ 8 = 3",
      word: "KETQUA",
      wordHint: "Điều ta nhận được sau khi tính xong",
      pairs: [
        { original: 24, reduced: 3, operation: "giảm 8 lần" },
        { original: 20, reduced: 5, operation: "giảm 4 lần" },
        { original: 18, reduced: 6, operation: "giảm 3 lần" },
        { original: 16, reduced: 8, operation: "giảm 2 lần" },
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

  // Countdown effect: only starts after all connections are done (awaitingPuzzle)
  useEffect(() => {
    if (!awaitingPuzzle || isWordSolved) return;
    if (!guessingEnabled) return;
    if (timeLeft <= 0) {
      setGuessingEnabled(false);
      // Reveal the crossword automatically when time is up
      setIsWordSolved(true);
      setRevealedLetters(question.word.length);
      // Give 10s for user to view keyword before auto-advancing
      setPostRevealSeconds(10);
      return;
    }
    const t = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(t);
  }, [
    awaitingPuzzle,
    isWordSolved,
    guessingEnabled,
    timeLeft,
    questionsAnswered,
    questions.length,
    currentQuestion,
  ]);

  // Post-reveal grace period countdown
  useEffect(() => {
    if (postRevealSeconds === null) return;
    if (postRevealSeconds <= 0) {
      // advance to next question
      if (questionsAnswered + 1 >= questions.length) {
        onComplete(10);
      } else {
        setCurrentQuestion(currentQuestion + 1);
        setConnections([]);
        setFeedback(null);
        setQuestionsAnswered(questionsAnswered + 1);
        setPuzzleVisible(false);
        setRevealedLetters(0);
        setGuessInput("");
        setIsWordSolved(false);
        setGuessingEnabled(true);
        setTimeLeft(PUZZLE_TIME);
        setAwaitingPuzzle(false);
        setSelectedKeyword(null);
      }
      setPostRevealSeconds(null);
      return;
    }
    const t = setTimeout(() => {
      setPostRevealSeconds((s) => (s === null ? null : s - 1));
    }, 1000);
    return () => clearTimeout(t);
  }, [
    postRevealSeconds,
    questionsAnswered,
    questions.length,
    currentQuestion,
    onComplete,
  ]);

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
      // play correct sound
      if (correctSfx) {
        try {
          correctSfx.currentTime = 0;
          correctSfx.play();
        } catch {}
      }

      // Reveal crossword after first correct, and reveal more letters as we connect
      if (!puzzleVisible) {
        setPuzzleVisible(true);
      }
      const newRevealCount = Math.min(
        newConnections.length,
        question.word.length
      );
      setRevealedLetters(newRevealCount);
      // Do not start timer yet; timer begins only when all connections are correct

      if (newConnections.length === question.pairs.length) {
        if (puzzleVisible && !isWordSolved) {
          // Wait for the player to guess the word or timer to end
          setAwaitingPuzzle(true);
          setGuessingEnabled(true);
          setTimeLeft(PUZZLE_TIME);
        } else {
          setTimeout(() => {
            if (questionsAnswered + 1 >= questions.length) {
              onComplete(10);
            } else {
              setCurrentQuestion(currentQuestion + 1);
              setConnections([]);
              setFeedback(null);
              setQuestionsAnswered(questionsAnswered + 1);
              setPuzzleVisible(false);
              setRevealedLetters(0);
              setGuessInput("");
              setIsWordSolved(false);
              setGuessingEnabled(true);
              setTimeLeft(PUZZLE_TIME);
              setAwaitingPuzzle(false);
            }
          }, 1500);
        }
      } else {
        setTimeout(() => setFeedback(null), 800);
      }
    } else {
      setFeedback("incorrect");
      // play wrong sound
      if (wrongSfx) {
        try {
          wrongSfx.currentTime = 0;
          wrongSfx.play();
        } catch {}
      }
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  const normalize = (s: string) =>
    s.toString().trim().toUpperCase().replace(/\s+/g, "");

  const handleGuess = () => {
    if (!puzzleVisible) return;
    if (!guessingEnabled) return;
    const target = normalize(question.word);
    const guess = normalize(guessInput);
    if (!guess) return;
    if (guess === target) {
      setIsWordSolved(true);
      setFeedback("correct");
      setRevealedLetters(question.word.length);
      if (correctSfx) {
        try {
          correctSfx.currentTime = 0;
          correctSfx.play();
        } catch {}
      }
      setTimeout(() => setFeedback(null), 1000);
      if (awaitingPuzzle || connections.length === question.pairs.length) {
        // After correct guess and all connections done, proceed
        setTimeout(() => {
          if (questionsAnswered + 1 >= questions.length) {
            onComplete(10);
          } else {
            setCurrentQuestion(currentQuestion + 1);
            setConnections([]);
            setFeedback(null);
            setQuestionsAnswered(questionsAnswered + 1);
            setPuzzleVisible(false);
            setRevealedLetters(0);
            setGuessInput("");
            setIsWordSolved(false);
            setGuessingEnabled(true);
            setTimeLeft(PUZZLE_TIME);
            setAwaitingPuzzle(false);
          }
        }, 900);
      }
      // If they solved early and all questions done or all connections already made, allow normal flow.
      // We still keep the matching task; progression remains tied to completing connections.
    } else {
      setFeedback("incorrect");
      if (wrongSfx) {
        try {
          wrongSfx.currentTime = 0;
          wrongSfx.play();
        } catch {}
      }
      setTimeout(() => setFeedback(null), 900);
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
          <ProgressDots total={questions.length} current={currentQuestion} />
        </div>

        {/* Matching Area */}
        <div
          ref={containerRef}
          className={`relative glass-card rounded-xl mb-6 matching-glass transition-all duration-300 ease-out ${
            connections.length === question.pairs.length
              ? "opacity-0 scale-95 max-h-0 p-0 overflow-hidden pointer-events-none"
              : "p-5"
          }`}
        >
          {/* SVG for connection lines */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ overflow: "visible" }}
          >
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

          <div className="grid grid-cols-2 gap-24 relative z-10">
            {/* Left Column */}
            <div className="space-y-3">
              <h3 className="font-bold text-center mb-3 text-sm text-white drop-shadow-md">
                📍 Phép Tính
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
                    className={`rounded-xl text-center shadow-lg transition-all duration-300 ease-out flex items-center justify-center ${
                      isConnected
                        ? "opacity-0 scale-90 max-h-0 p-0 m-0 border-0 overflow-hidden pointer-events-none"
                        : "bg-white/10 border border-white/30 p-4 text-white font-bold text-2xl cursor-grab active:cursor-grabbing hover:bg-white/20 hover:shadow-xl"
                    }`}
                  >
                    {pair.original} {pair.operation}
                  </div>
                );
              })}
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
                    className={`rounded-xl text-center shadow-lg transition-all duration-300 ease-out ${
                      isConnected
                        ? "opacity-0 scale-90 max-h-0 p-0 m-0 border-0 overflow-hidden pointer-events-none"
                        : "bg-white/10 border border-white/30 p-4 text-white font-bold text-2xl cursor-pointer hover:bg-white/20 hover:shadow-xl"
                    }`}
                  >
                    {question.pairs[pairIndex].reduced}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Crossword Puzzle */}
        {puzzleVisible && (
          <div className="glass-card rounded-xl p-4 mb-4 border border-white/30">
            <div className="mb-3 text-center">
              <p className="text-xs font-bold text-white/80">Ô chữ chủ đề</p>
              <p className="text-lg font-extrabold tracking-wider text-white drop-shadow">
                NỐI SỐ
              </p>
            </div>

            {/* Timer */}
            {awaitingPuzzle && (
              <div className="flex items-center justify-center mb-3">
                <div
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    timeLeft <= 5
                      ? "bg-rose-500 border-white/30"
                      : "bg-emerald-500 border-white/30"
                  }`}
                >
                  ⏳ {timeLeft}s
                </div>
              </div>
            )}

            {/* Letters Row */}
            <div className="flex items-center justify-center gap-2 mb-4">
              {question.word.split("").map((ch, idx) => (
                <div
                  key={`ltr-${idx}`}
                  className={`w-10 h-12 flex items-center justify-center rounded-lg border text-xl font-black tracking-widest shadow-md ${
                    idx < revealedLetters || isWordSolved
                      ? "bg-white text-slate-800 border-white/60"
                      : "bg-white/10 text-white/70 border-white/30"
                  }`}
                >
                  {idx < revealedLetters || isWordSolved ? ch : ""}
                </div>
              ))}
            </div>

            {/* Hint */}
            {awaitingPuzzle && !isWordSolved && (
              <div className="text-center mb-3">
                <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg px-3 py-2 mb-2">
                  <p className="text-yellow-200 text-sm font-bold">
                    💡 Gợi ý: {question.wordHint}
                  </p>
                </div>
                {timeLeft <= 10 && (
                  <div className="bg-orange-500/20 border border-orange-400/30 rounded-lg px-3 py-2">
                    <p className="text-orange-200 text-sm font-bold">
                      🔥 Gợi ý thêm: Có {question.word.length} chữ cái, bắt đầu
                      bằng "{question.word[0]}"
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Guess Input */}
            <div className="flex items-center gap-2 justify-center">
              <input
                value={guessInput}
                onChange={(e) => setGuessInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleGuess();
                }}
                placeholder="Đoán ô chữ..."
                disabled={!guessingEnabled}
                className={`px-3 py-2 rounded-lg font-semibold placeholder-slate-500 w-48 focus:outline-none focus:ring-2 focus:ring-cyan-300 ${
                  guessingEnabled
                    ? "bg-white/90 text-slate-800"
                    : "bg-white/40 text-slate-500"
                }`}
              />
              <button
                onClick={handleGuess}
                disabled={!guessingEnabled}
                className={`px-4 py-2 rounded-lg btn-glass text-sm font-bold ${
                  guessingEnabled ? "" : "opacity-60 cursor-not-allowed"
                }`}
              >
                Đoán
              </button>
            </div>

            {/* Post-reveal view and keyword selection */}
            {awaitingPuzzle && postRevealSeconds !== null && (
              <div className="mt-4 text-center">
                <div className="mb-2 text-white text-sm">
                  Hết thời gian! Từ khóa: {question.word}
                </div>
                <div className="flex items-center justify-center gap-3 mb-3">
                  <button
                    onClick={() => setSelectedKeyword(question.word)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                      selectedKeyword
                        ? "bg-cyan-500 text-white border-white/30"
                        : "bg-white/10 text-white border-white/30 hover:bg-white/20"
                    }`}
                  >
                    Chọn từ khóa: {question.word}
                  </button>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <div className="text-xs text-white/90">
                    Tự động tiếp tục sau {postRevealSeconds}s
                  </div>
                  <button
                    onClick={() => setPostRevealSeconds(0)}
                    className="px-3 py-1.5 rounded-lg btn-glass text-xs font-bold"
                  >
                    Tiếp tục
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

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
