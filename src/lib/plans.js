// Plans and prices as they appear on rusnetvpn.vercel.app. The source there marks
// them "PLACEHOLDER PRICES", so confirm with billing before running paid traffic.
// Only price and term are typed; everything else is derived.
const RAW = [
  { id: '1w',  label: '1 Week',   name: '1-Week plan',   per: 'Week',     price: 2.99,  months: 1 / 4.345, term: 'week',     every: 'every week',     days: 7 },
  { id: '1m',  label: '1 Month',  name: '1-Month plan',  per: 'Month',    price: 7.99,  months: 1,         term: 'month',    every: 'every month',    days: 30 },
  { id: '3m',  label: '3 Months', name: '3-Months plan', per: '3-Months', price: 17.99, months: 3,         term: '3 months', every: 'every 3 months', days: 91 },
  { id: '6m',  label: '6 Months', name: '6-Months plan', per: '6-Months', price: 29.99, months: 6,         term: '6 months', every: 'every 6 months', days: 182 },
  { id: '1y',  label: '1 Year',   name: '1-Year plan',   per: 'Year',     price: 47.99, months: 12,        term: 'year',     every: 'every year',     days: 365 },
]

const monthly = RAW.find((p) => p.id === '1m').price

export const PLANS = RAW.map((p) => {
  const perMonth = p.price / p.months
  const saving = Math.round((1 - perMonth / monthly) * 100)
  return { ...p, perMonth, saving: saving > 0 ? saving : 0 }
})

export const DEFAULT_PLAN = '1y'
export const BEST_DEAL = '1y'

export const money = (n) => '$' + n.toFixed(2)

export function renewalDate(plan, from = new Date()) {
  const d = new Date(from)
  d.setDate(d.getDate() + plan.days)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
