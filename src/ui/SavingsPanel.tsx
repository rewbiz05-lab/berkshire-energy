'use client'
import { useEnergyStore } from '@/store/useEnergyStore'
import { computeSavings } from '@/lib/solarMath'
import { useCallback, useEffect, useRef, useState } from 'react'
import { QuoteModal } from './QuoteModal'

function useAnimatedNumber(target: number, duration = 600) {
  const [v, setV] = useState(target)
  const fromRef = useRef(target)
  useEffect(() => {
    const from = fromRef.current
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const e = 1 - Math.pow(1 - t, 3)
      setV(Math.round(from + (target - from) * e))
      if (t < 1) raf = requestAnimationFrame(tick)
      else fromRef.current = target
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return v
}

export function SavingsPanel() {
  const introDone = useEnergyStore((s) => s.introDone)
  const focusMode = useEnergyStore((s) => s.focusMode)
  const bill = useEnergyStore((s) => s.monthlyBill)
  const setBill = useEnergyStore((s) => s.setBill)
  const systemType = useEnergyStore((s) => s.systemType)
  const solarOffset = useEnergyStore((s) => s.solarOffset)
  const setSolarOffset = useEnergyStore((s) => s.setSolarOffset)
  const savedConfig = useEnergyStore((s) => s.savedConfig)
  const saveConfig = useEnergyStore((s) => s.saveConfig)
  const resetConfig = useEnergyStore((s) => s.resetConfig)
  const [open, setOpen] = useState(false)
  const [savedFlash, setSavedFlash] = useState(false)
  const quoteOpen = useEnergyStore((s) => s.quoteOpen)
  const setQuoteOpen = useEnergyStore((s) => s.setQuoteOpen)

  const onSave = () => {
    saveConfig()
    setSavedFlash(true)
    setTimeout(() => setSavedFlash(false), 1600)
  }
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null) // null = use default
  const draggingRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null)

  // Default placement: top-right under the time bar
  useEffect(() => {
    if (pos === null && typeof window !== 'undefined') {
      setPos({ x: window.innerWidth - 380 - 24, y: 76 })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!pos) return
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    draggingRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: pos.x,
      origY: pos.y,
    }
  }, [pos])

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const d = draggingRef.current
    if (!d) return
    const nx = d.origX + (e.clientX - d.startX)
    const ny = d.origY + (e.clientY - d.startY)
    // Clamp to viewport so the drag handle is always reachable
    const maxX = window.innerWidth - 80
    const maxY = window.innerHeight - 60
    setPos({
      x: Math.min(Math.max(0, nx), maxX),
      y: Math.min(Math.max(0, ny), maxY),
    })
  }, [])

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) {
      ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
    }
    draggingRef.current = null
  }, [])

  const {
    solarCovers,
    leftoverBill,
    twentyYear,
    co2TonsPerYear,
    panels,
    systemKw,
    connectionFee,
    buyBackCredit,
    batteryDemandCredit,
  } = computeSavings(bill, systemType, solarOffset)
  // Per-line solar-only credit (excludes battery/buyback so each row reads cleanly)
  const solarOnlyCovers = Math.max(0, solarCovers - buyBackCredit - batteryDemandCredit)
  const solarCoversAnim = useAnimatedNumber(solarOnlyCovers)
  const buyBackAnim = useAnimatedNumber(buyBackCredit)
  const batteryDemandAnim = useAnimatedNumber(batteryDemandCredit)
  const leftoverAnim = useAnimatedNumber(leftoverBill)
  const twentyLow = useAnimatedNumber(twentyYear)
  const twentyHigh = useAnimatedNumber(twentyYear + 10000)

  if (!introDone || focusMode || !pos) return null

  const fillPct = ((bill - 50) / (600 - 50)) * 100

  return (
    <div
      className="pointer-events-none fixed z-30"
      style={{ left: pos.x, top: pos.y, width: 380 }}
    >
      {/* Trigger pill / drag handle — always visible at top of stack */}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="pointer-events-auto glass flex items-center gap-3 px-5 py-3 select-none"
        style={{ touchAction: 'none', cursor: draggingRef.current ? 'grabbing' : 'grab' }}
        aria-label="Drag to move savings panel"
      >
        <span className="flex h-6 w-6 items-center justify-center text-white/45" aria-hidden>
          <GripIcon />
        </span>
        <span className="text-left leading-tight">
          <span className="block text-[10px] uppercase tracking-[0.18em] text-white/55">
            New bill
          </span>
          <span className="block text-lg font-semibold tabular-nums text-white">
            ${leftoverAnim}
            <span className="text-xs font-normal text-white/55">/mo</span>
          </span>
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation()
            setOpen((v) => !v)
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-white/8 text-white/75 hover:bg-white/15"
          aria-expanded={open}
          aria-label={open ? 'Collapse savings' : 'Expand savings'}
        >
          <Chevron open={open} />
        </button>
      </div>

      {/* Pop-DOWN panel hangs below the handle */}
      <div
        className={`pointer-events-auto mt-2 origin-top transition-all duration-300 ${
          open
            ? 'translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none -translate-y-2 scale-[0.96] opacity-0'
        }`}
        aria-hidden={!open}
      >
        <div className="savings-glass p-6">
          <div className="mb-1 flex items-center justify-between">
            <div className="text-[11px] uppercase tracking-[0.22em] text-white/55">Your savings</div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-cyan-300/80">
              {systemType === 'battery'
                ? 'Powerwall 3 · 13.5 kWh'
                : `${systemKw} kW · ${panels} panels`}
            </div>
          </div>
          {systemType === 'solar+battery' && (
            <div className="mb-1 text-[10px] uppercase tracking-[0.18em] text-cyan-300/60">
              + Powerwall 3 · 13.5 kWh · 11.5 kW peak
            </div>
          )}

          <div className="mb-4 text-xs text-white/50">Average electric bill</div>
          <div className="mb-1 flex items-baseline justify-between">
            <div className="text-2xl font-semibold tabular-nums">
              ${bill}
              <span className="text-sm text-white/45">/mo</span>
            </div>
            <div className="text-[11px] uppercase tracking-wider text-white/35">slide to set</div>
          </div>
          <input
            type="range"
            min={50}
            max={600}
            step={5}
            value={bill}
            onChange={(e) => setBill(+e.target.value)}
            onPointerDown={(e) => e.stopPropagation()}
            className="energy-slider mb-5"
            style={{ ['--fill' as string]: `${fillPct}%` }}
          />

          {/* Solar offset slider — hidden for battery-only since panels n/a */}
          {systemType !== 'battery' && (
            <>
              <div className="mb-1 flex items-baseline justify-between">
                <div className="text-[11px] uppercase tracking-wider text-white/55">
                  Solar offset
                </div>
                <div className="text-2xl font-semibold tabular-nums">
                  {Math.round(solarOffset * 100)}%
                </div>
              </div>
              <input
                type="range"
                min={0.3}
                max={1.3}
                step={0.01}
                value={solarOffset}
                onChange={(e) => setSolarOffset(+e.target.value)}
                onPointerDown={(e) => e.stopPropagation()}
                className="energy-slider mb-5"
                style={{ ['--fill' as string]: `${((solarOffset - 0.3) / 1.0) * 100}%` }}
                aria-label="Solar offset"
              />
            </>
          )}

          <div className="space-y-2">
            <Row
              label="Current monthly bill"
              value={`$${bill}`}
              tone="muted"
              strike
            />
            {systemType !== 'battery' && (
              <Row
                label="Solar covers (usage)"
                value={`−$${solarCoversAnim}`}
                tone="accent"
              />
            )}
            {systemType !== 'solar' && (
              <Row
                label="Powerwall covers (demand)"
                value={`−$${batteryDemandAnim}`}
                tone="accent"
              />
            )}
            {buyBackCredit > 0 && (
              <Row
                label="Net-metering credit"
                value={`−$${buyBackAnim}`}
                tone="accent"
              />
            )}
            <Row label="Connection fee" value={`+$${connectionFee}`} tone="muted" />
          </div>

          <div className="my-4 border-t border-white/10" />

          <div className="text-[10px] uppercase tracking-[0.22em] text-white/50">
            Leftover utility bill
          </div>
          <div className="gradient-cyan -mt-1 text-5xl font-bold leading-tight tabular-nums">
            ${leftoverAnim}
            <span className="ml-1 text-base font-normal text-white/45">/mo</span>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-white/70">
            <span>20-yr savings</span>
            <span className="tabular-nums text-white">
              ${twentyLow.toLocaleString()} – ${twentyHigh.toLocaleString()}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-white/70">
            <span>CO₂ offset</span>
            <span className="tabular-nums text-white">{co2TonsPerYear} tons/yr</span>
          </div>

          <div className="mt-5 flex items-center gap-2">
            <button
              onClick={onSave}
              className="flex-1 rounded-full border border-white/15 bg-white/[0.04] px-3 py-2 text-xs uppercase tracking-wider text-white/85 transition-colors hover:bg-white/[0.1]"
            >
              {savedFlash ? '✓ Saved' : savedConfig ? 'Update' : 'Save'}
            </button>
            <button
              onClick={() => {
                resetConfig()
                setSavedFlash(false)
              }}
              className="flex-1 rounded-full border border-white/15 bg-white/[0.02] px-3 py-2 text-xs uppercase tracking-wider text-white/65 transition-colors hover:bg-white/[0.08]"
            >
              Reset
            </button>
          </div>

          <button
            onClick={() => setQuoteOpen(true)}
            className="cta-btn mt-3 w-full text-sm"
          >
            Get my exact quote  →
          </button>

          {savedConfig && (
            <div className="mt-2 text-center text-[10px] uppercase tracking-wider text-cyan-300/70">
              Saved {timeAgo(savedConfig.savedAt)}
            </div>
          )}
        </div>
      </div>
      <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </div>
  )
}

function timeAgo(ts: number) {
  const sec = Math.max(1, Math.round((Date.now() - ts) / 1000))
  if (sec < 60) return `${sec}s ago`
  const min = Math.round(sec / 60)
  if (min < 60) return `${min}m ago`
  const hr = Math.round(min / 60)
  return `${hr}h ago`
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function GripIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <circle cx="8" cy="6" r="1.6" />
      <circle cx="8" cy="12" r="1.6" />
      <circle cx="8" cy="18" r="1.6" />
      <circle cx="16" cy="6" r="1.6" />
      <circle cx="16" cy="12" r="1.6" />
      <circle cx="16" cy="18" r="1.6" />
    </svg>
  )
}

function Row({
  label,
  value,
  tone = 'muted',
  strike = false,
}: {
  label: string
  value: string
  tone?: 'muted' | 'accent'
  strike?: boolean
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
      <span className="text-[11px] uppercase tracking-wider text-white/55">{label}</span>
      <span
        className={`text-base font-medium tabular-nums ${
          tone === 'accent' ? 'text-cyan-200' : 'text-white/85'
        } ${strike ? 'line-through decoration-red-400/60 text-white/55' : ''}`}
      >
        {value}
      </span>
    </div>
  )
}
