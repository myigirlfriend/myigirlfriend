/** Raised when Supabase reports a failure. `code` is the Postgres / PostgREST error code when there is one. */
export class RepositoryError extends Error {
  readonly code?: string

  constructor(error: { message: string; code?: string }) {
    super(error.message)
    this.name = 'RepositoryError'
    this.code = error.code
  }
}

interface QueryError {
  message: string
  code?: string
}

interface QueryResult {
  data: unknown
  error: QueryError | null
}

// Supabase returns { data, error } instead of throwing. These helpers turn an error into a
// RepositoryError and give the data the row type the query is known to produce.

/** A single row, or null when nothing matched. */
export const one = <T>({ data, error }: QueryResult): T | null => {
  if (error) throw new RepositoryError(error)
  return (data as T | null) ?? null
}

/** A row that must exist, e.g. the result of an insert. */
export const required = <T>(result: QueryResult): T => {
  const row = one<T>(result)
  if (!row) throw new RepositoryError({ message: 'The query returned no row' })
  return row
}

export const many = <T>({ data, error }: QueryResult): T[] => {
  if (error) throw new RepositoryError(error)
  return (data as T[] | null) ?? []
}

/** For writes that return nothing. */
export const done = ({ error }: { error: QueryError | null }): void => {
  if (error) throw new RepositoryError(error)
}

export const total = ({ count, error }: { count: number | null; error: QueryError | null }): number => {
  if (error) throw new RepositoryError(error)
  return count ?? 0
}
