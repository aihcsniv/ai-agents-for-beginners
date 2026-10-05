import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext.tsx';
import { Ticker } from '../types/market.ts';

interface StockDetailModalProps {
  ticker: Ticker;
  onClose: () => void;
}

export const StockDetailModal: React.FC<StockDetailModalProps> = ({ ticker, onClose }) => {
  const {
    openTradeModal,
    isWatchlisted,
    toggleWatchlist,
  } = useMarket();

  const [timeframe, setTimeframe] = useState<'1D' | '5D' | '1M' | '1Y'>('1D');
  const [chartType, setChartType] = useState<'line' | 'candle'>('line');
  const [hoverPoint, setHoverPoint] = useState<number | null>(null);

  const watchlisted = isWatchlisted(ticker.symbol);
  const isPositive = ticker.changePercent >= 0;

  const history = ticker.history ? ticker.history[timeframe] || ticker.sparkline : ticker.sparkline;
  const minVal = Math.min(...history);
  const maxVal = Math.max(...history);
  const range = maxVal - minVal || 1;

  const width = 360;
  const height = 140;
  const paddingY = 12;
  const chartHeight = height - paddingY * 2;

  const points = history.map((val, idx) => {
    const x = (idx / (history.length - 1)) * width;
    const y = height - paddingY - ((val - minVal) / range) * chartHeight;
    return { x, y, val };
  });

  let pathD = '';
  if (points.length > 0) {
    pathD = `M${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cx = (prev.x + curr.x) / 2;
      pathD += ` C${cx.toFixed(1)},${prev.y.toFixed(1)} ${cx.toFixed(1)},${curr.y.toFixed(1)} ${curr.x.toFixed(1)},${curr.y.toFixed(1)}`;
    }
  }

  const fillD = `${pathD} L${width},${height} L0,${height} Z`;

  const displayPrice = hoverPoint !== null ? hoverPoint : ticker.price;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl max-h-[92vh] flex flex-col rounded-t-2xl sm:rounded-2xl bg-[#131722] border border-white/10 shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.08] bg-[#10131a]/80">
          <div className="flex items-center space-x-3">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${
                isPositive ? 'bg-emerald-500/15 text-[#10B981]' : 'bg-rose-500/15 text-[#F43F5E]'
              }`}
            >
              {ticker.symbol.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-base font-bold text-white">{ticker.symbol}</span>
                <span className="px-1.5 py-0.5 rounded bg-[#272a32] text-[#94A3B8] text-[10px] font-semibold">
                  {ticker.exchange}
                </span>
              </div>
              <span className="text-xs text-[#64748B] block truncate max-w-[200px]">
                {ticker.name}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => toggleWatchlist(ticker.symbol)}
              aria-label="Toggle watchlist"
              className={`p-2 rounded-lg transition-colors ${
                watchlisted
                  ? 'text-amber-400 bg-amber-400/10'
                  : 'text-[#64748B] hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] ${watchlisted ? 'fill-1' : ''}`}>
                star
              </span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-2 rounded-lg text-[#64748B] hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-4 space-y-4 flex-1">
          {/* Main Price Header */}
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-3xl font-extrabold text-white tracking-tight tabular-nums">
                ${displayPrice.toFixed(2)}
              </span>
              <div className="flex items-center space-x-1.5 mt-1">
                <span
                  className={`flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
                    isPositive
                      ? 'bg-emerald-500/15 text-[#10B981]'
                      : 'bg-rose-500/15 text-[#F43F5E]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[13px] mr-0.5">
                    {isPositive ? 'arrow_upward' : 'arrow_downward'}
                  </span>
                  <span>
                    {isPositive ? `+${ticker.change.toFixed(2)}` : ticker.change.toFixed(2)} (
                    {isPositive ? `+${ticker.changePercent.toFixed(2)}%` : `${ticker.changePercent.toFixed(2)}%`})
                  </span>
                </span>
                <span className="text-[11px] text-[#64748B]">Today</span>
              </div>
            </div>

            <div className="text-right text-xs">
              <span className="text-[#64748B] block">Sector</span>
              <span className="font-semibold text-white">{ticker.sector}</span>
            </div>
          </div>

          {/* Interactive Chart */}
          <div className="p-3 rounded-xl bg-[#0b0e15] border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between text-xs">
              {/* Timeframe Chips */}
              <div className="flex space-x-1 bg-[#191b23] p-1 rounded-lg">
                {(['1D', '5D', '1M', '1Y'] as const).map(tf => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold transition-all ${
                      timeframe === tf
                        ? 'bg-[#2962ff] text-white'
                        : 'text-[#64748B] hover:text-white'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              {/* Chart Type Toggle */}
              <div className="flex space-x-1 bg-[#191b23] p-1 rounded-lg text-[#64748B]">
                <button
                  onClick={() => setChartType('line')}
                  className={`p-1 rounded ${chartType === 'line' ? 'bg-[#272a32] text-white' : 'hover:text-white'}`}
                  title="Line Area"
                >
                  <span className="material-symbols-outlined text-[16px]">show_chart</span>
                </button>
                <button
                  onClick={() => setChartType('candle')}
                  className={`p-1 rounded ${chartType === 'candle' ? 'bg-[#272a32] text-white' : 'hover:text-white'}`}
                  title="Candlestick Preview"
                >
                  <span className="material-symbols-outlined text-[16px]">candlestick_chart</span>
                </button>
              </div>
            </div>

            {/* SVG Chart Surface */}
            <div className="relative w-full h-36">
              {chartType === 'line' ? (
                <svg
                  className="w-full h-full overflow-visible"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox={`0 0 ${width} ${height}`}
                  onMouseMove={e => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                    const idx = Math.round(ratio * (points.length - 1));
                    if (points[idx]) setHoverPoint(points[idx].val);
                  }}
                  onMouseLeave={() => setHoverPoint(null)}
                >
                  <defs>
                    <linearGradient id="detailGlow" x1="0" x2="0" y1="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor={isPositive ? '#10B981' : '#F43F5E'}
                        stopOpacity="0.25"
                      />
                      <stop
                        offset="100%"
                        stopColor={isPositive ? '#10B981' : '#F43F5E'}
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>
                  <path d={fillD} fill="url(#detailGlow)" />
                  <path
                    d={pathD}
                    stroke={isPositive ? '#10B981' : '#F43F5E'}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  {points.length > 0 && (
                    <circle
                      className={isPositive ? 'fill-[#10B981]' : 'fill-[#F43F5E]'}
                      cx={points[points.length - 1].x}
                      cy={points[points.length - 1].y}
                      r={3.5}
                    />
                  )}
                </svg>
              ) : (
                /* Candlestick visual mockup */
                <div className="w-full h-full flex items-end justify-between px-2 pt-2">
                  {history.map((val, i) => {
                    const isUp = i === 0 || val >= history[i - 1];
                    const bodyH = Math.max(12, Math.abs(val - minVal) / range * 90);
                    return (
                      <div key={i} className="flex flex-col items-center flex-1 h-full justify-end">
                        <div
                          className={`w-[1px] ${isUp ? 'bg-[#10B981]' : 'bg-[#F43F5E]'}`}
                          style={{ height: `${bodyH + 16}px` }}
                        />
                        <div
                          className={`w-3 rounded-xs ${isUp ? 'bg-[#10B981]' : 'bg-[#F43F5E]'}`}
                          style={{ height: `${bodyH}px` }}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Key Statistics Grid */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Key Statistics
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2.5 rounded-lg bg-[#191b23] border border-white/[0.04]">
                <span className="text-[11px] text-[#64748B] block">Day Range</span>
                <span className="text-xs font-semibold text-white tabular-nums">
                  ${ticker.dayLow.toFixed(2)} - ${ticker.dayHigh.toFixed(2)}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#191b23] border border-white/[0.04]">
                <span className="text-[11px] text-[#64748B] block">52-Wk Range</span>
                <span className="text-xs font-semibold text-white tabular-nums">
                  ${ticker.low52.toFixed(2)} - ${ticker.high52.toFixed(2)}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#191b23] border border-white/[0.04]">
                <span className="text-[11px] text-[#64748B] block">Volume / Avg</span>
                <span className="text-xs font-semibold text-white tabular-nums">
                  {ticker.volume} / {ticker.avgVolume}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#191b23] border border-white/[0.04]">
                <span className="text-[11px] text-[#64748B] block">Market Cap</span>
                <span className="text-xs font-semibold text-white tabular-nums">
                  {ticker.marketCap}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#191b23] border border-white/[0.04]">
                <span className="text-[11px] text-[#64748B] block">P/E Ratio</span>
                <span className="text-xs font-semibold text-white tabular-nums">
                  {ticker.peRatio > 0 ? ticker.peRatio.toFixed(1) : 'N/A'}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#191b23] border border-white/[0.04]">
                <span className="text-[11px] text-[#64748B] block">EPS (TTM)</span>
                <span className="text-xs font-semibold text-white tabular-nums">
                  ${ticker.eps.toFixed(2)}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#191b23] border border-white/[0.04]">
                <span className="text-[11px] text-[#64748B] block">Dividend Yield</span>
                <span className="text-xs font-semibold text-white tabular-nums">
                  {ticker.dividendYield > 0 ? `${ticker.dividendYield.toFixed(2)}%` : '—'}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#191b23] border border-white/[0.04]">
                <span className="text-[11px] text-[#64748B] block">Beta</span>
                <span className="text-xs font-semibold text-white tabular-nums">
                  {ticker.beta.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Company Summary */}
          {ticker.description && (
            <div className="p-3 rounded-lg bg-[#191b23] border border-white/[0.04] text-xs space-y-1">
              <span className="text-[#64748B] font-semibold uppercase tracking-wider block text-[10px]">
                About {ticker.name}
              </span>
              <p className="text-[#94A3B8] leading-relaxed">
                {ticker.description}
              </p>
            </div>
          )}
        </div>

        {/* Bottom Floating Order Action Bar */}
        <div className="p-3 border-t border-white/[0.08] bg-[#10131a] flex items-center space-x-3">
          <button
            onClick={() => {
              onClose();
              openTradeModal(ticker, 'BUY');
            }}
            className="flex-1 py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-sm shadow-[0_0_16px_rgba(16,185,129,0.35)] active:scale-95 transition-all flex items-center justify-center space-x-1"
          >
            <span>Buy {ticker.symbol}</span>
          </button>

          <button
            onClick={() => {
              onClose();
              openTradeModal(ticker, 'SELL');
            }}
            className="flex-1 py-3 rounded-xl bg-[#F43F5E] hover:bg-[#e11d48] text-white font-bold text-sm shadow-[0_0_16px_rgba(244,63,94,0.35)] active:scale-95 transition-all flex items-center justify-center space-x-1"
          >
            <span>Sell {ticker.symbol}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
