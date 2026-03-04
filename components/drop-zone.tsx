"use client"

import { useCallback, useRef, useState } from "react"
import { Upload, FileSpreadsheet } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { SAMPLE_CSV } from "@/lib/sample-data"

interface DropZoneProps {
  onParse: (input: string | File) => void
  error: string | null
}

export function DropZone({ onParse, error }: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [pasteText, setPasteText] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragOver(false)

      const file = e.dataTransfer.files?.[0]
      if (file && (file.name.endsWith(".csv") || file.type === "text/csv")) {
        onParse(file)
      } else if (file) {
        onParse(file)
      }
    },
    [onParse]
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) onParse(file)
    },
    [onParse]
  )

  const handlePasteSubmit = useCallback(() => {
    if (pasteText.trim()) {
      onParse(pasteText.trim())
    }
  }, [pasteText, onParse])

  const handleSampleData = useCallback(() => {
    onParse(SAMPLE_CSV)
  }, [onParse])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        handlePasteSubmit()
      }
    },
    [handlePasteSubmit]
  )

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <FileSpreadsheet className="size-8 text-primary" />
            <h1 className="font-mono text-3xl font-bold tracking-tight text-foreground">
              PasteTable
            </h1>
          </div>
          <p className="font-mono text-sm text-muted-foreground">
            Drop a CSV. Get a shareable table in seconds.
          </p>
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Drop a CSV file here or click to browse"
          className={`group mb-6 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-12 transition-all ${
            isDragOver
              ? "border-primary bg-primary/5"
              : "border-border hover:border-muted-foreground"
          }`}
        >
          <Upload
            className={`mb-3 size-10 transition-colors ${
              isDragOver ? "text-primary" : "text-muted-foreground"
            }`}
          />
          <p className="mb-1 font-mono text-sm font-medium text-foreground">
            Drop a CSV file here
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            or click to browse
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileSelect}
            className="hidden"
            aria-hidden="true"
          />
        </div>

        {/* Divider */}
        <div className="mb-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="font-mono text-xs text-muted-foreground">
            or paste raw CSV
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Paste Area */}
        <Textarea
          value={pasteText}
          onChange={(e) => setPasteText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={"Name,Email,Role\nAlice,alice@co.com,Engineer\nBob,bob@co.com,Designer"}
          className="mb-4 min-h-32 resize-none font-mono text-xs bg-secondary text-foreground border-border placeholder:text-muted-foreground"
          aria-label="Paste CSV data"
        />

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleSampleData}
            className="font-mono text-xs text-muted-foreground underline underline-offset-4 transition-colors hover:text-primary"
          >
            Try with sample data
          </button>
          <Button
            onClick={handlePasteSubmit}
            disabled={!pasteText.trim()}
            size="sm"
            className="font-mono"
          >
            Parse CSV
          </Button>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3">
            <p className="font-mono text-xs text-destructive">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}
