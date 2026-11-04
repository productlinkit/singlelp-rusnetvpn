import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Landing from './components/Landing.jsx'
import FlowShell from './components/FlowShell.jsx'
import EmailStep from './components/EmailStep.jsx'
import CheckoutStep from './components/CheckoutStep.jsx'
import PendingStep from './components/PendingStep.jsx'
import FailedStep from './components/FailedStep.jsx'
import SuccessStep from './components/SuccessStep.jsx'
import AccessStep from './components/AccessStep.jsx'
import EventLog from './components/EventLog.jsx'
import { ACCOUNT } from './lib/account.js'
import { PLANS, DEFAULT_PLAN } from './lib/plans.js'
import { track, EVENTS } from './lib/track.js'
import { newTransactionId } from './lib/transaction.js'

const query = new URLSearchParams(window.location.search)
const DEBUG = query.has('debug')
// ?decline=1 makes the first payment attempt fail, whatever card is entered.
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
  const [txId, setTxId] = useState(null)
  const attempts = useRef(0)
  // 'pending' or 'success' once a payment is submitted; checkout is then closed
  const settled = useRef(null)
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
      const allowed = settled.current === 'pending' ? ['pending'] : PAID_STEPS
      if (settled.current && !allowed.includes(target)) {
        window.history.pushState({ step: settled.current }, '')
        setStepState(settled.current)
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

  function onPay(outcome) {
    // stands in for the provider's card charge
    const id = newTransactionId()
    setTxId(id)
    setCharging(true)
    chargeTimer.current = setTimeout(() => {
      setCharging(false)
      onPayResult(outcome, id)
    }, 1800)
  }

  function onPayResult(outcome, id) {
    attempts.current += 1
    if (outcome === 'failed' || (DECLINE_FIRST && attempts.current === 1)) {
      track(EVENTS.PAYMENT_FAILED, { plan: planId, transaction_id: id })
      go('failed')
      return
    }
    if (outcome === 'pending') {
      settled.current = 'pending'
      track(EVENTS.PAYMENT_PENDING, { plan: planId, value: plan.price, currency: 'USD', account, transaction_id: id })
      go('pending', { replace: true })
      return
    }
    completePayment(id)
  }

  function completePayment(id) {
    settled.current = 'success'
    track(EVENTS.PAYMENT_COMPLETED, { plan: planId, value: plan.price, currency: 'USD', account, transaction_id: id })
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
                  onEdit={() => setAccount(null)}
                  onLogin={() => { track('login_clicked'); go('access') }}
                />
                {formOpen && (
                  <CheckoutStep
                    planId={planId}
                    setPlanId={setPlanId}
                    charging={charging}
                    onPay={onPay}
                  />
                )}
              </div>
            </FlowShell>
          )}

          {step === 'pending' && (
            <FlowShell step={0}>
              <PendingStep email={email} plan={plan} txId={txId} onConfirmed={() => completePayment(txId)} />
            </FlowShell>
          )}

          {step === 'failed' && (
            <FlowShell step={0} onBack={() => window.history.back()}>
              <FailedStep email={email} plan={plan} txId={txId} onRetry={() => window.history.back()} />
            </FlowShell>
          )}

          {step === 'success' && (
            <FlowShell step={1}>
              <SuccessStep email={email} account={account} plan={plan} txId={txId} onAccess={() => go('access')} />
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
