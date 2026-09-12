import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole, DealerCategory, EventType } from '../types';
import {
  Sparkles,
  Lock,
  Mail,
  Phone,
  User as UserIcon,
  Building2,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  Star,
  Calendar,
  AlertCircle,
  KeyRound,
  RefreshCw,
  LogOut,
  ChevronRight,
  Check,
} from 'lucide-react';

export const LoginPageView: React.FC = () => {
  const { user, loginUser, logoutUser, setActiveTab, setRole, authModalMode, setAuthModalMode } = useApp();

  // Mode: 'login' | 'register'
  const [mode, setMode] = useState<'login' | 'register'>(authModalMode || 'login');
  // Persona: 'customer' | 'dealer'
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  // Auth Method: 'password' | 'otp'
  const [authMethod, setAuthMethod] = useState<'password' | 'otp'>('password');

  // Form Fields - Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Form Fields - OTP
  const [otpPhone, setOtpPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpDevCode, setOtpDevCode] = useState<string | null>(null);

  // Form Fields - Register
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCity, setRegCity] = useState('Chennai, Tamil Nadu');
  const [regEventType, setRegEventType] = useState<EventType>('Marriage / Wedding');
  // Vendor specific register
  const [regBusinessName, setRegBusinessName] = useState('');
  const [regCategory, setRegCategory] = useState<DealerCategory>('Wedding Hall');

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // Demo Accounts
  const [demoAccounts, setDemoAccounts] = useState<any[]>([]);

  useEffect(() => {
    // Sync mode with global context if changed from Navbar
    if (authModalMode) {
      setMode(authModalMode);
    }
  }, [authModalMode]);

  useEffect(() => {
    // Fetch available demo accounts
    fetch('/api/auth/demo-accounts')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.accounts) {
          setDemoAccounts(data.accounts);
        }
      })
      .catch(() => {});
  }, []);

  const clearMessages = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  // Handle Email + Password Login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!loginEmail.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    if (!loginPassword) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail.trim(),
          password: loginPassword,
          role: selectedRole,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(data.message || 'Login successful!');
        loginUser(data.user, data.token);
      } else {
        setErrorMsg(data.message || 'Unable to sign in. Please check your credentials.');
      }
    } catch (err) {
      setErrorMsg('Network error while connecting to EventEase servers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    const digits = otpPhone.replace(/\D/g, '');
    if (digits.length < 10) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: digits }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOtpSent(true);
        setOtpDevCode(data.devOtp || '123456');
        setSuccessMsg(`OTP dispatched to +91 ${digits.slice(-10)}. Test code: ${data.devOtp || '123456'}`);
      } else {
        setErrorMsg(data.message || 'Failed to send OTP.');
      }
    } catch (err) {
      setErrorMsg('Could not send verification OTP. Try password login or universal code 123456.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!otpCode.trim()) {
      setErrorMsg('Please enter the 6-digit OTP code received on your phone.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: otpPhone.trim(),
          otp: otpCode.trim(),
          role: selectedRole,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg('OTP verified successfully!');
        loginUser(data.user, data.token);
      } else {
        setErrorMsg(data.message || 'Invalid or expired OTP code.');
      }
    } catch (err) {
      setErrorMsg('Error verifying OTP code.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!regName.trim()) {
      setErrorMsg('Please enter your full name or couple names.');
      return;
    }
    if (!regEmail.trim()) {
      setErrorMsg('Please provide a valid email address.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (selectedRole === 'dealer' && !regBusinessName.trim()) {
      setErrorMsg('Please enter your business or firm name.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        phone: regPhone.trim() || '+91 98400 00000',
        role: selectedRole,
        location: regCity,
        businessName: selectedRole === 'dealer' ? regBusinessName.trim() : undefined,
        vendorCategory: selectedRole === 'dealer' ? regCategory : undefined,
      };

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(data.message || 'Account successfully created!');
        loginUser(data.user, data.token);
      } else {
        setErrorMsg(data.message || 'Could not complete registration.');
      }
    } catch (err) {
      setErrorMsg('Network error while creating account.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Account Selector
  const fillDemoAccount = (acc: any) => {
    clearMessages();
    setSelectedRole(acc.role);
    setAuthMethod('password');
    setLoginEmail(acc.email);
    setLoginPassword(acc.password);
    setSuccessMsg(`Loaded credentials for ${acc.label}. Click "Sign In to EventEase" below.`);
  };

  // Handle Google One-Click Login
  const handleGoogleLogin = () => {
    clearMessages();
    setLoading(true);
    setTimeout(() => {
      const googleUser = {
        id: `google-${Date.now()}`,
        name: selectedRole === 'customer' ? 'Karthik & Sneha' : 'Grand Banquets Manager',
        email: selectedRole === 'customer' ? 'karthik.sneha@gmail.com' : 'manager@grandbanquets.in',
        role: selectedRole,
        phone: '+91 98400 55667',
        location: 'Chennai, Tamil Nadu',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        businessName: selectedRole === 'dealer' ? 'Grand Banquets & Convention' : undefined,
      };
      loginUser(googleUser, `token_google_${Date.now()}`);
      setLoading(false);
    }, 600);
  };

  // Handle Forgot Password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });
      setForgotSubmitted(true);
    } catch {
      setForgotSubmitted(true);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-[#faf8f5] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-5xl mx-auto w-full">
        {/* Already Logged-in Banner if authenticated */}
        {user && (
          <div className="mb-8 bg-white border border-amber-200/80 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-left">
              <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-900 font-serif font-bold text-lg">
                {user.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-500">Currently signed in as</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 uppercase">
                    {user.role}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-stone-900 text-base">{user.name}</h3>
                <p className="text-xs text-stone-500">{user.email} • {user.location}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                id="btn-continue-dashboard"
                onClick={() => setActiveTab(user.role === 'dealer' ? 'dealer' : 'home')}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <span>Go to {user.role === 'dealer' ? 'Vendor Portal' : 'My Event Dashboard'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                id="btn-logout-current"
                onClick={logoutUser}
                className="px-3 py-2 border border-stone-200 hover:bg-rose-50 hover:border-rose-200 text-stone-700 hover:text-rose-700 text-xs font-semibold rounded-xl cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Switch Account / Sign Out</span>
              </button>
            </div>
          </div>
        )}

        {/* Main Auth Split Container */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left / Main Column: Login & Register Forms */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
            <div>
              {/* Header with Brand Icon */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-stone-950 font-bold shadow-xs">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h1 className="font-serif text-xl font-bold text-stone-900">EventEase</h1>
                    <p className="text-[11px] text-stone-500">Plan Everything. Celebrate More.</p>
                  </div>
                </div>

                {/* Mode Switcher pill */}
                <div className="bg-stone-100 p-1 rounded-xl flex items-center">
                  <button
                    id="tab-mode-login"
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setAuthModalMode('login');
                      clearMessages();
                    }}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      mode === 'login' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    id="tab-mode-register"
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setAuthModalMode('register');
                      clearMessages();
                    }}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      mode === 'register' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    Register
                  </button>
                </div>
              </div>

              {/* Title & Prompt */}
              <div className="mb-6">
                <h2 className="font-serif text-2xl font-bold text-stone-900">
                  {mode === 'login' ? 'Welcome back to EventEase' : 'Create your EventEase account'}
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  {mode === 'login'
                    ? 'Access your saved blueprints, confirmed vendor quotes, and celebration checklists.'
                    : 'Start planning your dream celebration or list your venue and services to verified families.'}
                </p>
              </div>

              {/* Account Persona Selector (Customer vs Partner/Dealer) */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    id="persona-customer-btn"
                    type="button"
                    onClick={() => {
                      setSelectedRole('customer');
                      clearMessages();
                    }}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                      selectedRole === 'customer'
                        ? 'border-amber-500 bg-amber-50/60 ring-1 ring-amber-500'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                        <UserIcon className="w-3.5 h-3.5 text-amber-700" />
                        Customer / Family
                      </span>
                      {selectedRole === 'customer' && (
                        <Check className="w-3.5 h-3.5 text-amber-700 stroke-[3]" />
                      )}
                    </div>
                    <p className="text-[11px] text-stone-500 leading-snug">
                      For couples & families planning weddings, receptions, & parties.
                    </p>
                  </button>

                  <button
                    id="persona-vendor-btn"
                    type="button"
                    onClick={() => {
                      setSelectedRole('dealer');
                      clearMessages();
                    }}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                      selectedRole === 'dealer'
                        ? 'border-amber-500 bg-amber-50/60 ring-1 ring-amber-500'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-amber-700" />
                        Vendor / Partner
                      </span>
                      {selectedRole === 'dealer' && (
                        <Check className="w-3.5 h-3.5 text-amber-700 stroke-[3]" />
                      )}
                    </div>
                    <p className="text-[11px] text-stone-500 leading-snug">
                      For halls, caterers, decorators, photographers & event pros.
                    </p>
                  </button>
                </div>
              </div>

              {/* Feedback Alerts */}
              {errorMsg && (
                <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1">{errorMsg}</div>
                </div>
              )}

              {successMsg && (
                <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="flex-1">{successMsg}</div>
                </div>
              )}

              {/* MODE: SIGN IN */}
              {mode === 'login' && (
                <div className="space-y-4">
                  {/* Method toggle: Password vs Mobile OTP */}
                  <div className="flex border-b border-stone-200 mb-2">
                    <button
                      id="method-password-tab"
                      type="button"
                      onClick={() => {
                        setAuthMethod('password');
                        clearMessages();
                      }}
                      className={`pb-2 text-xs font-bold mr-6 cursor-pointer transition-colors relative ${
                        authMethod === 'password'
                          ? 'text-stone-900 border-b-2 border-amber-600'
                          : 'text-stone-400 hover:text-stone-600'
                      }`}
                    >
                      Email & Password
                    </button>
                    <button
                      id="method-otp-tab"
                      type="button"
                      onClick={() => {
                        setAuthMethod('otp');
                        clearMessages();
                      }}
                      className={`pb-2 text-xs font-bold cursor-pointer transition-colors relative ${
                        authMethod === 'otp'
                          ? 'text-stone-900 border-b-2 border-amber-600'
                          : 'text-stone-400 hover:text-stone-600'
                      }`}
                    >
                      Instant Mobile OTP
                    </button>
                  </div>

                  {/* SUB-TAB: PASSWORD LOGIN */}
                  {authMethod === 'password' && (
                    <form onSubmit={handlePasswordLogin} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          {selectedRole === 'dealer' ? 'Business / Official Email' : 'Email Address'}
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                          <input
                            id="input-login-email"
                            type="email"
                            required
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            placeholder={selectedRole === 'dealer' ? 'manager@grandpalace.com' : 'priya.karthik@gmail.com'}
                            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-semibold text-stone-700">Password</label>
                          <button
                            type="button"
                            onClick={() => setShowForgotModal(true)}
                            className="text-[11px] font-semibold text-amber-700 hover:text-amber-800 cursor-pointer"
                          >
                            Forgot password?
                          </button>
                        </div>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                          <input
                            id="input-login-password"
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-9 pr-10 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600 cursor-pointer"
                            tabIndex={-1}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <label className="flex items-center gap-2 text-stone-600 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                          />
                          <span>Remember me for 30 days</span>
                        </label>
                      </div>

                      <button
                        id="btn-submit-password-login"
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 active:scale-[0.99] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {loading ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Signing In...</span>
                          </>
                        ) : (
                          <>
                            <span>Sign In to EventEase</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </form>
                  )}

                  {/* SUB-TAB: MOBILE OTP LOGIN */}
                  {authMethod === 'otp' && (
                    <div className="space-y-4">
                      {!otpSent ? (
                        <form onSubmit={handleSendOtp} className="space-y-4">
                          <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                              Mobile Number (India)
                            </label>
                            <div className="flex gap-2">
                              <span className="px-3 py-2 bg-stone-100 border border-stone-300 rounded-xl text-xs font-bold text-stone-700 flex items-center">
                                +91
                              </span>
                              <div className="relative flex-1">
                                <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                                <input
                                  id="input-otp-phone"
                                  type="tel"
                                  maxLength={10}
                                  required
                                  value={otpPhone}
                                  onChange={(e) => setOtpPhone(e.target.value.replace(/\D/g, ''))}
                                  placeholder="98400 11223"
                                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                                />
                              </div>
                            </div>
                            <p className="text-[11px] text-stone-500 mt-1">
                              We'll send a 6-digit verification code via SMS to this number.
                            </p>
                          </div>

                          <button
                            id="btn-send-otp"
                            type="submit"
                            disabled={loading || otpPhone.length < 10}
                            className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                          >
                            {loading ? 'Sending Code...' : 'Get Verification Code'}
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </form>
                      ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-4">
                          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs">
                            <span className="text-stone-700">Code sent to <strong>+91 {otpPhone}</strong></span>
                            <button
                              type="button"
                              onClick={() => {
                                setOtpSent(false);
                                setOtpCode('');
                              }}
                              className="text-amber-800 font-bold hover:underline"
                            >
                              Change
                            </button>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-xs font-semibold text-stone-700">Enter 6-Digit OTP</label>
                              {otpDevCode && (
                                <button
                                  type="button"
                                  onClick={() => setOtpCode(otpDevCode)}
                                  className="text-[10px] font-bold text-emerald-700 hover:underline bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200"
                                >
                                  Auto-fill {otpDevCode}
                                </button>
                              )}
                            </div>
                            <div className="relative">
                              <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                              <input
                                id="input-otp-code"
                                type="text"
                                maxLength={6}
                                required
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                                placeholder="e.g. 123456"
                                className="w-full pl-9 pr-3 py-2 text-sm tracking-widest font-mono rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-center"
                              />
                            </div>
                            <p className="text-[11px] text-stone-500 mt-1">
                              Tip: You can enter <strong>123456</strong> or click auto-fill.
                            </p>
                          </div>

                          <button
                            id="btn-verify-otp"
                            type="submit"
                            disabled={loading || otpCode.length < 6}
                            className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                          >
                            {loading ? 'Verifying...' : 'Verify OTP & Sign In'}
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        </form>
                      )}
                    </div>
                  )}

                  {/* Social & Alternate Login */}
                  <div className="pt-3 border-t border-stone-200 space-y-3">
                    <button
                      id="btn-google-login"
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={loading}
                      className="w-full py-2 px-3 border border-stone-300 hover:bg-stone-50 rounded-xl text-xs font-semibold text-stone-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span>Continue with Google</span>
                    </button>
                  </div>

                  {/* One-Click Quick Test Accounts */}
                  <div className="pt-4 border-t border-stone-200">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
                      Instant One-Click Demo Profiles
                    </span>
                    <div className="space-y-1.5">
                      {demoAccounts.map((acc, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => fillDemoAccount(acc)}
                          className="w-full p-2 bg-stone-50 hover:bg-amber-50/60 border border-stone-200 hover:border-amber-300 rounded-xl text-left transition-colors flex items-center justify-between cursor-pointer group"
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-stone-900 group-hover:text-amber-900">
                                {acc.label}
                              </span>
                              <span className="text-[9px] px-1 py-0.2 rounded bg-stone-200 text-stone-700 capitalize font-medium">
                                {acc.role}
                              </span>
                            </div>
                            <div className="text-[10px] text-stone-500">{acc.description}</div>
                          </div>
                          <span className="text-[10px] font-semibold text-amber-700 underline group-hover:no-underline">
                            Fill
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* MODE: REGISTER (CREATE ACCOUNT) */}
              {mode === 'register' && (
                <form onSubmit={handleRegister} className="space-y-3.5">
                  {selectedRole === 'customer' ? (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Full Name or Couple Names
                        </label>
                        <div className="relative">
                          <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                          <input
                            id="reg-customer-name"
                            type="text"
                            required
                            value={regName}
                            onChange={(e) => setRegName(e.target.value)}
                            placeholder="e.g. Priya & Karthik"
                            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
                          <input
                            id="reg-customer-email"
                            type="email"
                            required
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            placeholder="priya@example.com"
                            className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-stone-700 mb-1">Mobile Number</label>
                          <input
                            id="reg-customer-phone"
                            type="tel"
                            value={regPhone}
                            onChange={(e) => setRegPhone(e.target.value)}
                            placeholder="+91 98400 11223"
                            className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-stone-700 mb-1">Upcoming Celebration</label>
                          <select
                            value={regEventType}
                            onChange={(e) => setRegEventType(e.target.value as EventType)}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                          >
                            <option value="Marriage / Wedding">Marriage / Kalyanam</option>
                            <option value="Reception">Grand Reception</option>
                            <option value="Engagement">Engagement (Nichayathartham)</option>
                            <option value="Baby Shower">Baby Shower (Valaikappu)</option>
                            <option value="Birthday">Birthday & Milestone</option>
                            <option value="Housewarming">Housewarming (Grihapravesam)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-stone-700 mb-1">City / Region</label>
                          <input
                            type="text"
                            value={regCity}
                            onChange={(e) => setRegCity(e.target.value)}
                            placeholder="Chennai, Tamil Nadu"
                            className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    /* PARTNER / DEALER REGISTRATION */
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Business / Firm Name
                        </label>
                        <div className="relative">
                          <Building2 className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                          <input
                            id="reg-dealer-business"
                            type="text"
                            required
                            value={regBusinessName}
                            onChange={(e) => setRegBusinessName(e.target.value)}
                            placeholder="e.g. Sri Venkateswara Grand Palace"
                            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-stone-700 mb-1">Contact Person</label>
                          <input
                            type="text"
                            required
                            value={regName}
                            onChange={(e) => setRegName(e.target.value)}
                            placeholder="Venkatesh Ramanathan"
                            className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-stone-700 mb-1">Primary Category</label>
                          <select
                            value={regCategory}
                            onChange={(e) => setRegCategory(e.target.value as DealerCategory)}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                          >
                            <option value="Function Hall">Function Hall / Mandapam</option>
                            <option value="Caterer">Caterer & Banquets</option>
                            <option value="Decorator">Floral & Stage Decorator</option>
                            <option value="Photographer">Candid & Cinematic Photography</option>
                            <option value="Makeup Artist">Bridal Hair & Makeup</option>
                            <option value="DJ / Sound System">DJ, Light & Sound</option>
                            <option value="Florist">Traditional Florist</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-stone-700 mb-1">Official Email</label>
                          <input
                            type="email"
                            required
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            placeholder="manager@venue.com"
                            className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-stone-700 mb-1">WhatsApp / Contact Phone</label>
                          <input
                            type="tel"
                            value={regPhone}
                            onChange={(e) => setRegPhone(e.target.value)}
                            placeholder="+91 98401 22345"
                            className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">City / Location</label>
                        <input
                          type="text"
                          value={regCity}
                          onChange={(e) => setRegCity(e.target.value)}
                          placeholder="Anna Nagar, Chennai"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Set Password (minimum 6 characters)
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                      <input
                        id="reg-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-10 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600 cursor-pointer"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-stone-500">
                    By registering, you agree to EventEase's Terms of Service, Privacy Policy, and verified vendor review standards.
                  </p>

                  <button
                    id="btn-submit-register"
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <span>Complete Registration</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Footer switcher link */}
            <div className="pt-6 border-t border-stone-100 text-center text-xs text-stone-500">
              {mode === 'login' ? (
                <>
                  Don't have an EventEase account yet?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setAuthModalMode('register');
                      clearMessages();
                    }}
                    className="font-bold text-amber-700 hover:text-amber-800 cursor-pointer"
                  >
                    Create Free Account
                  </button>
                </>
              ) : (
                <>
                  Already registered on EventEase?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setAuthModalMode('login');
                      clearMessages();
                    }}
                    className="font-bold text-amber-700 hover:text-amber-800 cursor-pointer"
                  >
                    Sign In instead
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Editorial Showcase & Social Proof */}
          <div className="lg:col-span-5 bg-gradient-to-br from-stone-900 via-stone-850 to-stone-950 text-white p-8 sm:p-10 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-stone-800">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-[11px] font-bold tracking-wide uppercase mb-6">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Event Ecosystem</span>
              </div>

              <h3 className="font-serif text-2xl font-bold text-white leading-snug mb-3">
                Plan everything with total peace of mind
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed mb-8">
                Join over 12,500+ couples, families, and certified service partners celebrating weddings, engagements, and milestone occasions across South India.
              </p>

              {/* 3 Value Pillars */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-100">Gemini AI Event Blueprints</h4>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      Hour-by-hour ceremonial itineraries, exact guest count budgets, and customized feast menus.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-100">100% In-Person Verified Vendors</h4>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      Every convention hall, caterer, and photographer is physically vetted for capacity and transparent pricing.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-100">Direct Digital Contracts & Quotes</h4>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      No surprise fees or lost diary notes. Receive clear itemized quotations with milestone tracking.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial Quote */}
            <div className="pt-6 border-t border-stone-800">
              <div className="flex items-center gap-1 text-amber-400 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <blockquote className="text-xs text-stone-300 italic leading-relaxed mb-3">
                "EventEase saved our family at least 3 weeks of running around Chennai. We finalized our hall, decor, and feast caterer in 48 hours with clear quotations."
              </blockquote>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-stone-700 flex items-center justify-center text-xs font-bold text-stone-200">
                  K
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-200">Kavya & Sundar</div>
                  <div className="text-[10px] text-stone-400">Wedding Celebration, Anna Nagar</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-stone-200 shadow-xl">
            <h3 className="font-serif font-bold text-lg text-stone-900 mb-1">Reset Account Password</h3>
            <p className="text-xs text-stone-500 mb-4">
              Enter your registered email address and we will dispatch password recovery instructions.
            </p>

            {forgotSubmitted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-2">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Reset link dispatched!</span>
                </div>
                <p>
                  Instructions have been sent to <strong>{forgotEmail}</strong>. You can also log in immediately using the one-click demo profiles.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSubmitted(false);
                  }}
                  className="mt-3 w-full py-2 bg-stone-900 text-white rounded-xl font-bold text-xs cursor-pointer"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="your-email@example.com"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 border border-stone-300 text-stone-700 rounded-xl text-xs font-semibold hover:bg-stone-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
