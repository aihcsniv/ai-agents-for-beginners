export interface SparklinePoint {
  time: string;
  value: number;
}

export interface Ticker {
  symbol: string;
  name: string;
  exchange: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  avgVolume: string;
  marketCap: string;
  peRatio: number;
  high52: number;
  low52: number;
  open: number;
  prevClose: number;
  dayHigh: number;
  dayLow: number;
  beta: number;
  eps: number;
  dividendYield: number;
  sector: string;
  categories: string[];
  history: {
    '1D': number[];
    '5D': number[];
    '1M': number[];
    '1Y': number[];
  };
  sparkline: number[];
  bids?: { price: number; size: number }[];
  asks?: { price: number; size: number }[];
  description?: string;
}

export interface IndexData {
  symbol: string;
  ticker: string;
  name: string;
  exchange: string;
  price: number;
  change: number;
  changePercent: number;
  badge: string;
  badgeBg: string;
  history: {
    '1D': number[];
    '5D': number[];
    '1M': number[];
    '1Y': number[];
  };
}

export interface SectorData {
  name: string;
  changePercent: number;
  strengthScore: number;
  leadingStock: string;
  isBullish: boolean;
}

export interface EarningsEvent {
  date: string;
  session: 'Before open' | 'After close' | 'Pre-market';
  symbol: string;
  company: string;
  epsEstimate: string;
  consensusScore: string;
}

export interface TradingIdea {
  id: string;
  author: {
    name: string;
    handle: string;
    avatarBg: string;
    initials: string;
    verified: boolean;
  };
  title: string;
  description: string;
  symbol: string;
  exchange: string;
  timeframe: string;
  direction: 'Long' | 'Short';
  chartImage: string;
  likes: number;
  userLiked?: boolean;
  comments: number;
  timestamp: string;
}

export interface PaperTradeOrder {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  orderType: 'MARKET' | 'LIMIT';
  shares: number;
  price: number;
  total: number;
  timestamp: string;
  status: 'FILLED' | 'PENDING';
}

export interface PortfolioPosition {
  symbol: string;
  name: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  totalValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
}

export interface MarketAlert {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  type: 'breaking' | 'technical' | 'macro';
}
