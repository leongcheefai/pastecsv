"use client"

import { Search, Link2, RotateCcw, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface TableToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  onCopyLink: () => Promise<boolean>
  onReset: () => void
  urlWarning: boolean
}

export function TableToolbar({
  search,
  onSearchChange,
  onCopyLink,
  onReset,
  urlWarning,
}: TableToolbarProps) {
  const handleCopy = async () => {
    const success = await onCopyLink()
    if (success) {
      toast.success("Link copied to clipboard!")
    } else {
      toast.error("Failed to copy link")
    }
  }

  return (
    <div className="flex shrink-0 flex-col gap-2 border-b border-border bg-secondary px-4 py-3">
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        {/* App name */}
        <h2 className="shrink-0 font-mono text-sm font-bold tracking-tight text-foreground">
          PasteTable
        </h2>

        {/* Search */}
        <div className="relative w-full max-w-sm sm:mx-auto">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search all columns..."
            className="h-8 bg-background pl-8 font-mono text-xs"
            aria-label="Search table"
          />
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2 sm:ml-auto">
          {urlWarning && (
            <div className="flex items-center gap-1 text-amber-400" title="URL may be too long for some browsers">
              <AlertTriangle className="size-3.5" />
              <span className="hidden font-mono text-xs sm:inline">URL too long</span>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-1.5 font-mono text-xs"
          >
            <Link2 className="size-3.5" />
            Copy Link
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="gap-1.5 font-mono text-xs"
          >
            <RotateCcw className="size-3.5" />
            New
          </Button>
        </div>
      </div>
    </div>
  )
}
