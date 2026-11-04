// Stands in for the provider's payment ID. One per payment attempt, so a
// failed try and its retry get different IDs, while a pending payment keeps
// its ID once it is confirmed.
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function newTransactionId() {
  const bytes = crypto.getRandomValues(new Uint8Array(10))
  const chars = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join('')
  return `RV-${chars.slice(0, 5)}-${chars.slice(5)}`
}
