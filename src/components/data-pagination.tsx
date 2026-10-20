import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

type DataPaginationProps = {
  /** 1-based page number, tracked by the caller from the cursor history. */
  page: number
  /** Number of rows currently rendered on this page. */
  itemCount: number
  hasNext: boolean
  hasPrevious: boolean
  isFetching?: boolean
  /** Entity name shown in the summary and navigation labels, e.g. "pegawai". */
  entityLabel: string
  onNext: () => void
  onPrevious: () => void
}

export function DataPagination({
  page,
  itemCount,
  hasNext,
  hasPrevious,
  isFetching = false,
  entityLabel,
  onNext,
  onPrevious,
}: DataPaginationProps) {
  if (itemCount === 0 && !hasPrevious) {
    return null
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Menampilkan {itemCount} {entityLabel}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!hasPrevious || isFetching}
          onClick={onPrevious}
        >
          <ChevronLeftIcon />
          Sebelumnya
        </Button>
        <span className="text-sm text-muted-foreground">Halaman {page}</span>
        <Button
          variant="outline"
          size="sm"
          disabled={!hasNext || isFetching}
          onClick={onNext}
        >
          Berikutnya
          <ChevronRightIcon />
        </Button>
      </div>
    </div>
  )
}
