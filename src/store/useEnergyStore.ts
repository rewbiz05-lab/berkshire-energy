import { create } from 'zustand'

export type Hotspot = 'roof' | 'battery' | 'panel' | null
export type SystemType = 'battery' | 'solar+battery' | 'solar'

export type SavedConfig = {
  systemType: SystemType
  monthlyBill: number
  solarOffset: number
  savedAt: number
}

type State = {
  monthlyBill: number
  timeOfDay: number // 0..1, 0=midnight, 0.5=noon
  autoTime: boolean
  activeHotspot: Hotspot
  introDone: boolean
  focusMode: boolean
  cameraAzimuth: number
  systemType: SystemType
  solarOffset: number
  savedConfig: SavedConfig | null
  quoteOpen: boolean
  setBill: (v: number) => void
  setTime: (v: number) => void
  setAutoTime: (v: boolean) => void
  setHotspot: (h: Hotspot) => void
  setIntroDone: (v: boolean) => void
  setFocusMode: (v: boolean) => void
  setCameraAzimuth: (v: number) => void
  setSystemType: (v: SystemType) => void
  setSolarOffset: (v: number) => void
  setQuoteOpen: (v: boolean) => void
  saveConfig: () => void
  resetConfig: () => void
}

const DEFAULT_BILL = 185

export const DEFAULT_OFFSET_BY_TYPE: Record<SystemType, number> = {
  'solar+battery': 0.83,
  solar: 0.7,
  battery: 0.15,
}

export const useEnergyStore = create<State>((set, get) => ({
  monthlyBill: DEFAULT_BILL,
  timeOfDay: 0.5,
  autoTime: true,
  activeHotspot: null,
  introDone: false,
  focusMode: false,
  cameraAzimuth: 0.5,
  systemType: 'solar+battery',
  solarOffset: DEFAULT_OFFSET_BY_TYPE['solar+battery'],
  savedConfig: null,
  quoteOpen: false,
  setBill: (v) => set({ monthlyBill: v }),
  setTime: (v) => set({ timeOfDay: v }),
  setAutoTime: (v) => set({ autoTime: v }),
  setHotspot: (h) => set({ activeHotspot: h }),
  setIntroDone: (v) => set({ introDone: v }),
  setFocusMode: (v) => set({ focusMode: v }),
  setCameraAzimuth: (v) => set({ cameraAzimuth: v }),
  setSystemType: (v) =>
    set({ systemType: v, solarOffset: DEFAULT_OFFSET_BY_TYPE[v] }),
  setSolarOffset: (v) => set({ solarOffset: v }),
  setQuoteOpen: (v) => set({ quoteOpen: v }),
  saveConfig: () => {
    const s = get()
    const cfg: SavedConfig = {
      systemType: s.systemType,
      monthlyBill: s.monthlyBill,
      solarOffset: s.solarOffset,
      savedAt: Date.now(),
    }
    set({ savedConfig: cfg })
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem('berkshire-energy-saved', JSON.stringify(cfg))
      } catch {}
    }
  },
  resetConfig: () =>
    set({
      monthlyBill: DEFAULT_BILL,
      systemType: 'solar+battery',
      solarOffset: DEFAULT_OFFSET_BY_TYPE['solar+battery'],
      savedConfig: null,
    }),
}))

// Bill ÷ 10 ≈ panels needed for a 100% offset (e.g. $200 → 20 panels ≈ 8 kW).
// Scale by the homeowner-chosen offset, then clamp to the array's physical
// capacity (8..40 panels on the visible roof).
export const selectPanelCount = (bill: number, offset = 1.0) =>
  Math.min(40, Math.max(8, Math.round((bill / 10) * offset)))

// Sun altitude: 0 below horizon, 1 at zenith. Matches Sun.tsx's arc.
// Sun rises around t=0.25 and sets around t=0.75 — production is zero outside that.
export const selectDayFactor = (timeOfDay: number) => {
  const angle = timeOfDay * Math.PI * 2 - Math.PI / 2
  return Math.max(0, Math.sin(angle))
}
