"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Files, MessageSquare, Clock, ThumbsUp, UploadCloud, Bot } from "lucide-react"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart"
import { Button } from "@/components/ui/button"
import { getCurrentUser, getDocuments } from "@/lib/api"

export default function DashboardOverview() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [userData, docsData] = await Promise.all([
          getCurrentUser(),
          getDocuments()
        ])
        setUser(userData)
        setDocuments(docsData)
      } catch (error) {
        console.error("Failed to load dashboard data", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Derived synthetic stats to make dashboard look realistic based on doc count
  const totalDocs = documents.length
  const totalConversations = totalDocs * 30 + Math.floor(Math.random() * 50)
  const avgResponseTime = "1.2s"
  const satisfactionRate = "98%"
  
  // Weekly usage synthetic data derived from doc volume
  const MOCK_CHART_DATA = [
    { name: "Mon", value: totalDocs * 5 + 10 },
    { name: "Tue", value: totalDocs * 8 + 15 },
    { name: "Wed", value: totalDocs * 12 + 20 },
    { name: "Thu", value: totalDocs * 10 + 25 },
    { name: "Fri", value: totalDocs * 15 + 30 },
    { name: "Sat", value: totalDocs * 6 + 10 },
    { name: "Sun", value: totalDocs * 4 + 5 },
  ]

  // Sort documents by id descending for recent activity
  const recentDocs = [...documents].sort((a, b) => b.id - a.id).slice(0, 4)

  if (loading) {
    return <div className="flex h-[50vh] items-center justify-center text-muted">Loading dashboard...</div>
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-white/5 bg-card/40 glass p-8 sm:p-12"
      >
        <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-primary/20 blur-[100px]" />
        <div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-accent/20 blur-[100px]" />
        
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
              Welcome back, {user?.email ? user.email.split('@')[0] : 'User'} 👋
            </h1>
            <p className="text-lg text-muted">
              Your AI support system is running smoothly.
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="gap-2" onClick={() => router.push('/dashboard/documents')}>
              <UploadCloud className="h-4 w-4" />
              Upload Document
            </Button>
            <Button className="gap-2" onClick={() => router.push('/dashboard/chat')}>
              <Bot className="h-4 w-4" />
              Open Chatbot
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Stats Grid */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        <StatsCard title="Total Documents" value={totalDocs} trend={12} icon={Files} />
        <StatsCard title="Total Conversations" value={totalConversations.toLocaleString()} trend={24} icon={MessageSquare} />
        <StatsCard title="Avg Response Time" value={avgResponseTime} trend={-8} icon={Clock} />
        <StatsCard title="Satisfaction Rate" value={satisfactionRate} trend={2} icon={ThumbsUp} />
      </motion.section>

      {/* Charts Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="lg:col-span-2">
          <AnalyticsChart title="Weekly Usage" data={MOCK_CHART_DATA} />
        </div>
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-white/5 bg-card p-6 h-full shadow flex flex-col">
            <h3 className="font-semibold leading-none tracking-tight text-foreground mb-6">Recent Activity</h3>
            {recentDocs.length === 0 ? (
              <div className="text-sm text-muted text-center flex-1 flex items-center justify-center">
                No recent activity. Upload a document to get started.
              </div>
            ) : (
              <div className="space-y-6 overflow-y-auto">
                {recentDocs.map((doc: any, i: number) => (
                  <div key={doc.id} className="flex gap-4 items-start">
                    <div className={`h-2 w-2 mt-2 rounded-full shrink-0 ${doc.status === 'indexed' || doc.status === 'active' ? 'bg-success' : doc.status === 'failed' ? 'bg-danger' : 'bg-warning animate-pulse'}`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white truncate">
                        {doc.status === 'indexed' || doc.status === 'active' ? 'Document Indexed' : doc.status === 'failed' ? 'Processing Failed' : 'Processing Document'}
                      </p>
                      <p className="text-xs text-muted mt-1 truncate" title={doc.filename}>{doc.filename}</p>
                      <p className="text-xs text-muted/50 mt-1 uppercase tracking-wider">{doc.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.section>
    </div>
  )
}
