'use client'
import { useEnergyStore, type SystemType } from '@/store/useEnergyStore'

export function Headline() {
  const introDone = useEnergyStore((s) => s.introDone)
  const focusMode = useEnergyStore((s) => s.focusMode)
  const setIntroDone = useEnergyStore((s) => s.setIntroDone)
  const setSystemType = useEnergyStore((s) => s.setSystemType)

  if (introDone || focusMode) return null

  const choose = (t: SystemType) => {
    setSystemType(t)
    setIntroDone(true)
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 px-8 pt-16 md:pt-20">
      <div className="mx-auto max-w-3xl text-left md:text-left">
        <div className="fade-up flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-cyan-300/80">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_12px_#00e0ff]" />
          Berkshire Energy
        </div>
        <h1 className="fade-up fade-up-1 mt-3 text-5xl font-semibold leading-[0.95] tracking-tight md:text-7xl">
          See every <span className="gradient-cyan">watt.</span>
        </h1>
        <p className="fade-up fade-up-2 mt-4 max-w-xl text-base text-white/70 md:text-lg">
          Pick what you&apos;d like to explore — we&apos;ll size it to your home.
        </p>
        <div className="fade-up fade-up-3 mt-7 pointer-events-auto flex flex-wrap gap-3">
          <ChoiceButton
            label="Battery"
            sub="Backup + TOU savings"
            onClick={() => choose('battery')}
            icon={<BatteryIcon />}
          />
          <ChoiceButton
            label="Solar + Battery"
            sub="Maximum offset"
            onClick={() => choose('solar+battery')}
            icon={<SolarBatteryIcon />}
            featured
          />
          <ChoiceButton
            label="Solar"
            sub="Daytime offset"
            onClick={() => choose('solar')}
            icon={<SunIcon />}
          />
        </div>
      </div>
    </div>
  )
}

function ChoiceButton({
  label,
  sub,
  icon,
  onClick,
  featured = false,
}: {
  label: string
  sub: string
  icon: React.ReactNode
  onClick: () => void
  featured?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={
        featured
          ? 'cta-btn flex items-center gap-3 px-5 py-3 text-left'
          : 'glass flex items-center gap-3 px-5 py-3 text-left text-white transition-transform hover:-translate-y-0.5'
      }
    >
      <span
        className={
          featured
            ? 'flex h-9 w-9 items-center justify-center rounded-full bg-[#050810] text-cyan-300'
            : 'flex h-9 w-9 items-center justify-center rounded-full bg-cyan-400/15 text-cyan-300 ring-1 ring-cyan-400/40'
        }
      >
        {icon}
      </span>
      <span className="leading-tight">
        <span
          className={`block text-sm font-semibold ${
            featured ? 'text-[#050810]' : 'text-white'
          }`}
        >
          {label}
        </span>
        <span
          className={`block text-[11px] ${
            featured ? 'text-[#050810]/70' : 'text-white/55'
          }`}
        >
          {sub}
        </span>
      </span>
    </button>
  )
}

function BatteryIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7" width="15" height="10" rx="1.5" />
      <path d="M21 11v2" />
      <rect x="6" y="10" width="6" height="4" fill="currentColor" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

function SolarBatteryIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14l3-9h10l3 9z" />
      <path d="M2 14h20" />
      <path d="M9 14v6h6v-6" fill="currentColor" />
    </svg>
  )
}
