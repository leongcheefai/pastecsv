import { deflateSync, inflateSync } from "fflate"
import LZString from "lz-string"

function bytesToBase64url(bytes: Uint8Array): string {
  let binary = ""
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function base64urlToBytes(str: string): Uint8Array {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/")
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4)
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

export function compressData(data: string): string {
  const bytes = new TextEncoder().encode(data)
  const compressed = deflateSync(bytes, { level: 9 })
  return bytesToBase64url(compressed)
}

export function decompressData(compressed: string): string | null {
  // Try deflate (new format) first
  try {
    const bytes = base64urlToBytes(compressed)
    const decompressed = inflateSync(bytes)
    return new TextDecoder().decode(decompressed)
  } catch {
    // Fall back to lz-string (old format)
  }

  return LZString.decompressFromEncodedURIComponent(compressed)
}

const MAX_URL_LENGTH = 2000

export function isUrlTooLong(hash: string): boolean {
  const estimatedUrl = `${typeof window !== "undefined" ? window.location.origin : ""}${typeof window !== "undefined" ? window.location.pathname : ""}#${hash}`
  return estimatedUrl.length > MAX_URL_LENGTH
}
