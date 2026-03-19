export function jsonError(status: number, error: string) {
  return Response.json({ error }, { status })
}

export function getStringValue(
  record: Record<string, unknown>,
  key: string,
): string | null {
  const value = record[key]
  return typeof value === "string" ? value : null
}

export function wireAbortSignal(
  request: Request,
  abortController: AbortController,
) {
  if (request.signal.aborted) {
    abortController.abort()
    return
  }

  request.signal.addEventListener(
    "abort",
    () => {
      abortController.abort()
    },
    { once: true },
  )
}
