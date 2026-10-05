import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Ticker,
  IndexData,
  SectorData,
  EarningsEvent,
  TradingIdea,
  PaperTradeOrder,
  PortfolioPosition,
  MarketAlert,
} from '../types/market.ts';
import {
  SP500_HERO,
  SECONDARY_INDICES,
  SECTOR_PERFORMANCE,
  ALL_TICKERS,
  EARNINGS_CALENDAR,
  COMMUNITY_IDEAS,
  INITIAL_ALERTS,
} from '../data/marketData.ts';

interface MarketContextType {
  activeTab: 'markets' | 'watchlist' | 'screener' | 'ideas' | 'profile';
  setActiveTab: (tab: 'markets' | 'watchlist' | 'screener' | 'ideas' | 'profile') => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  countdownText: string;
  sp500: IndexData;
  sp500Timeframe: '1D' | '5D' | '1M' | '1Y';
  setSp500Timeframe: (tf: '1D' | '5D' | '1M' | '1Y') => void;
  secondaryIndices: IndexData[];
  sectors: SectorData[];
  tickers: Ticker[];
  moversTab: 'Most Active' | 'Gainers' | 'Losers' | 'Unusual Vol';
  setMoversTab: (tab: 'Most Active' | 'Gainers' | 'Losers' | 'Unusual Vol') => void;
  selectedCollection: string | null;
  setSelectedCollection: (col: string | null) => void;
  earnings: EarningsEvent[];
  ideas: TradingIdea[];
  toggleLikeIdea: (id: string) => void;
  selectedTicker: Ticker | null;
  setSelectedTicker: (ticker: Ticker | null) => void;
  openStockModal: (tickerOrSymbol: Ticker | string) => void;
  // Paper Trading
  paperCash: number;
  positions: PortfolioPosition[];
  orderHistory: PaperTradeOrder[];
  isTradeModalOpen: boolean;
  tradeTargetTicker: Ticker | null;
  tradeSide: 'BUY' | 'SELL';
  openTradeModal: (ticker: Ticker, side?: 'BUY' | 'SELL') => void;
  closeTradeModal: () => void;
  executeTrade: (symbol: string, shares: number, side: 'BUY' | 'SELL', orderType: 'MARKET' | 'LIMIT') => { success: boolean; message: string };
  resetPaperAccount: () => void;
  // Watchlist
  watchlistSymbols: string[];
  toggleWatchlist: (symbol: string) => void;
  isWatchlisted: (symbol: string) => boolean;
  // Global Modals
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  isHeatmapOpen: boolean;
  setIsHeatmapOpen: (open: boolean) => void;
  alerts: MarketAlert[];
  markAllAlertsRead: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  // Tick simulation
  liveSimulationActive: boolean;
  setLiveSimulationActive: (active: boolean) => void;
}

const MarketContext = createContext<MarketContextType | null>(null);

export const MarketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'markets' | 'watchlist' | 'screener' | 'ideas' | 'profile'>('markets');
  const [selectedRegion, setSelectedRegion] = useState<string>('US Stocks');
  const [sp500Timeframe, setSp500Timeframe] = useState<'1D' | '5D' | '1M' | '1Y'>('1D');
  const [moversTab, setMoversTab] = useState<'Most Active' | 'Gainers' | 'Losers' | 'Unusual Vol'>('Most Active');
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  
  const [sp500, setSp500] = useState<IndexData>(SP500_HERO);
  const [secondaryIndices, setSecondaryIndices] = useState<IndexData[]>(SECONDARY_INDICES);
  const [tickers, setTickers] = useState<Ticker[]>(ALL_TICKERS);
  const [ideas, setIdeas] = useState<TradingIdea[]>(COMMUNITY_IDEAS);
  const [alerts, setAlerts] = useState<MarketAlert[]>(INITIAL_ALERTS);

  // Modals & Sheets
  const [selectedTicker, setSelectedTicker] = useState<Ticker | null>(null);
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [tradeTargetTicker, setTradeTargetTicker] = useState<Ticker | null>(null);
  const [tradeSide, setTradeSide] = useState<'BUY' | 'SELL'>('BUY');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isHeatmapOpen, setIsHeatmapOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [liveSimulationActive, setLiveSimulationActive] = useState(true);

  // Watchlist
  const [watchlistSymbols, setWatchlistSymbols] = useState<string[]>(['NVDA', 'TSLA', 'AAPL', 'AMD', 'SPCX', 'MU']);

  // Paper Trading state
  const [paperCash, setPaperCash] = useState<number>(78450.50);
  const [rawPositions, setRawPositions] = useState<{ symbol: string; shares: number; avgPrice: number }[]>([
    { symbol: 'NVDA', shares: 50, avgPrice: 124.50 },
    { symbol: 'TSLA', shares: 25, avgPrice: 236.20 },
    { symbol: 'AMD', shares: 40, avgPrice: 154.00 },
  ]);
  const [orderHistory, setOrderHistory] = useState<PaperTradeOrder[]>([
    {
      id: 'ord-101',
      symbol: 'NVDA',
      type: 'BUY',
      orderType: 'MARKET',
      shares: 50,
      price: 124.50,
      total: 6225.00,
      timestamp: 'Today, 09:31 AM',
      status: 'FILLED',
    },
    {
      id: 'ord-102',
      symbol: 'TSLA',
      type: 'BUY',
      orderType: 'MARKET',
      shares: 25,
      price: 236.20,
      total: 5905.00,
      timestamp: 'Today, 10:14 AM',
      status: 'FILLED',
    },
  ]);

  // Toast feedback helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3000);
  };

  // Live countdown timer (3h 42m down to 0)
  const [secondsRemaining, setSecondsRemaining] = useState(3 * 3600 + 41 * 60 + 58);
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const countdownText = useMemo(() => {
    const hours = Math.floor(secondsRemaining / 3600);
    const minutes = Math.floor((secondsRemaining % 3600) / 60);
    const seconds = secondsRemaining % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  }, [secondsRemaining]);

  // Subtle real-time price tick simulation to give that authentic live trading feel
  useEffect(() => {
    if (!liveSimulationActive) return;

    const interval = setInterval(() => {
      // Pick 1-2 random tickers to update slightly
      setTickers(prevTickers => {
        const idx = Math.floor(Math.random() * prevTickers.length);
        const item = prevTickers[idx];
        const drift = (Math.random() - 0.48) * 0.25; // small micro jitter
        const newPrice = Math.max(1, +(item.price + drift).toFixed(2));
        const newChange = +(item.change + drift).toFixed(2);
        const newChangePercent = +((newChange / (item.prevClose || 1)) * 100).toFixed(2);
        
        const updated = [...prevTickers];
        updated[idx] = {
          ...item,
          price: newPrice,
          change: newChange,
          changePercent: newChangePercent,
          sparkline: [...item.sparkline.slice(1), newPrice],
        };
        return updated;
      });

      // Micro update S&P 500 occasionally
      if (Math.random() > 0.4) {
        setSp500(prev => {
          const drift = (Math.random() - 0.47) * 0.4;
          const newPrice = +(prev.price + drift).toFixed(2);
          const newChange = +(prev.change + drift).toFixed(2);
          const newChangePercent = +((newChange / 5704.22) * 100).toFixed(2);
          return {
            ...prev,
            price: newPrice,
            change: newChange,
            changePercent: newChangePercent,
          };
        });
      }
    }, 3200);

    return () => clearInterval(interval);
  }, [liveSimulationActive]);

  // Compute calculated portfolio positions based on live prices
  const positions: PortfolioPosition[] = useMemo(() => {
    return rawPositions.map(pos => {
      const liveTicker = tickers.find(t => t.symbol === pos.symbol);
      const currentPrice = liveTicker ? liveTicker.price : pos.avgPrice;
      const totalValue = pos.shares * currentPrice;
      const costBasis = pos.shares * pos.avgPrice;
      const unrealizedPnL = totalValue - costBasis;
      const unrealizedPnLPercent = costBasis > 0 ? (unrealizedPnL / costBasis) * 100 : 0;

      return {
        symbol: pos.symbol,
        name: liveTicker ? liveTicker.name : pos.symbol,
        shares: pos.shares,
        avgPrice: pos.avgPrice,
        currentPrice,
        totalValue,
        unrealizedPnL,
        unrealizedPnLPercent,
      };
    });
  }, [rawPositions, tickers]);

  // Watchlist toggle
  const toggleWatchlist = (symbol: string) => {
    setWatchlistSymbols(prev => {
      const exists = prev.includes(symbol);
      if (exists) {
        showToast(`Removed ${symbol} from watchlist`);
        return prev.filter(s => s !== symbol);
      } else {
        showToast(`Added ${symbol} to watchlist`);
        return [...prev, symbol];
      }
    });
  };

  const isWatchlisted = (symbol: string) => watchlistSymbols.includes(symbol);

  // Toggle Idea like
  const toggleLikeIdea = (id: string) => {
    setIdeas(prev =>
      prev.map(idea => {
        if (idea.id === id) {
          const isLiked = idea.userLiked;
          return {
            ...idea,
            likes: isLiked ? idea.likes - 1 : idea.likes + 1,
            userLiked: !isLiked,
          };
        }
        return idea;
      })
    );
  };

  // Open Stock Modal
  const openStockModal = (tickerOrSymbol: Ticker | string) => {
    if (typeof tickerOrSymbol === 'string') {
      const found = tickers.find(t => t.symbol === tickerOrSymbol);
      if (found) {
        setSelectedTicker(found);
      } else {
        // Fallback placeholder ticker
        setSelectedTicker({
          symbol: tickerOrSymbol,
          name: `${tickerOrSymbol} Asset`,
          exchange: 'US Exchanges',
          price: 100.00,
          change: 1.50,
          changePercent: 1.52,
          volume: '10.5M',
          avgVolume: '9.8M',
          marketCap: '$50.0B',
          peRatio: 25.0,
          high52: 120.0,
          low52: 80.0,
          open: 99.0,
          prevClose: 98.5,
          dayHigh: 101.0,
          dayLow: 98.8,
          beta: 1.0,
          eps: 4.0,
          dividendYield: 1.2,
          sector: 'Technology Services',
          categories: ['Large-cap'],
          sparkline: [98.5, 99.2, 99.8, 100.0],
          history: {
            '1D': [98.5, 99.2, 99.8, 100.0],
            '5D': [96.0, 97.5, 99.0, 100.0],
            '1M': [92.0, 95.0, 98.0, 100.0],
            '1Y': [80.0, 88.0, 94.0, 100.0],
          },
        });
      }
    } else {
      setSelectedTicker(tickerOrSymbol);
    }
  };

  // Open Trade Modal
  const openTradeModal = (ticker: Ticker, side: 'BUY' | 'SELL' = 'BUY') => {
    setTradeTargetTicker(ticker);
    setTradeSide(side);
    setIsTradeModalOpen(true);
  };

  const closeTradeModal = () => {
    setIsTradeModalOpen(false);
  };

  // Execute Simulated Paper Trade
  const executeTrade = (
    symbol: string,
    shares: number,
    side: 'BUY' | 'SELL',
    orderType: 'MARKET' | 'LIMIT'
  ) => {
    const liveTicker = tickers.find(t => t.symbol === symbol) || tradeTargetTicker;
    const price = liveTicker ? liveTicker.price : 100;
    const total = shares * price;

    if (side === 'BUY') {
      if (total > paperCash) {
        return { success: false, message: `Insufficient buying power! Requires $${total.toLocaleString(undefined, { minimumFractionDigits: 2 })} but only $${paperCash.toLocaleString(undefined, { minimumFractionDigits: 2 })} available.` };
      }

      setPaperCash(prev => prev - total);
      setRawPositions(prev => {
        const existing = prev.find(p => p.symbol === symbol);
        if (existing) {
          const totalShares = existing.shares + shares;
          const weightedCost = (existing.shares * existing.avgPrice + shares * price) / totalShares;
          return prev.map(p =>
            p.symbol === symbol
              ? { ...p, shares: totalShares, avgPrice: +weightedCost.toFixed(2) }
              : p
          );
        } else {
          return [...prev, { symbol, shares, avgPrice: price }];
        }
      });
    } else {
      // SELL
      const existing = rawPositions.find(p => p.symbol === symbol);
      if (!existing || existing.shares < shares) {
        return {
          success: false,
          message: `Cannot sell ${shares} shares. You currently own ${existing ? existing.shares : 0} shares of ${symbol}.`,
        };
      }

      setPaperCash(prev => prev + total);
      setRawPositions(prev => {
        return prev
          .map(p => {
            if (p.symbol === symbol) {
              const remaining = p.shares - shares;
              return remaining > 0 ? { ...p, shares: remaining } : null;
            }
            return p;
          })
          .filter(Boolean) as { symbol: string; shares: number; avgPrice: number }[];
      });
    }

    // Record order in history
    const newOrder: PaperTradeOrder = {
      id: `ord-${Date.now().toString().slice(-4)}`,
      symbol,
      type: side,
      orderType,
      shares,
      price,
      total,
      timestamp: 'Just now',
      status: 'FILLED',
    };
    setOrderHistory(prev => [newOrder, ...prev]);

    showToast(`Order filled: ${side} ${shares} shares of ${symbol} at $${price.toFixed(2)}`);
    return { success: true, message: `Filled ${side} ${shares} ${symbol}` };
  };

  const resetPaperAccount = () => {
    setPaperCash(100000.00);
    setRawPositions([]);
    setOrderHistory([]);
    showToast('Simulated account reset to $100,000 cash');
  };

  const markAllAlertsRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, unread: false })));
    showToast('All notifications marked as read');
  };

  return (
    <MarketContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedRegion,
        setSelectedRegion,
        countdownText,
        sp500,
        sp500Timeframe,
        setSp500Timeframe,
        secondaryIndices,
        sectors: SECTOR_PERFORMANCE,
        tickers,
        moversTab,
        setMoversTab,
        selectedCollection,
        setSelectedCollection,
        earnings: EARNINGS_CALENDAR,
        ideas,
        toggleLikeIdea,
        selectedTicker,
        setSelectedTicker,
        openStockModal,
        paperCash,
        positions,
        orderHistory,
        isTradeModalOpen,
        tradeTargetTicker,
        tradeSide,
        openTradeModal,
        closeTradeModal,
        executeTrade,
        resetPaperAccount,
        watchlistSymbols,
        toggleWatchlist,
        isWatchlisted,
        isSearchOpen,
        setIsSearchOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        isHeatmapOpen,
        setIsHeatmapOpen,
        alerts,
        markAllAlertsRead,
        toastMessage,
        showToast,
        liveSimulationActive,
        setLiveSimulationActive,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};

export const useMarket = () => {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error('useMarket must be used within a MarketProvider');
  }
  return context;
};
