'use client'

import { useEffect, useState } from 'react'
import { Logo } from './Logo'

const LINKS = [
  { href: '#how', label: 'How it works' },
  { href: '#beat', label: 'Have a quote?' },
  { href: '#savings', label: 'Savings' },
  { href: '#battery', label: 'Battery' },
  { href: '#financing', label: 'Financing' },
]

// Real sections (excludes the #top wrapper, which spans the whole page) used
// to light up the matching nav link. Observed with IntersectionObserver so we
// never read layout on the scroll thread.
const SECTION_IDS = ['how', 'beat', 'savings', 'battery', 'financing', 'reviews', 'quote']

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('top')
  const [progress, setProgress] = useState(0)
  // Prefer the browser's compositor-driven scroll timeline (smooth on mobile).
  // Default true so SSR markup matches; flipped off only if unsupported.
  const [cssTimeline, setCssTimeline] = useState(true)

  // One-time feature detect for CSS scroll-driven animations.
  useEffect(() => {
    setCssTimeline(
      typeof CSS !== 'undefined' && !!CSS.supports && CSS.supports('animation-timeline', 'scroll()'),
    )
  }, [])

  // Lightweight scrolled flag. setState bails out when the value is unchanged,
  // so this does NOT re-render on every frame — only at the threshold crossing.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Active section via IntersectionObserver — fires only when a section crosses
  // a thin band in the viewport center. No per-frame getBoundingClientRect.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        setActive((prev) => {
          let next = prev
          for (const e of entries) if (e.isIntersecting) next = (e.target as HTMLElement).id
          return next
        })
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )
    for (const id of SECTION_IDS) {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    }
    return () => io.disconnect()
  }, [])

  // JS progress fallback — only runs when CSS scroll timelines are unsupported.
  useEffect(() => {
    if (cssTimeline) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const doc = document.documentElement
        const max = doc.scrollHeight - doc.clientHeight
        setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [cssTimeline])

  return (
    <>
      {/* Scroll-progress rail — its own fixed/composited layer ABOVE the header
          so the header's backdrop-blur repaints don't make it stutter on mobile.
          Constant track color avoids flicker during iOS overscroll bounce. */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]"
        aria-hidden
        style={{ background: 'rgba(255,138,30,0.15)' }}
      >
        <div
          className={`h-full w-full origin-left ${cssTimeline ? 'nav-progress-fill' : ''}`}
          style={{
            background: 'linear-gradient(90deg, var(--solar), var(--solar-2))',
            boxShadow: '0 0 8px rgba(255,138,30,0.6)',
            willChange: 'transform',
            ...(cssTimeline
              ? null
              : { transform: `scaleX(${progress})`, transition: 'transform 0.1s linear' }),
          }}
        />
      </div>

      <header
        className="fixed inset-x-0 top-0 z-50 transition-colors duration-300"
        style={{
          background: scrolled ? 'rgba(255,255,255,0.82)' : 'transparent',
          backdropFilter: scrolled ? 'saturate(1.4) blur(14px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'saturate(1.4) blur(14px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--line)' : '1px solid transparent',
        }}
      >
        <nav className="mkt-container flex h-[72px] items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5" aria-label="Berkshire Energy home">
          <Logo className="h-7 w-7" tone={scrolled ? 'ink' : 'light'} />
          <span
            className="text-[15px] font-bold tracking-[0.14em]"
            style={{ color: scrolled ? 'var(--ink)' : '#fff' }}
          >
            BERKSHIRE ENERGY
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => {
            const isActive = active === l.href.slice(1)
            return (
              <a
                key={l.href}
                href={l.href}
                aria-current={isActive ? 'true' : undefined}
                className="relative text-sm font-medium transition-opacity hover:opacity-70"
                style={{
                  color: isActive
                    ? scrolled
                      ? 'var(--ink)'
                      : '#fff'
                    : scrolled
                      ? 'var(--ink-soft)'
                      : 'rgba(255,255,255,0.82)',
                }}
              >
                {l.label}
                <span
                  className="absolute -bottom-1.5 left-0 h-[2px] w-full origin-left rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, var(--solar), var(--solar-2))',
                    transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                    transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1)',
                  }}
                />
              </a>
            )
          })}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="tel:+16233962112"
            className="text-sm font-semibold transition-opacity hover:opacity-70"
            style={{ color: scrolled ? 'var(--ink)' : '#fff' }}
          >
            (623) 396-2112
          </a>
          <a href="#quote" className="btn btn-solar h-11 px-5 text-sm">
            Free quote
          </a>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-lg md:hidden"
          style={{ color: scrolled ? 'var(--ink)' : '#fff' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <><path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" /></>}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-[var(--line)] bg-white/95 backdrop-blur md:hidden">
          <div className="mkt-container flex flex-col gap-1 py-4">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-3 text-base font-medium text-[var(--ink)] hover:bg-[var(--paper-2)]"
              >
                {l.label}
              </a>
            ))}
            <a href="#quote" onClick={() => setOpen(false)} className="btn btn-solar mt-2 w-full">
              Get my free quote
            </a>
          </div>
        </div>
      )}
      </header>
    </>
  )
}
