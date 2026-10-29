import React, { useState } from 'react';
import { PROMPT_TEMPLATES, PromptTemplate } from '../data/promptTemplates';
import { 
  X, 
  Sparkles, 
  Copy, 
  Check, 
  Layers, 
  Sliders, 
  Code2, 
  BookOpen, 
  Flame, 
  Send 
} from 'lucide-react';

interface PromptBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'bn' | 'en';
}

export const PromptBuilderModal: React.FC<PromptBuilderModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  if (!isOpen) return null;

  const isBn = language === 'bn';

  // Tabs: 'builder' | 'templates' | 'guide'
  const [activeTab, setActiveTab] = useState<'builder' | 'templates' | 'guide'>('builder');

  // Custom Builder State
  const [storeName, setStoreName] = useState('AmarShop');
  const [storeType, setStoreType] = useState('অল-ইন-ওয়ান মাল্টি-ক্যাটাগরি স্টোর');
  const [targetMarket, setTargetMarket] = useState('বাংলাদেশ (টাকা ৳ BDT)');
  const [paymentMethods, setPaymentMethods] = useState<string[]>([
    'ক্যাশ অন ডেলিভারি (Cash on Delivery)',
    'বিকাশ (bKash Send Money / Merchant)',
    'নগদ (Nagad)'
  ]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'পণ্য সার্চ ও ক্যাটাগরি ফিল্টার',
    'সাইডবার কার্ট ও রিয়েল-টাইম সাবটোটাল',
    'কুপন কোড ও প্রমোশন সিস্টেম',
    'সহজ অর্ডার ফরম (নাম, ফোন, জেলা, ঠিকানা)',
    'অর্ডার ট্র্যাকিং ও ইনভয়েস প্রিন্ট স্লিপ',
    'অ্যাডমিন ইনভেন্টরি ও প্রোডাক্ট ম্যানেজার',
    'বাংলা ও ইংরেজি দ্বিভাষিক সুবিধা'
  ]);

  // Selected Template
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate>(PROMPT_TEMPLATES[0]);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const togglePaymentMethod = (method: string) => {
    if (paymentMethods.includes(method)) {
      setPaymentMethods(paymentMethods.filter((m) => m !== method));
    } else {
      setPaymentMethods([...paymentMethods, method]);
    }
  };

  const toggleFeature = (feat: string) => {
    if (selectedFeatures.includes(feat)) {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== feat));
    } else {
      setSelectedFeatures([...selectedFeatures, feat]);
    }
  };

  // Generate customized prompt
  const generatedBanglaPrompt = `আমি Google AI Studio দিয়ে "${storeName}" নামে একটি আধুনিক এবং লাভজনক ইকমার্স ওয়েবসাইট তৈরি করতে চাই।

প্রজেক্টের বিবরণ ও স্পেসিফিকেশন:
১. শপের ধরন: ${storeType}
২. টার্গেট মার্কেট ও মুদ্রা: ${targetMarket}

৩. প্রয়োজনীয় ফিচারসমূহ (Core Features):
${selectedFeatures.map((f, i) => `  ${i + 1}. ${f}`).join('\n')}

৪. পেমেন্ট ও চেকআউট মেথডস (Payment Integration):
${paymentMethods.map((p) => `  - ${p}`).join('\n')}

৫. পারফেক্ট অর্ডার ও চেকআউট ফরমের ফিল্ডসমূহ:
  - কাস্টমারের পুরো নাম (Full Name)
  - সঠিক ১১ ডিজিটের মোবাইল নম্বর (Phone Number with BD format validation)
  - জেলা ও উপজেলা নির্বাচন (District & Area Dropdown)
  - বিস্তারিত ঠিকানা (House, Road, Area)
  - ডেলিভারির ধরন: ঢাকার ভেতরে (৳৬০), ঢাকার বাইরে (৳১২০), এক্সপ্রেস ডেলিভারি
  - পেমেন্ট মেথড নির্বাচন এবং বিকাশ/নগদের ক্ষেত্রে TrxID ও প্রেরক নম্বরের ইনপুট বক্স
  - বিশেষ নির্দেশনা (Special Delivery Notes)

৬. টেকনোলজি ও UI/UX নির্দেশিকা:
  - সম্পূর্ণ কোড React (TypeScript) ও Tailwind CSS এ ফ্রেম করতে হবে।
  - কোনো বাহ্যিক প্লাগইনের জটিলতা ছাড়া দ্রুত ব্রাউজারে রান করবে।
  - সুন্দর আইকন (Lucide-React) এবং নিখুঁত মোবাইল রেসপন্সিভ ডিজাইন।
  - অর্ডার কনফার্মেশনের পর কনফেটি অ্যানিমেশন ও প্রিন্টযোগ্য ইনভয়েস স্লিপ।

দয়া করে কোনো প্লেসহোল্ডার ছাড়া সম্পূর্ণ কার্যকর কোড দিয়ে অ্যাপ্লিকেশনটি তৈরি করুন।`;

  const generatedEnglishPrompt = `Build a high-performance, responsive e-commerce web application named "${storeName}" using React, TypeScript, and Tailwind CSS in Google AI Studio.

Requirements:
1. Store Category: ${storeType}
2. Market & Currency: ${targetMarket}
3. Essential Features:
${selectedFeatures.map((f, i) => `   - ${f}`).join('\n')}
4. Payment Gateways:
${paymentMethods.map((p) => `   - ${p}`).join('\n')}
5. Comprehensive Guest Checkout Form:
   - Full Name, Validated Mobile Number
   - District & Region selector
   - Detailed delivery address
   - Delivery rate computation (Standard & Express)
   - Payment method toggle with bKash/Nagad TrxID entry & Cash on Delivery
   - Delivery instructions box
6. Post-Order & Admin:
   - Order confirmation with invoice receipt
   - Admin view for inspecting placed orders and stock management
   - Clean, accessible typography and sleek visual cards.`;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative bg-white w-full max-w-4xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-100" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black">
                {isBn ? 'Google AI Studio ইকমার্স প্রম্পট ও স্পেসিফিকেশন ফরম' : 'Google AI Studio E-Commerce Prompt Generator'}
              </h2>
              <p className="text-xs text-amber-100 mt-0.5">
                {isBn 
                  ? 'একটি নিখুঁত নির্দেশিকা যা AI Studio-তে দিলে ১ ক্লিকেই সম্পূর্ণ ইকমার্স তৈরি হবে' 
                  : 'The perfect prompt specification format for building e-commerce apps with AI Studio'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 sm:px-6 pt-2 gap-2 text-xs sm:text-sm font-bold">
          <button
            onClick={() => setActiveTab('builder')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'builder'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>{isBn ? 'কাস্টম প্রম্পট বিল্ডার' : 'Custom Prompt Builder'}</span>
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'templates'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{isBn ? 'রেডিমেড টেমপ্লেট' : 'Ready Templates'}</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'guide'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{isBn ? 'পারফেক্ট ফরমের ৫টি নিয়ম' : '5 Rules of Perfect Prompts'}</span>
          </button>
        </div>

        {/* Tab 1: Interactive Prompt Builder */}
        {activeTab === 'builder' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Config Panel */}
            <div className="lg:col-span-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isBn ? 'আপনার দোকানের নাম:' : 'Store Name:'}
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full text-xs sm:text-sm p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isBn ? 'দোকানের ক্যাটাগরি / পণ্য ধরন:' : 'Store Type / Niche:'}
                </label>
                <select
                  value={storeType}
                  onChange={(e) => setStoreType(e.target.value)}
                  className="w-full text-xs sm:text-sm p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                >
                  <option value="অল-ইন-ওয়ান মাল্টি-ক্যাটাগরি মেগা স্টোর">অল-ইন-ওয়ান মাল্টি-ক্যাটাগরি মেগা স্টোর</option>
                  <option value="ফ্যাশন, ক্লথিং ও লাইফস্টাইল বুটিক">ফ্যাশন, ক্লথিং ও লাইফস্টাইল বুটিক</option>
                  <option value="টেক গ্যাজেট, ফোন ও ইলেকট্রনিক্স হাব">টেক গ্যাজেট, ফোন ও ইলেকট্রনিক্স হাব</option>
                  <option value="খাঁটি অর্গানিক ফুড ও ডেইলি গ্রোসারি">খাঁটি অর্গানিক ফুড ও ডেইলি গ্রোসারি</option>
                  <option value="কসমেটিকস ও বিউটি কেয়ার প্রোডাক্টস">কসমেটিকস ও বিউটি কেয়ার প্রোডাক্টস</option>
                  <option value="ডিজিটাল প্রোডাক্ট ও কোর্স বিক্রির শপ">ডিজিটাল প্রোডাক্ট ও কোর্স বিক্রির শপ</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isBn ? 'পেমেন্ট মেথড নির্বাচন করুন:' : 'Payment Gateways:'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {[
                    'ক্যাশ অন ডেলিভারি (Cash on Delivery)',
                    'বিকাশ (bKash Send Money / Merchant)',
                    'নগদ (Nagad)',
                    'রকেট (Rocket)',
                    'কার্ড / ব্যাংক পেমেন্ট (SSLCommerz/Stripe)'
                  ].map((method) => (
                    <label key={method} className="flex items-center gap-2 text-xs text-slate-700 p-1.5 rounded-md hover:bg-slate-100 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={paymentMethods.includes(method)}
                        onChange={() => togglePaymentMethod(method)}
                        className="rounded text-orange-600 focus:ring-orange-500"
                      />
                      <span className="truncate">{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isBn ? 'পছন্দের স্পেশাল ফিচারসমূহ:' : 'Key Features:'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {[
                    'পণ্য সার্চ ও ক্যাটাগরি ফিল্টার',
                    'সাইডবার কার্ট ও রিয়েল-টাইম সাবটোটাল',
                    'কুপন কোড ও প্রমোশন সিস্টেম',
                    'সহজ অর্ডার ফরম (নাম, ফোন, জেলা, ঠিকানা)',
                    'অর্ডার ট্র্যাকিং ও ইনভয়েস প্রিন্ট স্লিপ',
                    'অ্যাডমিন ইনভেন্টরি ও প্রোডাক্ট ম্যানেজার',
                    'বাংলা ও ইংরেজি দ্বিভাষিক সুবিধা',
                    'কালার ও সাইজ ভ্যারিয়েন্ট সিলেক্টর',
                    'ফ্ল্যাশ সেল ও কাউন্টডাউন টাইমার',
                    'হোয়াটসঅ্যাপ ইনস্ট্যান্ট অর্ডার বাটন'
                  ].map((feat) => (
                    <label key={feat} className="flex items-center gap-2 text-xs text-slate-700 p-1.5 rounded-md hover:bg-slate-100 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFeatures.includes(feat)}
                        onChange={() => toggleFeature(feat)}
                        className="rounded text-orange-600 focus:ring-orange-500"
                      />
                      <span className="truncate">{feat}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Generated Output Panel */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-3 bg-slate-900 text-slate-200 p-4 sm:p-5 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-orange-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {isBn ? 'রেডিমেড প্রম্পট রেজাল্ট' : 'Live Generated Prompt'}
                  </span>
                </div>
                <span className="text-[10px] bg-orange-500/20 text-orange-300 font-bold px-2 py-0.5 rounded">
                  AI STUDIO READY
                </span>
              </div>

              {/* Bangla Output preview */}
              <div className="flex-1 max-h-80 overflow-y-auto bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed select-all">
                {generatedBanglaPrompt}
              </div>

              {/* Copy actions */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => copyToClipboard(generatedBanglaPrompt, 'bn-custom')}
                  className="flex-1 py-2.5 px-3 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-orange-600/20 active:scale-95"
                >
                  {copiedType === 'bn-custom' ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>{isBn ? 'বাংলা প্রম্পট কপি হয়েছে!' : 'Bangla Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>{isBn ? 'বাংলা প্রম্পট কপি করুন' : 'Copy Bangla Prompt'}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => copyToClipboard(generatedEnglishPrompt, 'en-custom')}
                  className="flex-1 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center justify-center gap-1.5 active:scale-95"
                >
                  {copiedType === 'en-custom' ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>{isBn ? 'English কপি হয়েছে!' : 'English Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>{isBn ? 'English প্রম্পট কপি' : 'Copy English Prompt'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Pre-configured Templates */}
        {activeTab === 'templates' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Templates List */}
            <div className="lg:col-span-5 space-y-2.5">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                {isBn ? 'টেমপ্লেট নির্বাচন করুন:' : 'Select Template:'}
              </h3>
              {PROMPT_TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition ${
                    selectedTemplate.id === tmpl.id
                      ? 'border-orange-500 bg-orange-50/50 ring-1 ring-orange-500'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      {isBn ? tmpl.titleBn : tmpl.titleEn}
                    </span>
                    <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                      {tmpl.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                    {tmpl.descriptionBn}
                  </p>
                </div>
              ))}
            </div>

            {/* Template Preview & Copy */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-3 bg-slate-900 text-slate-200 p-4 sm:p-5 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {isBn ? selectedTemplate.titleBn : selectedTemplate.titleEn}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {selectedTemplate.descriptionBn}
                  </p>
                </div>
              </div>

              <div className="flex-1 max-h-80 overflow-y-auto bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed select-all">
                {selectedTemplate.banglaPrompt}
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => copyToClipboard(selectedTemplate.banglaPrompt, `tmpl-bn-${selectedTemplate.id}`)}
                  className="flex-1 py-2.5 px-3 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 active:scale-95"
                >
                  {copiedType === `tmpl-bn-${selectedTemplate.id}` ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>{isBn ? 'কপি সফল হয়েছে!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>{isBn ? 'এই প্রম্পটটি কপি করুন' : 'Copy This Prompt'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: The 5 Golden Rules */}
        {activeTab === 'guide' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs sm:text-sm text-slate-700">
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 space-y-1">
              <h3 className="font-extrabold text-sm sm:text-base flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-600" />
                <span>Google AI Studio দিয়ে নিখুঁত ওয়েবসাইট বানানোর ৫টি নিয়ম:</span>
              </h3>
              <p className="text-xs text-amber-800">
                AI Studio কে সাধারণ এক লাইনের প্রম্পট ("একটি ইকমার্স বানাও") দিলে অসম্পূর্ণ সাইট তৈরি হতে পারে। কিন্তু নিচের ফরম্যাটে লিখলে ১০০% নিখুঁত ও প্রফেশনাল ফলাফল পাবেন:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs inline-flex items-center justify-center mb-2">1</span>
                <h4 className="font-bold text-slate-900 text-sm">সুনির্দিষ্ট ভূমিকা ও ফ্রেমওয়ার্ক (Role & Stack)</h4>
                <p className="text-xs text-slate-600 mt-1">
                  প্রম্পটে বলে দিন আপনি React (TypeScript), Tailwind CSS এবং Lucide Icons ব্যবহার করতে চান। এতে কোড পরিচ্ছন্ন ও দ্রুত লোড হয়।
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs inline-flex items-center justify-center mb-2">2</span>
                <h4 className="font-bold text-slate-900 text-sm">পারফেক্ট অর্ডার ও চেকআউট ফরমের বিবরণ</h4>
                <p className="text-xs text-slate-600 mt-1">
                  কোন কোন ফিল্ড লাগবে স্পষ্টভাবে উল্লেখ করুন: নাম, ১১ ডিজিটের ফোন নম্বর, জেলা ড্রপডাউন, বিস্তারিত ঠিকানা এবং ঢাকার ভেতরে ও বাইরের ডেলিভারি চার্জ।
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs inline-flex items-center justify-center mb-2">3</span>
                <h4 className="font-bold text-slate-900 text-sm">পেমেন্ট গেটওয়ে নির্দেশনা (Payment Gateways)</h4>
                <p className="text-xs text-slate-600 mt-1">
                  বাংলাদেশে ক্যাশ অন ডেলিভারি, বিকাশ ও নগদ সেন্ড মানি (TrxID ফিল্ড সহ) সবচেয়ে বেশি জনপ্রিয়। প্রম্পটে এই ৩টি পদ্ধতি স্পষ্ট উল্লেখ করুন।
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs inline-flex items-center justify-center mb-2">4</span>
                <h4 className="font-bold text-slate-900 text-sm">কার্ট ও কুপন ডিসকাউন্ট ইঞ্জিন</h4>
                <p className="text-xs text-slate-600 mt-1">
                  গ্রাহক যাতে পণ্য সংখ্যা বাড়াতে-কমাতে পারেন, কুপন কোড (যেমন: EID20) দিয়ে ছাড় পান এবং রিয়েল-টাইম মোট টাকা দেখতে পারেন।
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 md:col-span-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs inline-flex items-center justify-center mb-2">5</span>
                <h4 className="font-bold text-slate-900 text-sm">পোস্ট-অর্ডার অভিজ্ঞতা ও অ্যাডমিন ভিউ</h4>
                <p className="text-xs text-slate-600 mt-1">
                  অর্ডার প্লেস করার পর যেন কনফেটি সেলিব্রেশন, ট্র্যাকিং আইডি এবং প্রিন্টযোগ্য ইনভয়েস স্লিপ আসে। পাশাপাশি অ্যাডমিন যাতে অর্ডারগুলো চেক করতে পারেন।
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            {isBn ? 'টিপস: আপনি এখনই প্রম্পটটি কপি করে Google AI Studio-তে পেস্ট করতে পারেন।' : 'Tip: Copy this prompt and paste directly into Google AI Studio.'}
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition"
          >
            {isBn ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
