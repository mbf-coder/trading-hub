import { useEffect, useRef, useState } from 'react'

export default function Chart({ candles, asset, showMA = true }) {
  const ref = useRef(null)
  const wrapRef = useRef(null)
  const [hover, setHover] = useState(null)

  useEffect(() => {
    const canvas = ref.current
    const wrap = wrapRef.current
    if (!canvas || !wrap || !candles?.length) return
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const W = wrap.clientWidth
    const H = 380
    canvas.width = W * dpr
    canvas.height = H * dpr
    canvas.style.width = W + 'px'
    canvas.style.height = H + 'px'
    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, W, H)
    const padR = 64, padT = 14, padB = 34, padL = 8
    const cw = W - padL - padR
    const volH = 52
    const priceH = H - padT - padB - volH - 10
    const data = candles.slice(-120)
    let hi = -Infinity, lo = Infinity, vmax = 0
    data.forEach(c => { hi = Math.max(hi, c.h); lo = Math.min(lo, c.l); vmax = Math.max(vmax, c.v) })
    const pad = (hi - lo) * 0.08
    hi += pad; lo -= pad
    const y = p => padT + (1 - (p - lo) / (hi - lo)) * priceH
    const stepX = cw / data.length
    const bw = Math.max(2, stepX * 0.62)
    ctx.strokeStyle = 'rgba(138,148,168,0.12)'
    ctx.fillStyle = 'rgba(138,148,168,0.75)'
    ctx.font = '10px "IBM Plex Mono", monospace'
    ctx.lineWidth = 1
    for (let i = 0; i <= 5; i++) {
      const p = lo + ((hi - lo) * i) / 5
      const yy = y(p)
      ctx.beginPath(); ctx.moveTo(padL, yy); ctx.lineTo(W - padR, yy); ctx.stroke()
      ctx.fillText(p.toFixed(asset.decimals > 3 ? 3 : asset.decimals), W - padR + 8, yy + 3)
    }
    data.forEach((c, i) => {
      const up = c.c >= c.o
      ctx.fillStyle = up ? 'rgba(45,212,191,0.28)' : 'rgba(251,113,133,0.30)'
      const vh = (c.v / vmax) * volH
      const x = padL + i * stepX + (stepX - bw) / 2
      ctx.fillRect(x, padT + priceH + 10 + (volH - vh), bw, vh)
    })
    data.forEach((c, i) => {
      const up = c.c >= c.o
      const x = padL + i * stepX + stepX / 2
      ctx.strokeStyle = up ? '#2dd4bf' : '#fb7185'
      ctx.fillStyle = up ? '#2dd4bf' : '#fb7185'
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(x, y(c.h)); ctx.lineTo(x, y(c.l)); ctx.stroke()
      const yO = y(c.o), yC = y(c.c)
      const top = Math.min(yO, yC)
      const hgt = Math.max(1.5, Math.abs(yC - yO))
      ctx.fillRect(x - bw / 2, top, bw, hgt)
    })
    if (showMA) {
      const closes = data.map(c => c.c)
      const ma = (p, color) => {
        ctx.strokeStyle = color; ctx.lineWidth = 1.6; ctx.beginPath()
        let started = false
        for (let i = p - 1; i < closes.length; i++) {
          let s = 0
          for (let j = i - p + 1; j <= i; j++) s += closes[j]
          const v = s / p
          const x = padL + i * stepX + stepX / 2
          if (!started) { ctx.moveTo(x, y(v)); started = true } else ctx.lineTo(x, y(v))
        }
        ctx.stroke()
      }
      ma(20, '#e8b44a')
      ma(50, '#7c8aff')
    }
    const lp = data.at(-1).c
    ctx.setLineDash([5, 4])
    ctx.strokeStyle = lp >= data.at(-2).c ? 'rgba(45,212,191,0.7)' : 'rgba(251,113,133,0.7)'
    ctx.beginPath(); ctx.moveTo(padL, y(lp)); ctx.lineTo(W - padR, y(lp)); ctx.stroke()
    ctx.setLineDash([])
    if (hover != null && hover >= 0 && hover < data.length) {
      const x = padL + hover * stepX + stepX / 2
      ctx.strokeStyle = 'rgba(232,180,74,0.5)'
      ctx.setLineDash([3, 3])
      ctx.beginPath(); ctx.moveTo(x, padT); ctx.lineTo(x, H - padB); ctx.stroke()
      ctx.setLineDash([])
    }
  }, [candles, asset, hover])
  return (
    <div className="relative w-full select-none">
      <div className="block w-full cursor-crosshair rounded-xl">
        <canvas
          ref={ref}
          onMouseMove={e => {
            const rect = e.currentTarget.getBoundingClientRect()
            const padL = 8, padR = 64
            const dataLen = Math.min(120, candles.length)
            const cw = rect.width - padL - padR
            const stepX = cw / dataLen
            const idx = Math.floor((e.clientX - rect.left - padL) / stepX)
            setHover(Math.max(0, Math.min(dataLen - 1, idx)))
          }}
          onMouseLeave={() => setHover(null)}
          className="block w-full cursor-crosshair rounded-xl"
        />
      </div>
      {hover != null && candles?.length > 0 && (() => {
        const data = candles.slice(-120)
        const c = data[hover]
        if (!c) return null
        const up = c.c >= c.o
        return (
          <div className="pointer-events-none absolute left-3 top-3 flex gap-2 rounded-lg border border-white/10 bg-[#0c1322]/90 px-3 py-1.5 font-num text-[11px] backdrop-blur">
            <span className="text-slate-400">O {c.o.toFixed(asset.decimals)}</span>
            <span className="text-slate-400">H {c.h.toFixed(asset.decimals)}</span>
            <span className="text-slate-400">L {c.l.toFixed(asset.decimals)}</span>
            <span className={up ? 'text-teal-300' : 'text-rose-300'}>C {c.c.toFixed(asset.decimals)}</span>
          </div>
        )
      })()}
    </div>
  )
}
