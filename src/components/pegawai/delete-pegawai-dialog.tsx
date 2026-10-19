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
import { useDeletePegawai } from "@/features/pegawai/use-pegawai"
import type { Pegawai } from "@/features/pegawai/types"
import { ApiError } from "@/lib/api"

type DeletePegawaiDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  pegawai: Pegawai | null
  onDeleted: () => void
}

export function DeletePegawaiDialog({
  open,
  onOpenChange,
  pegawai,
  onDeleted,
}: DeletePegawaiDialogProps) {
  const deleteMutation = useDeletePegawai()
  const { reset } = deleteMutation

  useEffect(() => {
    if (open) {
      reset()
    }
  }, [open, reset])

  const error = deleteMutation.error
  const errorMessage =
    error instanceof ApiError
      ? error.message
      : error
        ? "Tidak dapat menghapus pegawai. Silakan coba lagi."
        : null

  function handleDelete() {
    if (!pegawai) {
      return
    }

    deleteMutation.mutate(pegawai.uuid, {
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
          <AlertDialogTitle>Hapus data pegawai?</AlertDialogTitle>
          <AlertDialogDescription>
            Data pegawai{" "}
            <span className="font-medium text-foreground">
              {pegawai?.nama ?? "ini"}
            </span>{" "}
            beserta akun login yang terhubung akan dihapus. Tindakan ini tidak
            dapat dibatalkan.
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
