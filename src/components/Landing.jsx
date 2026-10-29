import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe2, ShieldCheck, RotateCcw, Server, Check } from 'lucide-react'
import Logo from './Logo.jsx'
import Button from './Button.jsx'
import PhoneMockup, { useDemoLoop } from './PhoneMockup.jsx'
import { track, EVENTS } from '../lib/track.js'
import { PLANS, BEST_DEAL, money } from '../lib/plans.js'

// Only claims stated on rusnetvpn.vercel.app: server/country counts, the no-logs
// policy and the 30-day refund (FAQ 07: "we refund it in full").
const BENEFITS = [
  { icon: Globe2, title: '700+ servers', text: 'in 90+ countries', mTitle: '700+ servers', mText: '90+ countries' },
  { icon: ShieldCheck, title: 'Strict no-logs', text: 'No browsing or traffic logs', mTitle: 'No-logs policy', mText: 'Strict policy' },
  { icon: RotateCcw, title: '30-day refund', text: 'Money-back guarantee', mTitle: '30-day refund', mText: 'Money-back' },
]

const STEPS = [['Pick a server', 'Server'], ['Connect', 'Connect'], ['Settings', 'Settings']]

const best = PLANS.find((p) => p.id === BEST_DEAL)

// The device is drawn at one fixed size and scaled to whatever height is left,
// so on a short phone it shrinks as a whole instead of squashing its insides.
const BASE_W = 300
const BASE_H = 614
function useFit() {
  const ref = useRef(null)
  const [fit, setFit] = useState({ scale: 1, room: 0 })
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect
      const scale = Math.min(height / BASE_H, width / BASE_W, 1.08)
      setFit({ scale, room: (width / scale - BASE_W) / 2 })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, fit]
}

const rise = (d = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: .6, delay: d, ease: [.21, .78, .26, 1] },
})

export default function Landing({ onStart }) {
  const scene = useDemoLoop()
  const on = scene.vpn === 'on'
  // which of the three demo beats is playing
  const beat = scene.screen === 'menu' ? 2
    : scene.screen === 'servers' || (scene.vpn === 'off' && scene.tap !== 'connect') ? 0 : 1
  const [fitRef, { scale, room }] = useFit()
  // Floating cards may tuck 40px over the device, never past the column edge.
  const showChips = room >= 50
  // the floating cards would sit on the list and menu screens, so they step aside
  const chipsVisible = scene.screen === 'home'
  const chipL = Math.min(140, room + 40)
  const chipR = Math.min(128, room + 40)

  useEffect(() => { track(EVENTS.LP_VIEWED) }, [])

  return (
    <main className="relative isolate flex h-dvh flex-col overflow-hidden">
      {/* backdrop: warm paper, a red glow behind the device, faint dot grid */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-[-10%] top-[8%] h-[70vmin] w-[70vmin] rounded-full bg-red/15 blur-[90px] max-lg:left-1/2 max-lg:top-[30%] max-lg:-translate-x-1/2 max-lg:h-[55vmin] max-lg:w-[55vmin]" />
        <div className="absolute inset-0 [background-image:radial-gradient(rgba(14,18,22,.07)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_70%_45%,black,transparent_70%)]" />
      </div>

      <div className="mx-auto flex w-full max-w-[1280px] flex-1 min-h-0 flex-col px-4 sm:px-8 lg:px-14 short:px-6!">
        <motion.div {...rise(0)} className="flex flex-none items-center justify-center pt-4 sm:pt-6 lg:justify-start lg:pt-8 short:justify-start! short:pt-3!">
          <Logo className="h-6 w-auto text-ink sm:h-7 short:h-5!" />
        </motion.div>

        <div className="grid flex-1 min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] gap-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-5 sm:gap-5 sm:py-5 wide:grid-cols-[1.08fr_.92fr] wide:grid-rows-1 wide:items-center wide:gap-12 lg:py-6 short:grid-cols-[1.3fr_.7fr]! short:gap-6! short:py-2!">
          {/* copy column: when stacked its children join the grid so the phone sits between them */}
          <div className="contents wide:flex wide:flex-col wide:justify-center">
            <div className="order-1 text-center wide:text-left">
              <motion.h1 {...rise(.05)} className="text-[clamp(30px,8.6vw,40px)] text-balance sm:text-[52px] lg:text-[clamp(52px,5.6vw,80px)] short:text-[clamp(26px,4.4vw,36px)]!">
                Privacy Shouldn’t Be <span className="font-light tracking-[-.026em] text-red">Complicated.</span>
              </motion.h1>
              <motion.p {...rise(.12)} className="mx-auto mt-3 max-w-[19rem] text-[14.5px] leading-[1.55] text-body sm:mt-4 sm:max-w-[30rem] sm:text-[17px] wide:mx-0 lg:mt-6 lg:text-[18.5px] lg:leading-[1.6] short:mt-2! short:text-[14px]!">
                Protect your connection with a VPN that’s simple to set up and easy to use.
              </motion.p>
            </div>

            <div className="order-3 lg:mt-9 short:mt-4!">
              {/* compact check list: phones, either way up */}
              <motion.ul {...rise(.2)} className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 sm:hidden short:flex! short:justify-start!" aria-label="What you get">
                {BENEFITS.map(({ mTitle }) => (
                  <li key={mTitle} className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 flex-none text-red" strokeWidth={3} aria-hidden="true" />
                    <span className="text-[12.5px] font-semibold text-ink">{mTitle}</span>
                  </li>
                ))}
              </motion.ul>

              {/* cards: tablets and up */}
              <motion.ul {...rise(.2)} className="mx-auto hidden max-w-[40rem] grid-cols-3 gap-3 sm:grid wide:mx-0 lg:max-w-[34rem] short:hidden!" aria-label="What you get">
                {BENEFITS.map(({ icon: Icon, title, text }) => (
                  <li key={title} className="flex items-start gap-2.5 rounded-2xl border border-ink/[.07] bg-white/70 p-3.5 text-left backdrop-blur lg:flex-col xl:flex-row">
                    <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-red-tint text-red-text">
                      <Icon className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <b className="block text-[14px] font-semibold leading-tight text-ink">{title}</b>
                      <span className="mt-0.5 block text-[13px] leading-snug text-muted">{text}</span>
                    </span>
                  </li>
                ))}
              </motion.ul>

              <motion.div {...rise(.28)} className="mt-4 flex flex-col gap-2.5 sm:mt-6 sm:flex-row sm:items-center sm:justify-center sm:gap-5 wide:justify-start lg:mt-8 short:mt-4! short:gap-4!">
                <Button
                  className="w-full sm:w-auto"
                  onClick={() => { track(EVENTS.CTA_CLICKED, { location: 'hero' }); onStart() }}
                >
                  Get RusVPN
                </Button>
                <p className="text-center text-[12.5px] leading-snug text-muted sm:text-left sm:text-[13.5px] short:text-[12.5px]!">
                  From <b className="tnum font-semibold text-ink">{money(best.perMonth)}/mo</b><span className="sm:hidden"> · No password needed</span><span className="max-sm:hidden"> on the 1-year plan.</span>
                  <br className="hidden sm:block" /><span className="max-sm:hidden"> No password needed to start.</span>
                </p>
              </motion.div>
            </div>
          </div>

          {/* product visual */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: .97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: .9, delay: .15, ease: [.21, .78, .26, 1] }}
            className="relative order-2 flex h-full max-h-[min(440px,100%)] min-h-0 flex-col self-center sm:max-h-[min(580px,100%)] wide:h-[min(680px,80vh)] wide:max-h-none short:h-[86dvh]!"
          >
            <div className="relative min-h-0 flex-1">
            <div ref={fitRef} className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex-none" style={{ width: BASE_W * scale, height: BASE_H * scale }}>
            <div className="absolute left-0 top-0 origin-top-left" style={{ width: BASE_W, height: BASE_H, transform: `scale(${scale})` }}>
              <PhoneMockup scene={scene} className="h-full" />

              {/* floating chips, in the style of the site's hero chips */}
              <motion.div {...rise(.6)} style={{ left: -chipL }} animate={{ opacity: chipsVisible ? 1 : 0, y: chipsVisible ? 0 : 8 }} transition={{ duration: .35 }} className={`absolute top-[12%] items-center gap-2 whitespace-nowrap rounded-full border border-white/70 bg-white/90 px-4 py-2.5 text-[13.5px] font-semibold shadow-[0_14px_30px_-16px_rgba(14,18,22,.5)] backdrop-blur-md ${showChips ? 'hidden sm:inline-flex' : 'hidden'}`}>
                <Server className="h-3.5 w-3.5 text-red" aria-hidden="true" /> 700+ servers worldwide
              </motion.div>

              <motion.div {...rise(.75)} style={{ right: -chipR }} animate={{ opacity: chipsVisible ? 1 : 0, y: chipsVisible ? 0 : 8 }} transition={{ duration: .35 }} className={`absolute top-[34%] w-[210px] rounded-[20px] border border-white/80 bg-white/95 p-3.5 shadow-[0_30px_60px_-34px_rgba(14,18,22,.45)] backdrop-blur-lg ${showChips ? 'hidden sm:block' : 'hidden'}`} aria-hidden="true">
                <div className="flex items-center justify-between">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span key={on ? 'on' : 'off'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className={`inline-flex items-center gap-2 text-[11.5px] font-bold uppercase tracking-[.05em] ${on ? 'text-green-text' : 'text-muted'}`}>
                      <span className={`relative h-[7px] w-[7px] rounded-full ${on ? 'bg-green-ok' : 'bg-line-ui'}`}>
                        {on && <span className="absolute inset-0 animate-ping rounded-full bg-green-ok/60" />}
                      </span>
                      {on ? 'Protected' : scene.vpn === 'connecting' ? 'Connecting…' : 'Not connected'}
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

            </div>
            <div className="mt-2.5 flex-none text-center short:mt-1.5!">
              <ol className="inline-flex items-center gap-1 rounded-full border border-ink/[.07] bg-white/80 p-1 text-[11px] font-semibold backdrop-blur short:text-[10px]!" aria-label="What the preview shows">
                {STEPS.map(([label, brief], i) => (
                  <li key={label} className="relative whitespace-nowrap px-2.5 py-1 sm:px-3 short:px-2!">
                    {beat === i && <motion.span layoutId="beat" className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                    <span className={`relative transition-colors duration-300 ${beat === i ? 'text-white' : 'text-muted'}`}>
                      <span className="tnum">{i + 1}</span> <span className="short:hidden">{label}</span><span className="hidden short:inline">{brief}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <p className="mt-1.5 text-[10.5px] text-muted sm:text-[11px] short:mt-1! short:text-[9.5px]!">Animated app preview — not a live connection</p>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
