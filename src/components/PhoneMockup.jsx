import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  Power, Zap, RefreshCw, Home, Server, LayoutGrid, AlertCircle, Search, ChevronDown, ChevronRight,
  ShieldCheck, Network, Bell, Crown, Headphones, FileText, Signal,
} from 'lucide-react'

// A coded version of the real RusVPN app (Home, Server List, Menu) so the demo
// can walk through it: pick a server, connect, open the menu. It is a looped
// demo, not a live connection.
//
// Each scene: which screen is up, the VPN state, and what is being tapped.
const SCENES = [
  { screen: 'home', vpn: 'off', ms: 1700 },
  { screen: 'home', vpn: 'off', tap: 'tab-servers', ms: 550 },
  { screen: 'servers', vpn: 'off', ms: 1300 },
  { screen: 'servers', vpn: 'off', tap: 'country', ms: 500 },
  { screen: 'servers', vpn: 'off', open: true, ms: 1100 },
  { screen: 'servers', vpn: 'off', open: true, tap: 'city', ms: 600 },
  { screen: 'home', vpn: 'off', tap: 'connect', ms: 900 },
  { screen: 'home', vpn: 'connecting', ms: 1600 },
  { screen: 'home', vpn: 'on', ms: 2400 },
  { screen: 'home', vpn: 'on', tap: 'tab-menu', ms: 550 },
  { screen: 'menu', vpn: 'on', ms: 2800 },
  { screen: 'menu', vpn: 'on', tap: 'tab-home', ms: 550 },
  { screen: 'home', vpn: 'on', ms: 1400 },
  { screen: 'home', vpn: 'on', tap: 'connect', ms: 600 },
]
const STILL = { screen: 'home', vpn: 'on' }

// Drives the looped demo. Reduced motion parks it on the connected home screen.
export function useDemoLoop() {
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  useEffect(() => {
    if (reduce) return
    const t = setTimeout(() => setI((n) => (n + 1) % SCENES.length), SCENES[i].ms)
    return () => clearTimeout(t)
  }, [i, reduce])
  return reduce ? STILL : SCENES[i]
}

/* ---------- flags (simple, recognisable at 20px) ---------- */
const stripesH = (a, b, c) => <><rect width="30" height="20" fill={b} /><rect width="30" height="6.67" fill={a} /><rect y="13.33" width="30" height="6.67" fill={c} /></>
const stripesV = (a, b, c) => <><rect width="10" height="20" fill={a} /><rect x="10" width="10" height="20" fill={b} /><rect x="20" width="10" height="20" fill={c} /></>
const FLAGS = {
  au: <><rect width="30" height="20" fill="#012169" /><path d="M0 0l15 10M15 0L0 10" stroke="#fff" strokeWidth="2.4" /><path d="M0 0l15 10M15 0L0 10" stroke="#C8102E" strokeWidth="1" /><path d="M7.5 0v10M0 5h15" stroke="#fff" strokeWidth="3.2" /><path d="M7.5 0v10M0 5h15" stroke="#C8102E" strokeWidth="1.8" /><g fill="#fff"><circle cx="7.5" cy="15" r="1.6" /><circle cx="22.5" cy="4" r=".9" /><circle cx="26" cy="9" r=".9" /><circle cx="19.5" cy="9.5" r=".9" /><circle cx="22.5" cy="16" r="1" /></g></>,
  at: stripesH('#ED2939', '#fff', '#ED2939'),
  be: stripesV('#000', '#FAE042', '#ED2939'),
  ca: <><rect width="30" height="20" fill="#fff" /><rect width="7.5" height="20" fill="#D52B1E" /><rect x="22.5" width="7.5" height="20" fill="#D52B1E" /><path d="M15 4l1.6 3 2.4-.8-.9 3.6 1.9.4-3.5 3h-3l-3.5-3 1.9-.4-.9-3.6 2.4.8z" fill="#D52B1E" /><rect x="14.4" y="13" width="1.2" height="3" fill="#D52B1E" /></>,
  de: stripesH('#000', '#DD0000', '#FFCE00'),
  fr: stripesV('#002395', '#fff', '#ED2939'),
  it: stripesV('#009246', '#fff', '#CE2B37'),
  es: <><rect width="30" height="20" fill="#AA151B" /><rect y="5" width="30" height="10" fill="#F1BF00" /></>,
  se: <><rect width="30" height="20" fill="#006AA7" /><rect x="9" width="3.5" height="20" fill="#FECC00" /><rect y="8.25" width="30" height="3.5" fill="#FECC00" /></>,
  ch: <><rect width="30" height="20" fill="#DA291C" /><rect x="13" y="4" width="4" height="12" fill="#fff" /><rect x="9" y="8" width="12" height="4" fill="#fff" /></>,
  jp: <><rect width="30" height="20" fill="#fff" /><circle cx="15" cy="10" r="5.6" fill="#BC002D" /></>,
  nl: stripesH('#AE1C28', '#fff', '#21468B'),
  gb: <><rect width="30" height="20" fill="#012169" /><path d="M0 0l30 20M30 0L0 20" stroke="#fff" strokeWidth="4" /><path d="M0 0l30 20M30 0L0 20" stroke="#C8102E" strokeWidth="1.6" /><path d="M15 0v20M0 10h30" stroke="#fff" strokeWidth="6" /><path d="M15 0v20M0 10h30" stroke="#C8102E" strokeWidth="3.4" /></>,
  us: <><rect width="30" height="20" fill="#fff" />{[0, 2, 4, 6, 8, 10, 12].map((i) => <rect key={i} y={i * 20 / 13} width="30" height={20 / 13} fill="#B22234" />)}<rect width="13" height={20 * 7 / 13} fill="#3C3B6E" /></>,
}
function Flag({ code, className = 'h-3.5 w-5' }) {
  return <svg viewBox="0 0 30 20" className={`${className} flex-none rounded-[2px] ring-1 ring-black/10`} aria-hidden="true">{FLAGS[code]}</svg>
}

/* ---------- tap indicator ---------- */
function Tap({ show, className = '' }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.span
          className={`pointer-events-none absolute z-20 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink/25 ring-2 ring-white/80 ${className}`}
          initial={{ scale: .3, opacity: 0 }}
          animate={{ scale: [0.3, 1, 0.85], opacity: [0, 1, .9] }}
          exit={{ scale: 1.6, opacity: 0 }}
          transition={{ duration: .45 }}
        />
      )}
    </AnimatePresence>
  )
}

const screenAnim = {
  initial: { opacity: 0, x: 14 },
  animate: { opacity: 1, x: 0, transition: { duration: .35, ease: [.21, .78, .26, 1] } },
  exit: { opacity: 0, x: -14, transition: { duration: .2 } },
}

/* ---------- screens ---------- */
function HomeScreen({ vpn, tap }) {
  const reduce = useReducedMotion()
  const on = vpn === 'on'
  const connecting = vpn === 'connecting'
  return (
    <motion.div {...screenAnim} className="absolute inset-0 flex flex-col">
      <motion.div
        className="relative flex min-h-0 flex-1 flex-col items-center justify-center pt-5"
        animate={{ background: on ? 'linear-gradient(180deg,#ECE7F7 0%,#E3DCF2 100%)' : 'linear-gradient(180deg,#E9EEF7 0%,#DCE4F2 100%)' }}
        transition={{ duration: .8 }}
      >
        <div className="relative grid aspect-square w-[78%] place-items-center">
          <span className="absolute inset-0 rounded-full bg-white/35" />
          <span className="absolute inset-[16%] rounded-full bg-white/55" />
          {connecting && !reduce && (
            <>
              <motion.span className="absolute inset-[16%] rounded-full border-2 border-red/40" initial={{ scale: .8, opacity: .9 }} animate={{ scale: 1.25, opacity: 0 }} transition={{ duration: 1.2, repeat: Infinity }} />
              <motion.span className="absolute inset-[30%] rounded-full border-2 border-b-transparent border-l-transparent border-r-transparent border-t-red" animate={{ rotate: 360 }} transition={{ duration: .9, repeat: Infinity, ease: 'linear' }} />
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
        <p className="mt-1 text-[10.5px] font-medium text-ink-2/80">
          {on ? 'Your connection is protected' : connecting ? 'Connecting…' : 'Current internet status'}
        </p>
      </motion.div>

      <div className="relative -mt-4 rounded-t-[1.4rem] bg-white px-4 pb-2 pt-4 shadow-[0_-10px_30px_-20px_rgba(14,18,22,.3)]">
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
          <Tap show={tap === 'connect'} className="left-1/2 top-1/2" />
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#EEF3FF] px-2 py-1 text-[9.5px] font-semibold text-[#3B4A6B]"><Zap className="h-2.5 w-2.5 fill-amber-400 text-amber-400" /> Fastest</span>
          <Flag code="au" className="ml-1 h-4 w-6" />
          <span className="flex-1 text-[11px] leading-tight text-ink-2"><b className="font-semibold">Australia</b><br /><span className="text-muted">Melbourne</span></span>
          <RefreshCw className="h-3.5 w-3.5 text-muted" />
        </div>

        <p className="mt-2.5 text-[9.5px] font-semibold text-ink">Quick Connect</p>
        <div className="mt-1.5 grid grid-cols-3 gap-1.5">
          {[['us', 'United States'], ['gb', 'United Kingdom'], ['jp', 'Japan']].map(([c, n]) => (
            <div key={c} className="flex flex-col items-center gap-1 rounded-lg bg-paper px-1 py-1.5">
              <Flag code={c} />
              <span className="w-full truncate text-center text-[8.5px] font-medium text-ink-2">{n}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

const COUNTRIES = [['au', 'Australia'], ['at', 'Austria'], ['be', 'Belgium'], ['ca', 'Canada'], ['fr', 'France'], ['de', 'Germany'], ['it', 'Italy'], ['jp', 'Japan'], ['nl', 'Netherlands'], ['es', 'Spain'], ['se', 'Sweden'], ['ch', 'Switzerland'], ['gb', 'United Kingdom'], ['us', 'United States']]
const CITIES = ['Melbourne', 'Sydney']

function ServersScreen({ open, tap }) {
  return (
    <motion.div {...screenAnim} className="absolute inset-0 flex flex-col bg-white px-4 pt-7">
      <p className="text-[17px] font-bold tracking-[-.02em] text-ink">Server List</p>
      <div className="mt-2.5 flex h-8 items-center gap-1.5 rounded-xl border border-ink/25 px-2.5 text-[10.5px] text-muted">
        <Search className="h-3.5 w-3.5" /> Search a server
      </div>
      <div className="mt-2 flex gap-1.5 text-[9.5px] font-semibold">
        <span className="rounded-full bg-ink px-2.5 py-1 text-white">All countries</span>
        <span className="rounded-full bg-paper px-2.5 py-1 text-ink-2">Favorites</span>
      </div>
      <ul className="mt-1.5 min-h-0 flex-1 overflow-hidden">
        {COUNTRIES.map(([c, n], i) => (
          <li key={c} className="border-b border-ink/[.08]">
            <div className={`relative flex items-center gap-2.5 py-2 ${i === 0 && open ? 'text-red' : 'text-ink'}`}>
              <Flag code={c} className="h-4 w-6" />
              <span className="flex-1 text-[11.5px] font-semibold">{n}</span>
              <ChevronDown className={`h-3.5 w-3.5 text-muted transition-transform duration-300 ${i === 0 && open ? 'rotate-180' : ''}`} />
              {i === 0 && <Tap show={tap === 'country'} className="left-[45%] top-1/2" />}
            </div>
            {i === 0 && (
              <AnimatePresence initial={false}>
                {open && (
                  <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .3 }} className="overflow-hidden">
                    {CITIES.map((city, j) => (
                      <li key={city} className={`relative mb-1 flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[10.5px] ${j === 0 && tap === 'city' ? 'bg-red-tint' : 'bg-paper'}`}>
                        <Signal className="h-3 w-3 text-green-ok" />
                        <span className="flex-1 font-medium text-ink-2">{city}</span>
                        {j === 0 && <span className="rounded-full bg-[#EEF3FF] px-1.5 text-[8.5px] font-semibold text-[#3B4A6B]">Fastest</span>}
                        {j === 0 && <Tap show={tap === 'city'} className="left-[40%] top-1/2" />}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            )}
          </li>
        ))}
      </ul>
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white to-transparent" />
    </motion.div>
  )
}

const MENU = [
  ['VPN Settings', [[ShieldCheck, 'Protocols'], [Network, 'Connection Settings'], [Bell, 'Notification Settings'], [Crown, 'My Subscription']]],
  ['About us', [[Headphones, 'Support center'], [FileText, 'Terms and Privacy Policy']]],
]

function MenuScreen() {
  return (
    <motion.div {...screenAnim} className="absolute inset-0 flex flex-col bg-white px-4 pt-7">
      <p className="text-[17px] font-bold tracking-[-.02em] text-ink">Menu</p>
      <div className="mt-2.5 flex items-center gap-2.5 rounded-2xl bg-red-tint p-3">
        <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-red text-[12px] font-bold text-white">Y</span>
        <span className="min-w-0">
          <b className="block truncate text-[11px] font-semibold text-ink">you@email.com</b>
          <span className="mt-0.5 inline-block rounded-[4px] bg-red px-1.5 py-[1px] text-[8px] font-bold uppercase tracking-[.04em] text-white">Premium · 1 Year</span>
        </span>
      </div>
      <div className="mt-3">
        <p className="border-b border-ink/70 pb-1 text-[12px] font-bold text-ink">Quick settings</p>
        <ul>
          {[[Power, 'Kill Switch', 'Cut internet if VPN drops'], [Zap, 'Auto-connect', 'Connect when the app opens']].map(([Icon, label, sub]) => (
            <li key={label} className="flex items-center gap-2.5 border-b border-ink/[.06] py-[6px] text-ink">
              <Icon className="h-3.5 w-3.5 text-ink-2" />
              <span className="min-w-0 flex-1 leading-tight">
                <b className="block text-[10.5px] font-medium">{label}</b>
                <span className="block truncate text-[8.5px] text-muted">{sub}</span>
              </span>
              <span className="flex h-[15px] w-[26px] items-center justify-end rounded-full bg-red p-[2px]"><span className="h-[11px] w-[11px] rounded-full bg-white" /></span>
            </li>
          ))}
        </ul>
      </div>
      {MENU.map(([group, rows]) => (
        <div key={group} className="mt-3">
          <p className="border-b border-ink/70 pb-1 text-[12px] font-bold text-ink">{group}</p>
          <ul>
            {rows.map(([Icon, label]) => (
              <li key={label} className="flex items-center gap-2.5 border-b border-ink/[.06] py-[7px] text-[10.5px] text-ink">
                <Icon className="h-3.5 w-3.5 text-ink-2" />
                <span className="flex-1 font-medium">{label}</span>
                <ChevronRight className="h-3 w-3 text-muted" />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </motion.div>
  )
}

const TABS = [['home', Home, 'Home'], ['servers', Server, 'Server List'], ['menu', LayoutGrid, 'Menu']]

export default function PhoneMockup({ scene, className = '' }) {
  const { screen, vpn, tap, open } = scene
  const on = vpn === 'on'

  return (
    <div className={`relative ${className}`}>
      <div className="relative h-full rounded-[2.6rem] bg-ink p-[7px] shadow-[0_60px_120px_-50px_rgba(14,18,22,.55),0_30px_60px_-34px_rgba(14,18,22,.4)] ring-1 ring-black/40">
        <div className="relative flex h-full flex-col overflow-hidden rounded-[2.15rem] bg-white">
          {/* status bar */}
          <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-6 pt-2.5 text-[10px] font-semibold text-ink">
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

          {/* screens */}
          <div className="relative min-h-0 flex-1">
            <AnimatePresence initial={false}>
              {screen === 'home' && <HomeScreen key="home" vpn={vpn} tap={tap} />}
              {screen === 'servers' && <ServersScreen key="servers" open={open} tap={tap} />}
              {screen === 'menu' && <MenuScreen key="menu" />}
            </AnimatePresence>
          </div>

          {/* tab bar, the same on every screen */}
          <div className="relative z-10 bg-white px-4 pb-3 pt-1.5">
            <div className="grid grid-cols-3 rounded-full bg-paper p-1 text-[8.5px] font-medium text-ink-2">
              {TABS.map(([key, Icon, label]) => {
                const active = screen === key
                return (
                  <span key={key} className="relative flex items-center justify-center">
                    {active && <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-full bg-white shadow-sm" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                    <span className={`relative flex items-center gap-1 py-1 ${active ? 'font-semibold text-ink' : ''}`}>
                      <Icon className={`h-3 w-3 ${active ? 'text-red' : ''}`} fill={active && key === 'home' ? 'currentColor' : 'none'} /> {label}
                    </span>
                    <Tap show={tap === `tab-${key}`} className="left-1/2 top-1/2" />
                  </span>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <p className="sr-only">Illustration of the RusVPN app: choosing Australia, Melbourne in the server list, connecting, then opening the menu. This is an animated demo, not a live connection.</p>
    </div>
  )
}
