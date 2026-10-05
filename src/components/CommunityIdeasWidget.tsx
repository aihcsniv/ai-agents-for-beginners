import React from 'react';
import { useMarket } from '../context/MarketContext.tsx';

export const CommunityIdeasWidget: React.FC = () => {
  const { ideas, toggleLikeIdea, openStockModal, setActiveTab, showToast } = useMarket();

  return (
    <div id="ideas-section" className="rounded-xl bg-[#131722] border border-white/[0.08] p-4 shadow-sm space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-white">Community Ideas</h3>
          <span className="text-xs text-[#64748B]">Top trading setups &amp; breakdowns</span>
        </div>
        <button
          onClick={() => setActiveTab('ideas')}
          className="text-xs text-[#b6c4ff] hover:underline font-medium"
        >
          Explore
        </button>
      </div>

      {/* Idea Cards */}
      <div className="space-y-4">
        {ideas.slice(0, 2).map(idea => (
          <div
            key={idea.id}
            className="p-3 rounded-lg bg-[#191b23] border border-white/[0.04] space-y-2.5 transition-all hover:border-white/[0.10]"
          >
            {/* Author & Direction */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-6 h-6 rounded-full ${idea.author.avatarBg} flex items-center justify-center text-white font-bold text-[10px] shadow-sm`}
                >
                  {idea.author.initials}
                </div>
                <span className="text-xs font-semibold text-white">
                  {idea.author.name}
                </span>
                {idea.author.verified && (
                  <span
                    className="material-symbols-outlined text-[14px] text-[#3B82F6] fill-1"
                    title="Verified Analyst"
                  >
                    verified
                  </span>
                )}
              </div>

              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                  idea.direction === 'Long'
                    ? 'bg-emerald-500/15 text-[#10B981]'
                    : 'bg-rose-500/15 text-[#F43F5E]'
                }`}
              >
                {idea.direction}
              </span>
            </div>

            {/* Post Title & Description */}
            <div
              onClick={() => openStockModal(idea.symbol)}
              className="cursor-pointer group"
            >
              <h4 className="text-[13px] font-semibold text-white group-hover:text-primary transition-colors leading-snug">
                {idea.title}
              </h4>
              <p className="text-xs text-[#94A3B8] line-clamp-2 mt-1 leading-relaxed">
                {idea.description}
              </p>
            </div>

            {/* Chart Snapshot */}
            <div
              onClick={() => openStockModal(idea.symbol)}
              className="w-full h-36 rounded-lg bg-[#32353d] overflow-hidden relative cursor-pointer group"
            >
              <img
                src={idea.chartImage}
                alt={idea.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-[#10131a]/85 border border-white/10 backdrop-blur text-[11px] font-medium text-white">
                {idea.exchange}:{idea.symbol} · {idea.timeframe}
              </div>
            </div>

            {/* Likes, Comments & Timestamp */}
            <div className="flex items-center justify-between pt-1 text-xs text-[#64748B]">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => toggleLikeIdea(idea.id)}
                  className={`flex items-center space-x-1 transition-colors active:scale-90 ${
                    idea.userLiked ? 'text-[#3B82F6]' : 'hover:text-white'
                  }`}
                  aria-label="Like analysis"
                >
                  <span
                    className={`material-symbols-outlined text-[16px] ${
                      idea.userLiked ? 'fill-1' : ''
                    }`}
                  >
                    thumb_up
                  </span>
                  <span className="tabular-nums">{idea.likes}</span>
                </button>

                <button
                  onClick={() => showToast(`Opening discussion thread (${idea.comments} comments)`)}
                  className="flex items-center space-x-1 hover:text-white transition-colors"
                  aria-label="View comments"
                >
                  <span className="material-symbols-outlined text-[16px]">chat_bubble</span>
                  <span className="tabular-nums">{idea.comments}</span>
                </button>
              </div>

              <span className="text-[11px] font-medium">{idea.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
