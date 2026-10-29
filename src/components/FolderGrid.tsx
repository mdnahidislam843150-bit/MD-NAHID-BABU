import React from 'react';
import { ProductFolder, Product } from '../types';
import { Folder, FolderOpen, ArrowRight, Layers, Sparkles } from 'lucide-react';

interface FolderGridProps {
  folders: ProductFolder[];
  products: Product[];
  selectedFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
  language: 'bn' | 'en';
}

export const FolderGrid: React.FC<FolderGridProps> = ({
  folders,
  products,
  selectedFolderId,
  onSelectFolder,
  language
}) => {
  const isBn = language === 'bn';

  // Count items per folder
  const getProductCount = (folderId: string) => {
    return products.filter((p) => p.folderId === folderId).length;
  };

  return (
    <div className="space-y-4">
      {/* Folder Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <Folder className="w-4 h-4" />
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              {isBn ? 'পোশাকের ক্যাটাগরি ফোল্ডারসমূহ' : 'Product Category Folders'}
            </h2>
            <span className="text-xs bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded-full border border-rose-200">
              {folders.length} {isBn ? 'টি ফোল্ডার' : 'Folders'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {isBn 
              ? 'যেকোনো ফোল্ডারে ক্লিক করে সেই ক্যাটাগরির সমস্ত পণ্য দেখুন' 
              : 'Click any folder below to browse all items in that category'}
          </p>
        </div>

        {selectedFolderId && (
          <button
            onClick={() => onSelectFolder(null)}
            className="self-start sm:self-auto px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <span>{isBn ? '← সব ফোল্ডার দেখুন' : '← All Folders'}</span>
          </button>
        )}
      </div>

      {/* Grid of Folders */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {folders.map((folder) => {
          const count = getProductCount(folder.id);
          const isSelected = selectedFolderId === folder.id;

          return (
            <div
              key={folder.id}
              onClick={() => onSelectFolder(isSelected ? null : folder.id)}
              className={`group relative p-3 sm:p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden ${
                isSelected
                  ? 'bg-rose-50/90 border-rose-500 shadow-md ring-2 ring-rose-500/30'
                  : 'bg-white border-slate-200/90 hover:border-rose-400 hover:shadow-lg'
              }`}
            >
              {/* Folder tab design accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 opacity-80" />

              <div>
                {/* Thumbnail Preview Image with Folder Icon badge */}
                <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden bg-slate-100 mb-2.5">
                  <img
                    src={folder.coverImage}
                    alt={folder.nameBn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                  {/* Icon badge */}
                  <div className="absolute top-2 left-2 w-7 h-7 rounded-lg bg-white/90 backdrop-blur-xs flex items-center justify-center text-sm shadow-sm">
                    {folder.icon}
                  </div>

                  {/* Items count badge */}
                  <div className="absolute bottom-1.5 right-2 text-[10px] font-bold text-white bg-slate-900/80 px-2 py-0.5 rounded-full backdrop-blur-xs">
                    {count} {isBn ? 'আইটেম' : 'items'}
                  </div>
                </div>

                {/* Folder Title */}
                <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm line-clamp-1 group-hover:text-rose-600 transition flex items-center gap-1">
                  <span>{isBn ? folder.nameBn : folder.nameEn}</span>
                </h3>

                <p className="text-[10px] sm:text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                  {folder.descriptionBn}
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold">
                <span className={isSelected ? 'text-rose-600' : 'text-slate-600 group-hover:text-rose-600'}>
                  {isSelected ? (isBn ? 'খোলা আছে' : 'Opened') : (isBn ? 'ফোল্ডার খুলুন' : 'Open')}
                </span>
                <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'rotate-90 text-rose-600' : 'group-hover:translate-x-1 text-slate-400'}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
