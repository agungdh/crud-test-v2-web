import { CircleAlertIcon, SaveIcon } from "lucide-react"
import { useState, type FormEvent } from "react"

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
import { Spinner } from "@/components/ui/spinner"
import {
  useCreateJenisPelatihan,
  useUpdateJenisPelatihan,
} from "@/features/jenis-pelatihan/use-jenis-pelatihan"
import type { JenisPelatihan } from "@/features/jenis-pelatihan/types"
import { ApiError } from "@/lib/api"

type JenisPelatihanFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  jenisPelatihan: JenisPelatihan | null
}

export function JenisPelatihanFormDialog({
  open,
  onOpenChange,
  jenisPelatihan,
}: JenisPelatihanFormDialogProps) {
  const [nama, setNama] = useState(jenisPelatihan?.jenis_pelatihan ?? "")

  const createMutation = useCreateJenisPelatihan()
  const updateMutation = useUpdateJenisPelatihan()

  const error = createMutation.error ?? updateMutation.error
  const fieldErrors = error instanceof ApiError ? error.errors : {}
  const isSubmitting = createMutation.isPending || updateMutation.isPending
  const isEditing = Boolean(jenisPelatihan)
  const formError =
    error && Object.keys(fieldErrors).length === 0
      ? error instanceof ApiError
        ? error.message
        : "Tidak dapat menghubungi server. Silakan coba lagi."
      : null

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const payload = { jenis_pelatihan: nama.trim() }

    if (jenisPelatihan) {
      updateMutation.mutate(
        { uuid: jenisPelatihan.uuid, payload },
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Ubah jenis pelatihan" : "Tambah jenis pelatihan"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Perbarui nama jenis pelatihan."
              : "Tambahkan jenis pelatihan baru sebagai pilihan pada data diklat."}
          </DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {formError ? (
            <Alert variant="destructive">
              <CircleAlertIcon />
              <AlertTitle>Gagal menyimpan</AlertTitle>
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          ) : null}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="jenis_pelatihan">Nama jenis pelatihan</Label>
            <Input
              id="jenis_pelatihan"
              required
              maxLength={255}
              value={nama}
              onChange={(event) => setNama(event.target.value)}
              aria-invalid={Boolean(fieldErrors.jenis_pelatihan)}
            />
            {fieldErrors.jenis_pelatihan?.[0] ? (
              <p className="text-xs text-destructive">
                {fieldErrors.jenis_pelatihan[0]}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Nama tidak boleh sama dengan jenis pelatihan lain.
              </p>
            )}
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
