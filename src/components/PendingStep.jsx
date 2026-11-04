import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Clock, Loader2, Mail } from 'lucide-react'
import { money } from '../lib/plans.js'
import TransactionId from './TransactionId.jsx'

// The provider took the card but the bank hasn't answered yet (3-D Secure,
// manual review). Access waits for the confirmation webhook.
const CONFIRM_AFTER = 8

export default function PendingStep({ email, plan, txId, onConfirmed }) {
  const h = useRef(null)
  const [left, setLeft] = useState(CONFIRM_AFTER)

  useEffect(() => { h.current?.focus() }, [])

  // stands in for polling the payment status
  useEffect(() => {
    if (left <= 0) return onConfirmed()
    const t = setTimeout(() => setLeft((n) => n - 1), 1000)
    return () => clearTimeout(t)
  }, [left]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="text-center">
      <motion.div initial={{ scale: .5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className="relative mx-auto grid h-20 w-20 place-items-center rounded-full bg-red-tint text-red">
        <motion.span className="absolute inset-0 rounded-full border-2 border-red" initial={{ scale: 1, opacity: .6 }} animate={{ scale: 1.5, opacity: 0 }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }} />
        <Clock className="h-10 w-10" strokeWidth={2.4} aria-hidden="true" />
      </motion.div>

      <h1 ref={h} tabIndex={-1} className="mt-7 text-[38px] outline-none sm:text-[48px]">Payment <span className="font-light text-red">Pending.</span></h1>
      <p className="mx-auto mt-3 max-w-[26rem] text-[16px] leading-relaxed text-body">
        We’re waiting for your bank to confirm the payment. This usually takes a few minutes.
      </p>

      <div className="mx-auto mt-7 rounded-[22px] border border-ink/[.07] bg-white p-5 text-left text-[14px]">
        <ol className="space-y-3" aria-live="polite">
          <li className="flex items-center gap-3">
            <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-green-ok text-white"><Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" /></span>
            <span className="text-ink">Payment submitted</span>
          </li>
          <li className="flex items-center gap-3">
            <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-red-tint text-red"><Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /></span>
            <span className="text-ink">Waiting for bank confirmation</span>
          </li>
        </ol>
        <dl className="mt-4 space-y-2.5 border-t border-ink/[.07] pt-4">
          <TransactionId id={txId} />
          <div className="flex justify-between gap-3"><dt className="text-muted">Plan</dt><dd className="font-medium">RusVPN · {plan.label}</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-muted">Status</dt><dd className="flex items-center gap-1.5 font-medium text-red"><span className="h-2 w-2 animate-pulse rounded-full bg-red" aria-hidden="true" />Pending</dd></div>
          <div className="flex items-end justify-between gap-3 border-t border-ink/[.07] pt-3"><dt className="font-semibold text-ink">Amount</dt><dd className="tnum text-[26px] font-bold leading-none tracking-[-.03em] text-ink">{money(plan.price)}</dd></div>
        </dl>
        <p className="mt-4 flex items-center gap-2 rounded-xl bg-paper p-3 text-[13px] text-ink-2">
          <Mail className="h-4 w-4 flex-none text-red" aria-hidden="true" />
          <span className="min-w-0">You can close this page. We’ll email <b className="font-semibold [overflow-wrap:anywhere]">{email}</b> once it’s confirmed.</span>
        </p>
      </div>

      <p className="mt-6 text-[12px] text-muted">Prototype: confirms automatically in {left}s.</p>
    </section>
  )
}
