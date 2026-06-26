'use client'
import { useMemo } from 'react'
import * as THREE from 'three'

// Procedural noise canvas → texture, used for subtle color variation
function makeNoiseTexture(size: number, base: string, vary: number, seed = 1) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')!
  const img = ctx.createImageData(size, size)
  const baseColor = new THREE.Color(base)
  let s = seed * 9301
  const rand = () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
  for (let i = 0; i < size * size; i++) {
    const n = (rand() - 0.5) * vary
    const r = THREE.MathUtils.clamp(baseColor.r + n, 0, 1)
    const g = THREE.MathUtils.clamp(baseColor.g + n, 0, 1)
    const b = THREE.MathUtils.clamp(baseColor.b + n, 0, 1)
    img.data[i * 4 + 0] = r * 255
    img.data[i * 4 + 1] = g * 255
    img.data[i * 4 + 2] = b * 255
    img.data[i * 4 + 3] = 255
  }
  ctx.putImageData(img, 0, 0)
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  return tex
}

export function Ground() {
  const farGrass = useMemo(() => {
    const tex = makeNoiseTexture(256, '#28412c', 0.06, 11)
    tex.repeat.set(40, 40)
    return tex
  }, [])
  const nearGrass = useMemo(() => {
    const tex = makeNoiseTexture(256, '#3a5f40', 0.08, 5)
    tex.repeat.set(8, 8)
    return tex
  }, [])
  const drivewayTex = useMemo(() => {
    const tex = makeNoiseTexture(256, '#2c2f36', 0.04, 3)
    tex.repeat.set(2, 4)
    return tex
  }, [])
  const sidewalkTex = useMemo(() => {
    const tex = makeNoiseTexture(256, '#76808c', 0.04, 7)
    tex.repeat.set(1, 3)
    return tex
  }, [])

  return (
    <group>
      {/* expansive grass field with subtle procedural variation */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]}>
        <circleGeometry args={[70, 64]} />
        <meshStandardMaterial map={farGrass} roughness={1} metalness={0} />
      </mesh>
      {/* closer lawn patch - lighter */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <circleGeometry args={[16, 64]} />
        <meshStandardMaterial map={nearGrass} roughness={1} />
      </mesh>
      {/* driveway */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[5.2, 0.012, 5.0]}>
        <planeGeometry args={[3.0, 5.5]} />
        <meshStandardMaterial map={drivewayTex} roughness={0.92} />
      </mesh>
      {/* front walkway slab from porch to sidewalk */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 5.1]}>
        <planeGeometry args={[1.4, 4.0]} />
        <meshStandardMaterial map={sidewalkTex} roughness={0.95} />
      </mesh>
    </group>
  )
}
