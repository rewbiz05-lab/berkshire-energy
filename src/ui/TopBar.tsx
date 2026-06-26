'use client'
import { useEnergyStore } from '@/store/useEnergyStore'
import { useEffect, useState } from 'react'
import Link from 'next/link'

function BackToSite() {
  return (
    <Link
      href="/"
      className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] uppercase tracking-wider text-white/80 backdrop-blur hover:bg-white/10 hover:text-white"
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M11 18l-6-6 6-6" />
      </svg>
      Exit to site
    </Link>
  )
}

function fmtTime(t: number) {
  const total = t * 24 * 60
  const h = Math.floor(total / 60) % 24
  const m = Math.floor(total % 60)
  const am = h < 12
  const h12 = ((h + 11) % 12) + 1
  return `${h12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${am ? 'AM' : 'PM'}`
}

type FsDoc = Document & {
  webkitFullscreenElement?: Element | null
  webkitExitFullscreen?: () => Promise<void> | void
  mozCancelFullScreen?: () => Promise<void> | void
  msExitFullscreen?: () => Promise<void> | void
}
type FsEl = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void
  mozRequestFullScreen?: () => Promise<void> | void
  msRequestFullscreen?: () => Promise<void> | void
}

function getFullscreenElement(): Element | null {
  if (typeof document === 'undefined') return null
  const d = document as FsDoc
  return document.fullscreenElement ?? d.webkitFullscreenElement ?? null
}

// Synchronous so the click event chain stays a user gesture (required by browsers).
function toggleBrowserFullscreen() {
  if (typeof document === 'undefined') return
  const el = document.documentElement as FsEl
  const d = document as FsDoc
  try {
    if (!getFullscreenElement()) {
      const req =
        el.requestFullscreen ??
        el.webkitRequestFullscreen ??
        el.mozRequestFullScreen ??
        el.msRequestFullscreen
      if (req) Promise.resolve(req.call(el)).catch(() => {})
    } else {
      const exit =
        document.exitFullscreen ??
        d.webkitExitFullscreen ??
        d.mozCancelFullScreen ??
        d.msExitFullscreen
      if (exit) Promise.resolve(exit.call(document)).catch(() => {})
    }
  } catch {
    // iframe / permissions block — focus mode is still applied as a fallback
  }
}

export function TopBar() {
  const introDone = useEnergyStore((s) => s.introDone)
  const autoTime = useEnergyStore((s) => s.autoTime)
  const setAutoTime = useEnergyStore((s) => s.setAutoTime)
  const setTime = useEnergyStore((s) => s.setTime)
  const setHotspot = useEnergyStore((s) => s.setHotspot)
  const setIntroDone = useEnergyStore((s) => s.setIntroDone)
  const focusMode = useEnergyStore((s) => s.focusMode)
  const setFocusMode = useEnergyStore((s) => s.setFocusMode)
  const [t, setT] = useState(useEnergyStore.getState().timeOfDay)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => useEnergyStore.subscribe((s) => setT(s.timeOfDay)), [])

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!getFullscreenElement())
    document.addEventListener('fullscreenchange', onChange)
    document.addEventListener('webkitfullscreenchange', onChange)
    return () => {
      document.removeEventListener('fullscreenchange', onChange)
      document.removeEventListener('webkitfullscreenchange', onChange)
    }
  }, [])

  const handleToggle = () => {
    // Trigger native fullscreen FIRST, synchronously, so the click counts
    // as a user gesture in Safari/Chrome/Firefox. Focus mode follows for
    // contexts where the API is blocked (e.g. iframe preview).
    toggleBrowserFullscreen()
    setFocusMode(!focusMode)
  }

  const expanded = isFullscreen || focusMode

  if (!introDone) {
    return (
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between px-6 pt-5">
        <BackToSite />
        <button
          onPointerDown={handleToggle}
          className="pointer-events-auto glass flex h-9 w-9 items-center justify-center"
          aria-label={expanded ? 'Exit fullscreen' : 'Enter fullscreen'}
          title={expanded ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          <FullscreenIcon active={expanded} />
        </button>
      </div>
    )
  }

  if (focusMode) {
    return (
      <div className="pointer-events-none absolute right-6 top-5 z-30">
        <button
          onPointerDown={handleToggle}
          className="pointer-events-auto glass flex h-9 w-9 items-center justify-center"
          aria-label="Exit fullscreen"
          title="Exit fullscreen"
        >
          <FullscreenIcon active />
        </button>
      </div>
    )
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between px-6 pt-5">
      <div className="pointer-events-auto flex items-center gap-3">
        <BackToSite />
        <button
          onClick={() => {
            setHotspot(null)
            setIntroDone(false)
          }}
          className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] uppercase tracking-wider text-white/80 backdrop-blur hover:bg-white/10"
        >
          ← Intro
        </button>
        <div className="hidden text-[11px] uppercase tracking-[0.22em] text-white/55 sm:block">Berkshire Energy</div>
      </div>

      <div className="pointer-events-auto flex items-center gap-3">
        <div className="glass flex items-center gap-3 px-4 py-2">
          <span className="time-chip text-xs text-white/70">{fmtTime(t)}</span>
          <span className="h-3 w-px bg-white/15" />
          <button
            onClick={() => setAutoTime(!autoTime)}
            className="text-[10px] uppercase tracking-wider text-cyan-300/85 hover:text-cyan-200"
          >
            {autoTime ? 'Pause' : 'Play'}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.005}
            value={t}
            onChange={(e) => {
              setAutoTime(false)
              setTime(+e.target.value)
            }}
            className="energy-slider"
            style={{ width: 160, ['--fill' as string]: `${t * 100}%` }}
            aria-label="Time of day"
          />
        </div>

        <button
          onPointerDown={handleToggle}
          className="glass flex h-9 w-9 items-center justify-center transition-transform hover:-translate-y-0.5"
          aria-label={expanded ? 'Exit fullscreen' : 'Enter fullscreen'}
          title={expanded ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          <FullscreenIcon active={expanded} />
        </button>
      </div>
    </div>
  )
}

function FullscreenIcon({ active }: { active: boolean }) {
  if (active) {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-300">
        <path d="M9 3v6H3" />
        <path d="M15 3v6h6" />
        <path d="M9 21v-6H3" />
        <path d="M15 21v-6h6" />
      </svg>
    )
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/75">
      <path d="M3 9V3h6" />
      <path d="M21 9V3h-6" />
      <path d="M3 15v6h6" />
      <path d="M21 15v6h-6" />
    </svg>
  )
}
