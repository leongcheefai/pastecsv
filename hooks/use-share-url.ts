"use client"

import { useCallback, useEffect, useState } from "react"
import Papa from "papaparse"
import type { ParsedCSV } from "./use-csv-parser"
import { compressData, decompressData, isUrlTooLong } from "@/lib/compress"

export function useShareURL(
  data: ParsedCSV | null,
  parseCSV: (input: string) => void
) {
  const [urlWarning, setUrlWarning] = useState(false)

  // On mount, check if there's data in the URL hash
  useEffect(() => {
    if (typeof window === "undefined") return

    const hash = window.location.hash.slice(1)
    if (!hash) return

    const decompressed = decompressData(hash)
    if (decompressed) {
      parseCSV(decompressed)
    }
  }, [parseCSV])

  // Update the URL hash when data changes
  useEffect(() => {
    if (typeof window === "undefined" || !data) return

    const csv = Papa.unparse({
      fields: data.headers,
      data: data.rows,
    })

    const compressed = compressData(csv)
    const tooLong = isUrlTooLong(compressed)
    setUrlWarning(tooLong)

    window.history.replaceState(null, "", `#${compressed}`)
  }, [data])

  const getShareURL = useCallback((): string => {
    if (typeof window === "undefined") return ""
    return window.location.href
  }, [])

  const copyShareURL = useCallback(async (): Promise<boolean> => {
    try {
      const url = getShareURL()
      await navigator.clipboard.writeText(url)
      return true
    } catch {
      return false
    }
  }, [getShareURL])

  return { urlWarning, copyShareURL }
}
