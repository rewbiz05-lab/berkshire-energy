'use client'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { selectDayFactor, useEnergyStore } from '@/store/useEnergyStore'
import { batterySoc } from '@/lib/solarMath'
import { SolarArray } from './SolarArray'
import { PitchedRoof } from './Roof'
import { HouseArchitecture } from './Details'

// Procedural modern home: two stacked boxes + pitched roof
export function Home() {
  // window emissive material reacts to time of day. MeshPhysicalMaterial
  // gives proper glass-like reflection + clearcoat.
  const windowMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#0a1320',
        emissive: '#ffcb78',
        emissiveIntensity: 0,
        metalness: 0,
        roughness: 0.05,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
        envMapIntensity: 1.2,
      }),
    []
  )

  const wallMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        // warm eggshell — pure white reads as plastic in PBR
        color: '#e2dccf',
        roughness: 0.95,
        metalness: 0,
        envMapIntensity: 0.6,
      }),
    []
  )

  const accentMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        // deep matte navy — reads as painted trim instead of plastic
        color: '#1a232d',
        roughness: 0.85,
        metalness: 0,
        envMapIntensity: 0.5,
      }),
    []
  )

  const roofMat = useMemo(
    () =>
      // slight metalness + low roughness on the dark slab simulates the
      // micro-sheen of architectural asphalt shingles
      new THREE.MeshStandardMaterial({
        color: '#1d242d',
        roughness: 0.9,
        metalness: 0.05,
        envMapIntensity: 0.55,
      }),
    []
  )

  const groupRef = useRef<THREE.Group>(null!)
  const systemType = useEnergyStore((s) => s.systemType)
  const hasSolar = systemType !== 'battery'
  const hasBattery = systemType !== 'solar'

  useFrame(() => {
    const t = useEnergyStore.getState().timeOfDay
    const day = selectDayFactor(t)
    // windows glow more when it's dark
    windowMat.emissiveIntensity = THREE.MathUtils.lerp(1.6, 0.05, day)
  })

  return (
    <group ref={groupRef}>
      {/* main body — scaled up so we can fit a bigger solar array */}
      <mesh castShadow receiveShadow position={[0, 1.3, 0]} material={wallMat}>
        <boxGeometry args={[7, 2.6, 5.6]} />
      </mesh>

      {/* dark accent band - second story trim */}
      <mesh castShadow receiveShadow position={[0, 2.85, 0]} material={accentMat}>
        <boxGeometry args={[6.4, 0.5, 5.2]} />
      </mesh>

      {/* main house pitched roof — sits cleanly on top at y=3.1 */}
      <PitchedRoof
        eaveY={3.1}
        width={7.6}
        depth={6.0}
        pitch={Math.PI / 6}
        material={roofMat}
      />

      {/* front windows */}
      <mesh position={[-2.0, 1.5, 2.81]} material={windowMat}>
        <boxGeometry args={[1.5, 1.5, 0.06]} />
      </mesh>
      <mesh position={[2.0, 1.5, 2.81]} material={windowMat}>
        <boxGeometry args={[1.5, 1.5, 0.06]} />
      </mesh>
      <mesh position={[0, 2.85, 2.80]} material={windowMat}>
        <boxGeometry args={[4.4, 0.4, 0.06]} />
      </mesh>

      {/* door */}
      <mesh castShadow position={[0, 1.0, 2.82]}>
        <boxGeometry args={[1.05, 2.0, 0.08]} />
        <meshStandardMaterial color="#0d1b2a" roughness={0.5} />
      </mesh>
      <mesh position={[0.35, 1.0, 2.87]}>
        <sphereGeometry args={[0.045]} />
        <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.2} />
      </mesh>

      {/* garage (side) — bigger */}
      <group position={[5.2, 0, 2.0]}>
        <mesh castShadow receiveShadow position={[0, 1.2, 0]} material={wallMat}>
          <boxGeometry args={[3.2, 2.4, 3.4]} />
        </mesh>
        <PitchedRoof
          eaveY={2.4}
          width={3.5}
          depth={3.7}
          pitch={Math.PI / 7}
          material={roofMat}
        />
        {/* garage door */}
        <mesh position={[0, 1.05, 1.72]}>
          <boxGeometry args={[2.7, 1.9, 0.06]} />
          <meshStandardMaterial color="#3a4350" roughness={0.6} />
        </mesh>
      </group>

      {/* electric panel + battery, both mounted on left wall (next to each other) */}
      <ElectricMeter />
      {hasBattery && <Battery />}

      {hasSolar && <SolarArray />}
      <HouseArchitecture />
    </group>
  )
}


function Battery() {
  // mounted on garage left wall — local coords relative to garage group
  const fillRef = useRef<THREE.Mesh>(null!)
  const housingMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#101820',
        roughness: 0.4,
        metalness: 0.6,
      }),
    []
  )
  const fillMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#00e0ff',
        emissive: '#00e0ff',
        emissiveIntensity: 1.6,
        transparent: true,
        opacity: 0.85,
      }),
    []
  )

  useFrame(() => {
    const t = useEnergyStore.getState().timeOfDay
    const day = selectDayFactor(t)
    const soc = batterySoc(t)
    if (fillRef.current) {
      fillRef.current.scale.y = soc
      fillRef.current.position.y = -0.4 + soc * 0.4
      // Cyan when charging (daylight), warm orange when discharging at night
      const warm = new THREE.Color('#ff8a3d')
      const cool = new THREE.Color('#00e0ff')
      ;(fillRef.current.material as THREE.MeshStandardMaterial).color.lerpColors(warm, cool, day)
      ;(fillRef.current.material as THREE.MeshStandardMaterial).emissive.lerpColors(warm, cool, day)
    }
  })

  return (
    <group position={[-3.55, 1.1, 0.3]} rotation={[0, -Math.PI / 2, 0]}>
      <mesh castShadow material={housingMat}>
        <boxGeometry args={[0.95, 1.4, 0.28]} />
      </mesh>
      {/* inner glass */}
      <mesh position={[0, 0, 0.15]}>
        <boxGeometry args={[0.75, 1.18, 0.02]} />
        <meshStandardMaterial color="#000" transparent opacity={0.4} />
      </mesh>
      {/* fluid fill */}
      <mesh ref={fillRef} position={[0, -0.5, 0.155]} material={fillMat}>
        <boxGeometry args={[0.73, 1.18, 0.03]} />
      </mesh>
      {/* logo bar */}
      <mesh position={[0, -0.65, 0.15]}>
        <boxGeometry args={[0.75, 0.05, 0.03]} />
        <meshStandardMaterial color="#00e0ff" emissive="#00e0ff" emissiveIntensity={1.2} />
      </mesh>
    </group>
  )
}

function ElectricMeter() {
  const ringRef = useRef<THREE.Mesh>(null!)
  const ringMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#00e0ff',
        emissive: '#00e0ff',
        emissiveIntensity: 1.5,
      }),
    []
  )

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.6
    }
  })

  return (
    <group position={[-3.55, 1.6, 1.2]} rotation={[0, -Math.PI / 2, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.55, 0.78, 0.22]} />
        <meshStandardMaterial color="#222831" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.12]}>
        <circleGeometry args={[0.2, 32]} />
        <meshStandardMaterial color="#0a0f14" />
      </mesh>
      <mesh ref={ringRef} position={[0, 0, 0.13]} material={ringMat}>
        <ringGeometry args={[0.15, 0.18, 32, 1, 0, Math.PI * 1.2]} />
      </mesh>
    </group>
  )
}
