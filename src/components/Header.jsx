export default function Header({ onOpenForm }) {
  return (
    <header className="border-b border-emerald-100 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-emerald-600">
            Hyper-local mutual aid
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Community Care Board
          </h1>
          <p className="mt-2 max-w-xl text-slate-600">
            A neighborhood board where neighbors can ask for help or offer resources
            — food, tools, rides, and care — without needing an account.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenForm}
          className="inline-flex shrink-0 items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          + Post a Need or Offer
        </button>
      </div>
    </header>
  )
}
