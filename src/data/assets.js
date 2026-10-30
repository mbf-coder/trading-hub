export const CATEGORIES = [
  { id: 'all', label: 'All markets' },
  { id: 'forex', label: 'Forex' },
  { id: 'commodities', label: 'Commodities' },
  { id: 'indices', label: 'Indices' },
  { id: 'crypto', label: 'Crypto' },
]

export const ASSETS = [
  { symbol: 'EURUSD', name: 'Euro / US Dollar', category: 'forex', base: 1.0842, decimals: 5, vol: 0.0062, kind: 'major', flag: 'EUR', desc: 'The most liquid pair. Eurozone growth vs Fed policy.' },
  { symbol: 'GBPUSD', name: 'British Pound / US Dollar', category: 'forex', base: 1.2691, decimals: 5, vol: 0.0078, kind: 'major', flag: 'GBP', desc: 'Cable. Reactive to BoE / Fed divergence and risk sentiment.' },
  { symbol: 'USDJPY', name: 'US Dollar / Japanese Yen', category: 'forex', base: 151.42, decimals: 3, vol: 0.0071, kind: 'major', flag: 'JPY', desc: 'Rate-differential proxy. Intervention watch above 152.' },
  { symbol: 'USDCHF', name: 'US Dollar / Swiss Franc', category: 'forex', base: 0.9042, decimals: 5, vol: 0.0054, kind: 'major', flag: 'CHF', desc: 'Safe-haven cross. Franc strength caps upside in risk-off.' },
  { symbol: 'AUDUSD', name: 'Australian Dollar / US Dollar', category: 'forex', base: 0.6584, decimals: 5, vol: 0.0081, kind: 'major', flag: 'AUD', desc: 'Commodity-linked. Iron ore, China data and RBA drive it.' },
  { symbol: 'USDCAD', name: 'US Dollar / Canadian Dollar', category: 'forex', base: 1.3618, decimals: 5, vol: 0.0065, kind: 'major', flag: 'CAD', desc: 'Oil-correlated. WTI strength typically pressures USDCAD lower.' },
  { symbol: 'NZDUSD', name: 'New Zealand Dollar / US Dollar', category: 'forex', base: 0.5981, decimals: 5, vol: 0.0084, kind: 'major', flag: 'NZD', desc: 'High-beta risk FX. Dairy prices and RBNZ path matter.' },
  { symbol: 'EURGBP', name: 'Euro / British Pound', category: 'forex', base: 0.8542, decimals: 5, vol: 0.0048, kind: 'cross', flag: 'E/G', desc: 'Slow range pair. ECB vs BoE timing is everything.' },
  { symbol: 'EURJPY', name: 'Euro / Japanese Yen', category: 'forex', base: 164.18, decimals: 3, vol: 0.0082, kind: 'cross', flag: 'E/J', desc: 'Risk barometer. Carries hard in risk-on, unwinds fast.' },
  { symbol: 'GBPJPY', name: 'British Pound / Japanese Yen', category: 'forex', base: 192.15, decimals: 3, vol: 0.0102, kind: 'cross', flag: 'G/J', desc: 'The dragon. Wide ranges, momentum dominated.' },
  { symbol: 'AUDJPY', name: 'Australian Dollar / Japanese Yen', category: 'forex', base: 99.72, decimals: 3, vol: 0.0091, kind: 'cross', flag: 'A/J', desc: 'Pure risk-on/off gauge for Asia session.' },
  { symbol: 'EURAUD', name: 'Euro / Australian Dollar', category: 'forex', base: 1.6472, decimals: 5, vol: 0.0072, kind: 'cross', flag: 'E/A', desc: 'Growth-divergence pair. EUR resilience vs China beta.' },
  { symbol: 'GBPAUD', name: 'British Pound / Australian Dollar', category: 'forex', base: 1.9274, decimals: 5, vol: 0.0088, kind: 'cross', flag: 'G/A', desc: 'Trending cross. Breakouts tend to extend.' },
  { symbol: 'EURCHF', name: 'Euro / Swiss Franc', category: 'forex', base: 0.9804, decimals: 5, vol: 0.0042, kind: 'cross', flag: 'E/C', desc: 'SNB memory. Tight ranges, sudden haven spikes.' },
  { symbol: 'CADJPY', name: 'Canadian Dollar / Japanese Yen', category: 'forex', base: 111.24, decimals: 3, vol: 0.0086, kind: 'cross', flag: 'C/J', desc: 'Oil + risk sentiment in one pair.' },
  { symbol: 'NZDJPY', name: 'New Zealand Dollar / Japanese Yen', category: 'forex', base: 90.58, decimals: 3, vol: 0.0094, kind: 'cross', flag: 'N/J', desc: 'Carry favourite. High yield spread sensitivity.' },
  { symbol: 'AUDNZD', name: 'Australian Dollar / New Zealand Dollar', category: 'forex', base: 1.1008, decimals: 5, vol: 0.0045, kind: 'cross', flag: 'A/N', desc: 'Range pair. RBA vs RBNZ micro-divergence.' },
  { symbol: 'USDZAR', name: 'US Dollar / South African Rand', category: 'forex', base: 18.842, decimals: 3, vol: 0.0125, kind: 'exotic', flag: 'ZAR', desc: 'High-vol EM. Gold/platinum and risk appetite driven.' },
  { symbol: 'USDTRY', name: 'US Dollar / Turkish Lira', category: 'forex', base: 32.418, decimals: 3, vol: 0.0098, kind: 'exotic', flag: 'TRY', desc: 'Carry + policy risk. Persistent uptrend with CBRT watch.' },
  { symbol: 'USDMXN', name: 'US Dollar / Mexican Peso', category: 'forex', base: 16.942, decimals: 3, vol: 0.0101, kind: 'exotic', flag: 'MXN', desc: 'Carry-trade bellwether. Banxico and US data swing it.' },
  { symbol: 'USDSEK', name: 'US Dollar / Swedish Krona', category: 'forex', base: 10.624, decimals: 3, vol: 0.0082, kind: 'exotic', flag: 'SEK', desc: 'European risk proxy with Riksbank sensitivity.' },
  { symbol: 'USDNOK', name: 'US Dollar / Norwegian Krone', category: 'forex', base: 10.781, decimals: 3, vol: 0.0092, kind: 'exotic', flag: 'NOK', desc: 'Oil-linked Nordic. Brent rallies sink USDNOK.' },
  { symbol: 'EURZAR', name: 'Euro / South African Rand', category: 'forex', base: 20.428, decimals: 3, vol: 0.0118, kind: 'exotic', flag: 'E/Z', desc: 'EM carry cross with wide daily ranges.' },
  { symbol: 'GBPZAR', name: 'British Pound / South African Rand', category: 'forex', base: 23.914, decimals: 3, vol: 0.0128, kind: 'exotic', flag: 'G/Z', desc: 'Volatile EM cross. Position sizing matters.' },
  { symbol: 'XAUUSD', name: 'Gold Spot', category: 'commodities', base: 2384.2, decimals: 2, vol: 0.0112, kind: 'metal', flag: 'AU', desc: 'Ultimate haven. Real yields and USD are the twin drivers.' },
  { symbol: 'XAGUSD', name: 'Silver Spot', category: 'commodities', base: 28.14, decimals: 3, vol: 0.0185, kind: 'metal', flag: 'AG', desc: 'Gold high-beta sibling. Industrial + monetary demand.' },
  { symbol: 'WTIUSD', name: 'WTI Crude Oil', category: 'commodities', base: 78.42, decimals: 2, vol: 0.021, kind: 'energy', flag: 'WTI', desc: 'US crude benchmark. Inventories, OPEC+ and USD driven.' },
  { symbol: 'BCOUSD', name: 'Brent Crude Oil', category: 'commodities', base: 82.66, decimals: 2, vol: 0.0195, kind: 'energy', flag: 'BRN', desc: 'Global oil benchmark. Geopolitics premium lives here.' },
  { symbol: 'NGAS', name: 'Natural Gas', category: 'commodities', base: 2.184, decimals: 3, vol: 0.032, kind: 'energy', flag: 'NG', desc: 'Weather-driven volatility monster. Size down.' },
  { symbol: 'COPPER', name: 'Copper Futures', category: 'commodities', base: 4.512, decimals: 3, vol: 0.0142, kind: 'metal', flag: 'CU', desc: 'Dr Copper — the global growth barometer.' },
  { symbol: 'PLAT', name: 'Platinum Spot', category: 'commodities', base: 948.5, decimals: 2, vol: 0.0135, kind: 'metal', flag: 'PT', desc: 'Auto-catalyst demand + South African supply risk.' },
  { symbol: 'WHEAT', name: 'Wheat Futures', category: 'commodities', base: 612.4, decimals: 2, vol: 0.0168, kind: 'agri', flag: 'WH', desc: 'Black Sea supply and weather drive grain volatility.' },
  { symbol: 'COFFEE', name: 'Coffee (Arabica)', category: 'commodities', base: 224.8, decimals: 2, vol: 0.022, kind: 'agri', flag: 'CF', desc: 'Brazil frost risk + demand. Trend-prone soft.' },
  { symbol: 'SUGAR', name: 'Sugar #11', category: 'commodities', base: 19.42, decimals: 2, vol: 0.0175, kind: 'agri', flag: 'SG', desc: 'Brazil / India output swings dominate.' },
  { symbol: 'US30', name: 'Dow Jones 30', category: 'indices', base: 39112, decimals: 1, vol: 0.0088, kind: 'index', flag: 'DJI', desc: 'Blue-chip US. Industrials + financials heavy.' },
  { symbol: 'US500', name: 'S&P 500', category: 'indices', base: 5234.2, decimals: 2, vol: 0.0092, kind: 'index', flag: 'SPX', desc: 'US benchmark. Breadth + mega-cap tech drive direction.' },
  { symbol: 'NAS100', name: 'Nasdaq 100', category: 'indices', base: 18242, decimals: 1, vol: 0.0125, kind: 'index', flag: 'NDX', desc: 'Growth + AI beta. Highest vol of US majors.' },
  { symbol: 'GER40', name: 'DAX 40', category: 'indices', base: 18342, decimals: 1, vol: 0.0095, kind: 'index', flag: 'DAX', desc: 'German exporters. EUR + China data sensitive.' },
  { symbol: 'UK100', name: 'FTSE 100', category: 'indices', base: 8142.4, decimals: 2, vol: 0.0072, kind: 'index', flag: 'FTSE', desc: 'Energy + miners heavy. GBP strength can cap it.' },
  { symbol: 'FRA40', name: 'CAC 40', category: 'indices', base: 8064, decimals: 1, vol: 0.0086, kind: 'index', flag: 'CAC', desc: 'Luxury + industrials tilt. Eurozone sentiment proxy.' },
  { symbol: 'JPN225', name: 'Nikkei 225', category: 'indices', base: 38242, decimals: 0, vol: 0.0112, kind: 'index', flag: 'NKI', desc: 'JPY inverse correlation. BoJ policy is key.' },
  { symbol: 'AUS200', name: 'ASX 200', category: 'indices', base: 7824, decimals: 1, vol: 0.0078, kind: 'index', flag: 'ASX', desc: 'Banks + miners. China leverage play.' },
  { symbol: 'HKG50', name: 'Hang Seng', category: 'indices', base: 17242, decimals: 0, vol: 0.0142, kind: 'index', flag: 'HSI', desc: 'China tech beta. Stimulus headlines whip it.' },
  { symbol: 'EUSTX50', name: 'Euro Stoxx 50', category: 'indices', base: 4984.2, decimals: 2, vol: 0.0084, kind: 'index', flag: 'SX5E', desc: 'Eurozone blue chips. Banks + luxury weight.' },
  { symbol: 'US2000', name: 'Russell 2000', category: 'indices', base: 2014.8, decimals: 2, vol: 0.0118, kind: 'index', flag: 'RUT', desc: 'Small-cap rates proxy. Falls when yields spike.' },
  { symbol: 'VIX', name: 'Volatility Index', category: 'indices', base: 14.82, decimals: 2, vol: 0.052, kind: 'vol', flag: 'VIX', desc: 'Fear gauge. Spikes = buy protection, fade risk.' },
  { symbol: 'BTCUSD', name: 'Bitcoin / US Dollar', category: 'crypto', base: 67240, decimals: 1, vol: 0.028, kind: 'crypto', flag: 'BTC', desc: 'Digital gold. ETF flows + liquidity regime driven.' },
  { symbol: 'ETHUSD', name: 'Ethereum / US Dollar', category: 'crypto', base: 3524.4, decimals: 2, vol: 0.031, kind: 'crypto', flag: 'ETH', desc: 'Smart-contract leader. Beta to BTC with tech tilt.' },
  { symbol: 'SOLUSD', name: 'Solana / US Dollar', category: 'crypto', base: 172.4, decimals: 3, vol: 0.042, kind: 'crypto', flag: 'SOL', desc: 'High-throughput L1. Meme + DePIN activity proxy.' },
]

export const TIMEFRAMES = [
  { id: 'M15', label: '15m', minutes: 15, points: 180 },
  { id: 'H1', label: '1H', minutes: 60, points: 180 },
  { id: 'H4', label: '4H', minutes: 240, points: 180 },
  { id: 'D1', label: '1D', minutes: 1440, points: 200 },
  { id: 'W1', label: '1W', minutes: 10080, points: 160 },
]

export const ECON_CALENDAR = [
  { time: '12:30 UTC', impact: 'high', event: 'US CPI m/m', expect: '0.3%', prev: '0.4%', asset: 'USD pairs / Gold / US500' },
  { time: '13:15 UTC', impact: 'high', event: 'ECB Press Conference', expect: 'Hold 4.50%', prev: '4.50%', asset: 'EUR pairs / GER40' },
  { time: '14:00 UTC', impact: 'med', event: 'US Crude Oil Inventories', expect: '-1.2M', prev: '+0.8M', asset: 'WTI / Brent / USDCAD' },
  { time: '18:00 UTC', impact: 'med', event: 'FOMC Member Speech', expect: '-', prev: '-', asset: 'USD pairs / NAS100' },
  { time: '23:50 UTC', impact: 'med', event: 'Japan Trade Balance', expect: '-412B', prev: '-379B', asset: 'JPY pairs / JPN225' },
  { time: '06:00 UTC', impact: 'low', event: 'UK Halifax HPI m/m', expect: '0.2%', prev: '0.1%', asset: 'GBP pairs / UK100' },
]

export const NEWS_TEMPLATES = [
  { tag: 'Central banks', tone: 0.2, title: 'Desk note: rate-cut repricing keeps USD bid into CPI', body: 'Futures trimmed cut bets after hawkish Fedspeak. Real-yield support favours USD vs low-yielders; gold dips remain bought while real yields stay capped.' },
  { tag: 'Flows', tone: 0.6, title: 'CTA trend followers add to long commodities basket', body: 'Systematic flows extended on momentum triggers. Breakout continuation odds improve while 20-day breadth stays positive across energy and metals.' },
  { tag: 'Risk', tone: -0.4, title: 'Equity hedge demand lifts vol bid, caps index upside', body: 'Dealer gamma suggests pinning near-term with upside capped. Dips toward the 20-day average have historically attracted systematic buyers.' },
  { tag: 'Energy', tone: 0.4, title: 'OPEC+ compliance chatter tightens crude spreads', body: 'Time-spreads firmed on inventory draws. Momentum structure favours buying first tests of rising 20-period support in WTI and Brent.' },
  { tag: 'Metals', tone: 0.5, title: 'Real-yield pullback re-opens gold bull path', body: 'Gold stabilised as real yields eased. Central-bank bid underpins every 1-1.5% dip; silver leverage amplifies the move both ways.' },
  { tag: 'FX', tone: -0.2, title: 'Yen intervention rhetoric caps USD/JPY topside', body: 'Officials jawboned against rapid moves. Intraday spikes above prior highs face fade flow; dips remain supported by rate differentials.' },
]

export function searchAssets(q) {
  const needle = q.trim().toLowerCase()
  if (!needle) return ASSETS.filter(a => a.kind !== 'hide')
  return ASSETS.filter(a => {
    if (a.kind === 'hide') return false
    return (
      a.symbol.toLowerCase().includes(needle) ||
      a.name.toLowerCase().includes(needle) ||
      a.category.includes(needle) ||
      (a.kind || '').includes(needle)
    )
  })
}
