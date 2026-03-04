"use client"

import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { ParsedCSV } from "@/hooks/use-csv-parser"
import type { SortConfig } from "@/hooks/use-table-state"

interface DataTableProps {
  data: ParsedCSV
  filteredRows: string[][]
  sort: SortConfig
  onSort: (columnIndex: number) => void
  totalRows: number
  filteredCount: number
}

function SortIcon({
  columnIndex,
  sort,
}: {
  columnIndex: number
  sort: SortConfig
}) {
  if (sort.columnIndex !== columnIndex || !sort.direction) {
    return <ArrowUpDown className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
  }
  if (sort.direction === "asc") {
    return <ArrowUp className="size-3 text-primary" />
  }
  return <ArrowDown className="size-3 text-primary" />
}

export function DataTable({
  data,
  filteredRows,
  sort,
  onSort,
  totalRows,
  filteredCount,
}: DataTableProps) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Table container */}
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-secondary">
            <TableRow className="border-border hover:bg-secondary">
              <TableHead className="w-12 text-center font-mono text-xs text-muted-foreground">
                #
              </TableHead>
              {data.headers.map((header, i) => (
                <TableHead
                  key={i}
                  className="group cursor-pointer select-none font-mono text-xs font-semibold uppercase tracking-wider text-foreground transition-colors hover:text-primary"
                  onClick={() => onSort(i)}
                  role="columnheader"
                  aria-sort={
                    sort.columnIndex === i && sort.direction
                      ? sort.direction === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                >
                  <span className="flex items-center gap-1.5">
                    {header}
                    <SortIcon columnIndex={i} sort={sort} />
                  </span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={data.headers.length + 1}
                  className="h-32 text-center font-mono text-sm text-muted-foreground"
                >
                  No matching rows found.
                </TableCell>
              </TableRow>
            ) : (
              filteredRows.map((row, rowIdx) => (
                <TableRow
                  key={rowIdx}
                  className={`border-border transition-colors ${
                    rowIdx % 2 === 0 ? "bg-background" : "bg-secondary/50"
                  }`}
                >
                  <TableCell className="text-center font-mono text-xs text-muted-foreground">
                    {rowIdx + 1}
                  </TableCell>
                  {data.headers.map((_, colIdx) => (
                    <TableCell
                      key={colIdx}
                      className="font-mono text-xs text-foreground"
                    >
                      {row[colIdx] ?? ""}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Status bar */}
      <div className="flex shrink-0 items-center justify-between border-t border-border bg-secondary px-4 py-2">
        <p className="font-mono text-xs text-muted-foreground">
          {filteredCount < totalRows
            ? `${filteredCount} of ${totalRows} rows`
            : `${totalRows} rows`}{" "}
          &middot; {data.headers.length} columns
        </p>
        <p className="font-mono text-xs text-muted-foreground">
          Your data never leaves your browser
        </p>
      </div>
    </div>
  )
}
