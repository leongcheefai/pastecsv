"use client"

import { useMemo, useState } from "react"
import type { ParsedCSV } from "./use-csv-parser"

export type SortDirection = "asc" | "desc" | null

export interface SortConfig {
  columnIndex: number
  direction: SortDirection
}

export function useTableState(data: ParsedCSV | null) {
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState<SortConfig>({
    columnIndex: -1,
    direction: null,
  })

  const filteredRows = useMemo(() => {
    if (!data) return []

    const query = search.toLowerCase().trim()

    let rows = data.rows
    if (query) {
      rows = rows.filter((row) =>
        row.some((cell) => cell.toLowerCase().includes(query))
      )
    }

    if (sort.columnIndex >= 0 && sort.direction) {
      rows = [...rows].sort((a, b) => {
        const aVal = a[sort.columnIndex] ?? ""
        const bVal = b[sort.columnIndex] ?? ""

        const aNum = parseFloat(aVal.replace(/[^0-9.-]/g, ""))
        const bNum = parseFloat(bVal.replace(/[^0-9.-]/g, ""))

        if (!isNaN(aNum) && !isNaN(bNum)) {
          return sort.direction === "asc" ? aNum - bNum : bNum - aNum
        }

        const comparison = aVal.localeCompare(bVal, undefined, {
          sensitivity: "base",
        })
        return sort.direction === "asc" ? comparison : -comparison
      })
    }

    return rows
  }, [data, search, sort])

  const toggleSort = (columnIndex: number) => {
    setSort((prev) => {
      if (prev.columnIndex !== columnIndex) {
        return { columnIndex, direction: "asc" }
      }
      if (prev.direction === "asc") {
        return { columnIndex, direction: "desc" }
      }
      return { columnIndex: -1, direction: null }
    })
  }

  return {
    search,
    setSearch,
    sort,
    toggleSort,
    filteredRows,
    totalRows: data?.rows.length ?? 0,
  }
}
