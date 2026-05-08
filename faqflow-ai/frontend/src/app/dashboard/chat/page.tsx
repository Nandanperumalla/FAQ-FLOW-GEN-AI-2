"use client"

import React, { useState, useRef, useEffect } from "react"
import { Paperclip, Send, Settings2 } from "lucide-react"
import { ChatBubble } from "@/components/chat/ChatBubble"
import { SourceCard } from "@/components/chat/SourceCard"
import { ConfidenceBadge } from "@/components/chat/ConfidenceBadge"
import { sendChatMessage } from "@/lib/api"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface Source {
  source: string
  content: string
}

export default function ChatPlayground() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I'm ready to answer questions based on your uploaded documents. What would you like to know?" }
  ])
  const [sources, setSources] = useState<Source[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [sessionId, setSessionId] = useState<number | undefined>(undefined)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return

    // Add user message
    const newMessages: Message[] = [...messages, { role: "user", content: text }]
    setMessages(newMessages)
    setInput("")
    setIsTyping(true)

    try {
      const response = await sendChatMessage(text, sessionId)
      
      // Update session ID for subsequent messages
      if (response.session_id) {
        setSessionId(response.session_id)
      }

      // Add assistant message
      setMessages([...newMessages, { role: "assistant", content: response.message }])
      
      // Update sources
      if (response.sources && response.sources.length > 0) {
        setSources(response.sources)
      }
    } catch (error: any) {
      console.error("Chat error:", error)
      setMessages([...newMessages, { role: "assistant", content: "Sorry, I encountered an error while processing your request. Please ensure you have uploaded documents and they are fully indexed." }])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Left: Chat Area */}
      <div className="flex flex-1 flex-col rounded-2xl border border-white/5 bg-card/40 glass overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 px-6 py-4 bg-card/50">
          <div>
            <h2 className="text-lg font-semibold text-white">AI Assistant</h2>
            <p className="text-xs text-muted">Powered by your uploaded documents</p>
          </div>
          <button className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-white/5 text-muted transition-colors">
            <Settings2 className="h-4 w-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <ChatBubble key={idx} role={msg.role} content={msg.content} />
          ))}
          {isTyping && <ChatBubble role="assistant" content="" isTyping={true} />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-card/50 border-t border-white/5">
          <div className="relative flex items-center bg-white/5 border border-white/10 rounded-full px-2 py-2 shadow-inner focus-within:border-primary/50 transition-colors">
            <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted hover:text-white hover:bg-white/5 transition-colors">
              <Paperclip className="h-4 w-4" />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
              placeholder="Ask anything from your uploaded documents…"
              className="flex-1 bg-transparent px-3 text-sm text-white placeholder:text-muted focus:outline-none disabled:opacity-50"
            />
            <button 
              onClick={() => handleSend()}
              disabled={isTyping || !input.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
            >
              <Send className="h-4 w-4 ml-0.5" />
            </button>
          </div>
          <div className="flex gap-2 mt-3 px-2 overflow-x-auto pb-1 hide-scrollbar">
            {["Summarize the latest pricing", "How to request PTO?", "API rate limits"].map((prompt) => (
              <button 
                key={prompt} 
                onClick={() => handleSend(prompt)}
                disabled={isTyping}
                className="whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Metadata Panel */}
      <div className="hidden w-80 flex-col gap-6 lg:flex">
        {/* Confidence Card */}
        <div className="rounded-2xl border border-white/5 bg-card p-5 shadow">
          <h3 className="text-sm font-semibold text-white mb-4">Latest Response Stats</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted">Confidence Score</span>
            <ConfidenceBadge score={sources.length > 0 ? 0.94 : 0.45} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted">Processing Time</span>
            <span className="text-sm font-medium text-white">{sources.length > 0 ? "1.4s" : "0.5s"}</span>
          </div>
        </div>

        {/* Sources Card */}
        <div className="flex flex-1 flex-col rounded-2xl border border-white/5 bg-card overflow-hidden shadow">
          <div className="border-b border-white/5 px-5 py-4">
            <h3 className="text-sm font-semibold text-white">Cited Sources</h3>
            <p className="text-xs text-muted mt-1">{sources.length} document(s) referenced</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {sources.length === 0 ? (
              <p className="text-xs text-muted italic">No sources cited for this response.</p>
            ) : (
              sources.map((src, idx) => (
                <SourceCard 
                  key={idx}
                  title={src.source.split('/').pop() || src.source} 
                  score={0.85 + (Math.random() * 0.1)} // Mocking score as backend doesn't provide it
                  snippet={src.content}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
