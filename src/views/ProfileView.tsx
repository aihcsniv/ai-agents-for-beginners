import React from 'react';
import { useMarket } from '../context/MarketContext.tsx';

export const ProfileView: React.FC = () => {
  const {
    paperCash,
    positions,
    orderHistory,
    openTradeModal,
    tickers,
    resetPaperAccount,
    liveSimulationActive,
    setLiveSimulationActive,
  } = useMarket();

  const totalPositionsValue = positions.reduce((acc, p) => acc + p.totalValue, 0);
  const netWorth = paperCash + totalPositionsValue;
  const totalCostBasis = positions.reduce((acc, p) => acc + p.shares * p.avgPrice, 0);
  const totalUnrealizedPnL = totalPositionsValue - totalCostBasis;
  const totalReturnPercent = totalCostBasis > 0 ? (totalUnrealizedPnL / totalCostBasis) * 100 : 0;
  const isPositivePnL = totalUnrealizedPnL >= 0;

  const handleClosePosition = (symbol: string, shares: number) => {
    const liveTicker = tickers.find(t => t.symbol === symbol);
    if (liveTicker) {
      openTradeModal(liveTicker, 'SELL');
    }
  };

  return (
    <div className="flex flex-col w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto px-4 space-y-4 pb-24 pt-2">
      {/* Account Overview Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#2962ff] to-[#60a5fa] flex items-center justify-center text-white shadow-[0_0_16px_rgba(41,98,255,0.4)]">
            <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Paper Trading Portfolio</h2>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-xs text-[#94A3B8]">Simulated Margin Account · Tier 3</span>
            </div>
          </div>
        </div>

        <button
          onClick={resetPaperAccount}
          className="px-3 py-1.5 rounded-lg bg-[#191b23] hover:bg-[#272a32] text-xs font-semibold text-[#94A3B8] hover:text-white border border-white/10 transition-colors"
          title="Reset account to $100,000 cash"
        >
          Reset $100K
        </button>
      </div>

      {/* Main Net Worth Card */}
      <div className="p-4 rounded-xl bg-gradient-to-b from-[#131722] to-[#10131a] border border-white/[0.08] shadow-lg space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs text-[#64748B] uppercase font-bold tracking-wider">
              Total Account Net Worth
            </span>
            <div className="text-3xl font-extrabold text-white tracking-tight tabular-nums mt-0.5">
              ${netWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          <div
            className={`px-2.5 py-1 rounded-full text-xs font-bold tabular-nums flex items-center space-x-1 ${
              isPositivePnL
                ? 'bg-emerald-500/15 text-[#10B981]'
                : 'bg-rose-500/15 text-[#F43F5E]'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">
              {isPositivePnL ? 'trending_up' : 'trending_down'}
            </span>
            <span>
              {isPositivePnL ? `+$${totalUnrealizedPnL.toFixed(2)}` : `-$${Math.abs(totalUnrealizedPnL).toFixed(2)}`} (
              {isPositivePnL ? `+${totalReturnPercent.toFixed(2)}%` : `${totalReturnPercent.toFixed(2)}%`})
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.04] text-xs">
          <div className="p-2.5 rounded-lg bg-[#191b23]">
            <span className="text-[11px] text-[#64748B] block">Cash Buying Power</span>
            <span className="text-sm font-bold text-white tabular-nums">
              ${paperCash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#191b23]">
            <span className="text-[11px] text-[#64748B] block">Invested Equity</span>
            <span className="text-sm font-bold text-white tabular-nums">
              ${totalPositionsValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Open Positions */}
      <div className="rounded-xl bg-[#131722] border border-white/[0.08] p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-white">Open Positions</h3>
          <span className="text-xs text-[#64748B]">{positions.length} Active Holdings</span>
        </div>

        {positions.length === 0 ? (
          <div className="py-8 text-center text-[#64748B] text-xs">
            No active positions. Execute a simulated trade on Markets or Watchlist to build your portfolio!
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {positions.map(pos => {
              const isProfit = pos.unrealizedPnL >= 0;
              return (
                <div key={pos.symbol} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-sm font-bold text-white">{pos.symbol}</span>
                      <span className="text-[10px] text-[#94A3B8] px-1 rounded bg-[#191b23]">
                        {pos.shares} shs @ ${pos.avgPrice.toFixed(2)}
                      </span>
                    </div>
                    <span className="text-xs text-[#64748B] block truncate max-w-[180px]">
                      {pos.name}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <span className="text-xs font-bold text-white tabular-nums block">
                        ${pos.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <span
                        className={`text-[11px] font-semibold tabular-nums ${
                          isProfit ? 'text-[#10B981]' : 'text-[#F43F5E]'
                        }`}
                      >
                        {isProfit ? `+$${pos.unrealizedPnL.toFixed(2)}` : `-$${Math.abs(pos.unrealizedPnL).toFixed(2)}`} (
                        {isProfit ? `+${pos.unrealizedPnLPercent.toFixed(1)}%` : `${pos.unrealizedPnLPercent.toFixed(1)}%`})
                      </span>
                    </div>

                    <button
                      onClick={() => handleClosePosition(pos.symbol, pos.shares)}
                      className="px-2.5 py-1 rounded bg-[#F43F5E]/15 hover:bg-[#F43F5E] text-[#F43F5E] hover:text-white text-xs font-semibold transition-all"
                    >
                      Close
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Execution Order History */}
      <div className="rounded-xl bg-[#131722] border border-white/[0.08] p-4 shadow-sm space-y-3">
        <h3 className="text-base font-semibold text-white">Filled Order History</h3>

        {orderHistory.length === 0 ? (
          <div className="py-6 text-center text-[#64748B] text-xs">No orders recorded yet.</div>
        ) : (
          <div className="space-y-2">
            {orderHistory.slice(0, 5).map(ord => (
              <div
                key={ord.id}
                className="p-2.5 rounded-lg bg-[#191b23] border border-white/[0.04] flex items-center justify-between text-xs"
              >
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      ord.type === 'BUY'
                        ? 'bg-emerald-500/20 text-[#10B981]'
                        : 'bg-rose-500/20 text-[#F43F5E]'
                    }`}
                  >
                    {ord.type}
                  </span>
                  <div>
                    <span className="font-bold text-white block">
                      {ord.shares} {ord.symbol} @ ${ord.price.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-[#64748B]">{ord.timestamp}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-white tabular-nums block">
                    ${ord.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className="text-[10px] text-[#10B981] font-semibold">{ord.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Terminal Settings & Live Simulation Control */}
      <div className="rounded-xl bg-[#131722] border border-white/[0.08] p-4 shadow-sm space-y-3">
        <h3 className="text-base font-semibold text-white">Terminal Diagnostics</h3>

        <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#191b23] text-xs">
          <div>
            <span className="font-semibold text-white block">Live Market Simulation</span>
            <span className="text-[11px] text-[#64748B]">Simulate live price tick jitter</span>
          </div>
          <button
            onClick={() => setLiveSimulationActive(!liveSimulationActive)}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              liveSimulationActive ? 'bg-[#2962ff]' : 'bg-[#272a32]'
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                liveSimulationActive ? 'left-7' : 'left-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#191b23] text-xs text-[#94A3B8]">
          <span>Data Provider</span>
          <span className="text-white font-semibold">CBOE Real-time BZX</span>
        </div>
      </div>
    </div>
  );
};
