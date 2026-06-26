'use client'
import dynamic from 'next/dynamic'
import { Headline } from '@/ui/Headline'
import { SavingsPanel } from '@/ui/SavingsPanel'
import { HotspotOverlay } from '@/ui/HotspotOverlay'
import { TopBar } from '@/ui/TopBar'
import { PerspectiveBar } from '@/ui/PerspectiveBar'

const Scene = dynamic(() => import('@/scene/Scene').then((m) => m.Scene), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 grid place-items-center bg-[#050810] text-white/40 text-xs uppercase tracking-[0.3em]">
      Loading 3D · · ·
    </div>
  ),
})

export default function Page() {
  return (
    <main className="experience-root relative h-screen w-screen overflow-hidden bg-[#050810] text-white">
      <div className="absolute inset-0">
        <Scene />
      </div>
      <TopBar />
      <Headline />
      <HotspotOverlay />
      <SavingsPanel />
      <PerspectiveBar />
    </main>
  )
}
