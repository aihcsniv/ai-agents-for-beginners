import React from 'react';
import { useMarket } from '../context/MarketContext.tsx';

export const IndicesGrid: React.FC = () => {
  const { secondaryIndices, openStockModal } = useMarket();

  return (
    <div id="indices-section" className="grid grid-cols-2 gap-3">
      {secondaryIndices.map(idx => (
        <div
          key={idx.symbol}
          onClick={() => openStockModal(idx.symbol)}
          className="p-3.5 rounded-xl bg-[#131722] border border-white/[0.08] hover:border-white/[0.14] flex flex-col justify-between shadow-sm cursor-pointer transition-all hover:translate-y-[-1px] group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-white group-hover:text-primary transition-colors">
              {idx.ticker}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-[#272a32] text-[#c3c5d8] text-[11px] font-medium">
              {idx.symbol}
            </span>
          </div>

          <div className="my-2">
            <span className="text-[15px] font-bold text-white tracking-tight tabular-nums">
              {idx.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-0.5 text-[#10B981] text-[12px] font-semibold">
              <span className="material-symbols-outlined text-[13px]">north_east</span>
              <span>+{idx.changePercent.toFixed(2)}%</span>
            </div>

            <svg className="w-14 h-6 shrink-0" fill="none" viewBox="0 0 56 24">
              <path
                d={
                  idx.symbol === 'NDX'
                    ? 'M1,20 Q15,16 28,11 T55,3'
                    : 'M1,18 Q16,21 30,12 T55,5'
                }
                fill="none"
                stroke="#10B981"
                strokeLinecap="round"
                strokeWidth="1.75"
              />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
};
