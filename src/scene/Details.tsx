'use client'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { selectDayFactor, useEnergyStore } from '@/store/useEnergyStore'

// ── Reusable materials ──────────────────────────────────────────────────
const sillMat = new THREE.MeshStandardMaterial({ color: '#cfd4dc', roughness: 0.6 })
const frameMat = new THREE.MeshStandardMaterial({ color: '#3a4350', roughness: 0.6 })
const gutterMat = new THREE.MeshStandardMaterial({ color: '#4a5360', roughness: 0.5, metalness: 0.3 })
const foundationMat = new THREE.MeshStandardMaterial({ color: '#5a6068', roughness: 1 })
const chimneyMat = new THREE.MeshStandardMaterial({ color: '#7a5147', roughness: 1 })
const mulchMat = new THREE.MeshStandardMaterial({ color: '#3d2a18', roughness: 1 })
const stoneMat = new THREE.MeshStandardMaterial({ color: '#8a8c8e', roughness: 0.95 })

// ── House details: chimney, gutters, window frames, porch light, foundation
export function HouseArchitecture() {
  return (
    <group>
      {/* Chimney on the right side of the main house roof */}
      <group position={[2.5, 0, -0.4]}>
        <mesh castShadow receiveShadow material={chimneyMat} position={[0, 4.05, 0]}>
          <boxGeometry args={[0.7, 1.8, 0.7]} />
        </mesh>
        {/* chimney cap */}
        <mesh castShadow material={frameMat} position={[0, 4.97, 0]}>
          <boxGeometry args={[0.82, 0.06, 0.82]} />
        </mesh>
      </group>

      {/* Foundation strip — visible dark band at the base */}
      <mesh receiveShadow position={[0, 0.12, 0]} material={foundationMat}>
        <boxGeometry args={[7.05, 0.24, 5.65]} />
      </mesh>
      {/* garage foundation */}
      <mesh receiveShadow position={[5.2, 0.12, 2.0]} material={foundationMat}>
        <boxGeometry args={[3.25, 0.24, 3.45]} />
      </mesh>

      {/* Gutters along the eaves of the main house (front + back) */}
      <mesh castShadow position={[0, 3.09, 3.08]} material={gutterMat}>
        <boxGeometry args={[7.6, 0.06, 0.06]} />
      </mesh>
      <mesh castShadow position={[0, 3.09, -3.08]} material={gutterMat}>
        <boxGeometry args={[7.6, 0.06, 0.06]} />
      </mesh>
      {/* downspout */}
      <mesh castShadow position={[3.72, 1.65, 3.08]} material={gutterMat}>
        <boxGeometry args={[0.05, 2.95, 0.05]} />
      </mesh>

      {/* Window frames + sills (matches the new window positions) */}
      {([
        [-2.0, 1.5, 2.81, 1.5, 1.5],
        [2.0, 1.5, 2.81, 1.5, 1.5],
        [0, 2.85, 2.80, 4.4, 0.4],
      ] as [number, number, number, number, number][]).map(([x, y, z, w, h], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh position={[0, 0, -0.005]} material={frameMat}>
            <boxGeometry args={[w + 0.18, h + 0.18, 0.04]} />
          </mesh>
          <mesh castShadow position={[0, -h / 2 - 0.07, 0.05]} material={sillMat}>
            <boxGeometry args={[w + 0.28, 0.06, 0.18]} />
          </mesh>
          <mesh position={[0, 0, 0.04]} material={frameMat}>
            <boxGeometry args={[w + 0.18, 0.05, 0.01]} />
          </mesh>
          <mesh position={[0, 0, 0.04]} material={frameMat}>
            <boxGeometry args={[0.05, h + 0.18, 0.01]} />
          </mesh>
        </group>
      ))}

      {/* Door frame + threshold + welcome mat */}
      <group position={[0, 1.0, 2.82]}>
        <mesh position={[0, 0, -0.005]} material={frameMat}>
          <boxGeometry args={[1.22, 2.16, 0.04]} />
        </mesh>
        <mesh castShadow position={[0, -1.08, 0.1]} material={stoneMat}>
          <boxGeometry args={[1.6, 0.1, 0.55]} />
        </mesh>
        <mesh position={[0, -1.07, 0.37]}>
          <boxGeometry args={[0.8, 0.005, 0.36]} />
          <meshStandardMaterial color="#3a2a1c" roughness={1} />
        </mesh>
        <mesh position={[0.72, 0.55, 0.05]}>
          <boxGeometry args={[0.22, 0.38, 0.02]} />
          <meshStandardMaterial color="#1a2230" roughness={0.6} />
        </mesh>
      </group>

      {/* Porch lights — emissive at night */}
      <PorchLight position={[-0.85, 2.15, 2.86]} />
      <PorchLight position={[0.85, 2.15, 2.86]} />
    </group>
  )
}

function PorchLight({ position }: { position: [number, number, number] }) {
  const matRef = useRef<THREE.MeshStandardMaterial>(null!)
  useFrame(() => {
    const t = useEnergyStore.getState().timeOfDay
    const day = selectDayFactor(t)
    if (matRef.current) {
      matRef.current.emissiveIntensity = THREE.MathUtils.lerp(2.5, 0, day)
    }
  })
  return (
    <group position={position}>
      <mesh castShadow material={frameMat}>
        <boxGeometry args={[0.1, 0.16, 0.06]} />
      </mesh>
      <mesh position={[0, 0, 0.05]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial
          ref={matRef}
          color="#fff2c0"
          emissive="#ffcb78"
          emissiveIntensity={0}
        />
      </mesh>
    </group>
  )
}

// ── Landscape details: mulch beds + flowers + stone walkway + car ───────
export function Landscape() {
  return (
    <>
      <MulchBeds />
      <FlowerClusters />
      <StoneWalkway />
      <LampPost position={[-4.8, 0, 7.0]} />
      <LampPost position={[7.4, 0, 7.0]} />
      <TrashBins position={[6.5, 0, 7.6]} />
      <UtilityPole position={[-17, 0, 7.5]} />
      <Bench position={[-4.0, 0, -1.0]} rotation={0.2} />
    </>
  )
}

function MulchBeds() {
  return (
    <group>
      {/* front bed running along the house */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.014, 3.35]} material={mulchMat}>
        <planeGeometry args={[6.5, 0.7]} />
      </mesh>
      {/* corner beds */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[-3.55, 0.014, 2.4]} material={mulchMat}>
        <planeGeometry args={[0.9, 1.4]} />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[-3.55, 0.014, -2.2]} material={mulchMat}>
        <planeGeometry args={[0.9, 1.2]} />
      </mesh>
    </group>
  )
}

const FLOWER_PALETTE = ['#e7434b', '#f0b429', '#f06292', '#9c27b0', '#ff7043']
const FLOWER_MATS = FLOWER_PALETTE.map(
  (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.85, flatShading: true })
)
const FLOWER_GEOM = new THREE.IcosahedronGeometry(0.08, 0)

function FlowerClusters() {
  const flowers = useMemo(() => {
    const rand = mulberry32(13)
    const out: { x: number; z: number; matIdx: number }[] = []
    for (let i = 0; i < 24; i++) {
      out.push({
        x: -2.8 + i * 0.26 + (rand() - 0.5) * 0.1,
        z: 3.25 + (rand() - 0.5) * 0.4,
        matIdx: Math.floor(rand() * FLOWER_MATS.length),
      })
    }
    return out
  }, [])
  return (
    <group>
      {flowers.map((f, i) => (
        <mesh
          key={i}
          position={[f.x, 0.12, f.z]}
          castShadow
          geometry={FLOWER_GEOM}
          material={FLOWER_MATS[f.matIdx]}
        />
      ))}
    </group>
  )
}

function StoneWalkway() {
  // flagstones from porch threshold (z≈3.3) to sidewalk (z≈7.0)
  const stones = useMemo(() => {
    const out: [number, number][] = []
    for (let i = 0; i < 8; i++) {
      const z = 3.7 + i * 0.5
      out.push([0, z])
    }
    return out
  }, [])
  return (
    <group>
      {stones.map(([x, z], i) => (
        <mesh
          key={i}
          receiveShadow
          rotation={[-Math.PI / 2, 0, ((i * 7) % 4) * 0.04]}
          position={[x, 0.017, z]}
          material={stoneMat}
        >
          <planeGeometry args={[0.7, 0.4]} />
        </mesh>
      ))}
    </group>
  )
}

// Tesla-style (Model Y-ish) silhouette: white body, smooth aerodynamic
// roofline, single LED headlight bar, no grille.
const teslaBodyMat = new THREE.MeshStandardMaterial({
  color: '#f0f2f5',
  roughness: 0.35,
  metalness: 0.55,
})
const teslaTrimMat = new THREE.MeshStandardMaterial({
  color: '#1a1d22',
  roughness: 0.5,
  metalness: 0.4,
})
const teslaGlassMat = new THREE.MeshStandardMaterial({
  color: '#0a0f14',
  roughness: 0.05,
  metalness: 0.6,
  transparent: true,
  opacity: 0.9,
})
const teslaTireMat = new THREE.MeshStandardMaterial({ color: '#0a0a0a', roughness: 0.95 })
const teslaRimMat = new THREE.MeshStandardMaterial({
  color: '#b8bdc4',
  roughness: 0.3,
  metalness: 0.85,
})
const teslaHeadlightMat = new THREE.MeshStandardMaterial({
  color: '#ffffff',
  emissive: '#cfeaff',
  emissiveIntensity: 0.4,
})
const teslaTaillightMat = new THREE.MeshStandardMaterial({
  color: '#330808',
  emissive: '#e7434b',
  emissiveIntensity: 0.6,
})

function DrivewayCar() {
  useFrame(() => {
    const t = useEnergyStore.getState().timeOfDay
    const day = selectDayFactor(t)
    // Headlights on at night, dim during day; LED daytime running lights stay on faintly
    teslaHeadlightMat.emissiveIntensity = day < 0.05 ? 1.8 : 0.35
    teslaTaillightMat.emissiveIntensity = day < 0.1 ? 1.2 : 0.45
  })

  // Park along the driveway, length along Z (north-south), nose toward the road (+Z)
  // Driveway is at x≈3.4. Car length 4.4m. We center it so it sits cleanly
  // behind the fence at z=5.0: tail at z≈0.0, nose at z≈4.4.
  return (
    <group position={[3.4, 0, 2.2]} rotation={[0, 0, 0]}>
      {/* lower body (skirt + frunk) */}
      <mesh castShadow receiveShadow material={teslaBodyMat} position={[0, 0.55, 0]}>
        <boxGeometry args={[1.85, 0.55, 4.4]} />
      </mesh>
      {/* mid body — slightly wider, defines the beltline */}
      <mesh castShadow material={teslaBodyMat} position={[0, 0.85, 0]}>
        <boxGeometry args={[1.92, 0.18, 4.3]} />
      </mesh>
      {/* dark beltline trim under windows */}
      <mesh material={teslaTrimMat} position={[0, 0.94, 0]}>
        <boxGeometry args={[1.94, 0.04, 4.32]} />
      </mesh>
      {/* cabin: tapered Tesla-ish roof (shorter than body) */}
      <mesh castShadow material={teslaBodyMat} position={[0, 1.18, -0.15]}>
        <boxGeometry args={[1.7, 0.4, 2.8]} />
      </mesh>
      {/* sloping rear glass (rotated slab) */}
      <mesh material={teslaGlassMat} position={[0, 1.05, -1.7]} rotation={[0.35, 0, 0]}>
        <boxGeometry args={[1.68, 0.6, 0.05]} />
      </mesh>
      {/* sloping windshield */}
      <mesh material={teslaGlassMat} position={[0, 1.05, 1.4]} rotation={[-0.4, 0, 0]}>
        <boxGeometry args={[1.68, 0.7, 0.05]} />
      </mesh>
      {/* roof glass panel — Tesla's signature all-glass roof */}
      <mesh material={teslaGlassMat} position={[0, 1.38, -0.15]}>
        <boxGeometry args={[1.55, 0.02, 2.4]} />
      </mesh>
      {/* side windows (left + right) */}
      <mesh material={teslaGlassMat} position={[0.86, 1.18, -0.15]}>
        <boxGeometry args={[0.02, 0.36, 2.5]} />
      </mesh>
      <mesh material={teslaGlassMat} position={[-0.86, 1.18, -0.15]}>
        <boxGeometry args={[0.02, 0.36, 2.5]} />
      </mesh>
      {/* LED headlight strip (single thin bar) */}
      <mesh position={[0, 0.7, 2.21]} material={teslaHeadlightMat}>
        <boxGeometry args={[1.6, 0.07, 0.04]} />
      </mesh>
      {/* taillight strip */}
      <mesh position={[0, 0.78, -2.21]} material={teslaTaillightMat}>
        <boxGeometry args={[1.7, 0.08, 0.04]} />
      </mesh>
      {/* door handles (flush, Tesla-style) */}
      {([
        [0.94, 0.95, 0.8],
        [0.94, 0.95, -0.6],
        [-0.94, 0.95, 0.8],
        [-0.94, 0.95, -0.6],
      ] as [number, number, number][]).map(([x, y, z], i) => (
        <mesh key={`h${i}`} position={[x, y, z]} material={teslaTrimMat}>
          <boxGeometry args={[0.02, 0.04, 0.16]} />
        </mesh>
      ))}
      {/* wheels — Gemini-style alloys */}
      {([
        [0.93, 1.5],
        [0.93, -1.5],
        [-0.93, 1.5],
        [-0.93, -1.5],
      ] as [number, number][]).map(([x, z], i) => (
        <group key={`w${i}`} position={[x, 0.34, z]}>
          <mesh castShadow material={teslaTireMat} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.34, 0.34, 0.2, 22]} />
          </mesh>
          <mesh material={teslaRimMat} position={[x > 0 ? 0.11 : -0.11, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.24, 0.24, 0.02, 22]} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function LampPost({ position }: { position: [number, number, number] }) {
  const matRef = useRef<THREE.MeshStandardMaterial>(null!)
  useFrame(() => {
    const t = useEnergyStore.getState().timeOfDay
    const day = selectDayFactor(t)
    if (matRef.current) {
      matRef.current.emissiveIntensity = THREE.MathUtils.lerp(3.2, 0, day)
    }
  })
  return (
    <group position={position}>
      <mesh castShadow position={[0, 1.5, 0]} material={frameMat}>
        <cylinderGeometry args={[0.05, 0.06, 3, 10]} />
      </mesh>
      <mesh castShadow position={[0, 3.1, 0]} material={frameMat}>
        <boxGeometry args={[0.5, 0.05, 0.1]} />
      </mesh>
      <mesh position={[0, 3.0, 0]}>
        <boxGeometry args={[0.32, 0.12, 0.32]} />
        <meshStandardMaterial
          ref={matRef}
          color="#fff7d6"
          emissive="#ffcb78"
          emissiveIntensity={0}
        />
      </mesh>
    </group>
  )
}

function TrashBins({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Bin x={0} mat={binBlueMat} />
      <Bin x={0.7} mat={binGreenMat} />
    </group>
  )
}

const binBlueMat = new THREE.MeshStandardMaterial({ color: '#2a4a7a', roughness: 0.6 })
const binGreenMat = new THREE.MeshStandardMaterial({ color: '#446b3c', roughness: 0.6 })
const woodMat = new THREE.MeshStandardMaterial({ color: '#5b463a', roughness: 1 })
const benchMetalMat = new THREE.MeshStandardMaterial({ color: '#1f2933', roughness: 0.5, metalness: 0.3 })

function Bin({ x, mat }: { x: number; mat: THREE.MeshStandardMaterial }) {
  return (
    <group position={[x, 0, 0]}>
      <mesh castShadow position={[0, 0.55, 0]} material={mat}>
        <boxGeometry args={[0.5, 1.1, 0.55]} />
      </mesh>
      <mesh castShadow position={[0, 1.13, 0]} material={mat}>
        <boxGeometry args={[0.54, 0.06, 0.58]} />
      </mesh>
    </group>
  )
}

function UtilityPole({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 3.0, 0]} material={woodMat}>
        <cylinderGeometry args={[0.1, 0.12, 6, 10]} />
      </mesh>
      <mesh castShadow position={[0, 5.5, 0]} material={woodMat}>
        <boxGeometry args={[1.4, 0.1, 0.1]} />
      </mesh>
    </group>
  )
}

function Bench({ position, rotation }: { position: [number, number, number]; rotation: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh castShadow receiveShadow position={[0, 0.42, 0]} material={woodMat}>
        <boxGeometry args={[1.3, 0.06, 0.4]} />
      </mesh>
      <mesh castShadow position={[0, 0.7, -0.18]} material={woodMat}>
        <boxGeometry args={[1.3, 0.45, 0.05]} />
      </mesh>
      <mesh castShadow position={[-0.55, 0.2, 0]} material={benchMetalMat}>
        <boxGeometry args={[0.08, 0.42, 0.36]} />
      </mesh>
      <mesh castShadow position={[0.55, 0.2, 0]} material={benchMetalMat}>
        <boxGeometry args={[0.08, 0.42, 0.36]} />
      </mesh>
    </group>
  )
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
