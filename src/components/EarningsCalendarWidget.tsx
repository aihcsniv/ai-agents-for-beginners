import React from 'react';
import { useMarket } from '../context/MarketContext.tsx';

export const EarningsCalendarWidget: React.FC = () => {
  const { earnings, openStockModal, showToast } = useMarket();

  return (
    <div id="earnings-section" className="rounded-xl bg-[#131722] border border-white/[0.08] p-4 shadow-sm space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="material-symbols-outlined text-[20px] text-[#3B82F6]">event_note</span>
          <h3 className="text-base font-semibold text-white">Earnings Calendar</h3>
        </div>
        <button
          onClick={() => showToast('Full calendar: 48 reports scheduled this week across US exchanges')}
          className="text-xs text-[#b6c4ff] hover:underline font-medium"
        >
          Full Calendar
        </button>
      </div>

      {/* Horizontal scrollable cards */}
      <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-1">
        {earnings.map(ev => {
          const isNegativeEps = ev.epsEstimate.includes('−') || ev.epsEstimate.includes('-');
          return (
            <div
              key={ev.symbol}
              onClick={() => openStockModal(ev.symbol)}
              className="min-w-[210px] p-3 rounded-lg bg-[#191b23] border border-white/[0.04] hover:border-white/[0.12] flex flex-col justify-between space-y-2.5 cursor-pointer transition-all hover:bg-[#1d2027] shrink-0 group"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-[#2962ff]/20 text-[#b6c4ff] text-[11px] font-semibold">
                  {ev.date}
                </span>
                <span className="text-[11px] text-[#64748B] font-medium">
                  {ev.session}
                </span>
              </div>

              <div>
                <span className="text-sm font-bold text-white group-hover:text-primary transition-colors block">
                  {ev.symbol}
                </span>
                <span className="text-xs text-[#64748B] block truncate">
                  {ev.company}
                </span>
              </div>

              <div className="flex items-baseline justify-between pt-1 border-t border-white/[0.04]">
                <span className="text-[11px] text-[#94A3B8]">EPS Est.</span>
                <span
                  className={`text-xs font-semibold tabular-nums ${
                    isNegativeEps ? 'text-[#F43F5E]' : 'text-white'
                  }`}
                >
                  {ev.epsEstimate}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
