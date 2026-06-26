'use client'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { useEnergyStore, selectDayFactor } from '@/store/useEnergyStore'

export function Sun() {
  const lightRef = useRef<THREE.DirectionalLight>(null!)
  const sunMeshRef = useRef<THREE.Mesh>(null!)

  useFrame((state, delta) => {
    const store = useEnergyStore.getState()
    if (store.autoTime) {
      const next = (store.timeOfDay + delta * 0.04) % 1
      useEnergyStore.setState({ timeOfDay: next })
    }
    const t = useEnergyStore.getState().timeOfDay
    // arc the sun: at t=0 below horizon, t=0.5 directly above
    const angle = t * Math.PI * 2 - Math.PI / 2
    const radius = 18
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    const z = Math.sin(angle * 0.5) * 4
    if (lightRef.current) {
      lightRef.current.position.set(x, y, z)
      const day = selectDayFactor(t)
      lightRef.current.intensity = day * 2.4
      const warm = new THREE.Color('#ffd9a8')
      const cool = new THREE.Color('#ffffff')
      lightRef.current.color.lerpColors(warm, cool, day)
    }
    if (sunMeshRef.current) {
      sunMeshRef.current.position.set(x, y, z)
      sunMeshRef.current.visible = y > 0
    }
  })

  return (
    <>
      <directionalLight
        ref={lightRef}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
      />
      <mesh ref={sunMeshRef}>
        <sphereGeometry args={[0.8, 24, 24]} />
        <meshBasicMaterial color="#fff2c0" toneMapped={false} />
      </mesh>
    </>
  )
}
