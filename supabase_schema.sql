-- ========================================================
-- SmartShop BD - Supabase PostgreSQL Schema & Table Entries
-- প্রজেক্ট: SmartShop BD (btcgigozmmjapvelqhtf)
-- নির্দেশিকা: এই সম্পূর্ণ কোডটি কপি করে Supabase Dashboard -> SQL Editor-এ পেস্ট করে 'Run' বাটনে ক্লিক করুন।
-- ========================================================

-- ১. Products (পণ্য তালিকা) টেবিল তৈরি
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_bn TEXT NOT NULL,
  folder_id TEXT,
  category TEXT NOT NULL,
  category_bn TEXT NOT NULL,
  price NUMERIC NOT NULL,
  original_price NUMERIC NOT NULL,
  rating NUMERIC DEFAULT 4.8,
  reviews_count INTEGER DEFAULT 12,
  image TEXT NOT NULL,
  in_stock BOOLEAN DEFAULT true,
  stock_count INTEGER DEFAULT 50,
  is_flash_sale BOOLEAN DEFAULT false,
  discount_percent INTEGER DEFAULT 0,
  description TEXT,
  description_bn TEXT,
  fabric_details TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  colors JSONB DEFAULT '[]'::jsonb,
  sizes JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ২. Orders (গ্রাহকের অর্ডার) টেবিল তৈরি
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  district TEXT DEFAULT 'ঢাকা',
  thana_city TEXT DEFAULT 'ধানমন্ডি',
  delivery_method TEXT DEFAULT 'regular',
  subtotal NUMERIC,
  items JSONB NOT NULL,
  total NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  delivery_fee NUMERIC DEFAULT 60,
  discount NUMERIC DEFAULT 0,
  coupon_code TEXT,
  status TEXT NOT NULL DEFAULT 'Pending',
  trx_id TEXT,
  sender_phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ৩. User Profiles (ইউজার প্রোফাইল) টেবিল তৈরি
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  avatar_url TEXT,
  gender TEXT DEFAULT 'male',
  date_of_birth TEXT,
  member_since TEXT DEFAULT '2024',
  membership_tier TEXT DEFAULT 'VIP',
  smart_points INTEGER DEFAULT 850,
  wallet_balance NUMERIC DEFAULT 320,
  saved_addresses JSONB DEFAULT '[]'::jsonb,
  wishlist_product_ids JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ৪. Site Content (ওয়েবসাইট কনফিগারেশন ও ব্যানার) টেবিল তৈরি
CREATE TABLE IF NOT EXISTS public.site_content (
  id TEXT PRIMARY KEY DEFAULT 'current',
  store_name_bn TEXT,
  store_name_en TEXT,
  tagline_bn TEXT,
  announcement_bn TEXT,
  hotline TEXT,
  email TEXT,
  address_bn TEXT,
  hero_headline_bn TEXT,
  hero_subtitle_bn TEXT,
  hero_badge_bn TEXT,
  free_shipping_threshold NUMERIC DEFAULT 2000,
  logo_url TEXT,
  banner_url TEXT,
  bkash_number TEXT,
  nagad_number TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================
-- ৫. Row Level Security (RLS) ও Public Access Policies
-- (যাতে ওয়েবসাইট থেকে Anon Key দিয়ে ডাটা রিড ও রাইট করা যায়)
-- ========================================================

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  -- Products Policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read products') THEN
    CREATE POLICY "Allow public read products" ON public.products FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public insert products') THEN
    CREATE POLICY "Allow public insert products" ON public.products FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public update products') THEN
    CREATE POLICY "Allow public update products" ON public.products FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public delete products') THEN
    CREATE POLICY "Allow public delete products" ON public.products FOR DELETE USING (true);
  END IF;

  -- Orders Policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public all orders') THEN
    CREATE POLICY "Allow public all orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);
  END IF;

  -- User Profiles Policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public all user_profiles') THEN
    CREATE POLICY "Allow public all user_profiles" ON public.user_profiles FOR ALL USING (true) WITH CHECK (true);
  END IF;

  -- Site Content Policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public all site_content') THEN
    CREATE POLICY "Allow public all site_content" ON public.site_content FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;


-- ========================================================
-- ৬. প্রাথমিক ডাটা এন্ট্রি (Seed Data Inserts)
-- ========================================================

-- ৬.১ সাইট কনটেন্ট এন্ট্রি
INSERT INTO public.site_content (
  id, store_name_bn, store_name_en, tagline_bn, announcement_bn, 
  hotline, email, address_bn, hero_headline_bn, hero_subtitle_bn, 
  hero_badge_bn, free_shipping_threshold, logo_url, banner_url, bkash_number, nagad_number
) VALUES (
  'current',
  'স্মার্টশপ বিডি',
  'SmartShop BD',
  'প্রতিদিনের প্রয়োজন সব এক জায়গায় | Shop Smart • Live Better',
  '🚚 সারা বাংলাদেশে ডেলিভারি | ৭ দিনের সহজ রিটার্ন | ১০০% অরিজিনাল পণ্য! হটলাইন: 01758-844356',
  '01758-844356',
  'support@smartshopbd.com',
  'সদর রোড, ঢাকা, বাংলাদেশ',
  'প্রতিদিনের প্রয়োজন সব এক জায়গায়',
  'টি-শার্ট, শার্ট, পাঞ্জাবি, থ্রি পিস, শাড়ি, বোরকা, হিজাব, মেয়েদের ব্যাগ সহ প্রিমিয়াম লাইফস্টাইল পণ্য।',
  'স্মার্ট কেনাকাটা • স্মার্ট জীবন | অফার ২০২৬',
  2000,
  '/assets/aistudio/SmartShop_Logo_1b94ad7a.jpg',
  '/assets/aistudio/SmartShop_Benar_786a522b.jpg',
  '01784315047',
  '01784315047'
) ON CONFLICT (id) DO UPDATE SET
  store_name_bn = EXCLUDED.store_name_bn,
  store_name_en = EXCLUDED.store_name_en,
  tagline_bn = EXCLUDED.tagline_bn,
  announcement_bn = EXCLUDED.announcement_bn,
  hotline = EXCLUDED.hotline,
  email = EXCLUDED.email,
  updated_at = NOW();

-- ৬.২ ইউজার প্রোফাইল ডাটা এন্ট্রি
INSERT INTO public.user_profiles (
  id, name, phone, email, avatar_url, gender, date_of_birth,
  member_since, membership_tier, smart_points, wallet_balance, saved_addresses, wishlist_product_ids
) VALUES (
  'UID-BD843150',
  'মোঃ নাহিদ ইসলাম (Nahid Islam)',
  '01784-315047',
  'mdnahidislam843150@gmail.com',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'male',
  '1998-05-14',
  '2024',
  'VIP',
  850,
  320,
  '[
    {
      "id": "addr-home-1",
      "label": "Home",
      "labelBn": "বাসার ঠিকানা (Home)",
      "district": "ঢাকা (Dhaka)",
      "thanaCity": "মিরপুর-১০, ঢাকা",
      "streetAddress": "বাড়ি #২৪, রোড #৩, ব্লক-সি, মিরপুর-১০, ঢাকা",
      "isDefault": true
    },
    {
      "id": "addr-office-2",
      "label": "Office",
      "labelBn": "অফিসের ঠিকানা (Office)",
      "district": "ঢাকা (Dhaka)",
      "thanaCity": "মতিঝিল বা/এ, ঢাকা",
      "streetAddress": "লেভেল-৫, সিটি সেন্টার বাণিজ্যিক ভবন, মতিঝিল, ঢাকা",
      "isDefault": false
    }
  ]'::jsonb,
  '["shirt-1", "panjabi-1", "saree-1"]'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  updated_at = NOW();

-- ৬.৩ পণ্য ডাটা এন্ট্রি (Products Seed)
INSERT INTO public.products (
  id, name, name_bn, folder_id, category, category_bn, price, original_price,
  rating, reviews_count, image, in_stock, stock_count, is_flash_sale, discount_percent,
  description, description_bn, fabric_details, tags, colors, sizes
) VALUES
-- ১. শার্ট
(
  'shirt-1',
  'Premium Oxford Cotton Semi-Casual Men''s Shirt',
  'প্রিমিয়াম ১০০% কটন অক্সফোর্ড ক্যাজুয়াল শার্ট',
  'folder-shirt',
  'Mens',
  'ছেলেদের পোশাক',
  1350,
  1750,
  4.8,
  142,
  'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
  true,
  45,
  true,
  23,
  '100% fine combed cotton oxford weave, tailored slim fit, wrinkle-resistant finish.',
  '১০০% ফাইন কম্বড সুতি অক্সফোর্ড কাপড়ে তৈরি, নিখুঁত স্লিম ফিট সেলাই ও কালার গ্যারান্টি।',
  '১০০% পিওর কটন অক্সফোর্ড ফ্যাব্রিক',
  '["shirt", "শার্ট", "formal", "casual", "men", "cotton"]'::jsonb,
  '["আকাশী নীল (Sky Blue)", "সাদা (Pure White)", "নেভি ব্লু (Navy Blue)"]'::jsonb,
  '["M (৩৮)", "L (৪০)", "XL (৪২)", "XXL (৪৪)"]'::jsonb
),
(
  'shirt-2',
  'Executive White Formal Office Shirt',
  'এক্সিকিউটিভ পিওর হোয়াইট ফরমাল অফিস শার্ট',
  'folder-shirt',
  'Mens',
  'ছেলেদের পোশাক',
  1450,
  1850,
  4.9,
  96,
  'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
  true,
  30,
  false,
  21,
  'Ultra-crisp easy-care formal white shirt for corporate executives and meetings.',
  'অফিস মিটিং ও কর্পোরেট প্রেজেন্টেশনের জন্য প্রিমিয়াম ডবল প্লাই ইজিকার কটন শার্ট।',
  'ডবল প্লাই ইজিকার ১০০% সুতি কাপড়',
  '["shirt", "শার্ট", "white", "formal"]'::jsonb,
  '["ধবধবে সাদা (Crisp White)"]'::jsonb,
  '["M (৩৮)", "L (৪০)", "XL (৪২)", "XXL (৪৪)"]'::jsonb
),
-- ২. টি-শার্ট
(
  'tshirt-1',
  'Heavyweight Drop-Shoulder Oversized T-Shirt',
  'হেভিওয়েট ড্রপ শোল্ডার ওভারসাইজড টি-শার্ট',
  'folder-tshirt',
  'Mens',
  'ছেলেদের পোশাক',
  650,
  950,
  4.7,
  210,
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
  true,
  80,
  true,
  31,
  '220 GSM 100% combed compact cotton, modern relaxed street style drop shoulder.',
  '২২০ জিএসএম প্রিমিয়াম কম্বড কম্প্যাক্ট কটন। ফ্যাশনেবল ড্রপ শোল্ডার লুক।',
  '২২০ GSM ১০০% কম্বড সুতি কাপড়',
  '["tshirt", "টি-শার্ট", "oversized", "streetwear"]'::jsonb,
  '["জেট ব্ল্যাক (Jet Black)", "অলিভ গ্রিন (Olive)", "সাদা (White)"]'::jsonb,
  '["M (চেস্ট ৪০)", "L (চেস্ট ৪২)", "XL (চেস্ট ৪৪)"]'::jsonb
),
-- ৩. পাঞ্জাবি
(
  'panjabi-1',
  'Royal Embroidered Designer Cotton Semi-Long Panjabi',
  'রয়্যাল এমব্রয়ডারি ডিজাইনার সেমিলং সুতি পাঞ্জাবি',
  'folder-panjabi',
  'Mens',
  'ছেলেদের পোশাক',
  2150,
  2800,
  4.9,
  180,
  'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
  true,
  25,
  true,
  23,
  'Premium cotton silk blend fabric with intricate collar and placket thread embroidery.',
  'উচ্চমানের কটন-সিল্ক কাপড়ে নিখুঁত কলার ও প্লাকেট এমব্রয়ডারি ডিজাইন।',
  'হাই-কাউন্ট প্রিমিয়াম কটন সিল্ক',
  '["panjabi", "পাঞ্জাবি", "eid", "festive", "traditional"]'::jsonb,
  '["রয়েল ব্লু (Royal Blue)", "মেরুন (Maroon)", "সাদা (Pure White)"]'::jsonb,
  '["৪০ (M)", "৪২ (L)", "৪৪ (XL)"]'::jsonb
),
-- ৪. প্যান্ট
(
  'pant-1',
  'Stretch Twill Comfort-Fit Gabardine Chino Pants',
  'স্ট্রেচেবল টুইল গ্যাবার্ডিন চিনো প্যান্ট',
  'folder-pant',
  'Mens',
  'ছেলেদের পোশাক',
  1250,
  1650,
  4.8,
  115,
  'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
  true,
  40,
  false,
  24,
  'Premium 4-way stretch twill fabric for supreme day-long comfort at office or university.',
  '৪-ওয়ে স্ট্রেচ টুইল গ্যাবার্ডিন ফ্যাব্রিক। সারাদিন পরে থাকার জন্য আরামদায়ক।',
  '৯৮% কটন ও ২% স্প্যানডেক্স',
  '["pant", "প্যান্ট", "chino", "gabardine"]'::jsonb,
  '["খাকি (Khaki)", "নেভি ব্লু (Navy Blue)", "কালো (Black)"]'::jsonb,
  '["৩০", "৩২", "৩৪", "৩৬"]'::jsonb
),
-- ৫. শীতের পোশাক (হুডি ও জ্যাকেট)
(
  'hoodie-1',
  'Heavyweight Brushed Fleece Winter Pullover Hoodie',
  '৩২০ জিএসএম ব্রাশড ফ্লিস উইন্টার পুলওভার হুডি',
  'folder-hoodie',
  'Winter',
  'উইন্টার কালেকশন',
  1250,
  1800,
  4.9,
  230,
  'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
  true,
  55,
  true,
  30,
  '320 GSM heavy inner fleece keeps you warm, kangaroo pocket with double-lined hood.',
  'ভিতরে ভারী ফ্লিস লাইনিং যা তীব্র শীতে আপনাকে উষ্ণ ও আরামদায়ক রাখবে। ক্যাঙ্গারু পকেট সহ।',
  '৩২০ GSM কটন পলিয়েস্টার ব্রাশড ফ্লিস',
  '["hoodie", "হুডি", "winter", "fleece"]'::jsonb,
  '["কালো (Black)", "মেরুন (Maroon)", "ছাই (Grey)"]'::jsonb,
  '["M (৩৮)", "L (৪০)", "XL (৪২)", "XXL (৪৪)"]'::jsonb
),
(
  'jacket-1',
  'Windproof Biker Leather Jacket for Men',
  'উইন্ডপ্রুফ প্রিমিয়াম রাইডার লেদার জ্যাকেট',
  'folder-jacket',
  'Winter',
  'উইন্টার কালেকশন',
  2850,
  3800,
  4.8,
  88,
  'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?auto=format&fit=crop&w=800&q=80',
  true,
  20,
  false,
  25,
  'Water-resistant faux leather exterior with smooth thermal satin lining and YKK zippers.',
  'উইন্ডপ্রুফ ও ওয়াটার রেজিস্ট্যান্ট লেদার ফিনিশ। বাইকিং ও স্টাইলের জন্য সেরা।',
  'হাই-গ্রেড পিইউ লেদার ও থার্মাল সাটিন লাইনিং',
  '["jacket", "জ্যাকেট", "leather", "biker", "winter"]'::jsonb,
  '["জেট ব্ল্যাক (Jet Black)", "ডার্ক চকলেট (Dark Brown)"]'::jsonb,
  '["L (৪০)", "XL (৪২)", "XXL (৪৪)"]'::jsonb
),
-- ৬. নারীদের ফ্যাশন (শাড়ি, থ্রি-পিস, বোরকা)
(
  'saree-1',
  'Handwoven Traditional Dhakai Jamdani Saree (84 Count)',
  'খাঁটি তাঁতের ঢাকাই জামদানি শাড়ি (৮৪ কাউন্ট সুতা)',
  'folder-saree',
  'Womens',
  'নারীদের ফ্যাশন',
  3850,
  5200,
  4.9,
  165,
  'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
  true,
  15,
  true,
  26,
  'Masterfully handwoven traditional Dhakai Jamdani saree with fine floral motifs.',
  'নারায়ণগঞ্জের ঐতিহ্যবাহী তাঁতিদের হাতে বোনা ৮৪ কাউন্টের খাঁটি সুতি ঢাকাই জামদানি।',
  '১০০% প্রিমিয়াম সুতি জামদানি সুতা',
  '["saree", "শাড়ি", "jamdani", "traditional", "party"]'::jsonb,
  '["গোলাপি ও গোল্ডেন", "রয়েল ব্লু ও সিলভার", "কালো ও লাল"]'::jsonb,
  '["১২ হাত (ব্লাউজ পিস সহ)"]'::jsonb
),
(
  'threepiece-1',
  'Embroidered Cotton Lawn Three-Piece with Chiffon Dupatta',
  'এমব্রয়ডারি লাক্সারি কটন লন থ্রি-পিস (শিফন ওড়না)',
  'folder-threepiece',
  'Womens',
  'নারীদের ফ্যাশন',
  2450,
  3200,
  4.8,
  195,
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
  true,
  35,
  true,
  23,
  'Fine combed lawn cotton kamiz with intricate neck embroidery and pure digital chiffon dupatta.',
  'কামিজে আকর্ষণীয় রেশমি সুতার এমব্রয়ডারি কাজ ও প্রিমিয়াম ডিজিটাল প্রিন্ট শিফন ওড়না।',
  'প্রিমিয়াম কটন লন ও পিওর শিফন ওড়না',
  '["threepiece", "থ্রি-পিস", "lawn", "embroidered"]'::jsonb,
  '["পেস্ট গ্রিন (Sea Green)", "ল্যাভেন্ডার (Lavender)", "হলুদ (Mustard)"]'::jsonb,
  '["আনস্টিচড (Unstitched)"]'::jsonb
),
(
  'borka-1',
  'Dubai Cherry Georgette Front-Open Designer Abaya Borka',
  'দুবাই চেরি জর্জেট ফ্রন্ট-ওপেন ডিজাইনার আবায়া বোরকা',
  'folder-borka',
  'Womens',
  'নারীদের ফ্যাশন',
  2650,
  3500,
  4.9,
  175,
  'https://images.unsplash.com/photo-1585728748178-f742f55ed462?auto=format&fit=crop&w=800&q=80',
  true,
  25,
  false,
  24,
  'Imported Dubai cherry georgette fabric with subtle pearl embellishments and matching hijab.',
  'আসল সফট দুবাই চেরি জর্জেট ফ্যাব্রিক। আরামদায়ক ও মার্জিত। সাথে ম্যাচিং হিজাব উপহার।',
  'অরিজিনাল দুবাই চেরি জর্জেট',
  '["borka", "বোরকা", "abaya", "hijab", "modest"]'::jsonb,
  '["জেট ব্ল্যাক (Black)", "কফি (Coffee Brown)", "ডার্ক নেভি (Navy)"]'::jsonb,
  '["৫২ ইঞ্চি", "৫৪ ইঞ্চি", "৫৬ ইঞ্চি"]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_bn = EXCLUDED.name_bn,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  image = EXCLUDED.image,
  in_stock = EXCLUDED.in_stock,
  stock_count = EXCLUDED.stock_count,
  updated_at = NOW();

-- ৬.৪ গ্রাহকের ডেমো অর্ডার এন্ট্রি
INSERT INTO public.orders (
  id, customer_name, phone, address, district, thana_city, delivery_method,
  subtotal, items, total, payment_method, delivery_fee, discount, coupon_code, status, trx_id, sender_phone, notes
) VALUES (
  'ORD-843101',
  'মোঃ তানভীর হাসান',
  '01784315047',
  'বাড়ি #১২, রোড #৫, ধানমন্ডি, ঢাকা',
  'ঢাকা (Dhaka)',
  'ধানমন্ডি, ঢাকা',
  'regular',
  2700,
  '[
    {
      "product": {
        "id": "shirt-1",
        "name": "Premium Oxford Cotton Semi-Casual Men''s Shirt",
        "nameBn": "প্রিমিয়াম ১০০% কটন অক্সফোর্ড ক্যাজুয়াল শার্ট",
        "price": 1350,
        "image": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80"
      },
      "quantity": 2,
      "selectedColor": "আকাশী নীল (Sky Blue)",
      "selectedSize": "L (৪০)"
    }
  ]'::jsonb,
  2760,
  'bkash',
  60,
  0,
  NULL,
  'Approved',
  '9M2KL98Z',
  '01784315047',
  'অফিসের সময়ের মধ্যে ডেলিভারি দিতে পারলে ভালো হয়।'
) ON CONFLICT (id) DO NOTHING;

-- ========================================================
-- সম্পন্ন! আপনার Supabase ডাটাবেজ এখন পুরোপুরি প্রস্তুত।
-- ========================================================
