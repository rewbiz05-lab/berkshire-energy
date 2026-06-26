'use client'

import { useState } from 'react'
import { IconCheck } from './icons'

type Status = 'idle' | 'submitting' | 'done' | 'error'

export function QuoteForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    setError('')
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.error || 'Something went wrong')
      setStatus('done')
      form.reset()
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  if (status === 'done') {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-[var(--line)] bg-white px-6 py-12 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-[#eafbef] text-[#1a9f4b]">
          <IconCheck className="h-7 w-7" />
        </div>
        <h3 className="text-xl font-bold">Request received</h3>
        <p className="max-w-sm text-[var(--ink-soft)]">
          A Berkshire Energy advisor will reach out within one business day with your custom solar &amp; storage design.
        </p>
        <button className="btn btn-ghost mt-1" onClick={() => setStatus('idle')}>
          Submit another
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3.5">
      <div className="grid gap-3.5 sm:grid-cols-2">
        <label className="grid gap-1.5">
          <span className="text-sm font-medium text-[var(--ink-soft)]">Full name</span>
          <input name="name" required placeholder="Jane Homeowner" className="field" autoComplete="name" />
        </label>
        <label className="grid gap-1.5">
          <span className="text-sm font-medium text-[var(--ink-soft)]">Phone</span>
          <input name="phone" required type="tel" placeholder="(602) 555-0142" className="field" autoComplete="tel" />
        </label>
      </div>
      <label className="grid gap-1.5">
        <span className="text-sm font-medium text-[var(--ink-soft)]">Email</span>
        <input name="email" required type="email" placeholder="jane@email.com" className="field" autoComplete="email" />
      </label>
      <label className="grid gap-1.5">
        <span className="text-sm font-medium text-[var(--ink-soft)]">Home address</span>
        <input name="address" required placeholder="123 Desert Bloom Dr, Phoenix, AZ" className="field" autoComplete="street-address" />
      </label>
      <label className="grid gap-1.5">
        <span className="text-sm font-medium text-[var(--ink-soft)]">Average monthly electric bill</span>
        <select name="bill" className="field" defaultValue="">
          <option value="" disabled>Select a range</option>
          <option>Under $100</option>
          <option>$100 – $200</option>
          <option>$200 – $350</option>
          <option>$350+</option>
        </select>
      </label>
      <label className="grid gap-1.5">
        <span className="text-sm font-medium text-[var(--ink-soft)]">
          Additional notes <span className="font-normal text-[var(--ink-soft)]/70">(optional)</span>
        </span>
        <textarea
          name="notes"
          rows={3}
          placeholder="Anything we should know? Roof type, shade, a competing quote to beat, best time to reach you…"
          className="field"
          style={{ height: 'auto', minHeight: 96, paddingTop: 12, paddingBottom: 12, resize: 'vertical' }}
        />
      </label>

      <button type="submit" disabled={status === 'submitting'} className="btn btn-solar mt-1 w-full disabled:opacity-60">
        {status === 'submitting' ? 'Sending…' : 'Get my free quote'}
      </button>

      {status === 'error' && <p className="text-sm text-red-600">{error}</p>}
      <p className="text-center text-xs text-[var(--ink-soft)]">
        No spam. No pressure. Just a clear look at what solar saves you.
      </p>
    </form>
  )
}
