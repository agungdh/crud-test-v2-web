import { useCallback, useState } from "react"

/**
 * Keep a stack of the cursors that have been visited.
 *
 * The API only returns `meta.next_cursor`, so the previous page is reached by
 * replaying a cursor that was already fetched instead of asking the server for
 * a previous cursor.
 */
export function useCursorPagination() {
  const [cursors, setCursors] = useState<(string | null)[]>([null])
  const [index, setIndex] = useState(0)

  const cursor = cursors[index] ?? undefined
  const page = index + 1
  const hasPrevious = index > 0

  const next = useCallback(
    (nextCursor: string | null | undefined) => {
      if (!nextCursor) {
        return
      }

      setCursors((current) => [...current.slice(0, index + 1), nextCursor])
      setIndex((current) => current + 1)
    },
    [index]
  )

  const previous = useCallback(() => {
    setIndex((current) => Math.max(0, current - 1))
  }, [])

  const reset = useCallback(() => {
    setCursors([null])
    setIndex(0)
  }, [])

  return { cursor, page, hasPrevious, next, previous, reset }
}
