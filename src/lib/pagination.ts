/**
 * The API uses keyset (cursor) pagination.
 *
 * A list response carries only `data` and the UUID cursor of the last item on
 * the page. There is no total count and no previous cursor, so the UI keeps
 * the previous cursors itself while the user navigates back.
 */
export type PaginationMeta = {
  next_cursor: string | null
}

export type PaginatedResponse<T> = {
  data: T[]
  meta: PaginationMeta
}

/** The API fixes the cursor page size at 20 items. */
export const CURSOR_PAGE_SIZE = 20
