"use client"

import React from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  trend?: number
  icon: LucideIcon
}

export function StatsCard({ title, value, trend, icon: Icon }: StatsCardProps) {
  const isPositive = trend && trend > 0

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
      <Card className="overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted">{title}</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-primary">
              <Icon className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-end gap-3">
            <h3 className="text-3xl font-bold tracking-tight text-white">{value}</h3>
            {trend !== undefined && (
              <span
                className={`flex items-center text-sm font-medium mb-1 ${
                  isPositive ? "text-success" : "text-danger"
                }`}
              >
                {isPositive ? <ArrowUpRight className="mr-1 h-4 w-4" /> : <ArrowDownRight className="mr-1 h-4 w-4" />}
                {Math.abs(trend)}%
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
