import {
  CircleAlertIcon,
  EyeIcon,
  FileTextIcon,
  InfoIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react"
import { useState } from "react"

import { DataPagination } from "@/components/data-pagination"
import { DeleteDiklatDialog } from "@/components/diklat/delete-diklat-dialog"
import { DiklatDetailDialog } from "@/components/diklat/diklat-detail-dialog"
import { DiklatFormDialog } from "@/components/diklat/diklat-form-dialog"
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
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useCurrentUser } from "@/features/auth/use-auth"
import type { Diklat } from "@/features/diklat/types"
import { useDiklatList } from "@/features/diklat/use-diklat"
import { formatJamPelatihan, formatPeriode } from "@/features/diklat/utils"
import { useJenisPelatihanOptions } from "@/features/jenis-pelatihan/use-jenis-pelatihan"
import { useCursorPagination } from "@/hooks/use-cursor-pagination"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { ApiError } from "@/lib/api"
import { CURSOR_PAGE_SIZE } from "@/lib/pagination"

export function DiklatPage() {
  const { data: user } = useCurrentUser()

  const [search, setSearch] = useState("")
  const [jenisPelatihanUuid, setJenisPelatihanUuid] = useState("")
  const [dariTanggal, setDariTanggal] = useState("")
  const [sampaiTanggal, setSampaiTanggal] = useState("")
  const pager = useCursorPagination()
  const debouncedSearch = useDebouncedValue(search)

  const [formOpen, setFormOpen] = useState(false)
  const [editingDiklat, setEditingDiklat] = useState<Diklat | null>(null)
  const [detailUuid, setDetailUuid] = useState<string | null>(null)
  const [deletingDiklat, setDeletingDiklat] = useState<Diklat | null>(null)

  // `undefined` means the profile is not known yet; only a loaded `null`
  // proves that the account has no pegawai profile.
  const hasPegawai = user?.pegawai !== null

  const { data, error, isFetching, isPending, refetch } = useDiklatList({
    search: debouncedSearch,
    jenis_pelatihan_uuid: jenisPelatihanUuid || undefined,
    dari_tanggal: dariTanggal || undefined,
    sampai_tanggal: sampaiTanggal || undefined,
    cursor: pager.cursor,
  })

  const { data: jenisPelatihanOptions } = useJenisPelatihanOptions()

  const rows = data?.data ?? []
  const meta = data?.meta

  const jenisPelatihanItems: Record<string, string> = {
    all: "Semua jenis pelatihan",
  }

  for (const option of jenisPelatihanOptions ?? []) {
    jenisPelatihanItems[option.uuid] = option.jenis_pelatihan
  }

  const forbidden =
    error instanceof ApiError && (error.status === 403 || error.status === 401)

  const errorMessage =
    error instanceof ApiError && !forbidden
      ? error.message
      : error && !forbidden
        ? "Tidak dapat memuat data diklat. Pastikan API berjalan."
        : null

  const hasFilter = Boolean(
    debouncedSearch || jenisPelatihanUuid || dariTanggal || sampaiTanggal
  )

  function openCreateDialog() {
    setEditingDiklat(null)
    setFormOpen(true)
  }

  function openEditDialog(diklat: Diklat) {
    setEditingDiklat(diklat)
    setFormOpen(true)
  }

  function handleFormOpenChange(open: boolean) {
    setFormOpen(open)

    if (!open) {
      setEditingDiklat(null)
    }
  }

  function handleDeleted() {
    if (rows.length === 1 && pager.hasPrevious) {
      pager.previous()
    }
  }

  function resetFilters() {
    setSearch("")
    setJenisPelatihanUuid("")
    setDariTanggal("")
    setSampaiTanggal("")
    pager.reset()
  }

  if (!hasPegawai) {
    return (
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Diklat saya</h2>
          <p className="text-sm text-muted-foreground">
            Riwayat diklat yang Anda ikuti.
          </p>
        </div>

        <Alert>
          <InfoIcon />
          <AlertTitle>Profil pegawai belum tersedia</AlertTitle>
          <AlertDescription>
            Akun Anda belum memiliki profil pegawai, sehingga data diklat tidak
            dapat dikelola. Hubungi administrator untuk melengkapi profil
            pegawai Anda.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Diklat saya</h2>
          <p className="text-sm text-muted-foreground">
            Kelola riwayat diklat dan berkas pendukung milik Anda.
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <PlusIcon />
          Tambah diklat
        </Button>
      </div>

      {forbidden || errorMessage ? (
        <Alert variant="destructive">
          <CircleAlertIcon />
          <AlertTitle>Gagal memuat data</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <span>
              {forbidden
                ? "Akun ini tidak memiliki akses ke data diklat."
                : errorMessage}
            </span>
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
          <CardTitle>Daftar diklat</CardTitle>
          <CardDescription>
            {isPending
              ? "Memuat data diklat..."
              : "Data terbaru ditampilkan lebih dulu."}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-8"
                placeholder="Cari nomor surat atau materi"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  pager.reset()
                }}
                aria-label="Cari diklat"
              />
              {isFetching && !isPending ? (
                <Spinner className="absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              ) : null}
            </div>

            <Select
              items={jenisPelatihanItems}
              value={jenisPelatihanUuid || "all"}
              onValueChange={(value) => {
                setJenisPelatihanUuid(value === "all" ? "" : (value ?? ""))
                pager.reset()
              }}
            >
              <SelectTrigger
                className="w-full"
                aria-label="Filter jenis pelatihan"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua jenis pelatihan</SelectItem>
                {(jenisPelatihanOptions ?? []).map((option) => (
                  <SelectItem key={option.uuid} value={option.uuid}>
                    {option.jenis_pelatihan}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex flex-col gap-1">
              <Label
                htmlFor="filter_dari_tanggal"
                className="text-xs text-muted-foreground"
              >
                Pelaksanaan mulai
              </Label>
              <Input
                id="filter_dari_tanggal"
                type="date"
                value={dariTanggal}
                onChange={(event) => {
                  setDariTanggal(event.target.value)
                  pager.reset()
                }}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label
                htmlFor="filter_sampai_tanggal"
                className="text-xs text-muted-foreground"
              >
                Pelaksanaan sampai
              </Label>
              <Input
                id="filter_sampai_tanggal"
                type="date"
                value={sampaiTanggal}
                onChange={(event) => {
                  setSampaiTanggal(event.target.value)
                  pager.reset()
                }}
              />
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Filter tanggal menampilkan diklat yang periodenya bersinggungan
            dengan rentang yang dipilih.
          </p>

          {hasFilter ? (
            <Button
              variant="ghost"
              size="sm"
              className="w-fit"
              onClick={resetFilters}
            >
              <XIcon />
              Bersihkan filter
            </Button>
          ) : null}

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">No</TableHead>
                  <TableHead>Nomor surat</TableHead>
                  <TableHead>Jenis pelatihan</TableHead>
                  <TableHead>Materi pengembangan</TableHead>
                  <TableHead>Periode</TableHead>
                  <TableHead>Jam</TableHead>
                  <TableHead>Berkas</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isPending ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="h-32 text-center text-muted-foreground"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Spinner />
                        Memuat data diklat...
                      </span>
                    </TableCell>
                  </TableRow>
                ) : rows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="h-32 text-center text-muted-foreground"
                    >
                      {hasFilter
                        ? "Tidak ada diklat yang cocok dengan filter."
                        : "Belum ada data diklat."}
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((diklat, index) => (
                    <TableRow key={diklat.uuid}>
                      <TableCell className="text-muted-foreground">
                        {(pager.page - 1) * CURSOR_PAGE_SIZE + index + 1}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {diklat.nomor_surat}
                      </TableCell>
                      <TableCell>
                        {diklat.jenis_pelatihan?.jenis_pelatihan ?? "—"}
                      </TableCell>
                      <TableCell className="max-w-64 truncate">
                        {diklat.materi_pengembangan}
                      </TableCell>
                      <TableCell>
                        {formatPeriode(
                          diklat.dari_tanggal_pelaksanaan,
                          diklat.sampai_tanggal_pelaksanaan
                        )}
                      </TableCell>
                      <TableCell>
                        {formatJamPelatihan(diklat.jumlah_jam_pelatihan)}
                      </TableCell>
                      <TableCell>
                        {diklat.berkas_url ? (
                          <a
                            className="inline-flex items-center gap-1 text-sm text-primary underline-offset-4 hover:underline"
                            href={diklat.berkas_url}
                            target="_blank"
                            rel="noreferrer"
                            title="Unduh berkas"
                          >
                            <FileTextIcon className="size-4" />
                            Berkas
                          </a>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Lihat detail ${diklat.nomor_surat}`}
                            title="Lihat detail"
                            onClick={() => setDetailUuid(diklat.uuid)}
                          >
                            <EyeIcon />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Ubah data ${diklat.nomor_surat}`}
                            title="Ubah data"
                            onClick={() => openEditDialog(diklat)}
                          >
                            <PencilIcon />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive hover:text-destructive"
                            aria-label={`Hapus ${diklat.nomor_surat}`}
                            title="Hapus"
                            onClick={() => setDeletingDiklat(diklat)}
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
            entityLabel="diklat"
            onNext={() => pager.next(meta?.next_cursor)}
            onPrevious={pager.previous}
          />
        </CardContent>
      </Card>

      <DiklatFormDialog
        key={`${formOpen ? "open" : "closed"}-${editingDiklat?.uuid ?? "new"}`}
        open={formOpen}
        onOpenChange={handleFormOpenChange}
        diklat={editingDiklat}
      />

      <DiklatDetailDialog
        uuid={detailUuid}
        open={Boolean(detailUuid)}
        onOpenChange={(open) => {
          if (!open) {
            setDetailUuid(null)
          }
        }}
      />

      <DeleteDiklatDialog
        open={Boolean(deletingDiklat)}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingDiklat(null)
          }
        }}
        diklat={deletingDiklat}
        onDeleted={handleDeleted}
      />
    </div>
  )
}
