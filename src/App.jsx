import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Landing from './components/Landing.jsx'
import FlowShell from './components/FlowShell.jsx'
import EmailStep from './components/EmailStep.jsx'
import CheckoutStep, { METHODS } from './components/CheckoutStep.jsx'
import PaymentPreview from './components/PaymentPreview.jsx'
import SuccessStep from './components/SuccessStep.jsx'
import AccessStep from './components/AccessStep.jsx'
import EventLog from './components/EventLog.jsx'
import { PLANS, DEFAULT_PLAN } from './lib/plans.js'
import { track, EVENTS } from './lib/track.js'

const query = new URLSearchParams(window.location.search)
const DEBUG = query.has('debug')
// ?decline=1 makes the first payment attempt fail, to show the error state.
const DECLINE_FIRST = query.has('decline')
const PAID_STEPS = ['success', 'access']

const page = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: .45, ease: [.21, .78, .26, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: .18 } },
}

export default function App() {
  const [step, setStepState] = useState('lp')
  const [email, setEmail] = useState('')
  const [planId, setPlanId] = useState(DEFAULT_PLAN)
  const [method, setMethod] = useState('card')
  const [paying, setPaying] = useState(false)
  const [payError, setPayError] = useState(false)
  const attempts = useRef(0)
  const paid = useRef(false)

  const plan = PLANS.find((p) => p.id === planId)

  // keep the browser Back button working through the funnel
  const go = useCallback((next, { replace = false } = {}) => {
    setStepState(next)
    window.history[replace ? 'replaceState' : 'pushState']({ step: next }, '')
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    window.history.replaceState({ step: 'lp' }, '')
    const onPop = (e) => {
      const target = e.state?.step || 'lp'
      // after payment there is no way back into checkout
      if (paid.current && !PAID_STEPS.includes(target)) {
        window.history.pushState({ step: 'success' }, '')
        setStepState('success')
        return
      }
      setPaying(false)
      setStepState(target)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  function onPayResult(result) {
    attempts.current += 1
    setPaying(false)
    if (result === 'declined' || (DECLINE_FIRST && attempts.current === 1)) {
      setPayError(true)
      track('payment_failed', { plan: planId, method })
      return
    }
    paid.current = true
    setPayError(false)
    track(EVENTS.PAYMENT_COMPLETED, { plan: planId, method, value: plan.price, currency: 'USD' })
    go('success', { replace: true })
  }

  const methodLabel = METHODS.find((m) => m.id === method).label

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div key={step} {...page}>
          {step === 'lp' && <Landing onStart={() => go('email')} />}

          {step === 'email' && (
            <FlowShell step={0} onBack={() => window.history.back()}>
              <EmailStep initial={email} onDone={(v) => { setEmail(v); go('checkout') }} />
            </FlowShell>
          )}

          {step === 'checkout' && (
            <FlowShell step={1} wide onBack={() => window.history.back()}>
              <CheckoutStep
                email={email}
                planId={planId}
                setPlanId={setPlanId}
                method={method}
                setMethod={(m) => { setMethod(m); setPayError(false) }}
                error={payError}
                onEditEmail={() => window.history.back()}
                onPay={() => { setPayError(false); setPaying(true) }}
              />
            </FlowShell>
          )}

          {step === 'success' && (
            <FlowShell step={2}>
              <SuccessStep email={email} plan={plan} method={methodLabel} onAccess={() => go('access')} />
            </FlowShell>
          )}

          {step === 'access' && (
            <FlowShell step={2}>
              <AccessStep email={email} plan={plan} />
            </FlowShell>
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {paying && (
          <PaymentPreview plan={plan} method={method} email={email} decline={false}
            onCancel={() => setPaying(false)} onResult={onPayResult} />
        )}
      </AnimatePresence>

      {DEBUG && <EventLog />}
    </>
  )
}
