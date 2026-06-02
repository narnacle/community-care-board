import { CATEGORIES } from '../constants'

export default function FilterBar({ activeCategory, onCategoryChange }) {
  const filters = ['All', ...CATEGORIES]

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((category) => {
        const isActive = activeCategory === category
        return (
          <button
            key={category}
            type="button"
            onClick={() => onCategoryChange(category)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
              isActive
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50'
            }`}
          >
            {category}
          </button>
        )
      })}
    </div>
  )
}
