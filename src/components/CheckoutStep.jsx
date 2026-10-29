import { useEffect, useId, useRef } from 'react'
import { Check, Lock, AlertCircle, Pencil } from 'lucide-react'
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

// The feature list from the site's pricing card, word for word.
const FEATURES = [
  '700+ servers worldwide, 90+ countries',
  'Access your favorite content across our global VPN network',
  'Strict no-logs policy',
  'DNS leak protection',
  'VPN split tunnel',
  'Dynamic switching, no slowdowns',
  'Best streaming experience',
]

// The pricing section of rusnetvpn.vercel.app, turned into the checkout:
// segmented plan picker, white plan card, dark payment panel.
export default function CheckoutStep({ email, planId, setPlanId, method, setMethod, error, onEditEmail, onPay }) {
  const id = useId()
  const plan = PLANS.find((p) => p.id === planId)
  const errRef = useRef(null)

  useEffect(() => { track(EVENTS.CHECKOUT_STARTED, { plan: planId }) }, []) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (error) errRef.current?.focus() }, [error])

  const save = plan.saving ? `Save ${plan.saving}%${plan.id === BEST_DEAL ? ' · best deal' : ''}` : ''

  return (
    <div>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
        <h1 className="text-[32px] sm:text-[42px]">Choose your <span className="font-light text-red">plan.</span></h1>
        <p className="max-w-[24rem] text-[14.5px] leading-relaxed text-body lg:pb-1.5">
          Every plan gets the full service. Longer plans cost less per month.
        </p>
      </div>

      {/* plan picker, same segmented control as the site */}
      <fieldset className="mt-6">
        <legend className="sr-only">Plan</legend>
        <div className="grid grid-cols-3 gap-1 rounded-[22px] bg-paper-2 p-1.5 sm:inline-flex sm:rounded-full">
          {PLANS.map((p) => {
            const sel = p.id === planId
            const best = p.id === BEST_DEAL
            return (
              <label key={p.id}
                className={`relative flex min-h-[52px] cursor-pointer flex-col items-center justify-center rounded-2xl px-3 py-2 text-center transition has-[input:focus-visible]:outline-3 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-ink sm:min-w-[100px] sm:rounded-full sm:px-5 ${best ? 'max-sm:col-span-2' : ''} ${sel ? 'bg-white shadow-[0_8px_20px_-14px_rgba(14,18,22,.5)] ring-1 ring-ink' : 'hover:bg-white/60'}`}>
                <input type="radio" name={`${id}-plan`} value={p.id} checked={sel} onChange={() => setPlanId(p.id)} className="sr-only" />
                <span className={`flex items-center gap-2 ${best ? 'max-sm:flex-row' : 'flex-col gap-0'} sm:flex-col sm:gap-0`}>
                  <span className={`text-[13.5px] ${sel ? 'font-semibold text-ink' : 'text-ink-2'}`}>{p.label}</span>
                  {best && <span className="rounded-full bg-red px-2 py-[3px] text-[9.5px] font-bold uppercase leading-none tracking-[.06em] text-white sm:absolute sm:-right-1 sm:-top-2.5">Best deal</span>}
                  {p.saving > 0 && <span className="text-[11px] font-semibold text-red-text">Save {p.saving}%</span>}
                </span>
              </label>
            )
          })}
        </div>
      </fieldset>

      {error && (
        <div ref={errRef} tabIndex={-1} role="alert" className="mt-5 flex gap-3 rounded-2xl border border-red/25 bg-red-tint p-4 text-[14px] text-red-text outline-none">
          <AlertCircle className="mt-0.5 h-5 w-5 flex-none" aria-hidden="true" />
          <div>
            <b className="font-semibold">Your payment didn’t go through.</b>
            <p className="mt-0.5 text-ink-2">You haven’t been charged. Try again, or pick a different payment method.</p>
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.05fr_.95fr]">
        {/* plan card */}
        <section aria-labelledby={`${id}-plan`} className="rounded-[26px] bg-white p-6 shadow-[0_16px_34px_-22px_rgba(14,18,22,.3)] sm:p-10">
          <h2 id={`${id}-plan`} className="text-[20px] tracking-[-.02em] sm:text-[22px]">{plan.name}</h2>
          <p className="tnum mt-4 flex items-start leading-none text-ink" aria-live="polite">
            <span className="mt-2 text-[22px] font-medium text-body sm:mt-3 sm:text-[26px]">$</span>
            <span className="ml-1.5 text-[clamp(56px,7vw,84px)] font-bold tracking-[-.04em]">{plan.price.toFixed(2)}</span>
          </p>
          <p className="mt-3 text-[14.5px] text-body">billed once · <b className="font-semibold text-ink">{money(plan.price)} / {plan.per}</b></p>
          {save && (
            <p className="mt-5 flex items-center gap-2 rounded-full bg-green-tint px-4 py-2 text-[13.5px] font-semibold text-green-text">
              <Check className="h-3.5 w-3.5" strokeWidth={2.4} aria-hidden="true" /> {save}
            </p>
          )}

          <ul className="mt-6 grid gap-x-8 gap-y-3 border-t border-ink/[.07] pt-6 text-[14.5px] text-ink-2 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <li key={f} className="flex gap-2.5">
                <Check className="mt-[3px] h-4 w-4 flex-none text-red" strokeWidth={2.2} aria-hidden="true" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <p className="mt-7 text-[13px] leading-relaxed text-body">
            <b className="font-semibold text-ink">Auto-renewal</b> is on by default: {money(plan.price)} {plan.every}, next on {renewalDate(plan)}. Turn off auto-renewal any time — you will keep access until the end of the paid period, and your card will not be charged again.
          </p>
        </section>

        {/* payment panel */}
        <section aria-labelledby={`${id}-pay`} className="relative overflow-hidden rounded-[26px] bg-ink p-6 text-white sm:p-10">
          <span aria-hidden="true" className="pointer-events-none absolute -bottom-1/3 -left-1/4 h-[80%] w-[90%] rounded-full bg-[#1E4A9A]/45 blur-[90px]" />
          <div className="relative flex h-full flex-col">
            <span className="inline-flex items-center gap-2 self-start rounded-full border border-white/20 bg-white/[.06] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[.16em] text-white/90">
              <span className="h-[5px] w-[5px] rounded-full bg-current" /> 30-Day Money-Back Guarantee
            </span>
            <h2 id={`${id}-pay`} className="mt-5 text-[28px] leading-[1.08] sm:text-[34px]">A secure and independent VPN solution.</h2>
            <p className="mt-4 text-[14.5px] leading-relaxed text-white/70">
              Secure your online privacy with a VPN that respects your values and protects you from prying eyes as you browse.
            </p>

            <div className="mt-8 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[.05] px-4 py-3 text-[13.5px]">
              <span className="min-w-0">
                <span className="block text-white/55">Account</span>
                <span className="block truncate font-medium">{email}</span>
              </span>
              <button onClick={onEditEmail} className="grid h-8 w-8 flex-none place-items-center rounded-full text-white/70 hover:bg-white/10 hover:text-white" aria-label="Change email">
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mt-auto pt-8">
              <div className="flex items-end justify-between gap-3">
                <span className="text-[14.5px] text-white/60">Total payable at checkout</span>
                <span className="tnum text-[26px] font-bold leading-none tracking-[-.03em]">{money(plan.price)}</span>
              </div>

              <fieldset className="mt-4">
                <legend className="sr-only">Pay with</legend>
                <div className="flex flex-wrap gap-2">
                  {METHODS.map((m) => {
                    const sel = m.id === method
                    return (
                      <label key={m.id}
                        className={`flex cursor-pointer items-center gap-2 rounded-[10px] bg-white px-3 py-1.5 text-[12px] font-medium text-ink transition has-[input:focus-visible]:outline-3 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-white ${sel ? 'ring-[2.5px] ring-red ring-offset-2 ring-offset-ink' : 'opacity-80 hover:opacity-100'}`}>
                        <input type="radio" name={`${id}-method`} value={m.id} checked={sel} onChange={() => setMethod(m.id)} className="sr-only" />
                        <PayLogo id={m.id} className={m.id === 'card' ? 'h-[18px] w-auto' : 'h-[17px] w-auto'} />
                        {m.label}
                      </label>
                    )
                  })}
                </div>
              </fieldset>

              <div className="max-lg:hidden">
                <Button variant="white" className="mt-7" onClick={onPay}>Pay {money(plan.price)}</Button>
              </div>
              <p className="mt-4 flex items-start gap-1.5 text-[12px] leading-relaxed text-white/55">
                <Lock className="mt-0.5 h-3.5 w-3.5 flex-none" aria-hidden="true" />
                You’ll confirm on our payment provider’s secure page. RusVPN never sees or stores your card number. By paying you agree to the Terms and Privacy Policy.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* mobile: pay bar pinned to the thumb */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-ink/[.08] bg-paper/95 px-5 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-lg lg:hidden">
        <div className="mx-auto flex max-w-[520px] items-center gap-3">
          <div className="min-w-0 flex-1">
            <b className="tnum block text-[18px] font-bold leading-tight text-ink">{money(plan.price)}</b>
            <span className="block truncate text-[11.5px] text-muted">{plan.name} · renews {plan.every}</span>
          </div>
          <Button onClick={onPay}>Pay now</Button>
        </div>
      </div>
    </div>
  )
}
