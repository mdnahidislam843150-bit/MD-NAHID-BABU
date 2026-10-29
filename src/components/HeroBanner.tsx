import React, { useState, useEffect } from 'react';
import { SiteContent, Product } from '../types';
import { 
  Sparkles, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Truck, 
  Banknote, 
  PhoneCall, 
  Maximize2, 
  ShoppingBag, 
  Tag, 
  Pause,
  Play,
  Flame,
  Check
} from 'lucide-react';

interface HeroBannerProps {
  language: 'bn' | 'en';
  onExploreProducts: () => void;
  openPromptModal: () => void;
  siteContent: SiteContent;
  products?: Product[];
  onSelectProduct?: (product: Product) => void;
}

interface BannerSlide {
  id: string;
  categoryTitleBn: string;
  categoryTitleEn: string;
  clothingItems: {
    id: string;
    nameBn: string;
    categoryBn: string;
    price: number;
    originalPrice: number;
    discountPercent: number;
    image: string;
    tagBn: string;
  }[];
}

const BANNER_SLIDES: BannerSlide[] = [
  {
    id: 'slide-mens',
    categoryTitleBn: 'ছেলেদের প্রিমিয়াম শার্ট ও পাঞ্জাবি',
    categoryTitleEn: 'Men\'s Shirts & Panjabi',
    clothingItems: [
      {
        id: 'shirt-1',
        nameBn: 'অক্সফোর্ড কটন ক্যাজুয়াল শার্ট',
        categoryBn: 'শার্ট কালেকশন',
        price: 1350,
        originalPrice: 1750,
        discountPercent: 23,
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80',
        tagBn: 'বেস্ট সেলার'
      },
      {
        id: 'panjabi-1',
        nameBn: 'রয়্যাল এমব্রয়ডারি ডিজাইনার পাঞ্জাবি',
        categoryBn: 'পাঞ্জাবি কালেকশন',
        price: 2150,
        originalPrice: 2800,
        discountPercent: 23,
        image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
        tagBn: 'হট চয়েস'
      },
      {
        id: 'tshirt-1',
        nameBn: 'ড্রপ-শোল্ডার ওভারসাইজড টি-শার্ট',
        categoryBn: 'টি-শার্ট কালেকশন',
        price: 650,
        originalPrice: 950,
        discountPercent: 31,
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
        tagBn: '৩১% ছাড়'
      },
      {
        id: 'pant-1',
        nameBn: 'টুইল গ্যাবার্ডিন চিনো প্যান্ট',
        categoryBn: 'প্যান্ট কালেকশন',
        price: 1250,
        originalPrice: 1650,
        discountPercent: 24,
        image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80',
        tagBn: 'কমফোর্ট'
      }
    ]
  },
  {
    id: 'slide-womens',
    categoryTitleBn: 'ঢাকাই জামদানি শাড়ি ও থ্রি-পিস',
    categoryTitleEn: 'Dhakai Jamdani & Three-Piece',
    clothingItems: [
      {
        id: 'saree-1',
        nameBn: 'খাঁটি তাঁতের ঢাকাই জামদানি শাড়ি',
        categoryBn: 'শাড়ি কালেকশন',
        price: 3850,
        originalPrice: 5200,
        discountPercent: 26,
        image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
        tagBn: 'খাঁটি তাঁতের'
      },
      {
        id: 'threepiece-1',
        nameBn: 'লাক্সারি কটন লন থ্রি-পিস',
        categoryBn: 'থ্রি-পিস কালেকশন',
        price: 2450,
        originalPrice: 3200,
        discountPercent: 23,
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
        tagBn: 'শিফন ওড়না'
      },
      {
        id: 'borka-1',
        nameBn: 'দুবাই চেরি জর্জেট আবায়া বোরকা',
        categoryBn: 'বোরকা কালেকশন',
        price: 2650,
        originalPrice: 3500,
        discountPercent: 24,
        image: 'https://images.unsplash.com/photo-1585728748178-f742f55ed462?auto=format&fit=crop&w=600&q=80',
        tagBn: 'ফ্রি হিজাব'
      },
      {
        id: 'hijab-1',
        nameBn: 'বাবল শিফন ম্যাক্সি হিজাব',
        categoryBn: 'হিজাব কালেকশন',
        price: 450,
        originalPrice: 650,
        discountPercent: 30,
        image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80',
        tagBn: 'প্রিমিয়াম'
      }
    ]
  },
  {
    id: 'slide-winter',
    categoryTitleBn: 'শীতের প্রিমিয়াম হুডি ও লেদার জ্যাকেট',
    categoryTitleEn: 'Winter Hoodies & Leather Jackets',
    clothingItems: [
      {
        id: 'hoodie-1',
        nameBn: '৩২০ GSM ব্রাশড ফ্লিস হুডি',
        categoryBn: 'উইন্টার হুডি',
        price: 1250,
        originalPrice: 1800,
        discountPercent: 30,
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
        tagBn: 'ভারী ফ্লিস'
      },
      {
        id: 'jacket-1',
        nameBn: 'উইন্ডপ্রুফ রাইডার লেদার জ্যাকেট',
        categoryBn: 'লেদার জ্যাকেট',
        price: 2850,
        originalPrice: 3800,
        discountPercent: 25,
        image: 'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?auto=format&fit=crop&w=600&q=80',
        tagBn: 'ওয়াটারপ্রুফ'
      },
      {
        id: 'women-hoodie-1',
        nameBn: 'মেয়েদের ড্রপ-শোল্ডার হুডি',
        categoryBn: 'মেয়েদের হুডি',
        price: 1150,
        originalPrice: 1600,
        discountPercent: 28,
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
        tagBn: 'ট্রেন্ডিং'
      },
      {
        id: 'kids-winter-1',
        nameBn: 'বাচ্চাদের থার্মাল ফ্লিস সেট',
        categoryBn: 'বাচ্চাদের শীতের পোশাক',
        price: 950,
        originalPrice: 1400,
        discountPercent: 32,
        image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=600&q=80',
        tagBn: 'সফট'
      }
    ]
  },
  {
    id: 'slide-exclusive',
    categoryTitleBn: 'হট ডিলস ও এক্সক্লুসিভ ফ্যাশন অফার',
    categoryTitleEn: 'Hot Deals & Festive Fashion',
    clothingItems: [
      {
        id: 'shirt-2',
        nameBn: 'এক্সিকিউটিভ হোয়াইট ফরমাল শার্ট',
        categoryBn: 'ফরমাল শার্ট',
        price: 1450,
        originalPrice: 1850,
        discountPercent: 21,
        image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80',
        tagBn: 'অফিস ওয়্যার'
      },
      {
        id: 'panjabi-1',
        nameBn: 'রয়্যাল ব্লু সেমিলং পাঞ্জাবি',
        categoryBn: 'উৎসব কালেকশন',
        price: 2150,
        originalPrice: 2800,
        discountPercent: 23,
        image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
        tagBn: 'বেস্ট সেলার'
      },
      {
        id: 'saree-1',
        nameBn: 'ঐতিহ্যবাহী জামদানি শাড়ি',
        categoryBn: 'জামদানি কালেকশন',
        price: 3850,
        originalPrice: 5200,
        discountPercent: 26,
        image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
        tagBn: 'স্পেশাল ছাড়'
      },
      {
        id: 'borka-1',
        nameBn: 'ফ্রন্ট-ওপেন দুবাই বোরকা',
        categoryBn: 'বোরকা কালেকশন',
        price: 2650,
        originalPrice: 3500,
        discountPercent: 24,
        image: 'https://images.unsplash.com/photo-1585728748178-f742f55ed462?auto=format&fit=crop&w=600&q=80',
        tagBn: 'চেরি জর্জেট'
      }
    ]
  }
];

export const HeroBanner: React.FC<HeroBannerProps> = ({
  language,
  onExploreProducts,
  openPromptModal,
  siteContent,
  products = [],
  onSelectProduct
}) => {
  const isBn = language === 'bn';
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isBannerPreviewOpen, setIsBannerPreviewOpen] = useState(false);
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

  const bannerImageSrc = siteContent.bannerUrl || '/assets/aistudio/SmartShop_Benar_786a522b.jpg';

  // Auto-change slides every 3.2 seconds
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % BANNER_SLIDES.length);
    }, 3200);

    return () => clearInterval(timer);
  }, [isPaused]);

  const currentSlide = BANNER_SLIDES[currentSlideIndex];

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % BANNER_SLIDES.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + BANNER_SLIDES.length) % BANNER_SLIDES.length);
  };

  const handleItemClick = (clothingItem: typeof currentSlide['clothingItems'][0]) => {
    if (onSelectProduct && products.length > 0) {
      const found = products.find((p) => p.id === clothingItem.id || p.categoryBn.includes(clothingItem.categoryBn));
      if (found) {
        onSelectProduct(found);
        return;
      }
    }
    onExploreProducts();
  };

  return (
    <div className="mx-4 mt-4 space-y-3 sm:space-y-4">
      {/* ============================================================== */}
      {/* 1. ORIGINAL BANNER GRAPHIC WITH DYNAMIC AUTO-ROTATING CLOTHES OVERLAY */}
      {/* ============================================================== */}
      <div 
        className="relative overflow-hidden rounded-2xl md:rounded-3xl shadow-xl border border-slate-200/90 bg-slate-900 group select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* BASE ORIGINAL GRAPHIC BANNER IMAGE (EXACT AS USER HAD) */}
        <img
          src={bannerImageSrc}
          alt="SmartShop BD Official Banner"
          className="w-full h-auto block object-cover md:object-contain transition-transform duration-500"
        />

        {/* ============================================================== */}
        {/* CENTER OVERLAY: DYNAMIC AUTO-ROTATING CLOTHING PRODUCTS SHOWCASE */}
        {/* Positioned directly over the clothes in the original banner image */}
        {/* ============================================================== */}
        <div 
          className="absolute z-20 flex items-center justify-center transition-all duration-500"
          style={{
            left: '46%',
            top: '22.8%',
            width: '31%',
            height: '31.5%'
          }}
        >
          {/* Background matching the banner's warm cream background */}
          <div className="relative w-full h-full rounded-lg sm:rounded-2xl bg-gradient-to-r from-[#fbf2e5] via-[#fef7ee] to-[#fbf1e3] shadow-inner flex items-center justify-center overflow-hidden border border-[#eddccb]/60">
            
            {/* Animated Clothing Cluster */}
            <div 
              key={currentSlide.id}
              className="relative w-full h-full flex items-center justify-center animate-fadeIn"
            >
              {currentSlide.clothingItems.map((item, idx) => {
                const zIndex = [30, 25, 20, 15][idx];
                const positionClasses = [
                  '-translate-x-10 sm:-translate-x-14 md:-translate-x-16 rotate-[-5deg] scale-90 sm:scale-95',
                  'translate-x-0 rotate-0 scale-100 sm:scale-105 z-30',
                  'translate-x-10 sm:translate-x-14 md:translate-x-16 rotate-[5deg] scale-90 sm:scale-95',
                  'translate-x-18 sm:translate-x-22 rotate-[8deg] scale-80 opacity-70 hidden md:block'
                ][idx];

                return (
                  <div
                    key={`${currentSlide.id}-${item.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleItemClick(item);
                    }}
                    onMouseEnter={() => setHoveredItemId(item.id)}
                    onMouseLeave={() => setHoveredItemId(null)}
                    style={{ zIndex }}
                    className={`absolute transition-all duration-500 transform hover:scale-120 hover:z-40 cursor-pointer ${positionClasses}`}
                  >
                    <div className="relative group/card bg-white/95 p-1 sm:p-1.5 rounded-lg sm:rounded-xl shadow-lg border border-amber-300/80 hover:border-orange-500 transition-all">
                      {/* Product Image */}
                      <div className="w-12 h-16 sm:w-16 sm:h-22 md:w-20 md:h-28 rounded-md sm:rounded-lg overflow-hidden bg-slate-100 relative">
                        <img
                          src={item.image}
                          alt={item.nameBn}
                          className="w-full h-full object-cover group-hover/card:scale-110 transition duration-300"
                        />
                        {/* Discount Pill */}
                        <div className="absolute top-0.5 left-0.5 bg-rose-600 text-white text-[7px] sm:text-[9px] font-black px-1 py-0.2 rounded shadow-2xs">
                          {item.discountPercent}%
                        </div>
                      </div>

                      {/* Mini Price Pill */}
                      <div className="mt-0.5 text-center">
                        <span className="text-[8px] sm:text-[10px] md:text-[11px] font-black text-rose-600 block leading-tight">
                          ৳{item.price}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Subtle "অটো চেঞ্জিং পণ্য" live indicator at the bottom of the clothes area */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-slate-900/85 backdrop-blur-xs text-amber-300 text-[7px] sm:text-[9px] font-bold px-1.5 sm:px-2 py-0.2 rounded-full whitespace-nowrap shadow-xs pointer-events-none flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>{currentSlide.categoryTitleBn}</span>
            </div>

          </div>
        </div>

        {/* ============================================================== */}
        {/* INTERACTIVE HOTSPOTS ON THE ORIGINAL BANNER */}
        {/* ============================================================== */}
        
        {/* Hotspot 1: Click Left Arrow on Banner to Prev Slide */}
        <button
          onClick={handlePrevSlide}
          style={{
            left: '20.5%',
            top: '36%',
            width: '4%',
            height: '6.5%'
          }}
          className="absolute z-30 rounded-full cursor-pointer hover:bg-orange-500/20 active:scale-90 transition opacity-0 hover:opacity-100"
          title={isBn ? 'পূর্ববর্তী পোশাক কালেকশন' : 'Previous Slide'}
          aria-label="Previous Slide"
        />

        {/* Hotspot 2: Click Right Arrow on Banner to Next Slide */}
        <button
          onClick={handleNextSlide}
          style={{
            left: '92.5%',
            top: '36%',
            width: '4%',
            height: '6.5%'
          }}
          className="absolute z-30 rounded-full cursor-pointer hover:bg-orange-500/20 active:scale-90 transition opacity-0 hover:opacity-100"
          title={isBn ? 'পরবর্তী পোশাক কালেকশন' : 'Next Slide'}
          aria-label="Next Slide"
        />

        {/* Hotspot 3: Click "এখনই কিনুন ->" button area on Banner */}
        <button
          onClick={onExploreProducts}
          style={{
            left: '24%',
            top: '43.5%',
            width: '14.5%',
            height: '7%'
          }}
          className="absolute z-30 rounded-xl cursor-pointer hover:bg-white/20 active:scale-95 transition"
          title={isBn ? 'কালেকশন দেখুন ও কিনুন' : 'Shop Now'}
          aria-label="Shop Now"
        />

        {/* Top Right Control Pill (Play/Pause & Fullscreen) */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex items-center gap-1.5 z-30">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="px-2 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md border border-white/20 shadow-xs transition active:scale-95 cursor-pointer flex items-center gap-1 text-[10px] sm:text-xs font-bold"
            title={isPaused ? (isBn ? 'অটো পরিবর্তন চালু করুন' : 'Resume Auto Change') : (isBn ? 'অটো পরিবর্তন থামান' : 'Pause')}
          >
            {isPaused ? (
              <>
                <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                <span className="hidden sm:inline text-emerald-300">{isBn ? 'চালু করুন' : 'Play'}</span>
              </>
            ) : (
              <>
                <Pause className="w-3 h-3 text-amber-400" />
                <span className="hidden sm:inline text-amber-200">{isBn ? 'অটো পরিবর্তন' : 'Auto'}</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsBannerPreviewOpen(true)}
            className="p-1 sm:p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md border border-white/20 shadow-xs transition active:scale-95 cursor-pointer"
            title={isBn ? 'ব্যানার বড় করে দেখুন' : 'View Full Banner'}
          >
            <Maximize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300" />
          </button>
        </div>

      </div>

      {/* ============================================================== */}
      {/* 2. SYNCED FEATURED CLOTHES BAR (MATCHING BANNER SLIDE) */}
      {/* Highly accessible for mobile shoppers & rapid 1-click checkout */}
      {/* ============================================================== */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-amber-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
            <h3 className="text-xs sm:text-sm font-black text-slate-900">
              {isBn ? 'ব্যানারে প্রদর্শিত বর্তমান পোশাক কালেকশন:' : 'Currently Changing on Banner:'}
            </h3>
            <span className="text-[11px] bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded-full border border-orange-200">
              {currentSlide.categoryTitleBn}
            </span>
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <button
              onClick={handlePrevSlide}
              className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
              title="পূর্ববর্তী"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1 px-1">
              {BANNER_SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    currentSlideIndex === idx ? 'w-5 bg-orange-600' : 'w-1.5 bg-slate-300 hover:bg-orange-300'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={handleNextSlide}
              className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
              title="পরবর্তী"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 Interactive Clothing Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-3">
          {currentSlide.clothingItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item)}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-50 hover:bg-orange-50/60 border border-slate-200 hover:border-orange-300 transition-all cursor-pointer group flex items-center gap-2.5 shadow-2xs"
            >
              <div className="w-12 h-14 sm:w-14 sm:h-16 rounded-lg overflow-hidden bg-white border border-slate-200 shrink-0">
                <img
                  src={item.image}
                  alt={item.nameBn}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-orange-600 font-bold block truncate">
                  {item.categoryBn}
                </span>
                <h4 className="text-xs font-black text-slate-900 truncate leading-tight group-hover:text-orange-700 transition">
                  {item.nameBn}
                </h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs font-black text-rose-600">
                    ৳{item.price}
                  </span>
                  <span className="text-[10px] text-slate-400 line-through">
                    ৳{item.originalPrice}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. TRUST & GUARANTEE PILLARS */}
      {/* ============================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
        
        {/* Pillar 1: Free Delivery */}
        <div className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-3 hover:border-orange-300 hover:shadow-md transition group">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition">
            <Truck className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
              {isBn ? 'ফ্রি ডেলিভারি' : 'Free Delivery'}
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5 truncate">
              {isBn ? 'সারা বাংলাদেশে দ্রুত ডেলিভারি' : 'All Over Bangladesh'}
            </p>
          </div>
        </div>

        {/* Pillar 2: 100% Original */}
        <div className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-3 hover:border-emerald-300 hover:shadow-md transition group">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
              {isBn ? '১০০% অরিজিনাল পণ্য' : '100% Genuine'}
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5 truncate">
              {isBn ? 'সেরা কোয়ালিটি নিশ্চয়তা' : 'Guaranteed Quality'}
            </p>
          </div>
        </div>

        {/* Pillar 3: Cash on Delivery */}
        <div className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-3 hover:border-emerald-300 hover:shadow-md transition group">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition">
            <Banknote className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
              {isBn ? 'ক্যাশ অন ডেলিভারি' : 'Cash on Delivery'}
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5 truncate">
              {isBn ? 'পণ্য হাতে পেয়ে পরিশোধ' : 'Pay Upon Delivery'}
            </p>
          </div>
        </div>

        {/* Pillar 4: 24/7 Support */}
        <div className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-3 hover:border-amber-300 hover:shadow-md transition group">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
              {isBn ? '২৪/৭ কাস্টমার সাপোর্ট' : '24/7 Support'}
            </h4>
            <p className="text-[11px] font-mono text-slate-600 font-bold mt-0.5 truncate">
              {siteContent.hotline}
            </p>
          </div>
        </div>

      </div>

      {/* ============================================================== */}
      {/* 4. FULL GRAPHIC BANNER LIGHTBOX MODAL */}
      {/* ============================================================== */}
      {isBannerPreviewOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsBannerPreviewOpen(false)}
        >
          <div 
            className="relative max-w-5xl w-full bg-slate-950 rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 bg-slate-900 flex items-center justify-between border-b border-slate-800 text-white">
              <span className="text-xs font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{isBn ? 'SmartShop BD অফিশিয়াল মূল ব্যানার' : 'SmartShop BD Official Banner'}</span>
              </span>
              <button
                onClick={() => setIsBannerPreviewOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-2 sm:p-4 bg-slate-900/60 overflow-auto flex items-center justify-center">
              <img
                src={bannerImageSrc}
                alt="SmartShop BD Full Banner Preview"
                className="max-h-[75vh] w-auto object-contain rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
