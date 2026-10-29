import { useEffect, useState } from 'react'
import { subscribe, log } from '../lib/track.js'

// Funnel event inspector, shown only with ?debug=1.
export default function EventLog() {
  const [items, setItems] = useState([...log])
  const [open, setOpen] = useState(window.innerWidth >= 1024)
  useEffect(() => { setItems([...log]); return subscribe(setItems) }, [])
  return (
    <div className="fixed right-3 top-3 z-[60] w-[280px] max-w-[calc(100vw-24px)] overflow-hidden rounded-2xl bg-ink/95 text-[11.5px] text-white shadow-2xl backdrop-blur">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between px-3.5 py-2.5 font-semibold">
        Funnel events <span className="rounded-full bg-white/15 px-2">{items.length}</span>
      </button>
      {open && (
        <ol className="max-h-[220px] space-y-1 overflow-auto px-3.5 pb-3 font-mono">
          {items.map((e, i) => (
            <li key={i} className="flex justify-between gap-2"><span className="text-[#ff8a90]">{e.event}</span><span className="text-white/50">{e.ts.slice(11, 19)}</span></li>
          ))}
        </ol>
      )}
    </div>
  )
}
