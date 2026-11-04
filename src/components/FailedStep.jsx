import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import Button from './Button.jsx'
import TransactionId from './TransactionId.jsx'
import { money } from '../lib/plans.js'

export default function FailedStep({ email, plan, txId, onRetry }) {
  const h = useRef(null)
  useEffect(() => { h.current?.focus() }, [])

  return (
    <section className="text-center">
      <motion.div initial={{ scale: .5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-red text-white shadow-[0_20px_40px_-18px_rgba(225,29,42,.8)]">
        <X className="h-10 w-10" strokeWidth={3} aria-hidden="true" />
      </motion.div>

      <h1 ref={h} tabIndex={-1} className="mt-7 text-[38px] outline-none sm:text-[48px]">Payment <span className="font-light text-red">Failed.</span></h1>
      <p className="mx-auto mt-3 max-w-[26rem] text-[16px] leading-relaxed text-body">
        Your bank declined the payment. You haven’t been charged.
      </p>

      <div className="mx-auto mt-7 rounded-[22px] border border-ink/[.07] bg-white p-5 text-left text-[14px]">
        <dl className="space-y-2.5">
          <TransactionId id={txId} />
          <div className="flex justify-between gap-3"><dt className="text-muted">Plan</dt><dd className="font-medium">RusVPN · {plan.label}</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-muted">Account</dt><dd className="min-w-0 truncate font-medium">{email}</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-muted">Status</dt><dd className="font-medium text-red-text">Failed</dd></div>
          <div className="flex items-end justify-between gap-3 border-t border-ink/[.07] pt-3"><dt className="font-semibold text-ink">Amount</dt><dd className="tnum text-[26px] font-bold leading-none tracking-[-.03em] text-ink">{money(plan.price)}</dd></div>
        </dl>
        <p className="mt-4 rounded-xl bg-paper p-3 text-[13px] leading-relaxed text-ink-2">
          Check the card details, make sure the card allows online payments, or try a different card.
        </p>
      </div>

      <Button className="mt-7 w-full" onClick={onRetry}>Try again</Button>
    </section>
  )
}
