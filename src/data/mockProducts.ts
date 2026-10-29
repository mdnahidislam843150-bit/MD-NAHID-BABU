import { Product, ProductFolder, Coupon, SiteContent, UserProfile } from '../types';

export const PRODUCT_FOLDERS: ProductFolder[] = [
  {
    id: 'folder-shirt',
    nameBn: 'শার্ট কালেকশন',
    nameEn: 'Shirts Collection',
    icon: '👔',
    coverImage: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    descriptionBn: 'প্রিমিয়াম সুতি ফর্মাল, ক্যাজুয়াল ও ডেনিম শার্ট',
    tag: 'শার্ট'
  },
  {
    id: 'folder-tshirt',
    nameBn: 'টি-শার্ট কালেকশন',
    nameEn: 'T-Shirts Collection',
    icon: '👕',
    coverImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    descriptionBn: 'ড্রপ-শোল্ডার, পোলো ও কম্বড কটন টি-শার্ট',
    tag: 'টি-শার্ট'
  },
  {
    id: 'folder-panjabi',
    nameBn: 'পাঞ্জাবি কালেকশন',
    nameEn: 'Panjabi Collection',
    icon: '✨',
    coverImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    descriptionBn: 'ডিজাইনার এমব্রয়ডারি ও সুতি সেমিলং পাঞ্জাবি',
    tag: 'পাঞ্জাবি'
  },
  {
    id: 'folder-pant',
    nameBn: 'প্যান্ট কালেকশন',
    nameEn: 'Pants & Chinos',
    icon: '👖',
    coverImage: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
    descriptionBn: 'স্ট্রেচেবল টুইল গ্যাবার্ডিন ও ডেনিম প্যান্ট',
    tag: 'প্যান্ট'
  },
  {
    id: 'folder-hoodie',
    nameBn: 'ছেলেদের হুডি',
    nameEn: 'Men\'s Hoodies',
    icon: '🧥',
    coverImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    descriptionBn: '৩২০ জিএসএম ভারী ব্রাশড ফ্লিস উইন্টার হুডি',
    tag: 'হুডি'
  },
  {
    id: 'folder-jacket',
    nameBn: 'ছেলেদের জ্যাকেট',
    nameEn: 'Men\'s Jackets',
    icon: '🏍️',
    coverImage: 'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?auto=format&fit=crop&w=800&q=80',
    descriptionBn: 'উইন্ডপ্রুফ লেদার ও প্রিমিয়াম বম্বার জ্যাকেট',
    tag: 'জ্যাকেট'
  },
  {
    id: 'folder-threepiece',
    nameBn: 'থ্রি পিস কালেকশন',
    nameEn: 'Three-Piece Collection',
    icon: '👗',
    coverImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    descriptionBn: 'এমব্রয়ডারি কটন লন ও পিওর শিফন ওড়না থ্রি-পিস',
    tag: 'থ্রি-পিস'
  },
  {
    id: 'folder-saree',
    nameBn: 'শাড়ি কালেকশন',
    nameEn: 'Saree Collection',
    icon: '🥻',
    coverImage: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    descriptionBn: 'তাঁতের খাঁটি ঢাকাই জামদানি ও সিল্ক শাড়ি',
    tag: 'শাড়ি'
  },
  {
    id: 'folder-borka',
    nameBn: 'বোরকা ও আবায়া',
    nameEn: 'Borka & Abaya',
    icon: '🧕',
    coverImage: 'https://images.unsplash.com/photo-1585728748178-f742f55ed462?auto=format&fit=crop&w=800&q=80',
    descriptionBn: 'আসল দুবাই চেরি জর্জেট ফ্রন্ট-ওপেন আবায়া',
    tag: 'বোরকা'
  },
  {
    id: 'folder-hijab',
    nameBn: 'হিজাব কালেকশন',
    nameEn: 'Hijab Collection',
    icon: '🧣',
    coverImage: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
    descriptionBn: 'সফট বাবল শিফন ও জর্জেট ম্যাক্সি হিজাব',
    tag: 'হিজাব'
  },
  {
    id: 'folder-lehenga',
    nameBn: 'লেহেঙ্গা কালেকশন',
    nameEn: 'Lehenga Choli',
    icon: '👑',
    coverImage: 'https://images.unsplash.com/photo-1583391733975-0886b62ec857?auto=format&fit=crop&w=800&q=80',
    descriptionBn: 'ব্রাইডাল ও পার্টি হেভি এমব্রয়ডারি সিল্ক লেহেঙ্গা',
    tag: 'লেহেঙ্গা'
  },
  {
    id: 'folder-women-hoodie',
    nameBn: 'মেয়েদের হুডি',
    nameEn: 'Women\'s Hoodies',
    icon: '👚',
    coverImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    descriptionBn: 'সফট উইন্টার ড্রপ-শোল্ডার ফ্লিস হুডি',
    tag: 'মেয়েদের হুডি'
  },
  {
    id: 'folder-women-jacket',
    nameBn: 'মেয়েদের জ্যাকেট',
    nameEn: 'Women\'s Jackets',
    icon: '🧥',
    coverImage: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
    descriptionBn: 'উইন্ডপ্রুফ কুইল্টেড পাফার ও ডেনিম জ্যাকেট',
    tag: 'মেয়েদের জ্যাকেট'
  },
  {
    id: 'folder-bag',
    nameBn: 'মেয়েদের ব্যাগ',
    nameEn: 'Ladies Handbags',
    icon: '👜',
    coverImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    descriptionBn: 'স্ক্র্যাচ-রেজিস্ট্যান্ট ক্লাসি শোল্ডার ও হ্যান্ডব্যাগ',
    tag: 'মেয়েদের ব্যাগ'
  },
  {
    id: 'folder-shoes',
    nameBn: 'জুতা কালেকশন',
    nameEn: 'Footwear & Shoes',
    icon: '👞',
    coverImage: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80',
    descriptionBn: 'জেনুইন লেদার লোফার, ফরমাল জুতা ও হিলস',
    tag: 'জুতা'
  },
  {
    id: 'folder-kids-winter',
    nameBn: 'বাচ্চাদের শীতের কাপড়',
    nameEn: 'Kids Winter Wear',
    icon: '👶',
    coverImage: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=800&q=80',
    descriptionBn: 'নরম স্কিন-ফ্রেন্ডলি থার্মাল ফ্লিস জ্যাকেট ও প্যান্ট',
    tag: 'বাচ্চাদের শীতের কাপড়'
  },
  {
    id: 'folder-kids-toys',
    nameBn: 'বাচ্চাদের খেলনা',
    nameEn: 'Kids Toys',
    icon: '🚗',
    coverImage: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=800&q=80',
    descriptionBn: 'রিচার্জেবল রিমোট কন্ট্রোল স্টান্ট কার ও শিক্ষণীয় খেলনা',
    tag: 'বাচ্চাদের খেলনা'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  // 1. শার্ট (Shirts Folder)
  {
    id: 'shirt-1',
    name: 'Premium Oxford Cotton Semi-Casual Men\'s Shirt',
    nameBn: 'প্রিমিয়াম ১০০% কটন অক্সফোর্ড ক্যাজুয়াল শার্ট',
    folderId: 'folder-shirt',
    category: 'Mens',
    categoryBn: 'ছেলেদের পোশাক',
    price: 1350,
    originalPrice: 1750,
    rating: 4.8,
    reviewsCount: 142,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    stockCount: 45,
    isFlashSale: true,
    discountPercent: 23,
    description: '100% fine combed cotton oxford weave, tailored slim fit, wrinkle-resistant finish with premium pearlized buttons.',
    descriptionBn: '১০০% ফাইন কম্বড সুতি অক্সফোর্ড কাপড়ে তৈরি, নিখুঁত স্লিম ফিট সেলাই ও কালার গ্যারান্টি। অফিস, পার্টি ও ক্যাজুয়াল আড্ডায় পরার উপযোগী।',
    fabricDetails: '১০০% পিওর কটন অক্সফোর্ড ফ্যাব্রিক (৮০ কাউন্ট সুতা)',
    specifications: [
      { label: 'ফ্যাব্রিক', value: '১০০% প্রিমিয়াম সুতি (Oxford Weave)' },
      { label: 'ফিটিং', value: 'স্লিম ফিট (Tailored Slim Fit)' },
      { label: 'কলার স্টাইল', value: 'ক্লাসিক বাটন ডাউন কলার' },
      { label: 'হাতা', value: 'ফুল হাতা (Full Sleeve)' },
      { label: 'ওয়াশ কেয়ার', value: 'মেশিন ওয়াশ বা হ্যান্ড ওয়াশ' }
    ],
    tags: ['shirt', 'শার্ট', 'formal', 'casual', 'men', 'cotton'],
    colors: ['আকাশী নীল (Sky Blue)', 'সাদা (Pure White)', 'নেভি ব্লু (Navy Blue)'],
    sizes: ['M (৩৮)', 'L (৪০)', 'XL (৪২)', 'XXL (৪৪)']
  },
  {
    id: 'shirt-2',
    name: 'Executive White Formal Office Shirt',
    nameBn: 'এক্সিকিউটিভ পিওর হোয়াইট ফরমাল অফিস শার্ট',
    folderId: 'folder-shirt',
    category: 'Mens',
    categoryBn: 'ছেলেদের পোশাক',
    price: 1450,
    originalPrice: 1850,
    rating: 4.9,
    reviewsCount: 96,
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    stockCount: 30,
    isFlashSale: false,
    discountPercent: 21,
    description: 'Ultra-crisp easy-care formal white shirt for corporate executives and meetings.',
    descriptionBn: 'অফিস মিটিং ও কর্পোরেট প্রেজেন্টেশনের জন্য প্রিমিয়াম ডবল প্লাই ইজিকার কটন শার্ট। আয়রন ধরে রাখে সারাদিন।',
    fabricDetails: 'ডবল প্লাই ইজিকার ১০০% সুতি কাপড়',
    specifications: [
      { label: 'ফ্যাব্রিক', value: '১০০% মিশরীয় গিজা সুতি' },
      { label: 'ফিটিং', value: 'রেগুলার ও স্লিম ফিট' },
      { label: 'কলার', value: 'স্প্রেড কলার (টাই পরার উপযোগী)' },
      { label: 'বাটন', value: 'হাই-গ্রেড মাদার অব পার্ল বাটন' }
    ],
    tags: ['shirt', 'শার্ট', 'white', 'formal'],
    colors: ['ধবধবে সাদা (Crisp White)'],
    sizes: ['M (৩৮)', 'L (৪০)', 'XL (৪২)', 'XXL (৪৪)']
  },
  {
    id: 'shirt-3',
    name: 'Washed Denim Casual Indigo Shirt',
    nameBn: 'ওয়াশড ইন্ডিগো ব্লু ডেনিম ক্যাজুয়াল শার্ট',
    folderId: 'folder-shirt',
    category: 'Mens',
    categoryBn: 'ছেলেদের পোশাক',
    price: 1550,
    originalPrice: 1990,
    rating: 4.7,
    reviewsCount: 84,
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    stockCount: 25,
    isFlashSale: true,
    discountPercent: 22,
    description: 'Lightweight breathable denim shirt with dual chest flap pockets and snap buttons.',
    descriptionBn: 'হালকা ওজনের সফট ওয়াশড ডেনিম শার্ট। দুটি চেস্ট পকেট ও প্রিমিয়াম স্ন্যাপ বাটন সমৃদ্ধ।',
    fabricDetails: '৬.৫ আউন্স ১০০% সফট ডেনিম কটন',
    specifications: [
      { label: 'ফ্যাব্রিক', value: 'সফট ওয়াশড ডেনিম' },
      { label: 'পকেট', value: 'ডাবল ফ্রন্ট ফ্ল্যাপ পকেট' },
      { label: 'স্টাইল', value: 'ক্যাজুয়াল উইকএন্ড ওয়্যার' }
    ],
    tags: ['shirt', 'শার্ট', 'denim', 'casual'],
    colors: ['ইন্ডিগো ব্লু (Indigo Blue)', 'লাইট ওয়াশ ব্লু (Light Wash)'],
    sizes: ['M', 'L', 'XL']
  },

  // 2. টি-শার্ট (T-Shirt Folder)
  {
    id: 'tshirt-1',
    name: 'Drop-Shoulder Heavy Cotton Graphic T-Shirt',
    nameBn: 'ড্রপ-শোল্ডার প্রিমিয়াম কম্বড কটন টি-শার্ট (২২০ জিএসএম)',
    folderId: 'folder-tshirt',
    category: 'Mens',
    categoryBn: 'ছেলেদের পোশাক',
    price: 590,
    originalPrice: 850,
    rating: 4.9,
    reviewsCount: 230,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    stockCount: 65,
    isFlashSale: false,
    discountPercent: 30,
    description: '220 GSM 100% bio-washed cotton, trendy relaxed drop shoulder fit with durable silicone aesthetic print.',
    descriptionBn: '২২০ জিএসএম ১০০% প্রিমিয়াম সুতি বায়ো-ওয়াশড ফ্যাব্রিক। আরামদায়ক ওভারসাইজড ড্রপ-শোল্ডার লুক ও দীর্ঘস্থায়ী স্ক্রিন প্রিন্ট।',
    fabricDetails: '২২০ জিএসএম হেভিওয়েট বায়ো-ওয়াশড কম্বড কটন',
    specifications: [
      { label: 'জিএসএম (GSM)', value: '২২০ জিএসএম (Heavy GSM)' },
      { label: 'কাটিং', value: 'ওভারসাইজড ড্রপ শোল্ডার (Relaxed Fit)' },
      { label: 'নেকলাইন', value: 'লাইক্রা রিবড ক্রু নেক' }
    ],
    tags: ['tshirt', 'টি-শার্ট', 'dropshoulder', 'men', 'casual'],
    colors: ['জেট ব্ল্যাক (Jet Black)', 'অলিভ গ্রিন (Olive Green)', 'অ্যাশ গ্রে (Ash Grey)'],
    sizes: ['M', 'L', 'XL', 'XXL']
  },
  {
    id: 'tshirt-2',
    name: 'Pure Cotton Classic Collar Polo T-Shirt',
    nameBn: 'ম্যাটি কটন সলিড কালার পোলো টি-শার্ট',
    folderId: 'folder-tshirt',
    category: 'Mens',
    categoryBn: 'ছেলেদের পোশাক',
    price: 690,
    originalPrice: 950,
    rating: 4.8,
    reviewsCount: 178,
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    stockCount: 50,
    isFlashSale: true,
    discountPercent: 27,
    description: 'Honeycombed pique cotton polo shirt with ribbed cuffs and collar.',
    descriptionBn: 'হানি-কম্বড পিকে কটন পোলো টি-শার্ট। নিখুঁত কলার ও আরামদায়ক হাতার গ্রিপ।',
    fabricDetails: '২৩০ জিএসএম ১০০% ম্যাটি সুতি ফ্যাব্রিক',
    specifications: [
      { label: 'ফ্যাব্রিক', value: '১০০% কটন পিকে ম্যাটি' },
      { label: 'কলার', value: 'রিবড কলার উইথ বাটন' }
    ],
    tags: ['tshirt', 'টি-শার্ট', 'polo'],
    colors: ['নেভি ব্লু (Navy Blue)', 'ব্লাক (Black)', 'মেরুন (Maroon)'],
    sizes: ['M', 'L', 'XL', 'XXL']
  },
  {
    id: 'tshirt-polo-zipper',
    name: 'Premium Zipper Collar Striped Polo T-Shirt',
    nameBn: 'প্রিমিয়াম পোলো টি-শার্ট',
    folderId: 'folder-tshirt',
    category: 'Mens',
    categoryBn: 'ছেলেদের পোশাক',
    price: 851,
    originalPrice: 999,
    rating: 4.9,
    reviewsCount: 142,
    image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    stockCount: 45,
    isFlashSale: true,
    discountPercent: 15,
    description: 'Black & White and Maroon Polo T-Shirt with half-zip collar and stylish double white stripes.',
    descriptionBn: 'স্টাইলিশ ও আধুনিক লুকের জন্য এই Polo T-Shirt হতে পারে দারুণ একটি পছন্দ। প্রিমিয়াম বডির সঙ্গে সাদা কলার ও ডাবল সাদা স্ট্রাইপ ডিজাইন টি-শার্টটিকে দিয়েছে ইউনিক ও স্মার্ট লুক। সামনে হাফ-জিপ ডিজাইন থাকায় ক্যাজুয়াল ও ফ্যাশনেবল—দুই ধরনের স্টাইলেই মানানসই।',
    fabricDetails: '২২০ GSM ১০০% কম্বড সুতি কাপড়',
    specifications: [
      { label: 'ফ্যাব্রিক', value: '১০০% কম্বড কটন পিকে' },
      { label: 'কলার ও জিপ', value: 'কন্ট্রাস্ট হোয়াইট কলার উইথ মেটাল হাফ-জিপ' },
      { label: 'ডিজাইন', value: 'ডাবল ফ্রন্ট ভার্টিক্যাল স্ট্রাইপ' },
      { label: 'ফিটিং', value: 'স্মার্ট স্লিম ফিট' }
    ],
    tags: ['tshirt', 'টি-শার্ট', 'polo', 'পোলো', 'zipper'],
    colors: ['জেট ব্ল্যাক (Jet Black)', 'অলিভ গ্রিন (Olive)', 'মেরুন (Maroon)', 'বাদামী (Brown)', 'সাদা (White)'],
    colorImages: {
      'মেরুন (Maroon)': 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=800&q=80',
      'সাদা (White)': 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80',
      'বাদামী (Brown)': 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80',
      'জেট ব্ল্যাক (Jet Black)': 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
      'অলিভ গ্রিন (Olive)': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'
    },
    sizes: ['M (চেস্ট ৪০)', 'L (চেস্ট ৪২)', 'XL (চেস্ট ৪৪)', 'M', 'L', 'XL']
  },

  // 3. পাঞ্জাবি (Panjabi Folder)
  {
    id: 'panjabi-1',
    name: 'Exclusive Festive Embroidered Semilong Panjabi',
    nameBn: 'এক্সক্লুসিভ ডিজিটাল প্রিন্ট ও এমব্রয়ডারি সেমিলং পাঞ্জাবি',
    folderId: 'folder-panjabi',
    category: 'Mens',
    categoryBn: 'ছেলেদের পোশাক',
    price: 2450,
    originalPrice: 3200,
    rating: 5.0,
    reviewsCount: 380,
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    stockCount: 30,
    isFlashSale: true,
    discountPercent: 23,
    description: 'Designer festive semi-long panjabi made with viscose-cotton blend, delicate thread embroidery on collar and placket with metal snap buttons.',
    descriptionBn: 'উচ্চমানের সফট ভিসকোস কটন ব্লেন্ড কাপড়ে তৈরি। কলার ও প্লেকেটে নিখুঁত কারচুপির কাজ ও মেটালিক স্ন্যাপ বাটন। ঈদ, জুম্মা ও উৎসবের সেরা পছন্দ।',
    fabricDetails: 'প্রিমিয়াম সফট ভিসকোস ও কটন ব্লেন্ড ফ্যাব্রিক',
    specifications: [
      { label: 'কাজের ধরন', value: 'সূক্ষ্ম কারচুপি ও সুতোর এমব্রয়ডারি' },
      { label: 'কাটিং', value: 'সেমিলং স্মার্ট ফিট' },
      { label: 'বোতাম', value: 'মেটালিক ব্রাস স্ন্যাপ বাটন' },
      { label: 'পকেট', value: 'দুই পাশে ইন-সিম গভীর পকেট' }
    ],
    tags: ['panjabi', 'পাঞ্জাবি', 'festive', 'traditional', 'eid', 'men'],
    colors: ['রয়েল মেরুন (Royal Maroon)', 'আইভরি হোয়াইট (Ivory White)', 'মিডনাইট ব্লু (Midnight Blue)'],
    sizes: ['৩৮ (38)', '৪০ (40)', '৪২ (42)', '৪৪ (44)']
  },
  {
    id: 'panjabi-2',
    name: 'Daily Wear Cotton Casual Striped Panjabi',
    nameBn: 'খাঁটি দেশি সুতি ক্যাজুয়াল স্ট্রাইপড পাঞ্জাবি',
    folderId: 'folder-panjabi',
    category: 'Mens',
    categoryBn: 'ছেলেদের পোশাক',
    price: 1350,
    originalPrice: 1750,
    rating: 4.8,
    reviewsCount: 160,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    stockCount: 40,
    isFlashSale: false,
    discountPercent: 23,
    description: '100% pure handloom cotton panjabi for daily comfort in summer and year-round.',
    descriptionBn: '১০০% তাঁতের খাঁটি সুতি কাপড়ে তৈরি অত্যন্ত আরামদায়ক ও ঘাম-শোষক পাঞ্জাবি। প্রতিদিনের ব্যবহারের জন্য উপযুক্ত।',
    fabricDetails: '১০০% হ্যান্ডলুম সুতি ফ্যাব্রিক',
    specifications: [
      { label: 'ফ্যাব্রিক', value: '১০০% দেশি কটন' },
      { label: 'স্টাইল', value: 'ক্যাজুয়াল রেগুলার ফিট' }
    ],
    tags: ['panjabi', 'পাঞ্জাবি', 'cotton'],
    colors: ['অফ-হোয়াইট (Off White)', 'লাইট ব্লু (Light Blue)'],
    sizes: ['৩৮ (38)', '৪০ (40)', '৪২ (42)', '৪৪ (44)']
  },

  // 4. প্যান্ট (Pants Folder)
  {
    id: 'pant-1',
    name: 'Men\'s Stretch Twill Chino & Gabardine Pants',
    nameBn: 'স্ট্রেচ টুইল গ্যাবার্ডিন স্লিম ফিট প্যান্ট',
    folderId: 'folder-pant',
    category: 'Mens',
    categoryBn: 'ছেলেদের পোশাক',
    price: 1250,
    originalPrice: 1650,
    rating: 4.7,
    reviewsCount: 110,
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    stockCount: 40,
    isFlashSale: false,
    discountPercent: 24,
    description: '98% Cotton with 2% Elastane for flexible comfort, double-needle stitching, tailored chino silhouette.',
    descriptionBn: '৯৮% কটন ও ২% স্প্যানডেক্স দিয়ে তৈরি অত্যন্ত আরামদায়ক স্ট্রেচেবল প্যান্ট। প্রতিদিন অফিস ও আড্ডায় পরার উপযোগী।',
    fabricDetails: '৯৮% টুইল কটন ও ২% লাইক্রা স্ট্রেচ',
    specifications: [
      { label: 'কাপড়', value: 'টুইল গ্যাবার্ডিন (Stretch)' },
      { label: 'ফিট', value: 'স্লিম ফিট চিনো' },
      { label: 'জিপার', value: 'অরিজিনাল মেটাল জিপার' }
    ],
    tags: ['pant', 'প্যান্ট', 'chino', 'gabardine', 'men', 'jeans'],
    colors: ['খাকি (Classic Khaki)', 'কালো (Jet Black)', 'নেভি (Navy Blue)'],
    sizes: ['৩০ (30)', '৩২ (32)', '৩৪ (34)', '৩৬ (36)']
  },

  // 5. ছেলেদের হুডি (Men's Hoodie Folder)
  {
    id: 'hoodie-1',
    name: 'Heavyweight Winter Fleece Kangaroo Pocket Hoodie',
    nameBn: 'ছেলেদের প্রিমিয়াম উইন্টার ফ্লিস ক্যাঙ্গারু হুডি (৩২০ জিএসএম)',
    folderId: 'folder-hoodie',
    category: 'Winter',
    categoryBn: 'উইন্টার কালেকশন',
    price: 1150,
    originalPrice: 1600,
    rating: 4.9,
    reviewsCount: 195,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    stockCount: 50,
    isFlashSale: true,
    discountPercent: 28,
    description: '320 GSM heavy warm brushed fleece, double-layered hood with adjustable drawstrings, spacious front kangaroo pocket.',
    descriptionBn: '৩২০ জিএসএম ভারী ব্রাশড ফ্লিস কাপড়ে তৈরি, যা কনকনে শীতেও শরীরকে রাখে দারুণ উষ্ণ। ডাবল লেয়ার হুড ও ক্যাঙ্গারু পকেট।',
    fabricDetails: '৩২০ জিএসএম ইনসাইড ব্রাশড প্রিমিয়াম কটন ফ্লিস',
    specifications: [
      { label: 'জিএসএম (GSM)', value: '৩২০ জিএসএম থার্মাল ফ্লিস' },
      { label: 'হুড', value: 'ডাবল লেয়ার প্রোটেক্টিভ হুড' },
      { label: 'পকেট', value: 'ফ্রন্ট ক্যাঙ্গারু পকেট' }
    ],
    tags: ['hoodie', 'হুডি', 'winter', 'fleece', 'men'],
    colors: ['ডার্ক চারকোল (Dark Charcoal)', 'মরো ব্ল্যাক (Matte Black)', 'ওয়াইন রেড (Wine Red)'],
    sizes: ['M', 'L', 'XL', 'XXL']
  },

  // 6. ছেলেদের জ্যাকেট (Men's Jacket Folder)
  {
    id: 'jacket-1',
    name: 'Windproof Biker Quilted Leather Bomber Jacket',
    nameBn: 'ছেলেদের প্রিমিয়াম উইন্ডপ্রুফ লেদার বম্বার জ্যাকেট',
    folderId: 'folder-jacket',
    category: 'Winter',
    categoryBn: 'উইন্টার কালেকশন',
    price: 2850,
    originalPrice: 3800,
    rating: 4.8,
    reviewsCount: 88,
    image: 'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    stockCount: 22,
    isFlashSale: false,
    discountPercent: 25,
    description: 'High-grade soft PU leather shell, wind-resistant inner quilted thermal lining, heavy-duty metallic YKK zippers.',
    descriptionBn: 'উচ্চমানের ওয়াটার-রেজিস্ট্যান্ট পিইউ লেদার এবং ভেতরে নরম থার্মাল কুইল্টেড আস্তরণ। বাইকিং ও ফ্যাশনেবল উইন্টার ওয়্যারের জন্য সেরা।',
    fabricDetails: 'হাই-গ্রেড থিক পিইউ লেদার উইথ কুইল্টেড ইনার লাইনিং',
    specifications: [
      { label: 'ম্যাটেরিয়াল', value: 'প্রিমিয়াম পিইউ লেদার' },
      { label: 'আস্তরণ', value: 'থার্মাল কুইল্টেড ইনসুলেশন' },
      { label: 'উইন্ডপ্রুফ', value: '১০০% বাতাস রোধক' }
    ],
    tags: ['jacket', 'জ্যাকেট', 'leather', 'winter', 'biker', 'men'],
    colors: ['কালো (Classic Black)', 'কফি ব্রাউন (Coffee Brown)'],
    sizes: ['M', 'L', 'XL', 'XXL']
  },

  // 7. থ্রি পিস (Three-Piece Folder)
  {
    id: 'threepiece-1',
    name: 'Exclusive Embroidered Cotton Lawn Three-Piece Suit',
    nameBn: 'এক্সক্লুসিভ জর্জেট ও কটন এমব্রয়ডারি থ্রি-পিস কালেকশন',
    folderId: 'folder-threepiece',
    category: 'Womens',
    categoryBn: 'নারীদের ফ্যাশন',
    price: 2150,
    originalPrice: 2850,
    rating: 4.9,
    reviewsCount: 310,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    stockCount: 35,
    isFlashSale: true,
    discountPercent: 24,
    description: 'Luxurious heavy embroidered kamiz, premium chiffon digital dupatta, and soft cotton matching salwar fabric.',
    descriptionBn: 'বুকের অংশে ভারী কাশ্মীরি সুতোর কাজ করা কামিজ, নরম পিওর শিফন ওড়না এবং আরামদায়ক সুতি সালোয়ারের কাপড়। আনস্টিচড প্রিমিয়াম কালেকশন।',
    fabricDetails: 'কামিজ: ১০০% পিওর কটন লন; ওড়না: পিওর শিফন; সালোয়ার: সফট কটন',
    specifications: [
      { label: 'কামিজ', value: 'ভারী সুতোর এমব্রয়ডারি (৩ গজ)' },
      { label: 'ওড়না', value: 'পিওর শিফন ৫ হাত লম্বা ডিজিটাল প্রিন্ট' },
      { label: 'সালোয়ার', value: 'ম্যাচিং সফট কটন (২.৫ গজ)' }
    ],
    tags: ['threepiece', 'থ্রি-পিস', 'women', 'dress', 'salwar', 'cotton'],
    colors: ['রোজ পিঙ্ক (Rose Pink)', 'টিফানি মিন্ট (Mint Green)', 'রয়েল মাস্টার্ড (Royal Mustard)'],
    sizes: ['আনস্টিচড (Unstitched Free Size)']
  },

  // 8. শাড়ি (Saree Folder)
  {
    id: 'saree-1',
    name: 'Handloom Traditional Dhakai Jamdani Silk Saree',
    nameBn: 'ঐতিহ্যবাহী তাঁতের খাঁটি ঢাকাই জামদানি শাড়ি (৮৪ কাউন্ট)',
    folderId: 'folder-saree',
    category: 'Womens',
    categoryBn: 'নারীদের ফ্যাশন',
    price: 3650,
    originalPrice: 4800,
    rating: 5.0,
    reviewsCount: 420,
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    stockCount: 18,
    isFlashSale: true,
    discountPercent: 24,
    description: 'Authentic 84 count handloom Dhakai Jamdani saree with fine golden zari allover floral motifs and unstitched blouse piece.',
    descriptionBn: 'রূপগঞ্জ নারায়ণগঞ্জের তাঁতিদের হাতে বোনা ৮৪ কাউন্টের খাঁটি সুতি ও গোল্ডেন জরি সুতার কাজ করা জামদানি শাড়ি। সাথে ম্যাচিং ব্লাউজ পিস।',
    fabricDetails: '৮৪ কাউন্টের ফাইন সুতি ও গোল্ডেন জরি সুতা',
    specifications: [
      { label: 'তাঁত', value: 'ঐতিহ্যবাহী কাঠের হস্তচালিত তাঁত' },
      { label: 'দৈর্ঘ্য', value: '১২ হাত ফুল শাড়ি' },
      { label: 'ব্লাউজ পিস', value: 'ম্যাচিং ব্লাউজ পিস সংযুক্ত' }
    ],
    tags: ['saree', 'শাড়ি', 'jamdani', 'silk', 'traditional', 'women'],
    colors: ['ম্যাজেন্টা ও সোনালী (Magenta Gold)', 'রানী গোলাপি (Rani Pink)', 'কালো ও সোনালী (Black Gold)'],
    sizes: ['১২ হাত (Full Saree with Blouse Piece)']
  },

  // 9. বোরকা (Borka / Abaya Folder)
  {
    id: 'borka-1',
    name: 'Dubai Cherry Fabric Front-Open Designer Borka / Abaya',
    nameBn: 'দুবাই চেরি জর্জেট ফ্রন্ট-ওপেন স্টাইলিশ বোরকা ও আবায়া',
    folderId: 'folder-borka',
    category: 'Womens',
    categoryBn: 'নারীদের ফ্যাশন',
    price: 1950,
    originalPrice: 2600,
    rating: 4.9,
    reviewsCount: 265,
    image: 'https://images.unsplash.com/photo-1585728748178-f742f55ed462?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    stockCount: 40,
    isFlashSale: false,
    discountPercent: 25,
    description: 'Original imported Dubai Cherry georgette fabric, elegant bell sleeves with subtle crystal lace work and belt.',
    descriptionBn: 'আসল দুবাই চেরি কাপড়ে তৈরি নরম ও আরামদায়ক আবায়া বোরকা। হাতায় সূক্ষ্ম ক্রিস্টাল লেইসের কাজ এবং ফ্রন্ট-ওপেন বেল্ট ডিজাইন।',
    fabricDetails: 'অরিজিনাল ইমপোর্টেড দুবাই চেরি জর্জেট ফ্যাব্রিক',
    specifications: [
      { label: 'কাপড়', value: 'দুবাই চেরি জর্জেট (রিঙ্কেল ফ্রি)' },
      { label: 'হাতা', value: 'বেল স্লিভ উইথ ক্রিস্টাল লেইস' },
      { label: 'স্টাইল', value: 'ফ্রন্ট ওপেন উইথ বেল্ট' }
    ],
    tags: ['borka', 'বোরকা', 'abaya', 'modest', 'hijab', 'women'],
    colors: ['জেট ব্ল্যাক (Jet Black)', 'ডার্ক কফি (Dark Coffee)', 'প্যাস্টেল টিল (Pastel Teal)'],
    sizes: ['৫২ ইঞ্চি (52)', '৫৪ ইঞ্চি (54)', '৫৬ ইঞ্চি (56)']
  },

  // 10. হিজাব (Hijab Folder)
  {
    id: 'hijab-1',
    name: 'Soft Bubble Chiffon Georgette Premium Modest Hijab',
    nameBn: 'সফট বাবল শিফন জর্জেট প্রিমিয়াম ম্যাক্সি হিজাব',
    folderId: 'folder-hijab',
    category: 'Womens',
    categoryBn: 'নারীদের ফ্যাশন',
    price: 350,
    originalPrice: 480,
    rating: 4.8,
    reviewsCount: 512,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    stockCount: 90,
    isFlashSale: false,
    discountPercent: 27,
    description: 'Lightweight, non-slip bubble chiffon fabric with immaculate hemmed borders. Breathable and comfortable for all-day wear.',
    descriptionBn: 'নন-স্লিপ বাবল শিফন কাপড়, যা মাথায় সহজে সেট থাকে এবং কোনো পিছলে যায় না। ফুল কাভারেজ ম্যাক্সি সাইজ (৭৫ x ৩২ ইঞ্চি)।',
    fabricDetails: 'নন-স্লিপ বাবল শিফন জর্জেট',
    specifications: [
      { label: 'সাইজ', value: 'ম্যাক্সি সাইজ (৭৫" x ৩২")' },
      { label: 'ফিনিশিং', value: 'লেজার হেমড কাটিং' }
    ],
    tags: ['hijab', 'হিজাব', 'chiffon', 'modest', 'scarf', 'women'],
    colors: ['চকলেট ব্রাউন (Chocolate)', 'ন্যুড পিঙ্ক (Nude Pink)', 'ডিপ ব্ল্যাক (Deep Black)', 'অ্যাশ (Ash)'],
    sizes: ['ম্যাক্সি সাইজ (75" x 32")']
  },

  // 11. লেহেঙ্গা (Lehenga Folder)
  {
    id: 'lehenga-1',
    name: 'Bridal & Party Heavy Embroidered Silk Lehenga Choli',
    nameBn: 'ব্রাইডাল ও পার্টি হেভি এমব্রয়ডারি সিল্ক লেহেঙ্গা চোলি',
    folderId: 'folder-lehenga',
    category: 'Womens',
    categoryBn: 'নারীদের ফ্যাশন',
    price: 6850,
    originalPrice: 8900,
    rating: 5.0,
    reviewsCount: 160,
    image: 'https://images.unsplash.com/photo-1583391733975-0886b62ec857?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    stockCount: 12,
    isFlashSale: true,
    discountPercent: 23,
    description: 'Raw silk semi-stitched lehenga with elaborate zari sequins and thread embroidery, heavy flared flair (4.2 meters) with can-can attached.',
    descriptionBn: 'র সিল্কে তৈরি ৪.২ মিটার বিশাল ঘেরের পার্টি লেহেঙ্গা। ক্যান-ক্যান ও ডাবল আস্তরণ সংযুক্ত। সাথে ম্যাচিং এমব্রয়ডারি ব্লাউজ ও ওড়না।',
    fabricDetails: 'র সিল্ক উইথ গোল্ডেন জরি ও সিকুইন্স ওয়ার্ক',
    specifications: [
      { label: 'ঘের', value: '৪.২ মিটার ফুল ফ্লেয়ার' },
      { label: 'ক্যান-ক্যান', value: 'ডাবল লেয়ার ক্যান-ক্যান সংযুক্ত' },
      { label: 'দুপাট্টা', value: 'নেট উইথ হেভি বর্ডার এমব্রয়ডারি' }
    ],
    tags: ['lehenga', 'লেহেঙ্গা', 'bridal', 'party', 'wedding', 'women'],
    colors: ['রয়েল মেরুন (Royal Maroon)', 'পান্না সবুজ (Emerald Green)', 'রোজ গোল্ড (Rose Gold)'],
    sizes: ['সেমি-স্টিচড (Semi-Stitched Free Size)']
  },

  // 12. মেয়েদের হুডি (Women's Hoodie Folder)
  {
    id: 'women-hoodie-1',
    name: 'Cute Pastel Fleece Oversized Winter Women\'s Hoodie',
    nameBn: 'মেয়েদের সফট উইন্টার ওভারসাইজড ফ্লিস হুডি',
    folderId: 'folder-women-hoodie',
    category: 'Winter',
    categoryBn: 'উইন্টার কালেকশন',
    price: 980,
    originalPrice: 1400,
    rating: 4.8,
    reviewsCount: 175,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    stockCount: 42,
    isFlashSale: true,
    discountPercent: 30,
    description: 'Ultra-soft Korean fleece fabric, relaxed drop-shoulder oversized aesthetic cut with front hand warmer pocket.',
    descriptionBn: 'উচ্চমানের সফট কোরিয়ান ফ্লিস ফ্যাব্রিক। হালকা ও আরামদায়ক অথচ শীতে শরীরকে দারুণ উষ্ণ রাখে। ট্রেন্ডি ড্রপ শোল্ডার লুক।',
    fabricDetails: 'সফট কোরিয়ান থার্মাল ফ্লিস',
    specifications: [
      { label: 'ফিটিং', value: 'ওভারসাইজড রিল্যাক্সড ফিট' },
      { label: 'পকেট', value: 'ফ্রন্ট ক্যাঙ্গারু পকেট' }
    ],
    tags: ['hoodie', 'মেয়েদের হুডি', 'women', 'winter', 'pastel', 'fleece'],
    colors: ['ল্যাভেন্ডার (Lavender Purple)', 'পাউডার পিঙ্ক (Powder Pink)', 'ক্রিম হোয়াইট (Cream White)'],
    sizes: ['M (চেস্ট ৩৮)', 'L (চেস্ট ৪০)', 'XL (চেস্ট ৪২)']
  },

  // 13. মেয়েদের জ্যাকেট (Women's Jacket Folder)
  {
    id: 'women-jacket-1',
    name: 'Women\'s Quilted Warm Winter Puffer Jacket',
    nameBn: 'মেয়েদের প্রিমিয়াম উইন্ডপ্রুফ কুইল্টেড পাফার জ্যাকেট',
    folderId: 'folder-women-jacket',
    category: 'Winter',
    categoryBn: 'উইন্টার কালেকশন',
    price: 2450,
    originalPrice: 3200,
    rating: 4.9,
    reviewsCount: 120,
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    stockCount: 26,
    isFlashSale: false,
    discountPercent: 23,
    description: 'Ultra-light thermal down insulation, wind-resistant outer shell with detachable faux fur collar hood.',
    descriptionBn: 'কনকনে শীতে ভ্রমণ ও আউটিংয়ের জন্য সেরা উইন্ডপ্রুফ জ্যাকেট। হালকা ওজন অথচ ভেতরটা চমৎকার উষ্ণ। ডিট্যাচেবল হুড ও ফুর কলার।',
    fabricDetails: 'উইন্ড-রেজিস্ট্যান্ট নাইলন শেল ও থার্মাল ডাউন ইনসুলেশন',
    specifications: [
      { label: 'হুড', value: 'রিমুভেবল ফুর কলার হুড' },
      { label: 'বাতাস প্রতিরোধ', value: 'উইন্ডপ্রুফ ও স্নো রেজিস্ট্যান্ট' }
    ],
    tags: ['jacket', 'মেয়েদের জ্যাকেট', 'women', 'winter', 'puffer', 'coat'],
    colors: ['ম্যাট ব্ল্যাক (Matte Black)', 'অলিভ (Olive Green)', 'রোজ বেইজ (Rose Beige)'],
    sizes: ['S', 'M', 'L', 'XL']
  },

  // 14. মেয়েদের ব্যাগ (Ladies Bag Folder)
  {
    id: 'bag-1',
    name: 'Luxury Vegan Leather Ladies Shoulder & Handbag',
    nameBn: 'প্রিমিয়াম লেদার ক্লাসি লেডিস শোল্ডার ও হ্যান্ডব্যাগ',
    folderId: 'folder-bag',
    category: 'Bags & Shoes',
    categoryBn: 'জুতো ও ব্যাগ',
    price: 1650,
    originalPrice: 2200,
    rating: 4.8,
    reviewsCount: 240,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    stockCount: 35,
    isFlashSale: true,
    discountPercent: 25,
    description: 'Multi-compartment structured handbag made from textured scratch-resistant vegan leather, golden hardware and detachable crossbody strap.',
    descriptionBn: 'উচ্চমানের স্ক্র্যাচ-প্রুফ লেদার ব্যাগ। ভেতরে ৩টি জিপার চেম্বার ও মোবাইল পকেট। সাথে লং বেল্ট যা শোল্ডারে ঝুলানো যায়।',
    fabricDetails: 'টেক্সচার্ড স্ক্র্যাচ-প্রুফ হাই-গ্রেড ভেগান লেদার',
    specifications: [
      { label: 'চেম্বার', value: '৩টি জিপার কম্পার্টমেন্ট ও ইনসাইড পকেট' },
      { label: 'বেল্ট', value: 'অ্যাডজাস্টেবল ক্রস-বডি লং স্ট্র্যাপ' }
    ],
    tags: ['bag', 'ব্যাগ', 'মেয়েদের ব্যাগ', 'handbag', 'women', 'leather'],
    colors: ['ট্যান ব্রাউন (Tan Brown)', 'বার্গেন্ডি রেড (Burgundy)', 'ক্লাসিক ব্ল্যাক (Classic Black)']
  },

  // 15. জুতা (Shoes Folder)
  {
    id: 'shoes-1',
    name: 'Handcrafted Genuine Leather Loafers / Formal Shoes',
    nameBn: 'হ্যান্ডমেড জেনুইন লেদার লোফার ও ফরমাল শুজ',
    folderId: 'folder-shoes',
    category: 'Bags & Shoes',
    categoryBn: 'জুতো ও ব্যাগ',
    price: 2350,
    originalPrice: 3100,
    rating: 4.9,
    reviewsCount: 185,
    image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    stockCount: 28,
    isFlashSale: false,
    discountPercent: 24,
    description: '100% genuine full-grain leather upper, cushioned orthotic insole, anti-skid rubber grip sole for all-day walking comfort.',
    descriptionBn: 'আসল গরুর চামড়ায় তৈরি টেকসই ও প্রিমিয়াম লোফার জুতা। ভেতরে নরম মেমরি ফোম ইনসোল যা পায়ে ফোস্কা পড়তে দেয় না।',
    fabricDetails: '১০০% ফুল গ্রেইন জেনুইন লেদার',
    specifications: [
      { label: 'সোল', value: 'এন্টি-স্কিড ডুরাবল রাবার গ্রিপ' },
      { label: 'ইনসোল', value: 'অর্থোটিক মেমোরি কুশন' }
    ],
    tags: ['shoes', 'জুতা', 'leather', 'loafer', 'formal', 'footwear'],
    colors: ['কালো (Jet Black)', 'ডার্ক ট্যান (Dark Tan)'],
    sizes: ['৩৯ (39)', '৪০ (40)', '৪১ (41)', '৪২ (42)', '৪৩ (43)']
  },

  // 16. বাচ্চাদের শীতের কাপড় (Kids Winter Clothes Folder)
  {
    id: 'kids-winter-1',
    name: 'Baby & Kids Warm Fleece Winter Jacket & Pant Suit',
    nameBn: 'বাচ্চাদের নরম ফ্লিস উইন্টার জ্যাকেট ও প্যান্ট সেট',
    folderId: 'folder-kids-winter',
    category: 'Kids',
    categoryBn: 'বাচ্চাদের কালেকশন',
    price: 850,
    originalPrice: 1200,
    rating: 5.0,
    reviewsCount: 210,
    image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    stockCount: 50,
    isFlashSale: true,
    discountPercent: 29,
    description: 'Ultra-soft skin-friendly thermal baby fleece suit, cute animal ears hood, full zip jacket with matching elastic jogger pants.',
    descriptionBn: 'বাচ্চাদের কোমল ত্বকের জন্য শতভাগ নিরাপদ নরম ফ্লিস কাপড়। কিউট এনিম্যাল হুড জ্যাকেট এবং ম্যাচিং ট্র্যাকপ্যান্ট সেট।',
    fabricDetails: '১০০% হাইপোঅ্যালার্জেনিক সফট বেবি ফ্লিস',
    specifications: [
      { label: 'সেট বিবরণ', value: 'হুডি জ্যাকেট + ইলাস্টিক ট্র্যাকপ্যান্ট' },
      { label: 'নিরাপত্তা', value: 'নন-টক্সিক ও অ্যান্টি-অ্যালার্জিক' }
    ],
    tags: ['kids', 'বাচ্চাদের শীতের কাপড়', 'winter', 'baby', 'fleece', 'suit'],
    colors: ['স্কাই ব্লু (Sky Blue)', 'বেবি পিঙ্ক (Baby Pink)', 'ইয়েলো হানি (Honey Yellow)'],
    sizes: ['১-২ বছর (1-2Y)', '২-৩ বছর (2-3Y)', '৩-৪ বছর (3-4Y)', '৪-৬ বছর (4-6Y)']
  },

  // 17. বাচ্চাদের খেলনা (Kids Toys Folder)
  {
    id: 'kids-toy-1',
    name: 'High-Speed Rechargeable Remote Control Stunt Car',
    nameBn: 'বাচ্চাদের হাই-স্পিড রিচার্জেবল রিমোট কন্ট্রোল স্টান্ট কার',
    folderId: 'folder-kids-toys',
    category: 'Kids',
    categoryBn: 'বাচ্চাদের কালেকশন',
    price: 1150,
    originalPrice: 1650,
    rating: 4.8,
    reviewsCount: 168,
    image: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    stockCount: 38,
    isFlashSale: false,
    discountPercent: 30,
    description: '360° rotating double-sided tumbling stunt car with cool LED lights, 2.4GHz remote control, USB rechargeable lithium battery.',
    descriptionBn: '৩৬০ ডিগ্রি ঘূর্ণনশীল ডাবল সাইডেড স্টান্ট কার। রঙিন এলইডি লাইট ও ইউএসবি রিচার্জেবল ব্যাটারি সহ সম্পূর্ণ নন-টক্সিক প্লাস্টিকে তৈরি।',
    fabricDetails: 'শকবপ্রুফ নন-টক্সিক এবিএস (ABS) পলিমার প্লাস্টিক',
    specifications: [
      { label: 'ব্যাটারি', value: '৩.৭ ভোল্ট ইউএসবি রিচার্জেবল লিথিয়াম আয়ন' },
      { label: 'রিমোট রেঞ্জ', value: '৫০ মিটার পর্যন্ত ২.৪ গিগাহার্টজ কন্ট্রোল' },
      { label: 'ঘূর্ণন', value: '৩৬০° এক্রোবেটিক স্টান্ট ফ্লিপ' }
    ],
    tags: ['toys', 'বাচ্চাদের খেলনা', 'kids', 'rccar', 'gift', 'fun'],
    colors: ['রেড ফায়ার (Fire Red)', 'নিয়ন ব্লু (Neon Blue)'],
    sizes: ['স্ট্যান্ডার্ড সাইজ (Box Pack)']
  }
];

export const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: 'FASHION20',
    discountType: 'percentage',
    discountValue: 20,
    minSpend: 1500,
    description: 'পোশাক অর্ডারে ২০% বিশেষ মূল্যছাড়'
  },
  {
    code: 'WINTER100',
    discountType: 'fixed',
    discountValue: 100,
    minSpend: 1000,
    description: 'শীতের কাপড়ে ১০০৳ নগদ ছাড়'
  },
  {
    code: 'FREESHIP',
    discountType: 'fixed',
    discountValue: 60,
    minSpend: 2000,
    description: '২০০০৳ কেনাকাটায় ফ্রি হোম ডেলিভারি'
  }
];

export const BANGLADESH_DISTRICTS = [
  'ঢাকা (Dhaka)',
  'চট্টগ্রাম (Chittagong)',
  'সিলেট (Sylhet)',
  'রাজশাহী (Rajshahi)',
  'খুলনা (Khulna)',
  'বরিশাল (Barishal)',
  'রংপুর (Rangpur)',
  'ময়মনসিংহ (Mymensingh)',
  'গাজীপুর (Gazipur)',
  'নারায়ণগঞ্জ (Narayanganj)',
  'কুমিল্লা (Cumilla)',
  'বগুড়া (Bogura)',
  'কক্সবাজার (Cox\'s Bazar)',
  'যশোর (Jashore)',
  'অন্যান্য জেলা (Other District)'
];

export const DEFAULT_SITE_CONTENT: SiteContent = {
  storeNameBn: 'স্মার্টশপ বিডি',
  storeNameEn: 'SmartShop BD',
  taglineBn: 'প্রতিদিনের প্রয়োজন সব এক জায়গায় | Shop Smart • Live Better',
  announcementBn: '🚚 সারা বাংলাদেশে ডেলিভারি | ক্যাশ অন ডেলিভারি | ১০০% অরিজিনাল পণ্য! হটলাইন: 01758-844356',
  hotline: '01758-844356',
  email: 'support@smartshopbd.com',
  addressBn: 'সদর রোড, ঢাকা, বাংলাদেশ',
  heroHeadlineBn: 'প্রতিদিনের প্রয়োজন সব এক জায়গায়',
  heroSubtitleBn: 'টি-শার্ট, শার্ট, পাঞ্জাবি, থ্রি পিস, শাড়ি, বোরকা, হিজাব, মেয়েদের ব্যাগ সহ প্রিমিয়াম লাইফস্টাইল পণ্য।',
  heroBadgeBn: 'স্মার্ট কেনাকাটা • স্মার্ট জীবন | অফার ২০২৬',
  freeShippingThreshold: 2000,
  logoUrl: '/assets/aistudio/SmartShop_Logo_1b94ad7a.jpg',
  bannerUrl: '/assets/aistudio/SmartShop_Benar_786a522b.jpg',
  bkashNumber: '01784315047',
  nagadNumber: '01784315047'
};

export const DEFAULT_ADMIN_EMAIL = 'mdnahidislam843150@gmail.com';

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'UID-BD843150',
  name: 'মোঃ নাহিদ ইসলাম (Nahid Islam)',
  phone: '01784-315047',
  email: 'mdnahidislam843150@gmail.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  gender: 'male',
  dateOfBirth: '1998-05-14',
  memberSince: '2024',
  membershipTier: 'VIP',
  smartPoints: 850,
  walletBalance: 320,
  savedAddresses: [
    {
      id: 'addr-home-1',
      label: 'Home',
      labelBn: 'বাসার ঠিকানা (Home)',
      district: 'ঢাকা (Dhaka)',
      thanaCity: 'মিরপুর-১০, ঢাকা',
      streetAddress: 'বাড়ি #২৪, রোড #৩, ব্লক-সি, মিরপুর-১০, ঢাকা',
      isDefault: true
    },
    {
      id: 'addr-office-2',
      label: 'Office',
      labelBn: 'অফিসের ঠিকানা (Office)',
      district: 'ঢাকা (Dhaka)',
      thanaCity: 'মতিঝিল বা/এ, ঢাকা',
      streetAddress: 'লেভেল-৫, সিটি সেন্টার বাণিজ্যিক ভবন, মতিঝিল, ঢাকা',
      isDefault: false
    }
  ],
  wishlistProductIds: []
};
