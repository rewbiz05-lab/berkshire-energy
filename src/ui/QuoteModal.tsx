'use client'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useEnergyStore } from '@/store/useEnergyStore'
import { computeSavings } from '@/lib/solarMath'

type Props = {
  open: boolean
  onClose: () => void
}

const SYSTEM_LABEL: Record<string, string> = {
  'solar+battery': 'Solar + Battery',
  solar: 'Solar',
  battery: 'Battery',
}

export function QuoteModal({ open, onClose }: Props) {
  const systemType = useEnergyStore((s) => s.systemType)
  const bill = useEnergyStore((s) => s.monthlyBill)
  const offset = useEnergyStore((s) => s.solarOffset)
  const [stage, setStage] = useState<'form' | 'submitting' | 'done'>('form')
  const [mounted, setMounted] = useState(false)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    window: 'Anytime',
  })

  // Portal target only exists in the browser
  useEffect(() => setMounted(true), [])

  // Reset to form view whenever the modal re-opens
  useEffect(() => {
    if (open) setStage('form')
  }, [open])

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  // Allow Esc to close
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open || !mounted) return null

  const summary = computeSavings(bill, systemType, offset)
  const valid =
    form.name.trim() && form.phone.trim() && form.email.trim() && form.address.trim()

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!valid) return
    setStage('submitting')
    // Simulated submission — in production this would POST to the CRM/API
    setTimeout(() => setStage('done'), 800)
  }

  const ui = (
    <div className="fixed inset-0 z-[100] flex items-stretch justify-center sm:items-center sm:px-4 sm:py-8">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
        aria-hidden
      />

      {/* Sheet on mobile (full height), centered card on desktop */}
      <div className="savings-glass relative flex h-full w-full flex-col overflow-hidden rounded-none sm:h-auto sm:max-h-full sm:max-w-lg sm:rounded-2xl">
        {stage !== 'done' ? (
          <form onSubmit={submit} className="flex h-full min-h-0 flex-col sm:max-h-[88vh]">
            {/* Sticky header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 pt-[max(1rem,env(safe-area-inset-top))] pb-3">
              <div className="text-[11px] uppercase tracking-[0.22em] text-white/55">
                Request a quote
              </div>
              <button
                type="button"
                onClick={onClose}
                className="-mr-2 grid h-9 w-9 place-items-center rounded-full text-xl text-white/55 hover:bg-white/10 hover:text-white"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Scrollable body */}
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
              <h2 className="text-2xl font-semibold">Talk to an energy advisor.</h2>
              <p className="mt-1 text-sm text-white/65">
                We&apos;ll review your selections and reach out to schedule a 15-minute call.
              </p>

              <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-[12px] leading-relaxed">
                <div className="flex justify-between">
                  <span className="text-white/55">System</span>
                  <span className="font-medium">{SYSTEM_LABEL[systemType]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/55">Bill</span>
                  <span className="font-medium tabular-nums">${bill}/mo</span>
                </div>
                {systemType !== 'battery' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-white/55">Solar offset</span>
                      <span className="font-medium tabular-nums">
                        {Math.round(offset * 100)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/55">System size</span>
                      <span className="font-medium tabular-nums">
                        {summary.systemKw} kW · {summary.panels} panels
                      </span>
                    </div>
                  </>
                )}
                <div className="flex justify-between">
                  <span className="text-white/55">New utility bill</span>
                  <span className="font-medium tabular-nums">${summary.leftoverBill}/mo</span>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <Field
                  label="Full name"
                  value={form.name}
                  onChange={(v) => setForm({ ...form, name: v })}
                  placeholder="Jane Doe"
                  required
                />
                <Field
                  label="Phone number"
                  value={form.phone}
                  onChange={(v) => setForm({ ...form, phone: v })}
                  type="tel"
                  placeholder="(555) 555-5555"
                  required
                />
                <Field
                  label="Email"
                  value={form.email}
                  onChange={(v) => setForm({ ...form, email: v })}
                  type="email"
                  placeholder="jane@email.com"
                  required
                />
                <Field
                  label="Service address"
                  value={form.address}
                  onChange={(v) => setForm({ ...form, address: v })}
                  placeholder="123 Maple St, Springfield"
                  required
                />
                <div>
                  <div className="mb-1 text-[11px] uppercase tracking-wider text-white/55">
                    Best time to reach you
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['Mornings', 'Afternoons', 'Evenings', 'Anytime'].map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => setForm({ ...form, window: opt })}
                        className={`rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-wider transition-colors ${
                          form.window === opt
                            ? 'border-cyan-400/50 bg-cyan-400/10 text-cyan-200'
                            : 'border-white/15 bg-white/[0.04] text-white/70 hover:bg-white/10'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky footer — always reachable */}
            <div className="border-t border-white/10 bg-black/20 px-6 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <button
                type="submit"
                disabled={!valid || stage === 'submitting'}
                className="cta-btn w-full text-sm disabled:opacity-50"
              >
                {stage === 'submitting' ? 'Sending…' : 'Submit request →'}
              </button>
            </div>
          </form>
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-6 py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-400/15 text-cyan-300 ring-1 ring-cyan-400/40">
              <CheckIcon />
            </div>
            <h2 className="mt-3 text-2xl font-semibold">You&apos;re all set.</h2>
            <p className="mt-1 max-w-sm text-sm text-white/65">
              An energy advisor will reach out to <span className="text-white">{form.email}</span>{' '}
              within 24 hours to schedule a call ({form.window.toLowerCase()}).
            </p>
            <button onClick={onClose} className="cta-btn mt-5 w-full max-w-xs text-sm">
              Back to my home
            </button>
          </div>
        )}
      </div>
    </div>
  )

  return createPortal(ui, document.body)
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  required?: boolean
}) {
  return (
    <label className="block">
      <div className="mb-1 text-[11px] uppercase tracking-wider text-white/55">{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-cyan-400/40 focus:bg-white/[0.08]"
      />
    </label>
  )
}

function CheckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}
