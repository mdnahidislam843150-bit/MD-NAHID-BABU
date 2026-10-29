import React, { useState } from 'react';
import { SiteContent, UserProfile } from '../types';
import { 
  ShoppingBag, 
  Search, 
  Sparkles, 
  Globe, 
  Package, 
  ShieldCheck, 
  PhoneCall,
  Lock,
  Bell,
  Smartphone,
  PackageCheck,
  CheckCircle2,
  User,
  LogIn,
  LogOut
} from 'lucide-react';

interface HeaderProps {
  language: 'bn' | 'en';
  setLanguage: (lang: 'bn' | 'en') => void;
  currency: 'BDT' | 'USD';
  setCurrency: (cur: 'BDT' | 'USD') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  cartCount: number;
  openCart: () => void;
  openPromptModal: () => void;
  openAdminModal: () => void;
  categories: { id: string; nameBn: string; nameEn: string }[];
  siteContent: SiteContent;
  unreadNotificationCount: number;
  openNotifications: () => void;
  openWebsiteLinkModal?: () => void;
  openOrderTracking: () => void;
  openAdminOrders?: () => void;
  pendingOrdersCount?: number;
  userProfile?: UserProfile;
  openUserProfile?: () => void;
  isCustomerLoggedIn?: boolean;
  openCustomerLogin?: () => void;
  onCustomerLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  setLanguage,
  currency,
  setCurrency,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  cartCount,
  openCart,
  openPromptModal,
  openAdminModal,
  categories,
  siteContent,
  unreadNotificationCount,
  openNotifications,
  openWebsiteLinkModal,
  openOrderTracking,
  openAdminOrders,
  pendingOrdersCount = 0,
  userProfile,
  openUserProfile,
  isCustomerLoggedIn = false,
  openCustomerLogin,
  onCustomerLogout
}) => {
  const isBn = language === 'bn';
  const [logoClickCount, setLogoClickCount] = useState(0);

  // Hidden secret trigger: Click logo 3 times
  const handleLogoSecretClick = () => {
    const newCount = logoClickCount + 1;
    setLogoClickCount(newCount);
    if (newCount >= 3) {
      setLogoClickCount(0);
      openAdminModal();
    } else {
      setTimeout(() => setLogoClickCount(0), 1500);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Announcement Bar - Matching SmartShop BD Brand */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white text-xs py-1.5 px-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="bg-white text-orange-600 font-extrabold px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wide">
              {isBn ? 'অফার' : 'Deal'}
            </span>
            <span className="truncate max-w-md sm:max-w-xl">
              {siteContent.announcementBn}
            </span>
          </div>
          <div className="flex items-center gap-4 text-orange-100">
            <span className="flex items-center gap-1 font-mono font-bold text-white">
              <PhoneCall className="w-3.5 h-3.5 text-amber-200" />
              <span>{siteContent.hotline}</span>
            </span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isBn ? '১০০% অরিজিনাল পণ্য' : '100% Genuine'}</span>
            </span>
            {!isCustomerLoggedIn && openCustomerLogin ? (
              <>
                <span className="hidden sm:inline">|</span>
                <button
                  onClick={openCustomerLogin}
                  className="flex items-center gap-1.5 text-white hover:text-amber-200 underline font-bold cursor-pointer"
                  title="কাষ্টমার অ্যাকাউন্টে লগইন বা রেজিস্টার করুন"
                >
                  <LogIn className="w-3.5 h-3.5 text-amber-300" />
                  <span>{isBn ? 'কাষ্টমার লগইন' : 'Customer Login'}</span>
                </button>
              </>
            ) : openUserProfile ? (
              <>
                <span className="hidden sm:inline">|</span>
                <button
                  onClick={openUserProfile}
                  className="flex items-center gap-1.5 text-white hover:text-amber-200 underline font-bold cursor-pointer"
                  title="আমার প্রোফাইল আইডি ও অ্যাকাউন্ট"
                >
                  <User className="w-3.5 h-3.5 text-amber-300" />
                  <span>{userProfile?.name ? userProfile.name.split(' ')[0] : (isBn ? 'আমার প্রোফাইল' : 'Profile')}</span>
                  {userProfile?.id && (
                    <span className="font-mono text-[10px] bg-white/20 text-white px-1.5 py-0.2 rounded font-bold">
                      {userProfile.id}
                    </span>
                  )}
                </button>
                {onCustomerLogout && (
                  <button
                    onClick={onCustomerLogout}
                    className="text-amber-200 hover:text-white text-[11px] underline font-medium cursor-pointer ml-1"
                    title="কাষ্টমার একাউন্ট থেকে লগআউট করুন"
                  >
                    ({isBn ? 'লগআউট' : 'Logout'})
                  </button>
                )}
              </>
            ) : null}
            <span className="hidden sm:inline">|</span>
            <button
              onClick={openOrderTracking}
              className="flex items-center gap-1 text-white hover:text-amber-200 underline font-bold cursor-pointer"
              title="অর্ডারটি এপ্রুভ হয়েছে না কি পেন্ডিং আছে তা চেক করুন"
            >
              <PackageCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>{isBn ? 'অর্ডার স্ট্যাটাস ট্র্যাক' : 'Track Order'}</span>
            </button>
            <span className="hidden md:inline">|</span>
            <button
              onClick={openAdminModal}
              className="hidden md:flex items-center gap-1 text-amber-200 hover:text-white underline font-bold cursor-pointer"
              title={isBn ? 'অ্যাডমিন পোর্টাল লগইন (জিমেইল: mdnahidislam1929@gmail.com)' : 'Admin Portal Login'}
            >
              <Lock className="w-3 h-3 text-amber-300" />
              <span>{isBn ? 'অ্যাডমিন পোর্টাল' : 'Admin'}</span>
            </button>
            {openWebsiteLinkModal && (
              <>
                <span className="hidden sm:inline">|</span>
                <button
                  onClick={openWebsiteLinkModal}
                  className="hidden sm:flex items-center gap-1 text-amber-200 hover:text-white underline font-bold cursor-pointer"
                  title="smartshopbd ওয়েবসাইট লিংক ও গুগল সার্চ এসইও"
                >
                  <Globe className="w-3 h-3 text-amber-300" />
                  <span>smartshopbd {isBn ? 'লিংক ও এসইও' : 'Link'}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-3 md:gap-6">
          
          {/* Logo with Secret 3-Click Admin trigger */}
          <div 
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group" 
            onClick={() => {
              setSelectedCategory('All');
              handleLogoSecretClick();
            }}
            title={isBn ? 'হোমপেজ (লোগোতে ৩ বার চাপলে এডমিন প্যানেল খুলবে)' : 'Home (Triple click for admin)'}
          >
            <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-white border border-slate-200/90 shadow-xs p-1 flex items-center justify-center overflow-hidden group-hover:scale-105 group-hover:border-blue-500 transition-all shrink-0">
              {siteContent.logoUrl ? (
                <img
                  src={siteContent.logoUrl}
                  alt={siteContent.storeNameEn}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight leading-none select-none">
                  <span className="text-blue-600">Smart</span>
                  <span className="text-orange-500">Shop</span>
                  <span className="text-emerald-600 font-extrabold ml-1 text-base sm:text-xl">BD</span>
                </span>
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 hidden sm:inline-block">
                  ONLINE
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                {isBn ? 'স্মার্ট কেনাকাটা • স্মার্ট জীবন' : 'Shop Smart • Live Better'}
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl hidden md:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isBn ? 'পণ্য, ব্র্যান্ড বা ক্যাটাগরি অনুসন্ধান করুন...' : 'Search for products, brands, or categories...'}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-300 rounded-full focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all text-slate-800 placeholder-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 px-1"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Customer Login / Register Button if not logged in */}
            {!isCustomerLoggedIn && openCustomerLogin ? (
              <button
                onClick={openCustomerLogin}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-extrabold text-xs sm:text-sm transition active:scale-95 cursor-pointer shadow-xs"
                title={isBn ? 'কাষ্টমার অ্যাকাউন্টে লগইন বা রেজিস্ট্রেশন করুন' : 'Customer Account Login or Sign Up'}
              >
                <LogIn className="w-4 h-4 text-amber-200" />
                <span className="font-extrabold">{isBn ? 'কাষ্টমার লগইন' : 'Customer Login'}</span>
              </button>
            ) : openUserProfile ? (
              <button
                onClick={openUserProfile}
                className="flex items-center gap-1.5 px-2.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 hover:from-slate-800 hover:to-indigo-900 text-white border border-slate-700/70 font-bold text-xs sm:text-sm transition active:scale-95 cursor-pointer shadow-xs group"
                title={isBn ? 'আপনার প্রোফাইল আইডি, অর্ডার ও সংরক্ষিত তথ্য' : 'My Account & Profile Details'}
              >
                {userProfile?.avatarUrl ? (
                  <img
                    src={userProfile.avatarUrl}
                    alt={userProfile.name}
                    className="w-5 h-5 rounded-full object-cover border border-amber-300 ring-1 ring-amber-400/50 shrink-0"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] shrink-0 border border-slate-600">
                    <User className="w-3 h-3 text-amber-300" />
                  </div>
                )}
                <span className="hidden sm:inline font-bold text-slate-100">
                  {userProfile?.name ? userProfile.name.split(' ')[0] : (isBn ? 'প্রোফাইল' : 'Profile')}
                </span>
                <span className="text-[10px] bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-mono px-1.5 py-0.2 rounded font-black hidden md:inline shadow-2xs">
                  {userProfile?.id || 'ID'}
                </span>
              </button>
            ) : null}

            {/* Customer Order Status Tracking Button */}
            <button
              onClick={openOrderTracking}
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100 hover:from-emerald-100 hover:to-teal-100 text-emerald-950 border border-emerald-300 font-extrabold text-xs sm:text-sm transition active:scale-95 cursor-pointer shadow-2xs"
              title={isBn ? 'আপনার অর্ডার এপ্রুভ হয়েছে না কি পেন্ডিং আছে তা চেক করুন' : 'Track Order Status (Approved / Pending)'}
            >
              <PackageCheck className="w-4 h-4 text-emerald-700" />
              <span className="hidden sm:inline">{isBn ? 'অর্ডার ট্র্যাক' : 'Track'}</span>
              <span className="text-[10px] bg-emerald-600 text-white font-black px-1.5 py-0.2 rounded-full">
                {isBn ? 'স্ট্যাটাস' : 'Status'}
              </span>
            </button>

            {/* Admin bKash Payment & Order Approval Shortcut */}
            {openAdminOrders && (
              <button
                onClick={openAdminOrders}
                className="relative hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100 text-rose-950 border border-rose-300 font-bold text-xs sm:text-sm transition active:scale-95 cursor-pointer shadow-2xs"
                title={isBn ? 'বিকাশ পেমেন্ট যাচাই করে অর্ডার এপ্রুভ বা বাতিল করুন' : 'Verify bKash payment & approve orders'}
              >
                <CheckCircle2 className="w-4 h-4 text-rose-600" />
                <span className="hidden md:inline">{isBn ? 'বিকাশ এপ্রুভাল' : 'bKash Verify'}</span>
                {pendingOrdersCount > 0 && (
                  <span className="bg-rose-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full min-w-[18px] text-center shadow-xs animate-pulse">
                    {pendingOrdersCount}
                  </span>
                )}
              </button>
            )}

            {/* Order Notifications Button on the right */}
            <button
              onClick={openNotifications}
              className="relative flex items-center gap-1.5 px-2.5 py-1.5 sm:py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 font-bold text-xs sm:text-sm transition active:scale-95 cursor-pointer shadow-2xs"
              title={isBn ? 'গ্রাহকদের নতুন অর্ডার নোটিফিকেশন' : 'Customer Order Notifications'}
            >
              <div className="relative">
                <Bell className="w-4 h-4 text-blue-700" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs">{isBn ? 'নোটিফিকেশন' : 'Alerts'}</span>
              {unreadNotificationCount > 0 && (
                <span className="bg-rose-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full min-w-[18px] text-center shadow-xs">
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {/* Admin Portal Button */}
            <button
              onClick={openAdminModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-sm transition active:scale-95 cursor-pointer"
              title={isBn ? 'অ্যাডমিন পোর্টাল লগইন (জিমেইল: mdnahidislam1929@gmail.com)' : 'Admin Portal Login'}
            >
              <Lock className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">{isBn ? 'অ্যাডমিন' : 'Admin'}</span>
            </button>

            {/* smartshopbd App, Website Link & Google SEO Button */}
            {openWebsiteLinkModal && (
              <button
                onClick={openWebsiteLinkModal}
                className="flex items-center gap-1.5 px-2.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100 hover:from-orange-100 hover:to-amber-100 text-orange-950 border border-orange-300 font-bold text-xs sm:text-sm transition active:scale-95 cursor-pointer shadow-xs"
                title={isBn ? 'smartshopbd অ্যাপ ইনস্টল, লিংক ও গুগল সার্চ এসইও' : 'smartshopbd App, Link & Google SEO'}
              >
                <Smartphone className="w-4 h-4 text-orange-600" />
                <span className="font-mono text-xs text-orange-800 font-bold hidden md:inline">smartshopbd</span>
                <span className="text-[10px] bg-gradient-to-r from-orange-600 to-amber-600 text-white font-extrabold px-1.5 py-0.2 rounded-full shadow-2xs">
                  {isBn ? '📱 অ্যাপ' : '📱 App'}
                </span>
              </button>
            )}

            {/* AI Studio Prompt Form Button */}
            <button
              onClick={openPromptModal}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold text-xs sm:text-sm shadow-md shadow-orange-500/20 active:scale-95 transition-all"
              title="Google AI Studio এর জন্য পারফেক্ট প্রম্পট তৈরি করুন"
            >
              <Sparkles className="w-4 h-4 fill-white text-white" />
              <span>{isBn ? 'AI প্রম্পট' : 'AI Prompt'}</span>
            </button>

            {/* Currency & Language Switchers */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <button
                onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
                className="px-1.5 py-0.5 rounded font-medium text-slate-700 hover:text-rose-700 transition"
              >
                {language === 'bn' ? 'EN' : 'বাং'}
              </button>
              <span className="text-slate-300">|</span>
              <button
                onClick={() => setCurrency(currency === 'BDT' ? 'USD' : 'BDT')}
                className="px-1 py-0.5 rounded font-bold text-slate-700 hover:text-rose-700 transition"
              >
                {currency === 'BDT' ? '৳ BDT' : '$ USD'}
              </button>
            </div>

            {/* Cart Trigger Button */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm transition active:scale-95 cursor-pointer shadow-md shadow-orange-600/20"
            >
              <ShoppingBag className="w-4 h-4 text-white" />
              <span className="hidden sm:inline">{isBn ? 'কার্ট' : 'Cart'}</span>
              {cartCount > 0 && (
                <span className="bg-white text-orange-600 text-[11px] font-black px-1.5 py-0.2 rounded-full min-w-[20px] text-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Quick Bar: Profile + Order Tracking */}
        <div className="mt-2.5 flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 border border-slate-700 text-white text-xs sm:hidden">
          {openUserProfile && (
            <button
              onClick={openUserProfile}
              className="flex items-center gap-1.5 font-bold text-white cursor-pointer shrink-0"
            >
              <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-800 text-white flex items-center justify-center text-[10px] border border-amber-300">
                {userProfile?.avatarUrl ? (
                  <img src={userProfile.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-3.5 h-3.5 text-amber-300" />
                )}
              </div>
              <span className="truncate max-w-[80px] font-bold">{userProfile?.name ? userProfile.name.split(' ')[0] : (isBn ? 'প্রোফাইল' : 'Profile')}</span>
              <span className="text-[9px] bg-amber-400 text-slate-950 font-mono px-1 py-0.2 rounded font-black">
                {userProfile?.id ? userProfile.id.replace('UID-', '') : 'ID'}
              </span>
            </button>
          )}

          <div className="h-4 w-px bg-slate-700 shrink-0" />

          <button
            onClick={openOrderTracking}
            className="flex-1 flex items-center gap-1.5 font-bold text-emerald-300 cursor-pointer truncate justify-end"
          >
            <PackageCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">{isBn ? 'অর্ডার স্ট্যাটাস ট্র্যাক' : 'Track Order'}</span>
            <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded shrink-0">
              🔍
            </span>
          </button>
        </div>

        {/* Mobile Search Input */}
        <div className="mt-2 md:hidden">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isBn ? 'পণ্য অনুসন্ধান করুন...' : 'Search products...'}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-500 text-slate-800 placeholder-slate-400"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Category Pills Navigation */}
        <div className="flex items-center gap-1.5 sm:gap-2 mt-3 pt-2.5 border-t border-slate-100 overflow-x-auto scrollbar-none pb-0.5">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {isBn ? 'সব পণ্য' : 'All Products'}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isBn ? cat.nameBn : cat.nameEn}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
