import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from './lib/supabase'
import Header from './components/Header'
import FilterBar from './components/FilterBar'
import PostCard from './components/PostCard'
import PostForm from './components/PostForm'

export default function App() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('NEED')
  const [activeCategory, setActiveCategory] = useState('All')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchPosts = useCallback(async () => {
    setError(null)
    const { data, error: fetchError } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) {
      setError(fetchError.message)
      return
    }

    setPosts(data ?? [])
  }, [])

  useEffect(() => {
    async function loadPosts() {
      setLoading(true)
      await fetchPosts()
      setLoading(false)
    }

    loadPosts()
  }, [fetchPosts])

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesTab = post.type === activeTab
      const matchesCategory =
        activeCategory === 'All' || post.category === activeCategory
      return matchesTab && matchesCategory
    })
  }, [posts, activeTab, activeCategory])

  async function handleSubmit(form, resetForm) {
    setIsSubmitting(true)
    setError(null)

    const { error: insertError } = await supabase.from('posts').insert([
      {
        type: form.type,
        category: form.category,
        title: form.title.trim(),
        description: form.description.trim(),
        contact_info: form.contact_info.trim(),
        status: 'OPEN',
      },
    ])

    setIsSubmitting(false)

    if (insertError) {
      setError(insertError.message)
      return
    }

    resetForm()
    setIsFormOpen(false)
    setActiveTab(form.type)
    await fetchPosts()
  }

  async function handleClaim(post) {
    const confirmed = window.confirm(
      `Claim "${post.title}"?\n\nThis will mark the post as being handled so others know help is on the way.`
    )

    if (!confirmed) return

    setError(null)

    const { error: updateError } = await supabase
      .from('posts')
      .update({ status: 'CLAIMED' })
      .eq('id', post.id)
      .eq('status', 'OPEN')

    if (updateError) {
      setError(updateError.message)
      return
    }

    await fetchPosts()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-50 text-slate-900">
      <Header onOpenForm={() => setIsFormOpen(true)} />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <FilterBar
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          <div className="inline-flex rounded-xl bg-white p-1 shadow-sm ring-1 ring-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('NEED')}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                activeTab === 'NEED'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Needs
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('OFFER')}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                activeTab === 'OFFER'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Offers
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-center text-slate-500">Loading community posts…</p>
        ) : filteredPosts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 px-6 py-16 text-center">
            <p className="text-lg font-medium text-slate-800">
              No {activeTab === 'NEED' ? 'needs' : 'offers'} yet
              {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}.
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Be the first to post and help your neighbors connect.
            </p>
            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="mt-6 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Create a post
            </button>
          </div>
        ) : (
          <section
            aria-label={activeTab === 'NEED' ? 'Community needs' : 'Community offers'}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} onClaim={handleClaim} />
            ))}
          </section>
        )}
      </main>

      <PostForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
