import type { JenisPelatihan } from "@/features/jenis-pelatihan/types"
import type { PaginatedResponse } from "@/lib/pagination"

export type { PaginatedResponse }

export type Diklat = {
  uuid: string
  pegawai_uuid?: string
  jenis_pelatihan?: JenisPelatihan
  nomor_surat: string
  materi_pengembangan: string
  dari_tanggal_pelaksanaan: string
  sampai_tanggal_pelaksanaan: string
  jumlah_jam_pelatihan: number
  berkas_filename: string | null
  berkas_url: string | null
}

export type DiklatFilters = {
  search?: string
  jenis_pelatihan_uuid?: string
  dari_tanggal?: string
  sampai_tanggal?: string
  page?: number
  per_page?: number
}

export type DiklatPayload = {
  jenis_pelatihan_uuid: string
  nomor_surat: string
  materi_pengembangan: string
  dari_tanggal_pelaksanaan: string
  sampai_tanggal_pelaksanaan: string
  jumlah_jam_pelatihan: number
  /**
   * Attachment is keep-or-replace: `undefined` keeps the stored file, a `File`
   * replaces it, and `null` removes it. Ignored on create.
   */
  berkas?: File | null
}
