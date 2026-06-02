import { CATEGORY_COLORS, formatDate } from '../constants'

export default function PostCard({ post, onClaim }) {
  const isOpen = post.status === 'OPEN'
  const badgeClass = CATEGORY_COLORS[post.category] ?? 'bg-slate-100 text-slate-800 ring-slate-200'

  return (
    <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${badgeClass}`}>
          {post.category}
        </span>
        <span className="text-xs text-slate-500">{formatDate(post.created_at)}</span>
        {!isOpen && (
          <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 ring-inset">
            Claimed
          </span>
        )}
      </div>

      <h3 className="text-lg font-semibold text-slate-900">{post.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{post.description}</p>

      <div className="mt-4 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
        <span className="font-medium text-slate-900">Contact:</span>{' '}
        {post.contact_info}
      </div>

      {isOpen && (
        <button
          type="button"
          onClick={() => onClaim(post)}
          className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
        >
          Claim this Task
        </button>
      )}
    </article>
  )
}
