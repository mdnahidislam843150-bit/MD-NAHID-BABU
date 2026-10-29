import React, { useState, useEffect } from 'react';
import { CartItem, Coupon, Order, PaymentMethod, SiteContent, UserProfile } from '../types';
import { BANGLADESH_DISTRICTS } from '../data/mockProducts';
import { 
  X, 
  CheckCircle2, 
  Truck, 
  MapPin, 
  Phone, 
  User, 
  FileText, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  Copy, 
  AlertCircle, 
  ShieldCheck,
  Bookmark,
  Trash2
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  appliedCoupon: Coupon | null;
  language: 'bn' | 'en';
  currency: 'BDT' | 'USD';
  onOrderSuccess: (order: Order) => void;
  siteContent?: SiteContent;
  userProfile?: UserProfile;
  onRemoveItem?: (productId: string, color?: string, size?: string) => void;
  onClearCart?: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  appliedCoupon,
  language,
  currency,
  onOrderSuccess,
  siteContent,
  userProfile,
  onRemoveItem,
  onClearCart
}) => {
  if (!isOpen || items.length === 0) return null;

  const isBn = language === 'bn';

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState(BANGLADESH_DISTRICTS[0]);
  const [thanaCity, setThanaCity] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'regular' | 'express'>('regular');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [senderPhone, setSenderPhone] = useState('');
  const [trxId, setTrxId] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState(false);

  // Reset form inputs every time checkout modal opens
  // so that every single order requires entering fresh Name, Phone, and Address!
  useEffect(() => {
    if (isOpen) {
      setCustomerName('');
      setPhone('');
      setAddress('');
      setThanaCity('');
      setDistrict(BANGLADESH_DISTRICTS[0] || 'ঢাকা (Dhaka)');
      setDeliveryMethod('regular');
      setPaymentMethod('cod');
      setSenderPhone('');
      setTrxId('');
      setOrderNotes('');
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const subtotal = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  const activePaymentNumber = (paymentMethod === 'bkash' 
    ? siteContent?.bkashNumber 
    : siteContent?.nagadNumber) || '01784315047';
  const formattedPaymentNumber = activePaymentNumber.length === 11 
    ? `${activePaymentNumber.slice(0, 5)}-${activePaymentNumber.slice(5)}`
    : activePaymentNumber;

  // Delivery charge calculation
  let deliveryFee = 60;
  if (district.includes('Dhaka') || district.includes('ঢাকা')) {
    deliveryFee = deliveryMethod === 'express' ? 120 : 60;
  } else {
    deliveryFee = deliveryMethod === 'express' ? 180 : 120;
  }

  // Coupon discount
  let discount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minSpend) {
    if (appliedCoupon.discountType === 'percentage') {
      discount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
    } else {
      discount = appliedCoupon.discountValue;
    }
  }

  const grandTotal = Math.max(0, subtotal - discount + deliveryFee);

  const formatPrice = (bdtPrice: number) => {
    if (currency === 'USD') {
      return `$${(bdtPrice / 120).toFixed(2)}`;
    }
    return `৳${bdtPrice.toLocaleString('bn-BD')}`;
  };

  const handleCopyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const validate = () => {
    const errs: { [key: string]: string } = {};

    if (!customerName.trim() || customerName.trim().length < 2) {
      errs.customerName = isBn ? 'আপনার পুরো নাম লিখুন' : 'Please enter your full name';
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 11) {
      errs.phone = isBn ? 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)' : 'Enter a valid 11-digit mobile number';
    }

    if (!address.trim() || address.trim().length < 6) {
      errs.address = isBn ? 'বিস্তারিত ঠিকানা দিন (বাসা নং, রোড নং, এলাকা)' : 'Please enter full street/house address';
    }

    if ((paymentMethod === 'bkash' || paymentMethod === 'nagad' || paymentMethod === 'rocket')) {
      if (!trxId.trim() || trxId.trim().length < 6) {
        errs.trxId = isBn ? 'ট্রানজেকশন আইডি (TrxID) উল্লেখ করুন' : 'Transaction ID is required';
      }
      if (!senderPhone.trim() || senderPhone.trim().length < 11) {
        errs.senderPhone = isBn ? 'যে নম্বর থেকে টাকা পাঠিয়েছেন তা দিন' : 'Sender phone number is required';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const newOrder: Order = {
        id: `ORD-${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toISOString(),
        customerName: customerName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        district,
        thanaCity: thanaCity.trim(),
        deliveryMethod,
        deliveryFee,
        paymentMethod,
        senderPhone: senderPhone.trim() || undefined,
        trxId: trxId.trim().toUpperCase() || undefined,
        orderNotes: orderNotes.trim() || undefined,
        items: [...items],
        subtotal,
        discount,
        couponCode: appliedCoupon?.code,
        total: grandTotal,
        status: 'Confirmed'
      };

      setIsSubmitting(false);
      // Reset form fields immediately so next order starts 100% clean
      setCustomerName('');
      setPhone('');
      setAddress('');
      setThanaCity('');
      setSenderPhone('');
      setTrxId('');
      setOrderNotes('');
      setErrors({});
      onOrderSuccess(newOrder);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative bg-white w-full max-w-4xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-gradient-to-r from-emerald-50 via-teal-50 to-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-600 text-white">
                <Truck className="w-4 h-4" />
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                {isBn ? 'পারফেক্ট অর্ডার ও চেকআউট ফরম' : 'Instant Checkout & Delivery Form'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {isBn 
                ? 'অর্ডারটি কনফার্ম করতে নিচের সহজ তথ্যগুলো পূরণ করুন (কোনো অ্যাকাউন্ট খোলার প্রয়োজন নেই)' 
                : 'Fill in your delivery details below to confirm order (No account needed)'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body: 2 Columns */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Customer & Delivery Details */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Step 1: Customer Info */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isBn ? '১. গ্রাহকের তথ্য (Customer Details)' : '1. Customer Details'}</span>
                </h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  {isBn ? 'প্রতি অর্ডারে আবশ্যক' : 'Required each order'}
                </span>
              </div>

              {/* Requirement reminder badge */}
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  {isBn 
                    ? 'প্রতিটি নতুন অর্ডারের জন্য আপনার নাম, মোবাইল নম্বর ও ঠিকানা পূরণ করুন।' 
                    : 'Please enter your name, mobile number, and delivery address for every order.'}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isBn ? 'আপনার পূর্ণ নাম *' : 'Full Name *'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={isBn ? 'উদা: মোঃ নাহিদ ইসলাম' : 'e.g. Nahid Islam'}
                    className={`w-full text-xs sm:text-sm pl-8 pr-3 py-2 bg-white rounded-lg border focus:outline-none transition ${
                      errors.customerName 
                        ? 'border-rose-400 focus:ring-1 focus:ring-rose-400' 
                        : 'border-slate-300 focus:ring-1 focus:ring-emerald-500'
                    }`}
                  />
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
                {errors.customerName && <p className="text-[11px] text-rose-600 mt-1">{errors.customerName}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isBn ? 'সচল মোবাইল নম্বর * (ডেলিভারির জন্য কল করা হবে)' : 'Mobile Phone Number *'}
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={isBn ? '017XXXXXXXX' : '017XXXXXXXX'}
                    className={`w-full text-xs sm:text-sm pl-8 pr-3 py-2 bg-white rounded-lg border focus:outline-none transition ${
                      errors.phone 
                        ? 'border-rose-400 focus:ring-1 focus:ring-rose-400' 
                        : 'border-slate-300 focus:ring-1 focus:ring-emerald-500'
                    }`}
                  />
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
                {errors.phone && <p className="text-[11px] text-rose-600 mt-1">{errors.phone}</p>}
              </div>
            </div>

            {/* Step 2: Address */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isBn ? '২. ডেলিভারি ঠিকানা (Shipping Address)' : '2. Shipping Address'}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isBn ? 'জেলা নির্বাচন করুন *' : 'District *'}
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full text-xs sm:text-sm py-2 px-3 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    {BANGLADESH_DISTRICTS.map((dist) => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isBn ? 'থানা / উপজেলা / এলাকা' : 'Thana / Area'}
                  </label>
                  <input
                    type="text"
                    value={thanaCity}
                    onChange={(e) => setThanaCity(e.target.value)}
                    placeholder={isBn ? 'উদা: মিরপুর-১০ / ধানমন্ডি' : 'e.g. Mirpur, Dhanmondi'}
                    className="w-full text-xs sm:text-sm py-2 px-3 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isBn ? 'পূর্ণ ঠিকানা (বাসা/ফ্ল্যাট নম্বর, রোড নম্বর, ল্যান্ডমার্ক) *' : 'Full Street Address *'}
                </label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={isBn ? 'বাসা #১২, রোড #০৪, সেক্টর #১১, উত্তরা...' : 'House #12, Road #4, Sector #11...'}
                  className={`w-full text-xs sm:text-sm p-2.5 bg-white rounded-lg border focus:outline-none transition ${
                    errors.address 
                      ? 'border-rose-400 focus:ring-1 focus:ring-rose-400' 
                      : 'border-slate-300 focus:ring-1 focus:ring-emerald-500'
                  }`}
                />
                {errors.address && <p className="text-[11px] text-rose-600 mt-1">{errors.address}</p>}
              </div>

              {/* Delivery Speed Options */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {isBn ? 'ডেলিভারি ধরন:' : 'Delivery Speed:'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('regular')}
                    className={`p-2.5 rounded-lg border text-left transition flex flex-col justify-between ${
                      deliveryMethod === 'regular'
                        ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-500'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">
                        {isBn ? 'রেগুলার ডেলিভারি' : 'Standard'}
                      </span>
                      <span className="text-xs font-extrabold text-emerald-700">
                        {district.includes('Dhaka') || district.includes('ঢাকা') ? '৳৬০' : '৳১২০'}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1">
                      {isBn ? '২-৩ কর্মদিবস' : '2-3 Business Days'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('express')}
                    className={`p-2.5 rounded-lg border text-left transition flex flex-col justify-between ${
                      deliveryMethod === 'express'
                        ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-500'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                        <span>{isBn ? 'জরুরি এক্সপ্রেস' : 'Express'}</span>
                        <span className="text-[9px] bg-amber-400 text-slate-900 px-1 rounded font-black">FAST</span>
                      </span>
                      <span className="text-xs font-extrabold text-emerald-700">
                        {district.includes('Dhaka') || district.includes('ঢাকা') ? '৳১২০' : '৳১৮০'}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1">
                      {isBn ? '২৪ ঘণ্টার মধ্যে পৌঁছাবে' : 'Within 24 Hours'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Special Note */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isBn ? 'ডেলিভারির বিশেষ নির্দেশনা (ঐচ্ছিক):' : 'Delivery Notes (Optional):'}
                </label>
                <input
                  type="text"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder={isBn ? 'উদা: বিকাল ৫টার পর ডেলিভারি দিলে ভালো হয়' : 'e.g. Please deliver after 5 PM'}
                  className="w-full text-xs py-2 px-3 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isBn ? '৩. পেমেন্ট পদ্ধতি নির্বাচন করুন (Payment Method)' : '3. Payment Method'}</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {/* Cash on delivery */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                    paymentMethod === 'cod'
                      ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-500 text-emerald-900 font-bold'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-emerald-600" />
                  <span className="text-xs">{isBn ? 'ক্যাশ অন ডেলিভারি' : 'Cash on Delivery'}</span>
                </button>

                {/* bKash */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bkash')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                    paymentMethod === 'bkash'
                      ? 'border-pink-600 bg-pink-50 ring-1 ring-pink-500 text-pink-900 font-bold'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <span className="font-black text-sm text-pink-600">bKash</span>
                  <span className="text-xs">{isBn ? 'বিকাশ সেন্ড মানি' : 'bKash'}</span>
                </button>

                {/* Nagad */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('nagad')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                    paymentMethod === 'nagad'
                      ? 'border-orange-600 bg-orange-50 ring-1 ring-orange-500 text-orange-900 font-bold'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <span className="font-black text-sm text-orange-600">নগদ</span>
                  <span className="text-xs">{isBn ? 'নগদ সেন্ড মানি' : 'Nagad'}</span>
                </button>
              </div>

              {/* bKash / Nagad Instruction Panel */}
              {(paymentMethod === 'bkash' || paymentMethod === 'nagad') && (
                <div className="p-3 bg-white border border-slate-300 rounded-xl space-y-2.5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-700 font-medium">
                      {paymentMethod === 'bkash' ? 'আমাদের বিকাশ পার্সোনাল নম্বর:' : 'আমাদের নগদ পার্সোনাল নম্বর:'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyNumber(activePaymentNumber)}
                      className="flex items-center gap-1.5 text-blue-700 hover:text-blue-900 bg-blue-50 px-2 py-1 rounded-md font-mono font-bold hover:bg-blue-100 transition cursor-pointer"
                      title="কপি করতে ক্লিক করুন"
                    >
                      <Copy className="w-3.5 h-3.5 text-blue-600" />
                      <span className="font-bold">{formattedPaymentNumber}</span>
                      {copiedNumber && <span className="text-emerald-600 text-[10px] font-bold">কপিকৃত!</span>}
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-tight">
                    {isBn 
                      ? 'উক্ত নম্বরে মোট টাকার পরিমাণ "Send Money" করুন। এরপর নিচে যে নম্বর থেকে টাকা পাঠিয়েছেন তা এবং ফিরতি এসএমএসের TrxID লিখুন।'
                      : 'Send the exact amount via Send Money to the number above, then enter sender number and TrxID.'}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <div>
                      <input
                        type="tel"
                        value={senderPhone}
                        onChange={(e) => setSenderPhone(e.target.value)}
                        placeholder={isBn ? 'যে নম্বর থেকে পাঠিয়েছেন' : 'Sender Phone #'}
                        className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                      {errors.senderPhone && <p className="text-[10px] text-rose-600 mt-0.5">{errors.senderPhone}</p>}
                    </div>

                    <div>
                      <input
                        type="text"
                        value={trxId}
                        onChange={(e) => setTrxId(e.target.value)}
                        placeholder={isBn ? 'TrxID (যেমন: 9J4K2L8)' : 'Transaction ID'}
                        className="w-full text-xs p-2 uppercase bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                      />
                      {errors.trxId && <p className="text-[10px] text-rose-600 mt-0.5">{errors.trxId}</p>}
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Order Summary & Confirmation */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/90 space-y-4">
              <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2 flex items-center justify-between">
                <span>{isBn ? 'অর্ডার সামারি' : 'Order Summary'}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">
                    {items.length} {isBn ? 'টি পণ্য' : 'items'}
                  </span>
                  {onClearCart && items.length > 0 && (
                    <button
                      type="button"
                      onClick={onClearCart}
                      className="flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 px-2 py-1 rounded-lg border border-rose-200 transition cursor-pointer"
                      title={isBn ? 'সব পণ্য বাতিল/কেনছেল করুন' : 'Clear all items'}
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>{isBn ? 'সব কেনছেল' : 'Clear All'}</span>
                    </button>
                  )}
                </div>
              </h3>

              {/* Items List Mini with Cancel/Remove buttons */}
              <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs bg-white p-2.5 rounded-xl border border-slate-200/90 shadow-2xs hover:border-slate-300 transition">
                    <img 
                      src={(item.selectedColor && item.product.colorImages?.[item.selectedColor]) || item.product.image} 
                      alt={item.product.name} 
                      className="w-11 h-11 object-cover rounded-lg bg-slate-100 border border-slate-200 shrink-0" 
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 truncate">
                        {isBn ? item.product.nameBn : item.product.name}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span>{formatPrice(item.product.price)} × {item.quantity}</span>
                        {item.selectedSize && <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-medium">{item.selectedSize}</span>}
                        {item.selectedColor && <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-medium">{item.selectedColor}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-extrabold text-slate-900">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                      {onRemoveItem && (
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.product.id, item.selectedColor, item.selectedSize)}
                          className="p-1.5 rounded-lg text-rose-500 hover:text-white hover:bg-rose-500 bg-rose-50 border border-rose-200 transition cursor-pointer"
                          title={isBn ? 'এই পণ্যটি কেনছেল/বাদ দিন' : 'Remove item'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price calculations */}
              <div className="border-t border-slate-200 pt-3 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>{isBn ? 'সাবটোটাল:' : 'Subtotal:'}</span>
                  <span className="font-semibold text-slate-800">{formatPrice(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>{isBn ? 'কুপন ছাড়:' : 'Coupon Discount:'}</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>{isBn ? 'ডেলিভারি চার্জ:' : 'Shipping Fee:'}</span>
                  <span className="font-semibold text-slate-800">{formatPrice(deliveryFee)}</span>
                </div>

                <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>{isBn ? 'সর্বমোট প্রদেয়:' : 'Total Payable:'}</span>
                  <span className="text-emerald-700">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Security badge */}
              <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200/60 flex items-start gap-2 text-[11px] text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  {isBn 
                    ? '১০০% নিরাপদ কেনাকাটার নিশ্চয়তা। ডেলিভারিম্যান পৌঁছানোর পর পণ্য যাচাই করে বুঝে নিন।' 
                    : '100% Safe shopping guarantee. Check your package upon delivery.'}
                </span>
              </div>
            </div>

            {/* Bottom Action Buttons: Cancel + Confirm Order */}
            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-3.5 px-3 bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-700 font-bold text-xs sm:text-sm rounded-2xl border border-slate-300 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <X className="w-4 h-4 text-slate-500" />
                <span>{isBn ? 'কেনছেল করুন' : 'Cancel'}</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-2/3 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 disabled:opacity-70 text-white font-black text-xs sm:text-base rounded-2xl shadow-xl shadow-emerald-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{isBn ? 'অর্ডার প্রসেস হচ্ছে...' : 'Processing Order...'}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span className="truncate">{isBn ? 'অর্ডার নিশ্চিত করুন' : 'Confirm Order'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
