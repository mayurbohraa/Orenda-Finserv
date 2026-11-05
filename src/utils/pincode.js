import { isValidPincode } from './helpers.js'

export async function fetchPincode(pincode, signal) {
  const key = String(pincode).trim()
  if (!isValidPincode(key)) return null
  const controller = new AbortController()
  const abort = () => controller.abort()
  if (signal?.aborted) controller.abort()
  signal?.addEventListener('abort', abort, { once: true })
  const timeout = setTimeout(abort, 8000)
  try {
    const response = await fetch(
      `https://api.postalpincode.in/pincode/${key}`,
      { signal: controller.signal },
    )
    if (!response.ok) throw new Error('Pincode service unavailable')
    const data = await response.json()
    const office =
      data?.[0]?.Status === 'Success' ? data[0].PostOffice?.[0] : null
    if (!office) return null
    const city = office.District || office.Block || office.Name || ''
    const state = office.State || ''
    return city && state ? { city, state } : null
  } finally {
    clearTimeout(timeout)
    signal?.removeEventListener('abort', abort)
  }
}
