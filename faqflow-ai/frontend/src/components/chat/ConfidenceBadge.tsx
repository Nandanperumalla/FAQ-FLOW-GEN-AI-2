"use client"

import React from "react"
import { ShieldCheck, ShieldAlert, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

interface ConfidenceBadgeProps {
  score: number
}

export function ConfidenceBadge({ score }: ConfidenceBadgeProps) {
  let status: "high" | "medium" | "low" = "high"
  if (score < 0.6) status = "low"
  else if (score < 0.85) status = "medium"

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        {
          "border-success/20 bg-success/10 text-success": status === "high",
          "border-warning/20 bg-warning/10 text-warning": status === "medium",
          "border-danger/20 bg-danger/10 text-danger": status === "low",
        }
      )}
    >
      {status === "high" && <ShieldCheck className="h-3.5 w-3.5" />}
      {status === "medium" && <Shield className="h-3.5 w-3.5" />}
      {status === "low" && <ShieldAlert className="h-3.5 w-3.5" />}
      <span>
        {status === "high" && "High Confidence"}
        {status === "medium" && "Medium Confidence"}
        {status === "low" && "Low Confidence"}
      </span>
    </div>
  )
}
