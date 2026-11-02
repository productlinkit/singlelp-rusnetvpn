// Prototype only: any value is accepted as long as the field is filled in.
// Returns an error message per empty field, in the order they appear on screen.
export function validateCard({ number, expiry, cvv }) {
  const errors = {}
  if (!number.trim()) errors.number = 'Enter your card number.'
  if (!expiry.trim()) errors.expiry = 'Enter the expiry date.'
  if (!cvv.trim()) errors.cvv = 'Enter the CVV.'
  return errors
}
