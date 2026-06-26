'use client'
import { useEnergyStore } from '@/store/useEnergyStore'
import { useEffect, useState } from 'react'

export function PerspectiveBar() {
  const introDone = useEnergyStore((s) => s.introDone)
  const focusMode = useEnergyStore((s) => s.focusMode)
  const quoteOpen = useEnergyStore((s) => s.quoteOpen)
  const setCameraAzimuth = useEnergyStore((s) => s.setCameraAzimuth)
  const [az, setAz] = useState(useEnergyStore.getState().cameraAzimuth)

  useEffect(
    () => useEnergyStore.subscribe((s) => setAz(s.cameraAzimuth)),
    []
  )

  if (!introDone || focusMode || quoteOpen) return null

  const fillPct = az * 100

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-6 z-30 flex justify-center">
      <div className="pointer-events-auto glass flex items-center gap-4 px-5 py-3">
        <CompassIcon />
        <div className="flex flex-col leading-tight">
          <span className="text-[10px] uppercase tracking-[0.22em] text-white/55">
            Perspective
          </span>
          <span className="text-xs tabular-nums text-white/75">{labelFor(az)}</span>
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.005}
          value={az}
          onChange={(e) => setCameraAzimuth(+e.target.value)}
          className="energy-slider"
          style={{ width: 320, ['--fill' as string]: `${fillPct}%` }}
          aria-label="Camera perspective"
        />
      </div>
    </div>
  )
}

function labelFor(az: number) {
  // 0/1 → south (front of house), 0.25 → west, 0.5 → north (back), 0.75 → east
  const deg = Math.round(az * 360) % 360
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  // Tesla-style cardinal mapping (camera facing the target)
  const idx = Math.round(deg / 45) % 8
  return `${dirs[idx]} · ${deg}°`
}

function CompassIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan-300/85">
      <circle cx="12" cy="12" r="9" />
      <path d="M16.5 7.5l-3 6-6 3 3-6 6-3z" />
    </svg>
  )
}
