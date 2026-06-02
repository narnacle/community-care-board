import { useState } from 'react'
import { CATEGORIES } from '../constants'

const emptyForm = {
  type: 'NEED',
  category: 'Food',
  title: '',
  description: '',
  contact_info: '',
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

function isValidPhone(value) {
  const trimmed = value.trim()
  const digits = trimmed.replace(/\D/g, '')
  return digits.length >= 10 && /^[\d\s+().-]+$/.test(trimmed)
}

function isValidContactInfo(value) {
  return isValidEmail(value) || isValidPhone(value)
}

function validateForm(form) {
  const errors = {}

  if (form.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters.'
  }

  if (!isValidContactInfo(form.contact_info)) {
    errors.contact_info = 'Enter a valid email address or phone number.'
  }

  return errors
}

export default function PostForm({ isOpen, onClose, onSubmit, isSubmitting }) {
  const [form, setForm] = useState(emptyForm)
  const [agreedToGuidelines, setAgreedToGuidelines] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})

  if (!isOpen) return null

  function resetForm() {
    setForm(emptyForm)
    setAgreedToGuidelines(false)
    setFieldErrors({})
  }

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setFieldErrors((prev) => {
      if (!prev[name]) return prev
      const next = { ...prev }
      delete next[name]
      return next
    })
  }

  function handleSubmit(event) {
    event.preventDefault()
    const errors = validateForm(form)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    onSubmit(form, resetForm)
  }

  function handleClose() {
    resetForm()
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      onClick={handleClose}
      role="presentation"
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="post-form-title"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 id="post-form-title" className="text-xl font-bold text-slate-900">
              New post
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Share a need or offer with your neighbors.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg px-2 py-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close form"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Type</label>
            <div className="grid grid-cols-2 gap-2">
              {['NEED', 'OFFER'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, type }))}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    form.type === type
                      ? type === 'NEED'
                        ? 'bg-rose-600 text-white'
                        : 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {type === 'NEED' ? 'Need' : 'Offer'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="category" className="mb-1 block text-sm font-medium text-slate-700">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              required
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="title" className="mb-1 block text-sm font-medium text-slate-700">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="Short summary"
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="mb-1 block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="What do you need or what can you offer?"
              className={`w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                fieldErrors.description
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20'
              }`}
              required
            />
            {fieldErrors.description && (
              <p className="mt-1 text-sm text-rose-600">{fieldErrors.description}</p>
            )}
          </div>

          <div>
            <label htmlFor="contact_info" className="mb-1 block text-sm font-medium text-slate-700">
              Contact info
            </label>
            <input
              id="contact_info"
              name="contact_info"
              type="text"
              value={form.contact_info}
              onChange={handleChange}
              placeholder="you@email.com or (555) 123-4567"
              className={`w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                fieldErrors.contact_info
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20'
              }`}
              required
            />
            {fieldErrors.contact_info && (
              <p className="mt-1 text-sm text-rose-600">{fieldErrors.contact_info}</p>
            )}
          </div>

          <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
            <input
              type="checkbox"
              checked={agreedToGuidelines}
              onChange={(event) => setAgreedToGuidelines(event.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              required
            />
            <span className="text-sm text-slate-700">I agree to public safety guidelines</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !agreedToGuidelines}
              className="flex-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Posting…' : 'Submit post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
