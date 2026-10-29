import { useEffect, useId, useRef } from 'react'
import { Lock, AlertCircle, Pencil, RotateCcw, RefreshCw } from 'lucide-react'
import Button from './Button.jsx'
import { PayLogo } from './PayLogos.jsx'
import { PLANS, BEST_DEAL, money, renewalDate } from '../lib/plans.js'
import { track, EVENTS } from '../lib/track.js'

// Payment methods listed on the existing site's pricing card.
export const METHODS = [
  { id: 'card', label: 'Visa / Mastercard' },
  { id: 'paypal', label: 'PayPal' },
  { id: 'apple', label: 'Apple Pay' },
  { id: 'google', label: 'Google Pay' },
]

// Kept deliberately short for thumbs: one list of plans, one row of methods,
// one total, one button.
export default function CheckoutStep({ email, planId, setPlanId, method, setMethod, error, onEditEmail, onPay }) {
  const id = useId()
  const plan = PLANS.find((p) => p.id === planId)
  const errRef = useRef(null)

  useEffect(() => { track(EVENTS.CHECKOUT_STARTED, { plan: planId }) }, []) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (error) errRef.current?.focus() }, [error])

  return (
    <div className="mx-auto max-w-[960px] lg:grid lg:grid-cols-[1fr_340px] lg:gap-10">
      <div>
        <h1 className="text-[30px] sm:text-[40px]">Choose your <span className="font-light text-red">plan.</span></h1>

        {error && (
          <div ref={errRef} tabIndex={-1} role="alert" className="mt-5 flex gap-3 rounded-2xl border border-red/25 bg-red-tint p-4 text-[14px] text-red-text outline-none">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-none" aria-hidden="true" />
            <div>
              <b className="font-semibold">Your payment didn’t go through.</b>
              <p className="mt-0.5 text-ink-2">You haven’t been charged. Try again, or pick a different payment method.</p>
            </div>
          </div>
        )}

        {/* plans: longest first, so the best deal is the first thing the thumb meets */}
        <fieldset className="mt-5">
          <legend className="sr-only">Plan</legend>
          <div className="grid gap-2">
            {[...PLANS].reverse().map((p) => {
              const sel = p.id === planId
              const weekly = p.id === '1w'
              return (
                <label key={p.id}
                  className={`flex min-h-[60px] cursor-pointer items-center gap-3 rounded-2xl border bg-white px-4 py-3 transition has-[input:focus-visible]:outline-3 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-ink ${sel ? 'border-red ring-1 ring-red' : 'border-ink/10 hover:border-ink/30'}`}>
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

        {/* payment method */}
        <fieldset className="mt-7">
          <legend className="text-[14px] font-semibold text-ink">Pay with</legend>
          <div className="mt-2.5 grid grid-cols-2 gap-2">
            {METHODS.map((m) => {
              const sel = m.id === method
              return (
                <label key={m.id}
                  className={`flex min-h-[52px] cursor-pointer items-center gap-2.5 rounded-2xl border bg-white px-3 transition has-[input:focus-visible]:outline-3 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-ink ${sel ? 'border-red ring-1 ring-red' : 'border-ink/10 hover:border-ink/30'}`}>
                  <input type="radio" name={`${id}-method`} value={m.id} checked={sel} onChange={() => setMethod(m.id)} className="sr-only" />
                  <PayLogo id={m.id} className={`flex-none ${m.id === 'card' ? 'h-[16px] w-auto' : 'h-[18px] w-auto'}`} />
                  <span className="min-w-0 truncate text-[12.5px] font-medium text-ink-2">{m.label}</span>
                </label>
              )
            })}
          </div>
        </fieldset>
      </div>

      {/* summary */}
      <aside aria-labelledby={`${id}-sum`} className="mt-7 lg:sticky lg:top-8 lg:mt-[62px] lg:self-start">
        <div className="rounded-[22px] border border-ink/[.07] bg-white p-5">
          <h2 id={`${id}-sum`} className="sr-only">Order summary</h2>
          <div className="flex items-center justify-between gap-3 text-[13.5px]">
            <span className="min-w-0 truncate text-muted">{email}</span>
            <button onClick={onEditEmail} className="flex flex-none items-center gap-1 font-semibold text-ink underline decoration-red/60 underline-offset-2">
              <Pencil className="h-3 w-3" aria-hidden="true" /> Change
            </button>
          </div>

          <div className="mt-4 flex items-end justify-between border-t border-ink/[.07] pt-4">
            <span>
              <span className="block text-[14px] font-semibold text-ink">Total today</span>
              <span className="block text-[12.5px] text-muted">RusVPN · {plan.label}</span>
            </span>
            <span className="tnum text-[26px] font-bold leading-none tracking-[-.03em] text-ink">{money(plan.price)}</span>
          </div>

          <ul className="mt-4 space-y-2 text-[12.5px] leading-snug text-body">
            <li className="flex gap-2"><RefreshCw className="mt-[2px] h-3.5 w-3.5 flex-none text-ink" aria-hidden="true" />
              Renews at {money(plan.price)} {plan.every} from {renewalDate(plan)}. Cancel anytime.</li>
            <li className="flex gap-2"><RotateCcw className="mt-[2px] h-3.5 w-3.5 flex-none text-ink" aria-hidden="true" />
              30-day money-back guarantee.</li>
          </ul>

          <div className="max-lg:hidden">
            <Button className="mt-5 w-full" onClick={onPay}>Pay {money(plan.price)}</Button>
          </div>
          <p className="mt-3 flex items-start justify-center gap-1.5 text-center text-[11.5px] leading-relaxed text-muted">
            <Lock className="mt-[2px] h-3 w-3 flex-none" aria-hidden="true" />
            Secure payment. We never see your card number.
          </p>
        </div>
      </aside>

      {/* mobile: one big button under the thumb */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-ink/[.08] bg-paper/95 px-5 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-lg lg:hidden">
        <div className="mx-auto max-w-[520px]">
          <Button className="w-full" onClick={onPay}>Pay {money(plan.price)}</Button>
        </div>
      </div>
    </div>
  )
}
