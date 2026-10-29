export interface Product {
  id: string;
  name: string;
  nameBn: string;
  folderId?: string;
  category: string;
  categoryBn: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  image: string;
  images?: string[];
  colorImages?: { [colorName: string]: string };
  inStock: boolean;
  stockCount: number;
  isFlashSale?: boolean;
  discountPercent?: number;
  description: string;
  descriptionBn: string;
  fabricDetails?: string;
  specifications?: { label: string; value: string }[];
  tags: string[];
  colors?: string[];
  sizes?: string[];
}

export interface ProductFolder {
  id: string;
  nameBn: string;
  nameEn: string;
  icon: string;
  coverImage: string;
  descriptionBn: string;
  tag: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export type PaymentMethod = 'cod' | 'bkash' | 'nagad' | 'rocket' | 'card';

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  phone: string;
  address: string;
  district: string;
  thanaCity: string;
  deliveryMethod: 'regular' | 'express';
  deliveryFee: number;
  paymentMethod: PaymentMethod;
  trxId?: string;
  senderPhone?: string;
  orderNotes?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  total: number;
  status: 'Pending' | 'Approved' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpend: number;
  description: string;
}

export interface SiteContent {
  storeNameBn: string;
  storeNameEn: string;
  taglineBn: string;
  announcementBn: string;
  hotline: string;
  email: string;
  addressBn: string;
  heroHeadlineBn: string;
  heroSubtitleBn: string;
  heroBadgeBn: string;
  freeShippingThreshold: number;
  logoUrl?: string;
  bannerUrl?: string;
  bkashNumber?: string;
  nagadNumber?: string;
}

export interface OrderNotification {
  id: string;
  orderId: string;
  customerName: string;
  phone: string;
  total: number;
  paymentMethod: PaymentMethod;
  itemCount: number;
  createdAt: string;
  isRead: boolean;
}

export interface UserAddress {
  id: string;
  label: string;
  labelBn: string;
  district: string;
  thanaCity: string;
  streetAddress: string;
  isDefault: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  password?: string;
  avatarUrl?: string;
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  memberSince: string;
  membershipTier: 'Silver' | 'Gold' | 'VIP' | 'Regular';
  smartPoints: number;
  walletBalance: number;
  savedAddresses: UserAddress[];
  wishlistProductIds: string[];
}

export type AdminRole = 'super_admin' | 'admin' | 'manager';

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: AdminRole;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
