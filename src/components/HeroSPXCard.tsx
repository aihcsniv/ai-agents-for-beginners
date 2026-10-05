import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext.tsx';

export const HeroSPXCard: React.FC = () => {
  const {
    sp500,
    sp500Timeframe,
    setSp500Timeframe,
    openStockModal,
  } = useMarket();

  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; val: number; index: number } | null>(null);

  // Get historical data for the selected timeframe
  const historyData = sp500.history[sp500Timeframe] || sp500.history['1D'];
  const minVal = Math.min(...historyData);
  const maxVal = Math.max(...historyData);
  const range = maxVal - minVal || 1;

  // Build SVG path coordinates (viewBox 0 0 340 90, with 10px padding)
  const width = 340;
  const height = 90;
  const paddingY = 8;
  const chartHeight = height - paddingY * 2;

  const points = historyData.map((val, idx) => {
    const x = (idx / (historyData.length - 1)) * width;
    const y = height - paddingY - ((val - minVal) / range) * chartHeight;
    return { x, y, val };
  });

  // Construct SVG path string with smoothing
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
  const lastPoint = points[points.length - 1] || { x: width, y: 10, val: sp500.price };

  const currentDisplayPrice = hoveredPoint ? hoveredPoint.val : sp500.price;

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clientX / rect.width));
    const index = Math.round(ratio * (points.length - 1));
    const target = points[index];
    if (target) {
      setHoveredPoint({ ...target, index });
    }
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  return (
    <div className="relative overflow-hidden rounded-xl bg-[#131722]/90 border border-white/[0.08] p-4 shadow-xl backdrop-blur-md transition-all hover:border-white/[0.14]">
      {/* Header Info */}
      <div className="flex items-start justify-between">
        <div 
          onClick={() => openStockModal(sp500.symbol)}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#F43F5E]/20 flex items-center justify-center text-[#F43F5E] text-base font-bold shadow-sm group-hover:scale-105 transition-transform">
            {sp500.badge}
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-base font-bold text-white group-hover:text-primary transition-colors">
                {sp500.ticker}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-[#32353d] text-[#c3c5d8] text-[11px] font-semibold">
                {sp500.symbol}
              </span>
            </div>
            <span className="text-xs text-[#64748B]">
              {sp500.exchange}
            </span>
          </div>
        </div>

        {/* Price & Change */}
        <div className="flex flex-col items-end">
          <span className="text-2xl font-bold text-white tracking-tight tabular-nums">
            {currentDisplayPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <div className="flex items-center space-x-1 px-2 py-0.5 mt-0.5 rounded-full bg-emerald-500/15 text-[#10B981] text-xs font-semibold">
            <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
            <span>
              +{sp500.change.toFixed(2)} (+{sp500.changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Time-series Sparkline SVG */}
      <div className="relative w-full h-24 my-3 cursor-crosshair">
        <svg
          className="w-full h-full overflow-visible"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 340 90"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchMove={e => {
            const touch = e.touches[0];
            const rect = e.currentTarget.getBoundingClientRect();
            const clientX = touch.clientX - rect.left;
            const ratio = Math.max(0, Math.min(1, clientX / rect.width));
            const index = Math.round(ratio * (points.length - 1));
            const target = points[index];
            if (target) setHoveredPoint({ ...target, index });
          }}
          onTouchEnd={handleMouseLeave}
        >
          <defs>
            <linearGradient id="spxGlow" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Area fill */}
          <path d={fillD} fill="url(#spxGlow)" />

          {/* Stroke path */}
          <path
            d={pathD}
            stroke="#10B981"
            strokeLinecap="round"
            strokeWidth="2.5"
          />

          {/* Hover scrubber vertical line & cursor dot */}
          {hoveredPoint ? (
            <>
              <line
                x1={hoveredPoint.x}
                y1={0}
                x2={hoveredPoint.x}
                y2={height}
                stroke="rgba(255,255,255,0.3)"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
              <circle
                className="fill-[#10B981]"
                cx={hoveredPoint.x}
                cy={hoveredPoint.y}
                r={4}
              />
              <circle
                className="stroke-white"
                cx={hoveredPoint.x}
                cy={hoveredPoint.y}
                r={6}
                fill="none"
                strokeWidth="1.5"
              />
            </>
          ) : (
            <>
              {/* Pulse animation dot on rightmost point */}
              <circle
                className="fill-[#10B981] animate-ping opacity-75"
                cx={lastPoint.x}
                cy={lastPoint.y}
                r={3.5}
              />
              <circle
                className="fill-[#10B981]"
                cx={lastPoint.x}
                cy={lastPoint.y}
                r={3}
              />
            </>
          )}
        </svg>

        {hoveredPoint && (
          <div
            className="absolute top-1 transform -translate-x-1/2 px-2 py-0.5 rounded bg-[#10131a]/95 border border-white/20 text-[10px] text-white font-mono pointer-events-none shadow-md backdrop-blur-md"
            style={{ left: `${(hoveredPoint.x / width) * 100}%` }}
          >
            ${hoveredPoint.val.toFixed(2)}
          </div>
        )}
      </div>

      {/* Time Horizon Selectors & Session Indicator */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex space-x-1">
          {(['1D', '5D', '1M', '1Y'] as const).map(tf => {
            const isSelected = sp500Timeframe === tf;
            return (
              <button
                key={tf}
                onClick={() => setSp500Timeframe(tf)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-[#32353d] text-[#b6c4ff] shadow-sm'
                    : 'text-[#64748B] hover:text-white'
                }`}
              >
                {tf}
              </button>
            );
          })}
        </div>

        <div className="flex items-center space-x-1.5 text-[#10B981] text-[11px] font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
          <span>Market Open</span>
        </div>
      </div>
    </div>
  );
};
