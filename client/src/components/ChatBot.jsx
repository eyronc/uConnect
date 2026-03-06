import { useState, useRef, useEffect } from "react"
import { useChat } from "../lib/useChat"

export default function ChatBot({ floating = false }) {
  const [open, setOpen] = useState(!floating)
  const [input, setInput] = useState("")
  const { messages, loading, sendMessage } = useChat()
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = () => {
    if (!input.trim() || loading) return
    sendMessage(input)
    setInput("")
  }

  if (floating && !open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 text-2xl shadow-xl z-50 transition-all"
      >
        💬
      </button>
    )
  }

  return (
    <div className={floating
      ? "fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200"
      : "w-full h-full flex flex-col bg-white rounded-2xl border border-gray-200"
    }>
      <div className="bg-blue-600 text-white px-4 py-3 rounded-t-2xl flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="font-semibold">uConnect Assistant</span>
        </div>
        {floating && (
          <button onClick={() => setOpen(false)} className="text-white hover:text-gray-200 text-lg">
            ✕
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`rounded-2xl px-4 py-2 max-w-[80%] text-sm leading-relaxed ${
              msg.role === "user"
                ? "bg-blue-600 text-white rounded-br-sm"
                : "bg-gray-100 text-gray-800 rounded-bl-sm"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-2 text-sm text-gray-500">
              <span className="animate-pulse">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length === 1 && (
        <div className="px-4 pb-2 flex flex-wrap gap-2">
          {[
            "Who advises Computer Science?",
            "What clubs are available?",
            "Show me available courses",
          ].map(q => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className="text-xs bg-blue-50 text-blue-600 border border-blue-200 rounded-full px-3 py-1 hover:bg-blue-100 transition"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <div className="p-3 border-t border-gray-200 flex gap-2">
        <input
          className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500 transition"
          placeholder="Ask anything about uConnect..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
        >
          Send
        </button>
      </div>
    </div>
  )
}