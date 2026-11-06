import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Check, Download, RotateCcw, X } from 'lucide-react'
import { Header } from './components/Header'
import { Scene } from './components/Scene'
import { UploadZone } from './components/UploadZone'
import { ProcessingView } from './components/ProcessingView'
import { BeforeAfterSlider } from './components/BeforeAfterSlider'
import { HowItWorks } from './components/HowItWorks'
import { Technology } from './components/Technology'
import { Footer } from './components/Footer'
import { assetUrl, colorizeImage } from './services/api'
import type { ColorizationResponse, UploadedImage } from './types/colorization'

const motionEase = [0.22, 1, 0.36, 1] as const

function App() {
  const [image, setImage] = useState<UploadedImage | null>(null)
  const [result, setResult] = useState<ColorizationResponse | null>(null)
  const [status, setStatus] = useState<'idle' | 'preview' | 'processing' | 'result'>('idle')
  const [processingStage, setProcessingStage] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { if (status !== 'processing') return; const timer = window.setInterval(() => setProcessingStage((value) => Math.min(3, value + 1)), 850); return () => window.clearInterval(timer) }, [status])
  useEffect(() => { if (status === 'processing' && processingStage === 3) { const timer = window.setTimeout(() => setStatus('result'), 900); return () => window.clearTimeout(timer) } }, [processingStage, status])

  const chooseImage = (selected: UploadedImage) => { setImage(selected); setResult(null); setError(null); setStatus('preview') }
  const removeImage = () => { if (image) URL.revokeObjectURL(image.previewUrl); setImage(null); setResult(null); setError(null); setStatus('idle') }
  const processImage = async () => { if (!image) return; setError(null); setProcessingStage(0); setStatus('processing'); try { const response = await colorizeImage(image.file); setResult(response) } catch (requestError) { setStatus('preview'); setError(requestError instanceof Error ? requestError.message : 'The backend is unavailable. Please try again.') } }
  const reset = () => { setResult(null); setStatus(image ? 'preview' : 'idle') }
  const displayOriginal = result?.original_image_url ?? image?.previewUrl ?? ''

  return <div id="top" className="app-shell"><Header /><main>
    <section className="hero"><div className="hero-content"><motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: motionEase }}><p className="eyebrow"><span className="live-dot" /> AI POWERED IMAGE COLORIZATION</p><h1>Bring black &amp; white<br /><i>photos back to life.</i></h1><p className="hero-copy">Transform grayscale images into vibrant, realistic color using deep learning.</p><div className="hero-actions"><a className="button button-primary" href="#workspace">Start Colorizing <ArrowDown size={16} /></a><a className="text-link" href="#how-it-works">See How It Works <ArrowUpRight size={15} /></a></div></motion.div></div><Scene /><div className="hero-foot"><span>01 / 03</span><span>AI IMAGE RESTORATION</span><span>SCROLL TO EXPLORE ↓</span></div></section>
    <section className="workspace-section" id="workspace"><div className="workspace-heading"><div><p className="eyebrow">THE COLORIZATION LAB</p><h2>Make the <i>moment</i> visible.</h2></div><p className="workspace-note">A private, considered space for giving old photographs<br className="desktop-only" /> a new way to be remembered.</p></div><div className="workspace-shell"><AnimatePresence mode="wait">
      {status === 'idle' && <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><UploadZone onSelected={chooseImage} error={error} /></motion.div>}
      {status === 'preview' && image && <motion.div key="preview" className="preview-workspace" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><div className="preview-image-wrap"><img src={image.previewUrl} alt="Selected grayscale photograph" /><span className="image-badge">SOURCE IMAGE</span></div><div className="preview-details"><div><p className="eyebrow">READY TO COLORIZE</p><h3>{image.file.name}</h3><p className="file-meta">{(image.file.size / (1024 * 1024)).toFixed(2)} MB <b>•</b> {image.width} × {image.height} px</p></div>{error && <p className="form-error">{error}</p>}<div className="preview-actions"><button className="button button-ghost" onClick={removeImage}><X size={15} /> Remove</button><button className="button button-primary" onClick={processImage}>Colorize Image <ArrowUpRight size={16} /></button></div></div></motion.div>}
      {status === 'processing' && <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><ProcessingView stage={processingStage} /></motion.div>}
      {status === 'result' && result && <motion.div key="result" className="result-workspace" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><div className="result-header"><div><p className="eyebrow"><Check size={14} /> COMPLETE</p><h3>Your Colorized Image</h3></div><div className="result-stats"><span><b>{result.processing_time.toFixed(2)}s</b> PROCESSING TIME</span><span><b>{result.width} × {result.height}</b> DIMENSIONS</span></div></div><BeforeAfterSlider original={displayOriginal} colorized={result.colorized_image_url} alt="Processed photograph" /><div className="result-footer"><p>Mock mode preview <span>•</span> The final model will replace this service when connected.</p><div className="result-actions"><button className="button button-ghost" onClick={reset}><RotateCcw size={15} /> Colorize Another</button><a className="button button-primary" href={assetUrl(result.colorized_image_url)} download="colorized-image.png"><Download size={15} /> Download Image</a></div></div></motion.div>}
    </AnimatePresence></div></section>
    <HowItWorks /><Technology />
  </main><Footer /></div>
}

export default App
