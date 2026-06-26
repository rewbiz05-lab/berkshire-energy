'use client'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useEnergyStore } from '@/store/useEnergyStore'

// Inverted sphere with a vertical gradient shader. Color shifts with day factor.
export function SkyDome() {
  const matRef = useRef<THREE.ShaderMaterial>(null!)

  const uniforms = useMemo(
    () => ({
      uTop: { value: new THREE.Color('#0a1530') },
      uBottom: { value: new THREE.Color('#1a2845') },
      uDay: { value: 0.5 },
    }),
    []
  )

  useFrame(() => {
    const t = useEnergyStore.getState().timeOfDay
    // Use the actual sun altitude (matches Sun.tsx) so the sky only warms
    // up while the sun is at or above the horizon.
    const angle = t * Math.PI * 2 - Math.PI / 2
    const sunY = Math.sin(angle) // -1..1
    const altitude = Math.max(0, sunY) // 0 below horizon

    // Top of sky goes from black night → deep blue day.
    // Horizon goes from dark blue night → warm orange at sunrise/sunset → light blue at noon.
    const nightTop = new THREE.Color('#020410')
    const nightBot = new THREE.Color('#0a1530')
    const duskTop = new THREE.Color('#1a2348') // still dark high in the sky
    const duskBot = new THREE.Color('#ff8a3d') // warm orange at horizon
    const dayTop = new THREE.Color('#2c5fb8')
    const dayBot = new THREE.Color('#a8d4ff')

    const top = new THREE.Color()
    const bot = new THREE.Color()

    if (altitude <= 0) {
      top.copy(nightTop)
      bot.copy(nightBot)
    } else if (altitude < 0.35) {
      // Low sun — top stays dark, horizon warms
      const f = altitude / 0.35
      top.copy(nightTop).lerp(duskTop, f)
      bot.copy(nightBot).lerp(duskBot, f)
    } else {
      // Sun is higher — fade from dusk warmth to full daylight blue
      const f = (altitude - 0.35) / 0.65
      top.copy(duskTop).lerp(dayTop, f)
      bot.copy(duskBot).lerp(dayBot, f)
    }

    uniforms.uTop.value.copy(top)
    uniforms.uBottom.value.copy(bot)
    uniforms.uDay.value = altitude
  })

  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[80, 32, 32]} />
      <shaderMaterial
        ref={matRef}
        side={THREE.BackSide}
        uniforms={uniforms}
        depthWrite={false}
        vertexShader={`
          varying vec3 vWorldPosition;
          void main() {
            vec4 worldPos = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPos.xyz;
            gl_Position = projectionMatrix * viewMatrix * worldPos;
          }
        `}
        fragmentShader={`
          uniform vec3 uTop;
          uniform vec3 uBottom;
          varying vec3 vWorldPosition;
          void main() {
            float h = normalize(vWorldPosition).y * 0.5 + 0.5;
            vec3 col = mix(uBottom, uTop, smoothstep(0.0, 0.85, h));
            gl_FragColor = vec4(col, 1.0);
          }
        `}
      />
    </mesh>
  )
}
