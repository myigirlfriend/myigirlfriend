/** An error a service throws on purpose. The error middleware turns it into `{ error }` with this status. */
export class HttpError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message)
    this.name = 'HttpError'
  }
}

export const badRequest = (message: string) => new HttpError(400, message)
export const unauthorized = (message = 'Unauthorized') => new HttpError(401, message)
export const forbidden = (message = 'Forbidden') => new HttpError(403, message)
export const notFound = (message = 'Not found') => new HttpError(404, message)
export const conflict = (message: string) => new HttpError(409, message)
export const serverError = (message = 'Internal server error') => new HttpError(500, message)

export const errorMessage = (e: unknown): string => (e instanceof Error ? e.message : String(e))
