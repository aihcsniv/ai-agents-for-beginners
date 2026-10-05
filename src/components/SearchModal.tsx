import React, { useState, useEffect, useRef } from 'react';
import { useMarket } from '../context/MarketContext.tsx';
import { Ticker } from '../types/market.ts';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, tickers, openStockModal } = useMarket();
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Stocks' | 'Semis' | 'Large-cap'>('All');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredTickers = tickers.filter(t => {
    const matchesQuery =
      t.symbol.toLowerCase().includes(query.toLowerCase()) ||
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.sector.toLowerCase().includes(query.toLowerCase());

    if (!matchesQuery) return false;

    if (filterType === 'Semis') {
      return t.sector.includes('Electronic') || t.symbol === 'NVDA' || t.symbol === 'AMD' || t.symbol === 'MU';
    }
    if (filterType === 'Large-cap') {
      return t.categories.includes('Large-cap');
    }
    return true;
  });

  const popularSymbols = ['NVDA', 'TSLA', 'AAPL', 'AMD', 'MSFT', 'SPCX'];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 pt-16 sm:pt-20 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="w-full max-w-xl rounded-2xl bg-[#131722] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-white/[0.08] bg-[#10131a] gap-3">
          <span className="material-symbols-outlined text-[22px] text-[#64748B]">search</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search ticker, company, or sector (e.g. NVDA, Apple, AI)..."
            className="flex-1 bg-transparent text-white placeholder-[#64748B] text-sm focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#64748B] hover:text-white p-1"
            >
              <span className="material-symbols-outlined text-[18px]">clear</span>
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="px-2 py-1 rounded bg-[#272a32] text-xs font-semibold text-[#c3c5d8] hover:text-white"
          >
            ESC
          </button>
        </div>

        {/* Quick Filter Chips */}
        <div className="px-4 py-2.5 bg-[#191b23] border-b border-white/[0.04] flex items-center justify-between text-xs overflow-x-auto no-scrollbar gap-2">
          <div className="flex space-x-1 shrink-0">
            {(['All', 'Stocks', 'Semis', 'Large-cap'] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  filterType === type
                    ? 'bg-[#2962ff] text-white shadow-sm'
                    : 'text-[#94A3B8] hover:text-white bg-[#10131a]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <span className="text-[11px] text-[#64748B] shrink-0">
            {filteredTickers.length} results
          </span>
        </div>

        {/* Quick Popular Tickers if no query */}
        {!query && (
          <div className="px-4 py-2.5 bg-[#10131a] border-b border-white/[0.04]">
            <span className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider block mb-1.5">
              Popular Searches
            </span>
            <div className="flex flex-wrap gap-1.5">
              {popularSymbols.map(sym => (
                <button
                  key={sym}
                  onClick={() => {
                    setIsSearchOpen(false);
                    openStockModal(sym);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#191b23] hover:bg-[#272a32] text-xs font-semibold text-white border border-white/[0.05] transition-colors"
                >
                  ${sym}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-1 flex-1">
          {filteredTickers.length === 0 ? (
            <div className="py-12 text-center text-[#64748B]">
              <span className="material-symbols-outlined text-4xl block mb-2 opacity-50">search_off</span>
              <p className="text-sm font-medium">No instruments matching &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-[#94A3B8] mt-1">Try searching for AAPL, TSLA, or NVDA</p>
            </div>
          ) : (
            filteredTickers.map(t => {
              const isPositive = t.changePercent >= 0;
              return (
                <div
                  key={t.symbol}
                  onClick={() => {
                    setIsSearchOpen(false);
                    openStockModal(t);
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#191b23] border border-transparent hover:border-white/[0.05] transition-all cursor-pointer group"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isPositive ? 'bg-emerald-500/15 text-[#10B981]' : 'bg-rose-500/15 text-[#F43F5E]'
                      }`}
                    >
                      {t.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                          {t.symbol}
                        </span>
                        <span className="px-1.5 py-0.2 rounded bg-[#272a32] text-[#94A3B8] text-[10px]">
                          {t.exchange}
                        </span>
                      </div>
                      <span className="text-xs text-[#64748B] block truncate max-w-[200px] sm:max-w-xs">
                        {t.name} · {t.sector}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold text-white tabular-nums block">
                      ${t.price.toFixed(2)}
                    </span>
                    <span
                      className={`text-[11px] font-semibold tabular-nums ${
                        isPositive ? 'text-[#10B981]' : 'text-[#F43F5E]'
                      }`}
                    >
                      {isPositive ? `+${t.changePercent.toFixed(2)}%` : `${t.changePercent.toFixed(2)}%`}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
