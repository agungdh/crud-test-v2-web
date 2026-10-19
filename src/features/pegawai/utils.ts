import type { Gender } from "@/features/pegawai/types"

export { formatDate } from "@/lib/format"

export function getGenderLabel(gender: Gender | null): string {
  if (gender === "male") {
    return "Laki-laki"
  }

  if (gender === "female") {
    return "Perempuan"
  }

  return "Tidak diketahui"
}
