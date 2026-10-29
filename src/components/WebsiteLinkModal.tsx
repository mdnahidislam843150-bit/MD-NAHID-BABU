import React, { useState } from 'react';
import { 
  Globe, 
  Copy, 
  Check, 
  Share2, 
  Search, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles, 
  Smartphone, 
  CheckCircle2, 
  X, 
  ArrowRight,
  TrendingUp,
  MessageCircle,
  Download,
  Flame,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { SiteContent } from '../types';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface WebsiteLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteContent: SiteContent;
  language: 'bn' | 'en';
}

export const WebsiteLinkModal: React.FC<WebsiteLinkModalProps> = ({
  isOpen,
  onClose,
  siteContent,
  language,
}) => {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'app' | 'searchWhy' | 'link' | 'seo' | 'googleGuide'>('searchWhy');
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [installSuccess, setInstallSuccess] = useState(false);
  const [showInstallTip, setShowInstallTip] = useState(false);

  if (!isOpen) return null;

  const isBn = language === 'bn';
  
  // Official Links
  const brandedSlug = 'smartshopbd';
  const customDomain = 'https://smartshopbd.com';
  const liveAppUrl = typeof window !== 'undefined' ? window.location.href : 'https://smartshopbd.com';

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(label);
    setTimeout(() => {
      setCopiedLink(null);
    }, 2500);
  };

  const shareText = isBn
    ? `SmartShop BD (smartshopbd) — সেরা মূল্যে শার্ট, পাঞ্জাবি, শাড়ি, বোরকা ও লাইফস্টাইল পণ্য অর্ডার করুন।\nঅফিসিয়াল অ্যাপ ও সাইট লিংক: ${liveAppUrl}`
    : `Shop premium fashion & lifestyle at SmartShop BD (smartshopbd):\nOfficial link: ${liveAppUrl}`;

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(liveAppUrl)}`;
    window.open(url, '_blank');
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setInstallSuccess(true);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-orange-600 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
              <Smartphone className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                  {isBn ? 'স্মার্টশপ অ্যাপ ও লিংক' : 'App & Verified Link'}
                </span>
                <span className="text-xs text-blue-200 font-mono tracking-wider font-semibold">
                  smartshopbd
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black mt-0.5">
                {isBn ? 'SmartShop BD অ্যাপ ও ওয়েবসাইট হাব' : 'SmartShop BD App & Website Hub'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-1.5 overflow-x-auto text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('searchWhy')}
            className={`pb-3 px-3 border-b-2 transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'searchWhy'
                ? 'border-rose-600 text-rose-600 font-bold bg-rose-50/50 rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-rose-600" />
            <span>{isBn ? '❓ সার্চ দিলে আসে না কেন?' : '❓ Why Search Fails?'}</span>
          </button>

          <button
            onClick={() => setActiveTab('app')}
            className={`pb-3 px-3 border-b-2 transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'app'
                ? 'border-orange-600 text-orange-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4 text-orange-600" />
            <span>{isBn ? '📱 smartshopbd অ্যাপ' : '📱 smartshopbd App'}</span>
          </button>

          <button
            onClick={() => setActiveTab('link')}
            className={`pb-3 px-3 border-b-2 transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'link'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>{isBn ? 'ওয়েবসাইট লিংক' : 'Website Link'}</span>
          </button>

          <button
            onClick={() => setActiveTab('googleGuide')}
            className={`pb-3 px-3 border-b-2 transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'googleGuide'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>{isBn ? '১ নম্বরে আনার নিয়ম' : 'Rank #1 Guide'}</span>
          </button>

          <button
            onClick={() => setActiveTab('seo')}
            className={`pb-3 px-3 border-b-2 transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'seo'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>{isBn ? 'এসইও কোডিং' : 'SEO Report'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* TAB: WHY SEARCH FAILS & INSTANT SOLUTION */}
          {activeTab === 'searchWhy' && (
            <div className="space-y-5">
              {/* Alert Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 border-2 border-rose-200 shadow-xs">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-600/30">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-black text-rose-950">
                      {isBn ? 'https://smartshopbd.com সার্চ দিলে কেন আসছে না? (সহজ সমাধান)' : 'Why https://smartshopbd.com is not showing on Search?'}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed">
                      {isBn 
                        ? 'আপনার ওয়েবসাইটের ভেতরের কোডিং, মেটা ট্যাগ, কীওয়ার্ড ও এসইও (SEO) ১০০% রেডি করা আছে। গুগলে সরাসরি সার্চ রেজাল্টে না আসার ৩টি বাস্তব কারণ এবং ২ মিনিটে সমাধান করার নিয়ম নিচে দেওয়া হলো:'
                        : 'On-page SEO code is 100% complete. Here are the 3 real reasons and exact solutions to get it indexed on Google:'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 3 Steps / Solutions */}
              <div className="space-y-3.5">
                {/* Step 1: Address Bar vs Google Search */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm mb-1.5">
                    <span className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs font-black shrink-0">১</span>
                    <span>{isBn ? 'ব্রাউজারের অ্যাড্রেস বার বনাম গুগল সার্চ বক্স:' : 'Browser Address Bar vs Google Search Bar:'}</span>
                  </div>
                  <div className="pl-9 space-y-2 text-xs text-slate-700">
                    <p>
                      {isBn 
                        ? 'গুগল সার্চ বক্সে লিখলে গুগল এটিকে কিওয়ার্ড হিসেবে খোঁজে। কিন্তু যেকোনো ব্রাউজারের (Chrome/Safari) একেবারে উপরে যেখানে লিংক লেখা থাকে (Address Bar), সেখানে সরাসরি smartshopbd.com লিখলে অথবা এন্টার দিলে ওয়েবসাইটটি সরাসরি ওপেন হবে।'
                        : 'Typing in Google search box looks for indexed keywords. Typing directly in Chrome/Safari Address Bar opens the website immediately.'}
                    </p>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-300 font-mono text-xs flex items-center justify-between gap-2">
                      <span className="text-blue-700 font-bold select-all truncate">https://smartshopbd.com</span>
                      <button
                        onClick={() => handleCopy('https://smartshopbd.com', 'why-domain')}
                        className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-sans text-xs font-bold shrink-0 cursor-pointer"
                      >
                        {copiedLink === 'why-domain' ? (isBn ? 'কপি হয়েছে' : 'Copied') : (isBn ? 'কপি লিংক' : 'Copy')}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Step 2: Google Search Console Indexing */}
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-2.5 font-bold text-emerald-950 text-sm mb-1.5">
                    <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs font-black shrink-0">২</span>
                    <span>{isBn ? 'গুগল সার্চ কনসোলে সাইটম্যাপ জমা দেওয়া (সবচেয়ে গুরুত্বপূর্ণ):' : 'Submit Sitemap to Google Search Console:'}</span>
                  </div>
                  <div className="pl-9 space-y-2.5 text-xs text-emerald-900">
                    <p>
                      {isBn 
                        ? 'গুগল কোনো ওয়েবসাইট নিজে নিজে প্রথম দিনেই চেনে না। গুগলকে জানাতে হয়। আমরা আপনার ওয়েবসাইটের ভেতরে অফিসিয়াল সাইটম্যাপ ও রোবট ফাইল তৈরি করে দিয়েছি। নিচের বাটনে ক্লিক করে গুগল সার্চ কনসোলে সাইটম্যাপটি দিয়ে "Request Indexing" দিন।'
                        : 'Google needs to be notified. Your sitemap.xml is ready. Submit it in Google Search Console to request instant crawl.'}
                    </p>
                    <div className="p-2.5 rounded-xl bg-white border border-emerald-300 font-mono text-xs flex items-center justify-between gap-2">
                      <span className="text-emerald-800 font-bold select-all truncate">https://smartshopbd.com/sitemap.xml</span>
                      <button
                        onClick={() => handleCopy('https://smartshopbd.com/sitemap.xml', 'why-sitemap')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-sans text-xs font-bold shrink-0 cursor-pointer"
                      >
                        {copiedLink === 'why-sitemap' ? (isBn ? 'কপি হয়েছে' : 'Copied') : (isBn ? 'সাইটম্যাপ কপি' : 'Copy Sitemap')}
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <a
                        href="https://search.google.com/search-console"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{isBn ? 'গুগল সার্চ কনসোলে যান (Search Console)' : 'Open Google Search Console'}</span>
                      </a>
                      <span className="text-[11px] text-emerald-700 font-medium">
                        {isBn ? '⏳ সাবমিটের ২৪-৭২ ঘণ্টার মধ্যে গুগলে ১ নম্বরে আসবে' : '⏳ Takes 24-72 hrs for Googlebot to index'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Step 3: DNS Connection Guide */}
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                  <div className="flex items-center gap-2.5 font-bold text-amber-950 text-sm mb-1.5">
                    <span className="w-7 h-7 rounded-xl bg-amber-600 text-white flex items-center justify-center text-xs font-black shrink-0">৩</span>
                    <span>{isBn ? 'কেনা ডোমেইনের DNS কানেকশন (Domain DNS Setup):' : 'Point Domain DNS to Website:'}</span>
                  </div>
                  <div className="pl-9 space-y-2 text-xs text-amber-900">
                    <p>
                      {isBn 
                        ? 'আপনি যদি Namecheap, GoDaddy বা বাংলাদেশি কোনো প্রোভাইডার থেকে smartshopbd.com ডোমেন কিনে থাকেন, তবে ডোমেনটির DNS Manage এ গিয়ে এই হোস্টিংয়ের CNAME বা A Record কানেক্ট করতে হবে।'
                        : 'If you bought smartshopbd.com, point the domain DNS (CNAME or A record) from your domain registrar.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Instant Alternative: Install smartshopbd App & Share */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
                <div>
                  <h5 className="font-extrabold text-sm flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-amber-200" />
                    <span>{isBn ? 'গুগল সার্চের অপেক্ষা না করে সরাসরি অ্যাপ ব্যবহার করুন:' : 'No need to wait for Google — Install App now!'}</span>
                  </h5>
                  <p className="text-xs text-orange-100 mt-0.5">
                    {isBn ? '১ ক্লিকে গ্রাহকদের ফোনে স্মার্টশপবিডি অ্যাপ ইনস্টল হয়ে যাবে।' : 'Customers can install smartshopbd directly as an App.'}
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('app')}
                  className="px-4 py-2 rounded-xl bg-white text-orange-700 hover:bg-orange-50 font-black text-xs shadow-xs shrink-0 cursor-pointer"
                >
                  {isBn ? '📱 অ্যাপ ট্যাবে যান' : 'Go to App Tab'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 1: SMARTPHONE APP */}
          {activeTab === 'app' && (
            <div className="space-y-5">
              {/* Main App Download Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white shadow-lg relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

                <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10">
                  <div className="w-20 h-20 rounded-2xl bg-white p-1.5 shadow-md shrink-0 flex items-center justify-center border-2 border-white/40">
                    <img 
                      src="/assets/aistudio/SmartShop_Logo_1b94ad7a.jpg" 
                      alt="SmartShop BD Logo" 
                      className="w-full h-full object-contain rounded-xl"
                    />
                  </div>

                  <div className="text-center sm:text-left flex-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold tracking-wide uppercase mb-1">
                      <Flame className="w-3.5 h-3.5 text-amber-200 fill-amber-200" />
                      {isBn ? 'অফিসিয়াল অ্যান্ড্রয়েড ও মোবাইল অ্যাপ' : 'Official Mobile App'}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black">
                      SmartShop BD (smartshopbd)
                    </h3>
                    <p className="text-xs sm:text-sm text-orange-100 mt-0.5">
                      {isBn 
                        ? 'আপনার ফোনে ১ ক্লিকে ইনস্টল করে সরাসরি অ্যাপ হিসেবে ব্যবহার করুন' 
                        : 'Install directly on your phone home screen for instant access.'}
                    </p>
                  </div>
                </div>

                {/* Install Action Area */}
                <div className="mt-5 pt-4 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                  {isInstalled || installSuccess ? (
                    <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl text-xs font-bold text-white w-full sm:w-auto justify-center">
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>{isBn ? 'অ্যাপটি আপনার ডিভাইসে ইনস্টল করা আছে!' : 'App is installed on your device!'}</span>
                    </div>
                  ) : isInstallable ? (
                    <button
                      onClick={handleInstallClick}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-orange-50 text-orange-700 font-extrabold text-sm shadow-md transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-5 h-5 text-orange-600 animate-bounce" />
                      <span>{isBn ? 'ফোনে ইনস্টল করুন (Install App)' : 'Install App Now'}</span>
                    </button>
                  ) : isIOS ? (
                    <div className="text-xs bg-white/20 p-2.5 rounded-xl text-left w-full">
                      <span className="font-bold">iPhone / iPad এ ইনস্টল নিয়ম:</span> Safari ব্রাউজারে নিচের <strong>Share (শেয়ার)</strong> বাটনে চাপ দিয়ে <strong>"Add to Home Screen"</strong> নির্বাচন করুন।
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => setShowInstallTip((prev) => !prev)}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white text-orange-700 font-bold text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Download className="w-4 h-4 text-orange-600" />
                        <span>{isBn ? 'হোম স্ক্রিনে যোগ করুন (Add to Home Screen)' : 'Add to Home Screen'}</span>
                      </button>
                      {showInstallTip && (
                        <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl text-xs text-white border border-white/30 text-left animate-fadeIn">
                          {isBn 
                            ? '💡 আপনার ব্রাউজারের উপরে বা মেনুতে (⋮) "Install app" বা "Add to Home screen" চাপুন।' 
                            : '💡 Tap your browser menu (⋮) and select "Install app" or "Add to Home screen".'}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="text-right text-[11px] text-orange-100 font-medium">
                    <span>⚡ ০ এমবি স্টোরেজ • সুপার ফাস্ট • অফলাইন সাপোর্ট</span>
                  </div>
                </div>
              </div>

              {/* App Advantages */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-2">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-800">
                    {isBn ? '১ ক্লিকে ওপেন' : '1-Click Launch'}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {isBn ? 'ব্রাউজার ছাড়াই ফোনের হোম স্ক্রিন থেকে ফুল স্ক্রিনে ওপেন হবে।' : 'Opens fullscreen like native app without browser UI.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-2">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-800">
                    {isBn ? 'অফলাইন ও ফাস্ট লোডিং' : 'Offline & Fast'}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {isBn ? 'সার্ভিস ওয়ার্কার ক্যাশের কারণে বিদ্যুৎ গতিতে লোড হয়।' : 'Built with Service Worker caching for instant speed.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-800">
                    {isBn ? 'অর্ডার নোটিফিকেশন' : 'Live Alerts'}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {isBn ? 'গ্রাহকের অর্ডার আসার সাথে সাথে তাৎক্ষণিক সাউন্ড ও এলার্ট।' : 'Immediate audio and visual alerts for incoming orders.'}
                  </p>
                </div>
              </div>

              {/* Instructions for Android Users */}
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-2">
                <h4 className="font-bold flex items-center gap-1.5 text-sm text-blue-950">
                  <Smartphone className="w-4 h-4 text-blue-600" />
                  <span>{isBn ? 'আপনার কাস্টমারদের কিভাবে অ্যাপটি ইনস্টল করাবেন?' : 'How customers install this app?'}</span>
                </h4>
                <p className="text-slate-700 leading-relaxed">
                  {isBn 
                    ? '১. কাস্টমারকে আপনার smartshopbd লিংকটি পাঠাবেন (WhatsApp বা Facebook-এ)।\n২. লিংকে ঢুকলে তাদের ফোনের নিচে "Install SmartShop BD App" বা "হোম স্ক্রিনে যোগ করুন" ভেসে উঠবে।\n৩. এক চাপ দিলেই ফোনে অ্যাপের মতো আইকন হয়ে যাবে এবং তারা সরাসরি পণ্য কিনতে পারবে।'
                    : '1. Send your smartshopbd link on WhatsApp or Facebook.\n2. Customers see the "Install App" button.\n3. Tap to save icon directly on mobile home screen.'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: WEBSITE LINK */}
          {activeTab === 'link' && (
            <div className="space-y-5">
              {/* Primary Slug / Brand Highlight */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    {isBn ? 'আপনার ব্র্যান্ডের নিজস্ব লিংক' : 'Your Official Brand Link'}
                  </span>
                  <span className="text-[11px] bg-blue-600 text-white font-bold px-2.5 py-0.5 rounded-full">
                    স্মার্টশপ বিডি
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-white rounded-xl border border-blue-300 p-2 shadow-xs">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 font-black text-sm shrink-0">
                    S
                  </div>
                  <div className="flex-1 truncate font-mono text-sm sm:text-base font-bold text-slate-800">
                    <span className="text-slate-400">https://</span>
                    <span className="text-blue-700 font-extrabold">{brandedSlug}</span>
                    <span className="text-orange-600">.com</span>
                  </div>
                  <button
                    onClick={() => handleCopy(customDomain, 'domain')}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shrink-0 cursor-pointer shadow-sm"
                  >
                    {copiedLink === 'domain' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span>{isBn ? 'কপি হয়েছে!' : 'Copied!'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{isBn ? 'কপি করুন' : 'Copy'}</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-blue-700/80 mt-2">
                  {isBn 
                    ? 'অনলাইনে smartshopbd ব্র্যান্ড নামের এই লিংকটি আপনার কাস্টমারদের সাথে শেয়ার করতে পারেন।' 
                    : 'Share your official smartshopbd brand link directly with customers.'}
                </p>
              </div>

              {/* Current Live AI Studio App Link */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-700">
                    {isBn ? 'বর্তমান লাইভ ক্লাউড ওয়েবসাইট লিংক:' : 'Current Live Cloud App URL:'}
                  </span>
                  <span className="text-[11px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    {isBn ? 'লাইভ সক্রিয়' : 'Live Active'}
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-300 p-2">
                  <div className="flex-1 truncate font-mono text-xs text-slate-700 select-all">
                    {liveAppUrl}
                  </div>
                  <button
                    onClick={() => handleCopy(liveAppUrl, 'live')}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shrink-0 cursor-pointer"
                  >
                    {copiedLink === 'live' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{isBn ? 'কপি হয়েছে!' : 'Copied!'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{isBn ? 'কপি করুন' : 'Copy'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Instant Social Share Buttons */}
              <div>
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2.5">
                  {isBn ? 'সোশ্যাল মিডিয়ায় এক ক্লিকে শেয়ার করুন:' : 'One-Click Social Share:'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    onClick={handleWhatsAppShare}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition active:scale-95 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>{isBn ? 'হোয়াটসঅ্যাপে পাঠান' : 'Share to WhatsApp'}</span>
                  </button>

                  <button
                    onClick={handleFacebookShare}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition active:scale-95 cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>{isBn ? 'ফেসবুকে শেয়ার করুন' : 'Share to Facebook'}</span>
                  </button>
                </div>
              </div>

              {/* Zero Modification Guarantee */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  {isBn 
                    ? 'সবকিছু পুরোপুরি সুরক্ষিত ও অক্ষত রাখা হয়েছে — পণ্য, ফোল্ডার, কার্ট, বিকাশ/নগদ পেমেন্ট (০১৭৮৪৩১৫০৪৭) এবং নোটিফিকেশন সিস্টেম কোনো কিছুই পরিবর্তন করা হয়নি।'
                    : 'All features remain 100% intact and secured — products, folders, cart, bKash/Nagad payment (01784315047), and notifications.'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: SEO */}
          {activeTab === 'seo' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-950 text-sm">
                      {isBn ? 'গুগল সার্চ ইঞ্জিন অপ্টিমাইজেশন (SEO) সম্পূর্ণ প্রস্তুত!' : 'Google Search Engine SEO is 100% Ready!'}
                    </h4>
                    <p className="text-xs text-emerald-800">
                      {isBn ? 'অনলাইনে smartshopbd সার্চ করলে যাতে আপনার ওয়েবসাইটটি আগে আসে তার জন্য প্রয়োজনীয় সব সিস্টেম যুক্ত করা হয়েছে।' : 'Optimized for smartshopbd top search ranking.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                    ✓
                  </div>
                  <div className="flex-1">
                    <span className="font-bold text-slate-900">
                      {isBn ? 'স্মার্ট কীওয়ার্ড মেটা ট্যাগ (Keywords Meta Tag):' : 'Keywords Meta Tag:'}
                    </span>
                    <p className="text-slate-600 mt-0.5 font-mono text-[11px] bg-white p-1.5 rounded border border-slate-200">
                      smartshopbd, smartshop bd, smart shop bd, স্মার্টশপ বিডি, online shopping bd, শার্ট, পাঞ্জাবি, শাড়ি, বোরকা
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                    ✓
                  </div>
                  <div className="flex-1">
                    <span className="font-bold text-slate-900">
                      {isBn ? 'গুগল স্কিমা মার্কআপ (Schema.org JSON-LD):' : 'Google Schema.org JSON-LD:'}
                    </span>
                    <p className="text-slate-600 mt-0.5">
                      {isBn 
                        ? 'গুগল রোবটকে আনুষ্ঠানিকভাবে জানানো হয়েছে এটি বাংলাদেশের অনলাইন শপ (OnlineStore) এবং ব্র্যান্ডের নাম SmartShop BD (smartshopbd)।' 
                        : 'Official OnlineStore and WebSite structured data enabled with Bangladeshi currency & address.'}
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                    ✓
                  </div>
                  <div className="flex-1">
                    <span className="font-bold text-slate-900">
                      {isBn ? 'XML সাইটম্যাপ ও Robots.txt:' : 'XML Sitemap & Robots.txt:'}
                    </span>
                    <p className="text-slate-600 mt-0.5">
                      {isBn 
                        ? 'গুগলবট ও বিং ক্রলারের জন্য /sitemap.xml এবং /robots.txt স্বয়ংক্রিয়ভাবে তৈরি রয়েছে।' 
                        : '/sitemap.xml and /robots.txt are configured for Googlebot and Bingbot indexing.'}
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                    ✓
                  </div>
                  <div className="flex-1">
                    <span className="font-bold text-slate-900">
                      {isBn ? 'ওপেনগ্রাফ সোশ্যাল কার্ড (OpenGraph & Twitter Cards):' : 'OpenGraph & Twitter Card Preview:'}
                    </span>
                    <p className="text-slate-600 mt-0.5">
                      {isBn 
                        ? 'ফেসবুক বা মেসেঞ্জারে লিংক পাঠালে আপনার SmartShop BD এর অফিসিয়াল লোগো ও ব্যানারসহ কার্ড শো করবে।' 
                        : 'Rich card preview with official logo & banner when shared on social networks.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: RANK 1 GUIDE */}
          {activeTab === 'googleGuide' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950">
                <h4 className="font-bold text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-600" />
                  {isBn ? 'গুগল সার্চে ১ নম্বরে আসার সহজ ৩টি ধাপ:' : '3 Simple Steps to Rank #1 on Google:'}
                </h4>
                <p className="mt-1 text-slate-700">
                  {isBn 
                    ? 'আপনার ওয়েবসাইটের ভেতরে কোডিংয়ের সব এসইও ইতিমধ্যে কমপ্লিট। গুগল সার্চে যাতে দ্রুত আপনার ওয়েবসাইটটি আগে আসে, নিচের ধাপগুলো অনুসরণ করুন:' 
                    : 'The on-page SEO code is ready. Follow these 3 real-world steps for fast Google top ranking:'}
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                    <span className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs">১</span>
                    <span>{isBn ? 'গুগল সার্চ কনসোলে সাইট অ্যাড করা (Google Search Console)' : 'Submit to Google Search Console'}</span>
                  </div>
                  <p className="text-slate-600 pl-8">
                    {isBn 
                      ? 'search.google.com/search-console এ গিয়ে আপনার ওয়েবসাইটের লিংক যোগ করে "URL Inspection"-এ ক্লিক করে "Request Indexing" দিন। গুগল ২-৩ দিনের মধ্যে ইনডেক্স করে নিবে।'
                      : 'Visit search.google.com, add your domain, and submit /sitemap.xml for fast Google indexing.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                    <span className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs">২</span>
                    <span>{isBn ? 'Google Business Profile তৈরি করা' : 'Create Google Business Profile'}</span>
                  </div>
                  <p className="text-slate-600 pl-8">
                    {isBn 
                      ? 'গুগলে "Google Business Profile" লিখে সার্চ দিয়ে আপনার দোকানের নাম "SmartShop BD" এবং ফোন নাম্বার 01784315047 দিয়ে ফ্রি একটি লিস্টিং তৈরি করুন। এর ফলে কেউ সার্চ দিলেই ডানপাশে আপনার সম্পূর্ণ স্টোর ভেসে উঠবে।'
                      : 'Create a free Google Business Profile under "SmartShop BD" with phone 01784315047 to appear on Google Maps & Search panels.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                    <span className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs">৩</span>
                    <span>{isBn ? 'সোশ্যাল মিডিয়ায় smartshopbd ইউজারনেম ব্যবহার' : 'Use @smartshopbd Username on Social Media'}</span>
                  </div>
                  <p className="text-slate-600 pl-8">
                    {isBn 
                      ? 'ফেসবুক পেজ (facebook.com/smartshopbd), টিকটক বা ইনস্টাগ্রামে এই লিংকটি দিন। ব্যাকলিংকের কারণে গুগলে "smartshopbd" সার্চ দিলে আপনার ওয়েবসাইটটি ১ নম্বরে আসবে।'
                      : 'Link your website in your Facebook Page, TikTok, and Instagram bios using @smartshopbd handle.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{isBn ? 'স্ট্যাটাস: smartshopbd অ্যাপ ও এসইও সক্রিয়' : 'Status: smartshopbd App & SEO Active'}</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
          >
            {isBn ? 'ঠিক আছে' : 'Got it'}
          </button>
        </div>
      </div>
    </div>
  );
};
