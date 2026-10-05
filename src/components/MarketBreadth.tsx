import React, { useState } from 'react';

export const MarketBreadth: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="rounded-xl bg-[#131722] border border-white/[0.08] p-4 shadow-sm space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="material-symbols-outlined text-[20px] text-[#b6c4ff]">equalizer</span>
          <h3 className="text-base font-semibold text-white">Market Breadth</h3>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="text-[11px] text-[#64748B] font-medium">NYSE + NASDAQ</span>
          <button 
            onClick={() => setShowTooltip(!showTooltip)}
            aria-label="Market breadth explanation"
            className="text-[#64748B] hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[15px]">info</span>
          </button>
        </div>
      </div>

      {showTooltip && (
        <div className="p-2.5 rounded-lg bg-[#191b23] border border-white/10 text-xs text-[#94A3B8] leading-relaxed animate-in fade-in">
          Market breadth measures the net participation of individual equities in the broad market rally. Advancing volume ratio above 55% signals persistent accumulation.
        </div>
      )}

      {/* Advancing vs Declining Dual Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-[#10B981] flex items-center space-x-1">
            <span className="font-semibold">Advancing</span>
            <span className="opacity-90 font-medium tabular-nums">2.4K (57.5%)</span>
          </span>
          <span className="text-[#F43F5E] flex items-center space-x-1">
            <span className="opacity-90 font-medium tabular-nums">1.77K (42.5%)</span>
            <span className="font-semibold">Declining</span>
          </span>
        </div>

        {/* Progress Track */}
        <div className="w-full h-2.5 rounded-full bg-[#272a32] flex overflow-hidden p-0.5">
          <div
            className="h-full bg-[#10B981] rounded-l-full transition-all duration-700"
            style={{ width: '57.5%' }}
            title="57.5% Advancing"
          />
          <div
            className="h-full bg-[#F43F5E] rounded-r-full transition-all duration-700"
            style={{ width: '42.5%' }}
            title="42.5% Declining"
          />
        </div>
      </div>

      {/* Breadth Technical Sub-metrics */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="p-2.5 rounded-lg bg-[#191b23] border border-white/[0.04] flex flex-col justify-between">
          <span className="text-[11px] text-[#94A3B8]">Above 50-day MA</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-sm font-bold text-white tabular-nums">29%</span>
            <span className="text-[11px] font-semibold text-[#F43F5E]">Oversold</span>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-[#191b23] border border-white/[0.04] flex flex-col justify-between">
          <span className="text-[11px] text-[#94A3B8]">Above 200-day MA</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-sm font-bold text-white tabular-nums">39%</span>
            <span className="text-[11px] font-semibold text-[#94A3B8]">Neutral</span>
          </div>
        </div>
      </div>
    </div>
  );
};
