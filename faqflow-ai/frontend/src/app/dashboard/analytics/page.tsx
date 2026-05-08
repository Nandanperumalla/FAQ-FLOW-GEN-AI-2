"use client"

import React from "react"
import { motion } from "framer-motion"
import { MessageSquare, HelpCircle, ThumbsUp, ShieldCheck, Download } from "lucide-react"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const WEEKLY_CHATS = [
  { name: "Mon", value: 120 },
  { name: "Tue", value: 180 },
  { name: "Wed", value: 250 },
  { name: "Thu", value: 210 },
  { name: "Fri", value: 290 },
  { name: "Sat", value: 340 },
  { name: "Sun", value: 410 },
]

const CONFIDENCE_TREND = [
  { name: "Week 1", value: 85 },
  { name: "Week 2", value: 87 },
  { name: "Week 3", value: 89 },
  { name: "Week 4", value: 92 },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Analytics</h1>
          <p className="text-muted">Deep dive into your AI assistant's performance.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Stats Grid */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        <StatsCard title="Total Chats" value="12,402" trend={18} icon={MessageSquare} />
        <StatsCard title="Unanswered Questions" value="143" trend={-12} icon={HelpCircle} />
        <StatsCard title="Satisfaction Score" value="4.8/5" trend={4} icon={ThumbsUp} />
        <StatsCard title="Avg Confidence" value="92%" trend={2} icon={ShieldCheck} />
      </motion.section>

      {/* Charts Row 1 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <AnalyticsChart title="Chat Volume (Last 7 Days)" data={WEEKLY_CHATS} type="area" color="#6366F1" />
        <AnalyticsChart title="Confidence Trend (Monthly)" data={CONFIDENCE_TREND} type="line" color="#10B981" />
      </motion.section>

      {/* Popular Documents & Heatmap placeholder */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Activity Heatmap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full flex items-center justify-center border border-white/5 bg-white/5 rounded-lg border-dashed">
                <p className="text-muted text-sm flex flex-col items-center gap-2">
                  <span className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 35 }).map((_, i) => (
                      <span key={i} className={`h-4 w-4 rounded-sm ${Math.random() > 0.5 ? 'bg-primary/50' : 'bg-primary/20'}`} />
                    ))}
                  </span>
                  Heatmap visualization
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Popular Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Pricing_Strategy.pdf", uses: 1205 },
                  { name: "API_Documentation.docx", uses: 943 },
                  { name: "Employee_Handbook.pdf", uses: 721 },
                  { name: "Support_Macros.txt", uses: 412 },
                  { name: "Refund_Policy.pdf", uses: 256 }
                ].map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white truncate max-w-[180px]" title={doc.name}>
                      {doc.name}
                    </span>
                    <span className="text-xs text-muted tabular-nums">
                      {doc.uses.toLocaleString()} citations
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.section>
    </div>
  )
}
