import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe2, ShieldCheck, RotateCcw, Server } from 'lucide-react'
import Logo from './Logo.jsx'
import Button from './Button.jsx'
import PhoneMockup, { useDemoLoop } from './PhoneMockup.jsx'
import { track, EVENTS } from '../lib/track.js'
import { PLANS, BEST_DEAL, money } from '../lib/plans.js'

// Only claims stated on rusnetvpn.vercel.app: server/country counts, the no-logs
// policy and the 30-day refund (FAQ 07: "we refund it in full").
const BENEFITS = [
  { icon: Globe2, title: '700+ servers', text: 'in 90+ countries', mTitle: '700+ servers', mText: '90+ countries' },
  { icon: ShieldCheck, title: 'Strict no-logs', text: 'No browsing or traffic logs', mTitle: 'No-logs', mText: 'Strict policy' },
  { icon: RotateCcw, title: '30-day money-back', text: 'Full refund, no questions', mTitle: '30-day', mText: 'Money-back' },
]

const best = PLANS.find((p) => p.id === BEST_DEAL)

// The device is drawn at one fixed size and scaled to whatever height is left,
// so on a short phone it shrinks as a whole instead of squashing its insides.
const BASE_W = 300
const BASE_H = 614
function useFit() {
  const ref = useRef(null)
  const [scale, setScale] = useState(1)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect
      setScale(Math.min(height / BASE_H, width / BASE_W, 1.08))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, scale]
}

const rise = (d = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: .6, delay: d, ease: [.21, .78, .26, 1] },
})

export default function Landing({ onStart }) {
  const demo = useDemoLoop()
  const on = demo === 'on'
  const [fitRef, scale] = useFit()

  useEffect(() => { track(EVENTS.LP_VIEWED) }, [])

  return (
    <main className="relative isolate flex h-dvh flex-col overflow-hidden">
      {/* backdrop: warm paper, a red glow behind the device, faint dot grid */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-[-10%] top-[8%] h-[70vmin] w-[70vmin] rounded-full bg-red/15 blur-[90px] max-lg:left-1/2 max-lg:top-[30%] max-lg:-translate-x-1/2 max-lg:h-[55vmin] max-lg:w-[55vmin]" />
        <div className="absolute inset-0 [background-image:radial-gradient(rgba(14,18,22,.07)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_70%_45%,black,transparent_70%)]" />
      </div>

      <div className="mx-auto flex w-full max-w-[1280px] flex-1 min-h-0 flex-col px-4 sm:px-8 lg:px-14">
        <motion.div {...rise(0)} className="flex flex-none items-center pt-4 sm:pt-6 lg:pt-8">
          <Logo className="h-6 w-auto text-ink sm:h-7" />
        </motion.div>

        <div className="grid flex-1 min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] gap-3 py-3 sm:gap-5 sm:py-5 lg:grid-cols-[1.08fr_.92fr] lg:grid-rows-1 lg:items-center lg:gap-12 lg:py-6">
          {/* copy column: on mobile its children join the grid so the phone sits between them */}
          <div className="contents lg:flex lg:flex-col lg:justify-center">
            <div className="order-1">
              <motion.h1 {...rise(.05)} className="text-[clamp(32px,9vw,44px)] text-balance sm:text-[52px] lg:text-[clamp(52px,5.6vw,80px)]">
                Privacy Shouldn’t Be <span className="font-light tracking-[-.026em] text-red">Complicated.</span>
              </motion.h1>
              <motion.p {...rise(.12)} className="mt-2.5 max-w-[30rem] text-[15px] leading-[1.5] text-body sm:mt-4 sm:text-[17px] lg:mt-6 lg:text-[18.5px] lg:leading-[1.6]">
                Protect your connection with a VPN that’s simple to set up and easy to use.
              </motion.p>
            </div>

            <div className="order-3 lg:mt-9">
              <motion.ul {...rise(.2)} className="grid grid-cols-3 gap-2 sm:gap-3 lg:max-w-[34rem]" aria-label="What you get">
                {BENEFITS.map(({ icon: Icon, title, text, mTitle, mText }) => (
                  <li key={title} className="flex items-center justify-center gap-2 rounded-2xl border border-ink/[.07] bg-white/70 px-1.5 py-2 text-center backdrop-blur sm:items-start sm:justify-start sm:gap-2.5 sm:p-3.5 sm:text-left">
                    <span className="hidden h-8 w-8 flex-none place-items-center rounded-full bg-red-tint text-red-text sm:grid">
                      <Icon className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <b className="block text-[12.5px] font-semibold leading-tight text-ink sm:text-[14px]"><span className="sm:hidden">{mTitle}</span><span className="max-sm:hidden">{title}</span></b>
                      <span className="mt-0.5 block text-[11px] leading-snug text-muted sm:text-[13px]"><span className="sm:hidden">{mText}</span><span className="max-sm:hidden">{text}</span></span>
                    </span>
                  </li>
                ))}
              </motion.ul>

              <motion.div {...rise(.28)} className="mt-3 flex flex-col gap-2.5 sm:mt-5 sm:flex-row sm:items-center sm:gap-5 lg:mt-8">
                <Button
                  className="w-full sm:w-auto"
                  onClick={() => { track(EVENTS.CTA_CLICKED, { location: 'hero' }); onStart() }}
                >
                  Get RusVPN
                </Button>
                <p className="text-center text-[12.5px] leading-snug text-muted sm:text-left sm:text-[13.5px]">
                  From <b className="tnum font-semibold text-ink">{money(best.perMonth)}/mo</b> on the 1-year plan.
                  <br className="hidden sm:block" /> No password needed to start.
                </p>
              </motion.div>
            </div>
          </div>

          {/* product visual */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: .97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: .9, delay: .15, ease: [.21, .78, .26, 1] }}
            className="relative order-2 h-full min-h-0 lg:h-[min(680px,80vh)]"
          >
            <div ref={fitRef} className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex-none" style={{ width: BASE_W * scale, height: BASE_H * scale }}>
            <div className="absolute left-0 top-0 origin-top-left" style={{ width: BASE_W, height: BASE_H, transform: `scale(${scale})` }}>
              <PhoneMockup state={demo} className="h-full" />

              {/* floating chips, in the style of the site's hero chips */}
              <motion.div {...rise(.6)} className="absolute -left-[140px] top-[12%] hidden items-center gap-2 rounded-full border border-white/70 bg-white/90 px-4 py-2.5 text-[13.5px] font-semibold shadow-[0_14px_30px_-16px_rgba(14,18,22,.5)] backdrop-blur-md sm:inline-flex">
                <Server className="h-3.5 w-3.5 text-red" aria-hidden="true" /> 700+ servers worldwide
              </motion.div>

              <motion.div {...rise(.75)} className="absolute -right-[128px] top-[34%] hidden w-[210px] rounded-[20px] border border-white/80 bg-white/95 p-3.5 shadow-[0_30px_60px_-34px_rgba(14,18,22,.45)] backdrop-blur-lg sm:block" aria-hidden="true">
                <div className="flex items-center justify-between">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span key={on ? 'on' : 'off'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className={`inline-flex items-center gap-2 text-[11.5px] font-bold uppercase tracking-[.05em] ${on ? 'text-green-text' : 'text-muted'}`}>
                      <span className={`relative h-[7px] w-[7px] rounded-full ${on ? 'bg-green-ok' : 'bg-line-ui'}`}>
                        {on && <span className="absolute inset-0 animate-ping rounded-full bg-green-ok/60" />}
                      </span>
                      {on ? 'Protected' : demo === 'connecting' ? 'Connecting…' : 'Not connected'}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <p className="mt-2 text-[13.5px] font-semibold text-ink">Australia · Melbourne</p>
                <div className="mt-2.5 flex h-5 items-end gap-[3px]">
                  {Array.from({ length: 14 }).map((_, i) => (
                    <motion.i key={i} className="block flex-1 rounded-[2px]"
                      animate={{ height: on ? ['25%', '100%', '35%'] : '20%', backgroundColor: on ? '#E12730' : '#EBEAE5' }}
                      transition={{ duration: 1.6, repeat: on ? Infinity : 0, delay: i * .07, ease: 'easeInOut' }} />
                  ))}
                </div>
              </motion.div>
            </div>
            </div>
            </div>

            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[calc(100%+4px)] whitespace-nowrap text-[11px] text-muted max-lg:hidden">
              Animated app preview — not a live connection
            </span>
            <span className="absolute right-0 top-0 rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-medium text-muted backdrop-blur lg:hidden">
              App preview
            </span>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
