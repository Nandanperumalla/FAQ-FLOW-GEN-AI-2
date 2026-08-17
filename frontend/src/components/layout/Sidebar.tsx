"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  Files,
  MessageSquareText,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bot
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Documents", href: "/dashboard/documents", icon: Files },
  { name: "Chatbot", href: "/dashboard/chat", icon: MessageSquareText },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 260 }}
      className="relative flex flex-col h-screen border-r border-white/5 bg-card/50 backdrop-blur-xl shrink-0"
    >
      <div className="flex items-center justify-between p-6 h-20">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-accent shadow-lg shadow-primary/20">
            <Bot className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg font-bold tracking-tight text-white"
            >
              FAQFlow AI
            </motion.span>
          )}
        </div>
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-8 flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-card hover:bg-white/5 text-muted hover:text-white transition-colors"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      <div className="flex-1 px-4 space-y-2 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "relative flex items-center h-10 px-3 rounded-md transition-colors group cursor-pointer",
                  isActive ? "text-white" : "text-muted hover:text-white hover:bg-white/5",
                  collapsed && "justify-center px-0"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-md bg-primary/10 border border-primary/20"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className={cn("relative z-10 h-5 w-5", isActive && "text-primary")} />
                {!collapsed && (
                  <span className="relative z-10 ml-3 text-sm font-medium">
                    {item.name}
                  </span>
                )}
              </div>
            </Link>
          )
        })}
      </div>

      <div className="p-4 border-t border-white/5">
        <button
          className={cn(
            "flex items-center w-full h-10 px-3 rounded-md text-muted hover:text-danger hover:bg-danger/10 transition-colors group",
            collapsed && "justify-center px-0"
          )}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-3 text-sm font-medium">Log out</span>}
        </button>
      </div>
    </motion.aside>
  )
}
