import React from 'react';
import { Product } from '../types';
import { ShoppingBag, Star, Zap, Eye, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  language: 'bn' | 'en';
  currency: 'BDT' | 'USD';
  onAddToCart: (product: Product) => void;
  onInstantBuy: (product: Product) => void;
  onQuickView: (product: Product) => void;
  isAddedToCart?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  language,
  currency,
  onAddToCart,
  onInstantBuy,
  onQuickView,
  isAddedToCart
}) => {
  const isBn = language === 'bn';

  // Currency conversion: 1 USD ~ 120 BDT
  const formatPrice = (bdtPrice: number) => {
    if (currency === 'USD') {
      const usd = (bdtPrice / 120).toFixed(2);
      return `$${usd}`;
    }
    return `৳${bdtPrice.toLocaleString('bn-BD')}`;
  };

  return (
    <div className="group relative bg-white border border-slate-200/80 rounded-2xl overflow-hidden hover:shadow-xl hover:border-rose-400 transition-all duration-300 flex flex-col justify-between">
      {/* Top Media Container */}
      <div className="relative aspect-square w-full bg-slate-50 overflow-hidden cursor-pointer" onClick={() => onQuickView(product)}>
        <img
          src={product.image}
          alt={isBn ? product.nameBn : product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
          {product.discountPercent && (
            <span className="bg-rose-600 text-white font-black text-[11px] px-2 py-0.5 rounded-full shadow-sm">
              -{product.discountPercent}%
            </span>
          )}
          {product.isFlashSale && (
            <span className="bg-amber-400 text-slate-900 font-extrabold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
              <Zap className="w-3 h-3 fill-slate-900 text-slate-900" />
              {isBn ? 'হট ডিল' : 'Flash Sale'}
            </span>
          )}
        </div>

        {/* Quick View Button overlay on hover */}
        <div className="absolute inset-0 bg-slate-900/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white/95 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 backdrop-blur-xs transform translate-y-2 group-hover:translate-y-0 transition-all border border-slate-200">
            <Eye className="w-3.5 h-3.5 text-rose-600" />
            <span>{isBn ? 'বিস্তারিত দেখুন' : 'Quick Details'}</span>
          </span>
        </div>
      </div>

      {/* Body Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div onClick={() => onQuickView(product)} className="cursor-pointer">
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-md text-[11px]">
              {isBn ? product.categoryBn : product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-400 font-normal">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 
            className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug hover:text-rose-600 transition"
            title={isBn ? product.nameBn : product.name}
          >
            {isBn ? product.nameBn : product.name}
          </h3>

          {/* Fabric snippet if available */}
          {product.fabricDetails && (
            <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 italic">
              🧵 {product.fabricDetails}
            </p>
          )}

          {/* Pricing */}
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-lg font-black text-slate-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
          {/* Instant Buy button */}
          <button
            onClick={() => onInstantBuy(product)}
            className="flex-1 py-2 px-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{isBn ? 'অর্ডার করুন' : 'Buy Now'}</span>
          </button>

          {/* Add to cart */}
          <button
            onClick={() => onAddToCart(product)}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1 transition active:scale-95 ${
              isAddedToCart
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'border-slate-300 hover:border-slate-400 text-slate-700 bg-white hover:bg-slate-50'
            }`}
            title={isBn ? 'কার্টে যোগ করুন' : 'Add to Cart'}
          >
            {isAddedToCart ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="sm:hidden">{isBn ? 'যোগ হয়েছে' : 'Added'}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-slate-600" />
                <span className="sm:hidden">{isBn ? 'কার্টে রাখুন' : 'Cart'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
