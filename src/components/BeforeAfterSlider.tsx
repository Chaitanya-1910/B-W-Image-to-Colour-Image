import { useRef, useState } from 'react'
import { GripVertical } from 'lucide-react'
import { assetUrl } from '../services/api'

type Props = { original: string; colorized: string; alt: string }

export function BeforeAfterSlider({ original, colorized, alt }: Props) {
  const [position, setPosition] = useState(50)
  const ref = useRef<HTMLDivElement>(null)
  const update = (clientX: number) => {
    const bounds = ref.current?.getBoundingClientRect()
    if (!bounds) return
    setPosition(Math.min(100, Math.max(0, ((clientX - bounds.left) / bounds.width) * 100)))
  }
  return (
    <div ref={ref} className="comparison" onPointerMove={(event) => event.buttons > 0 && update(event.clientX)} onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); update(event.clientX) }} role="slider" aria-label="Compare original and colorized image" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(position)} tabIndex={0} onKeyDown={(event) => { if (event.key === 'ArrowLeft') setPosition((value) => Math.max(0, value - 5)); if (event.key === 'ArrowRight') setPosition((value) => Math.min(100, value + 5)) }}>
      <img className="comparison-image comparison-color" src={assetUrl(colorized)} alt={`${alt}, colorized`} />
      <div className="comparison-original" style={{ width: `${position}%` }}><img className="comparison-image" src={assetUrl(original)} alt={`${alt}, original grayscale`} /></div>
      <span className="comparison-label comparison-label-left">ORIGINAL</span>
      <span className="comparison-label comparison-label-right">AI COLORIZED</span>
      <div className="comparison-divider" style={{ left: `${position}%` }}><span><GripVertical size={18} /></span></div>
    </div>
  )
}
