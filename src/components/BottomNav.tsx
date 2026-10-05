import React from 'react';
import { useMarket } from '../context/MarketContext.tsx';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useMarket();

  const navItems = [
    { id: 'markets', label: 'Markets', icon: 'query_stats' },
    { id: 'watchlist', label: 'Watchlist', icon: 'format_list_bulleted' },
    { id: 'screener', label: 'Screener', icon: 'filter_alt' },
    { id: 'ideas', label: 'Ideas', icon: 'lightbulb' },
    { id: 'profile', label: 'Profile', icon: 'manage_accounts' },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full z-50 bg-[#10131a]/90 backdrop-blur-xl border-t border-white/[0.08] shadow-[0_-2px_16px_rgba(0,0,0,0.4)]">
      <div className="max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-5xl mx-auto flex items-center justify-around h-16 px-2">
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center gap-1 min-w-[56px] h-12 rounded-xl transition-all active:scale-95 relative ${
                isActive
                  ? 'text-[#b6c4ff] font-semibold'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              {isActive && (
                <span className="absolute top-1 w-1 h-1 rounded-full bg-[#2962ff] shadow-[0_0_6px_#2962ff]" />
              )}
              <span className={`material-symbols-outlined text-[22px] ${isActive ? 'fill-1' : ''}`}>
                {item.icon}
              </span>
              <span className="text-[11px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
