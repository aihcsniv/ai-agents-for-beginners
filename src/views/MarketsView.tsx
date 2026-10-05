import React, { useState } from 'react';
import { SubHeader } from '../components/SubHeader.tsx';
import { HeroSPXCard } from '../components/HeroSPXCard.tsx';
import { IndicesGrid } from '../components/IndicesGrid.tsx';
import { MarketBreadth } from '../components/MarketBreadth.tsx';
import { SectorPerformance } from '../components/SectorPerformance.tsx';
import { MarketMovers } from '../components/MarketMovers.tsx';
import { EarningsCalendarWidget } from '../components/EarningsCalendarWidget.tsx';
import { StockCollectionsWidget } from '../components/StockCollectionsWidget.tsx';
import { CommunityIdeasWidget } from '../components/CommunityIdeasWidget.tsx';
import { PaperTradingBanner } from '../components/PaperTradingBanner.tsx';

export const MarketsView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('Overview');

  return (
    <div className="flex flex-col w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto px-4 space-y-4 pb-24">
      {/* Sub-header Chips & Market Countdown */}
      <SubHeader
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* Featured S&P 500 Hero Card */}
      <HeroSPXCard />

      {/* Secondary Indices 2-Column Grid (Nasdaq 100, Dow Jones) */}
      <IndicesGrid />

      {/* Market Breadth Gauge & Internal Moving Averages */}
      <MarketBreadth />

      {/* Sector Performance (1M) Module */}
      <SectorPerformance />

      {/* Market Movers & Most Active Instruments List */}
      <MarketMovers />

      {/* Upcoming Earnings Calendar Widget */}
      <EarningsCalendarWidget />

      {/* Stock Collections Quick Filters */}
      <StockCollectionsWidget />

      {/* Trending Community Trading Ideas */}
      <CommunityIdeasWidget />

      {/* Interactive Paper Trading Micro-Banner */}
      <PaperTradingBanner />
    </div>
  );
};
