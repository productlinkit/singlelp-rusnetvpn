import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Landing from './components/Landing.jsx'
import FlowShell from './components/FlowShell.jsx'
import EmailStep from './components/EmailStep.jsx'
import CheckoutStep from './components/CheckoutStep.jsx'
import SuccessStep from './components/SuccessStep.jsx'
import AccessStep from './components/AccessStep.jsx'
import EventLog from './components/EventLog.jsx'
import { ACCOUNT } from './lib/account.js'
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
  const [account, setAccount] = useState(null)
  const [planId, setPlanId] = useState(DEFAULT_PLAN)
  const [charging, setCharging] = useState(false)
  const [payError, setPayError] = useState(false)
  const attempts = useRef(0)
  const paid = useRef(false)
  const started = useRef(false)
  const chargeTimer = useRef(null)

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
      clearTimeout(chargeTimer.current)
      setCharging(false)
      setStepState(target)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  function onEmailChecked(value, status) {
    setEmail(value)
    setAccount(status)
    if (status !== ACCOUNT.SUBSCRIBED && !started.current) {
      started.current = true
      track(EVENTS.CHECKOUT_STARTED, { plan: planId })
    }
  }

  function onPay() {
    setPayError(false)
    // stands in for the provider's card charge
    setCharging(true)
    chargeTimer.current = setTimeout(() => {
      setCharging(false)
      onPayResult()
    }, 1800)
  }

  function onPayResult() {
    attempts.current += 1
    if (DECLINE_FIRST && attempts.current === 1) {
      setPayError(true)
      track('payment_failed', { plan: planId })
      return
    }
    paid.current = true
    setPayError(false)
    track(EVENTS.PAYMENT_COMPLETED, { plan: planId, value: plan.price, currency: 'USD', account })
    go('success', { replace: true })
  }

  const formOpen = account === ACCOUNT.NEW || account === ACCOUNT.REGISTERED

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div key={step} {...page}>
          {step === 'lp' && <Landing onStart={() => go('checkout')} />}

          {step === 'checkout' && (
            <FlowShell step={0} wide={formOpen} onBack={() => window.history.back()}>
              <div className={formOpen ? 'lg:grid lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-x-10' : ''}>
                <EmailStep
                  initial={email}
                  account={account}
                  compact={formOpen}
                  locked={charging}
                  onChecked={onEmailChecked}
                  onEdit={() => { setAccount(null); setPayError(false) }}
                  onLogin={() => { track('login_clicked'); go('access') }}
                />
                {formOpen && (
                  <CheckoutStep
                    planId={planId}
                    setPlanId={setPlanId}
                    error={payError}
                    charging={charging}
                    onPay={onPay}
                  />
                )}
              </div>
            </FlowShell>
          )}

          {step === 'success' && (
            <FlowShell step={1}>
              <SuccessStep email={email} account={account} plan={plan} onAccess={() => go('access')} />
            </FlowShell>
          )}

          {step === 'access' && (
            <FlowShell step={1}>
              <AccessStep email={email} account={account} plan={plan} />
            </FlowShell>
          )}
        </motion.div>
      </AnimatePresence>

      {DEBUG && <EventLog />}
    </>
  )
}
