export const ACCOUNT = { NEW: 'new', REGISTERED: 'registered', SUBSCRIBED: 'subscribed' }

// Stands in for the backend's account lookup. For demos, the part before the @
// picks the branch: registered@... has an account with no subscription,
// active@... has both, and any other address is new.
export function lookupAccount(email) {
  const name = email.split('@')[0].toLowerCase()
  const status = name === 'active' ? ACCOUNT.SUBSCRIBED : name === 'registered' ? ACCOUNT.REGISTERED : ACCOUNT.NEW
  return new Promise((resolve) => setTimeout(() => resolve(status), 650))
}
