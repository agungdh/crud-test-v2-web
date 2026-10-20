import { ApiError, csrfHeaders, request } from "@/lib/api"

/**
 * The API only accepts PDF, JPEG, and PNG attachments. Keep the same limit on
 * the client so an oversized or unsupported file fails before it is uploaded.
 */
export const MAX_BERKAS_SIZE = 10 * 1024 * 1024

const allowedMimeTypes = new Set(["application/pdf", "image/jpeg", "image/png"])

const allowedExtension = /\.(pdf|jpe?g|png)$/i

export type BerkasUpload = {
  path: string
  upload_url: string
  fields: Record<string, string>
  expires_at: string
  max_size: number
}

type BerkasUploadResponse = {
  data: BerkasUpload
}

function uploadError(message: string): ApiError {
  return new ApiError(422, message, { berkas: [message] })
}

function assertBerkas(file: File): void {
  if (file.size < 1 || file.size > MAX_BERKAS_SIZE) {
    throw uploadError("Ukuran berkas harus antara 1 byte dan 10 MB.")
  }

  const typeAllowed = file.type
    ? allowedMimeTypes.has(file.type)
    : allowedExtension.test(file.name)

  if (!typeAllowed) {
    throw uploadError("Berkas harus berupa PDF, JPEG, atau PNG.")
  }
}

/**
 * Ask the API for a presigned S3 POST, upload the file directly to S3, and
 * return the temporary path that the diklat payload must reference.
 */
export async function uploadBerkas(file: File): Promise<string> {
  assertBerkas(file)

  const headers = await csrfHeaders()

  const response = await request<BerkasUploadResponse>("/api/berkas-upload", {
    method: "POST",
    body: { max_size: file.size },
    headers,
  })

  const formData = new FormData()

  for (const [name, value] of Object.entries(response.data.fields)) {
    formData.append(name, value)
  }

  // S3 requires the file part to be appended last.
  formData.append("file", file)

  let upload: Response

  try {
    upload = await fetch(response.data.upload_url, {
      method: "POST",
      body: formData,
    })
  } catch {
    throw uploadError(
      "Tidak dapat mengunggah berkas ke penyimpanan. Silakan coba lagi."
    )
  }

  if (!upload.ok) {
    throw uploadError(
      `Gagal mengunggah berkas (status ${upload.status}). Silakan coba lagi.`
    )
  }

  return response.data.path
}
