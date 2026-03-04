import LZString from "lz-string"

export function compressData(data: string): string {
  return LZString.compressToEncodedURIComponent(data)
}

export function decompressData(compressed: string): string | null {
  return LZString.decompressFromEncodedURIComponent(compressed)
}

const MAX_URL_LENGTH = 2000

export function isUrlTooLong(hash: string): boolean {
  const estimatedUrl = `${typeof window !== "undefined" ? window.location.origin : ""}${typeof window !== "undefined" ? window.location.pathname : ""}#${hash}`
  return estimatedUrl.length > MAX_URL_LENGTH
}
