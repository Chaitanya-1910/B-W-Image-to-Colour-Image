import { Canvas, useFrame } from '@react-three/fiber'
import { Float, PerspectiveCamera, RoundedBox, Environment } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

function GalleryFrame() {
  const group = useRef<THREE.Group>(null)
  useFrame((state) => { if (group.current) { group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.35) * 0.08; group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.025 } })
  return <Float speed={0.7} rotationIntensity={0.08} floatIntensity={0.22}><group ref={group} rotation={[0.04, -0.18, 0.02]}>
    <RoundedBox args={[3.1, 2.18, 0.18]} radius={0.08} smoothness={5}><meshStandardMaterial color="#24231f" metalness={0.72} roughness={0.25} /></RoundedBox>
    <mesh position={[0, 0, 0.11]}><planeGeometry args={[2.7, 1.78]} /><meshStandardMaterial color="#b7b0a1" roughness={0.85} /></mesh>
    <mesh position={[0, 0, 0.125]}><planeGeometry args={[2.3, 1.48]} /><meshStandardMaterial color="#6e6a62" roughness={0.95} /></mesh>
    <mesh position={[-0.68, 0.18, 0.14]} rotation={[0, 0, -0.2]}><planeGeometry args={[0.52, 0.52]} /><meshStandardMaterial color="#d8d0bb" roughness={0.6} /></mesh>
    <mesh position={[0.28, -0.16, 0.14]} rotation={[0, 0, 0.1]}><planeGeometry args={[1.06, 0.42]} /><meshStandardMaterial color="#3d3b35" roughness={0.8} /></mesh>
  </group></Float>
}

export function Scene() { return <div className="scene" aria-hidden="true"><Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}><PerspectiveCamera makeDefault position={[0, 0, 5.3]} /><ambientLight intensity={1.1} /><spotLight position={[2, 4, 4]} intensity={8} angle={0.35} penumbra={1} color="#f6ead2" /><pointLight position={[-3, -1, 2]} intensity={4} color="#97a2a5" /><GalleryFrame /><Environment preset="city" /></Canvas><div className="scene-caption"><span>01</span><strong>LUMINANCE</strong><i /> <span>02</span><strong>CHROMINANCE</strong></div></div> }
