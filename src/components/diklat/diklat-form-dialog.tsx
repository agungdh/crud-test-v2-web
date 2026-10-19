import {
  CircleAlertIcon,
  FileTextIcon,
  PaperclipIcon,
  SaveIcon,
  XIcon,
} from "lucide-react"
import { useState, useRef, type FormEvent } from "react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import type { Diklat, DiklatPayload } from "@/features/diklat/types"
import { useCreateDiklat, useUpdateDiklat } from "@/features/diklat/use-diklat"
import { formatFileSize } from "@/features/diklat/utils"
import { useJenisPelatihanOptions } from "@/features/jenis-pelatihan/use-jenis-pelatihan"
import { ApiError } from "@/lib/api"

type DiklatFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  diklat: Diklat | null
}

type FormState = {
  jenis_pelatihan_uuid: string
  nomor_surat: string
  materi_pengembangan: string
  dari_tanggal_pelaksanaan: string
  sampai_tanggal_pelaksanaan: string
  jumlah_jam_pelatihan: string
}

function toFormState(diklat: Diklat | null): FormState {
  if (!diklat) {
    return {
      jenis_pelatihan_uuid: "",
      nomor_surat: "",
      materi_pengembangan: "",
      dari_tanggal_pelaksanaan: "",
      sampai_tanggal_pelaksanaan: "",
      jumlah_jam_pelatihan: "",
    }
  }

  return {
    jenis_pelatihan_uuid: diklat.jenis_pelatihan?.uuid ?? "",
    nomor_surat: diklat.nomor_surat,
    materi_pengembangan: diklat.materi_pengembangan,
    dari_tanggal_pelaksanaan: diklat.dari_tanggal_pelaksanaan.slice(0, 10),
    sampai_tanggal_pelaksanaan: diklat.sampai_tanggal_pelaksanaan.slice(0, 10),
    jumlah_jam_pelatihan: String(diklat.jumlah_jam_pelatihan),
  }
}

export function DiklatFormDialog({
  open,
  onOpenChange,
  diklat,
}: DiklatFormDialogProps) {
  const [form, setForm] = useState<FormState>(() => toFormState(diklat))
  const [berkas, setBerkas] = useState<File | null>(null)
  const [removeBerkas, setRemoveBerkas] = useState(false)
  const [clientError, setClientError] = useState<string | null>(null)
  const berkasInputRef = useRef<HTMLInputElement>(null)

  const createMutation = useCreateDiklat()
  const updateMutation = useUpdateDiklat()
  const { data: jenisPelatihanOptions, isPending: isLoadingOptions } =
    useJenisPelatihanOptions()

  const error = createMutation.error ?? updateMutation.error
  const fieldErrors = error instanceof ApiError ? error.errors : {}
  const isSubmitting = createMutation.isPending || updateMutation.isPending
  const isEditing = Boolean(diklat)
  const formError =
    error && Object.keys(fieldErrors).length === 0
      ? error instanceof ApiError
        ? error.message
        : "Tidak dapat menghubungi server. Silakan coba lagi."
      : null

  const jenisPelatihanItems: Record<string, string> = {}

  if (diklat?.jenis_pelatihan) {
    jenisPelatihanItems[diklat.jenis_pelatihan.uuid] =
      diklat.jenis_pelatihan.jenis_pelatihan
  }

  for (const option of jenisPelatihanOptions ?? []) {
    jenisPelatihanItems[option.uuid] = option.jenis_pelatihan
  }

  function updateForm<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function clearBerkasInput() {
    if (berkasInputRef.current) {
      berkasInputRef.current.value = ""
    }
  }

  function handleBerkasChange(file: File | null) {
    setBerkas(file)
    setRemoveBerkas(false)

    if (!file) {
      clearBerkasInput()
    }
  }

  function handleRemoveBerkas() {
    setBerkas(null)
    setRemoveBerkas(true)
    clearBerkasInput()
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!form.jenis_pelatihan_uuid) {
      setClientError("Pilih jenis pelatihan terlebih dahulu.")

      return
    }

    if (
      form.dari_tanggal_pelaksanaan &&
      form.sampai_tanggal_pelaksanaan &&
      form.dari_tanggal_pelaksanaan > form.sampai_tanggal_pelaksanaan
    ) {
      setClientError("Tanggal mulai tidak boleh melewati tanggal selesai.")

      return
    }

    setClientError(null)

    const payload: DiklatPayload = {
      jenis_pelatihan_uuid: form.jenis_pelatihan_uuid,
      nomor_surat: form.nomor_surat.trim(),
      materi_pengembangan: form.materi_pengembangan.trim(),
      dari_tanggal_pelaksanaan: form.dari_tanggal_pelaksanaan,
      sampai_tanggal_pelaksanaan: form.sampai_tanggal_pelaksanaan,
      jumlah_jam_pelatihan: Number(form.jumlah_jam_pelatihan),
    }

    if (berkas) {
      payload.berkas = berkas
    } else if (isEditing && removeBerkas) {
      payload.berkas = null
    }

    if (diklat) {
      updateMutation.mutate(
        { uuid: diklat.uuid, payload },
        {
          onSuccess: () => onOpenChange(false),
        }
      )

      return
    }

    createMutation.mutate(payload, {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Ubah data diklat" : "Tambah data diklat"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Perbarui data diklat milik Anda."
              : "Catat riwayat diklat yang Anda ikuti."}
          </DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {formError || clientError ? (
            <Alert variant="destructive">
              <CircleAlertIcon />
              <AlertTitle>Gagal menyimpan</AlertTitle>
              <AlertDescription>{formError ?? clientError}</AlertDescription>
            </Alert>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="jenis_pelatihan_uuid">Jenis pelatihan</Label>
              <Select
                items={jenisPelatihanItems}
                value={form.jenis_pelatihan_uuid}
                onValueChange={(value) =>
                  updateForm("jenis_pelatihan_uuid", value ?? "")
                }
              >
                <SelectTrigger
                  id="jenis_pelatihan_uuid"
                  className="w-full"
                  aria-invalid={Boolean(fieldErrors.jenis_pelatihan_uuid)}
                >
                  <SelectValue placeholder="Pilih jenis pelatihan" />
                </SelectTrigger>
                <SelectContent>
                  {(jenisPelatihanOptions ?? []).map((option) => (
                    <SelectItem key={option.uuid} value={option.uuid}>
                      {option.jenis_pelatihan}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.jenis_pelatihan_uuid?.[0] ? (
                <p className="text-xs text-destructive">
                  {fieldErrors.jenis_pelatihan_uuid[0]}
                </p>
              ) : isLoadingOptions ? (
                <p className="text-xs text-muted-foreground">
                  Memuat jenis pelatihan...
                </p>
              ) : (jenisPelatihanOptions ?? []).length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  Belum ada jenis pelatihan. Tambahkan lebih dulu di menu Jenis
                  Pelatihan.
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nomor_surat">Nomor surat</Label>
              <Input
                id="nomor_surat"
                required
                maxLength={255}
                value={form.nomor_surat}
                onChange={(event) =>
                  updateForm("nomor_surat", event.target.value)
                }
                aria-invalid={Boolean(fieldErrors.nomor_surat)}
              />
              {fieldErrors.nomor_surat?.[0] ? (
                <p className="text-xs text-destructive">
                  {fieldErrors.nomor_surat[0]}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor="materi_pengembangan">Materi pengembangan</Label>
              <Input
                id="materi_pengembangan"
                required
                maxLength={255}
                value={form.materi_pengembangan}
                onChange={(event) =>
                  updateForm("materi_pengembangan", event.target.value)
                }
                aria-invalid={Boolean(fieldErrors.materi_pengembangan)}
              />
              {fieldErrors.materi_pengembangan?.[0] ? (
                <p className="text-xs text-destructive">
                  {fieldErrors.materi_pengembangan[0]}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="dari_tanggal_pelaksanaan">Tanggal mulai</Label>
              <Input
                id="dari_tanggal_pelaksanaan"
                type="date"
                required
                value={form.dari_tanggal_pelaksanaan}
                onChange={(event) =>
                  updateForm("dari_tanggal_pelaksanaan", event.target.value)
                }
                aria-invalid={Boolean(fieldErrors.dari_tanggal_pelaksanaan)}
              />
              {fieldErrors.dari_tanggal_pelaksanaan?.[0] ? (
                <p className="text-xs text-destructive">
                  {fieldErrors.dari_tanggal_pelaksanaan[0]}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sampai_tanggal_pelaksanaan">
                Tanggal selesai
              </Label>
              <Input
                id="sampai_tanggal_pelaksanaan"
                type="date"
                required
                value={form.sampai_tanggal_pelaksanaan}
                onChange={(event) =>
                  updateForm("sampai_tanggal_pelaksanaan", event.target.value)
                }
                aria-invalid={Boolean(fieldErrors.sampai_tanggal_pelaksanaan)}
              />
              {fieldErrors.sampai_tanggal_pelaksanaan?.[0] ? (
                <p className="text-xs text-destructive">
                  {fieldErrors.sampai_tanggal_pelaksanaan[0]}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="jumlah_jam_pelatihan">Jumlah jam pelatihan</Label>
              <Input
                id="jumlah_jam_pelatihan"
                type="number"
                min={1}
                required
                value={form.jumlah_jam_pelatihan}
                onChange={(event) =>
                  updateForm("jumlah_jam_pelatihan", event.target.value)
                }
                aria-invalid={Boolean(fieldErrors.jumlah_jam_pelatihan)}
              />
              {fieldErrors.jumlah_jam_pelatihan?.[0] ? (
                <p className="text-xs text-destructive">
                  {fieldErrors.jumlah_jam_pelatihan[0]}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Dalam satuan jam pelatihan (JP).
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="berkas">Berkas pendukung</Label>
              <Input
                id="berkas"
                ref={berkasInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(event) =>
                  handleBerkasChange(event.target.files?.[0] ?? null)
                }
                aria-invalid={Boolean(fieldErrors.berkas)}
              />
              {fieldErrors.berkas?.[0] ? (
                <p className="text-xs text-destructive">
                  {fieldErrors.berkas[0]}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  PDF atau gambar, maksimal 10 MB.
                </p>
              )}
            </div>

            {isEditing ? (
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Lampiran tersimpan
                </span>
                {berkas ? (
                  <div className="flex items-center gap-2 rounded-lg border p-2 text-sm">
                    <PaperclipIcon className="size-4 shrink-0 text-muted-foreground" />
                    <span className="truncate">{berkas.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatFileSize(berkas.size)}
                    </span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      Akan menggantikan lampiran lama
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      aria-label="Batalkan berkas baru"
                      onClick={() => handleBerkasChange(null)}
                    >
                      <XIcon />
                    </Button>
                  </div>
                ) : diklat?.berkas_filename && !removeBerkas ? (
                  <div className="flex items-center gap-2 rounded-lg border p-2 text-sm">
                    <FileTextIcon className="size-4 shrink-0 text-muted-foreground" />
                    <span className="truncate">{diklat.berkas_filename}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="ml-auto text-destructive hover:text-destructive"
                      onClick={handleRemoveBerkas}
                    >
                      <XIcon />
                      Hapus lampiran
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 rounded-lg border border-dashed p-2 text-sm text-muted-foreground">
                    <span>
                      {removeBerkas
                        ? "Lampiran akan dihapus saat disimpan."
                        : "Tidak ada lampiran tersimpan."}
                    </span>
                    {removeBerkas ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-auto"
                        onClick={() => setRemoveBerkas(false)}
                      >
                        Batal hapus
                      </Button>
                    ) : null}
                  </div>
                )}
              </div>
            ) : null}
          </div>

          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Spinner /> : <SaveIcon />}
              Simpan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
