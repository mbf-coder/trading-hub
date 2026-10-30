export default function Gauge({ score }) {
  const pct = (score + 100) / 200
  const angle = -120 + pct * 240
  const label = score >= 55 ? 'STRONG BUY' : score >= 25 ? 'BUY' : score <= -55 ? 'STRONG SELL' : score <= -25 ? 'SELL' : 'NEUTRAL'
  const color = score >= 25 ? '#2dd4bf' : score <= -25 ? '#fb7185' : '#e8b44a'
  const r = 70
  const cx = 90, cy = 84
  const rad = a => (a * Math.PI) / 180
  const ticks = []
  for (let a = -120; a <= 120; a += 15) {
    const x1 = cx + (r - 8) * Math.cos(rad(a - 90))
    const y1 = cy + (r - 8) * Math.sin(rad(a - 90))
    const x2 = cx + r * Math.cos(rad(a - 90))
    const y2 = cy + r * Math.sin(rad(a - 90))
    ticks.push(<line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke={a < 0 ? '#fb7185' : a > 0 ? '#2dd4bf' : '#8a94a8'} strokeOpacity={0.45} strokeWidth={a % 30 === 0 ? 2.5 : 1.2} />)
  }
  const nx = cx + (r - 22) * Math.cos(rad(angle - 90))
  const ny = cy + (r - 22) * Math.sin(rad(angle - 90))
  return (
    <div className="flex flex-col items-center">
      <svg width="180" height="118" viewBox="0 0 180 118">
        <path d={`M ${cx + r * Math.cos(rad(-120 - 90))} ${cy + r * Math.sin(rad(-120 - 90))} A ${r} ${r} 0 1 1 ${cx + r * Math.cos(rad(120 - 90))} ${cy + r * Math.sin(rad(120 - 90))}`} fill="none" stroke="#1e2b4a" strokeWidth="10" strokeLinecap="round" />
        <path d={`M ${cx + r * Math.cos(rad(-120 - 90))} ${cy + r * Math.sin(rad(-120 - 90))} A ${r} ${r} 0 ${pct > 0.5 ? 1 : 0} 1 ${nx + (22 / (r - 22)) * (nx - cx)} ${ny + (22 / (r - 22)) * (ny - cy)}`} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" />
        {ticks}
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={color} strokeWidth="3" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="6" fill={color} />
      </svg>
      <div className="font-num -mt-3 text-3xl font-semibold" style={{ color }}>{score > 0 ? `+${score}` : score}</div>
      <div className="mt-1 rounded-full border px-3 py-0.5 text-[11px] font-semibold tracking-widest" style={{ borderColor: color + '55', color }}>{label}</div>
    </div>
  )
}
