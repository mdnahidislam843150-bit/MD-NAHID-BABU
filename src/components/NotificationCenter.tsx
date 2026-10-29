import React from 'react';
import { OrderNotification } from '../types';
import { Bell, CheckCheck, Trash2, Package, Clock, ExternalLink, Sparkles, X, ChevronRight } from 'lucide-react';

interface NotificationCenterProps {
  notifications: OrderNotification[];
  unreadCount: number;
  isOpen: boolean;
  onClose: () => void;
  onMarkAllAsRead: () => void;
  onClearNotifications: () => void;
  onViewOrder: (orderId: string) => void;
  onSendTestNotification: () => void;
  language: 'bn' | 'en';
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  unreadCount,
  isOpen,
  onClose,
  onMarkAllAsRead,
  onClearNotifications,
  onViewOrder,
  onSendTestNotification,
  language
}) => {
  if (!isOpen) return null;

  const isBn = language === 'bn';

  const formatPaymentMethod = (method: string) => {
    switch (method) {
      case 'cod': return isBn ? 'ক্যাশ অন ডেলিভারি' : 'Cash on Delivery';
      case 'bkash': return isBn ? 'বিকাশ (Send Money)' : 'bKash';
      case 'nagad': return isBn ? 'নগদ (Send Money)' : 'Nagad';
      case 'rocket': return 'রকেট';
      default: return method;
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const diffSeconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diffSeconds < 60) return isBn ? 'এইমাত্র' : 'Just now';
    if (diffSeconds < 3600) return isBn ? `${Math.floor(diffSeconds / 60)} মিনিট আগে` : `${Math.floor(diffSeconds / 60)}m ago`;
    if (diffSeconds < 86400) return isBn ? `${Math.floor(diffSeconds / 3600)} ঘণ্টা আগে` : `${Math.floor(diffSeconds / 3600)}h ago`;
    return new Date(dateStr).toLocaleDateString(isBn ? 'bn-BD' : 'en-US');
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex justify-end"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-blue-50 via-indigo-50 to-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative p-2 rounded-xl bg-blue-600 text-white shadow-xs">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <span>{isBn ? 'অর্ডার নোটিফিকেশন' : 'Order Notifications'}</span>
                {unreadCount > 0 && (
                  <span className="bg-rose-100 text-rose-700 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
                    {unreadCount} {isBn ? 'নতুন' : 'New'}
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-500">
                {isBn ? 'গ্রাহক নতুন অর্ডার দিলে সাথে সাথে এখানে আসবে' : 'Real-time alerts when customers place orders'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="flex items-center gap-1 text-blue-700 hover:text-blue-900 font-bold cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>{isBn ? 'সব পড়া হয়েছে' : 'Mark all read'}</span>
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={onClearNotifications}
                className="flex items-center gap-1 text-slate-500 hover:text-rose-600 font-medium ml-2 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isBn ? 'সব মুছুন' : 'Clear all'}</span>
              </button>
            )}
          </div>

          {/* Test notification button */}
          <button
            onClick={onSendTestNotification}
            className="flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-bold bg-emerald-50 px-2 py-1 rounded border border-emerald-200 transition cursor-pointer"
            title="নোটিফিকেশন অ্যালার্ট ও সাউন্ড টেস্ট করুন"
          >
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>{isBn ? 'টেস্ট অ্যালার্ট পাঠান' : 'Test Alert'}</span>
          </button>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mb-3">
                <Bell className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">
                {isBn ? 'এখনও কোনো নোটিফিকেশন নেই' : 'No Notifications Yet'}
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mt-1">
                {isBn 
                  ? 'কোনো কাস্টমার অর্ডার কনফার্ম করলে তাৎক্ষণিক সাউন্ড ও পপআপসহ নোটিফিকেশন আসবে।' 
                  : 'You will receive instant alerts here whenever an order is submitted.'}
              </p>
              <button
                onClick={onSendTestNotification}
                className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{isBn ? 'টেস্ট অর্ডার নোটিফিকেশন দেখুন' : 'Trigger Test Notification'}</span>
              </button>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  notif.isRead 
                    ? 'bg-white border-slate-200' 
                    : 'bg-blue-50/50 border-blue-200 ring-1 ring-blue-400/20'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-orange-100 text-orange-700">
                      <Package className="w-4 h-4" />
                    </span>
                    <div>
                      <span className="font-mono text-xs font-bold text-blue-700">
                        #{notif.orderId}
                      </span>
                      {!notif.isRead && (
                        <span className="ml-1.5 inline-block w-2 h-2 rounded-full bg-blue-600"></span>
                      )}
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    {formatTimeAgo(notif.createdAt)}
                  </span>
                </div>

                <div className="mt-2 text-xs">
                  <p className="font-extrabold text-slate-900 text-sm">
                    {notif.customerName}
                  </p>
                  <p className="text-[11px] text-slate-600 font-mono mt-0.5">
                    📞 {notif.phone}
                  </p>
                </div>

                <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500">{isBn ? 'মোট মূল্য:' : 'Total:'} </span>
                    <span className="font-black text-sm text-emerald-700">৳{notif.total.toLocaleString()}</span>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {formatPaymentMethod(notif.paymentMethod)}
                  </span>
                </div>

                <button
                  onClick={() => onViewOrder(notif.orderId)}
                  className="mt-2.5 w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>{isBn ? 'অর্ডারের বিবরণ দেখুন' : 'View Order Details'}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-amber-300" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500">
          SmartShop BD • {isBn ? 'লাইভ অর্ডার মনিটরিং সিস্টেম' : 'Live Order Monitoring'}
        </div>
      </div>
    </div>
  );
};
