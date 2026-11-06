import { ChangeEvent, DragEvent, useRef, useState } from 'react'
import { FileImage, UploadCloud } from 'lucide-react'
import type { UploadedImage } from '../types/colorization'

type Props = { onSelected: (image: UploadedImage) => void; error: string | null }

export function UploadZone({ onSelected, error }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const loadFile = (file?: File) => { if (!file) return; const url = URL.createObjectURL(file); const image = new Image(); image.onload = () => onSelected({ file, previewUrl: url, width: image.naturalWidth, height: image.naturalHeight }); image.src = url }
  const select = (event: ChangeEvent<HTMLInputElement>) => loadFile(event.target.files?.[0])
  const drop = (event: DragEvent<HTMLDivElement>) => { event.preventDefault(); setDragging(false); loadFile(event.dataTransfer.files[0]) }
  return <div className={`upload-zone ${dragging ? 'is-dragging' : ''} ${error ? 'has-error' : ''}`} onDragOver={(event) => { event.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={drop} onClick={() => inputRef.current?.click()} role="button" tabIndex={0} onKeyDown={(event) => event.key === 'Enter' && inputRef.current?.click()}>
    <input ref={inputRef} type="file" accept="image/jpeg,image/png" onChange={select} hidden />
    <div className="upload-icon"><UploadCloud size={24} strokeWidth={1.5} /></div><p className="upload-title">Drop your image here</p><p className="upload-copy">Upload a black-and-white or grayscale photograph</p><button className="button button-light" type="button" onClick={(event) => { event.stopPropagation(); inputRef.current?.click() }}><FileImage size={16} /> Choose Image</button><span className="format-note">JPG <b>•</b> JPEG <b>•</b> PNG <em>10 MB max</em></span>{error && <p className="form-error">{error}</p>}
  </div>
}
