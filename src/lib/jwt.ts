// Simple JWT decoder without external library
export function decodeJWT(token: string) {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format')
    }

    // Decode the payload (second part)
    const payload = parts[1]
    const decoded = JSON.parse(
      decodeURIComponent(
        atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
    )

    return decoded
  } catch (error) {
    console.error('Error decoding JWT:', error)
    return null
  }
}
