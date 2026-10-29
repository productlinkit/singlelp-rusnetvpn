import { ArrowLeft, Check, Lock } from 'lucide-react'
import Logo from './Logo.jsx'

const STEPS = ['Email', 'Plan & payment', 'Access']

// Shared frame for the post-click screens: logo, progress, optional back link.
// Still no navbar or footer — nothing to leak attention out of the funnel.
export default function FlowShell({ step, onBack, children, wide = false }) {
  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex w-full max-w-[1120px] items-center justify-between gap-4 px-5 pt-4 sm:px-8 sm:pt-6">
        <div className="flex items-center gap-2">
          {onBack ? (
            <button onClick={onBack} className="flex h-10 w-10 items-center justify-start rounded-full text-ink hover:text-red" aria-label="Back">
              <ArrowLeft className="h-5 w-5" />
            </button>
          ) : null}
          <Logo className="h-6 w-auto text-ink" />
        </div>
        {step < 2 && (
          <span className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-muted">
            <Lock className="h-3.5 w-3.5" aria-hidden="true" /> Secure checkout
          </span>
        )}
      </header>

      <nav aria-label="Progress" className="mx-auto mt-5 w-full max-w-[1120px] px-5 sm:mt-7 sm:px-8">
        <ol className="mx-auto flex max-w-[400px] items-center gap-2 sm:max-w-none">
          {STEPS.map((label, i) => {
            const done = i < step
            const current = i === step
            return (
              <li key={label} className={`flex items-center gap-2 ${i < STEPS.length - 1 ? 'flex-1' : 'flex-none'}`} aria-current={current ? 'step' : undefined}>
                <span className={`grid h-6 w-6 flex-none place-items-center rounded-full text-[11.5px] font-bold ${done ? 'bg-ink text-white' : current ? 'bg-red text-white' : 'bg-paper-2 text-muted'}`}>
                  {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" /> : i + 1}
                </span>
                <span className={`truncate text-[12.5px] font-semibold ${current ? 'text-ink' : 'text-muted max-sm:sr-only'}`}>{label}{done ? <span className="sr-only"> (done)</span> : null}</span>
                {i < STEPS.length - 1 && <span className={`h-px flex-1 ${done ? 'bg-ink/40' : 'bg-ink/10'}`} />}
              </li>
            )
          })}
        </ol>
      </nav>

      <div className={`mx-auto w-full px-5 pb-28 pt-8 sm:px-8 sm:pt-12 lg:pb-16 ${wide ? 'max-w-[1120px]' : 'max-w-[520px]'}`}>
        {children}
      </div>
    </div>
  )
}
