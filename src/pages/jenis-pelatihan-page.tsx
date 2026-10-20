import {
  CircleAlertIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  Trash2Icon,
} from "lucide-react"
import { useState } from "react"

import { DataPagination } from "@/components/data-pagination"
import { DeleteJenisPelatihanDialog } from "@/components/jenis-pelatihan/delete-jenis-pelatihan-dialog"
import { JenisPelatihanFormDialog } from "@/components/jenis-pelatihan/jenis-pelatihan-form-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { JenisPelatihan } from "@/features/jenis-pelatihan/types"
import { useJenisPelatihanList } from "@/features/jenis-pelatihan/use-jenis-pelatihan"
import { useCursorPagination } from "@/hooks/use-cursor-pagination"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { ApiError } from "@/lib/api"
import { CURSOR_PAGE_SIZE } from "@/lib/pagination"

export function JenisPelatihanPage() {
  const [search, setSearch] = useState("")
  const pager = useCursorPagination()
  const debouncedSearch = useDebouncedValue(search)

  const [formOpen, setFormOpen] = useState(false)
  const [editingJenisPelatihan, setEditingJenisPelatihan] =
    useState<JenisPelatihan | null>(null)
  const [deletingJenisPelatihan, setDeletingJenisPelatihan] =
    useState<JenisPelatihan | null>(null)

  const { data, error, isFetching, isPending, refetch } = useJenisPelatihanList(
    {
      search: debouncedSearch,
      cursor: pager.cursor,
    }
  )

  const rows = data?.data ?? []
  const meta = data?.meta

  const errorMessage =
    error instanceof ApiError
      ? error.message
      : error
        ? "Tidak dapat memuat data jenis pelatihan. Pastikan API berjalan."
        : null

  function openCreateDialog() {
    setEditingJenisPelatihan(null)
    setFormOpen(true)
  }

  function openEditDialog(jenisPelatihan: JenisPelatihan) {
    setEditingJenisPelatihan(jenisPelatihan)
    setFormOpen(true)
  }

  function handleFormOpenChange(open: boolean) {
    setFormOpen(open)

    if (!open) {
      setEditingJenisPelatihan(null)
    }
  }

  function handleDeleted() {
    if (rows.length === 1 && pager.hasPrevious) {
      pager.previous()
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Jenis pelatihan
          </h2>
          <p className="text-sm text-muted-foreground">
            Kelola master jenis pelatihan yang dipakai pada data diklat.
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <PlusIcon />
          Tambah jenis pelatihan
        </Button>
      </div>

      {errorMessage ? (
        <Alert variant="destructive">
          <CircleAlertIcon />
          <AlertTitle>Gagal memuat data</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <span>{errorMessage}</span>
            <Button
              variant="outline"
              size="sm"
              className="w-fit"
              onClick={() => void refetch()}
            >
              Coba lagi
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Daftar jenis pelatihan</CardTitle>
          <CardDescription>
            {isPending
              ? "Memuat data jenis pelatihan..."
              : "Data terbaru ditampilkan lebih dulu."}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="relative w-full sm:max-w-sm">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="Cari jenis pelatihan"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                pager.reset()
              }}
              aria-label="Cari jenis pelatihan"
            />
            {isFetching && !isPending ? (
              <Spinner className="absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            ) : null}
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">No</TableHead>
                  <TableHead>Jenis pelatihan</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isPending ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="h-32 text-center text-muted-foreground"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Spinner />
                        Memuat data jenis pelatihan...
                      </span>
                    </TableCell>
                  </TableRow>
                ) : rows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="h-32 text-center text-muted-foreground"
                    >
                      {debouncedSearch
                        ? "Tidak ada jenis pelatihan yang cocok dengan pencarian."
                        : "Belum ada data jenis pelatihan."}
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((jenisPelatihan, index) => (
                    <TableRow key={jenisPelatihan.uuid}>
                      <TableCell className="text-muted-foreground">
                        {(pager.page - 1) * CURSOR_PAGE_SIZE + index + 1}
                      </TableCell>
                      <TableCell className="font-medium">
                        {jenisPelatihan.jenis_pelatihan}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Ubah ${jenisPelatihan.jenis_pelatihan}`}
                            title="Ubah"
                            onClick={() => openEditDialog(jenisPelatihan)}
                          >
                            <PencilIcon />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive hover:text-destructive"
                            aria-label={`Hapus ${jenisPelatihan.jenis_pelatihan}`}
                            title="Hapus"
                            onClick={() =>
                              setDeletingJenisPelatihan(jenisPelatihan)
                            }
                          >
                            <Trash2Icon />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <DataPagination
            page={pager.page}
            itemCount={rows.length}
            hasNext={Boolean(meta?.next_cursor)}
            hasPrevious={pager.hasPrevious}
            isFetching={isFetching}
            entityLabel="jenis pelatihan"
            onNext={() => pager.next(meta?.next_cursor)}
            onPrevious={pager.previous}
          />
        </CardContent>
      </Card>

      <JenisPelatihanFormDialog
        key={`${formOpen ? "open" : "closed"}-${editingJenisPelatihan?.uuid ?? "new"}`}
        open={formOpen}
        onOpenChange={handleFormOpenChange}
        jenisPelatihan={editingJenisPelatihan}
      />

      <DeleteJenisPelatihanDialog
        open={Boolean(deletingJenisPelatihan)}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingJenisPelatihan(null)
          }
        }}
        jenisPelatihan={deletingJenisPelatihan}
        onDeleted={handleDeleted}
      />
    </div>
  )
}
