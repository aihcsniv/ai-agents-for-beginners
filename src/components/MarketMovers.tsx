import React from 'react';
import { useMarket } from '../context/MarketContext.tsx';
import { Ticker } from '../types/market.ts';

export const MarketMovers: React.FC = () => {
  const {
    moversTab,
    setMoversTab,
    tickers,
    openStockModal,
    isWatchlisted,
    toggleWatchlist,
    setActiveTab,
  } = useMarket();

  // Filter and sort based on tab
  const getFilteredTickers = (): Ticker[] => {
    switch (moversTab) {
      case 'Gainers':
        return [...tickers].sort((a, b) => b.changePercent - a.changePercent);
      case 'Losers':
        return [...tickers].sort((a, b) => a.changePercent - b.changePercent);
      case 'Unusual Vol':
        return [...tickers].filter(t => t.categories.includes('Most volatile') || t.categories.includes('Pre-market gainers'));
      case 'Most Active':
      default:
        return tickers;
    }
  };

  const displayedTickers = getFilteredTickers().slice(0, 6);

  return (
    <div id="market-movers-section" className="rounded-xl bg-[#131722] border border-white/[0.08] p-4 shadow-sm space-y-3.5">
      {/* Title & View All */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-white">Market Movers</h3>
        <button
          onClick={() => setActiveTab('screener')}
          className="text-xs text-[#b6c4ff] hover:underline font-medium"
        >
          View All
        </button>
      </div>

      {/* Interactive Sub-tabs */}
      <div className="flex space-x-1 p-1 rounded-lg bg-[#0b0e15] border border-white/[0.04]">
        {(['Most Active', 'Gainers', 'Losers', 'Unusual Vol'] as const).map(tab => {
          const isActive = moversTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setMoversTab(tab)}
              className={`flex-1 py-1.5 text-center rounded-md text-[11px] font-semibold transition-all active:scale-95 ${
                isActive
                  ? 'bg-[#272a32] text-white shadow-sm'
                  : 'text-[#64748B] hover:text-[#e0e2ec]'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Ticker Rows */}
      <div className="space-y-1">
        {displayedTickers.map(t => {
          const isPositive = t.changePercent >= 0;
          const initials = t.symbol.slice(0, 2);
          const watchlisted = isWatchlisted(t.symbol);

          return (
            <div
              key={t.symbol}
              onClick={() => openStockModal(t)}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-[#191b23] border border-transparent hover:border-white/[0.05] transition-all cursor-pointer group"
            >
              {/* Left Column: Avatar & Symbol / Name */}
              <div className="flex items-center space-x-3 min-w-0">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[11px] shrink-0 ${
                    isPositive
                      ? 'bg-emerald-500/15 text-[#10B981]'
                      : 'bg-rose-500/15 text-[#F43F5E]'
                  }`}
                >
                  {initials}
                </div>
                <div className="min-w-0">
                  <span className="text-[13px] font-semibold text-white group-hover:text-primary transition-colors block truncate">
                    {t.symbol}
                  </span>
                  <span className="text-xs text-[#64748B] block truncate">
                    {t.name}
                  </span>
                </div>
              </div>

              {/* Right Column: Mini Sparkline & Price + % Badge */}
              <div className="flex items-center space-x-3 shrink-0">
                {/* Mini SVG Sparkline */}
                <svg className="w-12 h-5 hidden xs:block" fill="none" viewBox="0 0 48 20">
                  <path
                    d={
                      isPositive
                        ? 'M0,17 Q12,14 24,9 T48,2'
                        : 'M0,4 Q14,7 28,14 T48,18'
                    }
                    fill="none"
                    stroke={isPositive ? '#10B981' : '#F43F5E'}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>

                <div className="flex flex-col items-end">
                  <span className="text-[13px] font-bold text-white tracking-tight tabular-nums">
                    ${t.price.toFixed(2)}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[11px] font-semibold tabular-nums ${
                      isPositive
                        ? 'bg-emerald-500/15 text-[#10B981]'
                        : 'bg-rose-500/15 text-[#F43F5E]'
                    }`}
                  >
                    {isPositive ? `+${t.changePercent.toFixed(2)}%` : `${t.changePercent.toFixed(2)}%`}
                  </span>
                </div>

                {/* Quick Watchlist Star */}
                <button
                  onClick={e => {
                    e.stopPropagation();
                    toggleWatchlist(t.symbol);
                  }}
                  aria-label={`Toggle watchlist for ${t.symbol}`}
                  className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity p-1 text-[#64748B] hover:text-amber-400"
                  title={watchlisted ? 'Remove from watchlist' : 'Add to watchlist'}
                >
                  <span
                    className={`material-symbols-outlined text-[18px] ${
                      watchlisted ? 'text-amber-400 fill-1' : ''
                    }`}
                  >
                    star
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
