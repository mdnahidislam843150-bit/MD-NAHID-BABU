export interface PromptTemplate {
  id: string;
  titleBn: string;
  titleEn: string;
  category: string;
  descriptionBn: string;
  banglaPrompt: string;
  englishPrompt: string;
}

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'bangladesh-ecommerce-complete',
    titleBn: 'বাংলাদেশের জন্য অল-ইন-ওয়ান ইকমার্স (বিকাশ, নগদ, ক্যাশ অন ডেলিভারি)',
    titleEn: 'All-in-One Bangladeshi E-Commerce (bKash, Nagad, COD)',
    category: 'Full Store',
    descriptionBn: 'দেশীয় বাজারের জন্য উপযোগী অর্ডার ফরম, জেলাভিত্তিক ডেলিভারি ও মোবাইল ব্যাংকিং সমন্বিত স্টোর।',
    banglaPrompt: `আমি Google AI Studio দিয়ে একটি আধুনিক, আকর্ষণীয় এবং সম্পূর্ণ কার্যকরী ইকমার্স (E-Commerce) ওয়েবসাইট তৈরি করতে চাই। দয়া করে নিচের সমস্ত রিকোয়ারমেন্ট অনুযায়ী অ্যাপ্লিকেশনটি কোড করে দিন:

১. প্রযুক্তির বিবরণ (Tech Stack):
- ফ্রন্টএন্ড: React (TypeScript) এবং আধুনিক Tailwind CSS।
- আইকন: Lucide-React।
- অ্যানিমেশন ও ট্রানজিশন: মসৃণ UI ইন্টারঅ্যাকশন।

২. মূল ফিচারসমূহ (Core Features):
- হোমপেজ: হিরো ব্যানার স্লাইডার, বিশেষ অফার কাউন্টডাউন, ক্যাটাগরি গ্রিড এবং হট ডিলস।
- প্রোডাক্ট ক্যাটালগ: ক্যাটাগরি ফিল্টার, সার্চ বার, প্রাইস ফিল্টার, স্টার রেটিং ও ডিসকাউন্ট ব্যাজ।
- কুইক ভিউ এবং ডিটেইলস মডাল: একাধিক কালার/সাইজ অপশন, স্টক স্ট্যাটাস, বিস্তারিত বিবরণ ও ইমেজ গ্যালারি।
- কার্ট সিস্টেম (Cart Drawer): সাইডবার কার্ট, প্রোডাক্ট সংখ্যা বাড়ানো/কমানো, রিয়েল-টাইম সাবটোটাল ও ডিসকাউন্ট হিসেব।
- ডিসকাউন্ট কুপন কোড সিস্টেম: প্রোমো কোড অ্যাপ্লাই করার ব্যবস্থা (যেমন: EID20, FREESHIP)।

৩. পারফেক্ট চেকআউট ও অর্ডার ফরম (Checkout Form):
- কাস্টমারের পুরো নাম।
- ১১ ডিজিটের মোবাইল নম্বর (বাংলাদেশি 01... ফরম্যাট ভ্যালিডেশন)।
- জেলা ও থানা নির্বাচন (ঢাকা, চট্টগ্রাম, সিলেট ইত্যাদি ড্রপডাউন)।
- বিস্তারিত ডেলিভারি ঠিকানা (বাসা/রোড নম্বর)।
- ডেলিভারি মেথড: ঢাকার ভেতরে (৬০ টাকা), ঢাকার বাইরে (১২০ টাকা), এক্সপ্রেস ডেলিভারি।
- পেমেন্ট মেথড:
  * ক্যাশ অন ডেলিভারি (Cash on Delivery)
  * বিকাশ (bKash) - সেন্ড মানি নম্বর ও TrxID ইনপুট ফিল্ড
  * নগদ (Nagad) - মার্চেন্ট/পার্সোনাল নম্বর ও ট্রানজেকশন আইডি ফিল্ড
- অর্ডার কনফার্মেশন স্লিপ ও ইনভয়েস প্রিভিউ (অর্ডার আইডি, প্রিন্ট অপশন সহ)।

৪. অতিরিক্ত সুবিধাসমূহ:
- বাংলা ও ইংরেজি ভাষা পরিবর্তনের অপশন (Language Switcher: বাংলা / English)।
- কারেন্সি টগল (টাকা ৳ / ডলার $)।
- অ্যাডমিন প্যানেল ভিউ: যেখানে নতুন প্রোডাক্ট যোগ করা এবং আসা সমস্ত অর্ডার লিস্ট ট্র্যাক করা যাবে।
- ফুল্লি রেসপন্সিভ: মোবাইল ও কম্পিউটার যেকোনো স্ক্রিনে নিখুঁত ডিসপ্লে।

দয়া করে কোডে কোনো মক এরর রাখবেন না, সম্পূর্ণ রানিং কোড তৈরি করুন।`,
    englishPrompt: `Create a comprehensive, production-ready E-Commerce web application in React (TypeScript) and Tailwind CSS with full support for local and global commerce.

Features required:
1. Product Catalog: Real-time search, category filtering (Electronics, Fashion, Groceries, Home), price filter, stock badges, and customer ratings.
2. Product Details: Dynamic image gallery, size/color variant selection, stock countdown, and instant "Buy Now" button.
3. Shopping Cart: Drawer cart with quantity modifiers, automatic subtotal calculation, and promo coupon engine.
4. Comprehensive Checkout Form:
   - Customer Full Name and Phone validation
   - City & District dropdown
   - Detailed delivery street address
   - Dynamic Shipping calculation based on region (Standard & Express)
   - Payment options: Cash on Delivery (COD), Mobile Banking (bKash/Nagad with TrxID verification), and Card
5. Post-Checkout Experience: Order confirmation modal with printable invoice, tracking timeline, and order status badge.
6. Admin Dashboard: Manage inventory, add new products, and inspect incoming order history.
7. Internationalization: Bilingual toggle (Bangla & English) and Currency Switcher (BDT ৳ & USD $).`
  },
  {
    id: 'fashion-boutique-store',
    titleBn: 'অল-ইন-ওয়ান পোশাক ও ফ্যাশন স্টোর (শার্ট, শাড়ি, পাঞ্জাবি, বোরকা, হুডি, বাচ্চাদের কালেকশন)',
    titleEn: 'Family Clothing & Lifestyle Superstore (Panjabi, Saree, Abaya, Hoodies & Kids)',
    category: 'Fashion',
    descriptionBn: 'শার্ট, টি-শার্ট, পাঞ্জাবি, প্যান্ট, হুডি, জ্যাকেট, থ্রি পিস, শাড়ি, বোরকা, হিজাব, লেহেঙ্গা, ব্যাগ, জুতা ও বাচ্চাদের কালেকশনের জন্য স্পেশাল প্রম্পট।',
    banglaPrompt: `Google AI Studio দিয়ে আমার জন্য একটি পূর্ণাঙ্গ পোশাক ও লাইফস্টাইল ইকমার্স ওয়েবসাইট তৈরি করে দিন:

১. কালেকশন ও প্রোডাক্ট ক্যাটাগরি:
- পুরুষদের পোশাক: প্রিমিয়াম ফরমাল ও ক্যাজুয়াল শার্ট, ড্রপ-শোল্ডার টি-শার্ট, এমব্রয়ডারি সেমিলং পাঞ্জাবি, স্ট্রেচ গ্যাবার্ডিন/জিন্স প্যান্ট।
- উইন্টার কালেকশন: ছেলে ও মেয়েদের ভারী ফ্লিস ক্যাঙ্গারু হুডি, উইন্ডপ্রুফ লেদার ও পাফার জ্যাকেট।
- নারীদের ফ্যাশন: এক্সক্লুসিভ কাশ্মীরি সুতোর থ্রি পিস, ঐতিহ্যবাহী খাঁটি ঢাকাই জামদানি ও সিল্ক শাড়ি, প্রিমিয়াম দুবাই চেরি আবায়া/বোরকা, সফট বাবল শিফন হিজাব, ব্রাইডাল ভারী লেহেঙ্গা চোলি।
- এক্সেসরিজ ও ফুটওয়্যার: ফ্যাশনেবল লেডিস হ্যান্ডব্যাগ এবং প্রিমিয়াম জেনুইন লেদার জুতো/লোফার।
- বাচ্চাদের স্পেশাল কালেকশন: শিশুদের নরম স্কিন-ফ্রেন্ডলি ফ্লিস শীতের জামা/জ্যাকেট সেট এবং আকর্ষণীয় রিমোট কন্ট্রোল খেলনা।

২. মূল ফিচারসমূহ:
- প্রতিটি পণ্যের কালার সোয়াচ এবং সাইজ নির্বাচন (M, L, XL, XXL, ৩৮, ৪০, ৪২, বাচ্চাদের বয়সভিত্তিক সাইজ)।
- ১-ক্লিক "অর্ডার করুন" দ্রুত চেকআউট এবং সাইডবার শপিং কার্ট।
- ডিসকাউন্ট কুপন কোড প্রয়োগের সুবিধা (যেমন: FASHION20)।

৩. পারফেক্ট চেকআউট ও পেমেন্ট ফরম:
- গ্রাহকের নাম, সঠিক ১১ ডিজিটের মোবাইল নম্বর, জেলা নির্বাচন ড্রপডাউন (ঢাকার ভেতরে ৬০৳, বাইরে ১২০৳)।
- বিকাশ ও নগদ সেন্ড মানি (TrxID ফিল্ড সহ) এবং ক্যাশ অন ডেলিভারি (পণ্য হাতে পেয়ে টাকা পরিশোধ)।
- অর্ডার শেষে কনফেটি সেলিব্রেশন, ট্র্যাকিং আইডি এবং প্রিন্টযোগ্য ইনভয়েস স্লিপ।

৪. ডিজাইন ও প্রযুক্তি:
- React (TypeScript), Tailwind CSS ও Lucide Icons। নিখুঁত রেসপন্সিভ ও সুপার ফাস্ট লোডিং।`,
    englishPrompt: `Build an exclusive Full-Family Apparel & Lifestyle e-commerce store in React (TypeScript) and Tailwind CSS.
Include:
- Complete catalog for Shirts, T-Shirts, Panjabis, Chino Pants, Hoodies, Jackets, Sarees, Three-Pieces, Abayas, Hijabs, Lehengas, Handbags, Shoes, Kids Winter Wear, and Toys.
- Dynamic size and color variant selectors for apparel.
- High-converting checkout form with Cash on Delivery and Bangladeshi mobile banking (bKash/Nagad TrxID verification).
- Responsive mobile drawer cart, promo code engine, and printable invoice order receipt.`
  },
  {
    id: 'organic-grocery-store',
    titleBn: 'অর্গানিক ফুড ও ডেইলি গ্রোসারি ডেলিভারি শপ',
    titleEn: 'Organic Foods & Daily Grocery Superstore',
    category: 'Grocery',
    descriptionBn: 'খাঁটি মধু, ঘি, চাল, সরিষার তেল ও নিত্যপ্রয়োজনীয় পণ্যের জন্য দ্রুত অর্ডার ব্যবস্থা।',
    banglaPrompt: `Google AI Studio দিয়ে একটি খাঁটি অর্গানিক ফুড ও গ্রোসারি ডেলিভারি ইকমার্স সাইট তৈরি করুন:
- তাজা খাবার, মধু, ঘানিভাঙা তেল, ড্রাই ফ্রুটস ও অর্গানিক আইটেমের সুসজ্জিত ক্যাটালগ।
- কেজি/গ্রাম বা লিটার ভিত্তিক ভ্যারিয়েন্ট নির্বাচন (যেমন: ৫০০ গ্রাম, ১ কেজি, ৫ লিটার)।
- সহজ ও দ্রুত "অর্ডার ফরম" - যেখানে কোনো অ্যাকাউন্ট খোলার ঝামেলা ছাড়াই নাম, ফোন নম্বর ও ঠিকানা দিয়ে সাথে সাথে অর্ডার প্লেস করা যায়।
- ফোন নম্বর ও হোয়াটসঅ্যাপে অর্ডার কনফার্মেশনের ডাইরেক্ট লিঙ্ক।
- অর্ডার ডেলিভারি স্লট সিলেকশন (সকাল ৯টা-১টা, বিকেল ৩টা-৮টা)।`,
    englishPrompt: `Develop an organic grocery and pantry e-commerce web application with:
- Unit-based variant selection (e.g., 500g, 1kg, 2L).
- Frictionless guest checkout with WhatsApp direct order integration.
- Delivery slot selector (Morning / Evening batches).
- Freshness guarantee badges and authentic sourcing certifications.`
  },
  {
    id: 'gadget-electronics-superstore',
    titleBn: 'টেক গ্যাজেট ও ইলেকট্রনিক্স হাব',
    titleEn: 'Tech Gadget & Electronics Store with Specs',
    category: 'Electronics',
    descriptionBn: 'স্মার্টফোন, হেডফোন, স্মার্টওয়াচ ও গ্যাজেটের জন্য স্পেসিফিকেশন তুলনা ও ওয়ারেন্টি অপশন।',
    banglaPrompt: `Google AI Studio দিয়ে একটি প্রিমিয়াম গ্যাজেট ও ইলেকট্রনিক্স শপ তৈরি করুন:
- টেকনিক্যাল স্পেসিফিকেশন টেবিল (RAM, Battery, Processor, Warranty)।
- অফিশিয়াল ও আন-অফিশিয়াল ওয়ারেন্টি ভ্যারিয়েন্ট টগল।
- ফ্ল্যাশ সেল ও কাউন্টডাউন টাইমার।
- EMI ও কিস্তি ক্যালকুলেটর প্রিভিউ।
- সিকিউর চেকআউট ফরম ও তাৎক্ষণিক ট্র্যাকিং স্লিপ।`,
    englishPrompt: `Create a cutting-edge consumer electronics store with technical specification comparison, official vs unofficial warranty selector, live flash sale countdown, and instant order tracking modal.`
  }
];
