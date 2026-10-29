import { useEffect, useId, useRef } from 'react'
import { Apple, CreditCard, ShieldCheck, RotateCcw, MonitorSmartphone, Globe2, RefreshCw, Lock, AlertCircle, Pencil } from 'lucide-react'
import Button from './Button.jsx'
import { PLANS, BEST_DEAL, money, renewalDate } from '../lib/plans.js'
import { track, EVENTS } from '../lib/track.js'

// Payment methods listed on the existing site's pricing card.
export const METHODS = [
  { id: 'card', label: 'Card', sub: 'Visa / Mastercard' },
  { id: 'paypal', label: 'PayPal', sub: 'PayPal account' },
  { id: 'apple', label: 'Apple Pay', sub: 'Touch ID / Face ID' },
  { id: 'google', label: 'Google Pay', sub: 'Google account' },
]

function MethodMark({ id }) {
  if (id === 'card') return <CreditCard className="h-5 w-5" aria-hidden="true" />
  const t = { paypal: 'P', google: 'G' }[id]
  if (id === 'apple') return <Apple className="h-5 w-5" aria-hidden="true" />
  return <span className="grid h-5 w-5 place-items-center rounded-[5px] bg-ink text-[11px] font-extrabold text-white" aria-hidden="true">{t}</span>
}

export default function CheckoutStep({ email, planId, setPlanId, method, setMethod, error, onEditEmail, onPay }) {
  const id = useId()
  const plan = PLANS.find((p) => p.id === planId)
  const errRef = useRef(null)

  useEffect(() => { track(EVENTS.CHECKOUT_STARTED, { plan: planId }) }, []) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (error) errRef.current?.focus() }, [error])

  const renewText = `Renews automatically at ${money(plan.price)} ${plan.every}, from ${renewalDate(plan)}.`

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_.85fr] lg:gap-12">
      <div>
        <h1 className="text-[32px] sm:text-[42px]">Choose your <span className="font-light text-red">plan.</span></h1>
        <p className="mt-3 text-[15.5px] leading-relaxed text-body">
          Every plan gets the full service. Longer plans cost less per month.
        </p>

        {error && (
          <div ref={errRef} tabIndex={-1} role="alert" className="mt-6 flex gap-3 rounded-2xl border border-red/25 bg-red-tint p-4 text-[14px] text-red-text outline-none">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-none" aria-hidden="true" />
            <div>
              <b className="font-semibold">Your payment didn’t go through.</b>
              <p className="mt-0.5 text-ink-2">You haven’t been charged. Try again, or pick a different payment method.</p>
            </div>
          </div>
        )}

        {/* plans */}
        <fieldset className="mt-7">
          <legend className="text-[14px] font-semibold text-ink">Plan</legend>
          <div className="mt-3 grid gap-2.5">
            {[...PLANS].reverse().map((p) => {
              const sel = p.id === planId
              const weekly = p.id === '1w'
              return (
                <label key={p.id}
                  className={`has-[input:focus-visible]:outline-3 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-ink relative flex cursor-pointer items-center gap-3.5 rounded-2xl border bg-white px-4 py-3 transition sm:px-5 ${sel ? 'border-ink shadow-[0_16px_34px_-22px_rgba(14,18,22,.4)] ring-1 ring-ink' : 'border-ink/10 hover:border-ink/30'}`}>
                  <input type="radio" name={`${id}-plan`} value={p.id} checked={sel} onChange={() => setPlanId(p.id)} className="peer sr-only" />
                  <span className={`grid h-5 w-5 flex-none place-items-center rounded-full border-2 transition ${sel ? 'border-red' : 'border-line-ui'}`}>
                    {sel && <span className="h-2.5 w-2.5 rounded-full bg-red" />}
                  </span>
                  <span className="flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <b className="text-[15.5px] font-semibold text-ink">{p.label}</b>
                      {p.id === BEST_DEAL && <span className="rounded-full bg-red px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-[.08em] text-white">Best deal</span>}
                      {p.saving > 0 && <span className="rounded-full bg-green-tint px-2 py-0.5 text-[11px] font-bold text-green-text">Save {p.saving}%</span>}
                    </span>
                    <span className="mt-0.5 block text-[13px] text-muted">{money(p.price)} billed {p.every}</span>
                  </span>
                  <span className="text-right">
                    <b className="tnum block text-[16.5px] font-bold text-ink">{money(weekly ? p.price : p.perMonth)}</b>
                    <span className="text-[11.5px] text-muted">{weekly ? 'per week' : 'per month'}</span>
                  </span>
                </label>
              )
            })}
          </div>
          <p className="mt-2.5 text-[12.5px] text-muted">Savings compared with paying monthly ({money(PLANS.find((x) => x.id === '1m').price)}/mo).</p>
        </fieldset>

        {/* payment method */}
        <fieldset className="mt-8">
          <legend className="text-[14px] font-semibold text-ink">Pay with</legend>
          <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {METHODS.map((m) => {
              const sel = m.id === method
              return (
                <label key={m.id} className={`has-[input:focus-visible]:ring-4 has-[input:focus-visible]:ring-ink/25 flex cursor-pointer flex-col gap-2 rounded-2xl border bg-white p-3.5 transition ${sel ? 'border-ink ring-1 ring-ink' : 'border-ink/10 hover:border-ink/30'}`}>
                  <input type="radio" name={`${id}-method`} value={m.id} checked={sel} onChange={() => setMethod(m.id)} className="peer sr-only" />
                  <span className="flex items-center justify-between text-ink">
                    <MethodMark id={m.id} />
                    <span className={`h-4 w-4 rounded-full border-2 ${sel ? 'border-[5px] border-red' : 'border-line-ui'}`} />
                  </span>
                  <span>
                    <b className="block text-[14px] font-semibold text-ink">{m.label}</b>
                    <span className="block text-[11.5px] text-muted">{m.sub}</span>
                  </span>
                </label>
              )
            })}
          </div>
          <p className="mt-3 flex items-start gap-1.5 text-[12.5px] leading-relaxed text-muted">
            <Lock className="mt-0.5 h-3.5 w-3.5 flex-none" aria-hidden="true" />
            You’ll confirm on our payment provider’s secure page. RusVPN never sees or stores your card number.
          </p>
        </fieldset>
      </div>

      {/* order summary */}
      <aside aria-labelledby={`${id}-sum`} className="lg:sticky lg:top-8 lg:self-start">
        <div className="rounded-[26px] border border-ink/[.07] bg-white p-5 shadow-[0_30px_60px_-34px_rgba(14,18,22,.34)] sm:p-7">
          <h2 id={`${id}-sum`} className="text-[20px] tracking-[-.02em]">Order summary</h2>

          <dl className="mt-5 space-y-3 text-[14px]">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted">Account</dt>
              <dd className="flex min-w-0 items-center gap-2 font-medium text-ink">
                <span className="truncate">{email}</span>
                <button onClick={onEditEmail} className="grid h-7 w-7 flex-none place-items-center rounded-full text-muted hover:bg-paper hover:text-ink" aria-label="Change email">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </dd>
            </div>
            <div className="flex justify-between gap-3"><dt className="text-muted">Plan</dt><dd className="font-medium text-ink">RusVPN · {plan.label}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-muted">Per month</dt><dd className="tnum font-medium text-ink">{money(plan.perMonth)}</dd></div>
          </dl>

          <ul className="mt-5 space-y-2.5 border-t border-ink/[.07] pt-5 text-[13.5px] text-ink-2">
            <li className="flex gap-2.5"><Globe2 className="h-4 w-4 flex-none text-red" aria-hidden="true" /> 700+ servers in 90+ countries</li>
            <li className="flex gap-2.5"><ShieldCheck className="h-4 w-4 flex-none text-red" aria-hidden="true" /> Strict no-logs policy</li>
            <li className="flex gap-2.5"><MonitorSmartphone className="h-4 w-4 flex-none text-red" aria-hidden="true" /> 5 devices at once — Windows, macOS, Android, iOS, Linux</li>
            <li className="flex gap-2.5"><RotateCcw className="h-4 w-4 flex-none text-red" aria-hidden="true" /> 30-day money-back guarantee</li>
          </ul>

          <div className="mt-5 flex items-end justify-between border-t border-ink/[.07] pt-5">
            <span className="text-[14px] font-semibold text-ink">Total today</span>
            <span className="tnum text-[30px] font-bold leading-none tracking-[-.03em] text-ink">{money(plan.price)}</span>
          </div>

          <p className="mt-3 flex gap-2 rounded-xl bg-paper p-3 text-[12.5px] leading-relaxed text-body">
            <RefreshCw className="mt-0.5 h-3.5 w-3.5 flex-none text-ink" aria-hidden="true" />
            <span>{renewText} Turn off auto-renewal any time in My Account — you keep access until the end of the paid period.</span>
          </p>

          <div className="max-lg:hidden">
            <Button className="mt-6 w-full" onClick={onPay}>Pay {money(plan.price)}</Button>
          </div>
          <p className="mt-3 text-center text-[11.5px] leading-relaxed text-muted">
            By paying you agree to the Terms and Privacy Policy and authorise the renewal above.
          </p>
        </div>
      </aside>

      {/* mobile: pay bar pinned to the thumb */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-ink/[.08] bg-paper/95 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-lg lg:hidden">
        <div className="mx-auto flex max-w-[520px] items-center gap-3">
          <div className="min-w-0 flex-1">
            <b className="tnum block text-[18px] font-bold leading-tight text-ink">{money(plan.price)}</b>
            <span className="block truncate text-[11.5px] text-muted">{plan.label} · renews {plan.every}</span>
          </div>
          <Button onClick={onPay}>Pay now</Button>
        </div>
      </div>
    </div>
  )
}
