"use client"

import React from "react"
import { FileText, ExternalLink } from "lucide-react"

interface SourceCardProps {
  title: string
  score: number
  snippet: string
}

export function SourceCard({ title, score, snippet }: SourceCardProps) {
  return (
    <div className="rounded-xl border border-white/5 bg-card/50 p-4 transition-colors hover:bg-white/5 cursor-pointer group">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 overflow-hidden">
          <FileText className="h-4 w-4 text-primary shrink-0" />
          <span className="text-sm font-medium text-white truncate">{title}</span>
        </div>
        <ExternalLink className="h-3 w-3 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <p className="text-xs text-muted line-clamp-3 mb-3 leading-relaxed">
        {snippet}
      </p>
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full" 
            style={{ width: `${score * 100}%` }}
          />
        </div>
        <span className="text-[10px] text-muted font-medium w-8">{Math.round(score * 100)}%</span>
      </div>
    </div>
  )
}
