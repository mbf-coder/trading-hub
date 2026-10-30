# PulseMarkets Hub — Open Trading Analytics

Free, open trading analytics for **forex, commodities, indices** (plus a crypto sleeve). Search any pair and get institutional-grade technical analysis — no sign-up, no API keys.

## Features
- **Universal search (Cmd+K)** — 60+ symbols: majors, minors, exotics, gold/silver/oil/gas, US/EU/Asia indices, BTC/ETH/SOL
- **Live simulated feed** — tick engine calibrated per-asset, candle morphing in real time
- **Pro chart** — canvas candlesticks, volume, MA20/MA50, crosshair OHLC, 5 timeframes (15m–1W)
- **Desk analytics engine** (`src/lib/engine.js`): RSI-14, MACD, Stochastic, Bollinger, ATR, SMA/EMA, pivots, swing S/R, composite score −100…+100, desk note
- **Signal screener**, **watchlist**, **top movers**, **ticker tape**
- **Trade plan + position-size calculator**, **session clock**, **calendar + flow notes**

## Quickstart
```bash
npm install
npm run dev
npm run build
```
No env vars. No backend. Deploy `dist/` anywhere.

> Educational simulation — not financial advice.

## Structure
```
src/
  data/assets.js
  lib/engine.js
  components/Chart.jsx
  components/Gauge.jsx
  App.jsx
```
MIT (c) PulseMarkets Hub
