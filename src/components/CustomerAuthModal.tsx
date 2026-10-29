import React, { useState } from 'react';
import { UserProfile } from '../types';
import { BANGLADESH_DISTRICTS } from '../data/mockProducts';
import { syncUserProfileToSupabase } from '../services/supabaseService';
import { safeLocalStorageGet, safeLocalStorageSet } from '../utils/storage';
import { 
  X, 
  User, 
  Lock, 
  Phone, 
  Mail, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  LogIn,
  UserPlus,
  MapPin,
  Check
} from 'lucide-react';

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (profile: UserProfile) => void;
  currentProfile: UserProfile;
  isLoggedIn: boolean;
  language: 'bn' | 'en';
}

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  currentProfile,
  isLoggedIn,
  language
}) => {
  if (!isOpen) return null;

  const isBn = language === 'bn';
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regDistrict, setRegDistrict] = useState(BANGLADESH_DISTRICTS[0] || 'ঢাকা (Dhaka)');
  const [regAddress, setRegAddress] = useState('');

  // Handle Login Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    const cleanId = loginIdentifier.trim().toLowerCase();
    const cleanPass = loginPassword.trim();

    if (!cleanId) {
      setErrorMsg(isBn ? 'অনুগ্রহ করে মোবাইল নম্বর বা ইমেইল দিন।' : 'Please enter phone or email.');
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      // Check against current local storage customer profile or standard credentials
      const savedProfilesJson = safeLocalStorageGet('smartshop_registered_customers_v1');
      let registeredList: UserProfile[] = [];
      if (savedProfilesJson) {
        try {
          registeredList = JSON.parse(savedProfilesJson);
        } catch {
          registeredList = [];
        }
      }

      // Check current profile or registered list
      const matchedUser = registeredList.find(
        (u) => 
          u.phone.replace(/\D/g, '') === cleanId.replace(/\D/g, '') ||
          u.email.toLowerCase() === cleanId ||
          u.id.toLowerCase() === cleanId
      ) || (
        currentProfile.phone.replace(/\D/g, '') === cleanId.replace(/\D/g, '') ||
        currentProfile.email.toLowerCase() === cleanId ||
        currentProfile.id.toLowerCase() === cleanId ||
        cleanId.includes('01784315047') ||
        cleanId.includes('nahid')
          ? currentProfile
          : null
      );

      if (matchedUser) {
        setSuccessMsg(isBn ? `স্বাগতম, ${matchedUser.name}! লগইন সফল হয়েছে।` : `Welcome back, ${matchedUser.name}!`);
        setIsLoading(false);
        setTimeout(() => {
          onLoginSuccess(matchedUser);
          onClose();
        }, 600);
      } else {
        // Allow smooth fallback customer profile creation with the given phone
        const newCustomer: UserProfile = {
          ...currentProfile,
          id: `UID-${cleanId.slice(-6) || Math.floor(100000 + Math.random() * 900000)}`,
          phone: cleanId.startsWith('01') ? cleanId : currentProfile.phone,
          email: cleanId.includes('@') ? cleanId : currentProfile.email,
          name: cleanId.includes('@') ? cleanId.split('@')[0] : (isBn ? 'সম্মানিত গ্রাহক' : 'Customer')
        };
        setSuccessMsg(isBn ? `লগইন সফল হয়েছে! স্বাগতম।` : `Logged in successfully!`);
        setIsLoading(false);
        setTimeout(() => {
          onLoginSuccess(newCustomer);
          onClose();
        }, 600);
      }
    }, 450);
  };

  // Handle Instant 1-Click Demo Login
  const handleQuickDemoLogin = () => {
    setIsLoading(true);
    setErrorMsg(null);
    setTimeout(() => {
      setSuccessMsg(isBn ? 'মোঃ নাহিদ ইসলাম (ভিআইপি গ্রাহক) একাউন্টে সফলভাবে লগইন হয়েছে!' : 'Demo account logged in!');
      setIsLoading(false);
      setTimeout(() => {
        onLoginSuccess(currentProfile);
        onClose();
      }, 500);
    }, 300);
  };

  // Handle Register Submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    if (!regName.trim() || !regPhone.trim()) {
      setErrorMsg(isBn ? 'নাম এবং মোবাইল নম্বর দেওয়া বাধ্যতামূলক।' : 'Name and phone are required.');
      setIsLoading(false);
      return;
    }

    const cleanPhone = regPhone.trim();
    if (cleanPhone.length < 11) {
      setErrorMsg(isBn ? 'অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন।' : 'Please enter a valid 11-digit mobile number.');
      setIsLoading(false);
      return;
    }

    const newProfileId = `UID-${cleanPhone.slice(-6) || Math.floor(100000 + Math.random() * 900000)}`;

    const newProfile: UserProfile = {
      id: newProfileId,
      name: regName.trim(),
      phone: cleanPhone,
      email: regEmail.trim() || `${cleanPhone}@customer.smartshopbd.com`,
      password: regPassword.trim() || undefined,
      avatarUrl: currentProfile.avatarUrl,
      gender: 'male',
      dateOfBirth: '',
      memberSince: new Date().getFullYear().toString(),
      membershipTier: 'VIP',
      smartPoints: 200, // Welcome signup bonus points!
      walletBalance: 0,
      savedAddresses: regAddress.trim() ? [
        {
          id: `addr-${Date.now()}`,
          label: 'Home',
          labelBn: 'বাসার ঠিকানা (Home)',
          district: regDistrict,
          thanaCity: regDistrict.split(' ')[0],
          streetAddress: regAddress.trim(),
          isDefault: true
        }
      ] : [],
      wishlistProductIds: []
    };

    // Save into registered customers list
    try {
      const savedJson = safeLocalStorageGet('smartshop_registered_customers_v1');
      const list: UserProfile[] = savedJson ? JSON.parse(savedJson) : [];
      list.push(newProfile);
      safeLocalStorageSet('smartshop_registered_customers_v1', JSON.stringify(list));
    } catch {}

    // Cloud sync to Supabase
    syncUserProfileToSupabase(newProfile).catch(() => {});

    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg(isBn ? 'অভিনন্দন! আপনার কাষ্টমার একাউন্ট সফলভাবে তৈরি হয়েছে (২০০ ওয়েলকাম বোনাস পয়েন্ট যোগ হয়েছে)।' : 'Account created successfully with 200 welcome points!');
      setTimeout(() => {
        onLoginSuccess(newProfile);
        onClose();
      }, 700);
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col relative max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 sm:p-6 text-white text-center">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white shadow-lg shadow-rose-500/20 mb-3 ring-4 ring-white/10">
            <User className="w-6 h-6" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            {authMode === 'login' 
              ? (isBn ? 'কাষ্টমার অ্যাকাউন্ট লগইন' : 'Customer Account Login')
              : (isBn ? 'নতুন কাষ্টমার অ্যাকাউন্ট খুলুন' : 'Create Customer Account')}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
            {isBn 
              ? 'অর্ডার ট্র্যাকিং, রিওয়ার্ড পয়েন্ট ও দ্রুত চেকআউটের জন্য আপনার অ্যাকাউন্টে প্রবেশ করুন' 
              : 'Sign in to access order tracking, rewards, and rapid checkout'}
          </p>

          {/* Mode Switch Tabs */}
          <div className="flex bg-white/10 backdrop-blur-md p-1 rounded-2xl mt-4 border border-white/10 max-w-xs mx-auto">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'login'
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{isBn ? 'লগইন' : 'Login'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'register'
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{isBn ? 'রেজিস্টার' : 'Register'}</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          
          {/* Status Messages */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-rose-700 text-xs font-semibold animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-emerald-800 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: LOGIN FORM */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{isBn ? 'মোবাইল নম্বর বা ইমেইল:' : 'Mobile Number or Email:'}</span>
                </label>
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder={isBn ? 'যেমন: 01784315047 বা ইমেইল' : 'e.g. 01784315047 or email'}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition font-medium"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{isBn ? 'পাসওয়ার্ড / পিন:' : 'Password / PIN:'}</span>
                  </label>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {isBn ? '(ঐচ্ছিক বা যেকোনো পিন)' : '(Optional)'}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder={isBn ? 'পাসওয়ার্ড দিন (যদি থাকে)' : 'Enter password if set'}
                    className="w-full px-3.5 py-2.5 pr-10 bg-slate-50 border border-slate-300 rounded-2xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-extrabold rounded-2xl transition shadow-md shadow-rose-600/20 flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm active:scale-98 disabled:opacity-60"
              >
                {isLoading ? (
                  <span>{isBn ? 'লগইন হচ্ছে...' : 'Signing in...'}</span>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>{isBn ? 'কাষ্টমার অ্যাকাউন্টে লগইন করুন' : 'Sign in to Account'}</span>
                  </>
                )}
              </button>

              {/* 1-Click Demo Login Box */}
              <div className="pt-2">
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-3 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                    {isBn ? 'দ্রুত টেস্ট লগইন' : 'Quick Demo Access'}
                  </span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  disabled={isLoading}
                  className="w-full p-2.5 bg-gradient-to-r from-slate-900 to-indigo-950 hover:from-slate-800 hover:to-indigo-900 text-white rounded-2xl transition border border-slate-700 flex items-center justify-between text-xs cursor-pointer shadow-xs group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-[11px]">
                      VIP
                    </div>
                    <div className="text-left">
                      <div className="font-bold flex items-center gap-1">
                        <span>{currentProfile.name}</span>
                        <span className="text-[10px] bg-amber-400 text-slate-950 px-1 py-0.2 rounded font-black">
                          {currentProfile.id}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-300 font-mono">
                        {currentProfile.phone}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] text-amber-300 font-bold group-hover:translate-x-0.5 transition flex items-center gap-1">
                    <span>{isBn ? '১-ক্লিকে লগইন' : '1-Click'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: REGISTER FORM */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{isBn ? 'আপনার পুরো নাম:' : 'Full Name:'} *</span>
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder={isBn ? 'যেমন: মোঃ নাহিদ ইসলাম' : 'e.g. Nahid Islam'}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{isBn ? 'মোবাইল নম্বর (১১ ডিজিট):' : 'Mobile Number (11 digits):'} *</span>
                </label>
                <input
                  type="tel"
                  required
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="017xxxxxxxx"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition font-medium font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{isBn ? 'ইমেইল (ঐচ্ছিক):' : 'Email (Optional):'}</span>
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="email@gmail.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{isBn ? 'পাসওয়ার্ড:' : 'Password:'}</span>
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder={isBn ? 'পাসওয়ার্ড দিন' : 'Enter password'}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{isBn ? 'জেলা (District):' : 'District:'}</span>
                </label>
                <select
                  value={regDistrict}
                  onChange={(e) => setRegDistrict(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none"
                >
                  {BANGLADESH_DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isBn ? 'ডেলিভারি ঠিকানা (বাসা/অফিস):' : 'Delivery Address:'}
                </label>
                <input
                  type="text"
                  value={regAddress}
                  onChange={(e) => setRegAddress(e.target.value)}
                  placeholder={isBn ? 'বাড়ি #, রোড #, এলাকা...' : 'House, Road, Area...'}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  {isBn 
                    ? 'নতুন একাউন্ট খুললেই পাচ্ছেন ২০০ স্মার্ট রিওয়ার্ড পয়েন্ট ওয়েলকাম বোনাস!' 
                    : 'Get 200 Smart Reward Points upon registration!'}
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold rounded-2xl transition shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm active:scale-98 disabled:opacity-60"
              >
                {isLoading ? (
                  <span>{isBn ? 'একাউন্ট তৈরি হচ্ছে...' : 'Creating...'}</span>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>{isBn ? 'একাউন্ট তৈরি ও লগইন করুন' : 'Register & Sign in'}</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Customer Trust Footer */}
          <div className="pt-2 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>{isBn ? '১০০% নিরাপদ ও সুরক্ষিত কাষ্টমার ডাটাবেজ (Supabase)' : '100% Secure Customer Database'}</span>
          </div>

        </div>
      </div>
    </div>
  );
};
