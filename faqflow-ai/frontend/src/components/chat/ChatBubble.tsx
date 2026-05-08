"use client"

import React from "react"
import { motion } from "framer-motion"
import { Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatBubbleProps {
  role: "user" | "assistant"
  content: string
  isTyping?: boolean
}

export function ChatBubble({ role, content, isTyping }: ChatBubbleProps) {
  const isUser = role === "user"

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex w-full gap-4 max-w-3xl", isUser ? "ml-auto flex-row-reverse" : "mr-auto")}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
          isUser
            ? "bg-gradient-to-tr from-primary to-accent text-white"
            : "bg-white/10 text-primary border border-white/10"
        )}
      >
        {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
      </div>
      
      <div
        className={cn(
          "flex flex-col gap-2 rounded-2xl px-4 py-3 text-sm max-w-[85%]",
          isUser ? "bg-primary text-white rounded-tr-sm" : "bg-card border border-white/5 text-foreground rounded-tl-sm shadow-sm"
        )}
      >
        {isTyping ? (
          <div className="flex gap-1 items-center h-5">
            <motion.div
              className="h-2 w-2 rounded-full bg-primary"
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
            />
            <motion.div
              className="h-2 w-2 rounded-full bg-primary"
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
            />
            <motion.div
              className="h-2 w-2 rounded-full bg-primary"
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
            />
          </div>
        ) : (
          <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
        )}
      </div>
    </motion.div>
  )
}
