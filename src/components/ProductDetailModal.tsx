import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { 
  X, 
  Star, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  ShoppingBag, 
  Zap, 
  Check, 
  Sparkles, 
  Info, 
  FileText, 
  Scissors, 
  Shirt,
  Palette
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  language: 'bn' | 'en';
  currency: 'BDT' | 'USD';
  onAddToCart: (product: Product, quantity: number, color?: string, size?: string) => void;
  onInstantBuy: (product: Product, quantity: number, color?: string, size?: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  language,
  currency,
  onAddToCart,
  onInstantBuy
}) => {
  if (!isOpen || !product) return null;

  const isBn = language === 'bn';
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(product.colors?.[0]);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(product.sizes?.[0]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [detailTab, setDetailTab] = useState<'details' | 'specs'>('details');

  // Intelligent color image resolver: checks product.colorImages, fuzzy keys, or realistic smart fallbacks
  const resolveColorImage = (colorName?: string): string => {
    if (!product) return '';
    if (!colorName) return product.image;

    // Direct key in product.colorImages
    if (product.colorImages && product.colorImages[colorName]) {
      return product.colorImages[colorName];
    }

    // Fuzzy key matching in product.colorImages
    if (product.colorImages) {
      for (const [key, val] of Object.entries(product.colorImages)) {
        if (val && (colorName.includes(key) || key.includes(colorName))) {
          return val;
        }
      }
    }

    // Realistic smart photography fallbacks for common apparel colors if not explicitly provided
    const lower = colorName.toLowerCase();
    if (lower.includes('সাদা') || lower.includes('white')) {
      return 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80';
    }
    if (lower.includes('বাদামী') || lower.includes('brown')) {
      return 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80';
    }
    if (lower.includes('মেরুন') || lower.includes('maroon')) {
      return 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=800&q=80';
    }
    if (lower.includes('কালো') || lower.includes('black') || lower.includes('জেট ব্ল্যাক')) {
      return 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80';
    }
    if (lower.includes('অলিভ') || lower.includes('olive') || lower.includes('সবুজ')) {
      return 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80';
    }

    return product.image;
  };

  const [activeImage, setActiveImage] = useState<string>(() => resolveColorImage(product.colors?.[0]));

  // When product or selected color changes, update active image
  useEffect(() => {
    if (product) {
      setActiveImage(resolveColorImage(selectedColor));
    }
  }, [product, selectedColor]);

  const formatPrice = (bdtPrice: number) => {
    if (currency === 'USD') {
      return `$${(bdtPrice / 120).toFixed(2)}`;
    }
    return `৳${bdtPrice.toLocaleString('bn-BD')}`;
  };

  const handleAdd = () => {
    onAddToCart(product, quantity, selectedColor, selectedSize);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 1500);
  };

  const handleBuy = () => {
    onInstantBuy(product, quantity, selectedColor, selectedSize);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div 
        className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-auto flex flex-col md:flex-row max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition shadow-xs"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Product Image & Gallery Showcase */}
        <div className="md:w-5/12 bg-slate-50 relative p-5 sm:p-6 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-slate-200">
          <div className="w-full flex flex-col items-center">
            <div className="relative aspect-square w-full max-w-xs rounded-2xl overflow-hidden shadow-md bg-white border border-slate-200">
              <img
                src={activeImage || product.image}
                alt={isBn ? product.nameBn : product.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
              {product.discountPercent && (
                <span className="absolute top-3 left-3 bg-rose-600 text-white font-black text-xs px-2.5 py-1 rounded-full shadow-sm">
                  -{product.discountPercent}% {isBn ? 'মূল্যছাড়' : 'Off'}
                </span>
              )}
              {product.isFlashSale && (
                <span className="absolute bottom-3 left-3 bg-amber-400 text-slate-900 font-extrabold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                  <Sparkles className="w-3 h-3 text-slate-900" />
                  {isBn ? 'হট উইন্টার ডিল' : 'Special Deal'}
                </span>
              )}
            </div>

            {/* Thumbnail Row for Available Color Variants & Angles */}
            {product.colors && product.colors.length > 0 && (
              <div className="w-full max-w-xs mt-3 flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
                {/* Default main photo thumbnail */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedColor(undefined);
                    setActiveImage(product.image);
                  }}
                  className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 shrink-0 transition cursor-pointer ${
                    activeImage === product.image && !selectedColor
                      ? 'border-rose-600 ring-2 ring-rose-500/30'
                      : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-300'
                  }`}
                  title={isBn ? 'মূল ছবি' : 'Main Image'}
                >
                  <img src={product.image} alt="Main" className="w-full h-full object-cover" />
                </button>

                {/* Thumbnails for each color variant */}
                {product.colors.map((c) => {
                  const img = resolveColorImage(c);
                  const isCurrent = selectedColor === c || activeImage === img;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setSelectedColor(c);
                        setActiveImage(img);
                      }}
                      className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 shrink-0 transition cursor-pointer ${
                        isCurrent
                          ? 'border-rose-600 ring-2 ring-rose-500/30'
                          : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-300'
                      }`}
                      title={c}
                    >
                      <img src={img} alt={c} className="w-full h-full object-cover" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick highlights under image */}
          <div className="w-full mt-3 grid grid-cols-2 gap-2 text-center text-[11px] text-slate-600">
            <div className="p-2 bg-white rounded-xl border border-slate-200">
              <Truck className="w-4 h-4 mx-auto text-rose-600 mb-0.5" />
              <span className="font-semibold">{isBn ? 'দ্রুত হোম ডেলিভারি' : 'Fast Delivery'}</span>
            </div>
            <div className="p-2 bg-white rounded-xl border border-slate-200">
              <ShieldCheck className="w-4 h-4 mx-auto text-emerald-600 mb-0.5" />
              <span className="font-semibold">{isBn ? '১০০% অরিজিনাল কোয়ালিটি' : '100% Original'}</span>
            </div>
          </div>
        </div>

        {/* Right: Detailed Info, Specs & Purchase */}
        <div className="md:w-7/12 p-5 sm:p-7 overflow-y-auto flex flex-col justify-between space-y-4">
          <div>
            {/* Category Pill & Rating */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="bg-rose-50 text-rose-800 text-xs font-bold px-2.5 py-0.5 rounded-md border border-rose-200">
                {isBn ? product.categoryBn : product.category}
              </span>
              <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                <span className="text-slate-400 font-normal">({product.reviewsCount} {isBn ? 'রিভিউ' : 'reviews'})</span>
              </div>
            </div>

            {/* Product Title */}
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 leading-snug">
              {isBn ? product.nameBn : product.name}
            </h2>

            {/* Pricing Section */}
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-black text-rose-600">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-sm sm:text-base text-slate-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                {isBn ? 'স্টকে আছে' : 'In Stock'}
              </span>
            </div>

            {/* Detail Tabs */}
            <div className="flex border-b border-slate-200 mt-4 gap-4 text-xs font-bold">
              <button
                onClick={() => setDetailTab('details')}
                className={`pb-2 border-b-2 flex items-center gap-1.5 transition ${
                  detailTab === 'details'
                    ? 'border-rose-600 text-rose-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Info className="w-3.5 h-3.5" />
                <span>{isBn ? 'বিস্তারিত বিবরণ' : 'Description'}</span>
              </button>
              <button
                onClick={() => setDetailTab('specs')}
                className={`pb-2 border-b-2 flex items-center gap-1.5 transition ${
                  detailTab === 'specs'
                    ? 'border-rose-600 text-rose-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>{isBn ? 'ফ্যাব্রিক ও স্পেসিফিকেশন' : 'Specifications'}</span>
              </button>
            </div>

            {/* Tab 1: Detailed Description */}
            {detailTab === 'details' && (
              <div className="mt-3 space-y-3 animate-in fade-in duration-200">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <h4 className="text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-rose-600" />
                    <span>{isBn ? 'পণ্যের বিবরণ:' : 'Product Overview:'}</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {isBn ? product.descriptionBn : product.description}
                  </p>
                </div>

                {product.fabricDetails && (
                  <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-200/80 flex items-start gap-2 text-xs">
                    <Shirt className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-rose-900">{isBn ? 'কাপড় ও ফ্যাব্রিক:' : 'Fabric Material:'} </span>
                      <span className="text-rose-800">{product.fabricDetails}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Specifications Table */}
            {detailTab === 'specs' && (
              <div className="mt-3 animate-in fade-in duration-200">
                {product.specifications && product.specifications.length > 0 ? (
                  <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                    {product.specifications.map((spec, i) => (
                      <div key={i} className="flex p-2.5 bg-white hover:bg-slate-50 transition">
                        <span className="w-1/3 font-bold text-slate-700">{spec.label}:</span>
                        <span className="w-2/3 text-slate-600">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 p-3 bg-slate-50 rounded-xl">
                    {isBn ? '১০০% অরিজিনাল কোয়ালিটি ফ্যাব্রিক ও নিখুঁত সেলাই গ্যারান্টি।' : '100% Genuine original quality fabric.'}
                  </p>
                )}
              </div>
            )}

            {/* Color variants selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-4 p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200/90 shadow-2xs">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <label className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-rose-600" />
                    <span>{isBn ? 'পছন্দের কালার / রঙ নির্বাচন করুন:' : 'Choose Color:'}</span>
                  </label>

                  {/* Cancel / Clear Color Button */}
                  {selectedColor && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedColor(undefined);
                        setActiveImage(product.image);
                      }}
                      className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 transition cursor-pointer"
                      title={isBn ? 'রং নির্বাচন বাতিল করুন' : 'Clear color selection'}
                    >
                      <X className="w-3 h-3" />
                      <span>{isBn ? 'কালার বাতিল করুন' : 'Clear Color'}</span>
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => {
                    const isSelected = selectedColor === color;
                    const variantImg = resolveColorImage(color);

                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            // Tapping currently active color deselects it!
                            setSelectedColor(undefined);
                            setActiveImage(product.image);
                          } else {
                            setSelectedColor(color);
                            setActiveImage(variantImg);
                          }
                        }}
                        className={`px-3 py-1.5 text-xs rounded-xl font-bold border transition flex items-center gap-2 cursor-pointer active:scale-95 ${
                          isSelected
                            ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/20'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {variantImg && (
                          <img
                            src={variantImg}
                            alt={color}
                            className="w-4 h-4 rounded-full object-cover border border-white/40 shrink-0"
                          />
                        )}
                        <span>{color}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 ml-0.5 text-emerald-400" />}
                      </button>
                    );
                  })}

                  {/* Explicit "No Color / Cancel Color" option button */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedColor(undefined);
                      setActiveImage(product.image);
                    }}
                    className={`px-3 py-1.5 text-xs rounded-xl font-medium border border-dashed transition flex items-center gap-1 cursor-pointer active:scale-95 ${
                      !selectedColor
                        ? 'bg-rose-50 border-rose-400 text-rose-800 font-bold'
                        : 'bg-white border-slate-300 text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <span>{isBn ? '🚫 কোনো কালার নয় (রং বাতিল)' : '🚫 No specific color'}</span>
                  </button>
                </div>

                {/* Helper prompt below colors */}
                {selectedColor ? (
                  <p className="text-[11px] text-slate-600 mt-2 flex items-center gap-1.5">
                    <span>{isBn ? 'বর্তমানে দেখাচ্ছে:' : 'Viewing:'}</span>
                    <strong className="text-slate-900 font-bold">{selectedColor}</strong>
                    <span className="text-slate-400 font-normal">
                      {isBn ? '• (আবার চাপলে বা "কালার বাতিল" বাটনে চাপলে রঙ বাদ যাবে)' : '• (tap again to clear)'}
                    </span>
                  </p>
                ) : (
                  <p className="text-[11px] text-amber-700 font-medium mt-2 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200/60 inline-flex items-center gap-1">
                    <span>{isBn ? '✓ কোনো নির্দিষ্ট রঙ নির্বাচন করা নেই — স্ট্যান্ডার্ড প্রোডাক্ট হিসেবে যোগ হবে' : '✓ Standard product without specific color'}</span>
                  </p>
                )}
              </div>
            )}

            {/* Size variants selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-3.5">
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  {isBn ? 'সাইজ নির্বাচন করুন:' : 'Choose Size:'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1.5 text-xs rounded-xl font-bold border transition ${
                        selectedSize === size
                          ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Modifier */}
            <div className="mt-4 flex items-center gap-3">
              <label className="text-xs font-bold text-slate-800">
                {isBn ? 'পরিমাণ:' : 'Quantity:'}
              </label>
              <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-slate-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-slate-600 hover:bg-slate-200 font-bold"
                >
                  -
                </button>
                <span className="px-3 py-1 text-xs font-bold text-slate-800 min-w-[36px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 text-slate-600 hover:bg-slate-200 font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={handleBuy}
              className="flex-1 py-3 px-4 bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-black text-sm rounded-xl shadow-lg shadow-rose-600/25 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>{isBn ? 'সরাসরি অর্ডার করুন (Buy Now)' : 'Direct Order (Buy Now)'}</span>
            </button>

            <button
              onClick={handleAdd}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm border transition flex items-center justify-center gap-2 cursor-pointer ${
                isSuccess
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-400'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
              }`}
            >
              {isSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{isBn ? 'কার্টে যোগ করা হয়েছে!' : 'Added to Cart!'}</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-slate-600" />
                  <span>{isBn ? 'কার্টে রাখুন' : 'Add to Cart'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
