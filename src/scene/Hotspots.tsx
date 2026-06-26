'use client'
import { Html } from '@react-three/drei'
import { useEnergyStore, type Hotspot } from '@/store/useEnergyStore'
import { useCameraTo } from '@/hooks/useCameraTo'

type HotspotConfig = {
  id: Exclude<Hotspot, null>
  position: [number, number, number]
  label: string
  cameraPos: { x: number; y: number; z: number }
  lookAt: { x: number; y: number; z: number }
}

const HOTSPOTS: HotspotConfig[] = [
  {
    id: 'roof',
    position: [0, 5.1, 0],
    label: 'Solar Roof',
    cameraPos: { x: 0, y: 10.5, z: 9 },
    lookAt: { x: 0, y: 3.8, z: 0 },
  },
  {
    id: 'battery',
    position: [-3.85, 2.0, 0.3],
    label: 'Battery Storage',
    cameraPos: { x: -9, y: 2.6, z: 2 },
    lookAt: { x: -3.55, y: 1.4, z: 0.6 },
  },
  {
    id: 'panel',
    position: [-3.85, 2.0, 1.2],
    label: 'Main Panel',
    cameraPos: { x: -8.5, y: 2.6, z: 4 },
    lookAt: { x: -3.55, y: 1.6, z: 1.2 },
  },
]

export function Hotspots() {
  const setHotspot = useEnergyStore((s) => s.setHotspot)
  const active = useEnergyStore((s) => s.activeHotspot)
  const introDone = useEnergyStore((s) => s.introDone)
  const systemType = useEnergyStore((s) => s.systemType)
  const cameraTo = useCameraTo()

  if (!introDone) return null

  const visible = HOTSPOTS.filter((h) => {
    if (h.id === 'roof' && systemType === 'battery') return false
    if (h.id === 'battery' && systemType === 'solar') return false
    return true
  })

  return (
    <>
      {visible.map((h) => (
        <group key={h.id} position={h.position}>
          <Html center distanceFactor={10} zIndexRange={[100, 0]}>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setHotspot(h.id)
                cameraTo(h.cameraPos, h.lookAt, 1.2)
              }}
              className={`hotspot-dot ${active === h.id ? 'is-active' : ''}`}
              aria-label={h.label}
            >
              <span className="hotspot-pulse" />
              <span className="hotspot-core" />
              <span className="hotspot-label">{h.label}</span>
            </button>
          </Html>
        </group>
      ))}
    </>
  )
}
