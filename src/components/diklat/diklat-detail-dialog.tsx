import { CircleAlertIcon, DownloadIcon, FileTextIcon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { useDiklat } from "@/features/diklat/use-diklat"
import { formatJamPelatihan, formatPeriode } from "@/features/diklat/utils"
import { ApiError } from "@/lib/api"

type DiklatDetailDialogProps = {
  uuid: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

type DetailItemProps = {
  label: string
  value: string
  mono?: boolean
}

function DetailItem({ label, value, mono = false }: DetailItemProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className={mono ? "font-mono text-sm" : "text-sm"}>{value}</span>
    </div>
  )
}

export function DiklatDetailDialog({
  uuid,
  open,
  onOpenChange,
}: DiklatDetailDialogProps) {
  const { data: diklat, error, isPending } = useDiklat(uuid, open)

  const errorMessage =
    error instanceof ApiError
      ? error.message
      : error
        ? "Tidak dapat memuat data diklat."
        : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Detail diklat</DialogTitle>
          <DialogDescription>
            Informasi lengkap data diklat yang Anda ikuti.
          </DialogDescription>
        </DialogHeader>

        {isPending ? (
          <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
            <Spinner />
            Memuat data...
          </div>
        ) : errorMessage ? (
          <Alert variant="destructive">
            <CircleAlertIcon />
            <AlertTitle>Gagal memuat</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : diklat ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-lg font-semibold">
                {diklat.jenis_pelatihan?.jenis_pelatihan ?? "Diklat"}
              </span>
              <span className="font-mono text-sm text-muted-foreground">
                {diklat.nomor_surat}
              </span>
            </div>

            <div className="grid gap-4 rounded-lg border p-4 sm:grid-cols-2">
              <DetailItem
                label="Jenis pelatihan"
                value={diklat.jenis_pelatihan?.jenis_pelatihan ?? "—"}
              />
              <DetailItem label="Nomor surat" value={diklat.nomor_surat} mono />
              <DetailItem
                label="Materi pengembangan"
                value={diklat.materi_pengembangan}
              />
              <DetailItem
                label="Jumlah jam pelatihan"
                value={formatJamPelatihan(diklat.jumlah_jam_pelatihan)}
              />
              <DetailItem
                label="Periode pelaksanaan"
                value={formatPeriode(
                  diklat.dari_tanggal_pelaksanaan,
                  diklat.sampai_tanggal_pelaksanaan
                )}
              />
            </div>

            <div className="flex flex-col gap-2 rounded-lg border p-4">
              <span className="text-xs font-medium text-muted-foreground">
                Berkas pendukung
              </span>
              {diklat.berkas_url ? (
                <a
                  className="flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
                  href={diklat.berkas_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FileTextIcon className="size-4 shrink-0" />
                  <span className="truncate">Buka berkas pendukung</span>
                  <DownloadIcon className="size-4 shrink-0" />
                </a>
              ) : (
                <span className="text-sm text-muted-foreground">
                  Tidak ada berkas pendukung.
                </span>
              )}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
