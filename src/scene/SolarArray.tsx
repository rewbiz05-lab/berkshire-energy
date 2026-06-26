'use client'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { selectDayFactor, selectPanelCount, useEnergyStore } from '@/store/useEnergyStore'

// House roof slope is ~7.6m wide × 3.46m along the slope. A fixed 8×5
// grid sized to fit inside it; unused instances are just scaled to zero.
const COLS = 8
const ROWS = 5
const MAX_PANELS = COLS * ROWS // 40
const SLOPE_W = 6.6 // leave margin on roof edges
const SLOPE_D = 2.8
const GAP = 0.04
const PANEL_W = (SLOPE_W - (COLS - 1) * GAP) / COLS
const PANEL_H = (SLOPE_D - (ROWS - 1) * GAP) / ROWS
const ROOF_TILT = Math.PI / 6

const panelGeom = new THREE.BoxGeometry(PANEL_W, 0.03, PANEL_H)
const panelMat = new THREE.MeshStandardMaterial({
  color: '#0a1428',
  emissive: '#00e0ff',
  emissiveIntensity: 0,
  metalness: 0.6,
  roughness: 0.25,
})

export function SolarArray() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  // pull reactive values
  const bill = useEnergyStore((s) => s.monthlyBill)
  const offset = useEnergyStore((s) => s.solarOffset)
  const count = selectPanelCount(bill, offset)

  useFrame(() => {
    if (!meshRef.current) return
    const t = useEnergyStore.getState().timeOfDay
    const day = selectDayFactor(t)
    panelMat.emissiveIntensity = day * 1.2

    // layout grid — always fits inside the slope bounds
    const clamped = Math.min(count, MAX_PANELS)
    for (let i = 0; i < clamped; i++) {
      const col = i % COLS
      const row = Math.floor(i / COLS)
      const x = (col - (COLS - 1) / 2) * (PANEL_W + GAP)
      const z = (row - (ROWS - 1) / 2) * (PANEL_H + GAP)
      dummy.position.set(x, 0.05, z)
      dummy.rotation.set(0, 0, 0)
      dummy.scale.setScalar(1)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    const empty = new THREE.Matrix4().makeScale(0, 0, 0)
    for (let i = clamped; i < MAX_PANELS; i++) {
      meshRef.current.setMatrixAt(i, empty)
    }
    meshRef.current.count = MAX_PANELS
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  // Mount on the front-facing slope of the main house roof. With the
  // bigger house, slope center is at world (0, 3.97, 1.5) tilted by
  // +ROOF_TILT around X. Offset along the slope normal so panels sit
  // just above the surface.
  return (
    <group position={[0, 4.0, 1.52]} rotation={[ROOF_TILT, 0, 0]}>
      <instancedMesh
        ref={meshRef}
        args={[panelGeom, panelMat, MAX_PANELS]}
        castShadow
        receiveShadow
      />
    </group>
  )
}
