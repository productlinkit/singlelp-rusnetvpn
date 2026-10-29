import { useEffect, useId, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, X, Loader2, FlaskConical } from 'lucide-react'
import { money } from '../lib/plans.js'
import { METHODS } from './CheckoutStep.jsx'

// Stands in for the payment provider's hosted checkout (Stripe Checkout, Paddle,
// PayPal...). In production "Pay" redirects there and the provider's webhook
// confirms the charge; nothing here charges anyone.
export default function PaymentPreview({ plan, method, email, onCancel, onResult, decline }) {
  const id = useId()
  const [busy, setBusy] = useState(false)
  const confirmRef = useRef(null)
  const m = METHODS.find((x) => x.id === method)

  useEffect(() => {
    confirmRef.current?.focus()
    const onKey = (e) => { if (e.key === 'Escape' && !busy) onCancel() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [busy, onCancel])

  function confirm() {
    setBusy(true)
    setTimeout(() => onResult(decline ? 'declined' : 'paid'), 1800)
  }

  return (
    <motion.div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/45 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={(e) => { if (e.target === e.currentTarget && !busy) onCancel() }}>
      <motion.div role="dialog" aria-modal="true" aria-labelledby={`${id}-t`} aria-describedby={`${id}-d`}
        initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ duration: .35, ease: [.21, .78, .26, 1] }}
        className="w-full max-w-[420px] rounded-t-[28px] bg-white p-6 pb-[max(24px,env(safe-area-inset-bottom))] shadow-2xl sm:rounded-[28px] sm:p-7">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-muted"><Lock className="h-3.5 w-3.5" aria-hidden="true" /> Payment provider</span>
          <button onClick={onCancel} disabled={busy} className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-paper disabled:opacity-40" aria-label="Cancel payment">
            <X className="h-5 w-5" />
          </button>
        </div>

        <h2 id={`${id}-t`} className="mt-3 text-[24px] tracking-[-.02em]">Payment preview</h2>
        <p id={`${id}-d`} className="mt-3 flex gap-2 rounded-xl bg-amber-tint p-3 text-[12.5px] leading-relaxed text-amber-text">
          <FlaskConical className="mt-0.5 h-4 w-4 flex-none" aria-hidden="true" />
          Prototype: this screen stands in for the provider’s hosted checkout. No card is charged and no email is sent.
        </p>

        <dl className="mt-5 space-y-2.5 text-[14px]">
          <div className="flex justify-between gap-3"><dt className="text-muted">Merchant</dt><dd className="font-medium">RusVPN</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-muted">Item</dt><dd className="font-medium">{plan.label} subscription</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-muted">Method</dt><dd className="font-medium">{m.label}</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-muted">Receipt to</dt><dd className="truncate font-medium">{email}</dd></div>
          <div className="flex items-end justify-between gap-3 border-t border-ink/[.07] pt-3"><dt className="font-semibold">Amount</dt><dd className="tnum text-[24px] font-bold leading-none">{money(plan.price)}</dd></div>
        </dl>

        <button ref={confirmRef} onClick={confirm} disabled={busy} aria-busy={busy || undefined}
          className="mt-6 flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-ink text-[16px] font-semibold text-white transition hover:bg-ink-2 disabled:opacity-85">
          {busy ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Confirming payment…</> : <>Confirm test payment</>}
        </button>
        <p className="sr-only" aria-live="polite">{busy ? 'Confirming payment, please wait.' : ''}</p>
      </motion.div>
    </motion.div>
  )
}
