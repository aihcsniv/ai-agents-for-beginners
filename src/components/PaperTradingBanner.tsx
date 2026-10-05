import React from 'react';
import { useMarket } from '../context/MarketContext.tsx';

export const PaperTradingBanner: React.FC = () => {
  const { openTradeModal, tickers, setActiveTab } = useMarket();

  const handlePracticeClick = () => {
    const nvda = tickers.find(t => t.symbol === 'NVDA') || tickers[0];
    if (nvda) {
      openTradeModal(nvda, 'BUY');
    } else {
      setActiveTab('profile');
    }
  };

  return (
    <div className="rounded-xl bg-gradient-to-r from-[#2962ff]/20 via-[#2962ff]/10 to-[#131722] border border-[#2962ff]/25 p-4 flex items-center justify-between shadow-md">
      <div className="space-y-0.5 pr-2">
        <span className="text-[13px] font-semibold text-white flex items-center space-x-1.5">
          <span>Test your strategy risk-free</span>
          <span className="material-symbols-outlined text-[16px] text-[#10B981]">verified_user</span>
        </span>
        <p className="text-xs text-[#94A3B8]">
          Practice with simulated real-time market data &amp; $100K balance
        </p>
      </div>

      <button
        onClick={handlePracticeClick}
        className="px-3.5 py-1.5 rounded-lg bg-[#2962ff] hover:bg-[#1e4bd8] text-white text-xs font-semibold shrink-0 shadow-[0_2px_8px_rgba(41,98,255,0.4)] active:scale-95 transition-all"
      >
        Practice
      </button>
    </div>
  );
};
