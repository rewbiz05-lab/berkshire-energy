'use client'
import { useEffect } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { useEnergyStore } from '@/store/useEnergyStore'

type OrbitLike = THREE.EventDispatcher & {
  object: THREE.Camera
  target: THREE.Vector3
  getAzimuthalAngle: () => number
  update: () => void
  addEventListener: (ev: string, fn: () => void) => void
  removeEventListener: (ev: string, fn: () => void) => void
}

// Bridges the bottom perspective slider to OrbitControls by rotating the
// camera position around the controls' target on the Y axis.
// - Slider → camera: rotate the camera so the azimuth matches the slider.
// - Camera drag → slider: read the azimuth back into the store.
export function CameraDriver() {
  const controls = useThree((s) => s.controls) as OrbitLike | null

  // Slider → camera
  useEffect(() => {
    if (!controls) return
    let driving = false
    const unsub = useEnergyStore.subscribe((state, prev) => {
      if (state.cameraAzimuth === prev.cameraAzimuth) return
      const desired = (state.cameraAzimuth - 0.5) * Math.PI * 2
      const current = controls.getAzimuthalAngle()
      const delta = wrap(desired - current)
      if (Math.abs(delta) < 1e-4) return
      driving = true
      // Rotate the camera around the target by `delta` radians on Y
      const cam = controls.object
      const offset = cam.position.clone().sub(controls.target)
      const m = new THREE.Matrix4().makeRotationY(delta)
      offset.applyMatrix4(m)
      cam.position.copy(controls.target).add(offset)
      controls.update()
      driving = false
    })
    return unsub

    function wrap(a: number) {
      while (a > Math.PI) a -= Math.PI * 2
      while (a < -Math.PI) a += Math.PI * 2
      return a
    }
  }, [controls])

  // Camera drag → slider
  useEffect(() => {
    if (!controls) return
    const onChange = () => {
      const a = controls.getAzimuthalAngle()
      const wrapped = Math.atan2(Math.sin(a), Math.cos(a))
      const t = wrapped / (Math.PI * 2) + 0.5
      const state = useEnergyStore.getState()
      if (Math.abs(state.cameraAzimuth - t) > 0.003) {
        useEnergyStore.setState({ cameraAzimuth: t })
      }
    }
    controls.addEventListener('change', onChange)
    return () => controls.removeEventListener('change', onChange)
  }, [controls])

  return null
}
