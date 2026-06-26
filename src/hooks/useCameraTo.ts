import { useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { useCallback } from 'react'
import type * as THREE from 'three'

type Vec3 = { x: number; y: number; z: number }

export function useCameraTo() {
  const camera = useThree((s) => s.camera)
  const controls = useThree((s) => s.controls) as
    | (THREE.EventDispatcher & { target: THREE.Vector3; update: () => void; enabled: boolean })
    | null

  return useCallback(
    (pos: Vec3, lookAt: Vec3, duration = 1.2) => {
      gsap.killTweensOf(camera.position)
      gsap.to(camera.position, {
        x: pos.x,
        y: pos.y,
        z: pos.z,
        duration,
        ease: 'power3.inOut',
      })
      if (controls) {
        gsap.killTweensOf(controls.target)
        gsap.to(controls.target, {
          x: lookAt.x,
          y: lookAt.y,
          z: lookAt.z,
          duration,
          ease: 'power3.inOut',
          onUpdate: () => controls.update(),
        })
      }
    },
    [camera, controls]
  )
}
