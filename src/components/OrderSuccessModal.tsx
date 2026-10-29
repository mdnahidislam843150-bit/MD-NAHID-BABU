import React, { useEffect } from 'react';
import { Order } from '../types';
import confetti from 'canvas-confetti';
import { CheckCircle, Package, Truck, Printer, ArrowRight, Phone, MapPin, PackageCheck } from 'lucide-react';

interface OrderSuccessModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  language: 'bn' | 'en';
  currency: 'BDT' | 'USD';
  onTrackOrder?: (orderId: string) => void;
  onViewProfile?: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  isOpen,
  onClose,
  language,
  currency,
  onTrackOrder,
  onViewProfile
}) => {
  if (!isOpen || !order) return null;

  const isBn = language === 'bn';

  useEffect(() => {
    // Fire confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // Ignore if confetti fails
    }
  }, []);

  const formatPrice = (bdtPrice: number) => {
    if (currency === 'USD') {
      return `$${(bdtPrice / 120).toFixed(2)}`;
    }
    return `৳${bdtPrice.toLocaleString('bn-BD')}`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative bg-white w-full max-w-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Celebration Header */}
        <div className="p-6 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white text-center space-y-2">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-xs ring-4 ring-white/30">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            {isBn ? 'অভিনন্দন! আপনার অর্ডারটি নিশ্চিত হয়েছে' : 'Order Placed Successfully!'}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100">
            {isBn 
              ? 'আমাদের কাস্টমার কেয়ার টিম শীঘ্রই আপনার সাথে যোগাযোগ করবে।' 
              : 'Our support team will contact you shortly to arrange delivery.'}
          </p>
          <div className="inline-block mt-1 bg-black/20 text-white font-mono text-xs px-3 py-1 rounded-full border border-white/20">
            {isBn ? 'অর্ডার নম্বর:' : 'Order ID:'} <strong>{order.id}</strong>
          </div>
        </div>

        {/* Invoice details */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs sm:text-sm text-slate-700">
          
          {/* Tracking timeline mini */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-700 font-bold">
              <Package className="w-4 h-4 text-emerald-600" />
              <span>{isBn ? 'অর্ডার গ্রহণ সম্পন্ন' : 'Order Confirmed'}</span>
            </div>
            <span className="text-slate-400">→</span>
            <div className="flex items-center gap-2 text-slate-600">
              <Truck className="w-4 h-4 text-slate-500" />
              <span>{isBn ? 'প্যাকেজিং ও ডেলিভারি' : 'In Transit'}</span>
            </div>
          </div>

          {/* Delivery & Customer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase">{isBn ? 'গ্রাহক:' : 'Customer:'}</p>
              <p className="font-bold text-slate-900 mt-0.5">{order.customerName}</p>
              <p className="text-slate-600 flex items-center gap-1 mt-0.5">
                <Phone className="w-3 h-3 text-slate-400" />
                <span>{order.phone}</span>
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase">{isBn ? 'ডেলিভারি ঠিকানা:' : 'Delivery Address:'}</p>
              <p className="font-medium text-slate-800 flex items-start gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-400 mt-0.5 shrink-0" />
                <span>{order.address}, {order.thanaCity ? `${order.thanaCity}, ` : ''}{order.district}</span>
              </p>
            </div>
          </div>

          {/* Items Summary */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs mb-2">
              {isBn ? 'অর্ডারকৃত পণ্যসমূহ:' : 'Ordered Items:'}
            </h4>
            <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
              {order.items.map((item, i) => (
                <div key={i} className="p-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <img src={item.product.image} alt={item.product.name} className="w-8 h-8 rounded object-cover" />
                    <div>
                      <p className="font-semibold text-slate-800">
                        {isBn ? item.product.nameBn : item.product.name}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {item.quantity} x {formatPrice(item.product.price)}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="space-y-1 text-xs border-t border-slate-200 pt-3">
            <div className="flex justify-between text-slate-600">
              <span>{isBn ? 'সাবটোটাল:' : 'Subtotal:'}</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>{isBn ? 'মূল্যছাড়:' : 'Discount:'}</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>{isBn ? 'ডেলিভারি ফি:' : 'Shipping:'}</span>
              <span>{formatPrice(order.deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-200 pt-1.5">
              <span>{isBn ? 'পরিশোধিত/প্রদেয় মোট:' : 'Total Amount:'}</span>
              <span className="text-emerald-700">{formatPrice(order.total)}</span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 pt-1">
              <span>{isBn ? 'পেমেন্ট মেথড:' : 'Payment:'}</span>
              <span className="font-semibold uppercase text-slate-700">{order.paymentMethod}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row gap-2">
          {onTrackOrder && (
            <button
              onClick={() => {
                onClose();
                onTrackOrder(order.id);
              }}
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <PackageCheck className="w-4 h-4 text-emerald-400" />
              <span>{isBn ? '🔍 অর্ডার ট্র্যাক করুন' : 'Track Order'}</span>
            </button>
          )}

          {onViewProfile && (
            <button
              onClick={() => {
                onClose();
                onViewProfile();
              }}
              className="flex-1 py-2.5 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Package className="w-4 h-4 text-indigo-600" />
              <span>{isBn ? '👤 প্রোফাইল ও অর্ডারসমূহ' : 'My Orders & Profile'}</span>
            </button>
          )}

          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition"
          >
            <Printer className="w-4 h-4" />
            <span>{isBn ? 'ইনভয়েস প্রিন্ট করুন' : 'Print Invoice'}</span>
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-md shadow-emerald-600/20"
          >
            <span>{isBn ? 'আরও কেনাকাটা করুন' : 'Continue Shopping'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
