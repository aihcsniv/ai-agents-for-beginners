import React from 'react';
import { useMarket } from '../context/MarketContext.tsx';

export const Header: React.FC = () => {
  const {
    setIsSearchOpen,
    setIsNotificationsOpen,
    setActiveTab,
    alerts,
  } = useMarket();

  const unreadAlertsCount = alerts.filter(a => a.unread).length;

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-[#10131a]/85 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_1px_8px_rgba(0,0,0,0.25)]">
      <div className="max-w-7xl mx-auto h-16 px-4 flex items-center justify-between gap-2">
        {/* Left: Brand & Live Market Indicator */}
        <div className="flex items-center gap-3 min-w-0">
          <div 
            onClick={() => setActiveTab('markets')}
            className="flex items-center gap-2 shrink-0 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#2962ff] flex items-center justify-center shadow-[0_0_12px_rgba(41,98,255,0.4)] transition-transform group-hover:scale-105">
              <span className="material-symbols-outlined text-white text-[20px]">candlestick_chart</span>
            </div>
            <span className="text-[17px] font-semibold text-white tracking-tight hidden sm:inline group-hover:text-primary transition-colors">
              Apex Terminal
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
            </span>
            <span className="text-[11px] font-semibold text-[#10B981] tracking-wider uppercase">
              US Open
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search symbols"
            className="w-10 h-10 rounded-lg flex items-center justify-center text-[#c3c5d8] hover:text-white hover:bg-white/[0.06] active:scale-95 transition-all"
            title="Search tickers (Cmd+K)"
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
          </button>

          {/* Notifications Trigger */}
          <button
            onClick={() => setIsNotificationsOpen(true)}
            aria-label="Notifications"
            className="w-10 h-10 rounded-lg flex items-center justify-center text-[#c3c5d8] hover:text-white hover:bg-white/[0.06] active:scale-95 transition-all relative"
            title="Market alerts"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadAlertsCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#2962ff] shadow-[0_0_6px_#2962ff]"></span>
            )}
          </button>

          {/* Profile Trigger */}
          <button
            onClick={() => setActiveTab('profile')}
            aria-label="Account & Paper Trading"
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2962ff] to-[#60a5fa] flex items-center justify-center shrink-0 ml-1 text-white shadow-sm hover:opacity-90 active:scale-95 transition-all"
            title="Account & Paper Portfolio"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </button>
        </div>
      </div>
    </header>
  );
};
