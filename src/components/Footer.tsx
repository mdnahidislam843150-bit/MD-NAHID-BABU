import React from 'react';
import { SiteContent } from '../types';
import { ShoppingBag, PhoneCall, Mail, MapPin, ShieldCheck, Heart, Sparkles, Lock, Globe } from 'lucide-react';

interface FooterProps {
  language: 'bn' | 'en';
  openPromptModal: () => void;
  openAdminModal: () => void;
  siteContent: SiteContent;
  openWebsiteLinkModal?: () => void;
  openOrderTracking?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  language, 
  openPromptModal, 
  openAdminModal,
  siteContent,
  openWebsiteLinkModal,
  openOrderTracking
}) => {
  const isBn = language === 'bn';

  return (
    <footer className="bg-slate-900 text-slate-300 mt-16 border-t border-slate-800">
      {/* Top Value Banner */}
      <div className="border-b border-slate-800 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3">
            <h4 className="text-white font-bold text-sm">{isBn ? '🚀 দ্রুততম ডেলিভারি' : '🚀 Fast Delivery'}</h4>
            <p className="text-xs text-slate-400 mt-0.5">{isBn ? '২৪-৭২ ঘণ্টায় পণ্য পৌঁছায়' : 'Delivery in 24-72 hours'}</p>
          </div>
          <div className="p-3">
            <h4 className="text-white font-bold text-sm">{isBn ? '🛡️ ১০০% আসল পণ্য' : '🛡️ 100% Genuine'}</h4>
            <p className="text-xs text-slate-400 mt-0.5">{isBn ? 'প্রত্যেকটি পণ্য যাচাইকৃত' : 'Quality tested items'}</p>
          </div>
          <div className="p-3">
            <h4 className="text-white font-bold text-sm">{isBn ? '💳 নিরাপদ পেমেন্ট' : '💳 Secure Payment'}</h4>
            <p className="text-xs text-slate-400 mt-0.5">{isBn ? 'ক্যাশ অন ডেলিভারি, বিকাশ ও নগদ' : 'COD, bKash & Nagad'}</p>
          </div>
          <div className="p-3">
            <h4 className="text-white font-bold text-sm">{isBn ? '🤝 বিশ্বস্ত সেবা' : '🤝 Dedicated Support'}</h4>
            <p className="text-xs text-slate-400 mt-0.5">{isBn ? 'সরাসরি কাস্টমার কেয়ার সহায়তা' : 'Direct customer assistance'}</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs sm:text-sm">
        
        {/* Brand column */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white p-1 border border-slate-700 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
              {siteContent.logoUrl ? (
                <img
                  src={siteContent.logoUrl}
                  alt={siteContent.storeNameEn}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full rounded-lg bg-blue-600 flex items-center justify-center text-white">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              )}
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight leading-none">
                <span className="text-blue-400">Smart</span>
                <span className="text-orange-400">Shop</span>
                <span className="text-emerald-400 font-extrabold ml-1 text-lg">BD</span>
              </span>
              <p className="text-[10px] text-amber-300 font-medium">Shop Smart • Live Better</p>
            </div>
          </div>
          <p className="text-slate-400 leading-relaxed text-xs">
            {siteContent.taglineBn} — আপনার বিশ্বাসই আমাদের অনুপ্রেরণা। শার্ট, টি-শার্ট, পাঞ্জাবি, প্যান্ট, হুডি, জ্যাকেট, শাড়ি, থ্রি পিস, বোরকা, হিজাব, লেহেঙ্গা, জুতো, ব্যাগ এবং বাচ্চাদের শীতের পোশাক ও খেলনার নির্ভরযোগ্য অনলাইন শপ।
          </p>
          <button
            onClick={openPromptModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-semibold hover:bg-amber-500/20 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isBn ? 'AI প্রম্পট ফরম বিল্ডার' : 'AI Prompt Spec Tool'}</span>
          </button>
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <h4 className="text-white font-bold text-sm">{isBn ? 'জনপ্রিয় কালেকশন' : 'Collections'}</h4>
          <ul className="space-y-1.5 text-slate-400 text-xs">
            <li className="hover:text-rose-400 transition cursor-pointer">{isBn ? '👔 শার্ট, টি-শার্ট ও পাঞ্জাবি' : 'Shirts, T-Shirts & Panjabi'}</li>
            <li className="hover:text-rose-400 transition cursor-pointer">{isBn ? '🥻 জামদানি শাড়ি ও থ্রি পিস' : 'Sarees & Three-Piece'}</li>
            <li className="hover:text-rose-400 transition cursor-pointer">{isBn ? '🧕 দুবাই বোরকা, আবায়া ও হিজাব' : 'Abayas, Borkha & Hijab'}</li>
            <li className="hover:text-rose-400 transition cursor-pointer">{isBn ? '🧥 ছেলে ও মেয়েদের হুডি ও জ্যাকেট' : 'Hoodies & Jackets'}</li>
            <li className="hover:text-rose-400 transition cursor-pointer">{isBn ? '👶 বাচ্চাদের শীতের কাপড় ও খেলনা' : 'Kids Winter Wear & Toys'}</li>
          </ul>
        </div>

        {/* Customer Service */}
        <div className="space-y-2">
          <h4 className="text-white font-bold text-sm">{isBn ? 'গ্রাহক সেবা' : 'Customer Service'}</h4>
          <ul className="space-y-1.5 text-slate-400 text-xs">
            <li>
              <button 
                onClick={openOrderTracking} 
                className="hover:text-emerald-400 text-left transition cursor-pointer flex items-center gap-1 font-semibold"
              >
                <span>🔍 {isBn ? 'অর্ডার ট্র্যাক করুন (Approved / Pending)' : 'Track Order (Status)'}</span>
              </button>
            </li>
            <li className="hover:text-rose-400 transition cursor-pointer">{isBn ? 'ডেলিভারি পলিসি ও চার্জ' : 'Shipping Policy'}</li>
            <li className="hover:text-rose-400 transition cursor-pointer">{isBn ? 'অর্ডার ও ডেলিভারি নির্দেশিকা' : 'Order & Delivery Guide'}</li>
            <li className="hover:text-rose-400 transition cursor-pointer">{isBn ? 'প্রাইভেসি পলিসি' : 'Privacy Policy'}</li>
          </ul>
        </div>

        {/* Contact info */}
        <div className="space-y-2.5">
          <h4 className="text-white font-bold text-sm">{isBn ? 'যোগাযোগের ঠিকানা' : 'Contact Us'}</h4>
          <div className="space-y-2 text-xs text-slate-400">
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{siteContent.addressBn}</span>
            </p>
            <p className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-rose-500 shrink-0" />
              <span className="font-mono">{siteContent.hotline}</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{siteContent.email}</span>
            </p>
          </div>
        </div>

      </div>

      {/* Copyright & Discreet Hidden Admin Trigger */}
      <div className="border-t border-slate-800 py-4 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-center sm:text-left">
            <p>
              {siteContent.storeNameEn} © {new Date().getFullYear()} — {isBn ? 'সকল স্বত্ব সংরক্ষিত।' : 'All rights reserved.'}
            </p>
            {openWebsiteLinkModal && (
              <button
                onClick={openWebsiteLinkModal}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-blue-400 hover:text-white border border-slate-700 transition cursor-pointer text-[11px]"
                title="smartshopbd ওয়েবসাইট লিংক ও গুগল সার্চ এসইও"
              >
                <Globe className="w-3.5 h-3.5 text-orange-400" />
                <span className="font-mono font-bold">smartshopbd</span>
                <span className="text-[10px] bg-blue-900/60 text-blue-300 px-1 rounded">
                  {isBn ? 'লিংক ও এসইও' : 'Link & SEO'}
                </span>
              </button>
            )}
          </div>

          {/* Discreet Hidden Admin Link */}
          <button
            onClick={openAdminModal}
            className="text-slate-600 hover:text-rose-400 transition flex items-center gap-1.5 text-[11px] p-1 rounded cursor-pointer"
            title="সিকিউর অ্যাডমিন পোর্টাল (PIN: admin123)"
          >
            <Lock className="w-3 h-3 text-slate-500 hover:text-rose-400" />
            <span className="opacity-70 hover:opacity-100">{isBn ? 'অ্যাডমিন পোর্টাল' : 'Admin Portal'}</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
