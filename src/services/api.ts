import type { ColorizationResponse } from '../types/colorization'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export function assetUrl(path: string): string {
  return path.startsWith('http') ? path : `${API_BASE_URL}${path}`
}

export async function colorizeImage(file: File): Promise<ColorizationResponse> {
  const formData = new FormData()
  formData.append('file', file)
  const response = await fetch(`${API_BASE_URL}/api/v1/colorize`, { method: 'POST', body: formData })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.detail ?? 'The image could not be processed.')
  return payload as ColorizationResponse
}
