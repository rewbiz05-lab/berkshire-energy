import { SiteNav } from '@/marketing/SiteNav'
import { Reveal } from '@/marketing/Reveal'
import { QuoteForm } from '@/marketing/QuoteForm'
import { FloatingQuoteCTA } from '@/marketing/FloatingQuoteCTA'
import { SupportChat } from '@/marketing/SupportChat'
import { Logo } from '@/marketing/Logo'
import {
  IconPanel, IconBattery, IconShield, IconWallet, IconBolt, IconCheck,
  IconHome, IconPin, IconArrow, IconSun, IconLeaf,
} from '@/marketing/icons'

const STATS = [
  { value: 'Local', label: 'Valley-based Arizona team' },
  { value: 'Tier-1', label: 'Panels & Tesla Powerwall storage' },
  { value: '25-yr', label: 'Equipment & production warranty' },
  { value: '$0', label: 'Down payment options' },
]

const STEPS = [
  { icon: IconSun, n: '01', title: 'Custom solar design', body: 'We model your roof from satellite imagery and your last 12 months of usage to design a system that wipes out your bill — not oversell you panels.' },
  { icon: IconWallet, n: '02', title: 'Your best price, locked', body: 'We price it transparently and put our number up against any competing bid. You approve the design and financing that fit your budget.' },
  { icon: IconBolt, n: '03', title: 'Built & switched on', body: 'Our vetted local install partners handle permits and the build. Once your utility says go, you start producing power and tracking every watt from your phone.' },
]

const FINANCING = [
  { tag: 'Most popular', tagged: true, title: '$0-down loan', price: 'From $0 up front', body: 'Replace your utility bill with a fixed solar payment that’s often lower. You own the system outright and build equity instead of renting power from the utility.', points: ['Own your system', 'Fixed monthly payment', 'No utility rate hikes'] },
  { tag: 'Best long-term value', tagged: false, title: 'Cash purchase', price: 'Maximum lifetime savings', body: 'Pay once and eliminate your electric bill entirely. The fastest payback and the highest return over 25+ years.', points: ['Lowest cost of energy', 'Fastest payback', 'Adds home value'] },
  { tag: 'No upfront cost', tagged: false, title: 'Subscription', price: 'Pay only for power', body: 'No equipment to buy. Subscribe to the clean power your roof produces at a rate below your utility — cancel anytime you sell.', points: ['$0 to start', 'Below-utility rate', 'Maintenance included'] },
]

const PILLARS = [
  { icon: IconPin, title: 'A local Arizona team', body: 'Born and based in the Valley. We know the utilities, the heat, and what a 115° summer does to your bill.' },
  { icon: IconShield, title: '25-year warranty', body: 'Equipment, workmanship, and production — all covered for a quarter century, in writing.' },
  { icon: IconWallet, title: 'Transparent pricing', body: 'One clear number, no high-pressure “today only” games. You’ll know your savings before you sign.' },
  { icon: IconLeaf, title: 'Premium equipment', body: 'Tier-1 panels and Tesla Powerwall storage — the gear we’d put on our own homes.' },
]

// PLACEHOLDER testimonials — replace each with a real customer text + name
// before launch (FTC bans invented/AI testimonials). Keep the format.
const REVIEWS = [
  {
    name: 'Marcus R.',
    meta: 'Gilbert · APS · 8 kW + Powerwall',
    msgs: ['just got my first full APS bill since you flipped it on', '$312 last July… this month it’s $9.41 😭'],
  },
  {
    name: 'Priya S.',
    meta: 'Chandler · SRP · 6.4 kW',
    msgs: ['had 3 companies quote me, you were the only one who didn’t do the “sign today” thing', 'crew was in and out in a day. thank you 🙏'],
  },
  {
    name: 'Tom K.',
    meta: 'Surprise · APS · 10 kW + 2 Powerwalls',
    msgs: ['power went out on the whole street last night', 'didn’t even notice till the neighbors texted lol — battery carried us'],
  },
]

export default function Page() {
  return (
    <div className="mkt" id="top">
      <SiteNav />

      {/* HERO */}
      <section className="hero-grad relative overflow-hidden text-white">
        <div className="grid-fade" />
        <div className="sun-flare" />
        <div className="mkt-container relative grid gap-12 pb-24 pt-36 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pb-32 lg:pt-44">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/85">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--solar-2)]" />
              Solar &amp; battery for Arizona homes
            </div>
            <h1 className="display mt-6 text-balance text-[clamp(2.6rem,6vw,4.6rem)]">
              Own your power.
              <br />
              <span className="bg-gradient-to-r from-[var(--solar-2)] to-[var(--solar)] bg-clip-text text-transparent">
                Stop renting it.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/75">
              Berkshire Energy designs and prices custom solar &amp; storage for Arizona homes —
              and we&rsquo;ll go head-to-head with any quote you already have to turn the desert
              sun into decades of lower, predictable bills.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a href="#quote" className="btn btn-solar">
                Get my free quote <IconArrow className="h-[18px] w-[18px]" />
              </a>
              <a href="tel:+16233962112" className="btn btn-ghost-light">
                Talk to us: (623) 396-2112
              </a>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-white/70">
              <span className="inline-flex items-center gap-1.5"><IconPin className="h-4 w-4 text-[var(--solar-2)]" /> Arizona-based &amp; licensed</span>
              <span className="inline-flex items-center gap-1.5"><IconShield className="h-4 w-4 text-[var(--solar-2)]" /> 25-year warranty</span>
              <span className="inline-flex items-center gap-1.5"><IconWallet className="h-4 w-4 text-[var(--solar-2)]" /> $0 down available</span>
            </div>
          </div>

          {/* Hero savings card */}
          <Reveal className="lg:justify-self-end">
            <div className="w-full max-w-md rounded-3xl border border-white/12 bg-white/[0.06] p-6 backdrop-blur-xl shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)]">
              <div className="flex items-center justify-between text-sm text-white/65">
                <span>Your energy, after solar</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-xs"><IconSun className="h-3.5 w-3.5 text-[var(--solar-2)]" /> 8.4 kW system</span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-black/20 p-4">
                  <div className="text-xs uppercase tracking-wider text-white/50">Today</div>
                  <div className="mt-1 text-3xl font-bold">$236<span className="text-base font-medium text-white/55">/mo</span></div>
                  <div className="mt-1 text-xs text-white/45">Utility bill, rising ~4%/yr</div>
                </div>
                <div className="rounded-2xl bg-[var(--solar)]/15 p-4 ring-1 ring-[var(--solar)]/40">
                  <div className="text-xs uppercase tracking-wider text-[var(--solar-2)]">With solar</div>
                  <div className="mt-1 text-3xl font-bold">$119<span className="text-base font-medium text-white/55">/mo</span></div>
                  <div className="mt-1 text-xs text-white/45">Fixed payment, locked in</div>
                </div>
              </div>
              <div className="mt-5">
                <div className="flex items-end justify-between text-sm">
                  <span className="text-white/65">25-year savings</span>
                  <span className="text-2xl font-bold text-[var(--solar-2)]">$48,900</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[64%] rounded-full bg-gradient-to-r from-[var(--solar-2)] to-[var(--solar)]" />
                </div>
                <p className="mt-3 text-xs text-white/45">Illustrative estimate. Your real numbers come from your roof and usage.</p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Stats strip */}
        <div className="relative border-t border-white/10 bg-black/20">
          <div className="mkt-container grid grid-cols-2 gap-y-8 py-10 md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold md:text-4xl">{s.value}</div>
                <div className="mt-1 text-sm text-white/60">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="bg-[var(--paper)] py-24 md:py-28">
        <div className="mkt-container">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">How it works</p>
            <h2 className="display mt-3 text-[clamp(2rem,4vw,3rem)] text-[var(--ink)]">
              From sunshine to savings in three steps.
            </h2>
            <p className="mt-4 text-lg text-[var(--ink-soft)]">
              We handle the design, pricing, and approvals, then hand off to vetted install
              partners. You just watch your bill shrink.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 90} className="card card-hover p-7">
                <div className="flex items-center justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-[var(--brand)] text-white">
                    <s.icon className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-semibold tracking-widest text-[var(--line)]">{s.n}</span>
                </div>
                <h3 className="mt-6 text-xl font-bold">{s.title}</h3>
                <p className="mt-3 text-[var(--ink-soft)]">{s.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* BEAT YOUR QUOTE */}
      <section id="beat" className="relative overflow-hidden bg-[var(--brand)] py-24 text-white md:py-28">
        <div className="sun-flare" />
        <div className="mkt-container relative">
          <div className="grid items-end gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <Reveal>
              <p className="eyebrow" style={{ color: '#5bb6ff' }}>Already shopping?</p>
              <h2 className="display mt-3 text-[clamp(2rem,4.4vw,3.2rem)] text-balance">
                Bring us your quote.
                <br />
                <span className="bg-gradient-to-r from-[#7cc4ff] to-[var(--solar-2)] bg-clip-text text-transparent">
                  We&rsquo;ll beat it.
                </span>
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="max-w-md text-lg text-white/75">
                Already holding a bid from another company — or stuck in a project that stalled
                halfway through? Send it over. We&rsquo;ll re-run the same system, sharpen the
                pricing, and come back with a better deal. If yours is already great, we&rsquo;ll
                tell you straight.
              </p>
            </Reveal>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              { icon: IconWallet, t: 'Send us your offer', d: 'Any competing quote — monthly or cash. We just need the system size and the price you were given.' },
              { icon: IconBolt, t: 'We sharpen the deal', d: 'Same quality equipment, better pricing and smarter financing — re-engineered to put more savings in your pocket.' },
              { icon: IconShield, t: 'A better price, in writing', d: 'You get a clear, head-to-head offer with no pressure and no gimmicks. Already mid-project elsewhere? We can pick it up from here.' },
            ].map((c, i) => (
              <Reveal key={c.t} delay={i * 90} className="rounded-2xl border border-white/12 bg-white/[0.05] p-7 backdrop-blur-sm">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/10 text-[#7cc4ff]">
                  <c.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-xl font-bold">{c.t}</h3>
                <p className="mt-3 text-white/70">{c.d}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120} className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a href="#quote" className="btn btn-solar">
              Send my quote &amp; save more <IconArrow className="h-[18px] w-[18px]" />
            </a>
            <span className="text-sm text-white/60">No obligation. We only reach out with your numbers.</span>
          </Reveal>
        </div>
      </section>

      {/* SAVINGS */}
      <section id="savings" className="bg-[var(--paper-2)] py-24 md:py-28">
        <div className="mkt-container grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Why solar</p>
            <h2 className="display mt-3 text-[clamp(2rem,4vw,3rem)]">
              Every month you wait, the utility wins.
            </h2>
            <p className="mt-4 text-lg text-[var(--ink-soft)]">
              Arizona electricity rates have climbed for years and won’t stop. Solar swaps a
              rising rent check to the utility for a fixed payment you control — and once it’s
              paid off, your power is essentially free.
            </p>
            <ul className="mt-7 grid gap-3">
              {[
                'Lock in a low, predictable energy rate for 25+ years',
                'Own your system instead of renting power from the utility',
                'Raise your home value without raising property tax',
                'Stay powered through outages with battery backup',
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#eafbef] text-[#1a9f4b]">
                    <IconCheck className="h-4 w-4" />
                  </span>
                  <span className="text-[var(--ink)]">{t}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={120}>
            <div className="card p-7">
              <div className="flex items-center justify-between">
                <h3 className="font-bold">25-year cost of power</h3>
                <span className="text-xs text-[var(--ink-soft)]">Typical Phoenix home</span>
              </div>
              <div className="mt-8 grid grid-cols-2 items-end gap-8">
                <div className="text-center">
                  <div className="mx-auto flex h-56 w-20 flex-col justify-end overflow-hidden rounded-xl bg-[var(--paper-2)] ring-1 ring-[var(--line)]">
                    <div className="bg-gradient-to-t from-[#c2362b] to-[#ef6a5c]" style={{ height: '100%' }} />
                  </div>
                  <div className="mt-3 text-2xl font-bold">$92k</div>
                  <div className="text-sm text-[var(--ink-soft)]">Staying with the utility</div>
                </div>
                <div className="text-center">
                  <div className="mx-auto flex h-56 w-20 flex-col justify-end overflow-hidden rounded-xl bg-[var(--paper-2)] ring-1 ring-[var(--line)]">
                    <div className="bg-gradient-to-t from-[var(--solar)] to-[var(--solar-2)]" style={{ height: '47%' }} />
                  </div>
                  <div className="mt-3 text-2xl font-bold">$43k</div>
                  <div className="text-sm text-[var(--ink-soft)]">Going solar with Berkshire</div>
                </div>
              </div>
              <div className="mt-7 rounded-xl bg-[#eafbef] px-4 py-3 text-center text-sm font-semibold text-[#157a3a]">
                ≈ $49,000 kept in your pocket over 25 years
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* BATTERY */}
      <section id="battery" className="relative overflow-hidden bg-[var(--brand)] py-24 text-white md:py-28">
        <div className="sun-flare" />
        <div className="mkt-container relative grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Battery storage</p>
            <h2 className="display mt-3 text-[clamp(2rem,4vw,3rem)]">
              Keep the lights on when the grid goes down.
            </h2>
            <p className="mt-4 text-lg text-white/75">
              Pair your system with Tesla Powerwall to store the power your panels make by day
              and use it at night, during peak rates, or when the grid fails. Your home barely
              notices the outage your neighbors are sitting in.
            </p>
            <div className="mt-9 grid gap-5 sm:grid-cols-2">
              {[
                { icon: IconBattery, t: 'Whole-home backup', d: 'Ride out outages automatically — no generator, no noise, no fuel.' },
                { icon: IconBolt, t: 'Beat peak rates', d: 'Store cheap daytime energy and pull from the battery when rates spike.' },
                { icon: IconHome, t: 'Energy independence', d: 'Lean on your own roof and battery instead of the utility.' },
                { icon: IconSun, t: 'Smarter every day', d: 'Monitor and optimize storage from one simple app.' },
              ].map((f) => (
                <div key={f.t} className="flex gap-3.5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/10 text-[var(--solar-2)]">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="font-semibold">{f.t}</div>
                    <div className="mt-1 text-sm text-white/65">{f.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120} className="lg:justify-self-end">
            <div className="w-full max-w-md rounded-3xl border border-white/12 bg-white/[0.05] p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/65">Powerwall status</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1a9f4b]/20 px-2.5 py-1 text-xs text-[#7be8a3]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#43e07b]" /> Backup ready
                </span>
              </div>
              <div className="mt-6 flex items-end gap-2">
                <span className="text-6xl font-bold">92</span>
                <span className="mb-2 text-2xl font-medium text-white/55">%</span>
              </div>
              <div className="mt-2 text-sm text-white/55">≈ 18 hours of essential backup remaining</div>
              <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-[#43e07b] to-[#1a9f4b]" />
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                {[['Solar', '+6.2 kW'], ['Home', '1.1 kW'], ['Grid', 'Off']].map(([k, v]) => (
                  <div key={k} className="rounded-xl bg-black/20 py-3">
                    <div className="text-xs text-white/50">{k}</div>
                    <div className="mt-1 font-semibold">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FINANCING */}
      <section id="financing" className="bg-[var(--paper)] py-24 md:py-28">
        <div className="mkt-container">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Financing</p>
            <h2 className="display mt-3 text-[clamp(2rem,4vw,3rem)]">
              A way to go solar that fits your budget.
            </h2>
            <p className="mt-4 text-lg text-[var(--ink-soft)]">
              Own it, pay cash, or subscribe — every path lowers your cost of power from day one.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {FINANCING.map((f, i) => (
              <Reveal key={f.title} delay={i * 90}>
                <div className={`card card-hover relative flex h-full flex-col p-7 ${f.tagged ? 'ring-2 ring-[var(--solar)]' : ''}`}>
                  <span className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${f.tagged ? 'bg-[var(--solar)] text-[#1a1205]' : 'bg-[var(--paper-2)] text-[var(--ink-soft)]'}`}>
                    {f.tag}
                  </span>
                  <h3 className="mt-5 text-2xl font-bold">{f.title}</h3>
                  <div className="mt-1 text-sm font-medium text-[var(--solar)]">{f.price}</div>
                  <p className="mt-4 text-[var(--ink-soft)]">{f.body}</p>
                  <ul className="mt-6 grid gap-2.5">
                    {f.points.map((p) => (
                      <li key={p} className="flex items-center gap-2.5 text-sm">
                        <IconCheck className="h-4 w-4 text-[var(--solar)]" /> {p}
                      </li>
                    ))}
                  </ul>
                  <a href="#quote" className={`btn mt-7 w-full ${f.tagged ? 'btn-solar' : 'btn-ghost'}`}>
                    Get my quote
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHY BERKSHIRE */}
      <section className="bg-[var(--paper-2)] py-24 md:py-28">
        <div className="mkt-container">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">Why Berkshire Energy</p>
            <h2 className="display mt-3 text-[clamp(2rem,4vw,3rem)]">
              Neighbors you can trust with your roof.
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 80} className="card card-hover p-6">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-[var(--solar)]/12 text-[var(--solar)]">
                  <p.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-bold">{p.title}</h3>
                <p className="mt-2 text-sm text-[var(--ink-soft)]">{p.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="bg-[var(--paper)] py-24 md:py-28">
        <div className="mkt-container">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">Proof, not promises</p>
            <h2 className="display mt-3 text-[clamp(2rem,4vw,3rem)]">
              Real homeowners. Real bills.
            </h2>
            <p className="mt-4 text-lg text-[var(--ink-soft)]">
              No anonymous wall of five-stars — here’s what Arizona homeowners
              are saying after making the switch to solar.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {REVIEWS.map((r, i) => (
              <Reveal
                key={r.name}
                delay={i * 90}
                className="rounded-3xl border border-[var(--line)] bg-white p-5 shadow-[0_10px_40px_-24px_rgba(11,31,58,0.45)]"
              >
                <div className="flex items-center gap-3 border-b border-[var(--line)] pb-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--brand)] text-xs font-bold text-white">
                    {r.name[0]}
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold leading-tight">{r.name}</div>
                    <div className="truncate text-[11px] text-[var(--ink-soft)]">{r.meta}</div>
                  </div>
                  <span className="ml-auto shrink-0 rounded-full bg-[var(--paper-2)] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[var(--ink-soft)]">
                    Text
                  </span>
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  {r.msgs.map((m, j) => (
                    <div
                      key={j}
                      className="max-w-[90%] self-start rounded-2xl rounded-bl-md bg-[var(--paper-2)] px-3.5 py-2.5 text-sm leading-snug text-[var(--ink)]"
                    >
                      {m}
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-[11px] font-medium text-[var(--ink-soft)]">
                  <IconCheck className="h-3.5 w-3.5 text-[var(--solar)]" />
                  Verified Berkshire customer
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal
            delay={120}
            className="mt-10 flex flex-col items-center justify-between gap-5 rounded-3xl border border-[var(--line)] bg-white px-7 py-6 sm:flex-row"
          >
            <div>
              <div className="font-semibold text-[var(--ink)]">Ready to see your own numbers?</div>
              <div className="mt-1 text-sm text-[var(--ink-soft)]">
                Get a free, custom solar design for your roof — no pressure, no deposit.
              </div>
            </div>
            <a href="#quote" className="btn btn-solar shrink-0">
              Get my free quote
            </a>
          </Reveal>
        </div>
      </section>

      {/* QUOTE / CTA */}
      <section id="quote" className="hero-grad relative overflow-hidden py-24 text-white md:py-28">
        <div className="grid-fade" />
        <div className="mkt-container relative grid items-center gap-14 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Free, no-pressure quote</p>
            <h2 className="display mt-3 text-[clamp(2rem,4.4vw,3.2rem)] text-balance">
              See exactly what solar saves your home.
            </h2>
            <p className="mt-4 max-w-lg text-lg text-white/75">
              Share a few details and a local advisor will build your custom design — system size,
              savings, and financing — usually within one business day.
            </p>
            <div className="mt-8 grid max-w-md gap-4">
              {[
                ['Custom system & savings estimate', 'Built from your real roof and usage'],
                ['Transparent, all-in pricing', 'One honest number, no games'],
                ['No obligation', 'Walk away anytime — seriously'],
              ].map(([t, d]) => (
                <div key={t} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/12 text-[var(--solar-2)]">
                    <IconCheck className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="font-semibold">{t}</div>
                    <div className="text-sm text-white/60">{d}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-9 flex items-center gap-3 text-sm text-white/70">
              <IconPin className="h-4 w-4 text-[var(--solar-2)]" /> Serving Phoenix metro &amp; all of Arizona
            </div>
          </div>

          <div className="rounded-3xl border border-white/12 bg-white p-6 text-[var(--ink)] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.6)] md:p-8">
            <h3 className="text-xl font-bold">Get my free quote</h3>
            <p className="mt-1 text-sm text-[var(--ink-soft)]">Takes about 30 seconds.</p>
            <div className="mt-6">
              <QuoteForm />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#06080f] py-14 text-white/70">
        <div className="mkt-container">
          <div className="flex flex-col gap-10 md:flex-row md:justify-between">
            <div className="max-w-sm">
              <div className="flex items-center gap-2.5">
                <Logo className="h-8 w-8" tone="light" />
                <div className="leading-none">
                  <span className="block text-[15px] font-bold tracking-[0.14em] text-white">BERKSHIRE ENERGY</span>
                  <span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.22em] text-[#5bb6ff]">
                    Powering tomorrow. Delivering today.
                  </span>
                </div>
              </div>
              <p className="mt-4 text-sm text-white/55">
                Arizona-based solar &amp; battery experts. We design your system, beat competing
                quotes, and help you own your power for decades — installed by vetted local pros.
              </p>
              <a href="#quote" className="btn btn-solar mt-6">Get my free quote</a>
            </div>

            <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
              <div>
                <div className="text-sm font-semibold text-white">Explore</div>
                <ul className="mt-4 grid gap-2.5 text-sm">
                  <li><a href="#how" className="hover:text-white">How it works</a></li>
                  <li><a href="#savings" className="hover:text-white">Savings</a></li>
                  <li><a href="#battery" className="hover:text-white">Battery storage</a></li>
                  <li><a href="#financing" className="hover:text-white">Financing</a></li>
                  <li><a href="#quote" className="hover:text-white">Free quote</a></li>
                </ul>
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Company</div>
                <ul className="mt-4 grid gap-2.5 text-sm">
                  <li><a href="#reviews" className="hover:text-white">Reviews</a></li>
                  <li><a href="#quote" className="hover:text-white">Get a quote</a></li>
                </ul>
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Contact</div>
                <ul className="mt-4 grid gap-2.5 text-sm">
                  <li><a href="tel:+16233962112" className="hover:text-white">(623) 396-2112</a></li>
                  <li><a href="mailto:hello@berkshireenergy.info" className="hover:text-white">hello@berkshireenergy.info</a></li>
                  <li className="text-white/45">Phoenix, Arizona</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="hairline mt-12 opacity-20" />
          <div className="mt-6 flex flex-col gap-2 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
            <span>© {new Date().getFullYear()} Berkshire Energy. All rights reserved. ROC #000000.</span>
            <span>berkshireenergy.info</span>
          </div>
          <div className="mt-3 text-xs text-white/40">
            <a href="https://berkshireenergy.info/" className="hover:text-white">https://berkshireenergy.info/</a> is associated with ONYX SOLUTIONS LLC.
          </div>
        </div>
      </footer>

      <FloatingQuoteCTA />
      <SupportChat />
    </div>
  )
}
