import React from 'react';
import { useMarket } from '../context/MarketContext.tsx';

export const StockCollectionsWidget: React.FC = () => {
  const { selectedCollection, setSelectedCollection, setActiveTab, showToast } = useMarket();

  const collections = [
    { label: 'Large-cap', icon: '💎' },
    { label: 'High-dividend', icon: '💰' },
    { label: 'Most volatile', icon: '⚡' },
    { label: '52-week high', icon: '📈' },
    { label: 'Pre-market gainers', icon: '🚀' },
    { label: 'Penny stocks', icon: '🪙' },
  ];

  const handleSelect = (label: string) => {
    if (selectedCollection === label) {
      setSelectedCollection(null);
      showToast('Cleared collection filter');
    } else {
      setSelectedCollection(label);
      showToast(`Filtered by ${label}`);
      // Also can navigate to Screener for deep exploration if user wants
    }
  };

  return (
    <div className="rounded-xl bg-[#131722] border border-white/[0.08] p-4 shadow-sm space-y-3.5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-white">Stock Collections</h3>
        <span className="text-[11px] text-[#64748B] font-medium">Presets</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {collections.map(item => {
          const isSelected = selectedCollection === item.label;
          return (
            <button
              key={item.label}
              onClick={() => handleSelect(item.label)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 flex items-center space-x-1.5 ${
                isSelected
                  ? 'bg-[#2962ff] text-white shadow-md'
                  : 'bg-[#191b23] hover:bg-[#272a32] text-[#F8FAFC] border border-white/[0.05]'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
