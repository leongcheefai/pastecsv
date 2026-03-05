"use client"

import { useCallback, useState } from "react"
import Papa from "papaparse"

export interface ParsedCSV {
  headers: string[]
  rows: string[][]
}

export interface CSVParserResult {
  data: ParsedCSV | null
  error: string | null
  parseCSV: (input: string | File) => void
  reset: () => void
}

export function useCSVParser(): CSVParserResult {
  const [data, setData] = useState<ParsedCSV | null>(null)
  const [error, setError] = useState<string | null>(null)

  const parseCSV = useCallback((input: string | File) => {
    setError(null)

    const handleResult = (result: Papa.ParseResult<string[]>) => {
      if (result.errors.length > 0) {
        const ignorableTypes = new Set(["FieldMismatch", "Delimiter"])
        const criticalErrors = result.errors.filter(
          (e) => !ignorableTypes.has(e.type)
        )
        if (criticalErrors.length > 0) {
          setError(
            `CSV parsing error: ${criticalErrors[0].message}. Check your CSV format.`
          )
          return
        }
      }

      const allRows = result.data.filter((row) =>
        row.some((cell) => cell.trim() !== "")
      )

      if (allRows.length < 2) {
        setError(
          "CSV must contain at least a header row and one data row."
        )
        return
      }

      const headers = allRows[0]
      const rows = allRows.slice(1)

      if (rows.length > 500) {
        setError(
          "CSV is too large. PasteCSV supports up to 500 rows."
        )
        return
      }

      if (headers.length > 20) {
        setError(
          "CSV is too wide. PasteCSV supports up to 20 columns."
        )
        return
      }

      setData({ headers, rows })
    }

    if (typeof input === "string") {
      const result = Papa.parse<string[]>(input, {
        skipEmptyLines: true,
      })
      handleResult(result)
    } else {
      Papa.parse<string[]>(input, {
        skipEmptyLines: true,
        complete: handleResult,
        error: () => {
          setError("Failed to read file. Please try again.")
        },
      })
    }
  }, [])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
  }, [])

  return { data, error, parseCSV, reset }
}
