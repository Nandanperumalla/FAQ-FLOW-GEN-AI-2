"use client"

import React from "react"
import { Search, Bell, Moon, User } from "lucide-react"

export function TopNavbar() {
  return (
    <header className="sticky top-0 z-40 flex h-20 w-full items-center justify-between border-b border-white/5 bg-background/80 px-8 backdrop-blur-xl">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="text"
            placeholder="Search documents, chats, settings..."
            className="h-10 w-full rounded-full border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/5 bg-card hover:bg-white/5 transition-colors text-muted hover:text-white">
          <Moon className="h-4 w-4" />
        </button>
        <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/5 bg-card hover:bg-white/5 transition-colors text-muted hover:text-white">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary ring-2 ring-background"></span>
        </button>
        <div className="h-6 w-[1px] bg-white/10 mx-2"></div>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-accent shadow-lg shadow-primary/20 text-white font-medium">
          <User className="h-5 w-5" />
        </button>
      </div>
    </header>
  )
}
