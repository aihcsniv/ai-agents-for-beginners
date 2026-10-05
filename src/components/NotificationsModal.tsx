import React from 'react';
import { useMarket } from '../context/MarketContext.tsx';

export const NotificationsModal: React.FC = () => {
  const { isNotificationsOpen, setIsNotificationsOpen, alerts, markAllAlertsRead } = useMarket();

  if (!isNotificationsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 pt-16 sm:pt-20 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg rounded-2xl bg-[#131722] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.08] bg-[#10131a]">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-[20px] text-[#2962ff]">notifications_active</span>
            <span className="text-base font-bold text-white">Market Telemetry Alerts</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={markAllAlertsRead}
              className="text-xs text-[#b6c4ff] hover:underline font-semibold"
            >
              Mark Read
            </button>
            <button
              onClick={() => setIsNotificationsOpen(false)}
              className="p-1 rounded-lg text-[#64748B] hover:text-white"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Alerts List */}
        <div className="overflow-y-auto p-3 space-y-2 flex-1">
          {alerts.map(alert => (
            <div
              key={alert.id}
              className={`p-3 rounded-xl border transition-all ${
                alert.unread
                  ? 'bg-[#191b23] border-[#2962ff]/40 shadow-sm'
                  : 'bg-[#10131a]/60 border-white/[0.04]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      alert.unread ? 'bg-[#2962ff]' : 'bg-[#64748B]'
                    }`}
                  />
                  <h4 className="text-xs font-bold text-white leading-snug">
                    {alert.title}
                  </h4>
                </div>
                <span className="text-[10px] text-[#64748B] shrink-0 font-medium">
                  {alert.time}
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] mt-1.5 pl-4 leading-relaxed">
                {alert.description}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-[#10131a] border-t border-white/[0.06] text-center text-xs text-[#64748B]">
          Alerts streamed real-time via Terminal CBOE Feed
        </div>
      </div>
    </div>
  );
};
