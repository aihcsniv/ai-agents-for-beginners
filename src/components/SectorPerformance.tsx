import React from 'react';
import { useMarket } from '../context/MarketContext.tsx';

export const SectorPerformance: React.FC = () => {
  const { sectors, setIsHeatmapOpen, openStockModal } = useMarket();

  return (
    <div id="sectors-section" className="rounded-xl bg-[#131722] border border-white/[0.08] p-4 shadow-sm space-y-3.5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-white">Sector Performance</h3>
          <span className="text-xs text-[#64748B]">1 Month Relative Strength</span>
        </div>
        <button
          onClick={() => setIsHeatmapOpen(true)}
          className="flex items-center space-x-1 text-[#b6c4ff] hover:text-white transition-colors text-xs font-semibold px-2 py-1 rounded-lg hover:bg-white/[0.04]"
        >
          <span>Heatmap</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        </button>
      </div>

      {/* Sector Stacked Metric Bars */}
      <div className="space-y-3">
        {sectors.map(sec => {
          const isPositive = sec.changePercent >= 0;
          return (
            <div
              key={sec.name}
              onClick={() => openStockModal(sec.leadingStock)}
              className="space-y-1.5 cursor-pointer group p-1 -m-1 rounded-lg hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#F8FAFC] group-hover:text-primary transition-colors font-medium">
                  {sec.name}
                </span>
                <span
                  className={`font-semibold tabular-nums ${
                    isPositive ? 'text-[#10B981]' : 'text-[#F43F5E]'
                  }`}
                >
                  {isPositive ? `+${sec.changePercent.toFixed(2)}%` : `${sec.changePercent.toFixed(2)}%`}
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#272a32] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isPositive ? 'bg-[#10B981]' : 'bg-[#F43F5E]'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(5, sec.strengthScore))}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
