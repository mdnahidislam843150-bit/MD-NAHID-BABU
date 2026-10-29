import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, UserAddress, Order, Product, Coupon, SiteContent } from '../types';
import { compressImageFile } from '../utils/storage';
import { BANGLADESH_DISTRICTS } from '../data/mockProducts';
import { 
  User, 
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
  ArrowLeft,
  Wallet,
  Award,
  ChevronRight,
  Printer,
  Search,
  ExternalLink,
  QrCode,
  Tag,
  AlertCircle,
  Home,
  Briefcase,
  Share2,
  RefreshCw,
  LogIn,
  LogOut
} from 'lucide-react';

interface UserProfilePageProps {
  userProfile: UserProfile;
  onUpdateUserProfile: (updated: UserProfile) => void;
  orders: Order[];
  products: Product[];
  coupons: Coupon[];
  siteContent: SiteContent;
  language: 'bn' | 'en';
  currency: 'BDT' | 'USD';
  onBackToShop: () => void;
  onTrackOrder: (orderId: string) => void;
  onOpenAdminOrders?: () => void;
  isCustomerLoggedIn?: boolean;
  onOpenCustomerLogin?: () => void;
  onCustomerLogout?: () => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80'
];

export const UserProfilePage: React.FC<UserProfilePageProps> = ({
  userProfile,
  onUpdateUserProfile,
  orders,
  products,
  coupons,
  siteContent,
  language,
  currency,
  onBackToShop,
  onTrackOrder,
  onOpenAdminOrders,
  isCustomerLoggedIn = false,
  onOpenCustomerLogin,
  onCustomerLogout
}) => {
  const isBn = language === 'bn';
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses' | 'payments' | 'coupons' | 'digital-card'>('orders');

  // Profile Form state
  const [formData, setFormData] = useState({
    name: userProfile.name,
    phone: userProfile.phone,
    email: userProfile.email,
    gender: userProfile.gender || 'male',
    dateOfBirth: userProfile.dateOfBirth || '',
    avatarUrl: userProfile.avatarUrl || PRESET_AVATARS[0]
  });

  const [copiedId, setCopiedId] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'approved' | 'delivered'>('all');

  // Address modal/form state
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddrLabel, setNewAddrLabel] = useState<'Home' | 'Office' | 'Other'>('Home');
  const [newAddrDistrict, setNewAddrDistrict] = useState(BANGLADESH_DISTRICTS[0] || 'ঢাকা (Dhaka)');
  const [newAddrThana, setNewAddrThana] = useState('');
  const [newAddrStreet, setNewAddrStreet] = useState('');

  // Selected Order for Receipt modal
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Scroll to top when page opens
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const formatPrice = (bdtPrice: number) => {
    if (currency === 'USD') {
      return `$${(bdtPrice / 120).toFixed(2)}`;
    }
    return `৳${bdtPrice.toLocaleString('bn-BD')}`;
  };

  const handleCopyProfileId = () => {
    navigator.clipboard.writeText(userProfile.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2500);
  };

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2500);
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
    setTimeout(() => setSaveSuccessMsg(false), 3500);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedData = await compressImageFile(file, 400, 400, 0.75);
        setFormData((prev) => ({ ...prev, avatarUrl: compressedData }));
        onUpdateUserProfile({ ...userProfile, avatarUrl: compressedData });
        setSaveSuccessMsg(true);
        setTimeout(() => setSaveSuccessMsg(false), 3500);
      } catch {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            const newAvatar = reader.result as string;
            setFormData((prev) => ({ ...prev, avatarUrl: newAvatar }));
            onUpdateUserProfile({ ...userProfile, avatarUrl: newAvatar });
            setSaveSuccessMsg(true);
            setTimeout(() => setSaveSuccessMsg(false), 3500);
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

  // Orders calculations
  const myOrders = orders;
  const pendingOrders = myOrders.filter((o) => o.status === 'Pending');
  const approvedOrders = myOrders.filter((o) => o.status === 'Approved' || o.status === 'Confirmed');
  const deliveredOrders = myOrders.filter((o) => o.status === 'Delivered');

  const filteredOrders = myOrders.filter((order) => {
    if (orderFilter === 'pending') return order.status === 'Pending';
    if (orderFilter === 'approved') return order.status === 'Approved' || order.status === 'Confirmed';
    if (orderFilter === 'delivered') return order.status === 'Delivered';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-800 pb-20 animate-in fade-in duration-300">
      {/* Hidden File Input for Avatar Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />

      {/* TOP BREADCRUMB & BACK NAVIGATION BAR */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <button
              onClick={onBackToShop}
              className="inline-flex items-center gap-1.5 font-bold text-slate-700 hover:text-rose-600 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-rose-600" />
              <span>{isBn ? 'শপ পেজে ফিরে যান' : 'Back to Shop'}</span>
            </button>
            <span className="text-slate-300">/</span>
            <span className="text-slate-500 hidden sm:inline">
              {isBn ? 'গ্রাহক ড্যাশবোর্ড' : 'Customer Account'}
            </span>
            <span className="text-slate-300 hidden sm:inline">/</span>
            <span className="font-extrabold text-slate-900 bg-rose-50 text-rose-700 px-2 py-0.5 rounded-md border border-rose-200">
              {isBn ? 'আমার প্রোফাইল আইডি ও অ্যাকাউন্ট' : 'My Profile ID & Account'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyProfileId}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
              title="প্রোফাইল আইডি কপি করুন"
            >
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>{userProfile.id}</span>
              {copiedId ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>

            {isCustomerLoggedIn && onCustomerLogout && (
              <button
                onClick={onCustomerLogout}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-bold text-xs transition cursor-pointer flex items-center gap-1.5 border border-slate-200 active:scale-95"
                title="কাষ্টমার একাউন্ট থেকে লগআউট করুন"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600" />
                <span className="hidden sm:inline">{isBn ? 'লগআউট' : 'Logout'}</span>
              </button>
            )}

            {!isCustomerLoggedIn && onOpenCustomerLogin && (
              <button
                onClick={onOpenCustomerLogin}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs active:scale-95"
                title="কাষ্টমার অ্যাকাউন্টে লগইন করুন"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{isBn ? 'লগইন' : 'Login'}</span>
              </button>
            )}

            <button
              onClick={onBackToShop}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm transition shadow-xs cursor-pointer active:scale-95 flex items-center gap-1.5"
            >
              <span>{isBn ? 'কেনাকাটা চালিয়ে যান' : 'Continue Shopping'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        
        {/* Guest Customer Notice Banner */}
        {!isCustomerLoggedIn && (
          <div className="bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-indigo-500/10 border-2 border-amber-400/80 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <LogIn className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  {isBn ? 'কাষ্টমার অ্যাকাউন্টে লগইন করুন' : 'Customer Account Login'}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  {isBn 
                    ? 'আপনার ব্যক্তিগত অর্ডার ট্র্যাক করতে, সংরক্ষিত ডেলিভারি ঠিকানা ব্যবহার করতে ও ২০০ রিওয়ার্ড পয়েন্ট পেতে লগইন করুন।' 
                    : 'Log in to view your orders, use saved addresses, and collect reward points.'}
                </p>
              </div>
            </div>
            {onOpenCustomerLogin && (
              <button
                onClick={onOpenCustomerLogin}
                className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-rose-600/20 transition active:scale-95 cursor-pointer flex items-center justify-center gap-2 shrink-0"
              >
                <LogIn className="w-4 h-4 text-amber-200" />
                <span>{isBn ? 'কাষ্টমার লগইন / রেজিস্টার' : 'Sign In / Register'}</span>
              </button>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* 1. LUXURY DIGITAL MEMBERSHIP ID CARD HERO BANNER */}
        {/* ============================================================== */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white shadow-2xl border border-slate-800">
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40" />

          <div className="relative z-10 p-6 sm:p-8 md:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Avatar & Personal ID Info (7 Cols) */}
              <div className="lg:col-span-7 flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 text-center sm:text-left">
                {/* Avatar with Camera Changer */}
                <div className="relative group shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-white/40 shadow-2xl bg-slate-800 ring-4 ring-rose-500/30">
                    <img
                      src={formData.avatarUrl || userProfile.avatarUrl || PRESET_AVATARS[0]}
                      alt={userProfile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-lg border-2 border-slate-950 transition active:scale-90 cursor-pointer"
                    title={isBn ? 'গ্যালারি বা ক্যামেরা থেকে প্রোফাইল ছবি আপলোড করুন' : 'Change Profile Photo'}
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                {/* Identity Information */}
                <div className="space-y-2.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                      {userProfile.name}
                    </h1>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-slate-950 font-black text-xs shadow-md">
                      <ShieldCheck className="w-3.5 h-3.5 text-slate-950 fill-amber-300" />
                      <span>{userProfile.membershipTier || 'VIP'} {isBn ? 'গোল্ড মেম্বার' : 'Member'}</span>
                    </span>
                  </div>

                  {/* PROMINENT USER PROFILE ID BADGE */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-900/90 to-indigo-900/90 border border-emerald-400/40 px-3.5 py-1.5 rounded-xl shadow-inner backdrop-blur-md">
                      <span className="text-[11px] text-emerald-300 font-extrabold uppercase tracking-wider">
                        {isBn ? 'ইউজার আইডি:' : 'Customer ID:'}
                      </span>
                      <span className="font-mono text-base font-black text-white tracking-wider">
                        {userProfile.id}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyProfileId}
                        className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-emerald-300 hover:text-white transition cursor-pointer active:scale-95"
                        title="আইডি কপি করুন"
                      >
                        {copiedId ? (
                          <span className="text-[10px] text-emerald-400 font-bold px-1">✓ কপি হয়েছে!</span>
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <span className="text-slate-400 hidden sm:inline">•</span>

                    <span className="text-xs text-slate-300 flex items-center gap-1.5 font-mono">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{userProfile.phone}</span>
                    </span>
                  </div>

                  {/* Email & Join Date */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-rose-400" />
                      <span className="text-slate-300">{userProfile.email}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isBn ? 'মেম্বারশিপ চালু: ' : 'Member Since: '} <strong>{userProfile.memberSince || '2024'}</strong></span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Digital Member Card Graphics (5 Cols) */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div className="w-full max-w-sm rounded-2xl p-4 sm:p-5 bg-white/10 border border-white/20 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl" />
                  
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/15">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-slate-950 font-black text-xs shadow-xs">
                        👑
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-amber-300 uppercase tracking-widest leading-none">
                          SMARTSHOP BD
                        </p>
                        <p className="text-xs font-black text-white leading-none mt-1">
                          {isBn ? 'ডিজিটাল ভিআইপি কার্ড' : 'VIP Member Card'}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                      ACTIVE
                    </span>
                  </div>

                  {/* Card Chip & Hologram simulation */}
                  <div className="py-3 flex items-center justify-between">
                    <div className="w-10 h-7 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-yellow-600 border border-amber-100/50 shadow-inner flex items-center justify-around px-1">
                      <div className="w-1 h-full bg-amber-600/30 rounded-xs" />
                      <div className="w-1 h-full bg-amber-600/30 rounded-xs" />
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-slate-300 uppercase tracking-wider">{isBn ? 'ব্যালেন্স ও পয়েন্ট' : 'Rewards'}</p>
                      <p className="font-mono text-sm font-black text-amber-300">
                        {userProfile.smartPoints || 850} pts
                      </p>
                    </div>
                  </div>

                  {/* Card Number */}
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-400 font-mono tracking-widest">
                      MEMBERSHIP ACCOUNT NUMBER
                    </p>
                    <p className="font-mono text-base sm:text-lg font-black text-white tracking-widest flex items-center justify-between">
                      <span>{userProfile.id}</span>
                      <QrCode className="w-5 h-5 text-slate-300" />
                    </p>
                  </div>

                  {/* Card Footer Barcode representation */}
                  <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center justify-between text-[10px] text-slate-300">
                    <span className="font-medium truncate max-w-[170px]">{userProfile.name}</span>
                    <span className="font-mono text-emerald-400 font-bold">100% VERIFIED</span>
                  </div>
                </div>
              </div>

            </div>

            {/* QUICK STATS METRIC TILES */}
            <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              
              {/* Stat 1: Total Orders */}
              <div 
                onClick={() => { setActiveTab('orders'); setOrderFilter('all'); }}
                className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-3 sm:p-3.5 transition cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-bold">{isBn ? 'মোট অর্ডার' : 'Total Orders'}</span>
                  <Package className="w-4 h-4 text-rose-400 group-hover:scale-110 transition" />
                </div>
                <p className="text-xl sm:text-2xl font-black text-white font-mono mt-1">
                  {myOrders.length}
                </p>
              </div>

              {/* Stat 2: Pending Approval */}
              <div 
                onClick={() => { setActiveTab('orders'); setOrderFilter('pending'); }}
                className="bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-2xl p-3 sm:p-3.5 transition cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-amber-300 font-bold">{isBn ? 'পেন্ডিং অর্ডার' : 'Pending'}</span>
                  <Clock className="w-4 h-4 text-amber-400 group-hover:scale-110 transition" />
                </div>
                <p className="text-xl sm:text-2xl font-black text-amber-300 font-mono mt-1">
                  {pendingOrders.length}
                </p>
              </div>

              {/* Stat 3: Approved / Confirmed */}
              <div 
                onClick={() => { setActiveTab('orders'); setOrderFilter('approved'); }}
                className="bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-2xl p-3 sm:p-3.5 transition cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-emerald-300 font-bold">{isBn ? 'অনুমোদিত' : 'Approved'}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition" />
                </div>
                <p className="text-xl sm:text-2xl font-black text-emerald-300 font-mono mt-1">
                  {approvedOrders.length}
                </p>
              </div>

              {/* Stat 4: Delivered */}
              <div 
                onClick={() => { setActiveTab('orders'); setOrderFilter('delivered'); }}
                className="bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-2xl p-3 sm:p-3.5 transition cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-blue-300 font-bold">{isBn ? 'ডেলিভার্ড' : 'Delivered'}</span>
                  <Truck className="w-4 h-4 text-blue-400 group-hover:scale-110 transition" />
                </div>
                <p className="text-xl sm:text-2xl font-black text-blue-300 font-mono mt-1">
                  {deliveredOrders.length}
                </p>
              </div>

              {/* Stat 5: Smart Points */}
              <div 
                onClick={() => setActiveTab('payments')}
                className="bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 rounded-2xl p-3 sm:p-3.5 transition cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-amber-300 font-bold">{isBn ? 'স্মার্ট পয়েন্ট' : 'SmartPoints'}</span>
                  <Sparkles className="w-4 h-4 text-amber-400 group-hover:scale-110 transition" />
                </div>
                <p className="text-xl sm:text-2xl font-black text-amber-300 font-mono mt-1">
                  {userProfile.smartPoints || 850} <span className="text-xs text-amber-200 font-normal">pts</span>
                </p>
              </div>

              {/* Stat 6: Wallet Balance */}
              <div 
                onClick={() => setActiveTab('payments')}
                className="bg-emerald-400/10 hover:bg-emerald-400/20 border border-emerald-400/30 rounded-2xl p-3 sm:p-3.5 transition cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-emerald-300 font-bold">{isBn ? 'ক্যাশব্যাক' : 'Cashback'}</span>
                  <Wallet className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition" />
                </div>
                <p className="text-xl sm:text-2xl font-black text-emerald-300 font-mono mt-1">
                  {formatPrice(userProfile.walletBalance || 320)}
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* ============================================================== */}
        {/* 2. MAIN DASHBOARD CONTENT GRID (SIDEBAR + CONTENT TABS) */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT SIDEBAR NAVIGATION (3 Cols) */}
          <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 p-4 shadow-sm space-y-2 sticky top-20">
            <p className="text-[11px] font-black uppercase text-slate-400 tracking-wider px-3 pt-2">
              {isBn ? 'অ্যাকাউন্ট মেন্যু' : 'Account Navigation'}
            </p>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4" />
                <span>{isBn ? 'আমার অর্ডারসমূহ' : 'My Orders'}</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-black ${
                activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                {myOrders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Edit3 className="w-4 h-4" />
                <span>{isBn ? 'ব্যক্তিগত তথ্য ও প্রোফাইল' : 'Profile & Info'}</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                activeTab === 'addresses'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4" />
                <span>{isBn ? 'সংরক্ষিত ডেলিভারি ঠিকানা' : 'Address Book'}</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-black ${
                activeTab === 'addresses' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                {userProfile.savedAddresses.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('payments')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                activeTab === 'payments'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-4 h-4" />
                <span>{isBn ? 'বিকাশ নম্বর ও ওয়ালেট' : 'Payments & Wallet'}</span>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                {formatPrice(userProfile.walletBalance || 320)}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('coupons')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                activeTab === 'coupons'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Tag className="w-4 h-4" />
                <span>{isBn ? 'আমার কুপন ও ভাউচার' : 'Coupons & Vouchers'}</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-black ${
                activeTab === 'coupons' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
              }`}>
                {coupons.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('digital-card')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                activeTab === 'digital-card'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <QrCode className="w-4 h-4" />
                <span>{isBn ? 'ডিজিটাল আইডি ও নিরাপত্তা' : 'Digital ID & Security'}</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>

            <div className="pt-3 border-t border-slate-100">
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 text-center space-y-1.5">
                <p className="text-[11px] text-slate-500 font-bold">
                  {isBn ? 'সহায়তা প্রয়োজন?' : 'Need Help?'}
                </p>
                <p className="text-xs font-mono font-black text-rose-600">
                  {siteContent.hotline}
                </p>
                <p className="text-[10px] text-slate-400">
                  {isBn ? 'সকাল ৯টা - রাত ১১টা' : '9 AM - 11 PM'}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT MAIN PANEL (9 Cols) */}
          <div className="lg:col-span-9 bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-sm min-h-[500px]">
            
            {/* SUCCESS BANNER */}
            {saveSuccessMsg && (
              <div className="mb-6 p-4 bg-emerald-600 text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-3 shadow-lg shadow-emerald-600/20 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
                <span>{isBn ? 'আপনার প্রোফাইল তথ্য সফলভাবে সেভ করা হয়েছে!' : 'Your profile changes were saved successfully!'}</span>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 1: MY ORDERS & REAL-TIME STATUS */}
            {/* ============================================================== */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                      <Package className="w-5 h-5 text-rose-600" />
                      <span>{isBn ? 'আমার অর্ডারসমূহ ও লাইভ স্ট্যাটাস' : 'My Orders & Real-time Status'}</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      {isBn 
                        ? 'অর্ডার এপ্রুভ হয়েছে নাকি অপেক্ষমান আছে তা সরাসরি এখান থেকে চেক করুন।' 
                        : 'Track whether your order is Approved, Pending bKash verification, or Shipped.'}
                    </p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
                    <button
                      onClick={() => setOrderFilter('all')}
                      className={`px-3 py-1.5 rounded-full transition cursor-pointer ${
                        orderFilter === 'all'
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {isBn ? 'সমস্ত' : 'All'} ({myOrders.length})
                    </button>
                    <button
                      onClick={() => setOrderFilter('pending')}
                      className={`px-3 py-1.5 rounded-full transition cursor-pointer ${
                        orderFilter === 'pending'
                          ? 'bg-amber-500 text-white'
                          : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                      }`}
                    >
                      {isBn ? 'পেন্ডিং' : 'Pending'} ({pendingOrders.length})
                    </button>
                    <button
                      onClick={() => setOrderFilter('approved')}
                      className={`px-3 py-1.5 rounded-full transition cursor-pointer ${
                        orderFilter === 'approved'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      }`}
                    >
                      {isBn ? 'অনুমোদিত' : 'Approved'} ({approvedOrders.length})
                    </button>
                    <button
                      onClick={() => setOrderFilter('delivered')}
                      className={`px-3 py-1.5 rounded-full transition cursor-pointer ${
                        orderFilter === 'delivered'
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
                      }`}
                    >
                      {isBn ? 'ডেলিভার্ড' : 'Delivered'} ({deliveredOrders.length})
                    </button>
                  </div>
                </div>

                {filteredOrders.length === 0 ? (
                  <div className="py-16 text-center text-slate-400 space-y-3 bg-slate-50 rounded-3xl border border-slate-200">
                    <div className="w-16 h-16 rounded-2xl bg-white shadow-xs border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
                      <Package className="w-8 h-8 text-slate-400" />
                    </div>
                    <h4 className="font-extrabold text-slate-700 text-base">
                      {isBn ? 'এই ফিল্টারে কোনো অর্ডার পাওয়া যায়নি' : 'No orders in this category'}
                    </h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      {isBn 
                        ? 'স্মার্টশপবিডি থেকে আপনার পছন্দের শার্ট, টি-শার্ট বা পাঞ্জাবি অর্ডার করে সহজেই স্ট্যাটাস দেখুন।' 
                        : 'Explore our catalog and order fashion items to see them appear here.'}
                    </p>
                    <button
                      onClick={onBackToShop}
                      className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-rose-600/20 transition cursor-pointer"
                    >
                      {isBn ? 'শপে গিয়ে অর্ডার করুন' : 'Start Shopping Now'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredOrders.map((ord) => {
                      const isPending = ord.status === 'Pending';
                      const isApproved = ord.status === 'Approved' || ord.status === 'Confirmed';
                      const isShipped = ord.status === 'Shipped';
                      const isDelivered = ord.status === 'Delivered';
                      const isCancelled = ord.status === 'Cancelled';

                      return (
                        <div
                          key={ord.id}
                          className="rounded-2xl border border-slate-200 bg-white hover:border-slate-300 shadow-xs hover:shadow-md transition overflow-hidden"
                        >
                          {/* Order Header Row */}
                          <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-2.5">
                              <span className="font-mono text-sm font-black text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                                #{ord.id}
                              </span>
                              <span className="text-xs text-slate-500">
                                {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short', year: 'numeric' }) : 'আজ'}
                              </span>
                            </div>

                            {/* STATUS BADGE */}
                            <div className="flex items-center gap-2">
                              {isPending && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-white font-black text-xs shadow-xs animate-pulse">
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>{isBn ? 'অপেক্ষমান (পেন্ডিং)' : 'Pending Verification'}</span>
                                </span>
                              )}
                              {isApproved && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white font-black text-xs shadow-xs">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>{isBn ? 'অনুমোদিত (Approved)' : 'Order Approved'}</span>
                                </span>
                              )}
                              {isShipped && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-600 text-white font-black text-xs shadow-xs">
                                  <Truck className="w-3.5 h-3.5" />
                                  <span>{isBn ? 'ডেলিভারির পথে (Shipped)' : 'Shipped'}</span>
                                </span>
                              )}
                              {isDelivered && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600 text-white font-black text-xs shadow-xs">
                                  <Check className="w-3.5 h-3.5" />
                                  <span>{isBn ? 'ডেলিভারি সম্পন্ন (Delivered)' : 'Delivered'}</span>
                                </span>
                              )}
                              {isCancelled && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white font-black text-xs shadow-xs">
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>{isBn ? 'বাতিলকৃত (Cancelled)' : 'Cancelled'}</span>
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Order Body Details */}
                          <div className="p-4 sm:p-5 space-y-4">
                            {/* Items list */}
                            <div className="space-y-2">
                              {ord.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                  <img
                                    src={item.product.image}
                                    alt={item.product.nameBn}
                                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-slate-100 shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                                      {isBn ? item.product.nameBn : (item.product.name || item.product.nameBn)}
                                    </h4>
                                    <p className="text-[11px] text-slate-500">
                                      {item.selectedSize && <span>সাইজ: {item.selectedSize} • </span>}
                                      {item.selectedColor && <span>রং: {item.selectedColor} • </span>}
                                      <span>পরিমাণ: {item.quantity}টি</span>
                                    </p>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <span className="font-bold text-slate-900 text-xs sm:text-sm">
                                      {formatPrice(item.product.price * item.quantity)}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Payment & Delivery Summary Row */}
                            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-bold">
                                  পেমেন্ট: {ord.paymentMethod === 'bkash' ? 'বিকাশ (bKash)' : ord.paymentMethod === 'nagad' ? 'নগদ (Nagad)' : 'ক্যাশ অন ডেলিভারি'}
                                </span>
                                {ord.trxId && (
                                  <span className="bg-rose-50 text-rose-700 font-mono font-bold px-2.5 py-1 rounded-lg border border-rose-200">
                                    TrxID: {ord.trxId}
                                  </span>
                                )}
                                {ord.address && (
                                  <span className="text-slate-500 flex items-center gap-1 truncate max-w-xs">
                                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    <span className="truncate">{ord.address}</span>
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-3">
                                <span className="text-xs text-slate-500">{isBn ? 'সর্বমোট মূল্য:' : 'Total:'}</span>
                                <span className="text-base sm:text-lg font-black text-rose-600 font-mono">
                                  {formatPrice(ord.total)}
                                </span>
                              </div>
                            </div>

                            {/* Actions bar */}
                            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                              <button
                                onClick={() => onTrackOrder(ord.id)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-xs transition cursor-pointer active:scale-95"
                              >
                                <Search className="w-3.5 h-3.5" />
                                <span>{isBn ? '🔍 লাইভ স্ট্যাটাস ও ট্র্যাকিং দেখুন' : 'Track Order Status'}</span>
                              </button>

                              <button
                                onClick={() => setReceiptOrder(ord)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer active:scale-95"
                              >
                                <Printer className="w-3.5 h-3.5 text-slate-500" />
                                <span>{isBn ? 'রিসিট / চালান দেখুন' : 'View Invoice'}</span>
                              </button>
                            </div>

                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 2: PERSONAL INFORMATION & EDIT PROFILE */}
            {/* ============================================================== */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-slate-200">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-rose-600" />
                    <span>{isBn ? 'ব্যক্তিগত তথ্য ও প্রোফাইল এডিট' : 'Personal Details & Edit Profile'}</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {isBn 
                      ? 'আপনার নাম, মোবাইল নাম্বার, ইমেইল এবং প্রোফাইল ছবি সহজে আপডেট করুন।' 
                      : 'Update your official customer profile, contact information, and display avatar.'}
                  </p>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-6">
                  {/* Avatar Picker Section */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      {isBn ? 'প্রোফাইল ছবি পরিবর্তন করুন' : 'Change Profile Avatar'}
                    </label>

                    <div className="flex flex-wrap items-center gap-3">
                      {PRESET_AVATARS.map((avUrl, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, avatarUrl: avUrl }))}
                          className={`w-14 h-14 rounded-2xl overflow-hidden border-2 transition cursor-pointer ${
                            formData.avatarUrl === avUrl
                              ? 'border-rose-600 ring-2 ring-rose-500/40 scale-105'
                              : 'border-slate-200 hover:border-slate-400 opacity-80'
                          }`}
                        >
                          <img src={avUrl} alt="Avatar Preset" className="w-full h-full object-cover" />
                        </button>
                      ))}

                      {/* Custom Upload Button */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-3 rounded-2xl border-2 border-dashed border-rose-300 hover:border-rose-500 bg-rose-50/50 hover:bg-rose-50 text-rose-700 text-xs font-bold flex items-center gap-2 transition cursor-pointer"
                      >
                        <Camera className="w-4 h-4" />
                        <span>{isBn ? 'গ্যালারি থেকে ছবি নিন' : 'Upload Photo'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Input Fields Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Customer ID (Read-only copy) */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isBn ? 'গ্রাহক আইডি (Customer ID)' : 'Customer Profile ID'}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={userProfile.id}
                          readOnly
                          className="w-full pl-3.5 pr-20 py-2.5 rounded-xl bg-slate-100 border border-slate-300 font-mono font-bold text-slate-800 text-sm cursor-not-allowed"
                        />
                        <button
                          type="button"
                          onClick={handleCopyProfileId}
                          className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-slate-900 text-white font-mono text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
                        >
                          {copiedId ? '✓ কপি!' : 'কপি'}
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {isBn ? 'এই আইডিটি আপনার ইউনিক মেম্বারশিপ শনাক্তকারী।' : 'Unique identification code for customer support and orders.'}
                      </p>
                    </div>

                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isBn ? 'আপনার পূর্ণ নাম' : 'Full Name'} <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm font-semibold text-slate-800"
                        placeholder="আপনার নাম লিখুন..."
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isBn ? 'মোবাইল ফোন নম্বর (অর্ডার ও এসএমএস)' : 'Phone Number'} <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm font-mono font-bold text-slate-800"
                        placeholder="017xxxxxxxx"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isBn ? 'ইমেইল অ্যাড্রেস' : 'Email Address'}
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm font-medium text-slate-800"
                        placeholder="example@mail.com"
                      />
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isBn ? 'লিঙ্গ' : 'Gender'}
                      </label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData((prev) => ({ ...prev, gender: e.target.value as any }))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm font-semibold text-slate-800"
                      >
                        <option value="male">{isBn ? 'পুরুষ (Male)' : 'Male'}</option>
                        <option value="female">{isBn ? 'মহিলা (Female)' : 'Female'}</option>
                        <option value="other">{isBn ? 'অন্যান্য (Other)' : 'Other'}</option>
                      </select>
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isBn ? 'জন্ম তারিখ (বিশেষ জন্মদিনের ছাড়ের জন্য)' : 'Date of Birth'}
                      </label>
                      <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm font-medium text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                    <p className="text-xs text-slate-500">
                      {isBn ? 'তথ্য পরিবর্তন করে নিচে "সেভ করুন" এ ক্লিক করুন।' : 'Changes are stored securely in your browser account.'}
                    </p>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl shadow-md shadow-rose-600/30 transition flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isBn ? 'তথ্য সেভ করুন' : 'Save Changes'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 3: SAVED DELIVERY ADDRESS BOOK */}
            {/* ============================================================== */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-rose-600" />
                      <span>{isBn ? 'সংরক্ষিত ডেলিভারি ঠিকানা' : 'Saved Delivery Addresses'}</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      {isBn 
                        ? 'অর্ডার করার সময় দ্রুত সিলেক্ট করার জন্য ঠিকানা সংরক্ষণ করে রাখুন।' 
                        : 'Save home, office, and other addresses to prefill checkout instantly.'}
                    </p>
                  </div>

                  <button
                    onClick={() => setIsAddingAddress(!isAddingAddress)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-xs transition cursor-pointer active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isAddingAddress ? (isBn ? 'বাতিল করুন' : 'Cancel') : (isBn ? 'নতুন ঠিকানা যোগ করুন' : 'Add New Address')}</span>
                  </button>
                </div>

                {/* Add Address Form */}
                {isAddingAddress && (
                  <form onSubmit={handleAddAddress} className="p-5 bg-rose-50/40 rounded-2xl border border-rose-200 space-y-4 animate-in fade-in">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Plus className="w-4 h-4 text-rose-600" />
                      <span>{isBn ? 'নতুন ঠিকানা ফর্ম' : 'Add Delivery Address'}</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {isBn ? 'ঠিকানার ধরণ' : 'Type'}
                        </label>
                        <select
                          value={newAddrLabel}
                          onChange={(e) => setNewAddrLabel(e.target.value as any)}
                          className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold"
                        >
                          <option value="Home">{isBn ? 'বাসা (Home)' : 'Home'}</option>
                          <option value="Office">{isBn ? 'অফিস (Office)' : 'Office'}</option>
                          <option value="Other">{isBn ? 'অন্যান্য (Other)' : 'Other'}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {isBn ? 'জেলা (District)' : 'District'}
                        </label>
                        <select
                          value={newAddrDistrict}
                          onChange={(e) => setNewAddrDistrict(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold"
                        >
                          {BANGLADESH_DISTRICTS.map((d, i) => (
                            <option key={i} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {isBn ? 'থানা / উপজেলা / এলাকা' : 'Thana / City'}
                        </label>
                        <input
                          type="text"
                          value={newAddrThana}
                          onChange={(e) => setNewAddrThana(e.target.value)}
                          placeholder={isBn ? 'যেমন: মিরপুর, উত্তরা...' : 'e.g. Mirpur, Uttara'}
                          className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isBn ? 'বিস্তারিত সড়ক, বাড়ি ও ফ্ল্যাট নম্বর' : 'Street & House Address'} <span className="text-rose-600">*</span>
                      </label>
                      <textarea
                        rows={2}
                        value={newAddrStreet}
                        onChange={(e) => setNewAddrStreet(e.target.value)}
                        required
                        placeholder={isBn ? 'বাড়ি #, রোড #, ব্লক/সেক্টর...' : 'House #, Road #, Area...'}
                        className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs font-medium"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingAddress(false)}
                        className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-300 transition cursor-pointer"
                      >
                        {isBn ? 'বাতিল' : 'Cancel'}
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-xs transition cursor-pointer"
                      >
                        {isBn ? 'ঠিকানা সংরক্ষণ করুন' : 'Save Address'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Addresses List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {userProfile.savedAddresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition relative ${
                        addr.isDefault
                          ? 'border-rose-400 bg-rose-50/30 ring-2 ring-rose-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          {addr.label === 'Home' ? (
                            <Home className="w-4 h-4 text-rose-600" />
                          ) : (
                            <Briefcase className="w-4 h-4 text-indigo-600" />
                          )}
                          <span className="font-bold text-slate-900 text-sm">
                            {addr.labelBn || addr.label}
                          </span>
                        </div>
                        {addr.isDefault ? (
                          <span className="text-[10px] bg-rose-600 text-white font-bold px-2 py-0.5 rounded-full">
                            {isBn ? 'ডিফল্ট ঠিকানা' : 'Default'}
                          </span>
                        ) : (
                          <button
                            onClick={() => handleSetDefaultAddress(addr.id)}
                            className="text-[11px] text-slate-500 hover:text-rose-600 underline font-semibold cursor-pointer"
                          >
                            {isBn ? 'ডিফল্ট করুন' : 'Set as Default'}
                          </button>
                        )}
                      </div>

                      <div className="mt-3 space-y-1 text-xs text-slate-600">
                        <p className="font-bold text-slate-800">{addr.district}</p>
                        {addr.thanaCity && <p>{addr.thanaCity}</p>}
                        <p className="text-slate-700">{addr.streetAddress}</p>
                      </div>

                      <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-slate-400 font-mono">
                          ID: {addr.id}
                        </span>
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-slate-400 hover:text-rose-600 flex items-center gap-1 transition cursor-pointer p-1"
                          title="ঠিকানা মুছুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="text-[11px]">{isBn ? 'মুছুন' : 'Delete'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 4: PAYMENTS, BKASH & WALLET BALANCE */}
            {/* ============================================================== */}
            {activeTab === 'payments' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-slate-200">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-rose-600" />
                    <span>{isBn ? 'বিকাশ নম্বর, ওয়ালেট ও রিওয়ার্ড পয়েন্ট' : 'bKash Number, Wallet & Rewards'}</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {isBn 
                      ? 'অর্ডার রিফান্ড এবং দ্রুত চেকআউটের জন্য আপনার বিকাশ নম্বর ও ওয়ালেট ব্যালেন্স।' 
                      : 'Manage your preferred refund numbers and smart cashback wallet balance.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Wallet Card */}
                  <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                    <div className="flex items-center justify-between pb-4 border-b border-white/20">
                      <div className="flex items-center gap-2">
                        <Wallet className="w-6 h-6 text-emerald-300" />
                        <div>
                          <p className="text-[10px] text-emerald-200 uppercase tracking-widest font-bold">
                            SMARTSHOP WALLET
                          </p>
                          <h4 className="font-black text-base">ক্যাশব্যাক ওয়ালেট</h4>
                        </div>
                      </div>
                      <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        ACTIVE
                      </span>
                    </div>

                    <div className="py-6">
                      <p className="text-xs text-emerald-200">{isBn ? 'বর্তমান ওয়ালেট ব্যালেন্স:' : 'Current Balance:'}</p>
                      <h3 className="text-3xl sm:text-4xl font-black font-mono mt-1 text-white">
                        {formatPrice(userProfile.walletBalance || 320)}
                      </h3>
                      <p className="text-[11px] text-emerald-100 mt-2">
                        {isBn ? 'পরবর্তী কেনাকাটায় এই ব্যালেন্স ব্যবহার করতে পারবেন।' : 'Usable towards your next purchases.'}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/20 flex items-center justify-between text-xs text-emerald-100">
                      <span>{userProfile.name}</span>
                      <span className="font-mono">{userProfile.id}</span>
                    </div>
                  </div>

                  {/* SmartPoints Card */}
                  <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500 via-orange-600 to-slate-900 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                    <div className="flex items-center justify-between pb-4 border-b border-white/20">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-amber-300" />
                        <div>
                          <p className="text-[10px] text-amber-200 uppercase tracking-widest font-bold">
                            REWARD SYSTEM
                          </p>
                          <h4 className="font-black text-base">স্মার্ট রিওয়ার্ড পয়েন্ট</h4>
                        </div>
                      </div>
                      <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        VIP TIER
                      </span>
                    </div>

                    <div className="py-6">
                      <p className="text-xs text-amber-200">{isBn ? 'অর্জিত পয়েন্ট:' : 'Earned Points:'}</p>
                      <h3 className="text-3xl sm:text-4xl font-black font-mono mt-1 text-white">
                        {userProfile.smartPoints || 850} <span className="text-sm font-normal text-amber-200">Points</span>
                      </h3>
                      <p className="text-[11px] text-amber-100 mt-2">
                        {isBn ? '১০০ পয়েন্ট = ১০৳ নগদ ডিসকাউন্ট' : '100 points = 10 BDT discount'}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/20 flex items-center justify-between text-xs text-amber-100">
                      <span>{userProfile.membershipTier || 'VIP'} Member</span>
                      <span>Next Level: Platinum</span>
                    </div>
                  </div>
                </div>

                {/* bKash / Nagad Details info */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Phone className="w-4 h-4 text-rose-600" />
                    <span>{isBn ? 'বিকাশ ও নগদ পেমেন্ট নম্বর' : 'Registered Payment Numbers'}</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {isBn 
                      ? `আপনার নিবন্ধিত মোবাইল নম্বর: ${userProfile.phone}। স্মার্টশপবিডি-তে বিকাশ ও নগদ পেমেন্ট সফলভাবে সম্পন্ন করার পর আমাদের অ্যাডমিন প্যানেল স্বয়ংক্রিয়ভাবে আপনার TrxID ভেরিফাই করে অর্ডারটি Approve করে দেবে।`
                      : `Registered number: ${userProfile.phone}. After completing bKash or Nagad transfers, our system matches your TrxID to approve the order.`}
                  </p>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 5: MY COUPONS & VOUCHERS */}
            {/* ============================================================== */}
            {activeTab === 'coupons' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-slate-200">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-rose-600" />
                    <span>{isBn ? 'আমার কুপন ও ডিসকাউন্ট ভাউচার' : 'Available Vouchers & Coupons'}</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {isBn 
                      ? 'চেকআউট করার সময় নিচের কুপন কোডগুলো ব্যবহার করে আকর্ষণীয় ছাড় উপভোগ করুন।' 
                      : 'Copy these exclusive vouchers to receive instant discounts at checkout.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {coupons.map((cp, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl border-2 border-dashed border-rose-200 bg-gradient-to-r from-rose-50/50 via-white to-amber-50/40 relative overflow-hidden flex flex-col justify-between space-y-4 hover:border-rose-400 transition"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-600 text-white">
                            {cp.discountType === 'percentage' ? `${cp.discountValue}% ছাড়` : `৳${cp.discountValue} ছাড়`}
                          </span>
                          <h4 className="font-black text-slate-900 text-base mt-2">
                            {cp.description}
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {isBn ? `ন্যূনতম কেনাকাটা: ৳${cp.minSpend.toLocaleString()}` : `Min. spend: ৳${cp.minSpend}`}
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-dashed border-slate-200 flex items-center justify-between">
                        <span className="font-mono text-sm font-black text-slate-900 tracking-wider bg-white px-3 py-1 rounded-lg border border-slate-300">
                          {cp.code}
                        </span>

                        <button
                          onClick={() => handleCopyCoupon(cp.code)}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer active:scale-95 flex items-center gap-1.5"
                        >
                          {copiedCoupon === cp.code ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">কপিকৃত!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>কোড কপি</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 6: DIGITAL ID CARD & SECURITY */}
            {/* ============================================================== */}
            {activeTab === 'digital-card' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-slate-200">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-rose-600" />
                    <span>{isBn ? 'ডিজিটাল আইডি কার্ড ও নিরাপত্তা সেটিংস' : 'Digital ID & Security Settings'}</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {isBn 
                      ? 'অফলাইন শোরুম পিকআপ বা পার্সেল ভেরিফিকেশনের জন্য ডিজিটাল পরিচয়পত্র।' 
                      : 'Digital barcode ID for parcel handovers, in-person pickups, and security settings.'}
                  </p>
                </div>

                {/* Printable Digital Card */}
                <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-2xl space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white font-black">
                        SS
                      </div>
                      <div>
                        <h3 className="font-black text-lg text-white">SMARTSHOP BD</h3>
                        <p className="text-xs text-slate-400">Official Customer Identity Pass</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/30">
                      VERIFIED IDENTIFIER
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-slate-400">Customer Name</p>
                        <p className="text-xl font-black text-white">{userProfile.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Customer Profile ID</p>
                        <p className="text-2xl font-mono font-black text-emerald-400">{userProfile.id}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Registered Phone</p>
                        <p className="text-sm font-mono text-slate-200">{userProfile.phone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">VIP Tier</p>
                        <p className="text-sm font-bold text-amber-300">{userProfile.membershipTier || 'VIP'} Member</p>
                      </div>
                    </div>

                    <div className="text-center sm:text-right space-y-3">
                      {/* Barcode Graphic Simulation */}
                      <div className="p-4 bg-white rounded-2xl inline-block shadow-lg">
                        <div className="flex items-center justify-center gap-1 h-14 w-48 mx-auto">
                          {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 4, 1, 2, 3, 1, 4, 2].map((w, idx) => (
                            <div key={idx} className={`bg-slate-950 h-full w-[${w * 2}px]`} style={{ width: `${w * 2.5}px` }} />
                          ))}
                        </div>
                        <p className="font-mono text-[11px] font-black text-slate-900 mt-2 tracking-widest">
                          *{userProfile.id}*
                        </p>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {isBn ? 'পার্সেল রিসিভ করার সময় প্রয়োজনে এই বারকোডটি প্রদর্শন করুন।' : 'Scan this code at pickup points or for courier deliveries.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Account Security Box */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>{isBn ? 'অ্যাকাউন্ট নিরাপত্তা ও প্রাইভেসি' : 'Security & Privacy'}</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {isBn 
                      ? 'আপনার সকল প্রোফাইল তথ্য, সংরক্ষিত ঠিকানা এবং অর্ডার হিস্ট্রি সম্পূর্ণ সুরক্ষিত। আপনি চাইলে যে কোনো সময় আপনার তথ্য আপডেট করতে পারেন।' 
                      : 'All customer profile records, phone numbers, and delivery addresses are kept confidential.'}
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* ============================================================== */}
      {/* 3. ORDER RECEIPT / INVOICE PREVIEW MODAL */}
      {/* ============================================================== */}
      {receiptOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-xs overflow-y-auto">
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in zoom-in-95 duration-200">
            {/* Receipt Header */}
            <div className="bg-slate-950 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center font-black text-white text-xs">
                  SS
                </div>
                <div>
                  <h3 className="font-black text-sm">স্মার্টশপ বিডি চালান (Invoice)</h3>
                  <p className="text-[10px] text-slate-400 font-mono">#{receiptOrder.id}</p>
                </div>
              </div>
              <button
                onClick={() => setReceiptOrder(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Receipt Content */}
            <div className="p-5 space-y-4 text-xs">
              <div className="flex justify-between border-b border-slate-100 pb-3">
                <div>
                  <p className="text-slate-500">{isBn ? 'গ্রাহক:' : 'Customer:'}</p>
                  <p className="font-bold text-slate-900 text-sm">{receiptOrder.customerName || userProfile.name}</p>
                  <p className="font-mono text-slate-600">{receiptOrder.phone || userProfile.phone}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-500">{isBn ? 'তারিখ:' : 'Date:'}</p>
                  <p className="font-bold text-slate-900">
                    {receiptOrder.createdAt ? new Date(receiptOrder.createdAt).toLocaleDateString('bn-BD') : 'আজ'}
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {receiptOrder.status}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2 border-b border-slate-100 pb-3">
                <p className="font-bold text-slate-700">{isBn ? 'অর্ডারকৃত পণ্যসমূহ:' : 'Items:'}</p>
                {receiptOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center text-slate-700">
                    <span>
                      {it.product.nameBn} {it.selectedSize ? `(${it.selectedSize})` : ''} x {it.quantity}
                    </span>
                    <span className="font-bold text-slate-900">
                      {formatPrice(it.product.price * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-1.5 border-b border-slate-100 pb-3 font-semibold text-slate-600">
                <div className="flex justify-between">
                  <span>{isBn ? 'ডেলিভারি চার্জ:' : 'Delivery Fee:'}</span>
                  <span>{formatPrice(receiptOrder.deliveryFee || 60)}</span>
                </div>
                {receiptOrder.discount && receiptOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>{isBn ? 'ডিসকাউন্ট:' : 'Discount:'}</span>
                    <span>-{formatPrice(receiptOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black text-slate-900 pt-1">
                  <span>{isBn ? 'সর্বমোট প্রদেয়:' : 'Total Payable:'}</span>
                  <span className="text-rose-600 font-mono text-base">{formatPrice(receiptOrder.total)}</span>
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">{isBn ? 'পেমেন্ট মাধ্যম:' : 'Payment:'}</span>
                  <span className="font-bold text-slate-800 uppercase">{receiptOrder.paymentMethod}</span>
                </div>
                {receiptOrder.trxId && (
                  <div className="flex justify-between font-mono">
                    <span className="text-slate-500">TrxID:</span>
                    <span className="font-bold text-rose-600">{receiptOrder.trxId}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">{isBn ? 'ডেলিভারি ঠিকানা:' : 'Address:'}</span>
                  <span className="font-medium text-slate-800 truncate max-w-[200px]">{receiptOrder.address}</span>
                </div>
              </div>
            </div>

            {/* Receipt Footer Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>{isBn ? 'চালান প্রিন্ট করুন' : 'Print Invoice'}</span>
              </button>
              <button
                onClick={() => setReceiptOrder(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs cursor-pointer"
              >
                {isBn ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
