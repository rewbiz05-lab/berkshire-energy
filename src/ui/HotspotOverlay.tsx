'use client'
import { useEnergyStore, selectDayFactor, selectPanelCount } from '@/store/useEnergyStore'
import { instantSolarKw, todayKwh, batterySoc, batteryMode } from '@/lib/solarMath'
import { useEffect, useState } from 'react'

export function HotspotOverlay() {
  const active = useEnergyStore((s) => s.activeHotspot)
  const focusMode = useEnergyStore((s) => s.focusMode)
  const setHotspot = useEnergyStore((s) => s.setHotspot)
  const bill = useEnergyStore((s) => s.monthlyBill)
  const [tod, setTod] = useState(useEnergyStore.getState().timeOfDay)

  useEffect(() => {
    const unsub = useEnergyStore.subscribe((s) => setTod(s.timeOfDay))
    return unsub
  }, [])

  if (!active || focusMode) return null

  const panels = selectPanelCount(bill)
  const dayFactor = selectDayFactor(tod)
  const kW = instantSolarKw(panels, dayFactor)
  const kWhToday = todayKwh(panels)

  return (
    <div className="pointer-events-auto fade-up absolute left-6 top-24 z-30 w-[320px]">
      <div className="glass p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-[10px] uppercase tracking-[0.22em] text-cyan-300/80">{titleFor(active)}</div>
          <button
            onClick={() => setHotspot(null)}
            className="rounded-full border border-white/15 px-2 py-1 text-[10px] uppercase tracking-wider text-white/70 hover:bg-white/10"
          >
            ← Back
          </button>
        </div>

        {active === 'roof' && (
          <>
            <div className="text-2xl font-semibold leading-tight">Solar Roof</div>
            <p className="mt-1 text-sm text-white/65">{panels} high-efficiency panels sized to your bill.</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Stat label="Producing now" value={`${kW} kW`} accent />
              <Stat label="Today" value={`${kWhToday} kWh`} />
            </div>
            <FlowLine label="Net metering" value={dayFactor > 0.4 ? 'Exporting →' : 'Importing ←'} positive={dayFactor > 0.4} />
          </>
        )}

        {active === 'battery' && (
          <>
            <div className="text-2xl font-semibold leading-tight">Battery Storage</div>
            <p className="mt-1 text-sm text-white/65">Stores daytime solar to power your nights.</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Stat label="State of charge" value={`${Math.round(batterySoc(tod) * 100)}%`} accent />
              <Stat label="Mode" value={prettyMode(batteryMode(tod))} />
            </div>
            <FlowLine
              label="Power flow"
              value={
                batteryMode(tod) === 'charging'
                  ? 'Solar → Battery'
                  : batteryMode(tod) === 'discharging'
                  ? 'Battery → Home'
                  : 'Holding'
              }
              positive={batteryMode(tod) !== 'discharging'}
            />
          </>
        )}

        {active === 'panel' && (
          <>
            <div className="text-2xl font-semibold leading-tight">Electric Panel</div>
            <p className="mt-1 text-sm text-white/65">Smart routing across grid, solar, and battery.</p>
            <div className="mt-4 space-y-2">
              <Bar label="Solar" value={Math.round(dayFactor * 80)} color="#00e0ff" />
              <Bar label="Battery" value={Math.round((1 - dayFactor) * 60)} color="#ff9d3d" />
              <Bar label="Grid" value={dayFactor < 0.1 && 0.25 + 0.7 * Math.max(0, Math.sin((tod - 0.1) * Math.PI * 2)) < 0.1 ? 40 : 0} color="#9aa5b1" />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function titleFor(a: NonNullable<ReturnType<typeof useEnergyStore.getState>['activeHotspot']>) {
  if (a === 'roof') return 'Hotspot · Roof'
  if (a === 'battery') return 'Hotspot · Battery'
  return 'Hotspot · Main Panel'
}

function prettyMode(m: 'charging' | 'discharging' | 'idle') {
  if (m === 'charging') return 'Charging'
  if (m === 'discharging') return 'Discharging'
  return 'Holding'
}

function Stat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border p-3 ${accent ? 'border-cyan-400/30 bg-cyan-400/[0.06]' : 'border-white/10 bg-white/[0.03]'}`}>
      <div className="text-[10px] uppercase tracking-wider text-white/55">{label}</div>
      <div className={`mt-1 text-lg font-medium tabular-nums ${accent ? 'text-cyan-200' : 'text-white/90'}`}>{value}</div>
    </div>
  )
}

function FlowLine({ label, value, positive }: { label: string; value: string; positive: boolean }) {
  return (
    <div className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <div className="text-[10px] uppercase tracking-wider text-white/55">{label}</div>
      <div className={`text-sm font-medium ${positive ? 'text-cyan-300' : 'text-orange-300'}`}>{value}</div>
    </div>
  )
}

function Bar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[11px] text-white/65">
        <span>{label}</span>
        <span className="tabular-nums">{value}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/8">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${value}%`, background: color, boxShadow: `0 0 12px ${color}80` }}
        />
      </div>
    </div>
  )
}
