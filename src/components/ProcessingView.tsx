import { motion } from 'framer-motion'

const stages = ['Analyzing image', 'Understanding visual structure', 'Generating colors', 'Finalizing image']
export function ProcessingView({ stage }: { stage: number }) { return <div className="processing-view"><div className="scan-visual"><div className="scan-line" /><div className="scan-grid" /><span>NEURAL FIELD / {String(stage + 1).padStart(2, '0')}</span></div><p className="eyebrow">PROCESSING IMAGE</p><h3>{stages[stage]}</h3><p className="muted">Your image is being prepared for the colorization pipeline.</p><div className="stage-list">{stages.map((item, index) => <div key={item} className={index === stage ? 'active' : index < stage ? 'complete' : ''}><span>0{index + 1}</span><b>{item}</b><i /></div>)}</div></div> }
