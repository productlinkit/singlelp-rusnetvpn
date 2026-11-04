import { useEffect, useState } from 'react'
import { Check, Copy } from 'lucide-react'

// One summary row: the payment's ID, with a copy button for support requests.
export default function TransactionId({ id }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(t)
  }, [copied])

  async function copy() {
    try {
      await navigator.clipboard.writeText(id)
      setCopied(true)
    } catch { /* clipboard blocked: the ID is still selectable */ }
  }

  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted">Transaction ID</dt>
      <dd className="flex min-w-0 items-center gap-1.5">
        <span className="tnum select-all truncate font-medium">{id}</span>
        <button type="button" onClick={copy} aria-label={copied ? 'Transaction ID copied' : 'Copy transaction ID'}
          className="grid h-7 w-7 flex-none place-items-center rounded-full text-muted transition hover:bg-paper hover:text-ink">
          {copied ? <Check className="h-3.5 w-3.5 text-green-text" strokeWidth={3} aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
        </button>
        <span className="sr-only" aria-live="polite">{copied ? 'Copied' : ''}</span>
      </dd>
    </div>
  )
}
