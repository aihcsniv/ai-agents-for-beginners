import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext.tsx';

interface HeatmapTile {
  symbol: string;
  name: string;
  sector: string;
  changePercent: number;
  weight: number; // 1 to 4 size factor
  price: number;
}

const HEATMAP_DATA: HeatmapTile[] = [
  // Tech / Semiconductors
  { symbol: 'NVDA', name: 'Nvidia', sector: 'Tech', changePercent: 4.12, weight: 4, price: 138.25 },
  { symbol: 'AAPL', name: 'Apple', sector: 'Tech', changePercent: 0.73, weight: 4, price: 227.80 },
  { symbol: 'MSFT', name: 'Microsoft', sector: 'Tech', changePercent: 1.15, weight: 4, price: 421.40 },
  { symbol: 'AMD', name: 'AMD', sector: 'Tech', changePercent: 2.85, weight: 2, price: 162.40 },
  { symbol: 'MU', name: 'Micron', sector: 'Tech', changePercent: 5.60, weight: 2, price: 108.90 },
  { symbol: 'AVGO', name: 'Broadcom', sector: 'Tech', changePercent: 3.20, weight: 3, price: 178.50 },
  { symbol: 'PLTR', name: 'Palantir', sector: 'Tech', changePercent: 5.38, weight: 2, price: 42.15 },
  // Consumer / Auto
  { symbol: 'TSLA', name: 'Tesla', sector: 'Consumer', changePercent: 3.45, weight: 3, price: 250.08 },
  { symbol: 'AMZN', name: 'Amazon', sector: 'Consumer', changePercent: 1.84, weight: 3, price: 186.20 },
  { symbol: 'WMT', name: 'Walmart', sector: 'Consumer', changePercent: -1.20, weight: 2, price: 79.40 },
  { symbol: 'COST', name: 'Costco', sector: 'Consumer', changePercent: 0.45, weight: 2, price: 895.00 },
  // Aerospace & Industrial
  { symbol: 'SPCX', name: 'SpaceX ETF', sector: 'Industrial', changePercent: 7.35, weight: 2, price: 158.96 },
  { symbol: 'CAT', name: 'Caterpillar', sector: 'Industrial', changePercent: 1.95, weight: 2, price: 395.20 },
  { symbol: 'GE', name: 'GE Aerospace', sector: 'Industrial', changePercent: 2.10, weight: 2, price: 188.40 },
  // Finance
  { symbol: 'JPM', name: 'JPMorgan', sector: 'Finance', changePercent: -2.15, weight: 3, price: 218.40 },
  { symbol: 'V', name: 'Visa', sector: 'Finance', changePercent: -1.05, weight: 2, price: 275.60 },
  { symbol: 'COIN', name: 'Coinbase', sector: 'Finance', changePercent: 5.61, weight: 2, price: 184.50 },
  // Energy
  { symbol: 'XOM', name: 'ExxonMobil', sector: 'Energy', changePercent: -0.28, weight: 3, price: 119.50 },
  { symbol: 'CVX', name: 'Chevron', sector: 'Energy', changePercent: -0.85, weight: 2, price: 148.10 },
  // Memory & Hardware
  { symbol: 'SNDK', name: 'Sandisk', sector: 'Tech', changePercent: -1.15, weight: 1, price: 48.20 },
  { symbol: 'SMCI', name: 'SuperMicro', sector: 'Tech', changePercent: -4.88, weight: 2, price: 46.80 },
];

export const HeatmapModal: React.FC = () => {
  const { isHeatmapOpen, setIsHeatmapOpen, openStockModal } = useMarket();
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Tech' | 'Consumer' | 'Finance' | 'Energy'>('All');

  if (!isHeatmapOpen) return null;

  const filteredTiles = selectedFilter === 'All'
    ? HEATMAP_DATA
    : HEATMAP_DATA.filter(t => t.sector === selectedFilter);

  const getTileBg = (chg: number) => {
    if (chg >= 5.0) return 'bg-[#059669] hover:bg-[#10B981] border-emerald-400/40 text-white';
    if (chg >= 2.0) return 'bg-[#10B981]/90 hover:bg-[#10B981] border-emerald-400/30 text-white';
    if (chg > 0) return 'bg-[#10B981]/60 hover:bg-[#10B981]/80 border-emerald-500/20 text-white';
    if (chg === 0) return 'bg-[#32353d] text-[#e0e2ec]';
    if (chg >= -2.0) return 'bg-[#F43F5E]/60 hover:bg-[#F43F5E]/80 border-rose-500/20 text-white';
    if (chg >= -4.0) return 'bg-[#F43F5E]/90 hover:bg-[#F43F5E] border-rose-400/30 text-white';
    return 'bg-[#e11d48] hover:bg-[#F43F5E] border-rose-400/40 text-white';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-[#131722] border border-white/10 shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.08] bg-[#10131a]">
          <div className="flex items-center space-x-2.5">
            <span className="material-symbols-outlined text-[20px] text-[#2962ff]">grid_view</span>
            <div>
              <h3 className="text-base font-bold text-white">S&amp;P 500 Market Heatmap</h3>
              <p className="text-xs text-[#64748B]">Sized by market cap, colored by relative performance</p>
            </div>
          </div>
          <button
            onClick={() => setIsHeatmapOpen(false)}
            className="p-1.5 rounded-lg text-[#64748B] hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Filter Controls & Legend */}
        <div className="px-4 py-2.5 bg-[#191b23] border-b border-white/[0.04] flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex space-x-1">
            {(['All', 'Tech', 'Consumer', 'Finance', 'Energy'] as const).map(f => (
              <button
                key={f}
                onClick={() => setSelectedFilter(f)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  selectedFilter === f
                    ? 'bg-[#2962ff] text-white shadow-sm'
                    : 'text-[#94A3B8] hover:text-white bg-[#10131a]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Color Gradient Legend */}
          <div className="flex items-center space-x-1.5 text-[10px] text-[#94A3B8]">
            <span>-5%</span>
            <div className="flex h-3 w-28 rounded overflow-hidden">
              <div className="flex-1 bg-[#e11d48]" />
              <div className="flex-1 bg-[#F43F5E]/60" />
              <div className="flex-1 bg-[#32353d]" />
              <div className="flex-1 bg-[#10B981]/60" />
              <div className="flex-1 bg-[#059669]" />
            </div>
            <span>+5%</span>
          </div>
        </div>

        {/* Treemap Grid Container */}
        <div className="p-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 min-h-[360px]">
            {filteredTiles.map(tile => {
              const bgClass = getTileBg(tile.changePercent);
              const colSpan = tile.weight === 4 ? 'col-span-2 row-span-2' : tile.weight === 3 ? 'col-span-2' : 'col-span-1';

              return (
                <button
                  key={tile.symbol}
                  onClick={() => {
                    setIsHeatmapOpen(false);
                    openStockModal(tile.symbol);
                  }}
                  className={`${colSpan} min-h-[75px] rounded-xl p-2.5 flex flex-col justify-between border transition-all hover:scale-[1.02] shadow-sm text-left ${bgClass}`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-sm tracking-tight">{tile.symbol}</span>
                    <span className="text-[10px] font-mono opacity-90">${tile.price.toFixed(1)}</span>
                  </div>
                  <div>
                    <span className="text-[11px] opacity-80 block truncate">{tile.name}</span>
                    <span className="text-xs font-extrabold tracking-wide tabular-nums">
                      {tile.changePercent > 0 ? `+${tile.changePercent.toFixed(2)}%` : `${tile.changePercent.toFixed(2)}%`}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-white/[0.08] bg-[#10131a] flex justify-between items-center text-xs text-[#64748B]">
          <span>Tap any instrument to view technical chart and place paper orders</span>
          <span className="text-[#10B981] font-semibold">Live Updating</span>
        </div>
      </div>
    </div>
  );
};
