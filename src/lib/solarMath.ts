import { selectPanelCount, type SystemType } from '@/store/useEnergyStore'

// Real-world Berkshire Energy numbers
const PANEL_WATTS = 410
const KWH_PER_PANEL_PER_DAY = 1.7

// Net price per watt by system type (after incentives).
// - solar+battery: bundled rate, battery priced at ~$15k within the bundle
// - solar: standalone solar, no battery
const PPW_BY_TYPE: Record<Exclude<SystemType, 'battery'>, number> = {
  'solar+battery': 3.8,
  solar: 2.5,
}
// Standalone battery is priced flat, not by watt. Real range $18k–$20k.
const STANDALONE_BATTERY_COST = 19000

// Battery-only systems use TOU arbitrage on usage rather than the offset slider.
const BATTERY_ONLY_USAGE_OFFSET = 0.15

// Utility connection (customer) charge — always paid regardless of how much
// the home generates. Berkshire-area utilities run $20–$25/mo; mid is $22.
const CONNECTION_FEE = 22
// Net metering buy-back: excess solar (offset > 100%) earns credits at this
// fraction of the retail rate. Massachusetts SMART / NEM typical ≈ 0.6.
const BUY_BACK_RATE = 0.6

// Tesla Powerwall 3 specs (current model, the unit Berkshire installs).
export const POWERWALL = {
  usableKwh: 13.5, // usable storage per unit
  peakKw: 11.5, // continuous output (≥ a typical home's 5–8 kW peak)
}
// One Powerwall cycles its full storage each day from off-peak/solar into
// the home's evening peak window. TOU spread in MA averages ~$0.075/kWh
// (peak ~$0.30 vs off-peak ~$0.15, weighted average).
const TOU_SPREAD_PER_KWH = 0.075
const POWERWALL_DEMAND_FULL = Math.round(
  POWERWALL.usableKwh * TOU_SPREAD_PER_KWH * 30,
) // ≈ $30/mo at full daily cycle

export function computeSavings(
  monthlyBill: number,
  systemType: SystemType = 'solar+battery',
  solarOffset = 1.0,
) {
  const hasSolar = systemType !== 'battery'
  const hasBattery = systemType !== 'solar'
  // Effective offset: battery alone has a fixed TOU savings; solar/solar+battery
  // use the slider value (clamped to 30%-130%).
  const offset = hasSolar
    ? Math.min(1.3, Math.max(0.3, solarOffset))
    : BATTERY_ONLY_USAGE_OFFSET

  // Split the current bill into usage charges + the connection fee floor.
  const usage = Math.max(0, monthlyBill - CONNECTION_FEE)

  // Solar offsets usage up to 100%
  const solarCovers = Math.round(usage * Math.min(1.0, offset))
  // Excess (>100%) earns net-metering credit against the remaining bill
  const excessUsage = Math.max(0, offset - 1.0) * usage
  const buyBackCredit = Math.round(excessUsage * BUY_BACK_RATE)
  // Powerwall demand savings: shifts peak usage to off-peak via daily cycle.
  // Capped so it can't exceed the usage actually remaining after solar.
  const batteryDemandCredit = hasBattery
    ? Math.min(POWERWALL_DEMAND_FULL, Math.max(0, usage - solarCovers))
    : 0
  // Final bill: connection fee + leftover usage − all credits, floored at 0
  const beforeCredits = (usage - solarCovers) + CONNECTION_FEE
  const leftoverBill = Math.max(0, beforeCredits - buyBackCredit - batteryDemandCredit)

  // Total covered (for display in "Solar covers" row)
  const totalCovered = solarCovers + buyBackCredit + batteryDemandCredit

  const panels = hasSolar ? selectPanelCount(monthlyBill, offset) : 0
  const systemKw = +(panels * (PANEL_WATTS / 1000)).toFixed(1)
  const systemCost =
    systemType === 'battery'
      ? STANDALONE_BATTERY_COST
      : Math.round(systemKw * 1000 * PPW_BY_TYPE[systemType])

  const monthlyReduction = monthlyBill - leftoverBill
  const yearlySavings = monthlyReduction * 12
  const twentyYear = yearlySavings * 20
  const paybackYears = yearlySavings > 0 ? +(systemCost / yearlySavings).toFixed(1) : 0
  const co2TonsPerYear = hasSolar
    ? +(panels * KWH_PER_PANEL_PER_DAY * 365 * 0.0007).toFixed(1)
    : 0
  return {
    panels,
    systemKw,
    systemCost,
    solarCovers: totalCovered,
    leftoverBill: Math.round(leftoverBill),
    monthlyReduction: Math.round(monthlyReduction),
    yearlySavings,
    twentyYear,
    paybackYears,
    co2TonsPerYear,
    effectiveOffset: offset,
    connectionFee: CONNECTION_FEE,
    buyBackCredit,
    batteryDemandCredit,
  }
}

export function instantSolarKw(panels: number, dayFactor: number) {
  return +(panels * (PANEL_WATTS / 1000) * dayFactor).toFixed(1)
}

export function todayKwh(panels: number) {
  return +(panels * KWH_PER_PANEL_PER_DAY).toFixed(1)
}

export { PPW_BY_TYPE, STANDALONE_BATTERY_COST }

// Battery SOC that tracks sun hours: charges during daylight (t=0.25..0.75),
// discharges through the night. Returns 0..1.
export function batterySoc(timeOfDay: number) {
  const SUNRISE = 0.25
  const SUNSET = 0.75
  const MAX = 0.95
  const MIN = 0.15
  if (timeOfDay >= SUNRISE && timeOfDay <= SUNSET) {
    // Daytime: rapid morning charge, then hold near full
    const f = Math.min(1, (timeOfDay - SUNRISE) / 0.35)
    return MIN + (MAX - MIN) * f
  }
  // Night: drain from MAX → MIN linearly across the dark half (0.5)
  const elapsed = timeOfDay > SUNSET ? timeOfDay - SUNSET : timeOfDay + (1 - SUNSET)
  const f = Math.min(1, elapsed / 0.5)
  return MAX - (MAX - MIN) * f
}

export function batteryMode(timeOfDay: number): 'charging' | 'discharging' | 'idle' {
  if (timeOfDay >= 0.25 && timeOfDay <= 0.6) return 'charging'
  if (timeOfDay > 0.6 && timeOfDay <= 0.75) return 'idle'
  return 'discharging'
}
