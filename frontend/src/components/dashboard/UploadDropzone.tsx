"use client"

import React, { useState, useRef } from "react"
import { motion } from "framer-motion"
import { UploadCloud, FileText, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { uploadDocument } from "@/lib/api"

interface UploadDropzoneProps {
  onUploadSuccess?: () => void
}

export function UploadDropzone({ onUploadSuccess }: UploadDropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true)
    } else if (e.type === "dragleave" || e.type === "drop") {
      setIsDragActive(false)
    }
  }

  const processFile = async (file: File) => {
    if (!file.name.match(/\.(pdf|txt|docx)$/i)) {
      setError("Unsupported file type. Please upload PDF, TXT, or DOCX.")
      return
    }

    setUploading(true)
    setError(null)
    try {
      await uploadDocument(file)
      if (onUploadSuccess) {
        onUploadSuccess()
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload document")
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0])
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="relative w-full overflow-hidden rounded-2xl p-1 group cursor-pointer"
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleChange} 
        accept=".pdf,.txt,.docx" 
      />

      {/* Animated gradient border on hover/drag */}
      <div className={`absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm ${isDragActive ? "opacity-100 animate-pulse" : ""}`} />
      
      <div className={`relative flex flex-col items-center justify-center w-full h-64 rounded-xl border-2 border-dashed transition-colors ${isDragActive ? "border-transparent bg-card/80" : "border-white/20 bg-card/40 hover:bg-card/60"}`}>
        {uploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
            <p className="text-lg font-medium text-white mb-2">Uploading...</p>
          </div>
        ) : (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5 mb-4 group-hover:scale-110 transition-transform">
              <UploadCloud className="h-8 w-8 text-primary" />
            </div>
            <p className="text-lg font-medium text-white mb-2">
              Click or drag file to this area to upload
            </p>
            <p className="text-sm text-muted mb-4">
              Support for a single document. PDFs, Word docs, and Text files accepted.
            </p>
            {error && <p className="text-sm text-danger mb-4">{error}</p>}
            <div className="flex gap-2">
              <Badge variant="secondary"><FileText className="h-3 w-3 mr-1" /> PDF</Badge>
              <Badge variant="secondary"><FileText className="h-3 w-3 mr-1" /> DOCX</Badge>
              <Badge variant="secondary"><FileText className="h-3 w-3 mr-1" /> TXT</Badge>
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}
