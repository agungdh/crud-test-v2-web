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
import type { Diklat } from "@/features/diklat/types"
import { useDeleteDiklat } from "@/features/diklat/use-diklat"
import { ApiError } from "@/lib/api"

type DeleteDiklatDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  diklat: Diklat | null
  onDeleted: () => void
}

export function DeleteDiklatDialog({
  open,
  onOpenChange,
  diklat,
  onDeleted,
}: DeleteDiklatDialogProps) {
  const deleteMutation = useDeleteDiklat()
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
        ? "Tidak dapat menghapus diklat. Silakan coba lagi."
        : null

  function handleDelete() {
    if (!diklat) {
      return
    }

    deleteMutation.mutate(diklat.uuid, {
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
          <AlertDialogTitle>Hapus data diklat?</AlertDialogTitle>
          <AlertDialogDescription>
            Diklat{" "}
            <span className="font-medium text-foreground">
              {diklat?.nomor_surat ?? "ini"}
            </span>{" "}
            beserta berkas pendukungnya akan dihapus. Tindakan ini tidak dapat
            dibatalkan.
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
