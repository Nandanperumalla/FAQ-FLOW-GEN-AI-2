"use client"

import React, { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Search, Filter, FileText, Trash2, RefreshCw, CheckCircle2, Clock } from "lucide-react"
import { UploadDropzone } from "@/components/dashboard/UploadDropzone"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getDocuments, deleteDocument } from "@/lib/api"
import { EmptyState } from "@/components/ui/EmptyState"

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadDocuments = useCallback(async () => {
    try {
      const docs = await getDocuments()
      setDocuments(docs)
    } catch (error) {
      console.error("Failed to fetch documents", error)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleDelete = async (id: number) => {
    try {
      await deleteDocument(id)
      loadDocuments()
    } catch (error) {
      console.error("Failed to delete document", error)
    }
  }

  useEffect(() => {
    loadDocuments()
    
    // Poll every 5 seconds to check for status updates while processing
    const interval = setInterval(() => {
      loadDocuments()
    }, 5000)
    return () => clearInterval(interval)
  }, [loadDocuments])

  return (
    <div className="space-y-8 pb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Knowledge Base</h1>
        <p className="text-muted">Upload and manage the documents that power your AI.</p>
      </div>

      <UploadDropzone onUploadSuccess={loadDocuments} />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="text"
            placeholder="Search documents..."
            className="h-10 w-full rounded-md border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <Button variant="outline" className="w-full sm:w-auto gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12 text-muted">Loading documents...</div>
      ) : documents.length === 0 ? (
        <EmptyState 
          icon={FileText} 
          title="No documents yet" 
          description="Upload your first document above to start generating AI responses." 
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {documents.map((doc, idx) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="group hover:border-white/20 transition-colors h-full flex flex-col">
                <CardContent className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    {(doc.status === "indexed" || doc.status === "active") && (
                      <Badge variant="success" className="gap-1 ml-2 whitespace-nowrap"><CheckCircle2 className="h-3 w-3" /> Indexed</Badge>
                    )}
                    {doc.status === "processing" && (
                      <Badge variant="warning" className="gap-1 ml-2 whitespace-nowrap"><Clock className="h-3 w-3 animate-pulse" /> Processing</Badge>
                    )}
                    {doc.status === "failed" && (
                      <Badge variant="danger" className="gap-1 ml-2 whitespace-nowrap">Failed</Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-white truncate mb-1" title={doc.filename}>{doc.filename}</h3>
                  <div className="flex items-center text-xs text-muted mb-4 gap-2">
                    {/* The backend doesn't currently return size/date, so we fallback */}
                    <span>{doc.created_at ? new Date(doc.created_at).toLocaleDateString() : 'Recently'}</span>
                  </div>
                  
                  <div className="mt-auto pt-4 flex items-center gap-2 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" className="flex-1 gap-2 text-xs h-8">
                      <RefreshCw className="h-3 w-3" /> Reprocess
                    </Button>
                    <Button variant="danger" size="icon" className="h-8 w-8 shrink-0" onClick={() => handleDelete(doc.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
