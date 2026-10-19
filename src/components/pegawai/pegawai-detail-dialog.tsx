import { CircleAlertIcon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { usePegawai } from "@/features/pegawai/use-pegawai"
import { formatDate, getGenderLabel } from "@/features/pegawai/utils"
import { ApiError } from "@/lib/api"

type PegawaiDetailDialogProps = {
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

export function PegawaiDetailDialog({
  uuid,
  open,
  onOpenChange,
}: PegawaiDetailDialogProps) {
  const { data: pegawai, error, isPending } = usePegawai(uuid, open)

  const errorMessage =
    error instanceof ApiError
      ? error.message
      : error
        ? "Tidak dapat memuat data pegawai."
        : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Detail pegawai</DialogTitle>
          <DialogDescription>
            Informasi lengkap data pegawai dan akun login.
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
        ) : pegawai ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-lg font-semibold">{pegawai.nama}</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-muted-foreground">
                  {pegawai.nip}
                </span>
                <Badge variant="secondary">
                  {getGenderLabel(pegawai.gender)}
                </Badge>
              </div>
            </div>

            <div className="grid gap-4 rounded-lg border p-4 sm:grid-cols-2">
              <DetailItem label="NIP" value={pegawai.nip} mono />
              <DetailItem label="Nama" value={pegawai.nama} />
              <DetailItem label="Email" value={pegawai.user?.email ?? "—"} />
              <DetailItem
                label="Username"
                value={pegawai.user?.username ?? "—"}
                mono
              />
              <DetailItem
                label="Tanggal lahir"
                value={formatDate(pegawai.tanggal_lahir)}
              />
              <DetailItem label="TMT" value={formatDate(pegawai.tmt)} />
              <DetailItem label="Jabatan" value={pegawai.jabatan ?? "—"} />
              <DetailItem label="Bidang" value={pegawai.bidang ?? "—"} />
              <DetailItem
                label="Jenis kelamin"
                value={getGenderLabel(pegawai.gender)}
              />
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
