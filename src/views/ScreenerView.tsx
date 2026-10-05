import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext.tsx';
import { Ticker } from '../types/market.ts';

export const ScreenerView: React.FC = () => {
  const { tickers, openStockModal, openTradeModal, selectedCollection, setSelectedCollection } = useMarket();

  const [sectorFilter, setSectorFilter] = useState<string>('All');
  const [capFilter, setCapFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'change' | 'price' | 'volume' | 'marketCap'>('change');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const sectors = ['All', 'Electronic Technology', 'Producer Manufacturing', 'Technology Services', 'Finance', 'Health Technology'];

  const filteredTickers = tickers.filter(t => {
    if (selectedCollection && !t.categories.includes(selectedCollection)) {
      return false;
    }
    if (sectorFilter !== 'All' && t.sector !== sectorFilter) {
      return false;
    }
    if (capFilter === 'Mega') {
      return t.marketCap.includes('T');
    } else if (capFilter === 'Large') {
      return t.marketCap.includes('B') && parseFloat(t.marketCap.replace(/[^0-9.]/g, '')) >= 50;
    }
    return true;
  });

  const sortedTickers = [...filteredTickers].sort((a, b) => {
    let diff = 0;
    if (sortBy === 'change') {
      diff = b.changePercent - a.changePercent;
    } else if (sortBy === 'price') {
      diff = b.price - a.price;
    } else if (sortBy === 'volume') {
      diff = parseFloat(b.volume) - parseFloat(a.volume);
    } else if (sortBy === 'marketCap') {
      const getVal = (cap: string) => (cap.includes('T') ? parseFloat(cap) * 1000 : parseFloat(cap));
      diff = getVal(b.marketCap) - getVal(a.marketCap);
    }
    return sortOrder === 'desc' ? diff : -diff;
  });

  const toggleSort = (field: 'change' | 'price' | 'volume' | 'marketCap') => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="flex flex-col w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto px-4 space-y-4 pb-24 pt-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Stock Screener</h2>
          <span className="text-xs text-[#64748B]">
            Filter &amp; rank equities by technical and fundamental parameters
          </span>
        </div>
        {selectedCollection && (
          <button
            onClick={() => setSelectedCollection(null)}
            className="px-2.5 py-1 rounded-full bg-[#2962ff]/20 text-[#b6c4ff] text-xs font-semibold flex items-center space-x-1"
          >
            <span>Preset: {selectedCollection}</span>
            <span className="material-symbols-outlined text-[14px]">close</span>
          </button>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="p-3 rounded-xl bg-[#131722] border border-white/[0.08] space-y-3 text-xs">
        {/* Sector scroll */}
        <div>
          <span className="text-[#64748B] block mb-1 font-semibold uppercase tracking-wider text-[10px]">
            Sector Filter
          </span>
          <div className="flex space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
            {sectors.map(sec => (
              <button
                key={sec}
                onClick={() => setSectorFilter(sec)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  sectorFilter === sec
                    ? 'bg-[#2962ff] text-white shadow-sm'
                    : 'bg-[#191b23] text-[#94A3B8] hover:text-white'
                }`}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>

        {/* Market Cap Selector */}
        <div className="flex items-center justify-between pt-1 border-t border-white/[0.04]">
          <span className="text-[#64748B] font-semibold text-[11px]">Market Cap:</span>
          <div className="flex space-x-1">
            {[
              { id: 'All', label: 'All' },
              { id: 'Mega', label: 'Mega ($1T+)' },
              { id: 'Large', label: 'Large ($50B+)' },
            ].map(cap => (
              <button
                key={cap.id}
                onClick={() => setCapFilter(cap.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                  capFilter === cap.id
                    ? 'bg-[#272a32] text-white shadow-sm'
                    : 'text-[#64748B] hover:text-white'
                }`}
              >
                {cap.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Screener Table Header */}
      <div className="rounded-xl bg-[#131722] border border-white/[0.08] overflow-hidden shadow-sm">
        <div className="grid grid-cols-12 px-3 py-2.5 bg-[#10131a] border-b border-white/[0.06] text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
          <div className="col-span-4 sm:col-span-5">Symbol / Company</div>
          <button
            onClick={() => toggleSort('price')}
            className="col-span-3 sm:col-span-2 text-right hover:text-white flex items-center justify-end space-x-0.5"
          >
            <span>Price</span>
            {sortBy === 'price' && (
              <span className="material-symbols-outlined text-[13px]">
                {sortOrder === 'desc' ? 'arrow_downward' : 'arrow_upward'}
              </span>
            )}
          </button>
          <button
            onClick={() => toggleSort('change')}
            className="col-span-3 sm:col-span-3 text-right hover:text-white flex items-center justify-end space-x-0.5"
          >
            <span>% Change</span>
            {sortBy === 'change' && (
              <span className="material-symbols-outlined text-[13px]">
                {sortOrder === 'desc' ? 'arrow_downward' : 'arrow_upward'}
              </span>
            )}
          </button>
          <div className="hidden sm:block sm:col-span-2 text-right">Volume</div>
        </div>

        {/* Screener Table Rows */}
        <div className="divide-y divide-white/[0.04]">
          {sortedTickers.map(t => {
            const isPositive = t.changePercent >= 0;
            return (
              <div
                key={t.symbol}
                onClick={() => openStockModal(t)}
                className="grid grid-cols-12 px-3 py-3 items-center hover:bg-[#191b23] cursor-pointer transition-colors group"
              >
                <div className="col-span-4 sm:col-span-5 flex items-center space-x-2.5 min-w-0 pr-2">
                  <div
                    className={`w-7 h-7 rounded-md flex items-center justify-center font-bold text-[10px] shrink-0 ${
                      isPositive ? 'bg-emerald-500/15 text-[#10B981]' : 'bg-rose-500/15 text-[#F43F5E]'
                    }`}
                  >
                    {t.symbol.slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-white group-hover:text-primary transition-colors block truncate">
                      {t.symbol}
                    </span>
                    <span className="text-[10px] text-[#64748B] block truncate">
                      {t.name}
                    </span>
                  </div>
                </div>

                <div className="col-span-3 sm:col-span-2 text-right">
                  <span className="text-xs font-semibold text-white tabular-nums">
                    ${t.price.toFixed(2)}
                  </span>
                </div>

                <div className="col-span-3 sm:col-span-3 text-right">
                  <span
                    className={`inline-block px-1.5 py-0.5 rounded-full text-[11px] font-semibold tabular-nums ${
                      isPositive ? 'bg-emerald-500/15 text-[#10B981]' : 'bg-rose-500/15 text-[#F43F5E]'
                    }`}
                  >
                    {isPositive ? `+${t.changePercent.toFixed(2)}%` : `${t.changePercent.toFixed(2)}%`}
                  </span>
                </div>

                <div className="hidden sm:flex sm:col-span-2 justify-end items-center space-x-2 text-right text-xs text-[#94A3B8] tabular-nums">
                  <span>{t.volume}</span>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      openTradeModal(t, 'BUY');
                    }}
                    className="p-1 rounded bg-[#2962ff]/20 text-[#b6c4ff] hover:bg-[#2962ff] hover:text-white transition-colors"
                    title="Trade"
                  >
                    <span className="material-symbols-outlined text-[14px]">swap_horiz</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
