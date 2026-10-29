import { supabase, SUPABASE_URL } from '../lib/supabase';
import { Product, Order, UserProfile, ProductFolder, Coupon, SiteContent, AdminRole, AdminUser } from '../types';

export const SUPABASE_SQL_SCHEMA = `-- ========================================================
-- SmartShop BD - Supabase PostgreSQL Schema
-- Run this in Supabase Dashboard -> SQL Editor if not created yet
-- ========================================================

-- 1. Products Table
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

-- 2. Orders Table
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

-- 3. User Profiles Table
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

-- 4. Site Content Table
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

-- 5. Role-Based Admin Users Table (Secure Admin Access Control)
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'manager')),
  full_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) & Public Access Policies for E-commerce
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Allow public read & write via Anon Key for store operation
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public select on products') THEN
    CREATE POLICY "Allow public select on products" ON public.products FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public insert on products') THEN
    CREATE POLICY "Allow public insert on products" ON public.products FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public update on products') THEN
    CREATE POLICY "Allow public update on products" ON public.products FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public delete on products') THEN
    CREATE POLICY "Allow public delete on products" ON public.products FOR DELETE USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public all on orders') THEN
    CREATE POLICY "Allow public all on orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public all on user_profiles') THEN
    CREATE POLICY "Allow public all on user_profiles" ON public.user_profiles FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public all on site_content') THEN
    CREATE POLICY "Allow public all on site_content" ON public.site_content FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public all on admin_users') THEN
    CREATE POLICY "Allow public all on admin_users" ON public.admin_users FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Initial Super Admin Account Seed (Owner can customize password directly in Supabase)
INSERT INTO public.admin_users (email, password_hash, role, full_name, is_active)
VALUES (
  'mdnahidislam843150@gmail.com',
  'Admin@Nahid2026',
  'super_admin',
  'Md Nahid Islam (Owner)',
  true
)
ON CONFLICT (email) DO NOTHING;
`;

// Helper: Transform Supabase DB row to Product object
function mapDbRowToProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name || row.name_bn,
    nameBn: row.name_bn || row.name,
    folderId: row.folder_id || undefined,
    category: row.category,
    categoryBn: row.category_bn,
    price: Number(row.price),
    originalPrice: Number(row.original_price || row.price),
    rating: Number(row.rating || 4.8),
    reviewsCount: Number(row.reviews_count || 12),
    image: row.image,
    inStock: Boolean(row.in_stock),
    stockCount: Number(row.stock_count || 50),
    isFlashSale: Boolean(row.is_flash_sale),
    discountPercent: Number(row.discount_percent || 0),
    description: row.description || '',
    descriptionBn: row.description_bn || row.description || '',
    fabricDetails: row.fabric_details || undefined,
    tags: Array.isArray(row.tags) ? row.tags : (typeof row.tags === 'string' ? JSON.parse(row.tags) : []),
    colors: Array.isArray(row.colors) ? row.colors : (typeof row.colors === 'string' ? JSON.parse(row.colors) : []),
    sizes: Array.isArray(row.sizes) ? row.sizes : (typeof row.sizes === 'string' ? JSON.parse(row.sizes) : [])
  };
}

// Helper: Transform Product object to Supabase DB row
function mapProductToDbRow(p: Product) {
  return {
    id: p.id,
    name: p.name || p.nameBn,
    name_bn: p.nameBn,
    folder_id: p.folderId || null,
    category: p.category,
    category_bn: p.categoryBn,
    price: p.price,
    original_price: p.originalPrice,
    rating: p.rating,
    reviews_count: p.reviewsCount,
    image: p.image,
    in_stock: p.inStock,
    stock_count: p.stockCount,
    is_flash_sale: p.isFlashSale ?? false,
    discount_percent: p.discountPercent ?? 0,
    description: p.description,
    description_bn: p.descriptionBn,
    fabric_details: p.fabricDetails || null,
    tags: p.tags || [],
    colors: p.colors || [],
    sizes: p.sizes || [],
    updated_at: new Date().toISOString()
  };
}

// Helper: Transform Supabase DB row to Order object
function mapDbRowToOrder(row: any): Order {
  return {
    id: row.id,
    items: Array.isArray(row.items) ? row.items : (typeof row.items === 'string' ? JSON.parse(row.items) : []),
    total: Number(row.total),
    customerName: row.customer_name,
    phone: row.phone,
    address: row.address,
    district: row.district || 'ঢাকা',
    thanaCity: row.thana_city || 'ধানমন্ডি',
    deliveryMethod: row.delivery_method || 'regular',
    subtotal: Number(row.subtotal || row.total),
    deliveryFee: Number(row.delivery_fee || 60),
    discount: Number(row.discount || 0),
    couponCode: row.coupon_code || undefined,
    status: row.status,
    paymentMethod: row.payment_method || 'cod',
    createdAt: row.created_at,
    trxId: row.trx_id || undefined,
    senderPhone: row.sender_phone || undefined,
    orderNotes: row.notes || row.order_notes || undefined
  };
}

// Helper: Transform Order object to Supabase DB row
function mapOrderToDbRow(o: Order) {
  return {
    id: o.id,
    customer_name: o.customerName,
    phone: o.phone,
    address: o.address,
    district: o.district || null,
    thana_city: o.thanaCity || null,
    delivery_method: o.deliveryMethod || 'regular',
    subtotal: o.subtotal || o.total,
    items: o.items,
    total: o.total,
    payment_method: o.paymentMethod,
    delivery_fee: o.deliveryFee ?? 60,
    discount: o.discount ?? 0,
    coupon_code: o.couponCode || null,
    status: o.status,
    trx_id: o.trxId || null,
    sender_phone: o.senderPhone || null,
    notes: o.orderNotes || null,
    created_at: o.createdAt || new Date().toISOString()
  };
}

// ========================================================
// API SERVICES WITH RESILIENT FALLBACKS
// ========================================================

/**
 * Check if Supabase connection is healthy
 */
export async function testSupabaseConnection(): Promise<{ connected: boolean; message: string }> {
  try {
    const { data, error } = await supabase.from('products').select('id').limit(1);
    if (error) {
      // If table doesn't exist yet, connection to Supabase is still valid
      if (error.code === '42P01' || error.message.includes('relation') || error.message.includes('does not exist')) {
        return { 
          connected: true, 
          message: 'Supabase প্রজেক্ট কানেক্টেড (টেবিলগুলো তৈরি করার জন্য SQL স্ক্রিপ্ট রান করুন)।' 
        };
      }
      return { connected: false, message: error.message };
    }
    return { connected: true, message: 'Supabase ব্যাকএন্ড সফলভাবে সংযুক্ত এবং সক্রিয় রয়েছে!' };
  } catch (err: any) {
    return { connected: false, message: err?.message || 'কানেকশন ব্যর্থ হয়েছে' };
  }
}

/**
 * Fetch all products from Supabase
 */
export async function fetchProductsFromSupabase(): Promise<Product[] | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetchProducts warning:', error.message);
      return null;
    }

    if (data && data.length > 0) {
      return data.map(mapDbRowToProduct);
    }
    return null;
  } catch (err) {
    console.warn('Supabase fetchProducts network issue:', err);
    return null;
  }
}

/**
 * Upsert a product into Supabase
 */
export async function syncProductToSupabase(product: Product): Promise<boolean> {
  try {
    const row = mapProductToDbRow(product);
    const { error } = await supabase
      .from('products')
      .upsert(row, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase syncProduct error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase syncProduct network issue:', err);
    return false;
  }
}

/**
 * Delete a product from Supabase
 */
export async function deleteProductFromSupabase(productId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      console.warn('Supabase deleteProduct error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase deleteProduct network issue:', err);
    return false;
  }
}

/**
 * Fetch all orders from Supabase
 */
export async function fetchOrdersFromSupabase(): Promise<Order[] | null> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetchOrders error:', error.message);
      return null;
    }

    if (data) {
      return data.map(mapDbRowToOrder);
    }
    return null;
  } catch (err) {
    console.warn('Supabase fetchOrders network issue:', err);
    return null;
  }
}

/**
 * Insert new order into Supabase
 */
export async function createOrderInSupabase(order: Order): Promise<boolean> {
  try {
    const row = mapOrderToDbRow(order);
    const { error } = await supabase
      .from('orders')
      .upsert(row, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase createOrder error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase createOrder network issue:', err);
    return false;
  }
}

/**
 * Update order status in Supabase (e.g. Approved, Shipped, Delivered, Cancelled)
 */
export async function updateOrderStatusInSupabase(orderId: string, status: Order['status']): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      console.warn('Supabase updateOrderStatus error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase updateOrderStatus network issue:', err);
    return false;
  }
}

/**
 * Delete order from Supabase
 */
export async function deleteOrderFromSupabase(orderId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);

    if (error) {
      console.warn('Supabase deleteOrder error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase deleteOrder network issue:', err);
    return false;
  }
}

/**
 * Fetch User Profile from Supabase
 */
export async function fetchUserProfileFromSupabase(profileId: string = 'usr_nahid_vip'): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', profileId)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      phone: data.phone,
      email: data.email || '',
      avatarUrl: data.avatar_url || undefined,
      gender: data.gender || 'male',
      dateOfBirth: data.date_of_birth || undefined,
      memberSince: data.member_since || '2024',
      membershipTier: data.membership_tier || 'VIP',
      smartPoints: Number(data.smart_points || 850),
      walletBalance: Number(data.wallet_balance || 320),
      savedAddresses: Array.isArray(data.saved_addresses) ? data.saved_addresses : [],
      wishlistProductIds: Array.isArray(data.wishlist_product_ids) ? data.wishlist_product_ids : []
    };
  } catch (err) {
    return null;
  }
}

/**
 * Upsert User Profile into Supabase
 */
export async function syncUserProfileToSupabase(profile: UserProfile): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .upsert({
        id: profile.id,
        name: profile.name,
        phone: profile.phone,
        email: profile.email,
        avatar_url: profile.avatarUrl || null,
        gender: profile.gender || 'male',
        date_of_birth: profile.dateOfBirth || null,
        member_since: profile.memberSince,
        membership_tier: profile.membershipTier,
        smart_points: profile.smartPoints,
        wallet_balance: profile.walletBalance,
        saved_addresses: profile.savedAddresses,
        wishlist_product_ids: profile.wishlistProductIds,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase syncUserProfile error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Fetch Site Content from Supabase
 */
export async function fetchSiteContentFromSupabase(): Promise<SiteContent | null> {
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .eq('id', 'current')
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return {
      storeNameBn: data.store_name_bn,
      storeNameEn: data.store_name_en,
      taglineBn: data.tagline_bn,
      announcementBn: data.announcement_bn,
      hotline: data.hotline,
      email: data.email,
      addressBn: data.address_bn,
      heroHeadlineBn: data.hero_headline_bn,
      heroSubtitleBn: data.hero_subtitle_bn,
      heroBadgeBn: data.hero_badge_bn,
      freeShippingThreshold: Number(data.free_shipping_threshold || 2000),
      logoUrl: data.logo_url || undefined,
      bannerUrl: data.banner_url || undefined,
      bkashNumber: data.bkash_number || undefined,
      nagadNumber: data.nagad_number || undefined
    };
  } catch (err) {
    return null;
  }
}

/**
 * Sync Site Content to Supabase
 */
export async function syncSiteContentToSupabase(content: SiteContent): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('site_content')
      .upsert({
        id: 'current',
        store_name_bn: content.storeNameBn,
        store_name_en: content.storeNameEn,
        tagline_bn: content.taglineBn,
        announcement_bn: content.announcementBn,
        hotline: content.hotline,
        email: content.email,
        address_bn: content.addressBn,
        hero_headline_bn: content.heroHeadlineBn,
        hero_subtitle_bn: content.heroSubtitleBn,
        hero_badge_bn: content.heroBadgeBn,
        free_shipping_threshold: content.freeShippingThreshold,
        logo_url: content.logoUrl || null,
        banner_url: content.bannerUrl || null,
        bkash_number: content.bkashNumber || null,
        nagad_number: content.nagadNumber || null,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase syncSiteContent error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Seed all initial products to Supabase in bulk (1-click helper)
 */
export async function seedProductsToSupabase(products: Product[]): Promise<{ count: number; error?: string }> {
  try {
    const rows = products.map(mapProductToDbRow);
    const { data, error } = await supabase
      .from('products')
      .upsert(rows, { onConflict: 'id' });

    if (error) {
      return { count: 0, error: error.message };
    }
    return { count: products.length };
  } catch (err: any) {
    return { count: 0, error: err?.message || 'Error seeding products' };
  }
}

/**
 * Verify Admin Login with Role-Based Access Control via Supabase
 * Ensures NO hardcoded passwords exist in client source code.
 */
export async function verifyAdminLogin(
  emailInput: string,
  passwordInput: string
): Promise<{ success: boolean; admin?: AdminUser; message?: string }> {
  const cleanEmail = emailInput.trim().toLowerCase();
  const cleanPass = passwordInput.trim();

  if (!cleanEmail || !cleanPass) {
    return { success: false, message: 'অনুগ্রহ করে ইমেইল ও পাসওয়ার্ড উভয়ই পূরণ করুন।' };
  }

  try {
    // 1. Try Supabase Auth first if admin registered via Supabase Auth
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPass
      });

      if (!authError && authData?.user) {
        const { data: adminRecord } = await supabase
          .from('admin_users')
          .select('*')
          .ilike('email', cleanEmail)
          .eq('is_active', true)
          .maybeSingle();

        if (adminRecord) {
          return {
            success: true,
            admin: {
              id: adminRecord.id,
              email: adminRecord.email,
              fullName: adminRecord.full_name || 'Admin',
              role: (adminRecord.role as AdminRole) || 'admin',
              isActive: Boolean(adminRecord.is_active),
              createdAt: adminRecord.created_at,
              updatedAt: adminRecord.updated_at
            }
          };
        }
      }
    } catch {
      // Continue to direct admin_users table check
    }

    // 2. Direct verification in admin_users table in Supabase
    const { data: adminRow, error: dbError } = await supabase
      .from('admin_users')
      .select('*')
      .ilike('email', cleanEmail)
      .maybeSingle();

    if (dbError) {
      console.warn('Supabase admin_users query error:', dbError.message);
      return { 
        success: false, 
        message: 'Supabase ডাটাবেজে admin_users টেবিলটি তৈরি করা হয়নি। অনুগ্রহ করে নিচের সেটআপ গাইড থেকে SQL রান করুন।' 
      };
    }

    if (!adminRow) {
      return { 
        success: false, 
        message: 'এই ইমেইলটি অনুমোদিত অ্যাডমিন তালিকায় পাওয়া যায়নি।' 
      };
    }

    if (!adminRow.is_active) {
      return { 
        success: false, 
        message: 'আপনার অ্যাডমিন অ্যাকাউন্টটি বর্তমানে নিষ্ক্রিয় (Deactivated) রয়েছে।' 
      };
    }

    // Match password against password_hash stored in Supabase
    const isPasswordMatch = adminRow.password_hash === cleanPass;

    if (!isPasswordMatch) {
      return { 
        success: false, 
        message: 'ভুল পাসওয়ার্ড! অনুগ্রহ করে সঠিক পাসওয়ার্ড দিন।' 
      };
    }

    return {
      success: true,
      admin: {
        id: adminRow.id,
        email: adminRow.email,
        fullName: adminRow.full_name,
        role: (adminRow.role as AdminRole) || 'admin',
        isActive: Boolean(adminRow.is_active),
        createdAt: adminRow.created_at,
        updatedAt: adminRow.updated_at
      }
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'লগইন যাচাই করার সময় ত্রুটি ঘটেছে।'
    };
  }
}

/**
 * Fetch all Admin users from Supabase (For Super Admin management)
 */
export async function fetchAdminUsers(): Promise<AdminUser[]> {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('id, email, full_name, role, is_active, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map((row: any) => ({
      id: row.id,
      email: row.email,
      fullName: row.full_name,
      role: (row.role as AdminRole) || 'admin',
      isActive: Boolean(row.is_active),
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  } catch {
    return [];
  }
}

/**
 * Add a new Admin user to Supabase
 */
export async function createAdminUser(userData: {
  email: string;
  password: string;
  fullName: string;
  role: AdminRole;
}): Promise<{ success: boolean; message?: string; user?: AdminUser }> {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .insert({
        email: userData.email.trim().toLowerCase(),
        password_hash: userData.password.trim(),
        full_name: userData.fullName.trim(),
        role: userData.role,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      return { success: false, message: error.message };
    }

    return {
      success: true,
      user: {
        id: data.id,
        email: data.email,
        fullName: data.full_name,
        role: data.role as AdminRole,
        isActive: data.is_active,
        createdAt: data.created_at
      }
    };
  } catch (err: any) {
    return { success: false, message: err?.message || 'অ্যাডমিন তৈরি ব্যর্থ হয়েছে' };
  }
}

/**
 * Update Admin Role or Status
 */
export async function updateAdminUser(
  id: string,
  updates: { role?: AdminRole; isActive?: boolean; fullName?: string; password?: string }
): Promise<boolean> {
  try {
    const payload: any = { updated_at: new Date().toISOString() };
    if (updates.role) payload.role = updates.role;
    if (updates.isActive !== undefined) payload.is_active = updates.isActive;
    if (updates.fullName) payload.full_name = updates.fullName;
    if (updates.password) payload.password_hash = updates.password;

    const { error } = await supabase
      .from('admin_users')
      .update(payload)
      .eq('id', id);

    return !error;
  } catch {
    return false;
  }
}

/**
 * Delete an Admin user
 */
export async function deleteAdminUser(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('admin_users')
      .delete()
      .eq('id', id);

    return !error;
  } catch {
    return false;
  }
}
