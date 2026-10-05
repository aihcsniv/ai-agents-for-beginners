import React from 'react';
import { MarketProvider, useMarket } from './context/MarketContext.tsx';
import { Header } from './components/Header.tsx';
import { BottomNav } from './components/BottomNav.tsx';
import { MarketsView } from './views/MarketsView.tsx';
import { WatchlistView } from './views/WatchlistView.tsx';
import { ScreenerView } from './views/ScreenerView.tsx';
import { IdeasView } from './views/IdeasView.tsx';
import { ProfileView } from './views/ProfileView.tsx';
import { StockDetailModal } from './components/StockDetailModal.tsx';
import { PaperTradeModal } from './components/PaperTradeModal.tsx';
import { HeatmapModal } from './components/HeatmapModal.tsx';
import { SearchModal } from './components/SearchModal.tsx';
import { NotificationsModal } from './components/NotificationsModal.tsx';

const MainContent: React.FC = () => {
  const {
    activeTab,
    selectedTicker,
    setSelectedTicker,
    isTradeModalOpen,
    tradeTargetTicker,
    tradeSide,
    closeTradeModal,
    toastMessage,
  } = useMarket();

  return (
    <div className="min-h-screen bg-[#10131a] text-[#e0e2ec] flex flex-col relative selection:bg-[#2962ff] selection:text-white">
      {/* Top Header */}
      <Header />

      {/* Main Screen Views */}
      <main className="flex-1 w-full pt-18">
        {activeTab === 'markets' && <MarketsView />}
        {activeTab === 'watchlist' && <WatchlistView />}
        {activeTab === 'screener' && <ScreenerView />}
        {activeTab === 'ideas' && <IdeasView />}
        {activeTab === 'profile' && <ProfileView />}
      </main>

      {/* Bottom Navigation Tab Bar */}
      <BottomNav />

      {/* Global Modals */}
      {selectedTicker && (
        <StockDetailModal
          ticker={selectedTicker}
          onClose={() => setSelectedTicker(null)}
        />
      )}

      {isTradeModalOpen && tradeTargetTicker && (
        <PaperTradeModal
          ticker={tradeTargetTicker}
          initialSide={tradeSide}
          onClose={closeTradeModal}
        />
      )}

      <HeatmapModal />
      <SearchModal />
      <NotificationsModal />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-[#191b23]/95 border border-white/15 text-white text-xs font-semibold shadow-2xl backdrop-blur-md flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <span className="material-symbols-outlined text-[16px] text-[#2962ff]">info</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <MarketProvider>
      <MainContent />
    </MarketProvider>
  );
}
