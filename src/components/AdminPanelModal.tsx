import React, { useState, useEffect, useRef } from 'react';
import { Order, Product, ProductFolder, Coupon, SiteContent } from '../types';
import { 
  X, 
  Lock, 
  Unlock, 
  KeyRound, 
  Edit3, 
  Trash2, 
  Plus, 
  Save, 
  RotateCcw, 
  Check, 
  Package, 
  ShoppingBag, 
  Sliders, 
  Folder, 
  Tag, 
  Phone, 
  MapPin, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Clock, 
  CreditCard, 
  Sparkles, 
  Globe,
  Image as ImageIcon,
  Copy,
  Smartphone,
  Upload,
  Percent,
  Palette,
  Layers,
  Camera,
  CheckCircle2,
  CheckSquare,
  Truck,
  XCircle,
  Banknote,
  CheckCheck,
  Mail,
  ShieldCheck,
  Database,
  Server,
  RefreshCw,
  Crown,
  UserCheck,
  Users,
  LogOut,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Key,
  Shield
} from 'lucide-react';
import { 
  testSupabaseConnection, 
  seedProductsToSupabase, 
  SUPABASE_SQL_SCHEMA,
  verifyAdminLogin,
  fetchAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser
} from '../services/supabaseService';
import { SUPABASE_URL } from '../lib/supabase';
import { AdminRole, AdminUser } from '../types';
import { compressImageFile } from '../utils/storage';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onDeleteOrder?: (orderId: string) => void;
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  folders: ProductFolder[];
  onUpdateFolder: (folder: ProductFolder) => void;
  onAddFolder?: (folder: ProductFolder) => void;
  onDeleteFolder?: (folderId: string) => void;
  coupons: Coupon[];
  onAddCoupon: (coupon: Coupon) => void;
  onDeleteCoupon: (code: string) => void;
  siteContent: SiteContent;
  onUpdateSiteContent: (content: SiteContent) => void;
  onResetAllData: () => void;
  adminPin: string;
  onUpdateAdminPin: (newPin: string) => void;
  adminEmail?: string;
  onUpdateAdminEmail?: (newEmail: string) => void;
  adminPassword?: string;
  onUpdateAdminPassword?: (newPassword: string) => void;
  language: 'bn' | 'en';
  currency: 'BDT' | 'USD';
  initialTab?: 'content' | 'products' | 'orders' | 'folders' | 'coupons' | 'settings';
}

const PRESET_SIZE_GROUPS = [
  {
    title: 'পোশাকের সাইজ (Clothing Sizes)',
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL', 'Free Size']
  },
  {
    title: 'জুতার সাইজ (Shoe Sizes)',
    sizes: ['39', '40', '41', '42', '43', '44']
  },
  {
    title: 'প্যান্ট / কোমর সাইজ (Waist Sizes)',
    sizes: ['28', '30', '32', '34', '36', '38', '40']
  }
];

const PRESET_COLORS = [
  { name: 'জেট ব্ল্যাক (Jet Black)', hex: '#0a0a0a', border: false },
  { name: 'সাদা (White)', hex: '#ffffff', border: true },
  { name: 'বাদামী (Brown)', hex: '#92400e', border: false },
  { name: 'মেরুন (Maroon)', hex: '#881337', border: false },
  { name: 'অলিভ গ্রিন (Olive)', hex: '#65a30d', border: false },
  { name: 'কালো (Black)', hex: '#0f172a', border: false },
  { name: 'রয়্যাল ব্লু (Royal Blue)', hex: '#2563eb', border: false },
  { name: 'নেভি ব্লু (Navy Blue)', hex: '#1e293b', border: false },
  { name: 'লাল (Red)', hex: '#dc2626', border: false },
  { name: 'সবুজ (Green)', hex: '#16a34a', border: false },
  { name: 'হলুদ (Mustard Yellow)', hex: '#eab308', border: false },
  { name: 'গোলাপি (Pink)', hex: '#ec4899', border: false },
  { name: 'ছাই / গ্রে (Grey)', hex: '#64748b', border: false },
  { name: 'আকাশি (Sky Blue)', hex: '#0ea5e9', border: false },
  { name: 'বেগুনি (Purple)', hex: '#9333ea', border: false },
  { name: 'কমলা (Orange)', hex: '#f97316', border: false }
];

const QUICK_DISCOUNTS = [0, 10, 15, 20, 25, 30, 40, 50, 60];

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  orders,
  onUpdateOrderStatus,
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  folders,
  onUpdateFolder,
  onAddFolder,
  onDeleteFolder,
  coupons,
  onAddCoupon,
  onDeleteCoupon,
  siteContent,
  onUpdateSiteContent,
  onResetAllData,
  adminPin,
  onUpdateAdminPin,
  adminEmail = 'mdnahidislam1929@gmail.com',
  onUpdateAdminEmail,
  adminPassword = 'Nahid8431',
  onUpdateAdminPassword,
  language,
  currency,
  initialTab,
  onDeleteOrder
}) => {
  if (!isOpen) return null;

  const isBn = language === 'bn';

  // Role-Based Admin Auth State
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(() => {
    try {
      const saved = sessionStorage.getItem('smartshop_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const isAuthenticated = Boolean(currentAdmin);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [adminTeam, setAdminTeam] = useState<AdminUser[]>([]);
  const [isLoadingTeam, setIsLoadingTeam] = useState(false);

  // New Admin User Form State (Super Admin tab)
  const [newTeamEmail, setNewTeamEmail] = useState('');
  const [newTeamPassword, setNewTeamPassword] = useState('');
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamRole, setNewTeamRole] = useState<AdminRole>('admin');
  const [teamActionMsg, setTeamActionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'content' | 'products' | 'orders' | 'folders' | 'coupons' | 'settings'>(initialTab || 'content');
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'bkash' | 'approved' | 'shipped' | 'delivered' | 'cancelled'>('all');
  const [orderCopiedText, setOrderCopiedText] = useState<string | null>(null);
  const [statusToast, setStatusToast] = useState<string | null>(null);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  // Site Content form state
  const [editableContent, setEditableContent] = useState<SiteContent>({ ...siteContent });
  const [contentSavedMsg, setContentSavedMsg] = useState(false);

  // Product Edit / Add State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNewProduct, setIsAddingNewProduct] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [selectedFolderFilter, setSelectedFolderFilter] = useState('All');
  const [customSizeInput, setCustomSizeInput] = useState('');
  const [customColorInput, setCustomColorInput] = useState('');
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // In-App Deletion Confirmations (Bypasses browser window.confirm blocking in iframe)
  const [productToast, setProductToast] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [folderToDelete, setFolderToDelete] = useState<ProductFolder | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [adminUserToDelete, setAdminUserToDelete] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Folder Add / Edit / Image State
  const [editingFolder, setEditingFolder] = useState<ProductFolder | null>(null);
  const [isAddingNewFolder, setIsAddingNewFolder] = useState(false);
  const [folderImageMode, setFolderImageMode] = useState<'upload' | 'url'>('upload');
  const folderFileInputRef = useRef<HTMLInputElement>(null);
  const [folderFormData, setFolderFormData] = useState<Partial<ProductFolder>>({
    nameBn: '',
    nameEn: '',
    icon: '📁',
    coverImage: '',
    descriptionBn: '',
    tag: ''
  });
  const [folderToast, setFolderToast] = useState<string | null>(null);

  // New Coupon State
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [newCouponMinSpend, setNewCouponMinSpend] = useState('');
  const [newCouponDesc, setNewCouponDesc] = useState('');

  // Change Admin Credentials State (Settings)
  const [newAdminEmail, setNewAdminEmail] = useState(adminEmail || 'mdnahidislam1929@gmail.com');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [credentialsChangeSuccess, setCredentialsChangeSuccess] = useState(false);

  // Supabase Status & Action States
  const [supabaseStatus, setSupabaseStatus] = useState<{ testing: boolean; connected?: boolean; message?: string }>({ testing: false });
  const [supabaseSeedStatus, setSupabaseSeedStatus] = useState<{ seeding: boolean; success?: boolean; message?: string }>({ seeding: false });
  const [copiedSqlSchema, setCopiedSqlSchema] = useState(false);
  const [domainCopied, setDomainCopied] = useState(false);
  const [showColorUrlInput, setShowColorUrlInput] = useState<{ [color: string]: boolean }>({});
  const [colorUrlValue, setColorUrlValue] = useState<{ [color: string]: string }>({});

  const handleCheckSupabase = async () => {
    setSupabaseStatus({ testing: true });
    try {
      const res = await testSupabaseConnection();
      setSupabaseStatus({ testing: false, connected: res.connected, message: res.message });
    } catch (e: any) {
      setSupabaseStatus({ testing: false, connected: false, message: e?.message || 'Connection check failed' });
    }
  };

  const handleSeedSupabase = async () => {
    setSupabaseSeedStatus({ seeding: true });
    try {
      const res = await seedProductsToSupabase(products);
      if (res.error) {
        setSupabaseSeedStatus({ seeding: false, success: false, message: res.error });
      } else {
        setSupabaseSeedStatus({ seeding: false, success: true, message: `${res.count} টি পণ্য সফলভাবে Supabase-এ সিঙ্ক হয়েছে!` });
      }
    } catch (e: any) {
      setSupabaseSeedStatus({ seeding: false, success: false, message: e?.message || 'Error pushing products' });
    }
  };

  const handleCopySqlSchema = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSqlSchema(true);
    setTimeout(() => setCopiedSqlSchema(false), 2500);
  };

  // Sync content when prop changes
  useEffect(() => {
    setEditableContent({ ...siteContent });
  }, [siteContent]);

  // Auth Handler: Role-Based Verification via Supabase (Zero Hardcoded Passwords)
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsLoggingIn(true);

    try {
      const res = await verifyAdminLogin(emailInput, passwordInput);
      setIsLoggingIn(false);

      if (res.success && res.admin) {
        setCurrentAdmin(res.admin);
        sessionStorage.setItem('smartshop_admin_user', JSON.stringify(res.admin));
        setPasswordInput('');
        setAuthError('');
        if (res.admin.role === 'manager') {
          setActiveTab('orders');
        }
      } else {
        setAuthError(res.message || (isBn ? 'লগইন ব্যর্থ হয়েছে! ইমেইল ও পাসওয়ার্ড যাচাই করুন।' : 'Login failed. Please verify credentials.'));
      }
    } catch (err: any) {
      setIsLoggingIn(false);
      setAuthError(err?.message || (isBn ? 'লগইন করার সময় সমস্যা হয়েছে।' : 'Login error occurred.'));
    }
  };

  const handleAdminLogout = () => {
    setCurrentAdmin(null);
    sessionStorage.removeItem('smartshop_admin_user');
    setPasswordInput('');
    setAuthError('');
  };

  // Load team members when Super Admin opens Settings tab
  const handleLoadTeam = async () => {
    setIsLoadingTeam(true);
    try {
      const team = await fetchAdminUsers();
      setAdminTeam(team);
    } catch {
      // ignore
    } finally {
      setIsLoadingTeam(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'settings' && currentAdmin?.role === 'super_admin') {
      handleLoadTeam();
    }
  }, [activeTab, currentAdmin]);

  const handleCreateTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamEmail.trim() || !newTeamPassword.trim() || !newTeamName.trim()) {
      setTeamActionMsg({ type: 'error', text: isBn ? 'সকল ঘর পূরণ করুন' : 'Fill all fields' });
      return;
    }
    const res = await createAdminUser({
      email: newTeamEmail.trim(),
      password: newTeamPassword.trim(),
      fullName: newTeamName.trim(),
      role: newTeamRole
    });
    if (res.success) {
      setTeamActionMsg({ type: 'success', text: isBn ? 'নতুন অ্যাডমিন সফলভাবে যুক্ত হয়েছে!' : 'Admin user created successfully!' });
      setNewTeamEmail('');
      setNewTeamPassword('');
      setNewTeamName('');
      handleLoadTeam();
    } else {
      setTeamActionMsg({ type: 'error', text: res.message || 'Error creating user' });
    }
    setTimeout(() => setTeamActionMsg(null), 3500);
  };

  const handleToggleAdminStatus = async (user: AdminUser) => {
    const updated = await updateAdminUser(user.id, { isActive: !user.isActive });
    if (updated) {
      handleLoadTeam();
    }
  };

  const handleDeleteAdmin = (userId: string) => {
    setAdminUserToDelete(userId);
  };

  const handleConfirmDeleteAdmin = async () => {
    if (!adminUserToDelete) return;
    const deleted = await deleteAdminUser(adminUserToDelete);
    if (deleted) {
      handleLoadTeam();
    }
    setAdminUserToDelete(null);
  };

  const handleSaveSiteContent = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSiteContent(editableContent);
    setContentSavedMsg(true);
    setTimeout(() => setContentSavedMsg(false), 2000);
  };

  const handleSaveProductEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    onUpdateProduct(editingProduct);
    setEditingProduct(null);
  };

  const handleAddNewProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.nameBn || !editingProduct.price) return;
    onAddProduct(editingProduct);
    setEditingProduct(null);
    setIsAddingNewProduct(false);
  };

  // Photo Upload Handler (Gallery / Camera / Files)
  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressedData = await compressImageFile(file, 900, 900, 0.78);
      if (editingProduct) {
        setEditingProduct({
          ...editingProduct,
          image: compressedData
        });
      }
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string' && editingProduct) {
          setEditingProduct({
            ...editingProduct,
            image: reader.result
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Pricing & Percentage Discount Handlers
  const handleOriginalPriceChange = (orig: number) => {
    if (!editingProduct) return;
    const p = editingProduct.discountPercent || 0;
    const calculatedSelling = p > 0 ? Math.round(orig * (1 - p / 100)) : orig;
    setEditingProduct({
      ...editingProduct,
      originalPrice: orig,
      price: calculatedSelling
    });
  };

  const handleDiscountPercentChange = (percent: number) => {
    if (!editingProduct) return;
    const clamped = Math.max(0, Math.min(99, Math.round(percent)));
    const orig = editingProduct.originalPrice || editingProduct.price || 0;
    const calculatedSelling = clamped > 0 ? Math.round(orig * (1 - clamped / 100)) : orig;
    setEditingProduct({
      ...editingProduct,
      discountPercent: clamped,
      originalPrice: orig > 0 ? orig : calculatedSelling,
      price: calculatedSelling
    });
  };

  const handleSellingPriceChange = (selling: number) => {
    if (!editingProduct) return;
    const orig = editingProduct.originalPrice || selling;
    const calculatedDiscount = orig > selling ? Math.round(((orig - selling) / orig) * 100) : 0;
    setEditingProduct({
      ...editingProduct,
      price: selling,
      discountPercent: calculatedDiscount
    });
  };

  // Size Selection Handlers
  const handleToggleSize = (size: string) => {
    if (!editingProduct) return;
    const current = editingProduct.sizes || [];
    const exists = current.includes(size);
    const updated = exists ? current.filter((s) => s !== size) : [...current, size];
    setEditingProduct({ ...editingProduct, sizes: updated });
  };

  const handleSelectGroupSizes = (sizesToSelect: string[]) => {
    if (!editingProduct) return;
    const current = editingProduct.sizes || [];
    const merged = Array.from(new Set([...current, ...sizesToSelect]));
    setEditingProduct({ ...editingProduct, sizes: merged });
  };

  const handleClearSizes = () => {
    if (!editingProduct) return;
    setEditingProduct({ ...editingProduct, sizes: [] });
  };

  const handleAddCustomSize = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingProduct || !customSizeInput.trim()) return;
    const trimmed = customSizeInput.trim();
    const current = editingProduct.sizes || [];
    if (!current.includes(trimmed)) {
      setEditingProduct({ ...editingProduct, sizes: [...current, trimmed] });
    }
    setCustomSizeInput('');
  };

  // Color Selection Handlers
  const handleToggleColor = (colorName: string) => {
    if (!editingProduct) return;
    const current = editingProduct.colors || [];
    const exists = current.includes(colorName);
    const updated = exists ? current.filter((c) => c !== colorName) : [...current, colorName];
    
    // Clean up color image if color is removed
    const updatedImages = { ...(editingProduct.colorImages || {}) };
    if (exists && updatedImages[colorName]) {
      delete updatedImages[colorName];
    }

    setEditingProduct({ 
      ...editingProduct, 
      colors: updated,
      colorImages: updatedImages
    });
  };

  const handleSelectPopularColors = () => {
    if (!editingProduct) return;
    const popular = ['জেট ব্ল্যাক (Jet Black)', 'সাদা (White)', 'বাদামী (Brown)', 'মেরুন (Maroon)', 'অলিভ গ্রিন (Olive)'];
    const current = editingProduct.colors || [];
    const merged = Array.from(new Set([...current, ...popular]));
    setEditingProduct({ ...editingProduct, colors: merged });
  };

  const handleClearColors = () => {
    if (!editingProduct) return;
    setEditingProduct({ ...editingProduct, colors: [], colorImages: {} });
  };

  const handleSetColorImage = (colorName: string, imageUrl: string) => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      colorImages: {
        ...(editingProduct.colorImages || {}),
        [colorName]: imageUrl
      }
    });
  };

  const handleUploadColorImage = async (colorName: string, file: File) => {
    if (!editingProduct) return;
    try {
      const compressedDataUrl = await compressImageFile(file, 800, 800, 0.75);
      handleSetColorImage(colorName, compressedDataUrl);
    } catch (err) {
      console.warn('Failed to compress color image', err);
    }
  };

  const handleRemoveColorImage = (colorName: string) => {
    if (!editingProduct || !editingProduct.colorImages) return;
    const updatedImages = { ...editingProduct.colorImages };
    delete updatedImages[colorName];
    setEditingProduct({
      ...editingProduct,
      colorImages: updatedImages
    });
  };

  const handleAutoMapSampleColorImages = () => {
    if (!editingProduct) return;
    const currentColors = editingProduct.colors || [];
    const sampleMap: { [key: string]: string } = {
      'সাদা (White)': 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80',
      'বাদামী (Brown)': 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80',
      'মেরুন (Maroon)': 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=800&q=80',
      'জেট ব্ল্যাক (Jet Black)': 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
      'অলিভ গ্রিন (Olive)': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'
    };

    const newColorImages = { ...(editingProduct.colorImages || {}) };
    for (const c of currentColors) {
      if (!newColorImages[c]) {
        for (const [sampleColor, imgUrl] of Object.entries(sampleMap)) {
          const samplePrefix = sampleColor.split(' ')[0].toLowerCase();
          if (c.toLowerCase().includes(samplePrefix)) {
            newColorImages[c] = imgUrl;
            break;
          }
        }
      }
    }

    setEditingProduct({
      ...editingProduct,
      colorImages: newColorImages
    });
  };

  const handleAddCustomColor = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingProduct || !customColorInput.trim()) return;
    const trimmed = customColorInput.trim();
    const current = editingProduct.colors || [];
    if (!current.includes(trimmed)) {
      setEditingProduct({ ...editingProduct, colors: [...current, trimmed] });
    }
    setCustomColorInput('');
  };

  // Folder Category Sync Handler
  const handleFolderChange = (folderId: string) => {
    if (!editingProduct) return;
    const targetFolder = folders.find((f) => f.id === folderId);
    setEditingProduct({
      ...editingProduct,
      folderId,
      category: targetFolder?.nameEn || editingProduct.category,
      categoryBn: targetFolder?.nameBn || editingProduct.categoryBn
    });
  };

  // Description Template Quick Appender
  const handleAppendDescTemplate = (text: string) => {
    if (!editingProduct) return;
    const current = editingProduct.descriptionBn 
      ? `${editingProduct.descriptionBn.trim()}\n• ${text}` 
      : `• ${text}`;
    setEditingProduct({ ...editingProduct, descriptionBn: current });
  };

  const handleAddNewCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode || !newCouponDiscount) return;
    const coupon: Coupon = {
      code: newCouponCode.trim().toUpperCase(),
      discountType: newCouponType,
      discountValue: Number(newCouponDiscount),
      minSpend: Number(newCouponMinSpend || 0),
      description: newCouponDesc.trim() || `${newCouponDiscount}${newCouponType === 'percentage' ? '%' : '৳'} মূল্যছাড়`
    };
    onAddCoupon(coupon);
    setNewCouponCode('');
    setNewCouponDiscount('');
    setNewCouponMinSpend('');
    setNewCouponDesc('');
  };

  // Folder Management Handlers (Add, Delete, Edit, Change Image)
  const handleFolderImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedData = await compressImageFile(file, 800, 800, 0.78);
        setFolderFormData((prev) => ({ ...prev, coverImage: compressedData }));
      } catch {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFolderFormData((prev) => ({ ...prev, coverImage: reader.result as string }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleOpenAddFolder = () => {
    setEditingFolder(null);
    setFolderFormData({
      nameBn: '',
      nameEn: '',
      icon: '📁',
      coverImage: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
      descriptionBn: '',
      tag: ''
    });
    setFolderImageMode('upload');
    setIsAddingNewFolder(true);
  };

  const handleOpenEditFolder = (folder: ProductFolder) => {
    setEditingFolder(folder);
    setFolderFormData({ ...folder });
    setFolderImageMode(folder.coverImage?.startsWith('data:') ? 'upload' : 'url');
    setIsAddingNewFolder(true);
  };

  const handleCloseFolderForm = () => {
    setIsAddingNewFolder(false);
    setEditingFolder(null);
  };

  const handleSaveFolderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderFormData.nameBn?.trim()) {
      setFolderToast(isBn ? 'অনুগ্রহ করে ফোল্ডারের বাংলা নাম লিখুন।' : 'Please enter folder name in Bangla.');
      return;
    }
    const finalImage = folderFormData.coverImage?.trim() || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80';
    const folderObj: ProductFolder = {
      id: editingFolder ? editingFolder.id : `folder-${Date.now().toString().slice(-6)}`,
      nameBn: folderFormData.nameBn.trim(),
      nameEn: folderFormData.nameEn?.trim() || folderFormData.nameBn.trim(),
      icon: folderFormData.icon?.trim() || '📁',
      coverImage: finalImage,
      descriptionBn: folderFormData.descriptionBn?.trim() || `${folderFormData.nameBn.trim()} এর এক্সক্লুসিভ কালেকশন`,
      tag: folderFormData.tag?.trim() || folderFormData.nameBn.trim()
    };

    if (editingFolder) {
      onUpdateFolder(folderObj);
      setFolderToast(isBn ? `"${folderObj.nameBn}" ফোল্ডার আপডেট হয়েছে!` : 'Folder updated successfully!');
    } else {
      if (onAddFolder) {
        onAddFolder(folderObj);
      }
      setFolderToast(isBn ? `নতুন ফোল্ডার "${folderObj.nameBn}" যোগ হয়েছে!` : 'New folder added successfully!');
    }

    setTimeout(() => setFolderToast(null), 3000);
    handleCloseFolderForm();
  };

  const handleDeleteFolderClick = (folder: ProductFolder) => {
    setFolderToDelete(folder);
  };

  const handleUpdateCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAdminEmail.trim() && onUpdateAdminEmail) {
      onUpdateAdminEmail(newAdminEmail.trim());
    }
    if (newAdminPassword.trim().length >= 4) {
      if (onUpdateAdminPassword) onUpdateAdminPassword(newAdminPassword.trim());
      onUpdateAdminPin(newAdminPassword.trim());
    }
    setCredentialsChangeSuccess(true);
    setNewAdminPassword('');
    setTimeout(() => setCredentialsChangeSuccess(false), 2500);
  };

  const formatPrice = (bdtPrice: number) => {
    if (currency === 'USD') {
      return `$${(bdtPrice / 120).toFixed(2)}`;
    }
    return `৳${bdtPrice.toLocaleString('bn-BD')}`;
  };

  // If NOT authenticated, show the Role-Based Verification Screen
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
        <div 
          className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 text-center space-y-4 my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-50 to-amber-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck className="w-8 h-8 text-rose-600" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-800 font-extrabold text-[11px] uppercase tracking-wider">
              <Key className="w-3.5 h-3.5 text-rose-600" />
              <span>{isBn ? 'রোল-বেসড ক্লাউড অ্যাডমিন' : 'Role-Based Cloud Admin'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
              {isBn ? 'অ্যাডমিন প্যানেল লগইন' : 'Admin Portal Login'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {isBn 
                ? 'সরাসরি Supabase ক্লাউড ব্যাকএন্ড থেকে সুরক্ষিতভাবে যাচাই করে লগইন করুন।' 
                : 'Secure cloud authentication verified against your Supabase admin roles.'}
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-3.5 text-left pt-1">
            {/* Admin Email Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isBn ? 'অনুমোদিত অ্যাডমিন ইমেইল:' : 'Admin Email:'}
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    if (authError) setAuthError('');
                  }}
                  placeholder="admin@yourdomain.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Admin Password Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isBn ? 'অ্যাডমিন পাসওয়ার্ড:' : 'Admin Password:'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (authError) setAuthError('');
                  }}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition tracking-wider"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  title={showPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <p className="text-xs text-rose-600 font-bold flex items-center gap-1.5 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{authError}</span>
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-70 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer mt-1"
            >
              {isLoggingIn ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{isBn ? 'ক্লাউডে যাচাই করা হচ্ছে...' : 'Verifying with Supabase...'}</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4 text-amber-400" />
                  <span>{isBn ? 'সুরক্ষিত লগইন করুন' : 'Secure Login'}</span>
                </>
              )}
            </button>
          </form>

          {/* Setup Guide Accordion for Owner */}
          <div className="pt-2 border-t border-slate-200 text-left">
            <button
              type="button"
              onClick={() => setShowSetupGuide(!showSetupGuide)}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-rose-600 p-2 rounded-lg bg-slate-50 border border-slate-200 transition cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-rose-600" />
                <span>{isBn ? '📖 Supabase অ্যাডমিন সেটআপ গাইড' : '📖 Supabase Admin Setup Guide'}</span>
              </span>
              {showSetupGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showSetupGuide && (
              <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 space-y-2 animate-in fade-in duration-200">
                <p className="font-semibold text-slate-800">
                  {isBn 
                    ? 'কেউ সোর্স কোড দেখে লগইন করতে পারবে না। আপনার Supabase ড্যাশবোর্ডে গিয়ে SQL Editor-এ নিচের কোডটি রান করে আপনার পছন্দমতো পাসওয়ার্ড ও রোল সেট করুন:' 
                    : 'Credentials are never exposed in source code. Run this in your Supabase SQL Editor to configure your admin:'}
                </p>
                <div className="relative bg-slate-900 text-emerald-300 p-2.5 rounded-lg font-mono text-[10px] overflow-x-auto">
                  <pre className="whitespace-pre-wrap leading-relaxed">{`-- Supabase SQL Editor এ পেস্ট করে Run দিন:
INSERT INTO public.admin_users (email, password_hash, role, full_name, is_active)
VALUES (
  'mdnahidislam843150@gmail.com',
  'আপনার_গোপন_পাসওয়ার্ড',
  'super_admin',
  'Md Nahid Islam',
  true
)
ON CONFLICT (email) DO UPDATE 
SET password_hash = EXCLUDED.password_hash,
    role = EXCLUDED.role;`}</pre>
                  <button
                    type="button"
                    onClick={handleCopySqlSchema}
                    className="mt-2 w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded flex items-center justify-center gap-1 text-[10px] transition cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedSqlSchema ? 'SQL কপি হয়েছে!' : 'সম্পূর্ণ SQL স্কিমা কপি করুন'}</span>
                  </button>
                </div>
                <div className="flex items-center gap-1 text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>সাপোর্টেড রোলস: <strong>super_admin</strong> (সম্পূর্ণ অ্যাক্সেস), <strong>admin</strong>, <strong>manager</strong></span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Filtered Products for Admin
  const adminFilteredProducts = products.filter((p) => {
    const matchesSearch =
      productSearch === '' ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.nameBn.toLowerCase().includes(productSearch.toLowerCase());
    const matchesFolder = selectedFolderFilter === 'All' || p.folderId === selectedFolderFilter;
    return matchesSearch && matchesFolder;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative bg-white w-full max-w-5xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-rose-700 flex items-center justify-center text-white shadow-md shrink-0">
              {currentAdmin?.role === 'super_admin' ? (
                <Crown className="w-5 h-5 text-amber-300" />
              ) : currentAdmin?.role === 'manager' ? (
                <Package className="w-5 h-5 text-emerald-300" />
              ) : (
                <Sliders className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black tracking-tight">
                  {isBn ? 'স্মার্টশপ কন্ট্রোল প্যানেল' : 'SmartShop Control Panel'}
                </h2>
                {currentAdmin?.role === 'super_admin' && (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-gradient-to-r from-amber-500/30 to-amber-600/30 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider">
                    <Crown className="w-3 h-3 text-amber-300" />
                    <span>{isBn ? 'সুপার অ্যাডমিন' : 'Super Admin'}</span>
                  </span>
                )}
                {currentAdmin?.role === 'admin' && (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-blue-500/20 text-blue-300 border border-blue-400/40 px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider">
                    <ShieldCheck className="w-3 h-3 text-blue-300" />
                    <span>{isBn ? 'অ্যাডমিন' : 'Admin'}</span>
                  </span>
                )}
                {currentAdmin?.role === 'manager' && (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider">
                    <Package className="w-3 h-3 text-emerald-300" />
                    <span>{isBn ? 'ম্যানেজার' : 'Manager'}</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                <span className="font-semibold text-slate-200">{currentAdmin?.fullName || 'Admin User'}</span>
                <span>•</span>
                <span className="font-mono text-slate-400 text-[11px] truncate max-w-xs">{currentAdmin?.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAdminLogout}
              className="px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-600 text-rose-200 hover:text-white border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              title="লগআউট"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isBn ? 'লগআউট' : 'Logout'}</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Filtered by Role) */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 sm:px-6 pt-2 gap-2 text-xs sm:text-sm font-bold overflow-x-auto scrollbar-none">
          {/* Site Content Tab: Hidden for manager */}
          {currentAdmin?.role !== 'manager' && (
            <button
              onClick={() => { setActiveTab('content'); setEditingProduct(null); }}
              className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
                activeTab === 'content'
                  ? 'border-rose-600 text-rose-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>{isBn ? 'সাইট কনটেন্ট ও ব্যানার' : 'Site Content & Banners'}</span>
            </button>
          )}

          {/* Products Tab: Available to all roles */}
          <button
            onClick={() => { setActiveTab('products'); setEditingProduct(null); }}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'products'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{isBn ? `পণ্য ও স্টক (${products.length})` : `Products (${products.length})`}</span>
          </button>

          {/* Orders Tab: Available to all roles */}
          <button
            onClick={() => { setActiveTab('orders'); setEditingProduct(null); }}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'orders'
                ? 'border-rose-600 text-rose-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>{isBn ? `গ্রাহকদের অর্ডার (${orders.length})` : `Orders (${orders.length})`}</span>
            {orders.filter(o => o.status === 'Pending').length > 0 && (
              <span className="bg-amber-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full animate-pulse shadow-2xs">
                {orders.filter(o => o.status === 'Pending').length} পেন্ডিং
              </span>
            )}
          </button>

          {/* Folders Tab: Hidden for manager */}
          {currentAdmin?.role !== 'manager' && (
            <button
              onClick={() => { setActiveTab('folders'); setEditingProduct(null); }}
              className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
                activeTab === 'folders'
                  ? 'border-rose-600 text-rose-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Folder className="w-4 h-4" />
              <span>{isBn ? `ফোল্ডারসমূহ (${folders.length})` : `Folders (${folders.length})`}</span>
            </button>
          )}

          {/* Coupons Tab: Hidden for manager */}
          {currentAdmin?.role !== 'manager' && (
            <button
              onClick={() => { setActiveTab('coupons'); setEditingProduct(null); }}
              className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
                activeTab === 'coupons'
                  ? 'border-rose-600 text-rose-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>{isBn ? `কুপন ও ছাড় (${coupons.length})` : `Coupons (${coupons.length})`}</span>
            </button>
          )}

          {/* Settings Tab: Only for super_admin & admin */}
          {currentAdmin?.role !== 'manager' && (
            <button
              onClick={() => { setActiveTab('settings'); setEditingProduct(null); }}
              className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
                activeTab === 'settings'
                  ? 'border-rose-600 text-rose-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{isBn ? 'টিম রোলস ও সিকিউরিটি' : 'Team Roles & Security'}</span>
            </button>
          )}
        </div>

        {/* Tab 1: Site Content & Banners */}
        {activeTab === 'content' && (
          <form onSubmit={handleSaveSiteContent} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs sm:text-sm">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  {isBn ? 'ওয়েবসাইটের মূল কনটেন্ট ও ব্যানার পরিবর্তন' : 'Store Branding & Content Customization'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isBn 
                    ? 'এখানে যেকোনো তথ্য পরিবর্তন করে "সেভ করুন" চাপলে সরাসরি ওয়েবসাইটে আপডেট হয়ে যাবে।' 
                    : 'Modify branding, headline, announcements, or contact numbers instantly.'}
                </p>
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                {contentSavedMsg ? <Check className="w-4 h-4 text-emerald-200" /> : <Save className="w-4 h-4" />}
                <span>{contentSavedMsg ? (isBn ? 'সংরক্ষিত হয়েছে!' : 'Saved!') : (isBn ? 'কনটেন্ট সেভ করুন' : 'Save Changes')}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Store Name Bn */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isBn ? 'দোকানের নাম (বাংলায়):' : 'Store Name (Bangla):'}
                </label>
                <input
                  type="text"
                  value={editableContent.storeNameBn}
                  onChange={(e) => setEditableContent({ ...editableContent, storeNameBn: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-500 font-semibold text-slate-900"
                />
              </div>

              {/* Store Name En */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isBn ? 'Store Name (English):' : 'Store Name (English):'}
                </label>
                <input
                  type="text"
                  value={editableContent.storeNameEn}
                  onChange={(e) => setEditableContent({ ...editableContent, storeNameEn: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-500 font-semibold text-slate-900"
                />
              </div>

              {/* Tagline */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isBn ? 'দোকানের স্লোগান / ট্যাগলাইন:' : 'Tagline:'}
                </label>
                <input
                  type="text"
                  value={editableContent.taglineBn}
                  onChange={(e) => setEditableContent({ ...editableContent, taglineBn: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              {/* Hotline */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isBn ? 'হটলাইন / মোবাইল নম্বর:' : 'Hotline Phone:'}
                </label>
                <input
                  type="text"
                  value={editableContent.hotline}
                  onChange={(e) => setEditableContent({ ...editableContent, hotline: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
                />
              </div>

              {/* Support Email */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isBn ? 'সাপোর্ট ইমেইল:' : 'Support Email:'}
                </label>
                <input
                  type="email"
                  value={editableContent.email}
                  onChange={(e) => setEditableContent({ ...editableContent, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isBn ? 'দোকানের ঠিকানা:' : 'Store Address:'}
                </label>
                <input
                  type="text"
                  value={editableContent.addressBn}
                  onChange={(e) => setEditableContent({ ...editableContent, addressBn: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              {/* bKash Payment Number */}
              <div>
                <label className="block font-bold text-pink-700 mb-1 flex items-center justify-between">
                  <span>{isBn ? 'বিকাশ নম্বর (Send Money):' : 'bKash Personal #:'}</span>
                  <span className="text-[10px] bg-pink-100 text-pink-700 px-1.5 py-0.2 rounded font-bold">bKash</span>
                </label>
                <input
                  type="text"
                  value={editableContent.bkashNumber || '01784315047'}
                  onChange={(e) => setEditableContent({ ...editableContent, bkashNumber: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-pink-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-pink-500 font-mono font-bold text-slate-900"
                />
              </div>

              {/* Nagad Payment Number */}
              <div>
                <label className="block font-bold text-orange-700 mb-1 flex items-center justify-between">
                  <span>{isBn ? 'নগদ নম্বর (Send Money):' : 'Nagad Personal #:'}</span>
                  <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.2 rounded font-bold">Nagad</span>
                </label>
                <input
                  type="text"
                  value={editableContent.nagadNumber || '01784315047'}
                  onChange={(e) => setEditableContent({ ...editableContent, nagadNumber: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-orange-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono font-bold text-slate-900"
                />
              </div>
            </div>

            {/* Top Announcement Bar */}
            <div className="pt-2">
              <label className="block font-bold text-slate-700 mb-1">
                {isBn ? 'শীর্ষ অফার বার্তা (Top Announcement Bar):' : 'Top Announcement Notice:'}
              </label>
              <input
                type="text"
                value={editableContent.announcementBn}
                onChange={(e) => setEditableContent({ ...editableContent, announcementBn: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-500 text-orange-700 font-medium"
              />
            </div>

            {/* Logo & Banner Image Assets Section */}
            <div className="p-4 bg-orange-50/70 rounded-2xl border border-orange-200 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="font-extrabold text-slate-900 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-orange-600" />
                  <span>{isBn ? 'লোগো ও ব্যানার ছবি কনফিগারেশন' : 'Logo & Banner Image Assets'}</span>
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    setEditableContent({
                      ...editableContent,
                      logoUrl: '/assets/aistudio/SmartShop_Logo_1b94ad7a.jpg',
                      bannerUrl: '/assets/aistudio/SmartShop_Benar_786a522b.jpg'
                    });
                  }}
                  className="text-xs text-orange-700 hover:text-orange-900 underline font-bold cursor-pointer"
                >
                  {isBn ? 'ডিফল্ট SmartShop BD ছবি রিসেট করুন' : 'Reset to Default SmartShop Images'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Logo URL & Preview */}
                <div className="bg-white p-3.5 rounded-xl border border-orange-200/80 space-y-2.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <label className="block font-bold text-slate-800 text-xs">
                      {isBn ? 'ওয়েবসাইটের লোগো (Logo Image Path):' : 'Website Logo Path:'}
                    </label>
                    <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">SmartShop Logo</span>
                  </div>
                  <input
                    type="text"
                    value={editableContent.logoUrl || ''}
                    onChange={(e) => setEditableContent({ ...editableContent, logoUrl: e.target.value })}
                    placeholder="/assets/aistudio/SmartShop_Logo_1b94ad7a.jpg"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                  <div className="flex items-center gap-3 pt-1">
                    <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                      {editableContent.logoUrl ? (
                        <img
                          src={editableContent.logoUrl}
                          alt="Logo Preview"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span className="text-[10px] text-slate-400">No Logo</span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      <p className="font-semibold text-slate-700">{isBn ? 'বর্তমান লোগো প্রিভিউ' : 'Current Logo Preview'}</p>
                      <p className="text-[10px] text-slate-400">{isBn ? 'ন্যাভবার ও ফুটারে প্রদর্শিত হচ্ছে।' : 'Displayed on header & footer.'}</p>
                    </div>
                  </div>
                </div>

                {/* Banner URL & Preview */}
                <div className="bg-white p-3.5 rounded-xl border border-orange-200/80 space-y-2.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <label className="block font-bold text-slate-800 text-xs">
                      {isBn ? 'ওয়েবসাইটের মূল ব্যানার (Hero Banner Path):' : 'Main Banner Path:'}
                    </label>
                    <span className="text-[10px] bg-orange-100 text-orange-800 font-bold px-1.5 py-0.5 rounded">SmartShop Banner</span>
                  </div>
                  <input
                    type="text"
                    value={editableContent.bannerUrl || ''}
                    onChange={(e) => setEditableContent({ ...editableContent, bannerUrl: e.target.value })}
                    placeholder="/assets/aistudio/SmartShop_Benar_786a522b.jpg"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                  <div className="flex items-center gap-3 pt-1">
                    <div className="w-24 h-16 rounded-xl bg-slate-900 border border-slate-200 p-0.5 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                      {editableContent.bannerUrl ? (
                        <img
                          src={editableContent.bannerUrl}
                          alt="Banner Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-[10px] text-slate-400">No Banner</span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      <p className="font-semibold text-slate-700">{isBn ? 'বর্তমান ব্যানার প্রিভিউ' : 'Current Banner Preview'}</p>
                      <p className="text-[10px] text-slate-400">{isBn ? 'হোমপেজের শীর্ষে প্রদর্শিত হচ্ছে।' : 'Displayed at homepage top.'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Website Link, App & Google SEO Hub */}
            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50/80 rounded-2xl border border-blue-200 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="font-extrabold text-blue-950 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span>{isBn ? 'ওয়েবসাইট লিংক, অ্যাপ ও গুগল এসইও (smartshopbd)' : 'Website Link, App & Google SEO'}</span>
                </h4>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {isBn ? 'গুগল সার্চ ও অ্যাপ রেডি' : 'SEO & App Ready'}
                </span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-blue-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    {isBn ? 'আপনার অফিসিয়াল লিংক:' : 'Official Brand URL:'}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-blue-700">smartshopbd</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 font-mono text-xs text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-200 truncate select-all">
                    https://smartshopbd.com
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText('https://smartshopbd.com');
                      setDomainCopied(true);
                      setTimeout(() => setDomainCopied(false), 2500);
                    }}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer text-white ${
                      domainCopied ? 'bg-emerald-600' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {domainCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{domainCopied ? (isBn ? 'কপি হয়েছে!' : 'Copied!') : (isBn ? 'কপি' : 'Copy')}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
                <div className="p-2 rounded-lg bg-white/70 border border-blue-100 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-orange-600" />
                  <span>{isBn ? '📱 মোবাইল অ্যাপ PWA সক্রিয়' : 'Mobile PWA App Active'}</span>
                </div>
                <div className="p-2 rounded-lg bg-white/70 border border-blue-100 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isBn ? '🔍 গুগল সার্চ Schema.org প্রস্তুত' : 'Google Schema.org Ready'}</span>
                </div>
              </div>
            </div>

            {/* Hero Banner Text Section */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-3.5">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{isBn ? 'হোমপেজ হিরো ব্যানার টেক্সট' : 'Homepage Hero Banner Text'}</span>
              </h4>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isBn ? 'ব্যানারের ছোট ব্যাজ লেখা:' : 'Hero Badge:'}
                </label>
                <input
                  type="text"
                  value={editableContent.heroBadgeBn}
                  onChange={(e) => setEditableContent({ ...editableContent, heroBadgeBn: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isBn ? 'ব্যানার প্রধান শিরোনাম (Hero Title):' : 'Hero Main Headline:'}
                </label>
                <input
                  type="text"
                  value={editableContent.heroHeadlineBn}
                  onChange={(e) => setEditableContent({ ...editableContent, heroHeadlineBn: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isBn ? 'ব্যানারের বিস্তারিত বিবরণ:' : 'Hero Subtitle Description:'}
                </label>
                <textarea
                  rows={2}
                  value={editableContent.heroSubtitleBn}
                  onChange={(e) => setEditableContent({ ...editableContent, heroSubtitleBn: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-lg shadow-rose-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {contentSavedMsg ? <Check className="w-4 h-4 text-emerald-200" /> : <Save className="w-4 h-4" />}
              <span>{contentSavedMsg ? (isBn ? 'সমস্ত কনটেন্ট সফলভাবে সেভ হয়েছে!' : 'All Content Saved!') : (isBn ? 'সমস্ত কনটেন্ট সেভ করুন (Save All)' : 'Save All Changes')}</span>
            </button>
          </form>
        )}

        {/* Tab 2: Products Manager (Edit Price, Description, Images, Stock) */}
        {activeTab === 'products' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {productToast && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{productToast}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setProductToast(null)}
                  className="text-emerald-700 hover:text-emerald-950 font-bold px-2 py-0.5 rounded-lg hover:bg-emerald-100 transition cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {/* If currently editing or adding a product, show Enhanced Edit Form */}
            {editingProduct ? (
              <form onSubmit={isAddingNewProduct ? handleAddNewProductSubmit : handleSaveProductEdit} className="p-4 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-5 text-xs sm:text-sm">
                {/* Form Header */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base sm:text-lg flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-rose-100 text-rose-700">
                        {isAddingNewProduct ? <Plus className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
                      </span>
                      <span>
                        {isAddingNewProduct 
                          ? (isBn ? 'দোকানে নতুন পণ্য যুক্ত করুন' : 'Add New Product to Store')
                          : (isBn ? `পণ্য এডিট করুন: ${editingProduct.nameBn}` : `Edit Product: ${editingProduct.name}`)}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {isBn ? 'গ্যালারি থেকে ছবি, % ডিসকাউন্ট এবং অটোমেটিক সাইজ ও রং সিলেক্ট করে সহজে পণ্য যুক্ত করুন।' : 'Upload from gallery, calculate discounts, and pick sizes & colors.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setEditingProduct(null); setIsAddingNewProduct(false); }}
                    className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition cursor-pointer"
                  >
                    ✕ {isBn ? 'বাতিল' : 'Cancel'}
                  </button>
                </div>

                {/* 1. PHOTO & GALLERY UPLOAD SECTION */}
                <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <label className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                      <Camera className="w-4 h-4 text-rose-600" />
                      <span>{isBn ? 'পণ্যের ছবি (গ্যালারি থেকে নির্বাচন বা লিংক)' : 'Product Photo (Gallery or URL)'} *</span>
                    </label>

                    {/* Mode switch */}
                    <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setImageInputMode('upload')}
                        className={`px-3 py-1 rounded-lg transition ${
                          imageInputMode === 'upload'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {isBn ? '📷 গ্যালারি / ফাইল থেকে আপলোড' : '📷 Upload from Gallery'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageInputMode('url')}
                        className={`px-3 py-1 rounded-lg transition ${
                          imageInputMode === 'url'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {isBn ? '🔗 ছবির লিংক (URL)' : '🔗 Image URL'}
                      </button>
                    </div>
                  </div>

                  {/* Hidden file input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    className="hidden"
                  />

                  {imageInputMode === 'upload' ? (
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl border-2 border-dashed border-rose-200 bg-rose-50/40 hover:bg-rose-50/70 transition">
                        {/* Image Preview Box */}
                        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm shrink-0 flex items-center justify-center">
                          {editingProduct.image ? (
                            <img
                              src={editingProduct.image}
                              alt="Product Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-center p-2 text-slate-400">
                              <ImageIcon className="w-8 h-8 mx-auto mb-1 text-slate-300" />
                              <span className="text-[11px]">{isBn ? 'ছবি নেই' : 'No photo'}</span>
                            </div>
                          )}
                          {editingProduct.discountPercent && editingProduct.discountPercent > 0 && (
                            <span className="absolute top-1.5 left-1.5 bg-rose-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                              -{editingProduct.discountPercent}%
                            </span>
                          )}
                        </div>

                        {/* Upload Controls */}
                        <div className="flex-1 text-center sm:text-left space-y-2">
                          <h4 className="font-extrabold text-slate-900 text-sm">
                            {isBn ? 'মোবাইল বা কম্পিউটারের গ্যালারি থেকে ছবি আপলোড করুন' : 'Upload photo from your mobile or PC gallery'}
                          </h4>
                          <p className="text-xs text-slate-500">
                            {isBn ? 'ক্যামেরা দিয়ে তোলা ছবি বা মেমোরি কার্ড/গ্যালারি থেকে সরাসরি যুক্ত করুন (JPG, PNG, WebP)' : 'Direct file upload from camera or local gallery (max 8MB).'}
                          </p>

                          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer active:scale-95"
                            >
                              <Upload className="w-4 h-4" />
                              <span>{isBn ? 'গ্যালারি থেকে ছবি বেছে নিন' : 'Choose from Gallery'}</span>
                            </button>

                            {editingProduct.image && (
                              <button
                                type="button"
                                onClick={() => setEditingProduct({ ...editingProduct, image: '' })}
                                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs transition cursor-pointer"
                              >
                                {isBn ? 'ছবি ক্লিয়ার' : 'Clear'}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Ready sample presets */}
                      <div className="flex items-center gap-2 text-xs text-slate-500 overflow-x-auto py-1">
                        <span className="font-bold text-slate-700 shrink-0">{isBn ? 'রেডি স্যাম্পল ছবি:' : 'Sample photos:'}</span>
                        {[
                          { label: 'শার্ট', url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80' },
                          { label: 'পাঞ্জাবি', url: 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?auto=format&fit=crop&w=800&q=80' },
                          { label: 'শাড়ি', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80' },
                          { label: 'টি-শার্ট', url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80' },
                          { label: 'জুতা', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80' }
                        ].map((sample) => (
                          <button
                            key={sample.label}
                            type="button"
                            onClick={() => setEditingProduct({ ...editingProduct, image: sample.url })}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px] shrink-0 transition"
                          >
                            + {sample.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="url"
                        value={editingProduct.image}
                        onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                        placeholder="https://example.com/product-image.jpg"
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono text-xs"
                      />
                      {editingProduct.image && (
                        <div className="mt-2 flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-200">
                          <img src={editingProduct.image} alt="Preview" className="w-12 h-12 rounded-lg object-cover bg-white" />
                          <span className="text-xs text-slate-600 truncate font-mono">{editingProduct.image}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 2. TITLE, FOLDER & FABRIC DETAILS */}
                <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3.5">
                  <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
                    <Tag className="w-4 h-4 text-rose-600" />
                    <span>{isBn ? 'পণ্যের নাম ও ফোল্ডার ক্যাটাগরি' : 'Product Title & Folder'}</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {isBn ? 'পণ্যের নাম (বাংলা) *' : 'Product Title (Bangla) *'}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="যেমন: প্রিমিয়াম এক্সক্লুসিভ পাঞ্জাবি"
                        value={editingProduct.nameBn}
                        onChange={(e) => setEditingProduct({ ...editingProduct, nameBn: e.target.value })}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {isBn ? 'Product Name (English)' : 'Product Name (English)'}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Premium Exclusive Panjabi"
                        value={editingProduct.name}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {isBn ? 'ফোল্ডার ক্যাটাগরি নির্বাচন *' : 'Folder Category *'}
                      </label>
                      <select
                        value={editingProduct.folderId || 'folder-shirt'}
                        onChange={(e) => handleFolderChange(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500 font-bold text-slate-800"
                      >
                        {folders.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.icon} {f.nameBn} ({f.nameEn})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {isBn ? 'ফ্যাব্রিক ও কাপড়ের ধরণ' : 'Fabric Material Details'}
                      </label>
                      <input
                        type="text"
                        value={editingProduct.fabricDetails || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, fabricDetails: e.target.value })}
                        placeholder="যেমন: ১০০% মিশরীয় গিজা সুতি, ৮০ কাউন্ট"
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500"
                      />
                    </div>
                  </div>

                  {/* Fabric quick chips */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
                    <span className="text-slate-500 font-semibold">{isBn ? 'কুইক ফ্যাব্রিক সাজেশন:' : 'Fabric suggestions:'}</span>
                    {['১০০% পিওর কটন', 'মিশরীয় গিজা সুতি', 'প্রিমিয়াম লিনেন', 'জামদানি উইভ', 'জর্জেট', 'সিল্ক', 'প্রিমিয়াম ডেনিম'].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setEditingProduct({ ...editingProduct, fabricDetails: chip })}
                        className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 text-[11px] transition"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. PRICING & PERCENTAGE DISCOUNT ENGINE */}
                <div className="p-4 sm:p-5 bg-gradient-to-br from-rose-50/50 via-white to-amber-50/40 rounded-2xl border-2 border-rose-200 shadow-xs space-y-3.5">
                  <div className="flex items-center justify-between border-b border-rose-100 pb-2.5">
                    <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                      <Percent className="w-4 h-4 text-rose-600" />
                      <span>{isBn ? 'পণ্য মূল্য ও % ডিসকাউন্ট সিস্টেম' : 'Pricing & Percentage Discount'}</span>
                    </h4>
                    <span className="text-[11px] bg-rose-600 text-white font-black px-2.5 py-0.5 rounded-full">
                      {editingProduct.discountPercent && editingProduct.discountPercent > 0
                        ? `${editingProduct.discountPercent}% ${isBn ? 'ছাড় সক্রিয়' : 'Off Active'}`
                        : (isBn ? 'কোনো ছাড় নেই' : 'No Discount')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    {/* Original Price */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {isBn ? 'পূর্বের আসল মূল্য (৳)' : 'Original / Regular Price (BDT)'}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 font-bold text-slate-400">৳</span>
                        <input
                          type="number"
                          value={editingProduct.originalPrice || ''}
                          onChange={(e) => handleOriginalPriceChange(Number(e.target.value))}
                          placeholder="1500"
                          className="w-full pl-8 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500 font-bold text-slate-800"
                        />
                      </div>
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        {isBn ? 'ডিসকাউন্টের আগে যে মূল্য ছিল' : 'Regular price before discount'}
                      </span>
                    </div>

                    {/* Discount Percentage */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {isBn ? 'ডিসকাউন্ট পার্সেন্টেজ (%)' : 'Discount Percentage (%)'}
                      </label>
                      <div className="relative">
                        <span className="absolute right-3 top-2.5 font-bold text-rose-600">%</span>
                        <input
                          type="number"
                          min="0"
                          max="99"
                          value={editingProduct.discountPercent || ''}
                          onChange={(e) => handleDiscountPercentChange(Number(e.target.value))}
                          placeholder="20"
                          className="w-full pl-3 pr-8 py-2.5 bg-white border-2 border-rose-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 font-black text-rose-600 text-base"
                        />
                      </div>
                      <span className="text-[11px] text-rose-700 font-bold mt-1 block">
                        {isBn ? '% লিখে দিন বা নিচের বাটনে চাপ দিন' : 'Type discount % or tap buttons'}
                      </span>
                    </div>

                    {/* Selling Price */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {isBn ? 'অফার / বিক্রয় মূল্য (৳) *' : 'Selling Price (BDT) *'}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 font-bold text-rose-600">৳</span>
                        <input
                          type="number"
                          required
                          value={editingProduct.price || ''}
                          onChange={(e) => handleSellingPriceChange(Number(e.target.value))}
                          placeholder="1200"
                          className="w-full pl-8 pr-3 py-2.5 bg-white border-2 border-rose-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 font-black text-rose-600 text-base"
                        />
                      </div>
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        {isBn ? 'কাস্টমার এই মূল্যে পণ্য কিনবেন' : 'Final selling price'}
                      </span>
                    </div>
                  </div>

                  {/* Quick Discount Buttons */}
                  <div className="pt-1">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {isBn ? '⚡ এক ক্লিকে ডিসকাউন্ট বেছে নিন:' : '⚡ Quick 1-Tap Discount:'}
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {QUICK_DISCOUNTS.map((discountVal) => {
                        const isCurrent = (editingProduct.discountPercent || 0) === discountVal;
                        return (
                          <button
                            key={discountVal}
                            type="button"
                            onClick={() => handleDiscountPercentChange(discountVal)}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer active:scale-95 ${
                              isCurrent
                                ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-400'
                                : 'bg-white border border-slate-300 text-slate-700 hover:border-rose-300 hover:bg-rose-50'
                            }`}
                          >
                            {discountVal === 0 ? (isBn ? '০% (ছাড় নেই)' : '0% (No discount)') : `-${discountVal}%`}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Savings Calculation Note */}
                  {editingProduct.originalPrice > editingProduct.price && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>
                          {isBn 
                            ? `গ্রাহক সাশ্রয় করবেন: ৳${(editingProduct.originalPrice - editingProduct.price).toLocaleString()} (${editingProduct.discountPercent}% ছাড়)`
                            : `Customer saves: BDT ${(editingProduct.originalPrice - editingProduct.price).toLocaleString()} (${editingProduct.discountPercent}% OFF)`}
                        </span>
                      </div>
                      <span className="font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                        {isBn ? 'সক্রিয় ছাড় ব্যাজ' : 'Badge Active'}
                      </span>
                    </div>
                  )}
                </div>

                {/* 4. AUTOMATIC PRESET SIZES */}
                <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                        <Layers className="w-4 h-4 text-rose-600" />
                        <span>{isBn ? 'পণ্য সাইজ নির্বাচন (অটোমেটিক তালিকা)' : 'Product Sizes (Preset Auto-List)'}</span>
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {isBn ? 'যে যে সাইজ স্টকে আছে তাতে ক্লিক করে সিলেক্ট করুন' : 'Tap any size chip to toggle availability.'}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleSelectGroupSizes(['S', 'M', 'L', 'XL', 'XXL'])}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                      >
                        {isBn ? '+ সব পোশাক (S-XXL)' : '+ Clothing (S-XXL)'}
                      </button>
                      <button
                        type="button"
                        onClick={handleClearSizes}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 text-xs font-semibold transition"
                      >
                        {isBn ? 'ক্লিয়ার' : 'Clear'}
                      </button>
                    </div>
                  </div>

                  {/* Preset Size Groups */}
                  <div className="space-y-3">
                    {PRESET_SIZE_GROUPS.map((group) => (
                      <div key={group.title} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                          <span>{group.title}</span>
                          <button
                            type="button"
                            onClick={() => handleSelectGroupSizes(group.sizes)}
                            className="text-rose-600 hover:text-rose-800 text-[11px] font-semibold"
                          >
                            {isBn ? 'সব সিলেক্ট করুন' : 'Select All'}
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {group.sizes.map((size) => {
                            const isSelected = (editingProduct.sizes || []).includes(size);
                            return (
                              <button
                                key={size}
                                type="button"
                                onClick={() => handleToggleSize(size)}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer active:scale-95 flex items-center gap-1 ${
                                  isSelected
                                    ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-400'
                                    : 'bg-white text-slate-700 border border-slate-300 hover:border-slate-400 hover:bg-slate-100'
                                }`}
                              >
                                {isSelected && <span>✓</span>}
                                <span>{size}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Custom Size Adder */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={customSizeInput}
                      onChange={(e) => setCustomSizeInput(e.target.value)}
                      placeholder={isBn ? 'কাস্টম সাইজ লিখুন (যেমন: 4XL বা 46)' : 'Custom size (e.g. 4XL)...'}
                      className="flex-1 p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddCustomSize()}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition"
                    >
                      {isBn ? '+ সাইজ যোগ করুন' : '+ Add Size'}
                    </button>
                  </div>

                  {/* Active Selected Sizes Display */}
                  <div className="text-xs text-slate-600 flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="font-bold text-slate-800">{isBn ? 'নির্বাচিত সাইজসমূহ:' : 'Active Sizes:'}</span>
                    {editingProduct.sizes && editingProduct.sizes.length > 0 ? (
                      editingProduct.sizes.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 font-bold text-[11px]">
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 italic">{isBn ? '(কোনো সাইজ সিলেক্ট করা নেই)' : '(No sizes selected)'}</span>
                    )}
                  </div>
                </div>

                {/* 5. AUTOMATIC PRESET COLORS & COLOR-WISE IMAGES */}
                <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                        <Palette className="w-4 h-4 text-rose-600" />
                        <span>{isBn ? 'পণ্যের রঙ / কালার নির্বাচন ও আলাদা ছবি' : 'Product Colors & Variant Photos'}</span>
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {isBn 
                          ? 'বাদামী, সাদা বা যেকোনো রঙে ক্লিক করলে গ্রাহকের সামনে সেই রঙের পণ্যের ছবি প্রদর্শিত হবে' 
                          : 'Select colors and optionally assign individual photos for each color variant.'}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleSelectPopularColors}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                        title={isBn ? 'জেট ব্ল্যাক, সাদা, বাদামী, মেরুন ও অলিভ কালার' : 'Select top 5 colors'}
                      >
                        {isBn ? 'জনপ্রিয় কালারসমূহ' : 'Popular Colors'}
                      </button>
                      
                      {editingProduct.colors && editingProduct.colors.length > 0 && (
                        <button
                          type="button"
                          onClick={handleAutoMapSampleColorImages}
                          className="px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition cursor-pointer border border-blue-200 flex items-center gap-1"
                          title={isBn ? 'সাদা ও বাদামী রঙের জন্য স্বয়ংক্রিয় ছবি সেট করুন' : 'Auto-map photos for White & Brown'}
                        >
                          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                          <span>{isBn ? 'অটো-ছবি সেট (সাদা ও বাদামী)' : 'Auto-Map Photos'}</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={handleClearColors}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition cursor-pointer border border-rose-200 flex items-center gap-1"
                        title={isBn ? 'এই পণ্যের সকল কালার অপশন বাতিল করুন' : 'Cancel/Disable all colors for this product'}
                      >
                        <X className="w-3.5 h-3.5 text-rose-600" />
                        <span>{isBn ? 'কালার বাতিল করুন (কোনো কালার থাকবে না)' : 'Clear / Disable Colors'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Notice if colors are completely cancelled / disabled */}
                  {(!editingProduct.colors || editingProduct.colors.length === 0) ? (
                    <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 animate-fadeIn">
                      <div className="flex items-start sm:items-center gap-2">
                        <span className="text-base">🚫</span>
                        <div>
                          <p className="font-bold">
                            {isBn 
                              ? 'কালার অপশন বাতিল রয়েছে (কোনো কালার থাকবে না)' 
                              : 'Color options are disabled for this product'}
                          </p>
                          <p className="text-[11px] text-amber-700">
                            {isBn 
                              ? 'পণ্যটি কোনো কালার বাছাইয়ের ঝামেলা ছাড়াই সরাসরি অর্ডারের জন্য প্রদর্শিত হবে।' 
                              : 'Customers can purchase this item directly without picking a color.'}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleSelectPopularColors}
                        className="px-3 py-1.5 bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold rounded-lg text-xs transition cursor-pointer whitespace-nowrap self-start sm:self-auto"
                      >
                        {isBn ? '+ কালার চালু করুন' : '+ Enable Colors'}
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Color Chips Palette */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 block">
                          {isBn ? 'কালার প্যালেট থেকে বাছাই করুন (এক চাপ দিয়ে অন/অফ করুন):' : 'Click to toggle colors on/off:'}
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {PRESET_COLORS.map((c) => {
                            const isSelected = (editingProduct.colors || []).includes(c.name);
                            return (
                              <button
                                key={c.name}
                                type="button"
                                onClick={() => handleToggleColor(c.name)}
                                className={`p-2 rounded-xl text-xs font-bold flex items-center gap-2 transition active:scale-95 cursor-pointer text-left border ${
                                  isSelected
                                    ? 'bg-rose-50 border-rose-500 text-rose-900 shadow-xs ring-1 ring-rose-400'
                                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300'
                                }`}
                              >
                                <span
                                  className={`w-4 h-4 rounded-full shrink-0 shadow-xs ${c.border ? 'border border-slate-300' : ''}`}
                                  style={{ backgroundColor: c.hex }}
                                />
                                <span className="truncate flex-1 text-[11px]">{c.name}</span>
                                {isSelected && <span className="text-rose-600 font-black">✓</span>}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Custom Color Adder */}
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          value={customColorInput}
                          onChange={(e) => setCustomColorInput(e.target.value)}
                          placeholder={isBn ? 'অন্য কোনো কাস্টম কালার নাম লিখুন (যেমন: গোল্ডেন বা চকলেট)' : 'Add custom color name...'}
                          className="flex-1 p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddCustomColor()}
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                        >
                          {isBn ? '+ কালার যোগ করুন' : '+ Add Color'}
                        </button>
                      </div>

                      {/* Color-wise Images Management Card */}
                      <div className="mt-4 p-4 bg-slate-50/90 rounded-2xl border border-slate-200/90 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <h5 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                            <ImageIcon className="w-3.5 h-3.5 text-rose-600" />
                            <span>{isBn ? 'কালার অনুযায়ী নির্দিষ্ট ছবি নির্বাচন (বাদামী, সাদা ইত্যাদির ছবি)' : 'Color-wise Variant Images'}</span>
                          </h5>
                          <span className="text-[11px] text-slate-500">
                            {isBn ? 'গ্রাহক যে কালারে চাপবেন সেই ছবি সামনে আসবে' : 'Active color switches main photo'}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {editingProduct.colors.map((color, idx) => {
                            const assignedImg = editingProduct.colorImages?.[color];
                            const isUrlActive = showColorUrlInput[color];
                            const inputId = `file-color-${idx}-${color.replace(/\s+/g, '-')}`;

                            return (
                              <div
                                key={color}
                                className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between gap-2.5 transition hover:border-slate-300"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <span className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0 bg-slate-400" />
                                    <span className="font-bold text-xs text-slate-900 truncate">{color}</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleToggleColor(color)}
                                    className="text-slate-400 hover:text-rose-600 transition p-1"
                                    title={isBn ? 'কালারটি বাদ দিন' : 'Remove this color'}
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                {/* Image Preview & Action Buttons */}
                                <div className="flex items-center gap-3">
                                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative flex items-center justify-center">
                                    {assignedImg ? (
                                      <img src={assignedImg} alt={color} className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="text-center p-1 text-[10px] text-slate-400 font-medium leading-tight">
                                        {isBn ? 'ডিফল্ট ছবি' : 'Default'}
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex-1 flex flex-col gap-1.5">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                      {/* File upload button */}
                                      <input
                                        type="file"
                                        id={inputId}
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                          const f = e.target.files?.[0];
                                          if (f) handleUploadColorImage(color, f);
                                        }}
                                      />
                                      <label
                                        htmlFor={inputId}
                                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg cursor-pointer transition flex items-center gap-1 shadow-2xs"
                                      >
                                        <Upload className="w-3 h-3 text-rose-600" />
                                        <span>{isBn ? 'ছবি আপলোড' : 'Upload'}</span>
                                      </label>

                                      {/* URL toggle button */}
                                      <button
                                        type="button"
                                        onClick={() => setShowColorUrlInput((prev) => ({ ...prev, [color]: !prev[color] }))}
                                        className="px-2 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition cursor-pointer"
                                      >
                                        <span>{isBn ? 'লিংক দিন' : 'URL'}</span>
                                      </button>

                                      {/* Remove image button if assigned */}
                                      {assignedImg && (
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveColorImage(color)}
                                          className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg transition cursor-pointer"
                                          title={isBn ? 'ছবি মুছুন' : 'Remove Image'}
                                        >
                                          {isBn ? 'রিমুভ' : 'Remove'}
                                        </button>
                                      )}
                                    </div>

                                    {/* Inline URL input */}
                                    {isUrlActive && (
                                      <div className="flex items-center gap-1 animate-fadeIn pt-1">
                                        <input
                                          type="text"
                                          value={colorUrlValue[color] || ''}
                                          onChange={(e) => setColorUrlValue((prev) => ({ ...prev, [color]: e.target.value }))}
                                          placeholder="https://images.unsplash..."
                                          className="flex-1 p-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (colorUrlValue[color]?.trim()) {
                                              handleSetColorImage(color, colorUrlValue[color].trim());
                                              setShowColorUrlInput((prev) => ({ ...prev, [color]: false }));
                                            }
                                          }}
                                          className="px-2 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                                        >
                                          {isBn ? 'সেট' : 'Set'}
                                        </button>
                                      </div>
                                    )}

                                    <div className="text-[10px] text-slate-500">
                                      {assignedImg ? (
                                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                                          <Check className="w-3 h-3 text-emerald-600" />
                                          {isBn ? 'নির্দিষ্ট ছবি সক্রিয়' : 'Variant image active'}
                                        </span>
                                      ) : (
                                        <span>{isBn ? 'ছবি না দিলে মূল ছবিই ব্যবহৃত হবে' : 'Uses product main photo if empty'}</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Active Selected Colors Display */}
                      <div className="text-xs text-slate-600 flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="font-bold text-slate-800">{isBn ? 'নির্বাচিত কালারসমূহ:' : 'Active Colors:'}</span>
                        {editingProduct.colors.map((color) => {
                          const hasImg = !!editingProduct.colorImages?.[color];
                          return (
                            <span 
                              key={color} 
                              className={`px-2 py-0.5 rounded-md border font-bold text-[11px] flex items-center gap-1 ${
                                hasImg 
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                                  : 'bg-blue-50 text-blue-800 border-blue-200'
                              }`}
                            >
                              <span>{color}</span>
                              {hasImg && <span className="text-[10px] text-emerald-600">📷</span>}
                            </span>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>

                {/* 6. DETAILED DESCRIPTION & TEMPLATE BUILDER */}
                <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-2">
                    <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>{isBn ? 'বিস্তারিত বর্ণনা (Description) *' : 'Detailed Description *'}</span>
                    </h4>
                    <span className="text-[11px] text-slate-500">
                      {isBn ? 'নিচের যেকোনো পয়েন্টে ক্লিক করলে বর্ণনায় যোগ হবে' : 'Click buttons below to auto-insert points'}
                    </span>
                  </div>

                  {/* 1-Click Description Template Chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      '১০০% প্রিমিয়াম কোয়ালিটি ও আরামদায়ক ফেব্রিক',
                      'নিখুঁত সেলাই ও আকর্ষণীয় ফিনিশিং',
                      'সারা বাংলাদেশে দ্রুত হোম ডেলিভারি সুবিধা',
                      'ক্যাশ অন ডেলিভারি (পণ্য হাতে পেয়ে মূল্য পরিশোধ)',
                      '১০০% কালার ও কোয়ালিটি গ্যারান্টি'
                    ].map((point) => (
                      <button
                        key={point}
                        type="button"
                        onClick={() => handleAppendDescTemplate(point)}
                        className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[11px] font-semibold transition text-left"
                      >
                        + {point}
                      </button>
                    ))}
                  </div>

                  <div>
                    <textarea
                      rows={4}
                      required
                      placeholder="পণ্যের বিস্তারিত বর্ণনা লিখুন..."
                      value={editingProduct.descriptionBn}
                      onChange={(e) => setEditingProduct({ ...editingProduct, descriptionBn: e.target.value })}
                      className="w-full p-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500 leading-relaxed font-sans"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {isBn ? 'Description (English) — ঐচ্ছিক' : 'Description (English) — Optional'}
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Product description in English..."
                      value={editingProduct.description}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                </div>

                {/* 7. STOCK & FLASH SALE SETTINGS */}
                <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 text-xs sm:text-sm">
                      <input
                        type="checkbox"
                        checked={editingProduct.inStock}
                        onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                        className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4 cursor-pointer"
                      />
                      <span>{isBn ? 'স্টকে আছে (In Stock)' : 'In Stock'}</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-bold text-amber-700 text-xs sm:text-sm">
                      <input
                        type="checkbox"
                        checked={editingProduct.isFlashSale || false}
                        onChange={(e) => setEditingProduct({ ...editingProduct, isFlashSale: e.target.checked })}
                        className="rounded text-amber-500 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                      />
                      <span>{isBn ? '🔥 হট ফ্ল্যাশ সেল অফার (Flash Sale)' : '🔥 Flash Sale Offer'}</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-slate-700">
                      {isBn ? 'স্টক সংখ্যা:' : 'Stock Count:'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editingProduct.stockCount || 50}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stockCount: Number(e.target.value) })}
                      className="w-20 p-1.5 bg-slate-50 border border-slate-300 rounded-lg text-center font-bold text-xs"
                    />
                  </div>
                </div>

                {/* 8. FORM SUBMIT BUTTONS */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-lg shadow-rose-600/30 transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <Save className="w-5 h-5" />
                    <span>
                      {isAddingNewProduct 
                        ? (isBn ? '✅ পণ্যটি ওয়েবসাইটে যুক্ত করুন (Save & Publish)' : '✅ Publish Product to Store') 
                        : (isBn ? '✅ আপডেট সংরক্ষণ করুন (Save Updates)' : '✅ Save Product Updates')}
                    </span>
                  </button>

                  {!isAddingNewProduct && editingProduct && (
                    <button
                      type="button"
                      onClick={() => setProductToDelete(editingProduct)}
                      className="px-5 py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 hover:border-rose-400 font-bold text-sm rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      <Trash2 className="w-4 h-4 text-rose-600" />
                      <span>{isBn ? '🗑️ পণ্যটি ডিলিট করুন' : 'Delete Product'}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => { setEditingProduct(null); setIsAddingNewProduct(false); }}
                    className="px-6 py-3.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-2xl transition cursor-pointer"
                  >
                    {isBn ? 'বাতিল' : 'Cancel'}
                  </button>
                </div>
              </form>
            ) : (
              <>
                {/* Search & Actions Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder={isBn ? 'পণ্য খুঁজুন...' : 'Search products...'}
                      className="p-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500 w-full sm:w-64"
                    />
                    <select
                      value={selectedFolderFilter}
                      onChange={(e) => setSelectedFolderFilter(e.target.value)}
                      className="p-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500 font-medium"
                    >
                      <option value="All">{isBn ? 'সকল ফোল্ডার' : 'All Folders'}</option>
                      {folders.map((f) => (
                        <option key={f.id} value={f.id}>{f.icon} {f.nameBn}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      setIsAddingNewProduct(true);
                      const defaultFolder = folders[0] || { id: 'folder-shirt', nameBn: 'শার্ট কালেকশন', nameEn: 'Shirt Collection' };
                      setEditingProduct({
                        id: `prod-${Date.now()}`,
                        name: '',
                        nameBn: '',
                        folderId: defaultFolder.id,
                        category: defaultFolder.nameEn || 'Fashion',
                        categoryBn: defaultFolder.nameBn || 'পোশাক',
                        price: 1200,
                        originalPrice: 1500,
                        discountPercent: 20,
                        rating: 5.0,
                        reviewsCount: 1,
                        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
                        inStock: true,
                        stockCount: 50,
                        description: '',
                        descriptionBn: '',
                        fabricDetails: '১০০% প্রিমিয়াম সুতি / কটন',
                        tags: ['new', 'fashion', 'smartshopbd'],
                        sizes: ['M', 'L', 'XL'],
                        colors: ['কালো (Black)', 'সাদা (White)', 'রয়্যাল ব্লু (Royal Blue)'],
                        colorImages: {}
                      });
                      setImageInputMode('upload');
                    }}
                    className="w-full sm:w-auto px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isBn ? 'নতুন পণ্য যুক্ত করুন' : 'Add New Product'}</span>
                  </button>
                </div>

                {/* Products List Table */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs sm:text-sm">
                  {adminFilteredProducts.map((p) => {
                    const folder = folders.find((f) => f.id === p.folderId);

                    return (
                      <div key={p.id} className="p-3.5 bg-white hover:bg-slate-50 transition flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={p.image}
                            alt={p.nameBn}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-100"
                          />
                          <div className="min-w-0">
                            <h4 className="font-extrabold text-slate-900 truncate">
                              {p.nameBn}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                              <span className="bg-slate-100 px-1.5 py-0.2 rounded font-semibold text-slate-700">
                                {folder ? `${folder.icon} ${folder.nameBn}` : p.categoryBn}
                              </span>
                              <span className="font-bold text-rose-700">{formatPrice(p.price)}</span>
                              {p.originalPrice > p.price && (
                                <span className="line-through text-slate-400 text-[11px]">{formatPrice(p.originalPrice)}</span>
                              )}
                              {p.discountPercent && p.discountPercent > 0 && (
                                <span className="bg-rose-600 text-white text-[10px] font-black px-1 rounded-sm">
                                  -{p.discountPercent}%
                                </span>
                              )}
                              <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${p.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                                {p.inStock ? 'ইন স্টক' : 'স্টক শেষ'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              setIsAddingNewProduct(false);
                              const discountVal = p.discountPercent !== undefined
                                ? p.discountPercent
                                : (p.originalPrice > p.price ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0);
                              setEditingProduct({
                                ...p,
                                sizes: p.sizes ? [...p.sizes] : [],
                                colors: p.colors ? [...p.colors] : [],
                                colorImages: p.colorImages ? { ...p.colorImages } : {},
                                discountPercent: discountVal
                              });
                              setImageInputMode(p.image?.startsWith('data:') ? 'upload' : 'url');
                            }}
                            className="p-2 rounded-xl border border-slate-200 hover:border-rose-400 hover:bg-rose-50 text-slate-700 hover:text-rose-700 transition flex items-center gap-1 font-bold text-xs"
                            title="এডিট করুন"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">{isBn ? 'এডিট' : 'Edit'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setProductToDelete(p)}
                            className="p-2 rounded-xl border border-rose-200 hover:border-rose-500 hover:bg-rose-50 text-rose-600 hover:text-rose-700 transition flex items-center gap-1 cursor-pointer font-bold text-xs"
                            title={isBn ? 'পণ্য ডিলিট করুন' : 'Delete product'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">{isBn ? 'ডিলিট' : 'Delete'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* Tab 3: Folders Manager */}
        {activeTab === 'folders' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {/* Header info & Add Button */}
            <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Folder className="w-5 h-5 text-rose-600" />
                  <span>{isBn ? 'ক্যাটাগরি ফোল্ডারসমূহ পরিচালনা' : 'Category Folders Management'}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isBn 
                    ? 'নতুন ফোল্ডার যোগ করুন, ডিভাইসের ছবি আপলোড করুন, এডিট বা ডিলিট করুন।' 
                    : 'Add new category folders, upload cover photos, edit details, or delete folders.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {!isAddingNewFolder && (
                  <button
                    type="button"
                    onClick={handleOpenAddFolder}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isBn ? 'নতুন ফোল্ডার যোগ করুন' : 'Add New Folder'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Folder Toast feedback */}
            {folderToast && (
              <div className="p-3 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-between shadow-md animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  <span>{folderToast}</span>
                </div>
                <button onClick={() => setFolderToast(null)} className="text-emerald-100 hover:text-white px-1 font-mono">✕</button>
              </div>
            )}

            {/* Add / Edit Folder Form Card */}
            {isAddingNewFolder && (
              <form 
                onSubmit={handleSaveFolderSubmit} 
                className="p-4 sm:p-5 bg-gradient-to-br from-slate-50 via-white to-rose-50/30 rounded-2xl border-2 border-rose-200 shadow-md space-y-4 animate-in fade-in duration-200"
              >
                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                  <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-rose-100 text-rose-600">
                      <Folder className="w-4 h-4" />
                    </span>
                    <span>{editingFolder ? (isBn ? 'ফোল্ডার ও কাভার ছবি এডিট করুন' : 'Edit Folder & Image') : (isBn ? 'নতুন পণ্যের ফোল্ডার তৈরি করুন' : 'Create New Category Folder')}</span>
                  </h4>
                  <button
                    type="button"
                    onClick={handleCloseFolderForm}
                    className="w-7 h-7 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isBn ? 'ফোল্ডারের নাম (বাংলা) *:' : 'Folder Name (Bangla) *:'}
                    </label>
                    <input
                      type="text"
                      required
                      value={folderFormData.nameBn || ''}
                      onChange={(e) => setFolderFormData({ ...folderFormData, nameBn: e.target.value })}
                      placeholder={isBn ? 'যেমন: পোলো টি-শার্ট কালেকশন' : 'e.g. Polo T-Shirts'}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isBn ? 'ফোল্ডারের নাম (English):' : 'Folder Name (English):'}
                    </label>
                    <input
                      type="text"
                      value={folderFormData.nameEn || ''}
                      onChange={(e) => setFolderFormData({ ...folderFormData, nameEn: e.target.value })}
                      placeholder="e.g. Polo T-Shirts"
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isBn ? 'ট্যাগ (Tag Filter):' : 'Tag:'}
                    </label>
                    <input
                      type="text"
                      value={folderFormData.tag || ''}
                      onChange={(e) => setFolderFormData({ ...folderFormData, tag: e.target.value })}
                      placeholder={isBn ? 'যেমন: পোলো, টি-শার্ট' : 'e.g. Polo'}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>

                {/* Folder Icon Selector with Presets */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                    <span>{isBn ? 'ফোল্ডার আইকন / ইমোজি:' : 'Folder Icon / Emoji:'}</span>
                    <span className="text-[11px] font-normal text-slate-400">নিচের যেকোনো ইমোজিতে ক্লিক করুন</span>
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    <input
                      type="text"
                      value={folderFormData.icon || '📁'}
                      onChange={(e) => setFolderFormData({ ...folderFormData, icon: e.target.value })}
                      className="w-14 text-center p-2 bg-white border border-slate-300 rounded-xl text-lg font-bold"
                    />
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {['👔', '👕', '✨', '👖', '🧥', '🥼', '👟', '👠', '👜', '🎒', '👶', '🧸', '🕶️', '🧢', '⌚', '🎁', '💎', '🔥'].map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setFolderFormData({ ...folderFormData, icon: emoji })}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-base transition cursor-pointer ${
                            folderFormData.icon === emoji 
                              ? 'bg-rose-600 text-white shadow-xs scale-105' 
                              : 'bg-white hover:bg-slate-100 border border-slate-200'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Folder Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isBn ? 'ফোল্ডারের সংক্ষিপ্ত বিবরণ:' : 'Folder Description:'}
                  </label>
                  <input
                    type="text"
                    value={folderFormData.descriptionBn || ''}
                    onChange={(e) => setFolderFormData({ ...folderFormData, descriptionBn: e.target.value })}
                    placeholder={isBn ? 'যেমন: প্রিমিয়াম কোয়ালিটি ফর্মাল ও ক্যাজুয়াল পোশাক' : 'e.g. Premium casual wear collection'}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                {/* Folder Cover Image Section (Device Upload + Online URL) */}
                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-rose-600" />
                      <span>{isBn ? 'ফোল্ডারের কাভার ছবি (Folder Cover Image):' : 'Folder Cover Image:'}</span>
                    </label>

                    {/* Mode Toggle */}
                    <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setFolderImageMode('upload')}
                        className={`px-3 py-1 rounded-md transition cursor-pointer flex items-center gap-1 ${
                          folderImageMode === 'upload' 
                            ? 'bg-white text-rose-600 shadow-2xs' 
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isBn ? 'ডিভাইস থেকে আপলোড' : 'Upload from Device'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFolderImageMode('url')}
                        className={`px-3 py-1 rounded-md transition cursor-pointer flex items-center gap-1 ${
                          folderImageMode === 'url' 
                            ? 'bg-white text-rose-600 shadow-2xs' 
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>{isBn ? 'ছবির লিংক (URL)' : 'Image URL'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    {/* Live Preview Thumbnail */}
                    <div className="sm:col-span-4 flex items-center justify-center">
                      <div className="relative w-full h-32 rounded-xl border-2 border-dashed border-slate-300 overflow-hidden bg-slate-100 flex items-center justify-center">
                        {folderFormData.coverImage ? (
                          <>
                            <img
                              src={folderFormData.coverImage}
                              alt="Folder preview"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 left-2 bg-slate-900/80 text-white text-lg p-1 rounded-lg backdrop-blur-xs">
                              {folderFormData.icon || '📁'}
                            </div>
                          </>
                        ) : (
                          <div className="text-center text-slate-400 p-2">
                            <ImageIcon className="w-8 h-8 mx-auto stroke-1" />
                            <span className="text-[11px] block mt-1">{isBn ? 'ছবি নির্বাচন করুন' : 'No image'}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Input Controls */}
                    <div className="sm:col-span-8 space-y-2.5">
                      {folderImageMode === 'upload' ? (
                        <div>
                          <input
                            type="file"
                            ref={folderFileInputRef}
                            accept="image/*"
                            onChange={handleFolderImageUpload}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => folderFileInputRef.current?.click()}
                            className="w-full py-4 px-4 bg-rose-50 hover:bg-rose-100 border-2 border-dashed border-rose-300 hover:border-rose-400 text-rose-800 rounded-xl font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition cursor-pointer"
                          >
                            <Camera className="w-6 h-6 text-rose-600" />
                            <span>{isBn ? '📱 মোবাইল বা কম্পিউটার থেকে ছবি সিলেক্ট করুন' : 'Upload photo from phone or computer'}</span>
                            <span className="text-[10px] text-slate-500 font-normal">JPG, PNG, WebP (সর্বোচ্চ ৫MB)</span>
                          </button>
                        </div>
                      ) : (
                        <div>
                          <input
                            type="url"
                            value={folderFormData.coverImage || ''}
                            onChange={(e) => setFolderFormData({ ...folderFormData, coverImage: e.target.value })}
                            placeholder="https://images.unsplash.com/photo-..."
                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                          />
                        </div>
                      )}

                      {/* Sample Preset Images for quick select */}
                      <div>
                        <span className="text-[11px] font-bold text-slate-600 block mb-1">
                          {isBn ? 'বা নিচের নমুনা ছবি থেকে ১-ক্লিকে বেছে নিন:' : 'Or choose from sample clothing covers:'}
                        </span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {[
                            { label: 'শার্ট', url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80' },
                            { label: 'টি-শার্ট', url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80' },
                            { label: 'পাঞ্জাবি', url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80' },
                            { label: 'প্যান্ট', url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80' },
                            { label: 'হুডি', url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80' },
                            { label: 'জুতো', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80' },
                            { label: 'ব্যাগ', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80' }
                          ].map((preset) => (
                            <button
                              key={preset.label}
                              type="button"
                              onClick={() => setFolderFormData({ ...folderFormData, coverImage: preset.url })}
                              className="px-2 py-1 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 text-[10px] font-bold rounded-md border border-slate-200 transition cursor-pointer"
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={handleCloseFolderForm}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    {isBn ? 'বাতিল' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingFolder ? (isBn ? 'পরিবর্তন সেভ করুন' : 'Update Folder') : (isBn ? 'ফোল্ডার সংরক্ষণ করুন' : 'Save Folder')}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Existing Folders Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-rose-600" />
                  <span>{isBn ? `বিদ্যমান ফোল্ডার তালিকা (${folders.length}টি)` : `Active Folders (${folders.length})`}</span>
                </h4>
                <span className="text-[11px] text-slate-400">
                  {isBn ? 'যেকোনো ফোল্ডারের ছবি বা নাম পরিবর্তন করতে এডিট বাটনে চাপুন' : 'Click edit to change photo or details'}
                </span>
              </div>

              {folders.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-2 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                  <Folder className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
                  <p className="font-bold text-slate-700">{isBn ? 'কোনো ফোল্ডার তৈরি করা হয়নি' : 'No folders found'}</p>
                  <button
                    type="button"
                    onClick={handleOpenAddFolder}
                    className="px-4 py-2 bg-rose-600 text-white font-bold text-xs rounded-xl shadow-xs"
                  >
                    {isBn ? 'প্রথম ফোল্ডার তৈরি করুন' : 'Create First Folder'}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {folders.map((folder) => {
                    const productCount = products.filter((p) => p.folderId === folder.id).length;
                    return (
                      <div 
                        key={folder.id} 
                        className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        {/* Card Header & Image */}
                        <div className="relative h-36 bg-slate-100 overflow-hidden group">
                          <img
                            src={folder.coverImage}
                            alt={folder.nameBn}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
                          
                          {/* Folder Icon & Count Badge */}
                          <div className="absolute top-3 left-3 flex items-center gap-2">
                            <span className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md shadow-md text-xl flex items-center justify-center">
                              {folder.icon}
                            </span>
                            <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold border border-white/20">
                              {productCount} {isBn ? 'টি পণ্য' : 'products'}
                            </span>
                          </div>

                          {/* Tag */}
                          {folder.tag && (
                            <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold shadow-xs">
                              #{folder.tag}
                            </span>
                          )}

                          {/* Title on Image */}
                          <div className="absolute bottom-3 left-3 right-3">
                            <h4 className="text-white font-black text-base truncate drop-shadow-sm">
                              {folder.nameBn}
                            </h4>
                            <p className="text-slate-300 text-xs truncate">
                              {folder.nameEn || folder.nameBn}
                            </p>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-3.5 space-y-3">
                          <p className="text-xs text-slate-600 line-clamp-2 min-h-8">
                            {folder.descriptionBn || (isBn ? 'কোনো বিবরণ দেওয়া হয়নি' : 'No description')}
                          </p>

                          {/* Action Buttons: Edit/Change Image + Delete */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                            <button
                              type="button"
                              onClick={() => handleOpenEditFolder(folder)}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-rose-600" />
                              <span>{isBn ? 'ছবি ও তথ্য এডিট' : 'Edit & Photo'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteFolderClick(folder)}
                              className="p-1.5 px-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer flex items-center gap-1 text-xs font-bold"
                              title="ফোল্ডার ডিলিট করুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>{isBn ? 'ডিলিট' : 'Delete'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Customer Orders */}
        {activeTab === 'orders' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {/* Header info */}
            <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Package className="w-5 h-5 text-rose-600" />
                  <span>{isBn ? 'গ্রাহকদের অর্ডার ও বিকাশ পেমেন্ট ভেরিফিকেশন' : 'Orders & bKash Payment Verification'}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isBn 
                    ? 'বিকাশ/নগদ TrxID মিলিয়ে টাকা আসছে কিনা চেক করে এক ক্লিকে এপ্রুভ করুন বা বাতিল করুন।' 
                    : 'Check incoming bKash/Nagad payments, verify TrxID, and 1-click approve or cancel orders.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold bg-slate-900 text-white px-3 py-1 rounded-full shadow-2xs">
                  {orders.length} {isBn ? 'মোট অর্ডার' : 'Total Orders'}
                </span>
              </div>
            </div>

            {/* Quick Status Toast */}
            {statusToast && (
              <div className="p-3 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-between shadow-md animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  <span>{statusToast}</span>
                </div>
                <button onClick={() => setStatusToast(null)} className="text-emerald-100 hover:text-white px-1 font-mono">✕</button>
              </div>
            )}

            {/* bKash Payment Verification Guide Card */}
            <div className="p-3.5 bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 border border-pink-200 rounded-2xl text-xs space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-2 text-pink-900 font-extrabold text-xs sm:text-sm">
                <Banknote className="w-4 h-4 text-pink-600 shrink-0" />
                <span>{isBn ? '💡 বিকাশ পেমেন্ট চেক ও এপ্রুভ করার নিয়মাবলী:' : '💡 bKash Verification Guide:'}</span>
              </div>
              <p className="text-slate-700 leading-relaxed text-[11px] sm:text-xs">
                {isBn
                  ? 'গ্রাহক বিকাশ সেন্ড মানি করার পর যে "TrxID" ও "বিকাশ নম্বর" পাঠিয়েছেন তা নিচে প্রদর্শিত হচ্ছে। আপনার ফোনে বিকাশ অ্যাপ বা স্টেটমেন্ট চেক করুন। টাকা একাউন্টে যোগ হলে সরাসরি নিচে "টাকা পেয়েছি - এপ্রুভ করুন" বাটনে ক্লিক করলেই গ্রাহকের কাছে অর্ডারটি "এপ্রুভড (Approved)" হয়ে যাবে।'
                  : 'Compare the TrxID and Sender Number below with your bKash statement. If money is received, click "টাকা পেয়েছি - এপ্রুভ করুন" to approve.'}
              </p>
            </div>

            {/* Order Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
              <button
                type="button"
                onClick={() => setOrderFilter('all')}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap ${
                  orderFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {isBn ? `সব অর্ডার (${orders.length})` : `All (${orders.length})`}
              </button>

              <button
                type="button"
                onClick={() => setOrderFilter('pending')}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                  orderFilter === 'pending'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{isBn ? `পেন্ডিং (${orders.filter(o => o.status === 'Pending').length})` : `Pending (${orders.filter(o => o.status === 'Pending').length})`}</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderFilter('bkash')}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                  orderFilter === 'bkash'
                    ? 'bg-pink-600 text-white shadow-xs'
                    : 'bg-pink-50 text-pink-800 border border-pink-200 hover:bg-pink-100'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>{isBn ? `বিকাশ/নগদ (${orders.filter(o => o.paymentMethod === 'bkash' || o.paymentMethod === 'nagad').length})` : `bKash/Nagad (${orders.filter(o => o.paymentMethod === 'bkash' || o.paymentMethod === 'nagad').length})`}</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderFilter('approved')}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                  orderFilter === 'approved'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isBn ? `এপ্রুভড (${orders.filter(o => o.status === 'Approved' || o.status === 'Confirmed').length})` : `Approved (${orders.filter(o => o.status === 'Approved' || o.status === 'Confirmed').length})`}</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderFilter('shipped')}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                  orderFilter === 'shipped'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>{isBn ? `কুরিয়ারে (${orders.filter(o => o.status === 'Shipped').length})` : `Shipped (${orders.filter(o => o.status === 'Shipped').length})`}</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderFilter('cancelled')}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                  orderFilter === 'cancelled'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
                }`}
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>{isBn ? `বাতিল (${orders.filter(o => o.status === 'Cancelled').length})` : `Cancelled (${orders.filter(o => o.status === 'Cancelled').length})`}</span>
              </button>
            </div>

            {/* Orders List Rendering */}
            {(() => {
              const filteredList = orders.filter((ord) => {
                if (orderFilter === 'pending') return ord.status === 'Pending';
                if (orderFilter === 'bkash') return ord.paymentMethod === 'bkash' || ord.paymentMethod === 'nagad';
                if (orderFilter === 'approved') return ord.status === 'Approved' || ord.status === 'Confirmed';
                if (orderFilter === 'shipped') return ord.status === 'Shipped';
                if (orderFilter === 'delivered') return ord.status === 'Delivered';
                if (orderFilter === 'cancelled') return ord.status === 'Cancelled';
                return true;
              });

              if (filteredList.length === 0) {
                return (
                  <div className="py-16 text-center text-slate-400 space-y-2 bg-slate-50 rounded-2xl border border-slate-200">
                    <Package className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
                    <p className="font-bold text-slate-700">{isBn ? 'এই ফিল্টারে কোনো অর্ডার পাওয়া যায়নি' : 'No orders in this filter'}</p>
                    <p className="text-xs text-slate-400">{isBn ? 'অন্য ফিল্টার চেক করুন বা সব অর্ডার দেখুন।' : 'Try switching filters.'}</p>
                  </div>
                );
              }

              return filteredList.map((ord) => {
                const isBkash = ord.paymentMethod === 'bkash';
                const isNagad = ord.paymentMethod === 'nagad';
                const isApproved = ord.status === 'Approved' || ord.status === 'Confirmed';
                const isPending = ord.status === 'Pending';
                const isCancelled = ord.status === 'Cancelled';

                return (
                  <div 
                    key={ord.id} 
                    className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-4 ${
                      isPending 
                        ? 'bg-amber-50/40 border-amber-200 ring-1 ring-amber-300/60 shadow-xs' 
                        : isApproved 
                        ? 'bg-emerald-50/30 border-emerald-200' 
                        : isCancelled 
                        ? 'bg-rose-50/30 border-rose-200 opacity-90' 
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    {/* Top Row: ID, Time, Badge & Dropdown */}
                    <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-slate-200/80 pb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(ord.id);
                            setOrderCopiedText(`ID: ${ord.id}`);
                            setTimeout(() => setOrderCopiedText(null), 1500);
                          }}
                          className="font-mono font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition"
                          title="অর্ডার আইডি কপি করুন"
                        >
                          <Copy className="w-3 h-3 text-slate-400" />
                          <span>{ord.id}</span>
                          {orderCopiedText === `ID: ${ord.id}` && <span className="text-emerald-400 text-[10px]">✓</span>}
                        </button>

                        <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(ord.createdAt).toLocaleDateString()} {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>

                        {/* Status Label Pill */}
                        <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                          isPending 
                            ? 'bg-amber-500 text-white' 
                            : isApproved 
                            ? 'bg-emerald-600 text-white' 
                            : isCancelled 
                            ? 'bg-rose-600 text-white' 
                            : ord.status === 'Shipped' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-purple-600 text-white'
                        }`}>
                          {isPending && <Clock className="w-3 h-3 animate-pulse" />}
                          {isApproved && <CheckCircle2 className="w-3 h-3" />}
                          {isCancelled && <XCircle className="w-3 h-3" />}
                          {ord.status === 'Shipped' && <Truck className="w-3 h-3" />}
                          {ord.status === 'Delivered' && <Check className="w-3 h-3" />}
                          <span>
                            {isPending ? 'পেন্ডিং (অপেক্ষমান)' :
                             isApproved ? 'এপ্রুভড (অনুমোদিত)' :
                             isCancelled ? 'বাতিল (Cancelled)' :
                             ord.status === 'Shipped' ? 'কুরিয়ারে প্রেরিত' : 'ডেলিভার্ড'}
                          </span>
                        </span>
                      </div>

                      {/* Manual Status Override Select */}
                      <div className="flex items-center gap-2">
                        <select
                          value={ord.status}
                          onChange={(e) => {
                            const newStatus = e.target.value as Order['status'];
                            onUpdateOrderStatus(ord.id, newStatus);
                            setStatusToast(`অর্ডার #${ord.id} এর স্ট্যাটাস "${newStatus}" করা হয়েছে`);
                          }}
                          className="text-xs font-bold py-1.5 px-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer shadow-2xs"
                        >
                          <option value="Pending">⏳ Pending (অপেক্ষমান)</option>
                          <option value="Approved">✅ Approved (এপ্রুভড)</option>
                          <option value="Confirmed">✓ Confirmed (নিশ্চিত)</option>
                          <option value="Shipped">🚚 Shipped (কুরিয়ারে)</option>
                          <option value="Delivered">📦 Delivered (ডেলিভার্ড)</option>
                          <option value="Cancelled">❌ Cancelled (বাতিল)</option>
                        </select>

                        {onDeleteOrder && (
                          <button
                            type="button"
                            onClick={() => setOrderToDelete(ord)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                            title="অর্ডারটি মুছুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* PROMINENT PAYMENT & BKASH/NAGAD DETAILS BOX */}
                    <div className={`p-3.5 rounded-xl border ${
                      isBkash 
                        ? 'bg-gradient-to-r from-pink-50 to-rose-50 border-pink-300' 
                        : isNagad 
                        ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-300' 
                        : 'bg-white border-slate-200'
                    }`}>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md text-white ${
                              isBkash ? 'bg-pink-600' : isNagad ? 'bg-orange-600' : 'bg-slate-700'
                            }`}>
                              {ord.paymentMethod.toUpperCase()} {isBkash || isNagad ? 'SEND MONEY' : 'CASH ON DELIVERY'}
                            </span>
                            <span className="text-xs font-black text-rose-800">
                              মোট বিল: {formatPrice(ord.total)}
                            </span>
                          </div>

                          {/* Sender Phone and TrxID for bKash / Nagad */}
                          {(isBkash || isNagad) && (
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs pt-1">
                              {/* Sender Number */}
                              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-pink-200">
                                <Phone className="w-3.5 h-3.5 text-pink-600" />
                                <span className="text-slate-500 font-medium">প্রেরক:</span>
                                <strong className="font-mono text-slate-900">{ord.senderPhone || ord.phone}</strong>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(ord.senderPhone || ord.phone);
                                    setOrderCopiedText(`PHONE: ${ord.id}`);
                                    setTimeout(() => setOrderCopiedText(null), 1500);
                                  }}
                                  className="text-[10px] text-blue-600 hover:underline font-bold ml-1"
                                >
                                  {orderCopiedText === `PHONE: ${ord.id}` ? '✓ কপি!' : 'কপি'}
                                </button>
                                <a
                                  href={`tel:${ord.senderPhone || ord.phone}`}
                                  className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-bold"
                                >
                                  কল
                                </a>
                              </div>

                              {/* TrxID */}
                              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-pink-200">
                                <KeyRound className="w-3.5 h-3.5 text-pink-600" />
                                <span className="text-slate-500 font-medium">TrxID:</span>
                                <strong className="font-mono text-pink-900 bg-pink-100/70 px-1.5 py-0.2 rounded font-black">
                                  {ord.trxId || 'নেই'}
                                </strong>
                                {ord.trxId && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      navigator.clipboard.writeText(ord.trxId || '');
                                      setOrderCopiedText(`TRX: ${ord.id}`);
                                      setTimeout(() => setOrderCopiedText(null), 1500);
                                    }}
                                    className="text-[10px] text-pink-700 hover:underline font-bold ml-1"
                                  >
                                    {orderCopiedText === `TRX: ${ord.id}` ? '✓ কপি!' : 'TrxID কপি'}
                                  </button>
                                )}
                              </div>
                            </div>
                          )}

                          {ord.paymentMethod === 'cod' && (
                            <p className="text-[11px] text-slate-600">
                              ক্যাশ অন ডেলিভারি (পণ্য গ্রাহকের হাতে দিয়ে মোট <strong>{formatPrice(ord.total)}</strong> টাকা আদায় করবেন)
                            </p>
                          )}
                        </div>

                        {/* Payment Verification Hint */}
                        <div className="text-right">
                          {isApproved ? (
                            <div className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs border border-emerald-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{isBn ? 'টাকা ভেরিফাইড ও এপ্রুভড' : 'Payment Verified'}</span>
                            </div>
                          ) : isCancelled ? (
                            <div className="inline-flex items-center gap-1 px-3 py-1 bg-rose-100 text-rose-800 rounded-full font-bold text-xs border border-rose-300">
                              <XCircle className="w-3.5 h-3.5 text-rose-600" />
                              <span>{isBn ? 'অর্ডার বাতিল' : 'Cancelled'}</span>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-900 rounded-full font-bold text-xs border border-amber-300 animate-pulse">
                              <Clock className="w-3.5 h-3.5 text-amber-700" />
                              <span>{isBn ? 'টাকা চেক ও এপ্রুভাল প্রয়োজন' : 'Action Required'}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* ⚡ DIRECT 1-CLICK ACTION BUTTONS FOR STORE OWNER */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200/90 flex flex-wrap items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-700">{isBn ? 'তাত্ক্ষণিক অ্যাকশন:' : 'Instant Action:'}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* 1. APPROVE BUTTON */}
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateOrderStatus(ord.id, 'Approved');
                            setStatusToast(`🎉 অর্ডার #${ord.id} সফলভাবে এপ্রুভ (Approved) করা হয়েছে!`);
                          }}
                          className={`px-4 py-2 rounded-xl font-extrabold text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer ${
                            isApproved
                              ? 'bg-emerald-700 text-white ring-2 ring-emerald-400'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                          <span>{isBn ? 'টাকা পেয়েছি - এপ্রুভ করুন (Approve)' : 'Approve Order'}</span>
                        </button>

                        {/* 2. CANCEL BUTTON */}
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateOrderStatus(ord.id, 'Cancelled');
                            setStatusToast(`অর্ডার #${ord.id} বাতিল (Cancelled) করা হয়েছে।`);
                          }}
                          className={`px-3 py-2 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer ${
                            isCancelled
                              ? 'bg-rose-700 text-white ring-2 ring-rose-400'
                              : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 active:scale-95'
                          }`}
                        >
                          <XCircle className="w-4 h-4 text-rose-500" />
                          <span>{isBn ? 'বাতিল করুন (Cancel)' : 'Cancel Order'}</span>
                        </button>

                        {/* 3. SHIP BUTTON */}
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateOrderStatus(ord.id, 'Shipped');
                            setStatusToast(`অর্ডার #${ord.id} কুরিয়ারে পাঠানো হয়েছে (Shipped)।`);
                          }}
                          className={`px-3 py-2 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer ${
                            ord.status === 'Shipped'
                              ? 'bg-blue-700 text-white'
                              : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 active:scale-95'
                          }`}
                        >
                          <Truck className="w-4 h-4 text-blue-600" />
                          <span>{isBn ? 'কুরিয়ারে পাঠান' : 'Ship'}</span>
                        </button>

                        {/* 4. DELIVERED BUTTON */}
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateOrderStatus(ord.id, 'Delivered');
                            setStatusToast(`অর্ডার #${ord.id} ডেলিভারি সম্পন্ন (Delivered)।`);
                          }}
                          className={`px-3 py-2 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer ${
                            ord.status === 'Delivered'
                              ? 'bg-purple-700 text-white'
                              : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 active:scale-95'
                          }`}
                        >
                          <Check className="w-4 h-4 text-purple-600" />
                          <span>{isBn ? 'ডেলিভার্ড' : 'Delivered'}</span>
                        </button>

                        {/* 5. RESET TO PENDING IF NOT PENDING */}
                        {!isPending && (
                          <button
                            type="button"
                            onClick={() => {
                              onUpdateOrderStatus(ord.id, 'Pending');
                              setStatusToast(`অর্ডার #${ord.id} পুনরায় পেন্ডিং অবস্থায় নেওয়া হয়েছে।`);
                            }}
                            className="px-2.5 py-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 font-bold text-xs transition"
                            title="পুনরায় পেন্ডিং করুন"
                          >
                            <Clock className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Customer Info & Address */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-white p-3 rounded-xl border border-slate-200/80">
                      <div>
                        <p className="text-slate-400 text-[10px] uppercase font-bold">{isBn ? 'গ্রাহকের নাম ও ফোন:' : 'Customer:'}</p>
                        <p className="font-bold text-slate-900 mt-0.5 text-sm">{ord.customerName}</p>
                        <a 
                          href={`tel:${ord.phone}`} 
                          className="text-blue-700 hover:underline flex items-center gap-1 mt-0.5 font-mono font-bold"
                        >
                          <Phone className="w-3 h-3 text-blue-500" />
                          <span>{ord.phone}</span>
                        </a>
                      </div>

                      <div className="sm:col-span-2">
                        <p className="text-slate-400 text-[10px] uppercase font-bold">{isBn ? 'ডেলিভারি ঠিকানা ও নোট:' : 'Delivery Address:'}</p>
                        <p className="text-slate-800 font-bold mt-0.5">
                          {ord.district} {ord.thanaCity ? `(${ord.thanaCity})` : ''}
                        </p>
                        <p className="text-slate-600 text-[11px] mt-0.5">{ord.address}</p>
                        {ord.orderNotes && (
                          <p className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded text-[11px] mt-1 border border-amber-200">
                            নোট: {ord.orderNotes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Items list */}
                    <div className="pt-1 flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-bold text-slate-700">{isBn ? 'অর্ডারকৃত পণ্যসমূহ:' : 'Items:'}</span>
                      {ord.items.map((item, i) => (
                        <span key={i} className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-800 font-medium flex items-center gap-1.5 shadow-2xs">
                          <img src={item.product.image} alt={item.product.nameBn} className="w-5 h-5 rounded object-cover" />
                          <span>{item.product.nameBn}</span>
                          <strong className="text-slate-900 font-bold">x{item.quantity}</strong>
                          {item.selectedSize && <span className="text-[10px] bg-slate-100 px-1 rounded text-slate-600">{item.selectedSize}</span>}
                          {item.selectedColor && <span className="text-[10px] bg-slate-100 px-1 rounded text-slate-600">{item.selectedColor}</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        )}

        {/* Tab 5: Coupons Manager */}
        {activeTab === 'coupons' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs sm:text-sm">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">
                {isBn ? 'কুপন কোড ও প্রমোশন পরিচালনা' : 'Discount Coupons Engine'}
              </h3>
              <p className="text-xs text-slate-500">
                {isBn ? 'নতুন ডিসকাউন্ট কুপন তৈরি করুন বা বিদ্যমান কুপন পরিবর্তন করুন।' : 'Create and manage promotional discount coupons for buyers.'}
              </p>
            </div>

            {/* Add New Coupon Form */}
            <form onSubmit={handleAddNewCoupon} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">{isBn ? 'নতুন কুপন যোগ করুন:' : 'Add New Coupon:'}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                <div>
                  <input
                    type="text"
                    required
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value)}
                    placeholder="কুপন কোড (যেমন: EID26)"
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl uppercase font-mono font-bold"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    required
                    value={newCouponDiscount}
                    onChange={(e) => setNewCouponDiscount(e.target.value)}
                    placeholder="ছাড়ের পরিমাণ (যেমন: 15 বা 100)"
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <select
                    value={newCouponType}
                    onChange={(e) => setNewCouponType(e.target.value as any)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl"
                  >
                    <option value="percentage">শতকরা (% Percentage)</option>
                    <option value="fixed">নির্দিষ্ট টাকা (৳ Fixed BDT)</option>
                  </select>
                </div>
                <div>
                  <input
                    type="number"
                    value={newCouponMinSpend}
                    onChange={(e) => setNewCouponMinSpend(e.target.value)}
                    placeholder="ন্যূনতম খরচ (যেমন: 1000৳)"
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCouponDesc}
                  onChange={(e) => setNewCouponDesc(e.target.value)}
                  placeholder="কুপন বিবরণ (ঐচ্ছিক)"
                  className="flex-1 p-2 bg-white border border-slate-300 rounded-xl"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition cursor-pointer"
                >
                  {isBn ? 'কুপন সেভ করুন' : 'Save Coupon'}
                </button>
              </div>
            </form>

            {/* Existing Coupons List */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-700 text-xs">{isBn ? 'সক্রিয় কুপনসমূহ:' : 'Active Coupons:'}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {coupons.map((c) => (
                  <div key={c.code} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-mono font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        {c.code}
                      </span>
                      <p className="text-xs text-slate-600 font-medium mt-1">{c.description}</p>
                      <p className="text-[11px] text-slate-400">ন্যূনতম খরচ: {formatPrice(c.minSpend)}</p>
                    </div>
                    <button
                      onClick={() => onDeleteCoupon(c.code)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 transition"
                      title="কুপন মুছে ফেলুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Security PIN & Reset */}
        {activeTab === 'settings' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs sm:text-sm">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">
                {isBn ? 'টিম রোলস ও ক্লাউড সিকিউরিটি' : 'Team Roles & Cloud Security'}
              </h3>
              <p className="text-xs text-slate-500">
                {isBn ? 'সরাসরি Supabase থেকে রোল-বেসড অ্যাক্সেস কন্ট্রোল ও টিম মেম্বারদের রোল পরিচালনা করুন।' : 'Manage role-based access control and admin accounts directly in Supabase.'}
              </p>
            </div>

            {/* Current Logged-in Admin Card */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                  {currentAdmin?.fullName?.charAt(0) || 'A'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">{currentAdmin?.fullName}</h4>
                    {currentAdmin?.role === 'super_admin' && (
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-300">
                        👑 সুপার অ্যাডমিন (Super Admin)
                      </span>
                    )}
                    {currentAdmin?.role === 'admin' && (
                      <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full border border-blue-300">
                        🛡️ অ্যাডমিন (Admin)
                      </span>
                    )}
                    {currentAdmin?.role === 'manager' && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                        💼 ম্যানেজার (Manager)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{currentAdmin?.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAdminLogout}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{isBn ? 'লগআউট করুন' : 'Logout'}</span>
              </button>
            </div>

            {/* Super Admin Team Management Panel */}
            {currentAdmin?.role === 'super_admin' ? (
              <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                      <Users className="w-4 h-4 text-rose-600" />
                      <span>{isBn ? 'অ্যাডমিন টিম ও রোলসমূহ (Supabase admin_users):' : 'Admin Team & Roles (Supabase):'}</span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {isBn ? 'সুপার অ্যাডমিন হিসেবে আপনি নতুন অ্যাডমিন বা ম্যানেজার যোগ ও নিষ্ক্রিয় করতে পারেন।' : 'As Super Admin, manage permissions for your team members.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleLoadTeam}
                    disabled={isLoadingTeam}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition cursor-pointer text-xs flex items-center gap-1"
                    title="রিফ্রেশ করুন"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingTeam ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">{isBn ? 'রিফ্রেশ' : 'Refresh'}</span>
                  </button>
                </div>

                {/* Team Members List */}
                <div className="space-y-2">
                  {adminTeam.length === 0 ? (
                    <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-500">
                      {isLoadingTeam ? (isBn ? 'টিম লোড হচ্ছে...' : 'Loading team...') : (isBn ? 'কোনো অ্যাডমিন তালিকা পাওয়া যায়নি। রিফ্রেশ করুন।' : 'No admins found. Click refresh.')}
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                      {adminTeam.map((user) => (
                        <div key={user.id} className="p-3 bg-white flex items-center justify-between flex-wrap gap-2 text-xs">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900">{user.fullName}</span>
                              <span className={`px-2 py-0.2 rounded-full font-bold text-[10px] ${
                                user.role === 'super_admin'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : user.role === 'manager'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-blue-100 text-blue-800 border border-blue-300'
                              }`}>
                                {user.role === 'super_admin' ? 'Super Admin' : user.role === 'manager' ? 'Manager' : 'Admin'}
                              </span>
                              {!user.isActive && (
                                <span className="bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded text-[10px] font-bold">
                                  নিষ্ক্রিয় (Disabled)
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] font-mono text-slate-500">{user.email}</span>
                          </div>

                          {user.id !== currentAdmin.id && (
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleToggleAdminStatus(user)}
                                className={`px-2 py-1 rounded-lg text-[11px] font-semibold border transition cursor-pointer ${
                                  user.isActive
                                    ? 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                                }`}
                              >
                                {user.isActive ? (isBn ? 'নিষ্ক্রিয় করুন' : 'Deactivate') : (isBn ? 'সক্রিয় করুন' : 'Activate')}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteAdmin(user.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                title="মুছে ফেলুন"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add New Team Member Form */}
                <form onSubmit={handleCreateTeamMember} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <h5 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isBn ? 'নতুন অ্যাডমিন বা ম্যানেজার যোগ করুন:' : 'Add New Admin or Manager:'}</span>
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">পূর্ণ নাম:</label>
                      <input
                        type="text"
                        required
                        value={newTeamName}
                        onChange={(e) => setNewTeamName(e.target.value)}
                        placeholder="যেমন: মোঃ সাকিব আহমেদ"
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">লগইন ইমেইল:</label>
                      <input
                        type="email"
                        required
                        value={newTeamEmail}
                        onChange={(e) => setNewTeamEmail(e.target.value)}
                        placeholder="admin@smartshop.com"
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">গোপন পাসওয়ার্ড:</label>
                      <input
                        type="text"
                        required
                        value={newTeamPassword}
                        onChange={(e) => setNewTeamPassword(e.target.value)}
                        placeholder="পাসওয়ার্ড দিন"
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">রোল ও পারমিশন:</label>
                      <select
                        value={newTeamRole}
                        onChange={(e) => setNewTeamRole(e.target.value as AdminRole)}
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                      >
                        <option value="admin">অ্যাডমিন (Admin - কন্টেন্ট, পণ্য ও অর্ডার)</option>
                        <option value="manager">ম্যানেজার (Manager - শুধুমাত্র অর্ডার ও স্টক)</option>
                        <option value="super_admin">সুপার অ্যাডমিন (Super Admin - সম্পূর্ণ ক্ষমতা)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isBn ? 'অ্যাডমিন সংরক্ষণ করুন' : 'Create Admin'}</span>
                    </button>

                    {teamActionMsg && (
                      <span className={`text-xs font-bold ${teamActionMsg.type === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {teamActionMsg.text}
                      </span>
                    )}
                  </div>
                </form>
              </div>
            ) : (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{isBn ? 'টিম মেম্বার পরিচালনা ও রোল পরিবর্তনের ক্ষমতা শুধুমাত্র সুপার অ্যাডমিনের জন্য সংরক্ষিত।' : 'Only Super Admin can manage team members and permissions.'}</span>
              </div>
            )}

            {/* Supabase Cloud Backend Integration Card */}
            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-3 max-w-xl">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-emerald-950 flex items-center gap-1.5 text-xs sm:text-sm">
                  <Database className="w-4 h-4 text-emerald-600" />
                  <span>{isBn ? 'Supabase ক্লাউড ডাটাবেজ ব্যাকএন্ড' : 'Supabase Cloud Database Backend'}</span>
                </h4>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full border border-emerald-300">
                  SmartShop BD
                </span>
              </div>

              <p className="text-xs text-emerald-800 leading-relaxed">
                {isBn 
                  ? 'আপনার স্টোরটি সরাসরি আপনার Supabase ক্লাউড প্রজেক্টের সাথে যুক্ত। গ্রাহকের অর্ডার, পণ্য আপডেট এবং প্রোফাইল তথ্য স্বয়ংক্রিয়ভাবে ক্লাউডে সিঙ্ক হয়।' 
                  : 'Your store is connected directly to your Supabase project. Orders, products, and profiles sync seamlessly to the cloud.'}
              </p>

              <div className="p-2.5 bg-white/90 rounded-xl border border-emerald-200 space-y-1 font-mono text-[11px] text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-sans">Project URL:</span>
                  <span className="text-emerald-700 font-bold select-all truncate ml-2">https://btcgigozmmjapvelqhtf.supabase.co</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-sans">Project ID:</span>
                  <span className="text-slate-800 font-bold select-all">btcgigozmmjapvelqhtf</span>
                </div>
              </div>

              {/* Status Message */}
              {supabaseStatus.message && (
                <div className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  supabaseStatus.connected 
                    ? 'bg-emerald-100/90 text-emerald-800 border border-emerald-300' 
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  <Server className="w-4 h-4 shrink-0" />
                  <span>{supabaseStatus.message}</span>
                </div>
              )}

              {/* Seed Status Message */}
              {supabaseSeedStatus.message && (
                <div className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  supabaseSeedStatus.success 
                    ? 'bg-emerald-100/90 text-emerald-800 border border-emerald-300' 
                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                }`}>
                  {supabaseSeedStatus.success ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <span>{supabaseSeedStatus.message}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCheckSupabase}
                  disabled={supabaseStatus.testing}
                  className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5 active:scale-95"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${supabaseStatus.testing ? 'animate-spin' : ''}`} />
                  <span>{supabaseStatus.testing ? (isBn ? 'চেক হচ্ছে...' : 'Checking...') : (isBn ? 'কানেকশন টেস্ট করুন' : 'Test Connection')}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSeedSupabase}
                  disabled={supabaseSeedStatus.seeding}
                  className="px-3 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5 active:scale-95"
                >
                  <Upload className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{supabaseSeedStatus.seeding ? (isBn ? 'সিঙ্ক হচ্ছে...' : 'Syncing...') : (isBn ? 'সকল পণ্য Supabase-এ পুশ করুন' : 'Push Products to Supabase')}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopySqlSchema}
                  className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 shadow-xs transition cursor-pointer flex items-center gap-1.5 active:scale-95 ml-auto"
                >
                  {copiedSqlSchema ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                  <span>{copiedSqlSchema ? (isBn ? 'কপি হয়েছে!' : 'Copied!') : (isBn ? 'SQL স্কিমা কপি করুন' : 'Copy SQL Schema')}</span>
                </button>
              </div>
            </div>

            {/* Factory Reset */}
            <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-200 space-y-2 max-w-md">
              <h4 className="font-bold text-rose-900 flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-rose-600" />
                <span>{isBn ? 'ডিফল্ট ডাটা রিস্টোর (Factory Reset):' : 'Restore Default Store Data:'}</span>
              </h4>
              <p className="text-xs text-rose-800">
                {isBn 
                  ? 'আপনার সমস্ত পণ্য, ফোল্ডার এবং ব্যানার প্রাথমিক অবস্থায় ফিরিয়ে নিতে চাইলে নিচের বাটনে চাপুন।' 
                  : 'Revert all store items, banners, and folders back to default state.'}
              </p>
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
              >
                {isBn ? 'হ্যাঁ, ডিফল্ট ডাটা রিস্টোর করুন' : 'Reset Everything to Default'}
              </button>
            </div>
          </div>
        )}

      </div>

      {/* 1. PRODUCT DELETE CONFIRMATION MODAL */}
      {productToDelete && (
        <div className="fixed inset-0 z-[70] bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div 
            className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-rose-200 text-center space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Trash2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">
                {isBn ? 'পণ্যটি মুছে ফেলতে চান?' : 'Delete this product?'}
              </h3>
              <div className="mt-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3 text-left">
                <img
                  src={productToDelete.image}
                  alt={productToDelete.nameBn}
                  className="w-12 h-12 rounded-xl object-cover bg-white shrink-0 border border-slate-200"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-extrabold text-xs text-slate-900 truncate">
                    {productToDelete.nameBn || productToDelete.name}
                  </h4>
                  <p className="text-xs text-rose-600 font-black mt-0.5">
                    {formatPrice(productToDelete.price)}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2.5">
                {isBn 
                  ? 'এই পণ্যটি আপনার ওয়েবসাইট এবং অ্যাডমিন প্যানেল থেকে চিরতরে মুছে যাবে।' 
                  : 'This item will be permanently removed from your catalog and website.'}
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                {isBn ? 'না, বাতিল' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  const targetId = productToDelete.id;
                  const targetName = productToDelete.nameBn || productToDelete.name;
                  setProductToDelete(null);
                  if (editingProduct?.id === targetId) {
                    setEditingProduct(null);
                    setIsAddingNewProduct(false);
                  }
                  onDeleteProduct(targetId);
                  setProductToast(isBn ? `"${targetName}" পণ্যটি সফলভাবে ডিলিট করা হয়েছে!` : 'Product deleted successfully!');
                  setTimeout(() => setProductToast(null), 3500);
                }}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-rose-600/30 transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isBn ? 'হ্যাঁ, ডিলিট করুন' : 'Yes, Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. FOLDER DELETE CONFIRMATION MODAL */}
      {folderToDelete && (
        <div className="fixed inset-0 z-[70] bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div 
            className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-rose-200 text-center space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner text-2xl">
              {folderToDelete.icon || '📁'}
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">
                {isBn ? 'ফোল্ডারটি মুছে ফেলতে চান?' : 'Delete this folder?'}
              </h3>
              <p className="text-sm font-bold text-slate-800 mt-1">
                {folderToDelete.nameBn} ({folderToDelete.nameEn})
              </p>
              <p className="text-xs text-slate-500 mt-2">
                {isBn 
                  ? `এই ফোল্ডারে ${products.filter((p) => p.folderId === folderToDelete.id).length}টি পণ্য রয়েছে। আপনি কি নিশ্চিত মুছে ফেলতে চান?` 
                  : `Are you sure? It contains ${products.filter((p) => p.folderId === folderToDelete.id).length} products.`}
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setFolderToDelete(null)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  const id = folderToDelete.id;
                  const name = folderToDelete.nameBn;
                  setFolderToDelete(null);
                  if (onDeleteFolder) {
                    onDeleteFolder(id);
                  }
                  setFolderToast(isBn ? `"${name}" ফোল্ডার মুছে ফেলা হয়েছে!` : 'Folder deleted successfully!');
                  setTimeout(() => setFolderToast(null), 3000);
                }}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-rose-600/30 transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isBn ? 'হ্যাঁ, ডিলিট করুন' : 'Yes, Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. ORDER DELETE CONFIRMATION MODAL */}
      {orderToDelete && (
        <div className="fixed inset-0 z-[70] bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div 
            className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-rose-200 text-center space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Trash2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">
                {isBn ? 'অর্ডারটি মুছে ফেলতে চান?' : 'Delete this order?'}
              </h3>
              <p className="text-xs font-mono font-bold text-slate-800 mt-2 bg-slate-100 py-1.5 px-3 rounded-lg inline-block">
                #{orderToDelete.id}
              </p>
              <p className="text-xs text-slate-600 mt-1">
                {orderToDelete.customerName} • {formatPrice(orderToDelete.total)}
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setOrderToDelete(null)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  const id = orderToDelete.id;
                  setOrderToDelete(null);
                  if (onDeleteOrder) {
                    onDeleteOrder(id);
                  }
                  setStatusToast(isBn ? `অর্ডার #${id} সফলভাবে মুছে ফেলা হয়েছে!` : 'Order deleted successfully!');
                }}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-rose-600/30 transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isBn ? 'হ্যাঁ, মুছুন' : 'Yes, Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. ADMIN USER DELETE CONFIRMATION MODAL */}
      {adminUserToDelete && (
        <div className="fixed inset-0 z-[70] bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div 
            className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-rose-200 text-center space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Trash2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">
                {isBn ? 'অ্যাডমিন অ্যাকাউন্ট মুছে ফেলবেন?' : 'Delete Admin User?'}
              </h3>
              <p className="text-xs text-slate-500 mt-2">
                {isBn ? 'এই ইউজার আর অ্যাডমিন পোর্টালে লগইন করতে পারবেন না।' : 'This user will no longer be able to access the admin portal.'}
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setAdminUserToDelete(null)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteAdmin}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-rose-600/30 transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isBn ? 'হ্যাঁ, মুছুন' : 'Yes, Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. FACTORY RESET CONFIRMATION MODAL */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-[70] bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div 
            className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-rose-200 text-center space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <RotateCcw className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">
                {isBn ? 'ডিফল্ট ডাটা রিস্টোর করবেন?' : 'Restore default data?'}
              </h3>
              <p className="text-xs text-slate-500 mt-2">
                {isBn 
                  ? 'আপনার সমস্ত পণ্য ও কনটেন্ট প্রাথমিক অবস্থায় ফিরে যাবে।' 
                  : 'All products and contents will be reset to defaults.'}
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowResetConfirm(false);
                  onResetAllData();
                  onClose();
                }}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-rose-600/30 transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{isBn ? 'হ্যাঁ, রিস্টোর করুন' : 'Confirm Reset'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
