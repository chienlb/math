"use client"

export default function GameMenu({ onSelectGame }: { onSelectGame: (game: string) => void }) {
  const games = [
    {
      id: "matching",
      title: "🎯 Nối Cặp Số",
      description: 'Kéo thả mũi tên nối giữa "Số ban đầu" và "Số sau khi giảm"',
      color: "from-blue-400 to-blue-600",
      icon: "🔗",
    },
    {
      id: "fill-blank",
      title: "✏️ Điền Số Còn Thiếu",
      description: "Điền số còn thiếu vào dãy số",
      color: "from-green-400 to-green-600",
      icon: "📝",
    },
    {
      id: "comparison",
      title: "⚖️ So Sánh Số",
      description: "So sánh số gấp nhiều lần và ghép cặp đúng",
      color: "from-orange-400 to-orange-600",
      icon: "🔢",
    },
  ]

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-bold text-purple-600 mb-4">Chọn Bài Tập</h2>
        <p className="text-xl text-gray-600">Hãy chọn một bài tập để bắt đầu học tập!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
        {games.map((game) => (
          <button
            key={game.id}
            onClick={() => onSelectGame(game.id)}
            className={`bg-gradient-to-br ${game.color} rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer`}
          >
            <div className="text-6xl mb-4">{game.icon}</div>
            <h3 className="text-2xl font-bold mb-3">{game.title}</h3>
            <p className="text-sm opacity-90">{game.description}</p>
          </button>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-gray-600 text-lg">💡 Mỗi câu trả lời đúng bạn sẽ nhận được ⭐ sao!</p>
      </div>
    </div>
  )
}
