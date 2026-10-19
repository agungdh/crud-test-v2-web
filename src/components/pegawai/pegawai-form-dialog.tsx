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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import {
  useCreatePegawai,
  useUpdatePegawai,
} from "@/features/pegawai/use-pegawai"
import type { Gender, Pegawai } from "@/features/pegawai/types"
import { ApiError } from "@/lib/api"

type PegawaiFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  pegawai: Pegawai | null
}

type FormState = {
  nip: string
  nama: string
  email: string
  password: string
  tanggal_lahir: string
  jabatan: string
  bidang: string
  gender: Gender | null
  tmt: string
}

const emptyForm: FormState = {
  nip: "",
  nama: "",
  email: "",
  password: "",
  tanggal_lahir: "",
  jabatan: "",
  bidang: "",
  gender: null,
  tmt: "",
}

const genderItems = {
  none: "Tidak diketahui",
  male: "Laki-laki",
  female: "Perempuan",
}

function toFormState(pegawai: Pegawai | null): FormState {
  if (!pegawai) {
    return emptyForm
  }

  return {
    nip: pegawai.nip,
    nama: pegawai.nama,
    email: pegawai.user?.email ?? "",
    password: "",
    tanggal_lahir: pegawai.tanggal_lahir ?? "",
    jabatan: pegawai.jabatan ?? "",
    bidang: pegawai.bidang ?? "",
    gender: pegawai.gender,
    tmt: pegawai.tmt ?? "",
  }
}

export function PegawaiFormDialog({
  open,
  onOpenChange,
  pegawai,
}: PegawaiFormDialogProps) {
  const [form, setForm] = useState<FormState>(() => toFormState(pegawai))

  const createMutation = useCreatePegawai()
  const updateMutation = useUpdatePegawai()

  const error = createMutation.error ?? updateMutation.error
  const fieldErrors = error instanceof ApiError ? error.errors : {}
  const isSubmitting = createMutation.isPending || updateMutation.isPending
  const isEditing = Boolean(pegawai)
  const formError =
    error && Object.keys(fieldErrors).length === 0
      ? error instanceof ApiError
        ? error.message
        : "Tidak dapat menghubungi server. Silakan coba lagi."
      : null

  function updateForm<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const basePayload = {
      email: form.email.trim() || null,
      nip: form.nip.trim(),
      nama: form.nama.trim(),
      tanggal_lahir: form.tanggal_lahir || null,
      jabatan: form.jabatan.trim() || null,
      bidang: form.bidang.trim() || null,
      gender: form.gender,
      tmt: form.tmt || null,
    }

    if (pegawai) {
      updateMutation.mutate(
        {
          uuid: pegawai.uuid,
          payload: {
            ...basePayload,
            ...(form.password ? { password: form.password } : {}),
          },
        },
        {
          onSuccess: () => onOpenChange(false),
        }
      )

      return
    }

    createMutation.mutate(
      { ...basePayload, password: form.password },
      {
        onSuccess: () => onOpenChange(false),
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Ubah data pegawai" : "Tambah pegawai"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Perbarui data pegawai dan akun login yang terhubung."
              : "Buat data pegawai sekaligus akun login untuknya."}
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

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nip">NIP</Label>
              <Input
                id="nip"
                required
                inputMode="numeric"
                autoComplete="username"
                value={form.nip}
                onChange={(event) => updateForm("nip", event.target.value)}
                aria-invalid={Boolean(fieldErrors.nip)}
              />
              {fieldErrors.nip?.[0] ? (
                <p className="text-xs text-destructive">{fieldErrors.nip[0]}</p>
              ) : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nama">Nama</Label>
              <Input
                id="nama"
                required
                value={form.nama}
                onChange={(event) => updateForm("nama", event.target.value)}
                aria-invalid={Boolean(fieldErrors.nama)}
              />
              {fieldErrors.nama?.[0] ? (
                <p className="text-xs text-destructive">
                  {fieldErrors.nama[0]}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(event) => updateForm("email", event.target.value)}
                aria-invalid={Boolean(fieldErrors.email)}
              />
              {fieldErrors.email?.[0] ? (
                <p className="text-xs text-destructive">
                  {fieldErrors.email[0]}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                required={!isEditing}
                value={form.password}
                onChange={(event) => updateForm("password", event.target.value)}
                aria-invalid={Boolean(fieldErrors.password)}
              />
              {fieldErrors.password?.[0] ? (
                <p className="text-xs text-destructive">
                  {fieldErrors.password[0]}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  {isEditing
                    ? "Kosongkan jika tidak ingin mengubah password."
                    : "Minimal 8 karakter."}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="tanggal_lahir">Tanggal lahir</Label>
              <Input
                id="tanggal_lahir"
                type="date"
                value={form.tanggal_lahir}
                onChange={(event) =>
                  updateForm("tanggal_lahir", event.target.value)
                }
                aria-invalid={Boolean(fieldErrors.tanggal_lahir)}
              />
              {fieldErrors.tanggal_lahir?.[0] ? (
                <p className="text-xs text-destructive">
                  {fieldErrors.tanggal_lahir[0]}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="tmt">TMT</Label>
              <Input
                id="tmt"
                type="date"
                value={form.tmt}
                onChange={(event) => updateForm("tmt", event.target.value)}
                aria-invalid={Boolean(fieldErrors.tmt)}
              />
              {fieldErrors.tmt?.[0] ? (
                <p className="text-xs text-destructive">{fieldErrors.tmt[0]}</p>
              ) : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="jabatan">Jabatan</Label>
              <Input
                id="jabatan"
                value={form.jabatan}
                onChange={(event) => updateForm("jabatan", event.target.value)}
                aria-invalid={Boolean(fieldErrors.jabatan)}
              />
              {fieldErrors.jabatan?.[0] ? (
                <p className="text-xs text-destructive">
                  {fieldErrors.jabatan[0]}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="bidang">Bidang</Label>
              <Input
                id="bidang"
                value={form.bidang}
                onChange={(event) => updateForm("bidang", event.target.value)}
                aria-invalid={Boolean(fieldErrors.bidang)}
              />
              {fieldErrors.bidang?.[0] ? (
                <p className="text-xs text-destructive">
                  {fieldErrors.bidang[0]}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="gender">Jenis kelamin</Label>
              <Select
                items={genderItems}
                value={form.gender ?? "none"}
                onValueChange={(value) =>
                  updateForm(
                    "gender",
                    value === "male" || value === "female" ? value : null
                  )
                }
              >
                <SelectTrigger
                  id="gender"
                  className="w-full"
                  aria-invalid={Boolean(fieldErrors.gender)}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Tidak diketahui</SelectItem>
                  <SelectItem value="male">Laki-laki</SelectItem>
                  <SelectItem value="female">Perempuan</SelectItem>
                </SelectContent>
              </Select>
              {fieldErrors.gender?.[0] ? (
                <p className="text-xs text-destructive">
                  {fieldErrors.gender[0]}
                </p>
              ) : null}
            </div>
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
