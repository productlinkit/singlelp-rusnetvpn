import { useId, useRef, useState, useEffect } from 'react'
import { Mail, AlertCircle, KeyRound } from 'lucide-react'
import Button from './Button.jsx'
import { track, EVENTS } from '../lib/track.js'

const RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
// Common typos on the biggest mail domains; a wrong address here means the
// buyer never receives the sign-in link, so it is worth one nudge.
const TYPOS = {
  'gmial.com': 'gmail.com', 'gmai.com': 'gmail.com', 'gmail.co': 'gmail.com', 'gamil.com': 'gmail.com', 'gnail.com': 'gmail.com',
  'yahoo.co': 'yahoo.com', 'yaho.com': 'yahoo.com', 'hotmial.com': 'hotmail.com', 'hotmail.co': 'hotmail.com',
  'outlook.co': 'outlook.com', 'outlok.com': 'outlook.com', 'yandex.r': 'yandex.ru', 'mail.r': 'mail.ru',
}

export default function EmailStep({ initial = '', onDone }) {
  const id = useId()
  const ref = useRef(null)
  const [value, setValue] = useState(initial)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => { ref.current?.focus() }, [])

  const domain = value.split('@')[1]?.toLowerCase()
  const suggestion = domain && TYPOS[domain] ? value.split('@')[0] + '@' + TYPOS[domain] : null

  function submit(e) {
    e.preventDefault()
    const v = value.trim()
    if (!v) return setError('Enter your email address so we can send your sign-in link.')
    if (!RE.test(v)) return setError('That doesn’t look like a full email address — check for a missing @ or domain.')
    setError('')
    setBusy(true)
    // stands in for a "start checkout session" request
    setTimeout(() => {
      track(EVENTS.EMAIL_SUBMITTED, { domain: v.split('@')[1] })
      onDone(v)
    }, 650)
  }

  return (
    <section aria-labelledby={`${id}-h`}>
      <h1 id={`${id}-h`} className="text-[34px] sm:text-[44px]">Let’s Get You <span className="font-light text-red">Connected.</span></h1>
      <p className="mt-3 text-[16px] leading-relaxed text-body">
        Enter the email you want your RusVPN subscription linked to. You’ll choose a plan next.
      </p>

      <form onSubmit={submit} noValidate className="mt-8" aria-busy={busy || undefined}>
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
            onChange={(e) => { setValue(e.target.value); if (error) setError('') }}
            aria-invalid={!!error || undefined}
            aria-describedby={error ? `${id}-err` : `${id}-hint`}
            className={`h-14 w-full rounded-2xl border bg-white pl-12 pr-4 text-[16.5px] text-ink outline-none transition placeholder:text-muted/60 focus:border-ink focus:ring-4 focus:ring-ink/10 ${error ? 'border-red-text ring-4 ring-red/10' : 'border-line-ui/50'}`}
          />
        </div>

        {error ? (
          <p id={`${id}-err`} role="alert" className="mt-2 flex items-start gap-1.5 text-[13.5px] font-medium text-red-text">
            <AlertCircle className="mt-[2px] h-4 w-4 flex-none" aria-hidden="true" /> {error}
          </p>
        ) : suggestion ? (
          <p className="mt-2 text-[13.5px] text-body">
            Did you mean{' '}
            <button type="button" className="font-semibold text-ink underline decoration-red/60 underline-offset-2" onClick={() => setValue(suggestion)}>{suggestion}</button>?
          </p>
        ) : (
          <p id={`${id}-hint`} className="mt-2 flex items-center gap-1.5 text-[13.5px] text-muted">
            <KeyRound className="h-4 w-4" aria-hidden="true" /> No password needed. Your sign-in link goes here after payment.
          </p>
        )}

        <Button type="submit" busy={busy} busyLabel="Checking…" className="mt-7 w-full">Continue</Button>
      </form>

      <p className="mt-5 text-center text-[12.5px] leading-relaxed text-muted">
        We only use this address for your account, receipts and sign-in links.
      </p>
    </section>
  )
}
