import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext.tsx';

interface SubHeaderProps {
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const SubHeader: React.FC<SubHeaderProps> = ({ activeCategory, onSelectCategory }) => {
  const {
    selectedRegion,
    setSelectedRegion,
    countdownText,
    setIsHeatmapOpen,
    setActiveTab,
    setMoversTab,
  } = useMarket();

  const [isRegionMenuOpen, setIsRegionMenuOpen] = useState(false);

  const regions = [
    { label: 'US Stocks', flag: '🇺🇸' },
    { label: 'European Markets', flag: '🇪🇺' },
    { label: 'Asia-Pacific', flag: '🇯🇵' },
    { label: 'Crypto & Digital Assets', flag: '🌐' },
  ];

  const categories = [
    'Overview',
    'Indices',
    'Sectors',
    'Earnings',
    'Most Active',
    'Ideas',
    'Heatmap',
  ];

  const handleCategoryClick = (cat: string) => {
    onSelectCategory(cat);
    if (cat === 'Heatmap') {
      setIsHeatmapOpen(true);
    } else if (cat === 'Ideas') {
      setActiveTab('ideas');
    } else if (cat === 'Most Active') {
      setMoversTab('Most Active');
      const el = document.getElementById('market-movers-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (cat === 'Earnings') {
      const el = document.getElementById('earnings-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (cat === 'Sectors') {
      const el = document.getElementById('sectors-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (cat === 'Indices') {
      const el = document.getElementById('indices-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (cat === 'Overview') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const currentFlag = regions.find(r => r.label === selectedRegion)?.flag || '🇺🇸';

  return (
    <div className="flex flex-col space-y-3 pt-2">
      {/* Market Region Selector & Live Clock Status */}
      <div className="flex items-center justify-between relative">
        <div className="relative">
          <button
            onClick={() => setIsRegionMenuOpen(!isRegionMenuOpen)}
            className="flex items-center space-x-2 text-[#e0e2ec] hover:text-white transition-colors focus:outline-none group px-1 py-0.5 rounded-lg hover:bg-white/[0.04]"
          >
            <span className="text-[20px]">{currentFlag}</span>
            <span className="text-[17px] font-semibold text-white tracking-tight">
              {selectedRegion}
            </span>
            <span className="material-symbols-outlined text-[20px] text-[#64748B] group-hover:text-white transition-transform duration-200">
              {isRegionMenuOpen ? 'expand_less' : 'expand_more'}
            </span>
          </button>

          {/* Region Dropdown Menu */}
          {isRegionMenuOpen && (
            <div className="absolute left-0 mt-2 w-56 rounded-xl bg-[#191b23] border border-white/10 shadow-2xl z-50 overflow-hidden py-1 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                Select Market Region
              </div>
              {regions.map(r => (
                <button
                  key={r.label}
                  onClick={() => {
                    setSelectedRegion(r.label);
                    setIsRegionMenuOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-sm flex items-center justify-between transition-colors ${
                    selectedRegion === r.label
                      ? 'bg-[#2962ff]/15 text-[#2962ff] font-medium'
                      : 'text-[#e0e2ec] hover:bg-white/[0.06]'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <span>{r.flag}</span>
                    <span>{r.label}</span>
                  </span>
                  {selectedRegion === r.label && (
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Live Clock Status */}
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#272a32] border border-white/[0.06] text-[#c3c5d8]">
          <span className="material-symbols-outlined text-[15px] text-[#10B981]">schedule</span>
          <span className="text-[11px] font-medium tracking-wide">
            Closes in <strong className="text-white font-semibold">{countdownText}</strong>
          </span>
        </div>
      </div>

      {/* Quick Category Pill Scroll */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
        {categories.map(cat => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold shrink-0 transition-all active:scale-95 ${
                isActive
                  ? 'bg-[#2962ff] text-white shadow-[0_2px_10px_rgba(41,98,255,0.35)]'
                  : 'bg-[#191b23] text-[#94A3B8] hover:text-white hover:bg-[#272a32] border border-white/[0.05]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};
