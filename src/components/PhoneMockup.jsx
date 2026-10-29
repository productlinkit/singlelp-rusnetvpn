import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Power, Zap, RefreshCw, Home, Server, LayoutGrid, AlertCircle } from 'lucide-react'

// A coded version of the real RusVPN app home screen (Connect → Disconnect), so
// the connection change can animate. It is a looped demo, not a live connection.
const STATES = ['off', 'connecting', 'on']
const DURATION = { off: 2200, connecting: 1700, on: 3600 }

// Drives the looped demo. Reduced motion parks it on the connected screen.
export function useDemoLoop() {
  const reduce = useReducedMotion()
  const [i, setI] = useState(reduce ? 2 : 0)
  const state = STATES[i]
  useEffect(() => {
    if (reduce) return
    const t = setTimeout(() => setI((n) => (n + 1) % STATES.length), DURATION[state])
    return () => clearTimeout(t)
  }, [state, reduce])
  return state
}

function FlagAU({ className = '' }) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      <rect width="30" height="20" fill="#012169" />
      <path d="M0 0l15 10M15 0L0 10" stroke="#fff" strokeWidth="2.4" />
      <path d="M0 0l15 10M15 0L0 10" stroke="#C8102E" strokeWidth="1" />
      <path d="M7.5 0v10M0 5h15" stroke="#fff" strokeWidth="3.2" />
      <path d="M7.5 0v10M0 5h15" stroke="#C8102E" strokeWidth="1.8" />
      <g fill="#fff"><circle cx="7.5" cy="15" r="1.6" /><circle cx="22.5" cy="4" r=".9" /><circle cx="26" cy="9" r=".9" /><circle cx="19.5" cy="9.5" r=".9" /><circle cx="22.5" cy="16" r="1" /></g>
    </svg>
  )
}

const QUICK = [
  { name: 'United States', flag: <svg viewBox="0 0 30 20" className="h-3.5 w-5 rounded-[2px]" aria-hidden="true"><rect width="30" height="20" fill="#fff"/>{[0,2,4,6,8,10,12].map(i=><rect key={i} y={i*20/13} width="30" height={20/13} fill="#B22234"/>)}<rect width="13" height={20*7/13} fill="#3C3B6E"/></svg> },
  { name: 'United Kingdom', flag: <svg viewBox="0 0 30 20" className="h-3.5 w-5 rounded-[2px]" aria-hidden="true"><rect width="30" height="20" fill="#012169"/><path d="M0 0l30 20M30 0L0 20" stroke="#fff" strokeWidth="4"/><path d="M0 0l30 20M30 0L0 20" stroke="#C8102E" strokeWidth="1.6"/><path d="M15 0v20M0 10h30" stroke="#fff" strokeWidth="6"/><path d="M15 0v20M0 10h30" stroke="#C8102E" strokeWidth="3.4"/></svg> },
  { name: 'Japan', flag: <svg viewBox="0 0 30 20" className="h-3.5 w-5 rounded-[2px] ring-1 ring-black/10" aria-hidden="true"><rect width="30" height="20" fill="#fff"/><circle cx="15" cy="10" r="5.6" fill="#BC002D"/></svg> },
]

export default function PhoneMockup({ state, className = '' }) {
  const reduce = useReducedMotion()
  const on = state === 'on'
  const connecting = state === 'connecting'

  return (
    <div className={`relative ${className}`}>
      {/* device */}
      <div className="relative h-full rounded-[2.6rem] bg-ink p-[7px] shadow-[0_60px_120px_-50px_rgba(14,18,22,.55),0_30px_60px_-34px_rgba(14,18,22,.4)] ring-1 ring-black/40">
        <div className="relative flex h-full flex-col overflow-hidden rounded-[2.15rem] bg-white">
          {/* status bar */}
          <div className="relative z-10 flex items-center justify-between px-6 pt-2.5 text-[10px] font-semibold text-ink">
            <span className="tnum">9:41</span>
            <span className="absolute left-1/2 top-2 h-[18px] w-[72px] -translate-x-1/2 rounded-full bg-ink" />
            <span className="flex items-center gap-1">
              <AnimatePresence>
                {on && (
                  <motion.span initial={{ opacity: 0, scale: .6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="rounded-[4px] bg-ink px-1 text-[8px] leading-[13px] text-white">VPN</motion.span>
                )}
              </AnimatePresence>
              <span className="h-[9px] w-[18px] rounded-[3px] border border-ink/70 p-[1px]"><span className="block h-full w-3/4 rounded-[1px] bg-ink" /></span>
            </span>
          </div>

          {/* stage with the power button */}
          <motion.div
            className="relative flex min-h-0 flex-1 flex-col items-center justify-center"
            animate={{ background: on ? 'linear-gradient(180deg,#ECE7F7 0%,#E3DCF2 100%)' : 'linear-gradient(180deg,#E9EEF7 0%,#DCE4F2 100%)' }}
            transition={{ duration: .8 }}
          >
            <div className="relative grid aspect-square w-[78%] place-items-center">
              <span className="absolute inset-0 rounded-full bg-white/35" />
              <span className="absolute inset-[16%] rounded-full bg-white/55" />
              {connecting && !reduce && (
                <>
                  <motion.span className="absolute inset-[16%] rounded-full border-2 border-red/40" initial={{ scale: .8, opacity: .9 }} animate={{ scale: 1.25, opacity: 0 }} transition={{ duration: 1.2, repeat: Infinity }} />
                  <motion.span className="absolute inset-[30%] rounded-full border-2 border-t-red border-r-transparent border-b-transparent border-l-transparent" animate={{ rotate: 360 }} transition={{ duration: .9, repeat: Infinity, ease: 'linear' }} />
                </>
              )}
              <motion.span
                className="relative grid aspect-square w-[42%] place-items-center rounded-full shadow-[0_12px_30px_-12px_rgba(40,40,90,.45)]"
                animate={{ background: on ? 'linear-gradient(180deg,#C9BCEB,#AE9EDF)' : 'linear-gradient(180deg,#C3CFEA,#92A6D6)' }}
                transition={{ duration: .8 }}
              >
                <Power className={`h-[42%] w-[42%] transition-colors duration-700 ${on ? 'text-white' : 'text-red-deep'}`} strokeWidth={2.2} />
              </motion.span>
            </div>
            <p className="mt-1 text-[10.5px] font-medium text-ink-2/80" aria-hidden="true">
              {on ? 'Your connection is protected' : connecting ? 'Connecting…' : 'Current internet status'}
            </p>
          </motion.div>

          {/* bottom sheet */}
          <div className="relative -mt-4 rounded-t-[1.4rem] bg-white px-4 pb-3 pt-4 shadow-[0_-10px_30px_-20px_rgba(14,18,22,.3)]">
            <div className="relative h-10">
              <AnimatePresence mode="wait" initial={false}>
                {on ? (
                  <motion.div key="dis" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: .3 }}
                    className="absolute inset-0 flex items-center justify-center gap-1.5 rounded-full border-[1.5px] border-red text-[13px] font-semibold text-red">
                    <AlertCircle className="h-3.5 w-3.5" /> Disconnect
                  </motion.div>
                ) : (
                  <motion.div key="con" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: .3 }}
                    className="absolute inset-0 flex items-center justify-center rounded-full bg-red text-[13px] font-semibold text-white">
                    {connecting ? 'Connecting…' : 'Connect'}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#EEF3FF] px-2 py-1 text-[9.5px] font-semibold text-[#3B4A6B]"><Zap className="h-2.5 w-2.5 fill-amber-400 text-amber-400" /> Fastest</span>
              <FlagAU className="ml-1 h-4 w-6 rounded-[3px]" />
              <span className="flex-1 text-[11px] leading-tight text-ink-2"><b className="font-semibold">Australia</b><br /><span className="text-muted">Melbourne</span></span>
              <RefreshCw className="h-3.5 w-3.5 text-muted" />
            </div>

            <p className="mt-2.5 text-[9.5px] font-semibold text-ink">Quick Connect</p>
            <div className="mt-1.5 grid grid-cols-3 gap-1.5">
              {QUICK.map((q) => (
                <div key={q.name} className="flex flex-col items-center gap-1 rounded-lg bg-paper px-1 py-1.5">
                  {q.flag}
                  <span className="w-full truncate text-center text-[8.5px] font-medium text-ink-2">{q.name}</span>
                </div>
              ))}
            </div>

            <div className="mt-2.5 grid grid-cols-3 rounded-full bg-paper p-1 text-[8.5px] font-medium text-ink-2">
              <span className="flex items-center justify-center gap-1 rounded-full bg-white py-1 shadow-sm"><Home className="h-3 w-3 fill-red text-red" /> Home</span>
              <span className="flex items-center justify-center gap-1 py-1"><Server className="h-3 w-3" /> Servers</span>
              <span className="flex items-center justify-center gap-1 py-1"><LayoutGrid className="h-3 w-3" /> Menu</span>
            </div>
          </div>
        </div>
      </div>

      {/* screen-reader summary of the visual */}
      <p className="sr-only">Illustration of the RusVPN app switching from Connect to Disconnect, connected to Australia, Melbourne. This is an animated demo, not a live connection.</p>
    </div>
  )
}
