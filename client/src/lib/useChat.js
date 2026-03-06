import { useState } from "react"
import { supabase } from './supabase';

export function useChat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm your uConnect assistant. Ask me about advisors, courses, clubs, or anything on campus! 👋"
    }
  ])
  const [loading, setLoading] = useState(false)

  const sendMessage = async (text) => {
    if (!text.trim()) return

    setMessages(prev => [...prev, { role: "user", content: text }])
    setLoading(true)

    try {
      // Get the current session token
      const { data: { session } } = await supabase.auth.getSession()

      const { data, error } = await supabase.functions.invoke("chat", {
        body: { message: text },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        }
      })

      if (error) {
        console.error("Function error:", error)
        throw error
      }

      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.reply
      }])
    } catch (err) {
      console.error("Chat error:", err)
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Sorry, something went wrong. Please try again!"
      }])
    } finally {
      setLoading(false)
    }
  }

  return { messages, loading, sendMessage }
}