import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext.tsx';
import { TradingIdea } from '../types/market.ts';

export const IdeasView: React.FC = () => {
  const { ideas, toggleLikeIdea, openStockModal, showToast } = useMarket();
  const [filterDirection, setFilterDirection] = useState<'All' | 'Long' | 'Short'>('All');
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  // New idea form state
  const [newSymbol, setNewSymbol] = useState('NVDA');
  const [newDirection, setNewDirection] = useState<'Long' | 'Short'>('Long');
  const [newTimeframe, setNewTimeframe] = useState('4H');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const filteredIdeas = ideas.filter(idea => {
    if (filterDirection === 'All') return true;
    return idea.direction === filterDirection;
  });

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) {
      showToast('Please enter both title and description');
      return;
    }

    const newIdea: TradingIdea = {
      id: `idea-${Date.now()}`,
      author: {
        name: 'You (Trader)',
        handle: '@apex_trader',
        avatarBg: 'bg-[#2962ff]',
        initials: 'ME',
        verified: true,
      },
      title: newTitle,
      description: newDescription,
      symbol: newSymbol.toUpperCase(),
      exchange: 'NASDAQ',
      timeframe: newTimeframe,
      direction: newDirection,
      chartImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPbhmAj9kLQc0xCNk4pc_JgB_peA7BvNv5xRMRMQf6T4r3j1P-eqEFvfpQEVTUvccNPzJgioW8vpWYgBduRPBKZuLlvSJU6pkD6OT3iXLjmq8J8jcBEySBZz4T4rCT3JaDm05_qyBJ1nQl9kD1xq4aeRBzHLnzcPkaB8feFpUKywuCMiQisO3DI1nsNTo9kXk_Kj_RdoUm_qZrTvKO_FF1HLv2XzeRR7pngqCKqAMWsqFuU0Zb0Ftgig',
      likes: 1,
      userLiked: true,
      comments: 0,
      timestamp: 'Just now',
    };

    ideas.unshift(newIdea);
    setIsPublishModalOpen(false);
    setNewTitle('');
    setNewDescription('');
    showToast('Your technical idea was published to the community feed!');
  };

  return (
    <div className="flex flex-col w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto px-4 space-y-4 pb-24 pt-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Community Ideas</h2>
          <span className="text-xs text-[#64748B]">
            Real-time technical analysis &amp; market setups
          </span>
        </div>

        <button
          onClick={() => setIsPublishModalOpen(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#2962ff] text-white text-xs font-semibold shadow-md active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[16px]">edit</span>
          <span>Publish Setup</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-[#131722] p-1 rounded-lg border border-white/[0.06] text-xs">
        {(['All', 'Long', 'Short'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilterDirection(tab)}
            className={`flex-1 py-1.5 rounded-md font-semibold transition-all ${
              filterDirection === tab
                ? 'bg-[#272a32] text-white shadow-sm'
                : 'text-[#64748B] hover:text-white'
            }`}
          >
            {tab === 'All' ? 'All Ideas' : tab === 'Long' ? 'Bullish (Long)' : 'Bearish (Short)'}
          </button>
        ))}
      </div>

      {/* Ideas Feed */}
      <div className="space-y-4">
        {filteredIdeas.map(idea => (
          <div
            key={idea.id}
            className="p-4 rounded-xl bg-[#131722] border border-white/[0.08] hover:border-white/[0.14] space-y-3 transition-all shadow-sm"
          >
            {/* Author Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div
                  className={`w-7 h-7 rounded-full ${idea.author.avatarBg} flex items-center justify-center text-white font-bold text-xs shadow-sm`}
                >
                  {idea.author.initials}
                </div>
                <div>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs font-bold text-white">{idea.author.name}</span>
                    {idea.author.verified && (
                      <span className="material-symbols-outlined text-[14px] text-[#3B82F6] fill-1">
                        verified
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#64748B]">{idea.author.handle}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-[#94A3B8] px-2 py-0.5 rounded bg-[#191b23]">
                  {idea.timeframe}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    idea.direction === 'Long'
                      ? 'bg-emerald-500/15 text-[#10B981]'
                      : 'bg-rose-500/15 text-[#F43F5E]'
                  }`}
                >
                  {idea.direction}
                </span>
              </div>
            </div>

            {/* Title & Body */}
            <div
              onClick={() => openStockModal(idea.symbol)}
              className="cursor-pointer group"
            >
              <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors leading-snug">
                {idea.title}
              </h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed mt-1">
                {idea.description}
              </p>
            </div>

            {/* High-fidelity Technical Chart snapshot */}
            <div
              onClick={() => openStockModal(idea.symbol)}
              className="w-full h-44 sm:h-52 rounded-xl bg-[#191b23] overflow-hidden relative cursor-pointer group"
            >
              <img
                src={idea.chartImage}
                alt={idea.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute bottom-2.5 left-2.5 px-2 py-1 rounded bg-[#10131a]/85 border border-white/10 backdrop-blur text-xs font-semibold text-white">
                {idea.exchange}:{idea.symbol} · {idea.timeframe}
              </div>
            </div>

            {/* Interactive Footer */}
            <div className="flex items-center justify-between pt-1 border-t border-white/[0.04] text-xs text-[#64748B]">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => toggleLikeIdea(idea.id)}
                  className={`flex items-center space-x-1.5 transition-colors active:scale-90 ${
                    idea.userLiked ? 'text-[#3B82F6]' : 'hover:text-white'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[17px] ${
                      idea.userLiked ? 'fill-1' : ''
                    }`}
                  >
                    thumb_up
                  </span>
                  <span className="tabular-nums font-semibold">{idea.likes}</span>
                </button>

                <button
                  onClick={() => showToast(`Comment thread for "${idea.title}"`)}
                  className="flex items-center space-x-1.5 hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-[17px]">chat_bubble</span>
                  <span className="tabular-nums font-semibold">{idea.comments}</span>
                </button>
              </div>

              <span className="text-[11px]">{idea.timestamp}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Publish Setup Modal */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div 
            className="w-full max-w-lg rounded-2xl bg-[#131722] border border-white/10 shadow-2xl p-5 space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-base font-bold text-white">Publish Technical Idea</h3>
              <button
                onClick={() => setIsPublishModalOpen(false)}
                className="text-[#64748B] hover:text-white"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handlePublish} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[#94A3B8] block mb-1">Symbol</label>
                  <input
                    type="text"
                    value={newSymbol}
                    onChange={e => setNewSymbol(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 rounded-lg bg-[#191b23] border border-white/10 text-white font-bold uppercase focus:outline-none focus:border-[#2962ff]"
                    placeholder="NVDA"
                  />
                </div>
                <div>
                  <label className="text-[#94A3B8] block mb-1">Direction</label>
                  <select
                    value={newDirection}
                    onChange={e => setNewDirection(e.target.value as 'Long' | 'Short')}
                    className="w-full px-2.5 py-2 rounded-lg bg-[#191b23] border border-white/10 text-white font-bold focus:outline-none focus:border-[#2962ff]"
                  >
                    <option value="Long">Bullish (Long)</option>
                    <option value="Short">Bearish (Short)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#94A3B8] block mb-1">Timeframe</label>
                  <select
                    value={newTimeframe}
                    onChange={e => setNewTimeframe(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg bg-[#191b23] border border-white/10 text-white font-bold focus:outline-none focus:border-[#2962ff]"
                  >
                    <option value="15M">15M</option>
                    <option value="1H">1H</option>
                    <option value="4H">4H</option>
                    <option value="1D">1D</option>
                    <option value="1W">1W</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">Analysis Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Fair value gap retest prior to ATH expansion..."
                  className="w-full px-3 py-2 rounded-lg bg-[#191b23] border border-white/10 text-white focus:outline-none focus:border-[#2962ff]"
                />
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">Setup Details &amp; Risk Parameters</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  placeholder="Describe price structure, liquidity pools, entry zone, target, and stop loss..."
                  className="w-full px-3 py-2 rounded-lg bg-[#191b23] border border-white/10 text-white focus:outline-none focus:border-[#2962ff] resize-none"
                />
              </div>

              <div className="pt-2 flex space-x-2">
                <button
                  type="button"
                  onClick={() => setIsPublishModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#191b23] hover:bg-[#272a32] text-[#94A3B8] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#2962ff] hover:bg-[#1e4bd8] text-white font-bold shadow-md"
                >
                  Share to Community
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
