export const CATEGORIES = ['Food', 'Tools', 'Rides', 'Care']

export const CATEGORY_COLORS = {
  Food: 'bg-amber-100 text-amber-800 ring-amber-200',
  Tools: 'bg-slate-100 text-slate-800 ring-slate-200',
  Rides: 'bg-sky-100 text-sky-800 ring-sky-200',
  Care: 'bg-rose-100 text-rose-800 ring-rose-200',
}

export function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
