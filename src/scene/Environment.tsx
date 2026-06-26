'use client'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { selectDayFactor, useEnergyStore } from '@/store/useEnergyStore'
import { PitchedRoof } from './Roof'
import { Landscape } from './Details'

// Deterministic PRNG so tree positions are stable
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function SceneEnvironment() {
  return (
    <>
      <Stars />
      <Moon />
      <Mountains />
      <Clouds />
      <TreesRing />
      <NeighborHouses />
      <FrontYardBushes />
      <Sidewalk />
      <Road />
      <Fence />
      <Mailbox />
      <Landscape />
    </>
  )
}

function Stars() {
  const meshRef = useRef<THREE.Points>(null!)
  const matRef = useRef<THREE.PointsMaterial>(null!)

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const N = 600
    const positions = new Float32Array(N * 3)
    const rand = mulberry32(7)
    for (let i = 0; i < N; i++) {
      // upper hemisphere only
      const theta = rand() * Math.PI * 2
      const phi = Math.acos(rand() * 0.95) // bias upward
      const r = 70
      positions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.cos(phi)
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
    }
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return g
  }, [])

  useFrame(() => {
    const t = useEnergyStore.getState().timeOfDay
    const day = selectDayFactor(t)
    if (matRef.current) {
      matRef.current.opacity = THREE.MathUtils.clamp(1 - day * 2.5, 0, 1)
    }
  })

  return (
    <points ref={meshRef} geometry={geom}>
      <pointsMaterial
        ref={matRef}
        color="#ffffff"
        size={0.35}
        sizeAttenuation
        transparent
        depthWrite={false}
      />
    </points>
  )
}

// Footprint exclusion zones (x, z, radius) so trees don't spawn inside
// the main house, garage, road, or neighbor houses.
const EXCLUSIONS: [number, number, number][] = [
  [0, 0, 7], // main house body (bigger)
  [5.2, 2.0, 4], // garage (bigger)
  [0, 10, 3.5], // road in front
  [-14, -4, 4.5], // left neighbor
  [14, -2, 4.5], // right neighbor
  [-22, -10, 4],
  [18, -14, 4],
  [-6, -16, 4],
  [22, 4, 4],
]

function clearOfExclusions(x: number, z: number) {
  for (const [ex, ez, er] of EXCLUSIONS) {
    const dx = x - ex
    const dz = z - ez
    if (dx * dx + dz * dz < er * er) return false
  }
  return true
}

function TreesRing() {
  // Scatter trees in a ring around the house, avoiding the front (positive Z)
  const trees = useMemo(() => {
    const rand = mulberry32(42)
    const out: { pos: [number, number, number]; scale: number; rot: number; kind: 0 | 1 }[] = []
    const TARGET = 28
    let attempts = 0
    while (out.length < TARGET && attempts < 400) {
      attempts++
      const radius = 10 + rand() * 14
      const angle = rand() * Math.PI * 2
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      // keep front yard mostly open
      if (z > 5 && Math.abs(x) < 6 && z < 14) continue
      // skip if it overlaps a neighbor house, the road, or this house
      if (!clearOfExclusions(x, z)) continue
      const scale = 0.85 + rand() * 0.8
      const rot = rand() * Math.PI * 2
      const kind = rand() > 0.55 ? 1 : 0
      out.push({ pos: [x, 0, z], scale, rot, kind })
    }
    return out
  }, [])

  return (
    <group>
      {trees.map((t, i) => (t.kind === 0 ? <PineTree key={i} {...t} /> : <BushTree key={i} {...t} />))}
    </group>
  )
}

const trunkGeom = new THREE.CylinderGeometry(0.12, 0.18, 1.4, 8)
const trunkMat = new THREE.MeshStandardMaterial({ color: '#3a2a1c', roughness: 1 })

const pineFoliageGeom = new THREE.ConeGeometry(0.95, 2.4, 9)
const pineFoliageMat = new THREE.MeshStandardMaterial({ color: '#1d3a26', roughness: 0.9 })

const bushFoliageGeom = new THREE.IcosahedronGeometry(1, 0)
const bushFoliageMat = new THREE.MeshStandardMaterial({ color: '#2f5235', roughness: 0.95, flatShading: true })

function PineTree({
  pos,
  scale,
  rot,
}: {
  pos: [number, number, number]
  scale: number
  rot: number
}) {
  return (
    <group position={pos} rotation={[0, rot, 0]} scale={scale}>
      <mesh castShadow receiveShadow geometry={trunkGeom} material={trunkMat} position={[0, 0.7, 0]} />
      <mesh
        castShadow
        receiveShadow
        geometry={pineFoliageGeom}
        material={pineFoliageMat}
        position={[0, 2.4, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={pineFoliageGeom}
        material={pineFoliageMat}
        position={[0, 1.7, 0]}
        scale={1.25}
      />
    </group>
  )
}

function BushTree({
  pos,
  scale,
  rot,
}: {
  pos: [number, number, number]
  scale: number
  rot: number
}) {
  return (
    <group position={pos} rotation={[0, rot, 0]} scale={scale}>
      <mesh castShadow receiveShadow geometry={trunkGeom} material={trunkMat} position={[0, 0.55, 0]} scale={[0.7, 0.8, 0.7]} />
      <mesh
        castShadow
        receiveShadow
        geometry={bushFoliageGeom}
        material={bushFoliageMat}
        position={[0, 1.5, 0]}
        scale={1.05}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={bushFoliageGeom}
        material={bushFoliageMat}
        position={[0.6, 1.3, 0.2]}
        scale={0.75}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={bushFoliageGeom}
        material={bushFoliageMat}
        position={[-0.5, 1.4, -0.3]}
        scale={0.85}
      />
    </group>
  )
}

const neighborWallMat = new THREE.MeshStandardMaterial({ color: '#c9cdd4', roughness: 0.9 })
const neighborWallWarmMat = new THREE.MeshStandardMaterial({ color: '#d8c6a8', roughness: 0.9 })
const neighborRoofMat = new THREE.MeshStandardMaterial({ color: '#23282f', roughness: 0.7 })

function NeighborHouses() {
  const distant = useMemo(() => {
    const rand = mulberry32(11)
    return [
      [-22, -10],
      [18, -14],
      [-6, -16],
      [22, 4],
    ].map(([x, z]) => ({
      x,
      z,
      rot: (rand() - 0.5) * 0.6,
      w: 4 + rand() * 2,
      h: 2 + rand() * 0.5,
      d: 3.5 + rand(),
    }))
  }, [])

  return (
    <group>
      {/* Left neighbor */}
      <group position={[-14, 0, -4]} rotation={[0, 0.4, 0]}>
        <mesh castShadow receiveShadow position={[0, 1.1, 0]} material={neighborWallMat}>
          <boxGeometry args={[5, 2.2, 4.5]} />
        </mesh>
        <PitchedRoof
          eaveY={2.2}
          width={5.4}
          depth={4.8}
          pitch={Math.PI / 6.5}
          material={neighborRoofMat}
          gableColor="#c9cdd4"
        />
        <mesh position={[1.4, 1.2, 2.26]}>
          <boxGeometry args={[1.0, 1.0, 0.04]} />
          <meshStandardMaterial color="#0a1320" emissive="#ffcb78" emissiveIntensity={0.6} />
        </mesh>
      </group>
      {/* Right neighbor */}
      <group position={[14, 0, -3]} rotation={[0, -0.5, 0]}>
        <mesh castShadow receiveShadow position={[0, 1.0, 0]} material={neighborWallWarmMat}>
          <boxGeometry args={[5.4, 2.0, 4.0]} />
        </mesh>
        <PitchedRoof
          eaveY={2.0}
          width={5.8}
          depth={4.4}
          pitch={Math.PI / 7}
          material={neighborRoofMat}
          gableColor="#d8c6a8"
        />
        <mesh position={[-1.6, 1.0, 2.01]}>
          <boxGeometry args={[1.0, 0.9, 0.04]} />
          <meshStandardMaterial color="#0a1320" emissive="#ffd28a" emissiveIntensity={0.5} />
        </mesh>
      </group>
      {/* Distant houses with simple pitched roofs */}
      {distant.map((d, i) => (
        <group key={i} position={[d.x, 0, d.z]} rotation={[0, d.rot, 0]}>
          <mesh castShadow receiveShadow position={[0, d.h / 2, 0]} material={neighborWallMat}>
            <boxGeometry args={[d.w, d.h, d.d]} />
          </mesh>
          <PitchedRoof
            eaveY={d.h}
            width={d.w + 0.4}
            depth={d.d + 0.3}
            pitch={Math.PI / 6.5}
            material={neighborRoofMat}
            gableColor="#c9cdd4"
          />
        </group>
      ))}
    </group>
  )
}

function Sidewalk() {
  return (
    <group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 7.0]}>
        <planeGeometry args={[24, 1.6]} />
        <meshStandardMaterial color="#6f7682" roughness={0.95} />
      </mesh>
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[-11 + i * 2, 0.021, 7.0]}>
          <planeGeometry args={[0.04, 1.6]} />
          <meshBasicMaterial color="#3d434b" />
        </mesh>
      ))}
    </group>
  )
}

function Road() {
  return (
    <group position={[0, 0.005, 10]}>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[46, 3.8]} />
        <meshStandardMaterial color="#1a1d22" roughness={0.95} />
      </mesh>
      {Array.from({ length: 11 }).map((_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[-20 + i * 4, 0.01, 0]}>
          <planeGeometry args={[1.6, 0.14]} />
          <meshStandardMaterial color="#d6c66a" emissive="#3a2e0c" />
        </mesh>
      ))}
    </group>
  )
}

function Fence() {
  const posts: [number, number][] = []
  // Skip posts where the walkway crosses (x near 0) and where the driveway crosses (x near 5.2)
  for (let i = -10; i <= 10; i++) {
    const x = i * 1.0
    if (Math.abs(x) < 0.9) continue
    if (Math.abs(x - 5.2) < 1.6) continue
    posts.push([x, 6.0])
  }
  return (
    <group>
      {posts.map(([x, z], i) => (
        <mesh key={`p${i}`} castShadow position={[x, 0.55, z]}>
          <boxGeometry args={[0.08, 1.1, 0.08]} />
          <meshStandardMaterial color="#e4ddd0" roughness={0.85} />
        </mesh>
      ))}
      {/* top rail, with gaps at the walkway and driveway */}
      <FenceRail x={-7.5} length={6.6} y={0.95} />
      <FenceRail x={-7.5} length={6.6} y={0.3} />
      <FenceRail x={2.6} length={4.4} y={0.95} />
      <FenceRail x={2.6} length={4.4} y={0.3} />
      <FenceRail x={8.7} length={3.6} y={0.95} />
      <FenceRail x={8.7} length={3.6} y={0.3} />
    </group>
  )
}

function FenceRail({ x, length, y }: { x: number; length: number; y: number }) {
  return (
    <mesh castShadow position={[x, y, 6.0]}>
      <boxGeometry args={[length, 0.08, 0.08]} />
      <meshStandardMaterial color="#e4ddd0" roughness={0.85} />
    </mesh>
  )
}

// Distant mountain silhouette ring — low-poly triangles around the horizon
function Mountains() {
  const peaks = useMemo(() => {
    const rand = mulberry32(99)
    const out: { x: number; z: number; w: number; h: number }[] = []
    for (let i = 0; i < 26; i++) {
      const angle = (i / 26) * Math.PI * 2 + (rand() - 0.5) * 0.1
      const r = 48 + rand() * 6
      out.push({
        x: Math.cos(angle) * r,
        z: Math.sin(angle) * r,
        w: 8 + rand() * 6,
        h: 4 + rand() * 5,
      })
    }
    return out
  }, [])

  return (
    <group>
      {peaks.map((p, i) => (
        <mesh key={i} position={[p.x, p.h / 2 - 0.2, p.z]}>
          <coneGeometry args={[p.w / 2, p.h, 4]} />
          <meshStandardMaterial color="#1a2230" roughness={1} flatShading />
        </mesh>
      ))}
    </group>
  )
}

// Cloud puffs scattered high in the sky. Soft, low opacity, daylight only.
function Clouds() {
  const clouds = useMemo(() => {
    const rand = mulberry32(7)
    return Array.from({ length: 12 }).map(() => ({
      x: (rand() - 0.5) * 80,
      z: (rand() - 0.5) * 80 - 10,
      y: 14 + rand() * 6,
      scale: 2 + rand() * 3,
      drift: rand() * 0.3 + 0.05,
    }))
  }, [])

  const groupRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    const t = useEnergyStore.getState().timeOfDay
    const day = selectDayFactor(t)
    cloudMatMain.opacity = day * 0.7
    cloudMatSecondary.opacity = day * 0.55
    if (groupRef.current) {
      groupRef.current.position.x = ((state.clock.elapsedTime * 0.15) % 40) - 20
    }
  })

  return (
    <group ref={groupRef}>
      {clouds.map((c, i) => (
        <group key={i} position={[c.x, c.y, c.z]} scale={c.scale}>
          <mesh geometry={CLOUD_GEOM_BIG} material={cloudMatMain} />
          <mesh position={[0.9, -0.1, 0.1]} scale={0.7} geometry={CLOUD_GEOM_SMALL} material={cloudMatSecondary} />
          <mesh position={[-0.85, 0.05, -0.2]} scale={0.8} geometry={CLOUD_GEOM_SMALL} material={cloudMatSecondary} />
        </group>
      ))}
    </group>
  )
}

const CLOUD_GEOM_BIG = new THREE.SphereGeometry(1, 10, 10)
const CLOUD_GEOM_SMALL = new THREE.SphereGeometry(1, 8, 8)
const cloudMatMain = new THREE.MeshStandardMaterial({
  color: '#ffffff',
  roughness: 1,
  transparent: true,
  opacity: 0.65,
  depthWrite: false,
})
const cloudMatSecondary = new THREE.MeshStandardMaterial({
  color: '#ffffff',
  roughness: 1,
  transparent: true,
  opacity: 0.55,
  depthWrite: false,
})

function Moon() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const matRef = useRef<THREE.MeshBasicMaterial>(null!)

  useFrame(() => {
    const t = useEnergyStore.getState().timeOfDay
    const day = selectDayFactor(t)
    // Moon is opposite the sun: when sun is up, moon is below
    // Sun angle in Sun.tsx: t * 2π - π/2
    // Moon angle: + π
    const angle = t * Math.PI * 2 - Math.PI / 2 + Math.PI
    const r = 50
    if (meshRef.current) {
      meshRef.current.position.set(
        Math.cos(angle) * r,
        Math.sin(angle) * r,
        Math.sin(angle * 0.5) * 10
      )
      meshRef.current.visible = Math.sin(angle) > 0 && day < 0.3
    }
    if (matRef.current) {
      matRef.current.opacity = THREE.MathUtils.clamp(1 - day * 3, 0, 1)
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.4, 24, 24]} />
      <meshBasicMaterial ref={matRef} color="#f6efd9" toneMapped={false} transparent />
    </mesh>
  )
}

// Bushes around the foundation of the main house for landscaping
function FrontYardBushes() {
  const bushes = useMemo(() => {
    const rand = mulberry32(3)
    const positions: { x: number; z: number; s: number; r: number }[] = []
    // line along front of house, both sides of walkway
    for (let i = 0; i < 6; i++) {
      const xSide = i < 3 ? -1 : 1
      const xOff = -1.8 + (i % 3) * 0.6
      positions.push({
        x: xSide * 1.0 + xOff * xSide,
        z: 2.4,
        s: 0.45 + rand() * 0.25,
        r: rand() * Math.PI,
      })
    }
    // corner bushes near walls
    positions.push({ x: -2.6, z: 1.8, s: 0.7, r: 0.4 })
    positions.push({ x: -2.6, z: -1.6, s: 0.6, r: 1.2 })
    positions.push({ x: 2.6, z: -1.6, s: 0.6, r: 2.1 })
    return positions
  }, [])

  return (
    <group>
      {bushes.map((b, i) => (
        <mesh
          key={i}
          castShadow
          receiveShadow
          position={[b.x, b.s * 0.6, b.z]}
          rotation={[0, b.r, 0]}
          scale={b.s}
          geometry={bushFoliageGeom}
          material={bushFoliageMat}
        />
      ))}
    </group>
  )
}

function Mailbox() {
  return (
    <group position={[-3.0, 0, 7.0]}>
      {/* post */}
      <mesh castShadow position={[0, 0.55, 0]}>
        <boxGeometry args={[0.08, 1.1, 0.08]} />
        <meshStandardMaterial color="#3a2a1c" roughness={1} />
      </mesh>
      {/* box */}
      <mesh castShadow position={[0, 1.18, 0]}>
        <boxGeometry args={[0.32, 0.22, 0.5]} />
        <meshStandardMaterial color="#3a4350" metalness={0.4} roughness={0.5} />
      </mesh>
      {/* red flag */}
      <mesh castShadow position={[0.18, 1.22, 0.18]}>
        <boxGeometry args={[0.02, 0.1, 0.12]} />
        <meshStandardMaterial color="#cc2c1c" emissive="#3a0a08" />
      </mesh>
    </group>
  )
}
