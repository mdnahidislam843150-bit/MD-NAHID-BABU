import React, { useState } from 'react';
import { CartItem, Coupon } from '../types';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Check, Sparkles } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number, color?: string, size?: string) => void;
  onRemoveItem: (productId: string, color?: string, size?: string) => void;
  onProceedToCheckout: () => void;
  language: 'bn' | 'en';
  currency: 'BDT' | 'USD';
  appliedCoupon: Coupon | null;
  onApplyCoupon: (code: string) => { success: boolean; message: string };
  onRemoveCoupon: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  language,
  currency,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon
}) => {
  if (!isOpen) return null;

  const isBn = language === 'bn';
  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const formatPrice = (bdtPrice: number) => {
    if (currency === 'USD') {
      return `$${(bdtPrice / 120).toFixed(2)}`;
    }
    return `৳${bdtPrice.toLocaleString('bn-BD')}`;
  };

  const subtotal = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  // Discount calculation
  let discount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minSpend) {
    if (appliedCoupon.discountType === 'percentage') {
      discount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
    } else {
      discount = appliedCoupon.discountValue;
    }
  }

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = onApplyCoupon(couponInput.trim().toUpperCase());
    setCouponMsg({ text: res.message, isError: !res.success });
    if (res.success) {
      setCouponInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <h2 className="font-bold text-slate-900 text-base sm:text-lg">
              {isBn ? 'আপনার শপিং কার্ট' : 'Shopping Cart'}
            </h2>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              {items.reduce((sum, item) => sum + item.quantity, 0)} {isBn ? 'আইটেম' : 'items'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {items.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-3">
              <ShoppingBag className="w-12 h-12 mx-auto stroke-1 text-slate-300" />
              <p className="font-semibold text-slate-600 text-sm">
                {isBn ? 'আপনার কার্ট বর্তমানে খালি আছে' : 'Your cart is empty'}
              </p>
              <p className="text-xs text-slate-400">
                {isBn ? 'পছন্দের পণ্য কার্টে যুক্ত করুন এবং অর্ডার সম্পন্ন করুন।' : 'Add your favorite items and proceed to checkout.'}
              </p>
            </div>
          ) : (
            items.map((item, idx) => (
              <div 
                key={`${item.product.id}-${item.selectedColor || ''}-${item.selectedSize || ''}-${idx}`}
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80 hover:border-slate-300 transition"
              >
                <img
                  src={(item.selectedColor && item.product.colorImages?.[item.selectedColor]) || item.product.image}
                  alt={isBn ? item.product.nameBn : item.product.name}
                  className="w-16 h-16 object-cover rounded-lg bg-white border border-slate-200"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                    {isBn ? item.product.nameBn : item.product.name}
                  </h4>

                  {/* Variants display */}
                  {(item.selectedColor || item.selectedSize) && (
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      {item.selectedColor && <span>{item.selectedColor}</span>}
                      {item.selectedSize && <span>• {item.selectedSize}</span>}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-2">
                    <span className="font-extrabold text-sm text-emerald-700">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>

                    {/* Quantity Selector */}
                    <div className="flex items-center border border-slate-300 rounded-lg bg-white">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1, item.selectedColor, item.selectedSize)}
                        className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100 font-bold"
                      >
                        -
                      </button>
                      <span className="px-2 py-0.5 text-xs font-bold text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1, item.selectedColor, item.selectedSize)}
                        className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100 font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => onRemoveItem(item.product.id, item.selectedColor, item.selectedSize)}
                  className="text-slate-400 hover:text-rose-500 p-1.5 transition"
                  title={isBn ? 'মুছে ফেলুন' : 'Remove item'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer & Calculations */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/90 space-y-3">
            {/* Promo code form */}
            {!appliedCoupon ? (
              <form onSubmit={handleCouponSubmit} className="space-y-1.5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder={isBn ? 'কুপন কোড (যেমন: EID2026)' : 'Coupon code (e.g. EID2026)'}
                      className="w-full text-xs uppercase pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                    />
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition"
                  >
                    {isBn ? 'প্রয়োগ' : 'Apply'}
                  </button>
                </div>
                {couponMsg && (
                  <p className={`text-[11px] font-medium ${couponMsg.isError ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {couponMsg.text}
                  </p>
                )}
                {/* Available coupons hints */}
                <div className="flex flex-wrap gap-1 text-[10px] text-slate-500 pt-0.5">
                  <span className="font-semibold text-slate-600">{isBn ? 'কোডসমূহ:' : 'Codes:'}</span>
                  <button type="button" onClick={() => setCouponInput('EID2026')} className="text-emerald-700 underline font-semibold">EID2026</button>
                  <span>•</span>
                  <button type="button" onClick={() => setCouponInput('FREESHIP')} className="text-emerald-700 underline font-semibold">FREESHIP</button>
                  <span>•</span>
                  <button type="button" onClick={() => setCouponInput('WELCOME50')} className="text-emerald-700 underline font-semibold">WELCOME50</button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-between p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-xs">
                <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>কুপন কোড <strong>{appliedCoupon.code}</strong> কার্যকর!</span>
                </div>
                <button
                  onClick={onRemoveCoupon}
                  className="text-rose-600 hover:text-rose-800 text-[11px] font-bold underline"
                >
                  {isBn ? 'বাতিল' : 'Remove'}
                </button>
              </div>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200">
              <div className="flex justify-between">
                <span>{isBn ? 'পণ্য মূল্য (Subtotal):' : 'Subtotal:'}</span>
                <span className="font-semibold text-slate-800">{formatPrice(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>{isBn ? 'মূল্যছাড় (Discount):' : 'Discount:'}</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>{isBn ? 'হোম ডেলিভারি চার্জ:' : 'Estimated Shipping:'}</span>
                <span>{isBn ? 'চেকআউটে নির্ধারিত হবে' : 'Calculated at checkout'}</span>
              </div>

              <div className="flex justify-between text-sm font-black text-slate-900 pt-1.5 border-t border-slate-200">
                <span>{isBn ? 'সর্বমোট (Estimated Total):' : 'Total:'}</span>
                <span className="text-emerald-600">{formatPrice(Math.max(0, subtotal - discount))}</span>
              </div>
            </div>

            {/* Proceed to checkout button */}
            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-sm rounded-xl shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2"
            >
              <span>{isBn ? 'অর্ডার করতে এগিয়ে যান (Checkout)' : 'Proceed to Checkout'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
