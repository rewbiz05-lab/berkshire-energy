'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { IconCheck, IconPhone } from './icons'

const PHONE = '+16233962112'
const PHONE_LABEL = '(623) 396-2112'
const EMAIL = 'hello@berkshireenergy.info'

type Status = 'idle' | 'sending' | 'sent' | 'error'

export function SupportChat() {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  useEffect(() => setMounted(true), [])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    setError('')
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.error || 'Something went wrong')
      setStatus('sent')
      form.reset()
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  if (!mounted) return null

  const ui = (
    <>
      {/* Chat panel */}
      <div
        className="fixed bottom-[5.25rem] right-3 z-[80] w-[min(360px,calc(100vw-1.5rem))] origin-bottom-right sm:bottom-[5.75rem] sm:right-6"
        style={{
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.96)',
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity .28s cubic-bezier(0.22,1,0.36,1), transform .28s cubic-bezier(0.22,1,0.36,1)',
        }}
        role="dialog"
        aria-label="Support chat"
        aria-hidden={!open}
      >
        <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-3 bg-[var(--brand)] px-4 py-3.5 text-white">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-white/15">
              <IconPhone className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-bold">Berkshire Energy</div>
              <div className="flex items-center gap-1.5 text-xs text-white/70">
                <span className="h-2 w-2 rounded-full bg-[#43d17a]" /> Typically replies within an hour
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="ml-auto grid h-8 w-8 place-items-center rounded-lg text-white/80 hover:bg-white/10 hover:text-white"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="px-4 py-4">
            {status === 'sent' ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-[#eafbef] text-[#1a9f4b]">
                  <IconCheck className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold text-[var(--ink)]">Message sent!</p>
                <p className="max-w-[15rem] text-xs text-[var(--ink-soft)]">
                  Thanks for reaching out — a Berkshire Energy advisor will get back to you shortly.
                </p>
                <button className="btn btn-ghost mt-1 h-9 px-4 text-sm" onClick={() => setStatus('idle')}>
                  Send another
                </button>
              </div>
            ) : (
              <>
                <div className="rounded-2xl rounded-tl-sm bg-[var(--paper-2)] px-3.5 py-2.5 text-sm text-[var(--ink)]">
                  Hi there! 👋 Questions about going solar, your bill, or a quote? Send us a note and we’ll reply by
                  text or email.
                </div>

                {/* Quick actions */}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <a href={`tel:${PHONE}`} className="btn btn-ghost h-9 justify-center px-3 text-sm">
                    Call us
                  </a>
                  <a
                    href="#quote"
                    onClick={() => setOpen(false)}
                    className="btn btn-solar h-9 justify-center px-3 text-sm"
                  >
                    Free quote
                  </a>
                </div>

                {/* Message composer */}
                <form onSubmit={onSubmit} className="mt-3 grid gap-2">
                  <input
                    name="contact"
                    required
                    placeholder="Your phone or email"
                    className="field h-10"
                    autoComplete="email"
                  />
                  <textarea
                    name="message"
                    required
                    rows={3}
                    placeholder="How can we help?"
                    className="field"
                    style={{ minHeight: 76, paddingTop: 8, paddingBottom: 8, resize: 'none' }}
                  />
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="btn btn-solar h-10 w-full text-sm disabled:opacity-60"
                  >
                    {status === 'sending' ? 'Sending…' : 'Send message'}
                  </button>
                  {status === 'error' && <p className="text-xs text-red-600">{error}</p>}
                  <p className="text-center text-[11px] text-[var(--ink-soft)]">
                    Prefer email?{' '}
                    <a href={`mailto:${EMAIL}`} className="font-medium text-[var(--ink)] underline">
                      {EMAIL}
                    </a>
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Launcher bubble */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close support chat' : 'Open support chat'}
        aria-expanded={open}
        className="fixed bottom-5 right-4 z-[80] grid h-14 w-14 place-items-center rounded-full text-white shadow-2xl sm:bottom-6 sm:right-6"
        style={{
          background: 'linear-gradient(180deg, var(--solar-2) 0%, var(--solar) 100%)',
          transition: 'transform .2s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        <span
          style={{
            display: 'grid',
            placeItems: 'center',
            transition: 'transform .25s cubic-bezier(0.22,1,0.36,1), opacity .2s',
          }}
        >
          {open ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 9.7 9.7 0 0 1-4-.85L3 20l1.35-4.5A8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5Z" />
              <path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01" />
            </svg>
          )}
        </span>
      </button>
    </>
  )

  return createPortal(ui, document.body)
}
