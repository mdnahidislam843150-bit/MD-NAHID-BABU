import React, { useState, useRef } from 'react';
import { UserProfile, UserAddress, Order, Product } from '../types';
import { compressImageFile } from '../utils/storage';
import { 
  User, 
  X, 
  Package, 
  MapPin, 
  CreditCard, 
  Gift, 
  Edit3, 
  Check, 
  Copy, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Sparkles, 
  Camera, 
  Plus, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle, 
  Calendar,
  Save,
  ArrowRight,
  ExternalLink,
  Wallet,
  Award,
  ChevronRight
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateUserProfile: (updated: UserProfile) => void;
  orders: Order[];
  products: Product[];
  language: 'bn' | 'en';
  currency: 'BDT' | 'USD';
  onTrackOrder: (orderId: string) => void;
  onViewOrderSuccess?: (order: Order) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80'
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateUserProfile,
  orders,
  products,
  language,
  currency,
  onTrackOrder,
  onViewOrderSuccess
}) => {
  const isBn = language === 'bn';
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses' | 'payments' | 'rewards'>('orders');

  // Profile Edit State
  const [formData, setFormData] = useState({
    name: userProfile.name,
    phone: userProfile.phone,
    email: userProfile.email,
    gender: userProfile.gender || 'male',
    dateOfBirth: userProfile.dateOfBirth || '',
    avatarUrl: userProfile.avatarUrl || PRESET_AVATARS[0]
  });

  const [copiedId, setCopiedId] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  // Address Add/Edit State
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddrLabel, setNewAddrLabel] = useState<'Home' | 'Office' | 'Other'>('Home');
  const [newAddrDistrict, setNewAddrDistrict] = useState('ঢাকা (Dhaka)');
  const [newAddrThana, setNewAddrThana] = useState('');
  const [newAddrStreet, setNewAddrStreet] = useState('');

  if (!isOpen) return null;

  const formatPrice = (bdtPrice: number) => {
    if (currency === 'USD') {
      return `$${(bdtPrice / 120).toFixed(2)}`;
    }
    return `৳${bdtPrice.toLocaleString('bn-BD')}`;
  };

  const handleCopyProfileId = () => {
    navigator.clipboard.writeText(userProfile.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...userProfile,
      name: formData.name.trim() || userProfile.name,
      phone: formData.phone.trim() || userProfile.phone,
      email: formData.email.trim() || userProfile.email,
      gender: formData.gender as any,
      dateOfBirth: formData.dateOfBirth,
      avatarUrl: formData.avatarUrl
    };
    onUpdateUserProfile(updated);
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3000);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedData = await compressImageFile(file, 400, 400, 0.75);
        setFormData((prev) => ({ ...prev, avatarUrl: compressedData }));
        onUpdateUserProfile({ ...userProfile, avatarUrl: compressedData });
      } catch {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setFormData((prev) => ({ ...prev, avatarUrl: reader.result as string }));
            onUpdateUserProfile({ ...userProfile, avatarUrl: reader.result as string });
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrStreet.trim()) return;

    const labelMap = {
      Home: 'বাসার ঠিকানা (Home)',
      Office: 'অফিসের ঠিকানা (Office)',
      Other: 'অন্যান্য ঠিকানা (Other)'
    };

    const newAddress: UserAddress = {
      id: `addr-${Date.now()}`,
      label: newAddrLabel,
      labelBn: labelMap[newAddrLabel],
      district: newAddrDistrict,
      thanaCity: newAddrThana.trim(),
      streetAddress: newAddrStreet.trim(),
      isDefault: userProfile.savedAddresses.length === 0
    };

    const updatedAddresses = [...userProfile.savedAddresses, newAddress];
    onUpdateUserProfile({ ...userProfile, savedAddresses: updatedAddresses });
    setIsAddingAddress(false);
    setNewAddrStreet('');
    setNewAddrThana('');
  };

  const handleDeleteAddress = (id: string) => {
    const updated = userProfile.savedAddresses.filter((a) => a.id !== id);
    onUpdateUserProfile({ ...userProfile, savedAddresses: updated });
  };

  const handleSetDefaultAddress = (id: string) => {
    const updated = userProfile.savedAddresses.map((a) => ({
      ...a,
      isDefault: a.id === id
    }));
    onUpdateUserProfile({ ...userProfile, savedAddresses: updated });
  };

  // User's orders
  const myOrders = orders;
  const pendingOrders = myOrders.filter((o) => o.status === 'Pending');
  const approvedOrders = myOrders.filter((o) => o.status === 'Approved' || o.status === 'Confirmed');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/75 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative bg-white w-full max-w-4xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[94vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hidden File Input for Avatar Upload */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />

        {/* PROFILE HERO HEADER */}
        <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-7 overflow-hidden shrink-0">
          {/* Subtle Ambient Decorative Circles */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer z-10"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6 text-center md:text-left">
            {/* Avatar Section */}
            <div className="relative group shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-white/30 shadow-xl bg-slate-800 ring-4 ring-white/10">
                <img
                  src={formData.avatarUrl || userProfile.avatarUrl || PRESET_AVATARS[0]}
                  alt={userProfile.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Upload photo trigger */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-lg border-2 border-slate-900 transition active:scale-90 cursor-pointer"
                title="গ্যালারি থেকে প্রোফাইল ছবি পরিবর্তন করুন"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Profile Info Details */}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white truncate">
                  {userProfile.name}
                </h1>

                {/* VIP / Verified Badge */}
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[11px] shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{userProfile.membershipTier || 'VIP'} {isBn ? 'মেম্বার' : 'Member'}</span>
                </span>
              </div>

              {/* ID Badge with 1-click Copy */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs">
                <button
                  type="button"
                  onClick={handleCopyProfileId}
                  className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1 rounded-lg text-emerald-300 font-mono font-bold transition active:scale-95 cursor-pointer"
                  title="প্রোফাইল আইডি কপি করুন"
                >
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isBn ? 'প্রোফাইল আইডি:' : 'ID:'} <strong>{userProfile.id}</strong></span>
                  <Copy className="w-3 h-3 text-slate-300 ml-1" />
                  {copiedId && <span className="text-[10px] text-emerald-400 font-bold">✓ কপিকৃত!</span>}
                </button>

                <span className="text-slate-400 text-xs hidden sm:inline">•</span>

                <span className="text-slate-300 text-xs flex items-center gap-1 font-mono">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>{userProfile.phone}</span>
                </span>

                <span className="text-slate-400 text-xs hidden sm:inline">•</span>

                <span className="text-slate-300 text-xs flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-400" />
                  <span className="truncate max-w-[180px]">{userProfile.email}</span>
                </span>
              </div>

              {/* Member Since Note */}
              <p className="text-[11px] text-slate-400">
                {isBn ? 'স্মার্টশপবিডি-র সম্মানিত গ্রাহক' : 'Valued smartshopbd customer'} • {isBn ? 'যোগদানের তারিখ: ' : 'Member since: '} 
                <span className="font-mono text-slate-300">{userProfile.memberSince || '2024'}</span>
              </p>
            </div>

            {/* Wallet & Points Pill */}
            <div className="flex md:flex-col gap-2 shrink-0">
              <div className="bg-white/10 border border-white/15 backdrop-blur-xs rounded-xl px-3.5 py-2 text-center md:text-right">
                <p className="text-[10px] text-amber-300 font-bold uppercase tracking-wider flex items-center justify-center md:justify-end gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{isBn ? 'স্মার্ট রিওয়ার্ড' : 'SmartPoints'}</span>
                </p>
                <p className="text-base sm:text-lg font-black text-white font-mono mt-0.5">
                  {userProfile.smartPoints || 450} <span className="text-xs font-normal text-amber-200">pts</span>
                </p>
              </div>

              <div className="bg-white/10 border border-white/15 backdrop-blur-xs rounded-xl px-3.5 py-2 text-center md:text-right">
                <p className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider flex items-center justify-center md:justify-end gap-1">
                  <Wallet className="w-3 h-3" />
                  <span>{isBn ? 'ক্যাশব্যাক ওয়ালেট' : 'Wallet'}</span>
                </p>
                <p className="text-base sm:text-lg font-black text-emerald-300 font-mono mt-0.5">
                  {formatPrice(userProfile.walletBalance || 250)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* NAVIGATION TABS BAR */}
        <div className="flex items-center gap-1 border-b border-slate-200 bg-slate-50 px-3 sm:px-6 pt-2 overflow-x-auto text-xs sm:text-sm font-bold scrollbar-none shrink-0">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-3 sm:px-4 border-b-2 flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'orders'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>{isBn ? `আমার সমস্ত অর্ডার (${myOrders.length})` : `My Orders (${myOrders.length})`}</span>
            {pendingOrders.length > 0 && (
              <span className="bg-amber-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full animate-pulse shadow-2xs">
                {pendingOrders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-3 sm:px-4 border-b-2 flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'profile'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>{isBn ? 'ব্যক্তিগত তথ্য ও প্রোফাইল' : 'Profile Details'}</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`pb-3 px-3 sm:px-4 border-b-2 flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'addresses'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>{isBn ? `ডেলিভারি ঠিকানা (${userProfile.savedAddresses.length})` : `Addresses (${userProfile.savedAddresses.length})`}</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`pb-3 px-3 sm:px-4 border-b-2 flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'payments'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>{isBn ? 'বিকাশ ও পেমেন্ট হিস্ট্রি' : 'Payments & bKash'}</span>
          </button>

          <button
            onClick={() => setActiveTab('rewards')}
            className={`pb-3 px-3 sm:px-4 border-b-2 flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'rewards'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>{isBn ? 'রিওয়ার্ড ও কয়েন' : 'Rewards'}</span>
          </button>
        </div>

        {/* TAB CONTENTS */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* SUCCESS MESSAGE BANNER */}
          {saveSuccessMsg && (
            <div className="p-3 bg-emerald-600 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>{isBn ? 'আপনার প্রোফাইল তথ্য সফলভাবে সংরক্ষণ করা হয়েছে!' : 'Profile updated successfully!'}</span>
            </div>
          )}

          {/* TAB 1: MY ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <Package className="w-4 h-4 text-rose-600" />
                    <span>{isBn ? 'আমার সমস্ত অর্ডার ও লাইভ স্ট্যাটাস' : 'My Purchase Orders'}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isBn 
                      ? 'অর্ডার এপ্রুভ হয়েছে নাকি অপেক্ষমান আছে তা সরাসরি এখান থেকে চেক করুন।' 
                      : 'Check real-time fulfillment status of all your orders.'}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-full">
                    {myOrders.length} {isBn ? 'টি মোট অর্ডার' : 'Total'}
                  </span>
                  {pendingOrders.length > 0 && (
                    <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full">
                      {pendingOrders.length} {isBn ? 'টি পেন্ডিং' : 'Pending'}
                    </span>
                  )}
                  {approvedOrders.length > 0 && (
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full">
                      {approvedOrders.length} {isBn ? 'টি এপ্রুভড' : 'Approved'}
                    </span>
                  )}
                </div>
              </div>

              {myOrders.length === 0 ? (
                <div className="py-16 text-center text-slate-400 space-y-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <Package className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-slate-700 text-sm">
                    {isBn ? 'এখনো কোনো অর্ডার নেই' : 'No orders found'}
                  </h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    {isBn 
                      ? 'স্মার্টশপবিডি থেকে আপনার পছন্দের পাঞ্জাবি, শার্ট বা পণ্যটি অর্ডার করুন।' 
                      : 'Browse our exclusive catalog and place your first order.'}
                  </p>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                  >
                    {isBn ? 'শপে গিয়ে কেনাকাটা করুন' : 'Start Shopping'}
                  </button>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {myOrders.map((ord) => {
                    const isPending = ord.status === 'Pending';
                    const isApproved = ord.status === 'Approved' || ord.status === 'Confirmed';
                    const isShipped = ord.status === 'Shipped';
                    const isDelivered = ord.status === 'Delivered';
                    const isCancelled = ord.status === 'Cancelled';

                    return (
                      <div 
                        key={ord.id}
                        className={`p-4 sm:p-5 rounded-2xl border transition space-y-3.5 ${
                          isPending 
                            ? 'bg-amber-50/40 border-amber-200' 
                            : isApproved 
                            ? 'bg-emerald-50/40 border-emerald-200' 
                            : isCancelled 
                            ? 'bg-rose-50/40 border-rose-200' 
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        {/* Top Order Row */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2.5 py-0.5 rounded-md">
                              {ord.id}
                            </span>
                            <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              {new Date(ord.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          {/* Status Pill */}
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs ${
                              isPending 
                                ? 'bg-amber-500 text-white' 
                                : isApproved 
                                ? 'bg-emerald-600 text-white' 
                                : isShipped 
                                ? 'bg-blue-600 text-white' 
                                : isDelivered 
                                ? 'bg-purple-600 text-white' 
                                : 'bg-rose-600 text-white'
                            }`}>
                              {isPending && <Clock className="w-3.5 h-3.5 animate-pulse" />}
                              {isApproved && <CheckCircle2 className="w-3.5 h-3.5" />}
                              {isShipped && <Truck className="w-3.5 h-3.5" />}
                              {isDelivered && <Check className="w-3.5 h-3.5" />}
                              {isCancelled && <XCircle className="w-3.5 h-3.5" />}
                              <span>
                                {isPending ? (isBn ? 'পেন্ডিং (অপেক্ষমান)' : 'Pending') :
                                 isApproved ? (isBn ? 'এপ্রুভড (অনুমোদিত)' : 'Approved') :
                                 isShipped ? (isBn ? 'কুরিয়ারে প্রেরিত' : 'Shipped') :
                                 isDelivered ? (isBn ? 'ডেলিভারি সম্পন্ন' : 'Delivered') :
                                 (isBn ? 'বাতিল (Cancelled)' : 'Cancelled')}
                              </span>
                            </span>

                            {/* Live Track Button */}
                            <button
                              onClick={() => {
                                onClose();
                                onTrackOrder(ord.id);
                              }}
                              className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-300 font-bold text-xs rounded-lg transition flex items-center gap-1 cursor-pointer shadow-2xs"
                              title="অর্ডারটি লাইভ ট্র্যাক করুন"
                            >
                              <span>{isBn ? 'ট্র্যাক করুন' : 'Track'}</span>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                            </button>
                          </div>
                        </div>

                        {/* Order Items Previews */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                          {ord.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-2.5 p-2 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
                              <img 
                                src={item.product.image} 
                                alt={item.product.nameBn} 
                                className="w-12 h-12 rounded-lg object-cover border border-slate-100 shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="font-bold text-slate-900 text-xs truncate">
                                  {item.product.nameBn}
                                </p>
                                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                                  <span>x{item.quantity}</span>
                                  {item.selectedSize && <span className="bg-slate-100 px-1 rounded text-[10px] font-bold">{item.selectedSize}</span>}
                                  {item.selectedColor && <span className="bg-slate-100 px-1 rounded text-[10px]">{item.selectedColor}</span>}
                                </div>
                                <p className="text-xs font-black text-rose-700 mt-0.5">
                                  {formatPrice(item.product.price * item.quantity)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order Financials & Payment summary */}
                        <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <div className="space-y-0.5">
                            <span className="text-slate-500">{isBn ? 'ডেলিভারি ঠিকানা:' : 'Address:'}</span>
                            <p className="font-bold text-slate-800">{ord.address}, {ord.district}</p>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <span className="text-slate-500 text-[11px] uppercase font-bold">
                                {ord.paymentMethod.toUpperCase()} {ord.trxId ? `(Trx: ${ord.trxId})` : ''}
                              </span>
                              <p className="font-black text-rose-700 text-sm sm:text-base">
                                {formatPrice(ord.total)}
                              </p>
                            </div>

                            {onViewOrderSuccess && (
                              <button
                                onClick={() => {
                                  onClose();
                                  onViewOrderSuccess(ord);
                                }}
                                className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold transition text-xs"
                                title="ইনভয়েস স্লিপ দেখুন"
                              >
                                {isBn ? 'ইনভয়েস' : 'Invoice'}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: EDIT PROFILE */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    {isBn ? 'ব্যক্তিগত তথ্য ও প্রোফাইল এডিট' : 'Personal Information'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isBn ? 'আপনার নাম, ফোন নম্বর, ইমেইল ও প্রোফাইল ছবি আপডেট করুন।' : 'Update your personal contact details and profile picture.'}
                  </p>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isBn ? 'তথ্য সেভ করুন' : 'Save Changes'}</span>
                </button>
              </div>

              {/* Avatar Picker */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <label className="block text-xs font-bold text-slate-700">
                  {isBn ? 'প্রোফাইল ছবি নির্বাচন অথবা গ্যালারি থেকে আপলোড করুন:' : 'Choose Avatar or Upload from Gallery:'}
                </label>

                <div className="flex flex-wrap items-center gap-3">
                  {PRESET_AVATARS.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setFormData({ ...formData, avatarUrl: url })}
                      className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition cursor-pointer ${
                        formData.avatarUrl === url
                          ? 'border-rose-600 ring-2 ring-rose-400 scale-105'
                          : 'border-slate-300 hover:border-slate-400 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt={`Avatar ${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-12 px-3 rounded-xl border border-dashed border-rose-400 bg-rose-50 text-rose-700 hover:bg-rose-100 transition flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    <span>{isBn ? 'গ্যালারি থেকে ছবি নিন' : 'Upload from Device'}</span>
                  </button>
                </div>
              </div>

              {/* Form Inputs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isBn ? 'পূর্ণ নাম *' : 'Full Name *'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="মোঃ নাহিদ ইসলাম"
                      className="w-full p-2.5 pl-9 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 font-bold text-slate-900"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isBn ? 'মোবাইল ফোন নম্বর * (অর্ডারের জন্য)' : 'Phone Number *'}
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="01784315047"
                      className="w-full p-2.5 pl-9 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono font-bold text-slate-900"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isBn ? 'ইমেইল অ্যাড্রেস' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="mdnahidislam843150@gmail.com"
                      className="w-full p-2.5 pl-9 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-900"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isBn ? 'লিঙ্গ (Gender)' : 'Gender'}
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-900 cursor-pointer"
                  >
                    <option value="male">{isBn ? 'পুরুষ (Male)' : 'Male'}</option>
                    <option value="female">{isBn ? 'মহিলা (Female)' : 'Female'}</option>
                    <option value="other">{isBn ? 'অন্যান্য (Other)' : 'Other'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isBn ? 'জন্ম তারিখ (ঐচ্ছিক - জন্মদিনের বিশেষ ছাড়ের জন্য)' : 'Date of Birth (Optional)'}
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-900 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isBn ? 'মেম্বারশিপ টাইপ' : 'Membership Level'}
                  </label>
                  <div className="p-2.5 bg-slate-100 rounded-xl border border-slate-200 text-slate-700 font-bold flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-amber-800">
                      <Award className="w-4 h-4 text-amber-500" />
                      <span>{userProfile.membershipTier || 'VIP Premium'}</span>
                    </span>
                    <span className="text-[10px] bg-amber-500 text-white font-bold px-2 py-0.5 rounded-full">
                      ACTIVE
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{isBn ? 'প্রোফাইল পরিবর্তন সংরক্ষণ করুন' : 'Save Profile Details'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: SAVED ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    {isBn ? 'সংরক্ষিত ডেলিভারি ঠিকানাসমূহ' : 'Saved Delivery Addresses'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isBn ? 'এখানে ঠিকানা সেভ রাখলে চেকআউটের সময় ১-ক্লিকে অর্ডার সম্পন্ন হবে।' : 'Manage saved home and office delivery addresses for fast 1-click checkout.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddingAddress(!isAddingAddress)}
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAddingAddress ? (isBn ? 'বাতিল' : 'Cancel') : (isBn ? 'নতুন ঠিকানা যোগ' : 'Add New')}</span>
                </button>
              </div>

              {/* Add Address Form */}
              {isAddingAddress && (
                <form onSubmit={handleAddAddress} className="p-4 bg-slate-50 border border-rose-200 rounded-2xl space-y-3 animate-in fade-in">
                  <h4 className="font-bold text-xs text-slate-900 uppercase">
                    {isBn ? 'নতুন ডেলিভারি ঠিকানা দিন:' : 'Enter New Address Details:'}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">{isBn ? 'ঠিকানার ধরন' : 'Label'}</label>
                      <select
                        value={newAddrLabel}
                        onChange={(e) => setNewAddrLabel(e.target.value as any)}
                        className="w-full p-2 bg-white border border-slate-300 rounded-xl"
                      >
                        <option value="Home">{isBn ? 'বাসার ঠিকানা (Home)' : 'Home'}</option>
                        <option value="Office">{isBn ? 'অফিসের ঠিকানা (Office)' : 'Office'}</option>
                        <option value="Other">{isBn ? 'অন্যান্য (Other)' : 'Other'}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">{isBn ? 'জেলা *' : 'District *'}</label>
                      <select
                        value={newAddrDistrict}
                        onChange={(e) => setNewAddrDistrict(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-300 rounded-xl"
                      >
                        <option value="ঢাকা (Dhaka)">ঢাকা (Dhaka)</option>
                        <option value="চট্টগ্রাম (Chattogram)">চট্টগ্রাম (Chattogram)</option>
                        <option value="সিলেট (Sylhet)">সিলেট (Sylhet)</option>
                        <option value="রাজশাহী (Rajshahi)">রাজশাহী (Rajshahi)</option>
                        <option value="খুলনা (Khulna)">খুলনা (Khulna)</option>
                        <option value="বরিশাল (Barishal)">বরিশাল (Barishal)</option>
                        <option value="রংপুর (Rangpur)">রংপুর (Rangpur)</option>
                        <option value="ময়মনসিংহ (Mymensingh)">ময়মনসিংহ (Mymensingh)</option>
                        <option value="অন্যান্য জেলা (All Bangladesh)">অন্যান্য জেলা (All Bangladesh)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">{isBn ? 'থানা / শহর *' : 'Thana / City *'}</label>
                      <input
                        type="text"
                        required
                        value={newAddrThana}
                        onChange={(e) => setNewAddrThana(e.target.value)}
                        placeholder="মিরপুর / ধানমন্ডি / উত্তরা"
                        className="w-full p-2 bg-white border border-slate-300 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">{isBn ? 'পূর্ণ ঠিকানা (বাসা/রোড নম্বর/ল্যান্ডমার্ক) *' : 'Full Street Address *'}</label>
                    <textarea
                      required
                      rows={2}
                      value={newAddrStreet}
                      onChange={(e) => setNewAddrStreet(e.target.value)}
                      placeholder="বাসা #১২, রোড #০৪, ব্লক-ডি..."
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="px-3 py-1.5 bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                    >
                      {isBn ? 'বাতিল' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-rose-600 text-white font-bold text-xs rounded-xl"
                    >
                      {isBn ? 'ঠিকানা যুক্ত করুন' : 'Save Address'}
                    </button>
                  </div>
                </form>
              )}

              {/* Addresses List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {userProfile.savedAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`p-4 rounded-2xl border transition relative space-y-2.5 ${
                      addr.isDefault 
                        ? 'bg-rose-50/50 border-rose-300 ring-1 ring-rose-200 shadow-xs' 
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-600" />
                        <span>{addr.labelBn || addr.label}</span>
                      </span>

                      {addr.isDefault ? (
                        <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                          {isBn ? 'ডিফল্ট' : 'Default'}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSetDefaultAddress(addr.id)}
                          className="text-[11px] text-slate-500 hover:text-rose-600 font-bold transition"
                        >
                          {isBn ? 'ডিফল্ট করুন' : 'Set Default'}
                        </button>
                      )}
                    </div>

                    <p className="text-xs font-semibold text-slate-800">
                      {addr.district} {addr.thanaCity ? `(${addr.thanaCity})` : ''}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {addr.streetAddress}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400 text-[11px]">
                        {isBn ? 'হোম ডেলিভারি উপযোগী' : 'Standard Delivery'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition"
                        title="ঠিকানাটি মুছুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PAYMENTS & BKASH */}
          {activeTab === 'payments' && (
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="font-extrabold text-slate-900 text-base">
                  {isBn ? 'বিকাশ ও পেমেন্ট হিস্ট্রি' : 'Payment History & Verification'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isBn ? 'আপনার অর্ডারের বিকাশ TrxID ও পেমেন্ট স্ট্যাটাস নিচে সংরক্ষিত আছে।' : 'Track all bKash Send Money, COD, and transaction details.'}
                </p>
              </div>

              <div className="p-4 bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 rounded-2xl border border-pink-200 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-pink-900">
                  <CreditCard className="w-4 h-4 text-pink-600" />
                  <span>{isBn ? 'বিকাশ পেমেন্ট সিকিউরিটি ও ভেরিফিকেশন' : 'Secure bKash Transactions'}</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {isBn 
                    ? 'স্মার্টশপবিডি-তে বিকাশ বা নগদ পেমেন্ট সম্পন্ন হলে অ্যাডমিন TrxID যাচাই করে সরাসরি অর্ডার এপ্রুভ করে থাকেন। কোনো সমস্যা হলে আমাদের হটলাইনে কল দিন।' 
                    : 'Every bKash Send Money order is verified with TrxID before instant fulfillment.'}
                </p>
              </div>

              {/* Payments from orders */}
              <div className="space-y-2.5">
                {myOrders.map((ord) => (
                  <div key={ord.id} className="p-3.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                        ord.paymentMethod === 'bkash' ? 'bg-pink-100 text-pink-700' :
                        ord.paymentMethod === 'nagad' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {ord.paymentMethod === 'bkash' ? 'bK' : ord.paymentMethod === 'nagad' ? 'নগদ' : 'COD'}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">
                          {ord.paymentMethod.toUpperCase()} — {ord.id}
                        </p>
                        <p className="text-slate-500 text-[11px] font-mono">
                          {ord.trxId ? `TrxID: ${ord.trxId}` : (isBn ? 'ক্যাশ অন ডেলিভারি' : 'Cash on Delivery')}
                          {ord.senderPhone ? ` • প্রেরক: ${ord.senderPhone}` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-extrabold text-slate-900 text-sm">{formatPrice(ord.total)}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                        ord.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                        ord.status === 'Cancelled' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ord.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: REWARDS & WALLET */}
          {activeTab === 'rewards' && (
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="font-extrabold text-slate-900 text-base">
                  {isBn ? 'স্মার্টশপবিডি রিওয়ার্ড ও কয়েন প্রোগ্রাম' : 'SmartShop Rewards & Wallet'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isBn ? 'প্রতিটি কেনাকাটায় কয়েন অর্জন করুন এবং ডিসকাউন্ট কুপন হিসেবে ব্যবহার করুন।' : 'Earn SmartCoins on every order to redeem for instant discount vouchers.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-2xl shadow-md space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-100 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>{isBn ? 'স্মার্ট পয়েন্ট ব্যালেন্স' : 'SmartCoins Available'}</span>
                  </p>
                  <p className="text-3xl font-black font-mono">
                    {userProfile.smartPoints || 450} <span className="text-sm font-normal">কয়েন</span>
                  </p>
                  <p className="text-xs text-amber-100">
                    {isBn ? 'পরবর্তী কেনাকাটায় ১০০ কয়েন = ৳৫০ সমমূল্যের ছাড় পাওয়া যাবে।' : 'Redeemable on your upcoming checkout!'}
                  </p>
                </div>

                <div className="p-5 bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl shadow-md space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-100 flex items-center gap-1.5">
                    <Wallet className="w-4 h-4" />
                    <span>{isBn ? 'ক্যাশব্যাক ওয়ালেট' : 'Wallet Balance'}</span>
                  </p>
                  <p className="text-3xl font-black font-mono">
                    {formatPrice(userProfile.walletBalance || 250)}
                  </p>
                  <p className="text-xs text-emerald-100">
                    {isBn ? 'বিকাশ ক্যাশব্যাক ও প্রোমোশন ব্যালেন্স যেকোনো অর্ডারে ব্যবহার্য।' : 'Instant store credit ready to spend.'}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
                <h4 className="font-bold text-slate-900">{isBn ? '🎯 কীভাবে পয়েন্ট অর্জন করবেন?' : 'How to earn points:'}</h4>
                <ul className="space-y-1 text-slate-600 list-disc list-inside">
                  <li>{isBn ? 'প্রতি ৳১০০ কেনাকাটায় ৫টি স্মার্ট কয়েন জমা হয়।' : 'Earn 5 coins for every ৳100 spent.'}</li>
                  <li>{isBn ? 'বিকাশ বা নগদে অগ্রিম পেমেন্ট করলে ডাবল পয়েন্ট!' : 'Double points on bKash advance payments.'}</li>
                  <li>{isBn ? 'বন্ধুদের রেফার করলে অতিরিক্ত ৫০ পয়েন্ট উপহার।' : '50 bonus coins for referring friends.'}</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-medium">{isBn ? '১০০% নিরাপদ গ্রাহক তথ্য ও অ্যাকাউন্ট' : '100% Encrypted Customer Profile'}</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition cursor-pointer"
          >
            {isBn ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
