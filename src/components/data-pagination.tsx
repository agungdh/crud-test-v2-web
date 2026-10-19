import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { PaginationMeta } from "@/lib/pagination"

type DataPaginationProps = {
  meta: PaginationMeta | undefined
  isFetching?: boolean
  /** Entity name shown in the summary and navigation labels, e.g. "pegawai". */
  entityLabel: string
  onPageChange: (page: number) => void
}

export function DataPagination({
  meta,
  isFetching = false,
  entityLabel,
  onPageChange,
}: DataPaginationProps) {
  if (!meta || meta.total === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Menampilkan {meta.from ?? 0}–{meta.to ?? 0} dari {meta.total}{" "}
        {entityLabel}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={meta.current_page <= 1 || isFetching}
          onClick={() => onPageChange(meta.current_page - 1)}
        >
          <ChevronLeftIcon />
          Sebelumnya
        </Button>
        <span className="text-sm text-muted-foreground">
          Halaman {meta.current_page} dari {meta.last_page}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={meta.current_page >= meta.last_page || isFetching}
          onClick={() => onPageChange(meta.current_page + 1)}
        >
          Berikutnya
          <ChevronRightIcon />
        </Button>
      </div>
    </div>
  )
}
