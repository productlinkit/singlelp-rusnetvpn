import { useId, useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, RotateCcw, RefreshCw } from 'lucide-react'
import Button from './Button.jsx'
import { PayLogo } from './PayLogos.jsx'
import { PLANS, BEST_DEAL, money, renewalDate } from '../lib/plans.js'
import { validateCard, demoOutcome } from '../lib/card.js'

const CARD_FIELDS = [
  { key: 'number', label: 'Card number', placeholder: '1234 5678 9012 3456', autoComplete: 'cc-number', span: 'col-span-2' },
  { key: 'expiry', label: 'Expiry date', placeholder: 'MM/YY', autoComplete: 'cc-exp' },
  { key: 'cvv', label: 'CVV', placeholder: '123', autoComplete: 'cc-csc' },
]

const reveal = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: .35 } }

// Opens under the email field once the address is known not to have a
// subscription. Kept deliberately short for thumbs: one list of plans, the card
// fields, one total, one button.
export default function CheckoutStep({ planId, setPlanId, charging, onPay }) {
  const id = useId()
  const plan = PLANS.find((p) => p.id === planId)
  // Card details stay in this component: never lifted, tracked or sent anywhere.
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '' })
  const [cardErrors, setCardErrors] = useState({})

  function submit(e) {
    e.preventDefault()
    if (charging) return
    const errors = validateCard(card)
    setCardErrors(errors)
    const first = Object.keys(errors)[0]
    if (first) return document.getElementById(`${id}-${first}`)?.focus()
    onPay(demoOutcome(card.number))
  }

  function changeCard(field, value) {
    setCard((c) => ({ ...c, [field.key]: value }))
    setCardErrors((errs) => ({ ...errs, [field.key]: undefined }))
  }

  return (
    // On desktop the form dissolves into the grid App sets up, so the plans sit
    // under the email and the card and total fill the right column, without scrolling.
    <form onSubmit={submit} noValidate className="mt-9 lg:contents">
      <motion.div {...reveal} className="lg:col-start-1 lg:mt-5">
        <h2 className="text-[24px] tracking-[-.02em] lg:text-[20px]">Choose your <span className="font-light text-red">plan.</span></h2>

        {/* plans: longest first, so the best deal is the first thing the thumb meets */}
        <fieldset disabled={charging} className="mt-5 lg:mt-3">
          <legend className="sr-only">Plan</legend>
          <div className="grid gap-2 lg:gap-1.5">
            {[...PLANS].reverse().map((p) => {
              const sel = p.id === planId
              const weekly = p.id === '1w'
              return (
                <label key={p.id}
                  className={`flex min-h-[60px] cursor-pointer items-center gap-3 rounded-2xl border bg-white px-4 py-3 transition lg:min-h-[52px] lg:py-1.5 has-[input:focus-visible]:outline-3 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-ink ${sel ? 'border-red ring-1 ring-red' : 'border-ink/10 hover:border-ink/30'}`}>
                  <input type="radio" name={`${id}-plan`} value={p.id} checked={sel} onChange={() => setPlanId(p.id)} className="sr-only" />
                  <span className={`grid h-5 w-5 flex-none place-items-center rounded-full border-2 ${sel ? 'border-red' : 'border-line-ui'}`}>
                    {sel && <span className="h-2.5 w-2.5 rounded-full bg-red" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <b className="text-[15.5px] font-semibold text-ink">{p.label}</b>
                      {p.id === BEST_DEAL && <span className="rounded-full bg-red px-2 py-[3px] text-[9.5px] font-bold uppercase leading-none tracking-[.06em] text-white">Best deal</span>}
                    </span>
                    <span className="mt-0.5 block text-[12.5px] text-muted">
                      {weekly ? 'Billed weekly' : `${money(p.perMonth)}/mo`}
                      {p.saving > 0 && <span className="font-semibold text-green-text"> · Save {p.saving}%</span>}
                    </span>
                  </span>
                  <b className="tnum flex-none text-[16.5px] font-bold text-ink">{money(p.price)}</b>
                </label>
              )
            })}
          </div>
        </fieldset>
      </motion.div>

      <motion.div {...reveal} className="mt-7 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0">
        {/* card details */}
        <fieldset disabled={charging}>
          <legend className="flex w-full items-center justify-between text-[14px] font-semibold text-ink">
            Card details
            <PayLogo id="card" className="h-[16px] w-auto flex-none" />
          </legend>
          <div className="mt-2.5 grid grid-cols-2 gap-x-2 gap-y-3">
            {CARD_FIELDS.map((f) => {
              const err = cardErrors[f.key]
              return (
                <div key={f.key} className={`min-w-0 ${f.span || ''}`}>
                  <label htmlFor={`${id}-${f.key}`} className="text-[13px] font-medium text-ink-2">{f.label}</label>
                  <input
                    id={`${id}-${f.key}`}
                    name={f.autoComplete}
                    type="text"
                    autoComplete={f.autoComplete}
                    placeholder={f.placeholder}
                    value={card[f.key]}
                    onChange={(e) => changeCard(f, e.target.value)}
                    aria-invalid={!!err || undefined}
                    aria-describedby={err ? `${id}-${f.key}-err` : undefined}
                    className={`tnum mt-1.5 h-14 w-full rounded-2xl lg:h-12 border bg-white px-4 text-[16.5px] text-ink outline-none transition placeholder:text-muted/60 focus:border-ink focus:ring-4 focus:ring-ink/10 ${err ? 'border-red-text ring-4 ring-red/10' : 'border-line-ui/50'}`}
                  />
                  {err && <p id={`${id}-${f.key}-err`} role="alert" className="mt-1.5 text-[13px] font-medium text-red-text">{err}</p>}
                </div>
              )
            })}
          </div>
          <p className="mt-3 text-[12px] text-muted">Prototype: card details aren’t sent or stored. In production these fields come from the payment provider.</p>
        </fieldset>

        {/* summary */}
        <aside aria-labelledby={`${id}-sum`} className="mt-7 lg:mt-3">
          <div className="rounded-[22px] border border-ink/[.07] bg-white p-5 lg:p-4">
            <h2 id={`${id}-sum`} className="sr-only">Order summary</h2>
            <div className="flex items-end justify-between">
              <span>
                <span className="block text-[14px] font-semibold text-ink">Total today</span>
                <span className="block text-[12.5px] text-muted">RusVPN · {plan.label}</span>
              </span>
              <span className="tnum text-[26px] font-bold leading-none tracking-[-.03em] text-ink">{money(plan.price)}</span>
            </div>

            <ul className="mt-4 space-y-2 text-[12.5px] leading-snug text-body lg:mt-3 lg:space-y-1">
              <li className="flex gap-2"><RefreshCw className="mt-[2px] h-3.5 w-3.5 flex-none text-ink" aria-hidden="true" />
                Renews at {money(plan.price)} {plan.every} from {renewalDate(plan)}. Cancel anytime.</li>
              <li className="flex gap-2"><RotateCcw className="mt-[2px] h-3.5 w-3.5 flex-none text-ink" aria-hidden="true" />
                30-day money-back guarantee.</li>
            </ul>

            <div className="max-lg:hidden">
              <Button type="submit" className="mt-3 w-full" busy={charging} busyLabel="Processing…">Pay {money(plan.price)}</Button>
            </div>
            <p className="mt-3 flex items-start justify-center gap-1.5 text-center text-[11.5px] leading-relaxed text-muted lg:mt-2">
              <Lock className="mt-[2px] h-3 w-3 flex-none" aria-hidden="true" />
              Secure payment. We never see your card number.
            </p>
          </div>
        </aside>
      </motion.div>

      {/* mobile: one big button under the thumb */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-ink/[.08] bg-paper/95 px-5 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-lg lg:hidden">
        <div className="mx-auto max-w-[520px]">
          <Button type="submit" className="w-full" busy={charging} busyLabel="Processing…">Pay {money(plan.price)}</Button>
        </div>
      </div>
    </form>
  )
}
