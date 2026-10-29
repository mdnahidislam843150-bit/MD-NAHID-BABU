/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Product, ProductFolder, CartItem, Order, Coupon, SiteContent, OrderNotification, UserProfile } from './types';
import { 
  INITIAL_PRODUCTS, 
  PRODUCT_FOLDERS, 
  AVAILABLE_COUPONS, 
  DEFAULT_SITE_CONTENT, 
  DEFAULT_ADMIN_EMAIL,
  DEFAULT_USER_PROFILE
} from './data/mockProducts';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { FolderGrid } from './components/FolderGrid';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { PromptBuilderModal } from './components/PromptBuilderModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { NotificationCenter } from './components/NotificationCenter';
import { WebsiteLinkModal } from './components/WebsiteLinkModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { UserProfilePage } from './components/UserProfilePage';
import { CustomerAuthModal } from './components/CustomerAuthModal';
import { Footer } from './components/Footer';
import { playOrderNotificationSound } from './utils/sound';
import { safeLocalStorageGet, safeLocalStorageSet, safeLocalStorageRemove, cleanupStorageQuotas } from './utils/storage';
import { Sparkles, ShoppingBag, Zap, Filter, ArrowUpDown, FolderOpen, ArrowLeft, Lock, Bell, PackageCheck, User } from 'lucide-react';
import { 
  fetchProductsFromSupabase, 
  syncProductToSupabase, 
  deleteProductFromSupabase,
  fetchOrdersFromSupabase, 
  createOrderInSupabase, 
  updateOrderStatusInSupabase, 
  deleteOrderFromSupabase,
  fetchUserProfileFromSupabase, 
  syncUserProfileToSupabase,
  fetchSiteContentFromSupabase, 
  syncSiteContentToSupabase
} from './services/supabaseService';

export default function App() {
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');
  const [currency, setCurrency] = useState<'BDT' | 'USD'>('BDT');

  // Site Content State (Customizable by Admin)
  const [siteContent, setSiteContent] = useState<SiteContent>(() => {
    const saved = safeLocalStorageGet('smartshop_site_content_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const announcement = parsed.announcementBn && parsed.announcementBn.includes('৭ দিন')
          ? parsed.announcementBn.replace(/\|?\s*৭ দিনের সহজ রিটার্ন\s*\|?/g, '| ক্যাশ অন ডেলিভারি |').replace(/\|?\s*৭ দিনের রিটার্ন\s*\|?/g, '| ক্যাশ অন ডেলিভারি |')
          : (parsed.announcementBn || DEFAULT_SITE_CONTENT.announcementBn);
        return {
          ...DEFAULT_SITE_CONTENT,
          ...parsed,
          announcementBn: announcement,
          logoUrl: parsed.logoUrl || DEFAULT_SITE_CONTENT.logoUrl,
          bannerUrl: parsed.bannerUrl || DEFAULT_SITE_CONTENT.bannerUrl
        };
      } catch {
        return DEFAULT_SITE_CONTENT;
      }
    }
    return DEFAULT_SITE_CONTENT;
  });

  // Admin Credentials State (Configurable)
  const [adminEmail, setAdminEmail] = useState<string>(() => {
    const saved = safeLocalStorageGet('smartshop_admin_email');
    return saved || DEFAULT_ADMIN_EMAIL;
  });

  const [adminPassword, setAdminPassword] = useState<string>(() => {
    const saved = safeLocalStorageGet('smartshop_admin_password');
    return saved || '';
  });

  const [adminPin, setAdminPin] = useState<string>(() => {
    const saved = safeLocalStorageGet('amarshop_admin_pin');
    return saved || '';
  });

  // Folders State (Customizable)
  const [folders, setFolders] = useState<ProductFolder[]>(() => {
    const saved = safeLocalStorageGet('amarshop_folders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return PRODUCT_FOLDERS;
  });

  // Coupons State (Customizable)
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = safeLocalStorageGet('amarshop_coupons');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return AVAILABLE_COUPONS;
  });

  // Products State (Customizable)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = safeLocalStorageGet('amarshop_fashion_products_v4');
    let deletedIds: string[] = [];
    try {
      deletedIds = JSON.parse(safeLocalStorageGet('smartshop_deleted_product_ids') || '[]');
    } catch {
      deletedIds = [];
    }
    if (saved) {
      try {
        const parsed: Product[] = JSON.parse(saved);
        return parsed.filter((p) => !deletedIds.includes(p.id));
      } catch {
        return INITIAL_PRODUCTS.filter((p) => !deletedIds.includes(p.id));
      }
    }
    return INITIAL_PRODUCTS.filter((p) => !deletedIds.includes(p.id));
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = safeLocalStorageGet('amarshop_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [];
  });

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = safeLocalStorageGet('amarshop_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [showOnlyFlashSale, setShowOnlyFlashSale] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>('default');

  // Modals State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminInitialTab, setAdminInitialTab] = useState<'content' | 'products' | 'orders' | 'folders' | 'coupons' | 'settings'>('content');
  const [isWebsiteLinkModalOpen, setIsWebsiteLinkModalOpen] = useState(false);
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState<string | undefined>(undefined);
  const [addedItemIds, setAddedItemIds] = useState<{ [id: string]: boolean }>({});
  const [isCustomerAuthModalOpen, setIsCustomerAuthModalOpen] = useState(false);

  // Customer Logged In Status
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState<boolean>(() => {
    const saved = safeLocalStorageGet('smartshop_customer_logged_in');
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    safeLocalStorageSet('smartshop_customer_logged_in', String(isCustomerLoggedIn));
  }, [isCustomerLoggedIn]);

  // Page Navigation State: 'home' | 'profile' (Opens new dedicated customer account page)
  const [currentPage, setCurrentPage] = useState<'home' | 'profile'>(() => {
    return typeof window !== 'undefined' && window.location.hash === '#profile' ? 'profile' : 'home';
  });

  // User Profile State (Persistent in LocalStorage)
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = safeLocalStorageGet('smartshop_user_profile_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_USER_PROFILE,
          ...parsed,
          savedAddresses: parsed.savedAddresses || DEFAULT_USER_PROFILE.savedAddresses
        };
      } catch {
        return DEFAULT_USER_PROFILE;
      }
    }
    return DEFAULT_USER_PROFILE;
  });

  useEffect(() => {
    safeLocalStorageSet('smartshop_user_profile_v2', JSON.stringify(userProfile));
  }, [userProfile]);

  const navigateToProfile = () => {
    setCurrentPage('profile');
    window.location.hash = '#profile';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = () => {
    setCurrentPage('home');
    if (window.location.hash === '#profile') {
      history.pushState(null, '', window.location.pathname);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Notifications State (Real-time Customer Order Alerts)
  const [notifications, setNotifications] = useState<OrderNotification[]>(() => {
    const saved = safeLocalStorageGet('smartshop_order_notifications_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [toastNotification, setToastNotification] = useState<OrderNotification | null>(null);

  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    safeLocalStorageSet('smartshop_order_notifications_v1', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (toastNotification) {
      const timer = setTimeout(() => {
        setToastNotification(null);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [toastNotification]);

  // Clean obsolete storage items on mount
  useEffect(() => {
    cleanupStorageQuotas();
  }, []);

  // Sync to local storage safely
  useEffect(() => {
    safeLocalStorageSet('amarshop_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    safeLocalStorageSet('amarshop_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    safeLocalStorageSet('amarshop_fashion_products_v4', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    safeLocalStorageSet('amarshop_folders', JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    safeLocalStorageSet('amarshop_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    safeLocalStorageSet('smartshop_site_content_v2', JSON.stringify(siteContent));
  }, [siteContent]);

  useEffect(() => {
    safeLocalStorageSet('smartshop_admin_email', adminEmail);
  }, [adminEmail]);

  useEffect(() => {
    safeLocalStorageSet('smartshop_admin_password', adminPassword);
    safeLocalStorageSet('amarshop_admin_pin', adminPassword);
  }, [adminPassword]);

  // Initial cloud sync with Supabase backend (resilient & non-blocking)
  useEffect(() => {
    let isMounted = true;

    // Fetch remote products
    fetchProductsFromSupabase().then((remoteProds) => {
      if (isMounted && remoteProds && remoteProds.length > 0) {
        let deletedIds: string[] = [];
        try {
          deletedIds = JSON.parse(safeLocalStorageGet('smartshop_deleted_product_ids') || '[]');
        } catch {
          deletedIds = [];
        }
        const cleanProds = remoteProds.filter((p) => !deletedIds.includes(p.id));
        setProducts(cleanProds);
      }
    }).catch(() => {});

    // Fetch remote orders
    fetchOrdersFromSupabase().then((remoteOrders) => {
      if (isMounted && remoteOrders && remoteOrders.length > 0) {
        setOrders(remoteOrders);
      }
    }).catch(() => {});

    // Fetch remote user profile
    fetchUserProfileFromSupabase().then((remoteProfile) => {
      if (isMounted && remoteProfile) {
        setUserProfile((prev) => ({ ...prev, ...remoteProfile }));
      }
    }).catch(() => {});

    // Fetch remote site content
    fetchSiteContentFromSupabase().then((remoteContent) => {
      if (isMounted && remoteContent) {
        setSiteContent((prev) => ({ ...prev, ...remoteContent }));
      }
    }).catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  // Hidden Shortcut: Ctrl+Shift+A or Cmd+Shift+A or URL #admin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminModalOpen(true);
      }
    };

    const handleHash = () => {
      if (window.location.hash === '#profile') {
        setCurrentPage('profile');
      } else if (window.location.hash === '#admin') {
        setIsAdminModalOpen(true);
      } else if (window.location.hash === '' || window.location.hash === '#home') {
        setCurrentPage('home');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', handleHash);
    handleHash();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', handleHash);
    };
  }, []);

  const categories = [
    { id: 'Mens', nameBn: 'ছেলেদের পোশাক (শার্ট, পাঞ্জাবি, প্যান্ট)', nameEn: 'Men\'s Wear' },
    { id: 'Womens', nameBn: 'নারীদের ফ্যাশন (শাড়ি, থ্রি-পিস, বোরকা)', nameEn: 'Women\'s Fashion' },
    { id: 'Winter', nameBn: 'উইন্টার কালেকশন (হুডি ও জ্যাকেট)', nameEn: 'Winter Wear' },
    { id: 'Bags & Shoes', nameBn: 'জুতো ও ব্যাগ', nameEn: 'Shoes & Bags' },
    { id: 'Kids', nameBn: 'বাচ্চাদের পোশাক ও খেলনা', nameEn: 'Kids & Toys' }
  ];

  // Cart Handlers
  const handleAddToCart = (product: Product, quantity = 1, color?: string, size?: string) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === color &&
          item.selectedSize === size
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, quantity, selectedColor: color, selectedSize: size }];
      }
    });

    setAddedItemIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1200);
  };

  const handleInstantBuy = (product: Product, quantity = 1, color?: string, size?: string) => {
    // Direct "অর্ডার করুন" checkout: sets only the clicked product so items do not accumulate
    setCartItems([{ product, quantity, selectedColor: color, selectedSize: size }]);
    setIsCheckoutOpen(true);
  };

  const handleUpdateQuantity = (productId: string, quantity: number, color?: string, size?: string) => {
    if (quantity <= 0) {
      handleRemoveItem(productId, color, size);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (
          item.product.id === productId &&
          item.selectedColor === color &&
          item.selectedSize === size
        ) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (productId: string, color?: string, size?: string) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedColor === color &&
            item.selectedSize === size
          )
      )
    );
  };

  const handleApplyCoupon = (code: string) => {
    const coupon = coupons.find((c) => c.code === code);
    if (!coupon) {
      return { success: false, message: language === 'bn' ? 'ভুল কুপন কোড! অনুগ্রহ করে সঠিক কোড দিন।' : 'Invalid coupon code.' };
    }

    const subtotal = cartItems.reduce((acc, it) => acc + it.product.price * it.quantity, 0);
    if (subtotal < coupon.minSpend) {
      return {
        success: false,
        message: language === 'bn'
          ? `এই কুপনটির জন্য ন্যূনতম ${coupon.minSpend}৳ কেনাকাটা প্রয়োজন।`
          : `Minimum spend of ৳${coupon.minSpend} required.`
      };
    }

    setAppliedCoupon(coupon);
    return { success: true, message: language === 'bn' ? 'কুপন সফলভাবে যুক্ত হয়েছে!' : 'Coupon applied successfully!' };
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
  };

  const handleOrderSuccess = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setLatestOrder(newOrder);
    setCartItems([]);
    setAppliedCoupon(null);
    setIsCheckoutOpen(false);
    setIsSuccessModalOpen(true);

    // Save latest order ID for instant 1-click tracking by customer
    safeLocalStorageSet('amarshop_last_order_id', newOrder.id);

    // Trigger instant order notification on right
    const newNotif: OrderNotification = {
      id: `notif-${Date.now()}`,
      orderId: newOrder.id,
      customerName: newOrder.customerName,
      phone: newOrder.phone,
      total: newOrder.total,
      paymentMethod: newOrder.paymentMethod,
      itemCount: newOrder.items.reduce((sum, item) => sum + item.quantity, 0),
      createdAt: new Date().toISOString(),
      isRead: false
    };

    setNotifications((prev) => [newNotif, ...prev]);
    setToastNotification(newNotif);
    playOrderNotificationSound();

    // Sync new order to Supabase cloud database
    createOrderInSupabase(newOrder).catch((err) => {
      console.warn('Supabase sync order warning:', err);
    });
  };

  const handleOpenAdminOrders = () => {
    setAdminInitialTab('orders');
    setIsAdminModalOpen(true);
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    deleteOrderFromSupabase(orderId).catch(() => {});
  };

  const handleSendTestNotification = () => {
    const sampleNames = ['মো: তানভীর হাসান', 'সাদিয়া ইসলাম', 'মো: নাহিদ ইসলাম', 'আরিফ চৌধুরী', 'ফারিহা জাহান'];
    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const testNotif: OrderNotification = {
      id: `notif-${Date.now()}`,
      orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName: randomName,
      phone: '01784315047',
      total: Math.floor(1250 + Math.random() * 3200),
      paymentMethod: Math.random() > 0.5 ? 'bkash' : 'cod',
      itemCount: Math.floor(1 + Math.random() * 3),
      createdAt: new Date().toISOString(),
      isRead: false
    };

    setNotifications((prev) => [testNotif, ...prev]);
    setToastNotification(testNotif);
    playOrderNotificationSound();
  };

  // Admin Management Handlers
  const handleAddNewProduct = (newProd: Product) => {
    try {
      const deletedIds: string[] = JSON.parse(safeLocalStorageGet('smartshop_deleted_product_ids') || '[]');
      const filtered = deletedIds.filter((id) => id !== newProd.id);
      safeLocalStorageSet('smartshop_deleted_product_ids', JSON.stringify(filtered));
    } catch {}
    setProducts((prev) => [newProd, ...prev]);
    syncProductToSupabase(newProd).catch(() => {});
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    syncProductToSupabase(updatedProduct).catch(() => {});
  };

  const handleDeleteProduct = (productId: string) => {
    // 1. Remove from products state immediately
    setProducts((prev) => prev.filter((p) => p.id !== productId));

    // 2. Remove from cart items if user has added it to cart
    setCartItems((prev) => prev.filter((it) => it.product.id !== productId));

    // 3. Clear selected product if currently opened in details
    setSelectedProduct((prev) => (prev?.id === productId ? null : prev));

    // 4. Record deleted product ID in local storage so remote sync won't restore it
    try {
      const deletedIds: string[] = JSON.parse(safeLocalStorageGet('smartshop_deleted_product_ids') || '[]');
      if (!deletedIds.includes(productId)) {
        deletedIds.push(productId);
        safeLocalStorageSet('smartshop_deleted_product_ids', JSON.stringify(deletedIds));
      }
    } catch {}

    // 5. Delete from Supabase cloud database
    deleteProductFromSupabase(productId).catch((err) => {
      console.warn('Supabase delete product warning:', err);
    });
  };

  const handleAddFolder = (newFolder: ProductFolder) => {
    setFolders((prev) => [...prev, newFolder]);
  };

  const handleUpdateFolder = (updatedFolder: ProductFolder) => {
    setFolders((prev) =>
      prev.map((f) => (f.id === updatedFolder.id ? updatedFolder : f))
    );
  };

  const handleDeleteFolder = (folderId: string) => {
    setFolders((prev) => prev.filter((f) => f.id !== folderId));
    if (selectedFolderId === folderId) {
      setSelectedFolderId(null);
    }
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
    updateOrderStatusInSupabase(orderId, status).catch(() => {});
  };

  const handleAddCoupon = (newCoupon: Coupon) => {
    setCoupons((prev) => [newCoupon, ...prev.filter((c) => c.code !== newCoupon.code)]);
  };

  const handleDeleteCoupon = (code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
  };

  const handleUpdateSiteContent = (content: SiteContent) => {
    setSiteContent(content);
    syncSiteContentToSupabase(content).catch(() => {});
  };

  const handleUpdateUserProfile = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    syncUserProfileToSupabase(updatedProfile).catch(() => {});
  };

  const handleCustomerLoginSuccess = (profile: UserProfile) => {
    setUserProfile(profile);
    setIsCustomerLoggedIn(true);
    syncUserProfileToSupabase(profile).catch(() => {});
  };

  const handleCustomerLogout = () => {
    setIsCustomerLoggedIn(false);
  };

  const handleUpdateAdminPin = (newPin: string) => {
    setAdminPin(newPin);
  };

  const handleResetAllData = () => {
    safeLocalStorageRemove('amarshop_fashion_products_v4');
    safeLocalStorageRemove('amarshop_folders');
    safeLocalStorageRemove('amarshop_coupons');
    safeLocalStorageRemove('amarshop_site_content');
    safeLocalStorageRemove('smartshop_site_content_v2');
    safeLocalStorageRemove('smartshop_deleted_product_ids');
    setProducts(INITIAL_PRODUCTS);
    setFolders(PRODUCT_FOLDERS);
    setCoupons(AVAILABLE_COUPONS);
    setSiteContent(DEFAULT_SITE_CONTENT);
  };

  // Find active folder details
  const activeFolder = folders.find((f) => f.id === selectedFolderId);

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    // If a folder is selected, filter strictly by that folder!
    if (selectedFolderId && p.folderId !== selectedFolderId) {
      return false;
    }

    const matchesSearch =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nameBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.descriptionBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;

    const matchesTag =
      selectedTag === '' ||
      p.nameBn.includes(selectedTag) ||
      p.name.toLowerCase().includes(selectedTag.toLowerCase()) ||
      p.descriptionBn.includes(selectedTag) ||
      p.tags.some((t) => t.toLowerCase().includes(selectedTag.toLowerCase()));

    const matchesFlash = !showOnlyFlashSale || p.isFlashSale;

    return matchesSearch && matchesCategory && matchesTag && matchesFlash;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  const isBn = language === 'bn';
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans antialiased selection:bg-rose-500 selection:text-white">
      {/* Navigation Header */}
      <Header
        language={language}
        setLanguage={setLanguage}
        currency={currency}
        setCurrency={setCurrency}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={(cat) => {
          setSelectedCategory(cat);
          setSelectedFolderId(null);
          setSelectedTag('');
        }}
        cartCount={cartCount}
        openCart={() => setIsCartOpen(true)}
        openPromptModal={() => setIsPromptModalOpen(true)}
        openAdminModal={() => {
          setAdminInitialTab('content');
          setIsAdminModalOpen(true);
        }}
        categories={categories}
        siteContent={siteContent}
        unreadNotificationCount={unreadNotificationCount}
        openNotifications={() => setIsNotificationsOpen(true)}
        openWebsiteLinkModal={() => setIsWebsiteLinkModalOpen(true)}
        openOrderTracking={() => setIsOrderTrackingOpen(true)}
        openAdminOrders={handleOpenAdminOrders}
        pendingOrdersCount={orders.filter((o) => o.status === 'Pending').length}
        userProfile={userProfile}
        openUserProfile={navigateToProfile}
        isCustomerLoggedIn={isCustomerLoggedIn}
        openCustomerLogin={() => setIsCustomerAuthModalOpen(true)}
        onCustomerLogout={handleCustomerLogout}
      />

      {/* Main Body: Switch between Shop Home and User Profile Page */}
      {currentPage === 'profile' ? (
        <UserProfilePage
          userProfile={userProfile}
          onUpdateUserProfile={handleUpdateUserProfile}
          orders={orders}
          products={products}
          coupons={coupons}
          siteContent={siteContent}
          language={language}
          currency={currency}
          onBackToShop={navigateToHome}
          onTrackOrder={(orderId) => {
            setTrackingOrderId(orderId);
            setIsOrderTrackingOpen(true);
          }}
          onOpenAdminOrders={handleOpenAdminOrders}
          isCustomerLoggedIn={isCustomerLoggedIn}
          onOpenCustomerLogin={() => setIsCustomerAuthModalOpen(true)}
          onCustomerLogout={handleCustomerLogout}
        />
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto pb-12">
          {/* Hero Showcase with dynamic content and auto-rotating clothing */}
          <HeroBanner
            language={language}
            onExploreProducts={() => {
              const el = document.getElementById('folders-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            openPromptModal={() => setIsPromptModalOpen(true)}
            siteContent={siteContent}
            products={products}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              setIsDetailModalOpen(true);
            }}
          />

        {/* 1. Folders Section */}
        <section id="folders-section" className="mt-8 px-4">
          <FolderGrid
            folders={folders}
            products={products}
            selectedFolderId={selectedFolderId}
            onSelectFolder={(id) => {
              setSelectedFolderId(id);
              setSelectedTag('');
              const el = document.getElementById('products-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            language={language}
          />
        </section>

        {/* 2. Products Section */}
        <section id="products-section" className="mt-10 px-4">
          
          {/* Active Folder Indicator Banner */}
          {activeFolder ? (
            <div className="bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-amber-500/10 border border-rose-300 rounded-2xl p-4 mb-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="text-3xl p-2 bg-white rounded-2xl shadow-xs border border-rose-200">
                  {activeFolder.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] bg-rose-600 text-white font-bold px-2 py-0.5 rounded-full">
                      {isBn ? 'খোলা ফোল্ডার' : 'Active Folder'}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900">
                      {isBn ? activeFolder.nameBn : activeFolder.nameEn}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {activeFolder.descriptionBn} • {filteredProducts.length} {isBn ? 'টি পণ্য রয়েছে' : 'products found'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedFolderId(null)}
                className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 shadow-xs transition flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-rose-600" />
                <span>{isBn ? 'সব ফোল্ডার দেখুন' : 'Show All Folders'}</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    {isBn ? 'সমস্ত পোশাক ও কালেকশন' : 'All Products Collection'}
                  </h2>
                  <span className="text-xs bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-full">
                    {filteredProducts.length}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isBn ? 'যেকোনো পণ্যের ওপর ক্লিক করে বিস্তারিত বিবরণ দেখুন' : 'Click on any product to view full details'}
                </p>
              </div>

              {/* Filters & Sorting */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setShowOnlyFlashSale(!showOnlyFlashSale)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer ${
                    showOnlyFlashSale
                      ? 'bg-amber-500 text-slate-900 shadow-xs'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>{isBn ? 'হট ডিলস' : 'Flash Sale'}</span>
                </button>

                <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent text-slate-700 font-medium focus:outline-none cursor-pointer"
                  >
                    <option value="default">{isBn ? 'স্বাভাবিক সাজানো' : 'Default'}</option>
                    <option value="price-asc">{isBn ? 'দাম: কম থেকে বেশি' : 'Price: Low to High'}</option>
                    <option value="price-desc">{isBn ? 'দাম: বেশি থেকে কম' : 'Price: High to Low'}</option>
                    <option value="rating">{isBn ? 'সর্বোচ্চ রেটিং' : 'Top Rated'}</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center text-slate-400 space-y-2 bg-white rounded-2xl border border-slate-200">
              <FolderOpen className="w-12 h-12 mx-auto text-slate-300 stroke-1" />
              <p className="text-base font-bold text-slate-700">
                {isBn ? 'এই ফোল্ডারে বর্তমানে কোনো পণ্য খুঁজে পাওয়া যায়নি' : 'No products found in this folder'}
              </p>
              <p className="text-xs text-slate-400">
                {isBn ? 'অন্য কোনো ফোল্ডার নির্বাচন করুন অথবা ফিল্টার রিসেট করুন।' : 'Select another folder or reset filters.'}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedFolderId(null);
                  setSelectedCategory('All');
                  setSelectedTag('');
                  setShowOnlyFlashSale(false);
                }}
                className="mt-3 px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                {isBn ? 'সব ফোল্ডার দেখুন' : 'Reset to All Folders'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  language={language}
                  currency={currency}
                  onAddToCart={(p) => handleAddToCart(p, 1)}
                  onInstantBuy={(p) => handleInstantBuy(p, 1)}
                  onQuickView={(p) => {
                    setSelectedProduct(p);
                    setIsDetailModalOpen(true);
                  }}
                  isAddedToCart={addedItemIds[product.id]}
                />
              ))}
            </div>
          )}
        </section>
      </main>
      )}

      {/* Floating Quick Admin Trigger on Screen (Bottom-Left) */}
      <button
        onClick={() => setIsAdminModalOpen(true)}
        className="fixed bottom-5 left-5 z-40 flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-slate-950/95 hover:bg-slate-900 text-white border border-slate-700 shadow-2xl text-xs font-bold transition hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md group"
        title={isBn ? 'অ্যাডমিন পোর্টাল লগইন (জিমেইল: mdnahidislam1929@gmail.com | পাসওয়ার্ড: Nahid8431)' : 'Admin Portal Login (mdnahidislam1929@gmail.com)'}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <Lock className="w-3.5 h-3.5 text-rose-400" />
        <span>{isBn ? 'অ্যাডমিন পোর্টাল' : 'Admin Portal'}</span>
        <span className="text-[10px] bg-slate-800 text-amber-300 font-bold px-1.5 py-0.5 rounded font-mono group-hover:text-amber-200">
          নাহিদ
        </span>
      </button>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5">
        <button
          onClick={() => setIsPromptModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs shadow-xl shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 fill-white" />
          <span className="hidden sm:inline">{isBn ? 'AI প্রম্পট ফরম' : 'AI Prompt Tool'}</span>
        </button>

        {cartCount > 0 && (
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-rose-600 text-white font-bold text-xs shadow-xl shadow-rose-600/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{cartCount}</span>
          </button>
        )}
      </div>

      {/* Footer */}
      <Footer
        language={language}
        openPromptModal={() => setIsPromptModalOpen(true)}
        openAdminModal={() => {
          setAdminInitialTab('content');
          setIsAdminModalOpen(true);
        }}
        siteContent={siteContent}
        openWebsiteLinkModal={() => setIsWebsiteLinkModalOpen(true)}
        openOrderTracking={() => setIsOrderTrackingOpen(true)}
      />

      {/* Modals */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        language={language}
        currency={currency}
        onAddToCart={handleAddToCart}
        onInstantBuy={handleInstantBuy}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        language={language}
        currency={currency}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        appliedCoupon={appliedCoupon}
        language={language}
        currency={currency}
        onOrderSuccess={handleOrderSuccess}
        siteContent={siteContent}
        userProfile={userProfile}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => {
          setCartItems([]);
          setIsCheckoutOpen(false);
        }}
      />

      <OrderSuccessModal
        order={latestOrder}
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        language={language}
        currency={currency}
        onTrackOrder={(id) => {
          setTrackingOrderId(id);
          setIsOrderTrackingOpen(true);
        }}
        onViewProfile={navigateToProfile}
      />

      <PromptBuilderModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
        language={language}
      />

      <CustomerAuthModal
        isOpen={isCustomerAuthModalOpen}
        onClose={() => setIsCustomerAuthModalOpen(false)}
        onLoginSuccess={handleCustomerLoginSuccess}
        currentProfile={userProfile}
        isLoggedIn={isCustomerLoggedIn}
        language={language}
      />

      <AdminPanelModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onDeleteOrder={handleDeleteOrder}
        initialTab={adminInitialTab}
        products={products}
        onAddProduct={handleAddNewProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        folders={folders}
        onUpdateFolder={handleUpdateFolder}
        onAddFolder={handleAddFolder}
        onDeleteFolder={handleDeleteFolder}
        coupons={coupons}
        onAddCoupon={handleAddCoupon}
        onDeleteCoupon={handleDeleteCoupon}
        siteContent={siteContent}
        onUpdateSiteContent={handleUpdateSiteContent}
        onResetAllData={handleResetAllData}
        adminPin={adminPin}
        onUpdateAdminPin={handleUpdateAdminPin}
        adminEmail={adminEmail}
        onUpdateAdminEmail={setAdminEmail}
        adminPassword={adminPassword}
        onUpdateAdminPassword={setAdminPassword}
        language={language}
        currency={currency}
      />

      {/* Real-time Order Notification Center Drawer */}
      <NotificationCenter
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        unreadCount={unreadNotificationCount}
        onMarkAllAsRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        }}
        onClearNotifications={() => {
          setNotifications([]);
        }}
        onViewOrder={() => {
          setIsNotificationsOpen(false);
          handleOpenAdminOrders();
        }}
        onSendTestNotification={handleSendTestNotification}
        language={language}
      />

      {/* smartshopbd Website Link, App & Google SEO Modal */}
      <WebsiteLinkModal
        isOpen={isWebsiteLinkModalOpen}
        onClose={() => setIsWebsiteLinkModalOpen(false)}
        siteContent={siteContent}
        language={language}
      />

      {/* Customer Order Status Tracking Modal */}
      <OrderTrackingModal
        isOpen={isOrderTrackingOpen}
        onClose={() => {
          setIsOrderTrackingOpen(false);
          setTrackingOrderId(undefined);
        }}
        orders={orders}
        language={language}
        currency={currency}
        initialOrderId={trackingOrderId}
        onOpenAdmin={handleOpenAdminOrders}
      />

      {/* Floating Live Order Alert Toast (Top-Right) */}
      {toastNotification && (
        <div className="fixed top-20 right-4 z-50 max-w-sm w-full bg-slate-950 text-white rounded-2xl p-4 shadow-2xl border border-blue-500/40 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="relative p-2 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xs">
                <Bell className="w-5 h-5 text-amber-300 animate-bounce" />
              </div>
              <div>
                <span className="text-[10px] bg-rose-600 text-white font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {isBn ? '🎉 নতুন অর্ডার এসেছে!' : '🎉 New Order Placed!'}
                </span>
                <h4 className="font-extrabold text-sm text-white mt-1">
                  {toastNotification.customerName}
                </h4>
              </div>
            </div>
            <button
              onClick={() => setToastNotification(null)}
              className="text-slate-400 hover:text-white p-1 text-sm cursor-pointer"
            >
              ✕
            </button>
          </div>
          <div className="mt-2 text-xs text-slate-300 flex items-center justify-between border-t border-slate-800 pt-2 font-mono">
            <span>#{toastNotification.orderId}</span>
            <span className="font-bold text-emerald-400 text-sm">৳{toastNotification.total.toLocaleString()}</span>
          </div>
          <div className="mt-2.5 flex items-center gap-2">
            <button
              onClick={() => {
                setToastNotification(null);
                setIsNotificationsOpen(true);
              }}
              className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition text-center cursor-pointer shadow-md shadow-blue-600/30"
            >
              {isBn ? 'নোটিফিকেশন দেখুন' : 'View Alert'}
            </button>
            <button
              onClick={() => {
                setToastNotification(null);
                setIsAdminModalOpen(true);
              }}
              className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition cursor-pointer"
            >
              {isBn ? 'অ্যাডমিন' : 'Admin'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
