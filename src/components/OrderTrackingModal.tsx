import React, { useState, useEffect } from 'react';
import { Order } from '../types';
import { safeLocalStorageGet } from '../utils/storage';
import { 
  PackageCheck, 
  Search, 
  X, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Check, 
  XCircle, 
  Phone, 
  MapPin, 
  CreditCard, 
  Calendar,
  AlertCircle,
  Sparkles,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  language: 'bn' | 'en';
  currency: 'BDT' | 'USD';
  initialOrderId?: string;
  onOpenAdmin?: () => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  orders,
  language,
  currency,
  initialOrderId,
  onOpenAdmin
}) => {
  const isBn = language === 'bn';
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [matchedOrders, setMatchedOrders] = useState<Order[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);

  useEffect(() => {
    const savedLast = safeLocalStorageGet('amarshop_last_order_id');
    if (savedLast) {
      setLastOrderId(savedLast);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (initialOrderId) {
        setSearchQuery(initialOrderId);
        handleSearch(initialOrderId);
      } else {
        const savedLast = safeLocalStorageGet('amarshop_last_order_id');
        if (savedLast) {
          setSearchQuery(savedLast);
          handleSearch(savedLast);
        } else if (orders.length > 0) {
          // Preload latest order as preview
          setSearchedOrder(orders[0]);
          setMatchedOrders([orders[0]]);
          setSearchQuery(orders[0].id);
        }
      }
    }
  }, [isOpen, initialOrderId, orders]);

  if (!isOpen) return null;

  const handleSearch = (queryToUse?: string) => {
    const q = (queryToUse !== undefined ? queryToUse : searchQuery).trim();
    if (!q) return;

    setHasSearched(true);
    const cleaned = q.toLowerCase();

    // Search by exact Order ID or partial Order ID or phone number
    const found = orders.filter((o) => {
      const matchId = o.id.toLowerCase().includes(cleaned);
      const matchPhone = o.phone.replace(/\D/g, '').includes(q.replace(/\D/g, ''));
      const matchSenderPhone = o.senderPhone ? o.senderPhone.replace(/\D/g, '').includes(q.replace(/\D/g, '')) : false;
      const matchTrx = o.trxId ? o.trxId.toLowerCase().includes(cleaned) : false;
      return matchId || matchPhone || matchSenderPhone || matchTrx;
    });

    setMatchedOrders(found);
    if (found.length > 0) {
      setSearchedOrder(found[0]);
    } else {
      setSearchedOrder(null);
    }
  };

  const formatPrice = (bdtPrice: number) => {
    if (currency === 'USD') {
      return `$${(bdtPrice / 120).toFixed(2)}`;
    }
    return `৳${bdtPrice.toLocaleString('bn-BD')}`;
  };

  // Status visual mapping
  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Approved':
      case 'Confirmed':
        return {
          label: isBn ? 'এপ্রুভড (Approved)' : 'Approved',
          subtext: isBn 
            ? 'আপনার বিকাশ পেমেন্ট ও অর্ডারটি অ্যাডমিন কর্তৃক এপ্রুভ (Approved) করা হয়েছে! পার্সেল প্যাক করে কুরিয়ারে দেওয়া হচ্ছে।' 
            : 'Your order and payment have been verified & approved by store admin!',
          color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          dot: 'bg-emerald-500',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
          step: 2
        };
      case 'Shipped':
        return {
          label: isBn ? 'কুরিয়ারে প্রেরিত (Shipped)' : 'Shipped & In Transit',
          subtext: isBn 
            ? 'আপনার পণ্য কুরিয়ার সার্ভিসে হস্তান্তর করা হয়েছে। দ্রুত আপনার ঠিকানায় পৌঁছাবে।' 
            : 'Your package is on its way with the courier.',
          color: 'bg-blue-100 text-blue-800 border-blue-300',
          dot: 'bg-blue-500',
          icon: <Truck className="w-5 h-5 text-blue-600" />,
          step: 3
        };
      case 'Delivered':
        return {
          label: isBn ? 'ডেলিভারি সম্পন্ন (Delivered)' : 'Delivered',
          subtext: isBn 
            ? 'অর্ডারটি সফলভাবে আপনার কাছে ডেলিভারি করা হয়েছে। smartshopbd সাথে থাকার জন্য ধন্যবাদ!' 
            : 'Order has been successfully delivered. Thank you for shopping with us!',
          color: 'bg-purple-100 text-purple-800 border-purple-300',
          dot: 'bg-purple-500',
          icon: <Check className="w-5 h-5 text-purple-600" />,
          step: 4
        };
      case 'Cancelled':
        return {
          label: isBn ? 'বাতিল করা হয়েছে (Cancelled)' : 'Cancelled',
          subtext: isBn 
            ? 'অর্ডারটি বাতিল করা হয়েছে (বিকাশ পেমেন্ট পাওয়া যায়নি অথবা গ্রাহকের অনুরোধে)। প্রয়োজনে হটলাইনে কল করুন।' 
            : 'Order was cancelled (payment unverified or requested by customer). Contact support if needed.',
          color: 'bg-rose-100 text-rose-800 border-rose-300',
          dot: 'bg-rose-500',
          icon: <XCircle className="w-5 h-5 text-rose-600" />,
          step: 0
        };
      case 'Pending':
      default:
        return {
          label: isBn ? 'পেন্ডিং / অপেক্ষমান (Pending)' : 'Pending Review',
          subtext: isBn 
            ? 'আপনার অর্ডারটি গ্রহণ করা হয়েছে। শপ অ্যাডমিন বিকাশ/নগদ পেমেন্ট ও তথ্য যাচাই করে খুব শীঘ্রই এপ্রুভ (Approved) করবেন।' 
            : 'Your order has been received. Admin is verifying your payment/details to approve it.',
          color: 'bg-amber-100 text-amber-800 border-amber-300',
          dot: 'bg-amber-500',
          icon: <Clock className="w-5 h-5 text-amber-600 animate-pulse" />,
          step: 1
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative bg-white w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xs border border-white/20 text-emerald-400 shadow-inner">
              <PackageCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-xl font-black">
                  {isBn ? 'অর্ডার স্ট্যাটাস ও ট্র্যাকিং' : 'Order Status & Tracking'}
                </h2>
                <span className="text-[10px] bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded-full font-bold">
                  LIVE
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {isBn 
                  ? 'আপনার অর্ডারটি এপ্রুভ (Approved) হইছে না কি পেন্ডিং (Pending) আছে তা লাইভ দেখুন' 
                  : 'Check if your order is Approved, Pending, or Shipped in real-time'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar Section */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 space-y-2.5">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isBn ? 'অর্ডার আইডি (যেমন: ORD-123456) বা মোবাইল নম্বর লিখুন...' : 'Enter Order ID (e.g. ORD-123456) or Phone Number...'}
                className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <button
              type="submit"
              className="px-4 sm:px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>{isBn ? 'স্ট্যাটাস দেখুন' : 'Track Order'}</span>
            </button>
          </form>

          {/* Quick buttons */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600">
            <span className="font-semibold text-slate-500">{isBn ? 'সহজ এক-ক্লিক সার্চ:' : 'Quick lookup:'}</span>
            {lastOrderId && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery(lastOrderId);
                  handleSearch(lastOrderId);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-emerald-50 border border-slate-300 hover:border-emerald-400 rounded-lg text-emerald-800 font-mono font-bold transition shadow-2xs"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>{isBn ? `আমার সাম্প্রতিক অর্ডার (${lastOrderId})` : `My Last Order (${lastOrderId})`}</span>
              </button>
            )}

            {orders.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery(orders[0].id);
                  handleSearch(orders[0].id);
                }}
                className="inline-flex items-center gap-1 px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-mono text-[10px]"
              >
                <span>{isBn ? `সর্বশেষ অর্ডার: ${orders[0].id}` : `Latest: ${orders[0].id}`}</span>
              </button>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Multiple matches selector if searched by phone */}
          {matchedOrders.length > 1 && (
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl space-y-1.5">
              <p className="text-xs font-bold text-indigo-900">
                {isBn 
                  ? `আপনার নম্বরে ${matchedOrders.length}টি অর্ডার পাওয়া গেছে। যেকোনো একটি সিলেক্ট করুন:` 
                  : `Found ${matchedOrders.length} orders for this number. Select one:`}
              </p>
              <div className="flex flex-wrap gap-2">
                {matchedOrders.map((ord) => (
                  <button
                    key={ord.id}
                    onClick={() => setSearchedOrder(ord)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition ${
                      searchedOrder?.id === ord.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white text-indigo-800 border-indigo-200 hover:bg-indigo-100'
                    }`}
                  >
                    {ord.id} ({ord.status})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Searched Order Details */}
          {searchedOrder ? (
            <div className="space-y-5">
              {/* STATUS CARD */}
              {(() => {
                const badge = getStatusBadge(searchedOrder.status);
                return (
                  <div className={`p-4 sm:p-5 rounded-2xl border ${badge.color} space-y-3 shadow-xs`}>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        {badge.icon}
                        <h3 className="text-base sm:text-lg font-black tracking-tight">
                          {badge.label}
                        </h3>
                      </div>
                      <span className="font-mono text-xs font-bold bg-white/80 px-2.5 py-1 rounded-full border border-black/10">
                        {searchedOrder.id}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-medium leading-relaxed">
                      {badge.subtext}
                    </p>

                    {/* bKash Payment verification note if bKash */}
                    {searchedOrder.paymentMethod === 'bkash' && (
                      <div className="pt-2 border-t border-black/10 text-xs flex flex-wrap items-center gap-3">
                        <span className="font-bold flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                          {isBn ? 'বিকাশ পেমেন্ট ট্র্যাকিং:' : 'bKash Payment Status:'}
                        </span>
                        {searchedOrder.status === 'Approved' ? (
                          <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold text-[11px] flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            {isBn ? 'টাকা রিসিভড ও এপ্রুভড' : 'Payment Verified & Approved'}
                          </span>
                        ) : searchedOrder.status === 'Cancelled' ? (
                          <span className="bg-rose-600 text-white px-2 py-0.5 rounded-full font-bold text-[11px]">
                            {isBn ? 'পেমেন্ট ভেরিফাই হয়নি (বাতিল)' : 'Unverified (Cancelled)'}
                          </span>
                        ) : (
                          <span className="bg-amber-500 text-white px-2 py-0.5 rounded-full font-bold text-[11px] flex items-center gap-1 animate-pulse">
                            <Clock className="w-3 h-3" />
                            {isBn ? 'অ্যাডমিন বিকাশ চেক করছেন (পেন্ডিং)' : 'Admin Checking bKash (Pending)'}
                          </span>
                        )}

                        {searchedOrder.trxId && (
                          <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-black/10">
                            TrxID: <strong>{searchedOrder.trxId}</strong>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* TIMELINE PROGRESS STEPPER */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                  {isBn ? 'অর্ডারের অগ্রগতি (Delivery Progress)' : 'Progress Timeline'}
                </h4>

                <div className="relative flex items-center justify-between text-center pt-2">
                  {/* Progress Line */}
                  <div className="absolute top-6 left-6 right-6 h-1 bg-slate-200 -z-0">
                    <div 
                      className="h-full bg-emerald-500 transition-all duration-500"
                      style={{
                        width: 
                          searchedOrder.status === 'Delivered' ? '100%' :
                          searchedOrder.status === 'Shipped' ? '70%' :
                          searchedOrder.status === 'Approved' || searchedOrder.status === 'Confirmed' ? '40%' :
                          searchedOrder.status === 'Cancelled' ? '0%' : '15%'
                      }}
                    />
                  </div>

                  {/* Step 1: Placed */}
                  <div className="flex flex-col items-center gap-1 z-10 w-20">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs ring-4 ring-white shadow-xs">
                      ✓
                    </div>
                    <span className="text-[11px] font-bold text-slate-800">
                      {isBn ? 'অর্ডার প্লেস' : 'Placed'}
                    </span>
                    <span className="text-[9px] text-slate-400">
                      {new Date(searchedOrder.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Step 2: Approved */}
                  <div className="flex flex-col items-center gap-1 z-10 w-24">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ring-4 ring-white shadow-xs ${
                      searchedOrder.status === 'Approved' || searchedOrder.status === 'Confirmed' || searchedOrder.status === 'Shipped' || searchedOrder.status === 'Delivered'
                        ? 'bg-emerald-600 text-white'
                        : searchedOrder.status === 'Cancelled'
                        ? 'bg-rose-500 text-white'
                        : 'bg-amber-500 text-white animate-pulse'
                    }`}>
                      {searchedOrder.status === 'Approved' || searchedOrder.status === 'Confirmed' || searchedOrder.status === 'Shipped' || searchedOrder.status === 'Delivered' ? '✓' : searchedOrder.status === 'Cancelled' ? '✕' : '⏳'}
                    </div>
                    <span className={`text-[11px] font-bold ${
                      searchedOrder.status === 'Approved' || searchedOrder.status === 'Confirmed' || searchedOrder.status === 'Shipped' || searchedOrder.status === 'Delivered'
                        ? 'text-emerald-700'
                        : searchedOrder.status === 'Cancelled'
                        ? 'text-rose-600'
                        : 'text-amber-700'
                    }`}>
                      {isBn ? 'এপ্রুভড (Approved)' : 'Approved'}
                    </span>
                    <span className="text-[9px] text-slate-400">
                      {searchedOrder.status === 'Approved' || searchedOrder.status === 'Confirmed' || searchedOrder.status === 'Shipped' || searchedOrder.status === 'Delivered'
                        ? (isBn ? 'অনুমোদিত' : 'Verified')
                        : searchedOrder.status === 'Cancelled' ? (isBn ? 'বাতিল' : 'Cancelled') : (isBn ? 'অপেক্ষমান' : 'Pending')}
                    </span>
                  </div>

                  {/* Step 3: Shipped */}
                  <div className="flex flex-col items-center gap-1 z-10 w-20">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ring-4 ring-white shadow-xs ${
                      searchedOrder.status === 'Shipped' || searchedOrder.status === 'Delivered'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      <Truck className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-700">
                      {isBn ? 'কুরিয়ারে' : 'Shipped'}
                    </span>
                    <span className="text-[9px] text-slate-400">
                      {searchedOrder.status === 'Shipped' || searchedOrder.status === 'Delivered' ? (isBn ? 'চলমান' : 'In transit') : (isBn ? 'অপেক্ষমাণ' : 'Pending')}
                    </span>
                  </div>

                  {/* Step 4: Delivered */}
                  <div className="flex flex-col items-center gap-1 z-10 w-20">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ring-4 ring-white shadow-xs ${
                      searchedOrder.status === 'Delivered'
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-700">
                      {isBn ? 'ডেলিভার্ড' : 'Delivered'}
                    </span>
                    <span className="text-[9px] text-slate-400">
                      {searchedOrder.status === 'Delivered' ? (isBn ? 'সম্পন্ন' : 'Done') : (isBn ? 'অপেক্ষমাণ' : 'Pending')}
                    </span>
                  </div>
                </div>
              </div>

              {/* CUSTOMER & DELIVERY INFO */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{isBn ? 'গ্রাহকের বিবরণ:' : 'Customer Details:'}</p>
                  <p className="font-bold text-slate-900 text-sm">{searchedOrder.customerName}</p>
                  <p className="text-slate-600 flex items-center gap-1 font-mono">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{searchedOrder.phone}</span>
                  </p>
                  <p className="text-slate-500 flex items-center gap-1 text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{new Date(searchedOrder.createdAt).toLocaleString()}</span>
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{isBn ? 'ডেলিভারি ঠিকানা ও পেমেন্ট:' : 'Delivery & Payment:'}</p>
                  <p className="font-semibold text-slate-800 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{searchedOrder.address}, {searchedOrder.thanaCity ? `${searchedOrder.thanaCity}, ` : ''}{searchedOrder.district}</span>
                  </p>
                  <div className="pt-1 border-t border-slate-200/80 flex items-center justify-between text-xs">
                    <span className="text-slate-500 flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                      <span className="uppercase font-bold text-slate-700">{searchedOrder.paymentMethod}</span>
                    </span>
                    <span className="font-extrabold text-emerald-700 text-sm">
                      {formatPrice(searchedOrder.total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* ORDER ITEMS */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isBn ? 'অর্ডারকৃত পণ্যসমূহ:' : 'Ordered Items:'}</span>
                </h4>

                <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden text-xs">
                  {searchedOrder.items.map((item, i) => (
                    <div key={i} className="p-3 bg-white flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.product.image} 
                          alt={item.product.nameBn} 
                          className="w-11 h-11 rounded-lg object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{item.product.nameBn}</p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                            <span>পরিমাণ: <strong>x{item.quantity}</strong></span>
                            {item.selectedSize && <span className="bg-slate-100 px-1.5 rounded">সাইজ: {item.selectedSize}</span>}
                            {item.selectedColor && <span className="bg-slate-100 px-1.5 rounded">রং: {item.selectedColor}</span>}
                          </div>
                        </div>
                      </div>
                      <span className="font-extrabold text-slate-800">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hotline Contact Note */}
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{isBn ? 'যেকোনো জিজ্ঞাসায় আমাদের সরাসরি কল করুন: 01784315047' : 'Need help? Call our hotline: 01784315047'}</span>
                </div>
                <a
                  href="tel:01784315047"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs transition shrink-0"
                >
                  {isBn ? '📞 কল দিন' : 'Call Now'}
                </a>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                {hasSearched
                  ? (isBn ? 'কোনো অর্ডার খুঁজে পাওয়া যায়নি' : 'No order found')
                  : (isBn ? 'আপনার অর্ডারের স্ট্যাটাস দেখুন' : 'Track your order')}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {isBn 
                  ? 'আপনার সঠিক অর্ডার আইডি (যেমন: ORD-123456) অথবা যে মোবাইল নম্বর দিয়ে অর্ডার করেছিলেন তা উপরে লিখে সার্চ করুন।' 
                  : 'Enter your exact Order ID or phone number to see if your order is Approved or Pending.'}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          {onOpenAdmin && (
            <button
              onClick={() => {
                onClose();
                onOpenAdmin();
              }}
              className="text-slate-500 hover:text-slate-900 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>{isBn ? 'অ্যাডমিন বিকাশ ভেরিফিকেশন প্যানেল' : 'Admin Payment Portal'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={onClose}
            className="ml-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition cursor-pointer"
          >
            {isBn ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
