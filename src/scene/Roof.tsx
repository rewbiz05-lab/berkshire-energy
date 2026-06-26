'use client'
import { useMemo } from 'react'
import * as THREE from 'three'

// Reusable pitched roof: two slabs meeting at a ridge along the X axis.
// eaveY = Y where the eaves sit. width = X extent (incl. overhang).
// depth = Z extent (incl. overhang). pitch = angle in radians.
export function PitchedRoof({
  eaveY,
  width,
  depth,
  pitch,
  material,
  gableColor = '#e9ecef',
}: {
  eaveY: number
  width: number
  depth: number
  pitch: number
  material: THREE.Material
  gableColor?: string
}) {
  const halfD = depth / 2
  const rise = halfD * Math.tan(pitch)
  const slopeLen = halfD / Math.cos(pitch)
  const midY = eaveY + rise / 2
  const slabThickness = 0.08

  return (
    <group>
      <mesh
        castShadow
        receiveShadow
        material={material}
        rotation={[pitch, 0, 0]}
        position={[0, midY, halfD / 2]}
      >
        <boxGeometry args={[width, slabThickness, slopeLen]} />
      </mesh>
      <mesh
        castShadow
        receiveShadow
        material={material}
        rotation={[-pitch, 0, 0]}
        position={[0, midY, -halfD / 2]}
      >
        <boxGeometry args={[width, slabThickness, slopeLen]} />
      </mesh>
      <GableEnd x={width / 2 - 0.04} eaveY={eaveY} depth={depth} rise={rise} color={gableColor} />
      <GableEnd x={-(width / 2 - 0.04)} eaveY={eaveY} depth={depth} rise={rise} color={gableColor} />
    </group>
  )
}

function GableEnd({
  x,
  eaveY,
  depth,
  rise,
  color,
}: {
  x: number
  eaveY: number
  depth: number
  rise: number
  color: string
}) {
  const shape = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(-depth / 2, 0)
    s.lineTo(depth / 2, 0)
    s.lineTo(0, rise)
    s.lineTo(-depth / 2, 0)
    return s
  }, [depth, rise])

  return (
    <mesh castShadow receiveShadow position={[x, eaveY, 0]} rotation={[0, Math.PI / 2, 0]}>
      <shapeGeometry args={[shape]} />
      <meshStandardMaterial color={color} roughness={0.9} side={THREE.DoubleSide} />
    </mesh>
  )
}
