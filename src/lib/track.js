// Funnel events. Pushed to window.dataLayer so GTM / GA4 / Meta pixel can pick
// them up without code changes; also kept in memory for the ?debug=1 panel.
export const EVENTS = {
  LP_VIEWED: 'lp_viewed',
  CTA_CLICKED: 'cta_clicked',
  EMAIL_SUBMITTED: 'email_submitted',
  CHECKOUT_STARTED: 'checkout_started',
  PAYMENT_COMPLETED: 'payment_completed',
  VPN_ACTIVATED: 'vpn_activated',
}

const listeners = new Set()
export const log = []

function utm() {
  const q = new URLSearchParams(window.location.search)
  const out = {}
  for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
    if (q.get(k)) out[k] = q.get(k)
  }
  return out
}

export function track(event, props = {}) {
  const entry = { event, ...utm(), ...props, ts: new Date().toISOString() }
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(entry)
  log.push(entry)
  listeners.forEach((fn) => fn([...log]))
  if (import.meta.env.DEV) console.info('[track]', event, props)
}

export function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}
