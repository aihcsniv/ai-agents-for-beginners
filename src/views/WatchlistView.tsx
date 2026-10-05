import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext.tsx';

export const WatchlistView: React.FC = () => {
  const {
    watchlistSymbols,
    tickers,
    openStockModal,
    openTradeModal,
    toggleWatchlist,
    setIsSearchOpen,
  } = useMarket();

  const [filterCategory, setFilterCategory] = useState<'All' | 'Gainers' | 'Losers'>('All');

  const watchlistedTickers = tickers.filter(t => watchlistSymbols.includes(t.symbol));

  const filteredTickers = watchlistedTickers.filter(t => {
    if (filterCategory === 'Gainers') return t.changePercent > 0;
    if (filterCategory === 'Losers') return t.changePercent < 0;
    return true;
  });

  const advancingCount = watchlistedTickers.filter(t => t.changePercent > 0).length;
  const decliningCount = watchlistedTickers.filter(t => t.changePercent < 0).length;

  return (
    <div className="flex flex-col w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto px-4 space-y-4 pb-24 pt-2">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Active Watchlist</h2>
          <span className="text-xs text-[#64748B]">
            {watchlistedTickers.length} instruments tracked in real-time
          </span>
        </div>

        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#2962ff] text-white text-xs font-semibold shadow-md active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>Add Symbol</span>
        </button>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#131722] border border-white/[0.08] text-xs">
        <div>
          <span className="text-[#64748B] block">Total Tracked</span>
          <span className="text-sm font-bold text-white tabular-nums">{watchlistedTickers.length}</span>
        </div>
        <div>
          <span className="text-[#10B981] block">Advancing</span>
          <span className="text-sm font-bold text-[#10B981] tabular-nums">{advancingCount}</span>
        </div>
        <div>
          <span className="text-[#F43F5E] block">Declining</span>
          <span className="text-sm font-bold text-[#F43F5E] tabular-nums">{decliningCount}</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-[#131722] p-1 rounded-lg border border-white/[0.06] text-xs">
        {(['All', 'Gainers', 'Losers'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilterCategory(tab)}
            className={`flex-1 py-1.5 rounded-md font-semibold transition-all ${
              filterCategory === tab
                ? 'bg-[#272a32] text-white shadow-sm'
                : 'text-[#64748B] hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tickers List */}
      {filteredTickers.length === 0 ? (
        <div className="py-16 text-center rounded-xl bg-[#131722] border border-white/[0.08] p-6 space-y-3">
          <span className="material-symbols-outlined text-4xl text-[#64748B]">star_border</span>
          <p className="text-sm font-semibold text-white">Your watchlist is currently empty</p>
          <p className="text-xs text-[#94A3B8]">
            Search and add tickers like NVDA, TSLA, AAPL, or AMD to track live price movements.
          </p>
          <button
            onClick={() => setIsSearchOpen(true)}
            className="px-4 py-2 rounded-lg bg-[#2962ff] text-white text-xs font-semibold inline-block"
          >
            Find Symbols
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTickers.map(t => {
            const isPositive = t.changePercent >= 0;
            return (
              <div
                key={t.symbol}
                className="p-3.5 rounded-xl bg-[#131722] border border-white/[0.08] hover:border-white/[0.14] transition-all flex items-center justify-between group"
              >
                {/* Left: Avatar + Details */}
                <div
                  onClick={() => openStockModal(t)}
                  className="flex items-center space-x-3 cursor-pointer min-w-0 flex-1"
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                      isPositive ? 'bg-emerald-500/15 text-[#10B981]' : 'bg-rose-500/15 text-[#F43F5E]'
                    }`}
                  >
                    {t.symbol.slice(0, 2)}
                  </div>
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                        {t.symbol}
                      </span>
                      <span className="text-[10px] text-[#64748B] px-1 rounded bg-[#191b23]">
                        {t.exchange}
                      </span>
                    </div>
                    <span className="text-xs text-[#64748B] block truncate">
                      {t.name}
                    </span>
                  </div>
                </div>

                {/* Center: Sparkline */}
                <svg className="w-14 h-6 hidden sm:block shrink-0 mx-2" fill="none" viewBox="0 0 56 24">
                  <path
                    d={
                      isPositive
                        ? 'M1,20 Q15,14 30,10 T55,3'
                        : 'M1,4 Q16,8 30,14 T55,20'
                    }
                    fill="none"
                    stroke={isPositive ? '#10B981' : '#F43F5E'}
                    strokeWidth="1.75"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Right: Price & Actions */}
                <div className="flex items-center space-x-3 shrink-0">
                  <div className="text-right">
                    <span className="text-sm font-bold text-white tabular-nums block">
                      ${t.price.toFixed(2)}
                    </span>
                    <span
                      className={`text-[11px] font-semibold tabular-nums px-1.5 py-0.5 rounded-full ${
                        isPositive ? 'bg-emerald-500/15 text-[#10B981]' : 'bg-rose-500/15 text-[#F43F5E]'
                      }`}
                    >
                      {isPositive ? `+${t.changePercent.toFixed(2)}%` : `${t.changePercent.toFixed(2)}%`}
                    </span>
                  </div>

                  {/* Quick Trade Button */}
                  <button
                    onClick={() => openTradeModal(t, 'BUY')}
                    className="p-1.5 rounded-lg bg-[#2962ff]/20 hover:bg-[#2962ff] text-[#b6c4ff] hover:text-white transition-all text-xs font-semibold"
                    title="Paper Trade"
                  >
                    <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
                  </button>

                  {/* Remove Star */}
                  <button
                    onClick={() => toggleWatchlist(t.symbol)}
                    className="p-1.5 rounded-lg text-amber-400 hover:text-[#64748B] transition-colors"
                    title="Remove from watchlist"
                  >
                    <span className="material-symbols-outlined text-[18px] fill-1">star</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
