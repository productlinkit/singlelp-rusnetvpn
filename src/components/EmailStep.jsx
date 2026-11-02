import { useId, useRef, useState, useEffect } from 'react'
import { Mail, AlertCircle, UserCheck, UserPlus, BadgeCheck } from 'lucide-react'
import Button from './Button.jsx'
import { ACCOUNT, lookupAccount } from '../lib/account.js'
import { track, EVENTS } from '../lib/track.js'

const RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
// Common typos on the biggest mail domains; a wrong address here means the
// buyer never receives their password, so it is worth one nudge.
const TYPOS = {
  'gmial.com': 'gmail.com', 'gmai.com': 'gmail.com', 'gmail.co': 'gmail.com', 'gamil.com': 'gmail.com', 'gnail.com': 'gmail.com',
  'yahoo.co': 'yahoo.com', 'yaho.com': 'yahoo.com', 'hotmial.com': 'hotmail.com', 'hotmail.co': 'hotmail.com',
  'outlook.co': 'outlook.com', 'outlok.com': 'outlook.com', 'yandex.r': 'yandex.ru', 'mail.r': 'mail.ru',
}

export default function EmailStep({ initial = '', account, compact = false, locked = false, onChecked, onEdit, onLogin }) {
  const id = useId()
  const ref = useRef(null)
  const [value, setValue] = useState(initial)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => { ref.current?.focus() }, [])

  const domain = value.split('@')[1]?.toLowerCase()
  const suggestion = domain && TYPOS[domain] ? value.split('@')[0] + '@' + TYPOS[domain] : null

  // any edit means the status we looked up no longer applies
  function change(v) {
    setValue(v)
    if (error) setError('')
    if (account) onEdit()
  }

  async function submit(e) {
    e.preventDefault()
    if (account || busy) return
    const v = value.trim()
    if (!v) return setError('Enter your email address so we can find or create your account.')
    if (!RE.test(v)) return setError('That doesn’t look like a full email address — check for a missing @ or domain.')
    setError('')
    setBusy(true)
    const status = await lookupAccount(v)
    setBusy(false)
    track(EVENTS.EMAIL_SUBMITTED, { domain: v.split('@')[1], account: status })
    onChecked(v, status)
  }

  return (
    <section aria-labelledby={`${id}-h`}>
      <h1 id={`${id}-h`} className={`text-[34px] sm:text-[44px] ${compact ? 'lg:text-[30px]' : ''}`}>Let’s Get You <span className="font-light text-red">Connected.</span></h1>
      <p className={`mt-3 text-[16px] leading-relaxed text-body ${compact ? 'lg:hidden' : ''}`}>
        Enter your email address to get started.
      </p>

      <form onSubmit={submit} noValidate className={`mt-8 ${compact ? 'lg:mt-3' : ''}`} aria-busy={busy || undefined}>
        <label htmlFor={`${id}-email`} className="text-[14px] font-semibold text-ink">Email Address</label>
        <div className="relative mt-2">
          <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            ref={ref}
            id={`${id}-email`}
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="you@email.com"
            value={value}
            readOnly={busy || locked}
            onChange={(e) => change(e.target.value)}
            aria-invalid={!!error || undefined}
            aria-describedby={error ? `${id}-err` : `${id}-hint`}
            className={`h-14 w-full rounded-2xl border bg-white pl-12 pr-4 ${compact ? 'lg:h-12' : ''} text-[16.5px] text-ink outline-none transition placeholder:text-muted/60 focus:border-ink focus:ring-4 focus:ring-ink/10 ${error ? 'border-red-text ring-4 ring-red/10' : 'border-line-ui/50'}`}
          />
        </div>

        {error ? (
          <p id={`${id}-err`} role="alert" className="mt-2 flex items-start gap-1.5 text-[13.5px] font-medium text-red-text">
            <AlertCircle className="mt-[2px] h-4 w-4 flex-none" aria-hidden="true" /> {error}
          </p>
        ) : suggestion ? (
          <p className="mt-2 text-[13.5px] text-body">
            Did you mean{' '}
            <button type="button" className="font-semibold text-ink underline decoration-red/60 underline-offset-2" onClick={() => change(suggestion)}>{suggestion}</button>?
          </p>
        ) : account === ACCOUNT.NEW ? (
          <p id={`${id}-hint`} role="status" className="mt-2 flex items-start gap-1.5 text-[13.5px] text-muted">
            <UserPlus className="mt-[2px] h-4 w-4 flex-none" aria-hidden="true" /> We’ll create your account and email your password after payment.
          </p>
        ) : account === ACCOUNT.REGISTERED ? (
          <p id={`${id}-hint`} role="status" className="mt-2 flex items-start gap-1.5 text-[13.5px] text-muted">
            <UserCheck className="mt-[2px] h-4 w-4 flex-none" aria-hidden="true" /> You already have an account. Your password stays the same.
          </p>
        ) : !account ? (
          <p id={`${id}-hint`} className="mt-2 text-[13.5px] text-muted">
            We only use this address for your account and receipts.
          </p>
        ) : null}

        {account === ACCOUNT.SUBSCRIBED && (
          <div id={`${id}-hint`} role="status" className="mt-4 flex gap-3 rounded-2xl bg-green-tint p-4 text-[14px] text-ink-2">
            <BadgeCheck className="mt-0.5 h-5 w-5 flex-none text-green-text" aria-hidden="true" />
            <div>
              <b className="font-semibold text-ink">You already have an active subscription.</b>
              <p className="mt-0.5">There’s nothing to pay. Log in to start using RusVPN.</p>
            </div>
          </div>
        )}

        {!account && <Button type="submit" busy={busy} busyLabel="Checking…" className="mt-7 w-full">Continue</Button>}
        {account === ACCOUNT.SUBSCRIBED && <Button className="mt-5 w-full" onClick={onLogin}>Login</Button>}
      </form>
    </section>
  )
}
