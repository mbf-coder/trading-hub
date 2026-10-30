// Deterministic market engine: seeded candles + institutional indicator suite.
// No API keys required — realistic simulated feed calibrated per asset.

export function hashSeed(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function mulberry32(seed) {
  let a = seed >>> 0
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const TF_SCALE = { M15: 0.22, H1: 0.42, H4: 0.72, D1: 1.0, W1: 2.1 }

export function generateCandles(asset, tfId = 'H1', count = 180) {
  const rand = mulberry32(hashSeed(asset.symbol + ':' + tfId))
  const scale = TF_SCALE[tfId] || 0.5
  const perStep = asset.vol * scale * 0.42
  const driftPick = rand()
  const drift = (driftPick - 0.46) * perStep * 0.55
  let price = asset.base * (1 - drift * count * 0.5)
  const out = []
  const now = Date.now()
  const stepMs = tfMin(tfId) * 60 * 1000
  for (let i = 0; i < count; i++) {
    const o = price
    const shock = (rand() + rand() + rand() - 1.5) / 1.5
    const c = o * (1 + drift + shock * perStep)
    const h = Math.max(o, c) * (1 + rand() * perStep * 0.55)
    const l = Math.min(o, c) * (1 - rand() * perStep * 0.55)
    const v = Math.round(400 + rand() * 1600 + Math.abs(c - o) / o / perStep * 900)
    out.push({ time: now - (count - 1 - i) * stepMs, o, h, l, c, v })
    price = c
  }
  return out
}

function tfMin(tf) {
  return { M15: 15, H1: 60, H4: 240, D1: 1440, W1: 10080 }[tf] || 60
}

export function tickPrice(prev, asset, tfId = 'H1') {
  const scale = (TF_SCALE[tfId] || 0.5) * 0.16
  const mv = (Math.random() + Math.random() + Math.random() - 1.5) / 1.5
  return prev * (1 + mv * asset.vol * scale)
}

export const sma = (arr, p) => {
  if (arr.length < p) return null
  let s = 0
  for (let i = arr.length - p; i < arr.length; i++) s += arr[i]
  return s / p
}

export function emaArr(arr, p) {
  const k = 2 / (p + 1)
  let e = arr[0]
  const out = [e]
  for (let i = 1; i < arr.length; i++) { e = arr[i] * k + e * (1 - k); out.push(e) }
  return out
}
export const lastEma = (arr, p) => (arr.length ? emaArr(arr, p).at(-1) : null)

export function rsi(closes, p = 14) {
  if (closes.length < p + 1) return 50
  let g = 0, l = 0
  for (let i = closes.length - p; i < closes.length; i++) {
    const d = closes[i] - closes[i - 1]
    if (d >= 0) g += d; else l -= d
  }
  if (l === 0) return 100
  const rs = (g / p) / (l / p)
  return 100 - 100 / (1 + rs)
}

export function macd(closes) {
  if (closes.length < 35) return { line: 0, signal: 0, hist: 0 }
  const e12 = emaArr(closes, 12), e26 = emaArr(closes, 26)
  const lineArr = e12.map((v, i) => v - e26[i])
  const sigArr = emaArr(lineArr.slice(-20), 9)
  const line = lineArr.at(-1), signal = sigArr.at(-1)
  return { line, signal, hist: line - signal }
}

export function bollinger(closes, p = 20, mult = 2) {
  const m = sma(closes, p)
  if (m == null) return null
  const slice = closes.slice(-p)
  const sd = Math.sqrt(slice.reduce((a, x) => a + (x - m) ** 2, 0) / p)
  return { mid: m, upper: m + mult * sd, lower: m - mult * sd, width: (2 * mult * sd) / m }
}

export function atr(candles, p = 14) {
  if (candles.length < p + 1) return 0
  let s = 0
  for (let i = candles.length - p; i < candles.length; i++) {
    const c = candles[i], pc = candles[i - 1].c
    s += Math.max(c.h - c.l, Math.abs(c.h - pc), Math.abs(c.l - pc))
  }
  return s / p
}

export function stochastic(candles, p = 14) {
  const slice = candles.slice(-p)
  const hh = Math.max(...slice.map(c => c.h))
  const ll = Math.min(...slice.map(c => c.l))
  if (hh === ll) return 50
  return ((candles.at(-1).c - ll) / (hh - ll)) * 100
}

export function pivots(candles) {
  const last = candles.at(-1)
  const pp = (last.h + last.l + last.c) / 3
  return {
    pp,
    r1: 2 * pp - last.l, s1: 2 * pp - last.h,
    r2: pp + (last.h - last.l), s2: pp - (last.h - last.l),
    r3: last.h + 2 * (pp - last.l), s3: last.l - 2 * (pp - last.h),
  }
}

export function swingLevels(candles) {
  const closes = candles.map(c => c.c)
  let res = -Infinity, sup = Infinity
  const n = Math.min(60, candles.length)
  for (let i = candles.length - n; i < candles.length - 2; i++) {
    const c = candles[i]
    if (c.h > candles[i - 1]?.h && c.h > candles[i + 1]?.h && c.h < closes.at(-1) * 1.08) res = Math.max(res, c.h)
    if (c.l < candles[i - 1]?.l && c.l < candles[i + 1]?.l && c.l > closes.at(-1) * 0.92) sup = Math.min(sup, c.l)
  }
  const last = closes.at(-1)
  if (!isFinite(res)) res = last * 1.012
  if (!isFinite(sup)) sup = last * 0.988
  return { resistance: res, support: sup }
}

export function analyze(asset, candles) {
  const closes = candles.map(c => c.c)
  const last = closes.at(-1)
  const prev = closes.at(-2) ?? last
  const first = closes[0]
  const chg = last - prev
  const chgPct = (chg / prev) * 100
  const perf = ((last - first) / first) * 100
  const s20 = sma(closes, 20), s50 = sma(closes, 50), s200 = sma(closes, Math.min(200, closes.length))
  const e20 = lastEma(closes, 20)
  const r = rsi(closes)
  const m = macd(closes)
  const bb = bollinger(closes)
  const a = atr(candles)
  const st = stochastic(candles)
  const pv = pivots(candles)
  const sw = swingLevels(candles)
  const trend = s20 && s50 ? Math.tanh(((s20 - s50) / last) * 420) : 0
  const mom = Math.tanh(m.hist / (last * asset.vol * 0.08 + 1e-9) * 0.6)
  const rsiSig = r > 70 ? -0.7 : r < 30 ? 0.7 : (r - 50) / 50 * 0.8
  const stochSig = st > 80 ? -0.5 : st < 20 ? 0.5 : (st - 50) / 50 * 0.5
  const bbPos = bb ? (last - bb.mid) / (bb.upper - bb.mid + 1e-9) : 0
  const bbSig = Math.max(-1, Math.min(1, -bbPos * 0.55))
  const pxVsEma = e20 ? Math.tanh(((last - e20) / last) * 380) : 0
  const score = Math.round(((trend * 0.30 + mom * 0.25 + rsiSig * 0.15 + stochSig * 0.10 + bbSig * 0.10 + pxVsEma * 0.10)) * 100)
  const verdict = score >= 25 ? 'BUY' : score <= -25 ? 'SELL' : 'NEUTRAL'
  const confidence = Math.min(96, Math.round(48 + Math.abs(score) * 0.52 + (bb ? (1 - Math.min(1, bb.width * 22)) * 8 : 0)))
  const volatility = a / last
  const volLabel = volatility > asset.vol * 1.25 ? 'High' : volatility < asset.vol * 0.7 ? 'Low' : 'Normal'
  const riskPct = Math.abs(score) < 25 ? 'Range' : Math.abs(score) < 55 ? 'Moderate' : 'Strong'
  const bias = verdict === 'BUY' ? 'long' : verdict === 'SELL' ? 'short' : 'wait'
  const narrative = buildNarrative(asset, { last, chgPct, perf, r, st, m, s20, s50, bb, score, verdict, confidence, volLabel, sw, pv })
  return {
    price: last, chg, chgPct, perf,
    high: Math.max(...candles.slice(-24).map(c => c.h)),
    low: Math.min(...candles.slice(-24).map(c => c.l)),
    s20, s50, s200, e20, rsi: r, macd: m, bb, atrVal: a, stoch: st,
    piv: pv, swing: sw, score, verdict, confidence, volLabel, riskPct, bias, narrative,
  }
}

function buildNarrative(asset, d) {
  const f = (n, dec = null) => n.toLocaleString(undefined, { minimumFractionDigits: dec ?? asset.decimals, maximumFractionDigits: dec ?? asset.decimals })
  const trendTxt = d.s20 && d.s50
    ? d.s20 > d.s50
      ? `price holds above its rising 20-period average with the 50-period curling up beneath — a classic continuation posture`
      : `price sits beneath a declining 20-period average with the 50-period overhead — rallies are corrective until proven otherwise`
    : `trend structure is mixed and best traded level-to-level`
  const momTxt = d.m.hist > 0
    ? `MACD histogram is positive${d.m.line > d.m.signal ? ' and expanding' : ' but compressing — momentum is long but tiring'}`
    : `MACD histogram is negative${d.m.line < d.m.signal ? ' and expanding' : ' but compressing — shorts are in control but exhausting'}`
  const rsiTxt = d.r > 70 ? `RSI ${d.r.toFixed(0)} is overbought — chase with reduced size, buy the first retest of support`
    : d.r < 30 ? `RSI ${d.r.toFixed(0)} is oversold — fades are crowded, look for a higher-low before joining shorts`
    : `RSI ${d.r.toFixed(0)} sits in the tradable mid-zone with room to run either way`
  const bbTxt = d.bb
    ? (d.last > d.bb.upper ? `a close back inside the upper Bollinger band (${f(d.bb.upper)}) would confirm an exhaustion wick` : d.last < d.bb.lower ? `a reclaim of the lower Bollinger band (${f(d.bb.lower)}) would mark short-covering` : `Bollinger mid (${f(d.bb.mid)}) is the intraday magnet; band-edges frame the range`)
    : ''
  return [
    `${asset.symbol} trades at ${f(d.last)} (${d.chgPct >= 0 ? '+' : ''}${d.chgPct.toFixed(2)}% on the session). The desk bias is ${d.verdict} with ${d.confidence}% model confidence — ${trendTxt}.`,
    `Momentum check: ${momTxt}; ${rsiTxt}. Stochastic reads ${d.st.toFixed(0)}, and ${bbTxt}. Volatility regime is ${d.volLabel.toLowerCase()} for this symbol.`,
    `Levels that matter: support ${f(d.sw.support)} then pivot S1 ${f(d.pv.s1)}; resistance ${f(d.sw.resistance)} then R1 ${f(d.pv.r1)}. A sustained break-and-hold beyond either level invalidates the ${d.verdict.toLowerCase()} thesis and flips intraday flow.`,
  ]
}

export function fmt(n, dec = 2) {
  if (n == null || !isFinite(n)) return '—'
  return n.toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec })
}
