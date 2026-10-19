import { formatDate } from "@/lib/format"

/** Render the pelaksanaan range, collapsing a single-day event. */
export function formatPeriode(dari: string, sampai: string): string {
  const start = dari.slice(0, 10)
  const end = sampai.slice(0, 10)

  if (start === end) {
    return formatDate(start)
  }

  return `${formatDate(start)} – ${formatDate(end)}`
}

export function formatJamPelatihan(jam: number): string {
  return `${jam} JP`
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(0)} KB`
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
