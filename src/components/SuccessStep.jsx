import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Check, Mail } from 'lucide-react'
import Button from './Button.jsx'
import { money, renewalDate } from '../lib/plans.js'

export default function SuccessStep({ email, plan, method, onAccess }) {
  const h = useRef(null)
  useEffect(() => { h.current?.focus() }, [])

  return (
    <section className="text-center">
      <motion.div initial={{ scale: .5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className="relative mx-auto grid h-20 w-20 place-items-center rounded-full bg-green-ok text-white shadow-[0_20px_40px_-18px_rgba(18,183,106,.8)]">
        <motion.span className="absolute inset-0 rounded-full border-2 border-green-ok" initial={{ scale: 1, opacity: .8 }} animate={{ scale: 1.6, opacity: 0 }} transition={{ duration: 1.2, delay: .2 }} />
        <Check className="h-10 w-10" strokeWidth={3} aria-hidden="true" />
      </motion.div>

      <h1 ref={h} tabIndex={-1} className="mt-7 text-[38px] outline-none sm:text-[48px]">You’re All <span className="font-light text-red">Set.</span></h1>
      <p className="mx-auto mt-3 max-w-[26rem] text-[16px] leading-relaxed text-body">
        Your RusVPN access is ready. Check your email for your secure sign-in link.
      </p>

      <div className="mx-auto mt-7 rounded-[22px] border border-ink/[.07] bg-white p-5 text-left text-[14px]">
        <dl className="space-y-2.5">
          <div className="flex justify-between gap-3"><dt className="text-muted">Plan</dt><dd className="font-medium">RusVPN · {plan.label}</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-muted">Paid</dt><dd className="tnum font-medium">{money(plan.price)} · {method}</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-muted">Next renewal</dt><dd className="font-medium">{renewalDate(plan)}</dd></div>
        </dl>
        <p className="mt-4 flex items-center gap-2 rounded-xl bg-paper p-3 text-[13px] text-ink-2">
          <Mail className="h-4 w-4 flex-none text-red" aria-hidden="true" />
          <span className="min-w-0">Sign-in link for <b className="break-all font-semibold">{email}</b></span>
        </p>
      </div>

      <Button className="mt-7 w-full" onClick={onAccess}>Access RusVPN</Button>
      <p className="mt-3 text-[12px] text-muted">Prototype: payment and email are simulated.</p>
    </section>
  )
}
