export function Logo({ className, tone = 'ink' }: { className?: string; tone?: 'ink' | 'light' }) {
  const light = tone === 'light'
  const ring = light ? 'rgba(255,255,255,0.55)' : 'rgba(11,63,158,0.35)'
  const ring2 = light ? 'rgba(120,190,255,0.9)' : '#0b5fd4'
  const uid = light ? 'l' : 'i'
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      {/* orbital ring */}
      <circle cx="24" cy="24" r="21" stroke={ring} strokeWidth="1.4" />
      <path
        d="M7 17a18 18 0 0 1 31-3"
        stroke={ring2}
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity={light ? 0.9 : 0.8}
      />
      <path
        d="M41 31a18 18 0 0 1-31 3"
        stroke={ring2}
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity={light ? 0.9 : 0.8}
      />
      {/* silver B-ish backplate accent */}
      <path d="M30 14h4.6c2.4 0 4 1.5 4 3.7 0 1.5-.8 2.6-2 3.2 1.5.5 2.5 1.8 2.5 3.6 0 2.4-1.8 4-4.5 4H30V14Z"
        fill={`url(#${uid}_silver)`} opacity="0.9" />
      {/* lightning bolt */}
      <path
        d="M27 4 13 27h8.2L18 44l17.5-25H26.5L31 4 27 4Z"
        fill={`url(#${uid}_bolt)`}
        stroke={light ? 'rgba(180,225,255,0.9)' : 'rgba(255,255,255,0.85)'}
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      <path d="M27 4 13 27h4L29 8l-2-4Z" fill="#ffffff" opacity="0.45" />
      <defs>
        <linearGradient id={`${uid}_bolt`} x1="14" y1="6" x2="36" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5bb6ff" />
          <stop offset="0.5" stopColor="#1273e6" />
          <stop offset="1" stopColor="#0a47a8" />
        </linearGradient>
        <linearGradient id={`${uid}_silver`} x1="30" y1="14" x2="40" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor={light ? '#f2f6ff' : '#c9d6ee'} />
          <stop offset="1" stopColor={light ? '#b9c7e0' : '#8fa3c6'} />
        </linearGradient>
      </defs>
    </svg>
  )
}
