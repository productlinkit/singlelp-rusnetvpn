// Prototype only: any value is accepted as long as the field is filled in.
// Returns an error message per empty field, in the order they appear on screen.
export function validateCard({ number, expiry, cvv }) {
  const errors = {}
  if (!number.trim()) errors.number = 'Enter your card number.'
  if (!expiry.trim()) errors.expiry = 'Enter the expiry date.'
  if (!cvv.trim()) errors.cvv = 'Enter the CVV.'
  return errors
}

// For demos, the start of the card number picks the provider's answer:
// 0000... is declined, 1111... waits on the bank, anything else goes through.
export function demoOutcome(number) {
  const n = number.replace(/\s/g, '')
  return n.startsWith('0000') ? 'failed' : n.startsWith('1111') ? 'pending' : 'paid'
}
