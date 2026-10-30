import { useEffect, useMemo, useRef, useState } from 'react'
import { Search, TrendingUp, TrendingDown, Star, Activity, Globe, Layers, CandlestickChart, Newspaper, CalendarDays, Calculator, Zap, ArrowUpRight, ArrowDownRight, Clock, Radio, ChevronRight, Flame, ShieldCheck, Crosshair } from 'lucide-react'
import { ASSETS, CATEGORIES, TIMEFRAMES, ECON_CALENDAR, NEWS_TEMPLATES, searchAssets } from './data/assets.js'
import { generateCandles, analyze, tickPrice, fmt } from './lib/engine.js'
import Chart from './components/Chart.jsx'
import Gauge from './components/Gauge.jsx'

const fmtPx = (asset, n) => n.toLocaleString(undefined, { minimumFractionDigits: asset.decimals, maximumFractionDigits: asset.decimals })

function useLivePrices(tf) {
  const [prices, setPrices] = useState(() => Object.fromEntries(ASSETS.map(a => [a.symbol, { p: a.base, chg: 0 }])))
  useEffect(() => {
    const id = setInterval(() => {
      setPrices(prev => {
        const next = { ...prev }
        for (const a of ASSETS) {
          const cur = next[a.symbol]?.p ?? a.base
          const np = tickPrice(cur, a, tf)
          next[a.symbol] = { p: np, chg: ((np - a.base) / a.base) * 100 }
        }
        return next
      })
    }, 1600)
    return () => clearInterval(id)
  }, [tf])
  return prices
}

export default function App() {
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState('all')
  const [symbol, setSymbol] = useState('XAUUSD')
  const [tf, setTf] = useState('H1')
  const [watch, setWatch] = useState(() => { try { return JSON.parse(localStorage.getItem('pm_watch') || '["EURUSD","XAUUSD","US500","NAS100","WTIUSD","USDJPY"]') } catch { return ['EURUSD','XAUUSD','US500','NAS100','WTIUSD','USDJPY'] } })
  const [showSearch, setShowSearch] = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)
  const [clock, setClock] = useState(new Date())
  const [risk, setRisk] = useState({ balance: 10000, riskPct: 1, entry: '', sl: '' })
  const asset = useMemo(() => ASSETS.find(a => a.symbol === symbol) || ASSETS[0], [symbol])
  const prices = useLivePrices(tf)
  const [candles, setCandles] = useState(() => generateCandles(ASSETS.find(a => a.symbol === 'XAUUSD'), 'H1'))
  useEffect(() => { setCandles(generateCandles(asset, tf)) }, [symbol, tf])
  useEffect(() => {
    const id = setInterval(() => {
      setCandles(prev => {
        if (!prev.length) return prev
        const next = [...prev]
        const last = { ...next[next.length - 1] }
        const np = tickPrice(last.c, asset, tf)
        last.c = np; last.h = Math.max(last.h, np); last.l = Math.min(last.l, np); last.v += Math.round(Math.random() * 14)
        next[next.length - 1] = last
        return next
      })
    }, 1800)
    return () => clearInterval(id)
  }, [asset, tf])
  useEffect(() => {
    const id = setInterval(() => setClock(new Date()), 1000)
    const onKey = e => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setShowSearch(true) }
      if (e.key === 'Escape') setShowSearch(false)
    }
    window.addEventListener('keydown', onKey)
    return () => { clearInterval(id); window.removeEventListener('keydown', onKey) }
  }, [])
  useEffect(() => { localStorage.setItem('pm_watch', JSON.stringify(watch)) }, [watch])
  const analysis = useMemo(() => analyze(asset, candles), [asset, candles])
  const live = prices[asset.symbol]
  const results = useMemo(() => { let r = searchAssets(query); if (cat !== 'all') r = r.filter(a => a.category === cat); return r.slice(0, 40) }, [query, cat])
  const movers = useMemo(() => ASSETS.map(a => ({ a, chg: prices[a.symbol]?.chg ?? 0, p: prices[a.symbol]?.p ?? a.base })).sort((x, y) => Math.abs(y.chg) - Math.abs(x.chg)).slice(0, 8), [prices])
  const screener = useMemo(() => ASSETS.filter(a => (cat === 'all' || a.category === cat)).map(a => { const c = generateCandles(a, tf); const an = analyze(a, c); return { a, an, price: prices[a.symbol]?.p ?? an.price } }).sort((x, y) => y.an.score - x.an.score), [cat, tf, prices])
  const toggleWatch = s => setWatch(w => w.includes(s) ? w.filter(x => x !== s) : [...w, s])
  const riskOut = useMemo(() => { const entry = parseFloat(risk.entry) || analysis.price; const sl = parseFloat(risk.sl) || analysis.swing.support; const riskAmt = risk.balance * (risk.riskPct / 100); const perUnit = Math.abs(entry - sl); const size = perUnit > 0 ? riskAmt / perUnit : 0; return { entry, sl, riskAmt, size } }, [risk, analysis])
  const sess = (() => { const h = clock.getUTCHours(); if (h >= 0 && h < 7) return { name: 'Asia', open: ['JPN225','AUDJPY','USDJPY','AUS200'] }; if (h >= 7 && h < 12) return { name: 'London', open: ['EURUSD','GBPUSD','GER40','UK100'] }; if (h >= 12 && h < 20) return { name: 'New York', open: ['US30','US500','NAS100','WTIUSD'] }; return { name: 'Late US / Rollover', open: ['BTCUSD','XAUUSD'] } })()
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100">
      <div className="terminal-grid pointer-events-none fixed inset-0" />
      <div className="pointer-events-none fixed -top-40 left-1/2 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-[#e8b44a]/10 blur-[120px]" />
      <div className="relative z-20 overflow-hidden border-b border-white/10 bg-[#0c1322]/90">
        <div className="ticker-mask flex"><div className="animate-ticker flex w-max items-center gap-8 px-4 py-2">
          {[...ASSETS.slice(0,26), ...ASSETS.slice(0,26)].map((a, i) => { const q = prices[a.symbol]; const up = (q?.chg ?? 0) >= 0
            return (<button key={i} onClick={() => setSymbol(a.symbol)} className="flex items-center gap-2 font-num text-[11px] whitespace-nowrap text-slate-300 hover:text-[#e8b44a]"><span className="font-semibold text-slate-100">{a.symbol}</span><span>{fmtPx(a, q?.p ?? a.base)}</span><span className={up ? 'text-teal-300' : 'text-rose-300'}>{up ? 'UP ' : 'DN '}{Math.abs(q?.chg ?? 0).toFixed(2)}%</span></button>) })}
        </div></div>
      </div>
      <header className="relative z-20 mx-auto flex max-w-[1400px] flex-wrap items-center gap-4 px-5 pt-5">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#e8b44a] to-[#c9962f] font-display text-xl font-bold text-[#070b14]">P</div>
          <div><div className="font-display text-lg font-bold tracking-tight">PulseMarkets <span className="text-[#e8b44a]">Hub</span></div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400"><span className="relative flex h-2 w-2"><span className="animate-pulse-dot absolute h-2 w-2 rounded-full bg-teal-300" /></span>LIVE SIM FEED - FREE FOREVER - NO SIGN-UP</div></div>
        </div>
        <button onClick={() => setShowSearch(true)} className="glass group mx-auto flex w-full max-w-xl items-center gap-3 rounded-2xl px-4 py-3 text-left">
          <Search size={17} className="shrink-0 text-[#e8b44a]" />
          <span className="flex-1 truncate text-sm text-slate-400">Search 60+ pairs — try <span className="text-slate-200">gold</span>, <span className="text-slate-200">JPY</span>, <span className="text-slate-200">Nasdaq</span>...</span>
          <kbd className="hidden rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-num text-[10px] text-slate-400 sm:block">CtrlK</kbd>
        </button>
        <div className="ml-auto flex items-center gap-3">
          <div className="hidden text-right font-num text-[11px] leading-tight text-slate-400 md:block">
            <div className="flex items-center justify-end gap-1.5 text-slate-200"><Clock size={12} /> {clock.toUTCString().slice(17, 25)} UTC</div>
            <div className="mt-0.5 flex items-center justify-end gap-1.5"><Radio size={12} className="text-teal-300" /> {sess.name} session</div>
          </div>
          <a href="https://github.com/mbf-coder/trading-hub" target="_blank" rel="noreferrer" className="rounded-xl border border-[#e8b44a]/30 bg-[#e8b44a]/10 px-4 py-2.5 text-sm font-semibold text-[#e8b44a] transition hover:bg-[#e8b44a]/20">Star on GitHub</a>
        </div>
      </header>
      <section className="relative z-10 mx-auto grid max-w-[1400px] gap-4 px-5 pt-6 lg:grid-cols-[1fr_300px]">
        <div className="glass animate-rise overflow-hidden rounded-3xl p-6 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-teal-300/25 bg-teal-300/10 px-3 py-1 text-[11px] font-semibold tracking-widest text-teal-200"><Zap size={12} /> OPEN ANALYTICS TERMINAL</div>
              <h1 className="font-display text-3xl font-bold leading-[1.05] tracking-tight sm:text-5xl">Every pair. Every signal.<br /><span className="text-[#e8b44a]">One search away.</span></h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-[15px]">Institutional-grade technicals for forex, commodities and indices — RSI, MACD, Bollinger, pivots, support and resistance, and a plain-English desk note. Free, no account, updates tick-by-tick.</p>
            </div>
            <div className="flex gap-6 font-num">
              <div><div className="text-2xl font-semibold text-slate-100">{ASSETS.length}</div><div className="text-[11px] text-slate-500">SYMBOLS</div></div>
              <div><div className="text-2xl font-semibold text-teal-300">6</div><div className="text-[11px] text-slate-500">INDICATORS</div></div>
              <div><div className="text-2xl font-semibold text-[#e8b44a]">0</div><div className="text-[11px] text-slate-500">SIGN-UP</div></div>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {CATEGORIES.map(c => (<button key={c.id} onClick={() => setCat(c.id)} className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${cat === c.id ? 'border-[#e8b44a] bg-[#e8b44a] text-[#070b14]' : 'border-white/10 bg-white/5 text-slate-300 hover:border-[#e8b44a]/50'}`}>{c.label}</button>))}
            <span className="ml-auto hidden items-center gap-1 font-num text-[11px] text-slate-500 sm:flex"><Globe size={12} /> LONDON - NEW YORK - TOKYO - SYDNEY</span>
          </div>
        </div>
        <div className="glass animate-rise rounded-3xl p-5">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-widest text-slate-400"><Flame size={14} className="text-[#e8b44a]" /> TOP MOVERS - LIVE</div>
          <div className="space-y-2">
            {movers.map(({ a, chg, p }) => { const up = chg >= 0
              return (<button key={a.symbol} onClick={() => setSymbol(a.symbol)} className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition ${symbol === a.symbol ? 'border-[#e8b44a]/50 bg-[#e8b44a]/10' : 'border-white/5 bg-white/[0.02] hover:border-white/15'}`}><span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg font-num text-[10px] font-bold ${up ? 'bg-teal-300/15 text-teal-200' : 'bg-rose-400/15 text-rose-200'}`}>{a.flag || a.symbol.slice(0,2)}</span><span className="min-w-0 flex-1"><span className="block truncate text-[13px] font-semibold">{a.symbol}</span><span className="block truncate text-[11px] text-slate-500">{a.name}</span></span><span className="text-right font-num text-[12px]"><span className="block text-slate-100">{fmtPx(a, p)}</span><span className={`flex items-center justify-end gap-0.5 ${up ? 'text-teal-300' : 'text-rose-300'}`}>{up ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}{Math.abs(chg).toFixed(2)}%</span></span></button>) })}
          </div>
        </div>
      </section>
      <main className="relative z-10 mx-auto grid max-w-[1400px] gap-4 px-5 pb-10 pt-4 lg:grid-cols-[280px_1fr_320px]">
        <aside className="glass h-fit rounded-3xl p-4 lg:sticky lg:top-4">
          <div className="mb-3 flex items-center justify-between"><span className="flex items-center gap-2 text-xs font-semibold tracking-widest text-slate-400"><Star size={13} className="text-[#e8b44a]" /> WATCHLIST</span><span className="font-num text-[10px] text-slate-500">{watch.length} saved</span></div>
          <div className="scroll-thin max-h-[420px] space-y-1.5 overflow-y-auto pr-1">
            {watch.map(s => { const a = ASSETS.find(x => x.symbol === s); if (!a) return null; const q = prices[s]; const up = (q?.chg ?? 0) >= 0
              return (<button key={s} onClick={() => setSymbol(s)} className={`group flex w-full items-center gap-2.5 rounded-xl border px-2.5 py-2 text-left ${symbol === s ? 'border-[#e8b44a]/50 bg-[#e8b44a]/10' : 'border-transparent hover:bg-white/5'}`}><span className={`font-num text-[13px] font-bold ${up ? 'text-teal-200' : 'text-rose-200'}`}>{up ? 'UP' : 'DN'}</span><span className="min-w-0 flex-1"><span className="block text-[13px] font-semibold leading-tight">{s}</span><span className="block truncate font-num text-[11px] text-slate-500">{fmtPx(a, q?.p ?? a.base)}</span></span><span className={`font-num text-[11px] ${up ? 'text-teal-300' : 'text-rose-300'}`}>{(q?.chg ?? 0) >= 0 ? '+' : ''}{(q?.chg ?? 0).toFixed(2)}%</span><span onClick={e => { e.stopPropagation(); toggleWatch(s) }} className="hidden text-slate-600 hover:text-rose-300 group-hover:inline">x</span></button>) })}
            {watch.length === 0 && <p className="rounded-xl border border-dashed border-white/10 p-4 text-center text-xs text-slate-500">Star any symbol to pin it here.</p>}
          </div>
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.02] p-3"><div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-slate-300"><ShieldCheck size={12} className="text-teal-300" /> Desk risk rule</div><p className="text-[11px] leading-relaxed text-slate-500">Risk 1pct per idea. Invalidation = close beyond S/R on the signal timeframe.</p></div>
        </aside>
        <section className="min-w-0 space-y-4">
          <div className="glass rounded-3xl p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/5 font-num text-sm font-bold text-[#e8b44a]">{asset.flag || asset.symbol.slice(0,2)}</span>
                <div><div className="flex items-center gap-2"><h2 className="font-display text-xl font-bold">{asset.symbol}</h2><button onClick={() => toggleWatch(asset.symbol)} className={`rounded-lg border px-2 py-1 text-[11px] font-semibold ${watch.includes(asset.symbol) ? 'border-[#e8b44a] bg-[#e8b44a]/15 text-[#e8b44a]' : 'border-white/10 text-slate-400 hover:text-slate-200'}`}>{watch.includes(asset.symbol) ? 'Watching' : 'Watch'}</button><span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold tracking-widest text-slate-400 uppercase">{asset.category}</span></div><p className="text-xs text-slate-500">{asset.name} - {asset.desc}</p></div>
              </div>
              <div className="text-right"><div className={`font-num text-3xl font-semibold ${analysis.chg >= 0 ? 'text-teal-200' : 'text-rose-200'}`}>{fmtPx(asset, live?.p ?? analysis.price)}</div><div className={`font-num text-xs ${analysis.chg >= 0 ? 'text-teal-300' : 'text-rose-300'}`}>{analysis.chg >= 0 ? '+' : ''}{fmt(analysis.chg, asset.decimals)} ({analysis.chgPct >= 0 ? '+' : ''}{analysis.chgPct.toFixed(2)}pct) - 24h {fmtPx(asset, analysis.low)}-{fmtPx(asset, analysis.high)}</div></div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {TIMEFRAMES.map(t => (<button key={t.id} onClick={() => setTf(t.id)} className={`rounded-lg px-3.5 py-1.5 font-num text-xs font-semibold transition ${tf === t.id ? 'bg-[#e8b44a] text-[#070b14]' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'}`}>{t.label}</button>))}
              <span className="ml-auto flex items-center gap-1.5 font-num text-[11px] text-slate-500"><Crosshair size={12} /> hover chart for OHLC - MA20 / MA50</span>
            </div>
            <div className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-[#090e1a]"><Chart candles={candles} asset={asset} /></div>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[['24H HIGH', fmtPx(asset, analysis.high), 'text-slate-100'], ['24H LOW', fmtPx(asset, analysis.low), 'text-slate-100'], ['ATR (VOL)', fmt(analysis.atrVal, asset.decimals), 'text-[#e8b44a]'], ['REGIME', analysis.volLabel.toUpperCase() + ' VOL', analysis.volLabel === 'High' ? 'text-rose-300' : 'text-teal-300']].map(([k, v, c]) => (<div key={k} className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2"><div className="text-[10px] tracking-widest text-slate-500">{k}</div><div className={`font-num text-sm font-semibold ${c}`}>{v}</div></div>))}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-[300px_1fr]">
            <div className="glass rounded-3xl p-5 text-center"><div className="mb-1 text-[11px] font-semibold tracking-widest text-slate-400">DESK VERDICT - {tf}</div><Gauge score={analysis.score} /><div className="mt-3 rounded-xl bg-white/[0.03] p-3 text-left text-[12px] leading-relaxed text-slate-400">Confidence <span className="font-num font-semibold text-slate-100">{analysis.confidence}%</span> - Signal <span className="font-semibold text-slate-100">{analysis.riskPct}</span> - Bias <span className={`font-semibold ${analysis.bias === 'long' ? 'text-teal-300' : analysis.bias === 'short' ? 'text-rose-300' : 'text-[#e8b44a]'}`}>{analysis.bias.toUpperCase()}</span></div></div>
            <div className="glass rounded-3xl p-5">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-widest text-slate-400"><Activity size={13} className="text-[#e8b44a]" /> OSCILLATORS and TREND</div>
              <div className="grid gap-2 sm:grid-cols-2">
                <IndicatorRow name="RSI (14)" value={analysis.rsi.toFixed(1)} signal={analysis.rsi > 70 ? 'Overbought - Sell' : analysis.rsi < 30 ? 'Oversold - Buy' : 'Neutral'} tone={analysis.rsi > 70 ? 'sell' : analysis.rsi < 30 ? 'buy' : 'flat'} />
                <IndicatorRow name="MACD" value={`${analysis.macd.hist >= 0 ? '+' : ''}${fmt(analysis.macd.hist, asset.decimals + 1)}`} signal={analysis.macd.hist > 0 ? 'Bullish momentum' : 'Bearish momentum'} tone={analysis.macd.hist > 0 ? 'buy' : 'sell'} />
                <IndicatorRow name="Stochastic (14)" value={analysis.stoch.toFixed(1)} signal={analysis.stoch > 80 ? 'Overbought' : analysis.stoch < 20 ? 'Oversold' : 'Neutral'} tone={analysis.stoch > 80 ? 'sell' : analysis.stoch < 20 ? 'buy' : 'flat'} />
                <IndicatorRow name="Bollinger pctB" value={analysis.bb ? (((analysis.price - analysis.bb.lower) / (analysis.bb.upper - analysis.bb.lower)) * 100).toFixed(0) + '%' : '-'} signal="Inside bands" tone="flat" />
                <IndicatorRow name="SMA 20 / 50" value={`${fmt(analysis.s20, asset.decimals)} / ${fmt(analysis.s50, asset.decimals)}`} signal={(analysis.s20 ?? 0) > (analysis.s50 ?? 0) ? 'Golden structure - Buy' : 'Death structure - Sell'} tone={(analysis.s20 ?? 0) > (analysis.s50 ?? 0) ? 'buy' : 'sell'} />
                <IndicatorRow name="Price vs EMA 20" value={`${(((analysis.price - (analysis.e20 ?? analysis.price)) / analysis.price) * 100).toFixed(2)}%`} signal={(analysis.e20 ?? 0) < analysis.price ? 'Above EMA - Bid' : 'Below EMA - Offered'} tone={(analysis.e20 ?? 0) < analysis.price ? 'buy' : 'sell'} />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 font-num text-center text-[11px] sm:grid-cols-6">
                {[['S3', analysis.piv.s3], ['S2', analysis.piv.s2], ['S1', analysis.piv.s1], ['PP', analysis.piv.pp], ['R1', analysis.piv.r1], ['R2', analysis.piv.r2]].map(([k, v]) => (<div key={k} className="rounded-lg border border-white/10 bg-white/[0.02] px-1 py-1.5"><div className="text-slate-500">{k}</div><div className="font-semibold text-slate-200">{fmt(v, asset.decimals)}</div></div>))}
              </div>
            </div>
          </div>
          <div className="glass rounded-3xl p-5 sm:p-6">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-widest text-slate-400"><Newspaper size={13} className="text-[#e8b44a]" /> DESK NOTE</div>
            <div className="space-y-3">{analysis.narrative.map((p, i) => (<p key={i} className={`text-[13.5px] leading-relaxed ${i === 0 ? 'text-slate-100' : 'text-slate-400'}`}><span className="mr-2 font-num text-[11px] text-[#e8b44a]">0{i + 1}</span>{p}</p>))}</div>
            <div className="mt-4 grid gap-2 sm:grid-cols-3"><LevelCard label="SUPPORT ZONE" value={fmtPx(asset, analysis.swing.support)} hint={`Pivot S1 ${fmtPx(asset, analysis.piv.s1)}`} tone="buy" /><LevelCard label="PIVOT" value={fmtPx(asset, analysis.piv.pp)} hint={`${analysis.verdict} bias`} tone="flat" /><LevelCard label="RESISTANCE ZONE" value={fmtPx(asset, analysis.swing.resistance)} hint={`Pivot R1 ${fmtPx(asset, analysis.piv.r1)}`} tone="sell" /></div>
          </div>
          <div className="glass rounded-3xl p-5">
            <div className="mb-3 flex flex-wrap items-center gap-2"><span className="flex items-center gap-2 text-xs font-semibold tracking-widest text-slate-400"><Layers size={13} className="text-[#e8b44a]" /> SIGNAL SCREENER - {tf}</span><span className="ml-auto font-num text-[11px] text-slate-500">ranked by model score</span></div>
            <div className="scroll-thin max-h-[380px] overflow-y-auto"><table className="w-full min-w-[560px] text-left text-[12px]"><thead className="sticky top-0 bg-[#0c1322] text-[10px] tracking-widest text-slate-500"><tr><th className="px-2 py-2">SYMBOL</th><th className="px-2 py-2">PRICE</th><th className="px-2 py-2">RSI</th><th className="px-2 py-2">MACD</th><th className="px-2 py-2">SCORE</th><th className="px-2 py-2 text-right">SIGNAL</th></tr></thead><tbody>
              {screener.slice(0, 30).map(({ a, an }) => (<tr key={a.symbol} onClick={() => setSymbol(a.symbol)} className={`cursor-pointer border-t border-white/5 font-num transition hover:bg-[#e8b44a]/5 ${a.symbol === symbol ? 'bg-[#e8b44a]/10' : ''}`}><td className="px-2 py-2"><span className="font-semibold text-slate-100">{a.symbol}</span> <span className="ml-1 text-[10px] text-slate-500">{a.category}</span></td><td className="px-2 py-2 text-slate-300">{fmtPx(a, prices[a.symbol]?.p ?? an.price)}</td><td className="px-2 py-2 text-slate-300">{an.rsi.toFixed(0)}</td><td className={`px-2 py-2 ${an.macd.hist >= 0 ? 'text-teal-300' : 'text-rose-300'}`}>{an.macd.hist >= 0 ? '+' : ''}{an.macd.hist.toFixed(a.decimals + 1)}</td><td className="px-2 py-2"><ScoreBar v={an.score} /></td><td className="px-2 py-2 text-right"><SignalPill verdict={an.verdict} /></td></tr>))}
            </tbody></table></div>
          </div>
        </section>
        <aside className="space-y-4">
          <div className="glass rounded-3xl p-5"><div className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-widest text-slate-400"><CandlestickChart size={13} className="text-[#e8b44a]" /> TRADE PLAN</div><div className="space-y-2 font-num text-[12px]"><PlanRow k="Bias" v={analysis.verdict} tone={analysis.verdict} /><PlanRow k="Entry zone" v={fmtPx(asset, analysis.price)} tone="flat" /><PlanRow k="Stop (S/R)" v={analysis.verdict === 'SELL' ? fmtPx(asset, analysis.swing.resistance) : fmtPx(asset, analysis.swing.support)} tone="flat" /><PlanRow k="Target 1" v={analysis.verdict === 'SELL' ? fmtPx(asset, analysis.piv.s1) : fmtPx(asset, analysis.piv.r1)} tone="flat" /><PlanRow k="Target 2" v={analysis.verdict === 'SELL' ? fmtPx(asset, analysis.piv.s2) : fmtPx(asset, analysis.piv.r2)} tone="flat" /></div><p className="mt-3 text-[11px] leading-relaxed text-slate-500">Not financial advice. Simulation for education — confirm with your broker feed before risking capital.</p></div>
          <div className="glass rounded-3xl p-5"><div className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-widest text-slate-400"><Calculator size={13} className="text-[#e8b44a]" /> POSITION SIZE</div><label className="mb-2 block text-[11px] text-slate-500">Account balance ($)<input type="number" value={risk.balance} onChange={e => setRisk({ ...risk, balance: +e.target.value || 0 })} className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-num text-[13px] text-slate-100" /></label><label className="mb-2 block text-[11px] text-slate-500">Risk pct<input type="number" step="0.1" value={risk.riskPct} onChange={e => setRisk({ ...risk, riskPct: +e.target.value || 0 })} className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-num text-[13px] text-slate-100" /></label><div className="grid grid-cols-2 gap-2"><label className="block text-[11px] text-slate-500">Entry<input value={risk.entry} placeholder={fmtPx(asset, analysis.price)} onChange={e => setRisk({ ...risk, entry: e.target.value })} className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-num text-[12px] text-slate-100" /></label><label className="block text-[11px] text-slate-500">Stop<input value={risk.sl} placeholder={fmtPx(asset, analysis.swing.support)} onChange={e => setRisk({ ...risk, sl: e.target.value })} className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-num text-[12px] text-slate-100" /></label></div><div className="mt-3 rounded-xl bg-[#e8b44a]/10 p-3 text-center"><div className="font-num text-xl font-bold text-[#e8b44a]">{riskOut.size ? riskOut.size.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '-'} <span className="text-[11px] font-medium">units</span></div><div className="font-num text-[11px] text-slate-400">risking ${fmt(riskOut.riskAmt)} - {risk.riskPct}% of equity</div></div></div>
          <div className="glass rounded-3xl p-5"><div className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-widest text-slate-400"><CalendarDays size={13} className="text-[#e8b44a]" /> DAY AHEAD</div><div className="space-y-2">{ECON_CALENDAR.map((e, i) => (<div key={i} className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5"><div className="flex items-center gap-2 text-[11px]"><span className="font-num text-slate-500">{e.time}</span><ImpactDot level={e.impact} /><span className="ml-auto font-num text-[10px] text-slate-500">EXP {e.expect}</span></div><div className="mt-0.5 text-[12.5px] font-semibold">{e.event}</div><div className="text-[11px] text-slate-500">{e.asset} - prev {e.prev}</div></div>))}</div></div>
          <div className="glass rounded-3xl p-5"><div className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-widest text-slate-400"><TrendingUp size={13} className="text-[#e8b44a]" /> FLOW NOTES</div><div className="space-y-2.5">{NEWS_TEMPLATES.slice(0, 4).map((n, i) => (<div key={i} className="border-l-2 pl-3" style={{ borderColor: n.tone >= 0 ? '#2dd4bf' : '#fb7185' }}><div className="text-[10px] font-semibold tracking-widest text-slate-500 uppercase">{n.tag}</div><div className="text-[12.5px] font-semibold leading-snug">{n.title}</div><div className="mt-0.5 text-[11.5px] leading-relaxed text-slate-500">{n.body}</div></div>))}</div></div>
        </aside>
      </main>
      <footer className="relative z-10 border-t border-white/10 bg-[#0c1322]/80"><div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-3 px-5 py-5 text-[12px] text-slate-500"><span className="font-display font-bold text-slate-300">PulseMarkets Hub</span><span>- Open analytics for forex, commodities and indices</span><span className="ml-auto flex items-center gap-1">MIT licensed - <a className="text-[#e8b44a] hover:underline" href="https://github.com/mbf-coder/trading-hub" target="_blank" rel="noreferrer">Contribute on GitHub</a></span></div></footer>
      {showSearch && (<div className="fixed inset-0 z-50 bg-black/70 p-4 backdrop-blur-sm" onClick={() => setShowSearch(false)}><div className="animate-rise mx-auto mt-[8vh] max-w-2xl overflow-hidden rounded-3xl border border-[#e8b44a]/25 bg-[#0c1322] shadow-2xl" onClick={e => e.stopPropagation()}><div className="flex items-center gap-3 border-b border-white/10 px-5 py-4"><Search size={18} className="text-[#e8b44a]" /><input autoFocus value={query} onChange={e => { setQuery(e.target.value); setActiveIdx(0) }} onKeyDown={e => { if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, results.length - 1)) } if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)) } if (e.key === 'Enter' && results[activeIdx]) { setSymbol(results[activeIdx].symbol); setShowSearch(false); setQuery('') } }} placeholder="Search EURUSD, gold, Nasdaq, oil, yen..." className="w-full bg-transparent text-[15px] text-slate-100 placeholder:text-slate-500" /><kbd className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-num text-[10px] text-slate-500">ESC</kbd></div><div className="flex gap-2 overflow-x-auto border-b border-white/5 px-5 py-2.5">{CATEGORIES.map(c => (<button key={c.id} onClick={() => setCat(c.id)} className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold ${cat === c.id ? 'bg-[#e8b44a] text-[#070b14]' : 'bg-white/5 text-slate-400'}`}>{c.label}</button>))}</div><div className="scroll-thin max-h-[46vh] overflow-y-auto p-2">{results.map((a, i) => { const q = prices[a.symbol]; const up = (q?.chg ?? 0) >= 0; return (<button key={a.symbol} onMouseEnter={() => setActiveIdx(i)} onClick={() => { setSymbol(a.symbol); setShowSearch(false); setQuery('') }} className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${i === activeIdx ? 'bg-[#e8b44a]/10' : ''}`}><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/5 font-num text-xs font-bold text-[#e8b44a]">{a.flag || a.symbol.slice(0, 2)}</span><span className="min-w-0 flex-1"><span className="block text-sm font-bold">{a.symbol} <span className="ml-1 rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-medium text-slate-400">{a.category}</span></span><span className="block truncate text-xs text-slate-500">{a.name} - {a.desc}</span></span><span className="text-right font-num text-xs"><span className="block text-slate-100">{fmtPx(a, q?.p ?? a.base)}</span><span className={up ? 'text-teal-300' : 'text-rose-300'}>{up ? '+' : ''}{(q?.chg ?? 0).toFixed(2)}%</span></span>{i === activeIdx && <ChevronRight size={15} className="text-[#e8b44a]" />}</button>) })}{results.length === 0 && <p className="p-8 text-center text-sm text-slate-500">No matches. Try USD, gold, oil or 100.</p>}</div><div className="flex items-center gap-4 border-t border-white/10 px-5 py-2.5 font-num text-[10px] text-slate-500"><span>up/down navigate</span><span>enter open analysis</span><span className="ml-auto">{results.length} results - free forever</span></div></div></div>)}
    </div>
  )
}

function IndicatorRow({ name, value, signal, tone }) {
  const dot = tone === 'buy' ? 'bg-teal-300' : tone === 'sell' ? 'bg-rose-400' : 'bg-[#e8b44a]'
  const txt = tone === 'buy' ? 'text-teal-300' : tone === 'sell' ? 'text-rose-300' : 'text-slate-400'
  return (<div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5"><span className={`h-2 w-2 shrink-0 rounded-full ${dot}`} /><span className="min-w-0 flex-1"><span className="block text-[11px] text-slate-500">{name}</span><span className="block font-num text-[13px] font-semibold text-slate-100">{value}</span></span><span className={`text-right text-[11px] font-semibold ${txt}`}>{signal}</span></div>)
}
function LevelCard({ label, value, hint, tone }) {
  const c = tone === 'buy' ? 'border-teal-300/25 text-teal-200' : tone === 'sell' ? 'border-rose-400/25 text-rose-200' : 'border-[#e8b44a]/25 text-[#e8b44a]'
  return <div className={`rounded-2xl border bg-white/[0.02] p-3 ${c}`}><div className="text-[10px] tracking-widest text-slate-500">{label}</div><div className="font-num text-[15px] font-bold">{value}</div><div className="text-[11px] text-slate-500">{hint}</div></div>
}
function PlanRow({ k, v, tone }) {
  const c = tone === 'BUY' ? 'text-teal-300' : tone === 'SELL' ? 'text-rose-300' : tone === 'NEUTRAL' ? 'text-[#e8b44a]' : 'text-slate-100'
  return <div className="flex items-center justify-between rounded-lg bg-white/[0.02] px-3 py-1.5"><span className="text-slate-500">{k}</span><span className={`font-semibold ${c}`}>{v}</span></div>
}
function ImpactDot({ level }) {
  const c = level === 'high' ? 'bg-rose-400' : level === 'med' ? 'bg-[#e8b44a]' : 'bg-slate-500'
  return <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-slate-400"><span className={`h-1.5 w-1.5 rounded-full ${c}`} />{level}</span>
}
function ScoreBar({ v }) {
  const w = Math.abs(v)
  return <span className="flex items-center gap-1.5"><span className="h-1.5 w-14 overflow-hidden rounded-full bg-white/10"><span className={`block h-full rounded-full ${v >= 0 ? 'bg-teal-300' : 'bg-rose-400'}`} style={{ width: `${w}%`, marginLeft: v >= 0 ? 'auto' : 0 }} /></span><span className={v >= 25 ? 'text-teal-300' : v <= -25 ? 'text-rose-300' : 'text-slate-400'}>{v > 0 ? `+${v}` : v}</span></span>
}
function SignalPill({ verdict }) {
  const c = verdict === 'BUY' ? 'border-teal-300/40 bg-teal-300/10 text-teal-200' : verdict === 'SELL' ? 'border-rose-400/40 bg-rose-400/10 text-rose-200' : 'border-[#e8b44a]/40 bg-[#e8b44a]/10 text-[#e8b44a]'
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wider ${c}`}>{verdict === 'BUY' ? <TrendingUp size={11} /> : verdict === 'SELL' ? <TrendingDown size={11} /> : null}{verdict}</span>
}
