import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Loader2, Download, Smartphone, Monitor, Laptop, Package, Power, RotateCw } from 'lucide-react'
import Button from './Button.jsx'
import { renewalDate } from '../lib/plans.js'
import { track, EVENTS } from '../lib/track.js'

// Download targets offered on the existing site.
const APPS = [
  { id: 'ios', label: 'App Store', sub: 'iPhone & iPad', icon: Smartphone },
  { id: 'android', label: 'Google Play', sub: 'Android', icon: Smartphone },
  { id: 'windows', label: 'Windows', sub: 'Download for PC', icon: Monitor },
  { id: 'macos', label: 'macOS', sub: 'Download for Mac', icon: Laptop },
  { id: 'apk', label: 'APK file', sub: 'Direct download', icon: Package },
]

function detect() {
  const ua = navigator.userAgent
  if (/iPhone|iPad|iPod/.test(ua)) return 'ios'
  if (/Android/.test(ua)) return 'android'
  if (/Mac/.test(ua)) return 'macos'
  if (/Win/.test(ua)) return 'windows'
  return 'windows'
}

export default function AccessStep({ email, plan }) {
  // What the backend does after the provider's "payment succeeded" webhook.
  const STEPS = useMemo(() => [
    'Payment confirmed',
    `Subscription active · ${plan.label}, renews ${renewalDate(plan)}`,
    `Linked to ${email}`,
    'Secure sign-in link sent',
  ], [email, plan])

  const [done, setDone] = useState(0)
  const [activated, setActivated] = useState(false)
  const [busy, setBusy] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const mine = detect()
  const ordered = [...APPS].sort((a, b) => (a.id === mine ? -1 : b.id === mine ? 1 : 0))

  useEffect(() => {
    if (done >= STEPS.length) return
    const t = setTimeout(() => setDone((n) => n + 1), 550)
    return () => clearTimeout(t)
  }, [done, STEPS.length])

  useEffect(() => {
    if (!cooldown) return
    const t = setTimeout(() => setCooldown((n) => n - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  const ready = done >= STEPS.length

  function activate() {
    setBusy(true)
    setTimeout(() => {
      setBusy(false)
      setActivated(true)
      track(EVENTS.VPN_ACTIVATED, { plan: plan.id, platform: mine })
    }, 1200)
  }

  return (
    <section>
      <h1 className="text-[32px] sm:text-[42px]">Your access is <span className="font-light text-red">ready.</span></h1>
      <p className="mt-3 text-[15.5px] leading-relaxed text-body">Install the app, sign in with the link we emailed, and press Connect.</p>

      <ol className="mt-7 space-y-3 rounded-[22px] border border-ink/[.07] bg-white p-5" aria-live="polite">
        {STEPS.map((s, i) => {
          const ok = i < done
          return (
            <li key={s} className="flex items-center gap-3 text-[14px]">
              <span className={`grid h-6 w-6 flex-none place-items-center rounded-full transition-colors ${ok ? 'bg-green-ok text-white' : 'bg-paper-2 text-muted'}`}>
                {ok ? <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" /> : i === done ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : null}
              </span>
              <span className={`min-w-0 break-words ${ok ? 'text-ink' : 'text-muted'}`}>{s}{!ok && <span className="sr-only"> (pending)</span>}</span>
            </li>
          )
        })}
      </ol>
      <p className="mt-2 text-[12px] text-muted">Prototype: these steps are simulated. In production they come from the payment webhook.</p>

      <AnimatePresence>
        {ready && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45 }}>
            <h2 className="mt-9 text-[18px] tracking-[-.02em]">Download RusVPN</h2>
            <ul className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {ordered.map(({ id, label, sub, icon: Icon }) => (
                <li key={id} className={id === mine ? 'col-span-2 sm:col-span-3' : ''}>
                  <a href="#" onClick={(e) => { e.preventDefault(); track('app_download_clicked', { platform: id }) }}
                    className={`flex items-center gap-3 rounded-2xl border p-3.5 transition hover:border-ink/40 ${id === mine ? 'border-ink bg-ink text-white hover:bg-ink-2' : 'border-ink/10 bg-white text-ink'}`}>
                    <Icon className="h-5 w-5 flex-none" aria-hidden="true" />
                    <span className="min-w-0 flex-1">
                      <b className="block text-[14px] font-semibold">{label}</b>
                      <span className={`block text-[11.5px] ${id === mine ? 'text-white/70' : 'text-muted'}`}>{id === mine ? 'Recommended for this device' : sub}</span>
                    </span>
                    <Download className="h-4 w-4 flex-none opacity-70" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-[22px] border border-ink/[.07] bg-white p-5">
              <AnimatePresence mode="wait" initial={false}>
                {activated ? (
                  <motion.div key="on" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-3" role="status">
                    <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-green-tint text-green-text"><Power className="h-5 w-5" aria-hidden="true" /></span>
                    <div>
                      <b className="text-[15px] font-semibold text-ink">RusVPN is activated on this device</b>
                      <p className="mt-0.5 text-[13.5px] text-body">Open the app and press Connect. It picks the fastest server near you automatically. (Simulated in this prototype.)</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="off" exit={{ opacity: 0 }}>
                    <p className="text-[14px] text-body">Already installed? Activate it here and skip the email.</p>
                    <Button className="mt-4 w-full" busy={busy} busyLabel="Activating…" onClick={activate}>Open RusVPN</Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <p className="mt-6 text-center text-[13px] text-muted">
              Didn’t get the email?{' '}
              <button disabled={cooldown > 0} onClick={() => { setCooldown(30); track('signin_link_resent') }}
                className="inline-flex items-center gap-1 font-semibold text-ink underline decoration-red/60 underline-offset-2 disabled:cursor-default disabled:text-muted disabled:no-underline">
                <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />{cooldown > 0 ? `Sent — resend in ${cooldown}s` : 'Resend link'}
              </button>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
