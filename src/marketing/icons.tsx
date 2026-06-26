type P = { className?: string }
const base = (p: P) => ({
  className: p.className,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
})

export const IconPanel = (p: P) => (
  <svg {...base(p)}><path d="M4 14h16l-1.5-8.5A1.5 1.5 0 0 0 17 4H7a1.5 1.5 0 0 0-1.5 1.5L4 14Z" /><path d="M12 4v10M4 9.5h16M12 14v6M8 20h8" /></svg>
)
export const IconBattery = (p: P) => (
  <svg {...base(p)}><rect x="3" y="7" width="16" height="10" rx="2" /><path d="M21 10v4" /><path d="M9 9.5 7.5 12.5H10L8.5 15" /></svg>
)
export const IconShield = (p: P) => (
  <svg {...base(p)}><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" /><path d="m9 12 2 2 4-4" /></svg>
)
export const IconWallet = (p: P) => (
  <svg {...base(p)}><rect x="3" y="6" width="18" height="13" rx="2.5" /><path d="M3 10h18M16.5 13.5h.01" /></svg>
)
export const IconBolt = (p: P) => (
  <svg {...base(p)}><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" /></svg>
)
export const IconCheck = (p: P) => (
  <svg {...base(p)}><path d="m4 12 5 5L20 6" /></svg>
)
export const IconStar = (p: P) => (
  <svg className={p.className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.8 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9L12 2.5Z" /></svg>
)
export const IconHome = (p: P) => (
  <svg {...base(p)}><path d="M4 11.5 12 4l8 7.5" /><path d="M6 10v9h12v-9" /><path d="M10 19v-5h4v5" /></svg>
)
export const IconPhone = (p: P) => (
  <svg {...base(p)}><path d="M5 4h3l1.5 4-2 1.5a12 12 0 0 0 5 5l1.5-2 4 1.5V18a2 2 0 0 1-2 2A14 14 0 0 1 3 6a2 2 0 0 1 2-2Z" /></svg>
)
export const IconPin = (p: P) => (
  <svg {...base(p)}><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>
)
export const IconArrow = (p: P) => (
  <svg {...base(p)}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
)
export const IconSun = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
)
export const IconLeaf = (p: P) => (
  <svg {...base(p)}><path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14Z" /><path d="M5 19c3-5 6-8 11-10" /></svg>
)
