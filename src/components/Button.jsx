import { ArrowUpRight, Loader2 } from 'lucide-react'

// The site's pill button: label + round arrow chip that turns 45° on hover.
export default function Button({ children, busy = false, busyLabel, variant = 'red', className = '', type = 'button', ...rest }) {
  const white = variant === 'white'
  return (
    <button
      type={type}
      aria-busy={busy || undefined}
      disabled={busy || rest.disabled}
      className={`btn ${white ? 'btn-white' : 'btn-red'} group inline-flex min-h-[52px] items-center justify-center gap-3 rounded-full py-3 pl-7 pr-3 text-[16.5px] font-semibold leading-none whitespace-nowrap transition-[transform,box-shadow] duration-300 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-80 ${className}`}
      {...rest}
    >
      <span>{busy && busyLabel ? busyLabel : children}</span>
      <span className={`arw grid h-8 w-8 flex-none place-items-center rounded-full ${white ? 'bg-red text-white' : 'bg-white/20'}`} aria-hidden="true">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUpRight className="h-4 w-4" strokeWidth={2.4} />}
      </span>
    </button>
  )
}
