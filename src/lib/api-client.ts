import { ApiResponse } from "../../shared/types"

async function attemptFetch<T>(path: string, init: RequestInit, attempt: number = 1): Promise<T> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000)

  const shouldSetJsonHeader = !init?.headers?.['Content-Type'] && 
    (init?.body || ['POST', 'PUT', 'PATCH', 'DELETE'].includes((init?.method || 'GET').toUpperCase()))

  const fetchHeaders = shouldSetJsonHeader 
    ? { 'Content-Type': 'application/json' }
    : {}

  const res = await fetch(path, {
    signal: controller.signal,
    headers: { ...fetchHeaders, ...init?.headers },
    ...init
  })
  clearTimeout(timeoutId)

  let json: ApiResponse<T>
  try {
    json = await res.json()
  } catch {
    throw new Error('Invalid JSON')
  }

  if (json.data !== undefined) return json.data
  throw new Error(json.error || `Request failed: ${res.status}`)

}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  let lastError: Error | null = null
  const maxRetries = 3
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await attemptFetch(path, { ...init } as RequestInit, attempt)
    } catch (error: any) {
      lastError = error

      const isNetworkError = error.name === 'TypeError' || error.name === 'AbortError'
      const isServerError = (error as any).status && (error as any).status >= 500
      const isTimeout = error.name === 'AbortError'

      if (!isNetworkError && !isServerError && !isTimeout || attempt === maxRetries) {
        console.error(`API ${path} failed after ${attempt} attempts:`, {
          error: error.message,
          attempts: attempt
        })
        throw error
      }
      
      const delay = Math.min(100 * Math.pow(2, attempt - 1), 2000)
      await new Promise(r => setTimeout(r, delay))
    }
  }
  
  throw lastError!
}