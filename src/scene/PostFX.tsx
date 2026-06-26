'use client'
import {
  Bloom,
  BrightnessContrast,
  DepthOfField,
  EffectComposer,
  HueSaturation,
  N8AO,
  SMAA,
  Vignette,
} from '@react-three/postprocessing'

export function PostFX() {
  return (
    <EffectComposer multisampling={0} stencilBuffer={false}>
      {/* Ambient occlusion grounds geometry — corners and crevices darken
          naturally so the scene stops looking flat / cartoony. */}
      <N8AO aoRadius={0.6} intensity={2.0} distanceFalloff={0.4} quality="high" />
      {/* Soft focus on the house, mild bokeh on the background */}
      <DepthOfField focusDistance={0.015} focalLength={0.04} bokehScale={2.2} />
      <Bloom intensity={0.5} luminanceThreshold={0.65} luminanceSmoothing={0.2} mipmapBlur />
      <BrightnessContrast brightness={0.0} contrast={0.08} />
      <HueSaturation saturation={0.06} hue={0.0} />
      <Vignette eskil={false} offset={0.2} darkness={0.65} />
      <SMAA />
    </EffectComposer>
  )
}
