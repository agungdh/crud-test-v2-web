import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleAlertIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  Trash2Icon,
} from "lucide-react"
import { useState } from "react"

import { DeletePegawaiDialog } from "@/components/pegawai/delete-pegawai-dialog"
import { PegawaiDetailDialog } from "@/components/pegawai/pegawai-detail-dialog"
import { PegawaiFormDialog } from "@/components/pegawai/pegawai-form-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
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
import type { Pegawai } from "@/features/pegawai/types"
import { usePegawaiList } from "@/features/pegawai/use-pegawai"
import { getGenderLabel } from "@/features/pegawai/utils"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { ApiError } from "@/lib/api"

const perPage = 10

export function PegawaiPage() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebouncedValue(search)

  const [formOpen, setFormOpen] = useState(false)
  const [editingPegawai, setEditingPegawai] = useState<Pegawai | null>(null)
  const [detailUuid, setDetailUuid] = useState<string | null>(null)
  const [deletingPegawai, setDeletingPegawai] = useState<Pegawai | null>(null)

  const { data, error, isFetching, isPending, refetch } = usePegawaiList({
    search: debouncedSearch,
    page,
    per_page: perPage,
  })

  const rows = data?.data ?? []
  const meta = data?.meta

  const errorMessage =
    error instanceof ApiError
      ? error.message
      : error
        ? "Tidak dapat memuat data pegawai. Pastikan API berjalan."
        : null

  function openCreateDialog() {
    setEditingPegawai(null)
    setFormOpen(true)
  }

  function openEditDialog(pegawai: Pegawai) {
    setEditingPegawai(pegawai)
    setFormOpen(true)
  }

  function handleFormOpenChange(open: boolean) {
    setFormOpen(open)

    if (!open) {
      setEditingPegawai(null)
    }
  }

  function handleDeleted() {
    if (rows.length === 1 && page > 1) {
      setPage((current) => current - 1)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Data pegawai</h2>
          <p className="text-sm text-muted-foreground">
            Kelola data pegawai beserta akun login yang terhubung.
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <PlusIcon />
          Tambah pegawai
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
          <CardTitle>Daftar pegawai</CardTitle>
          <CardDescription>
            {meta
              ? `${meta.total} pegawai terdaftar.`
              : "Memuat jumlah pegawai..."}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="relative w-full sm:max-w-sm">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="Cari NIP, nama, jabatan, bidang, atau email"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              aria-label="Cari pegawai"
            />
            {isFetching && !isPending ? (
              <Spinner className="absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            ) : null}
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NIP</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Jabatan</TableHead>
                  <TableHead>Bidang</TableHead>
                  <TableHead>Jenis kelamin</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isPending ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-32 text-center text-muted-foreground"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Spinner />
                        Memuat data pegawai...
                      </span>
                    </TableCell>
                  </TableRow>
                ) : rows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-32 text-center text-muted-foreground"
                    >
                      {debouncedSearch
                        ? "Tidak ada pegawai yang cocok dengan pencarian."
                        : "Belum ada data pegawai."}
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((pegawai) => (
                    <TableRow key={pegawai.uuid}>
                      <TableCell className="font-mono text-xs">
                        {pegawai.nip}
                      </TableCell>
                      <TableCell className="font-medium">
                        {pegawai.nama}
                      </TableCell>
                      <TableCell>{pegawai.jabatan ?? "—"}</TableCell>
                      <TableCell>{pegawai.bidang ?? "—"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={pegawai.gender ? "secondary" : "outline"}
                        >
                          {getGenderLabel(pegawai.gender)}
                        </Badge>
                      </TableCell>
                      <TableCell>{pegawai.user?.email ?? "—"}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Lihat detail ${pegawai.nama}`}
                            title="Lihat detail"
                            onClick={() => setDetailUuid(pegawai.uuid)}
                          >
                            <EyeIcon />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Ubah data ${pegawai.nama}`}
                            title="Ubah data"
                            onClick={() => openEditDialog(pegawai)}
                          >
                            <PencilIcon />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive hover:text-destructive"
                            aria-label={`Hapus ${pegawai.nama}`}
                            title="Hapus"
                            onClick={() => setDeletingPegawai(pegawai)}
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

          {meta && meta.total > 0 ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Menampilkan {meta.from ?? 0}–{meta.to ?? 0} dari {meta.total}{" "}
                pegawai
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta.current_page <= 1 || isFetching}
                  onClick={() => setPage((current) => current - 1)}
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
                  onClick={() => setPage((current) => current + 1)}
                >
                  Berikutnya
                  <ChevronRightIcon />
                </Button>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <PegawaiFormDialog
        key={`${formOpen ? "open" : "closed"}-${editingPegawai?.uuid ?? "new"}`}
        open={formOpen}
        onOpenChange={handleFormOpenChange}
        pegawai={editingPegawai}
      />

      <PegawaiDetailDialog
        uuid={detailUuid}
        open={Boolean(detailUuid)}
        onOpenChange={(open) => {
          if (!open) {
            setDetailUuid(null)
          }
        }}
      />

      <DeletePegawaiDialog
        open={Boolean(deletingPegawai)}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingPegawai(null)
          }
        }}
        pegawai={deletingPegawai}
        onDeleted={handleDeleted}
      />
    </div>
  )
}
