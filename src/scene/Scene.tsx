'use client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { Suspense } from 'react'
import * as THREE from 'three'
import { Home } from './Home'
import { Ground } from './Ground'
import { Sun } from './Sun'
import { Hotspots } from './Hotspots'
import { PostFX } from './PostFX'
import { SkyDome } from './SkyDome'
import { SceneEnvironment } from './Environment'
import { CameraDriver } from './CameraDriver'

export function Scene() {
  return (
    <Canvas
      shadows={{ type: THREE.PCFSoftShadowMap }}
      dpr={[1, 2]}
      camera={{ position: [0, 7, 18], fov: 38, near: 0.1, far: 200 }}
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
    >
      <Suspense fallback={null}>
        <color attach="background" args={['#070b14']} />
        <fog attach="fog" args={['#070b14', 40, 110]} />
        <hemisphereLight args={['#bfd6ff', '#3a2a1c', 0.35]} />
        <ambientLight intensity={0.18} />
        <Sun />
        <SkyDome />
        <SceneEnvironment />
        <Home />
        <Ground />
        <Hotspots />
        <Environment preset="sunset" environmentIntensity={0.45} />
        <OrbitControls
          makeDefault
          enablePan={false}
          minDistance={7}
          maxDistance={26}
          maxPolarAngle={Math.PI / 2.05}
          minPolarAngle={Math.PI / 6}
          target={[0, 2.0, 0]}
          enableDamping
          dampingFactor={0.08}
          mouseButtons={{
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.ROTATE,
          }}
        />
        <CameraDriver />
        <PostFX />
      </Suspense>
    </Canvas>
  )
}
