import type { Gender } from "@/features/pegawai/types"

export function getGenderLabel(gender: Gender | null): string {
  if (gender === "male") {
    return "Laki-laki"
  }

  if (gender === "female") {
    return "Perempuan"
  }

  return "Tidak diketahui"
}

export function formatDate(value: string | null): string {
  if (!value) {
    return "—"
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(`${value.slice(0, 10)}T00:00:00`))
}

export function formatDateTime(value: string | null): string {
  if (!value) {
    return "—"
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(new Date(value))
}
