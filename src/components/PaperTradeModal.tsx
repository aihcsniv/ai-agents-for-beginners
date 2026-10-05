import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext.tsx';
import { Ticker } from '../types/market.ts';

interface PaperTradeModalProps {
  ticker: Ticker;
  initialSide?: 'BUY' | 'SELL';
  onClose: () => void;
}

export const PaperTradeModal: React.FC<PaperTradeModalProps> = ({
  ticker,
  initialSide = 'BUY',
  onClose,
}) => {
  const {
    paperCash,
    positions,
    executeTrade,
  } = useMarket();

  const [side, setSide] = useState<'BUY' | 'SELL'>(initialSide);
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');
  const [shares, setShares] = useState<number>(10);
  const [limitPrice, setLimitPrice] = useState<number>(ticker.price);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const currentPosition = positions.find(p => p.symbol === ticker.symbol);
  const ownedShares = currentPosition ? currentPosition.shares : 0;

  const effectivePrice = orderType === 'MARKET' ? ticker.price : limitPrice;
  const estimatedTotal = shares * effectivePrice;

  // Quick percent helpers
  const handlePercent = (pct: number) => {
    if (side === 'BUY') {
      const maxShares = Math.floor(paperCash / effectivePrice);
      setShares(Math.max(1, Math.floor(maxShares * pct)));
    } else {
      setShares(Math.max(1, Math.floor(ownedShares * pct)));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (shares <= 0) {
      setErrorMsg('Please specify at least 1 share');
      return;
    }

    const res = executeTrade(ticker.symbol, shares, side, orderType);
    if (res.success) {
      onClose();
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md rounded-2xl bg-[#131722] border border-white/10 shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.08] bg-[#10131a]">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-[20px] text-[#2962ff]">swap_horizontal_circle</span>
            <span className="text-base font-bold text-white">Paper Trading Order</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#64748B] hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Ticker & Current Price Header */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#191b23] border border-white/[0.04]">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#2962ff]/20 text-[#b6c4ff] flex items-center justify-center font-bold text-xs">
                {ticker.symbol.slice(0, 2)}
              </div>
              <div>
                <span className="text-sm font-bold text-white block">{ticker.symbol}</span>
                <span className="text-xs text-[#64748B]">{ticker.name}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-white block tabular-nums">
                ${ticker.price.toFixed(2)}
              </span>
              <span className="text-[11px] text-[#64748B]">Real-time quote</span>
            </div>
          </div>

          {/* Side Toggle: BUY vs SELL */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#0b0e15] border border-white/[0.04]">
            <button
              type="button"
              onClick={() => setSide('BUY')}
              className={`py-2 text-center rounded-lg text-xs font-bold transition-all ${
                side === 'BUY'
                  ? 'bg-[#10B981] text-white shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              BUY
            </button>
            <button
              type="button"
              onClick={() => setSide('SELL')}
              className={`py-2 text-center rounded-lg text-xs font-bold transition-all ${
                side === 'SELL'
                  ? 'bg-[#F43F5E] text-white shadow-[0_0_12px_rgba(244,63,94,0.35)]'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              SELL
            </button>
          </div>

          {/* Order Type Selector */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#94A3B8]">Order Type</span>
            <div className="flex space-x-1 bg-[#191b23] p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setOrderType('MARKET')}
                className={`px-3 py-1 rounded text-xs font-semibold ${
                  orderType === 'MARKET' ? 'bg-[#272a32] text-white' : 'text-[#64748B]'
                }`}
              >
                Market
              </button>
              <button
                type="button"
                onClick={() => setOrderType('LIMIT')}
                className={`px-3 py-1 rounded text-xs font-semibold ${
                  orderType === 'LIMIT' ? 'bg-[#272a32] text-white' : 'text-[#64748B]'
                }`}
              >
                Limit
              </button>
            </div>
          </div>

          {/* Limit Price Input if LIMIT */}
          {orderType === 'LIMIT' && (
            <div className="space-y-1">
              <label className="text-xs text-[#94A3B8] block">Limit Price (USD)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={limitPrice}
                onChange={e => setLimitPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg bg-[#191b23] border border-white/10 text-white text-sm font-semibold focus:outline-none focus:border-[#2962ff]"
              />
            </div>
          )}

          {/* Shares Input with Stepper */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#94A3B8]">Quantity (Shares)</span>
              <span className="text-[#64748B]">
                {side === 'BUY'
                  ? `Max afford: ${Math.floor(paperCash / effectivePrice)}`
                  : `You own: ${ownedShares}`}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setShares(s => Math.max(1, s - 5))}
                className="w-10 h-10 rounded-lg bg-[#191b23] hover:bg-[#272a32] text-white text-lg font-bold border border-white/10 transition-colors flex items-center justify-center active:scale-95"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={shares}
                onChange={e => setShares(parseInt(e.target.value) || 1)}
                className="flex-1 h-10 px-3 text-center rounded-lg bg-[#191b23] border border-white/10 text-white text-base font-bold tabular-nums focus:outline-none focus:border-[#2962ff]"
              />
              <button
                type="button"
                onClick={() => setShares(s => s + 5)}
                className="w-10 h-10 rounded-lg bg-[#191b23] hover:bg-[#272a32] text-white text-lg font-bold border border-white/10 transition-colors flex items-center justify-center active:scale-95"
              >
                +
              </button>
            </div>

            {/* Quick Allocation Pills */}
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {[0.25, 0.5, 0.75, 1.0].map(pct => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => handlePercent(pct)}
                  className="py-1 rounded bg-[#191b23] hover:bg-[#272a32] text-[11px] font-semibold text-[#94A3B8] hover:text-white border border-white/[0.04] transition-colors"
                >
                  {pct * 100}%
                </button>
              ))}
            </div>
          </div>

          {/* Cost Summary Breakdown */}
          <div className="p-3 rounded-xl bg-[#0b0e15] border border-white/[0.04] space-y-1.5 text-xs">
            <div className="flex justify-between text-[#94A3B8]">
              <span>Estimated Value</span>
              <span className="font-semibold text-white tabular-nums">
                ${estimatedTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-[#94A3B8]">
              <span>Commission</span>
              <span className="text-[#10B981] font-semibold">$0.00 Free</span>
            </div>
            <div className="flex justify-between text-[#94A3B8] pt-1 border-t border-white/[0.04]">
              <span>Available Cash</span>
              <span className="font-semibold text-white tabular-nums">
                ${paperCash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-[#F43F5E] flex items-center space-x-1.5 animate-in fade-in">
              <span className="material-symbols-outlined text-[16px]">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-3.5 rounded-xl font-bold text-sm text-white shadow-lg active:scale-98 transition-all flex items-center justify-center space-x-2 ${
              side === 'BUY'
                ? 'bg-[#10B981] hover:bg-[#059669] shadow-[0_0_16px_rgba(16,185,129,0.35)]'
                : 'bg-[#F43F5E] hover:bg-[#e11d48] shadow-[0_0_16px_rgba(244,63,94,0.35)]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {side === 'BUY' ? 'shopping_bag' : 'sell'}
            </span>
            <span>
              {side} {shares} {ticker.symbol} (
              ${estimatedTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};
