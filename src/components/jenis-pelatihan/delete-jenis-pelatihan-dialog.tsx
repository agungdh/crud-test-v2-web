import { CircleAlertIcon, Trash2Icon } from "lucide-react"
import { useEffect } from "react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Spinner } from "@/components/ui/spinner"
import type { JenisPelatihan } from "@/features/jenis-pelatihan/types"
import { useDeleteJenisPelatihan } from "@/features/jenis-pelatihan/use-jenis-pelatihan"
import { ApiError } from "@/lib/api"

type DeleteJenisPelatihanDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  jenisPelatihan: JenisPelatihan | null
  onDeleted: () => void
}

export function DeleteJenisPelatihanDialog({
  open,
  onOpenChange,
  jenisPelatihan,
  onDeleted,
}: DeleteJenisPelatihanDialogProps) {
  const deleteMutation = useDeleteJenisPelatihan()
  const { reset } = deleteMutation

  useEffect(() => {
    if (open) {
      reset()
    }
  }, [open, reset])

  const error = deleteMutation.error
  const errorMessage =
    error instanceof ApiError
      ? (error.errors.jenis_pelatihan?.[0] ?? error.message)
      : error
        ? "Tidak dapat menghapus jenis pelatihan. Silakan coba lagi."
        : null

  function handleDelete() {
    if (!jenisPelatihan) {
      return
    }

    deleteMutation.mutate(jenisPelatihan.uuid, {
      onSuccess: () => {
        onDeleted()
        onOpenChange(false)
      },
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Hapus jenis pelatihan?</AlertDialogTitle>
          <AlertDialogDescription>
            Jenis pelatihan{" "}
            <span className="font-medium text-foreground">
              {jenisPelatihan?.jenis_pelatihan ?? "ini"}
            </span>{" "}
            akan dihapus. Jenis pelatihan yang masih dipakai oleh data diklat
            tidak dapat dihapus.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {errorMessage ? (
          <Alert variant="destructive">
            <CircleAlertIcon />
            <AlertTitle>Gagal menghapus</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={deleteMutation.isPending}
            onClick={handleDelete}
          >
            {deleteMutation.isPending ? <Spinner /> : <Trash2Icon />}
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
