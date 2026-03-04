"use client"

import { useCSVParser } from "@/hooks/use-csv-parser"
import { useTableState } from "@/hooks/use-table-state"
import { useShareURL } from "@/hooks/use-share-url"
import { DropZone } from "@/components/drop-zone"
import { DataTable } from "@/components/data-table"
import { TableToolbar } from "@/components/table-toolbar"

export function PasteTableApp() {
  const { data, error, parseCSV, reset } = useCSVParser()
  const { search, setSearch, sort, toggleSort, filteredRows, totalRows } =
    useTableState(data)
  const { urlWarning, copyShareURL } = useShareURL(data, parseCSV)

  const handleReset = () => {
    reset()
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", window.location.pathname)
    }
  }

  // Upload State
  if (!data) {
    return <DropZone onParse={parseCSV} error={error} />
  }

  // Table State
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <TableToolbar
        search={search}
        onSearchChange={setSearch}
        onCopyLink={copyShareURL}
        onReset={handleReset}
        urlWarning={urlWarning}
      />
      <DataTable
        data={data}
        filteredRows={filteredRows}
        sort={sort}
        onSort={toggleSort}
        totalRows={totalRows}
        filteredCount={filteredRows.length}
      />
    </div>
  )
}
