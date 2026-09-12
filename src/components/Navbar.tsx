import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  MapPin,
  Bell,
  Heart,
  Calendar,
  Layers,
  Search,
  Utensils,
  Mail,
  CheckSquare,
  DollarSign,
  Briefcase,
  Store,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  RefreshCw,
  Scale,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    role,
    setRole,
    activeTab,
    setActiveTab,
    user,
    logoutUser,
    setIsAuthModalOpen,
    setAuthModalMode,
    switchDemoRole,
    notifications,
    markNotificationRead,
    favorites,
    compareVendors,
    userLocation,
    setUserLocation,
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.read && (n.role === role || n.userId === user?.id));

  interface NavItem {
    id: string;
    label: string;
    icon: React.ComponentType<any>;
    badge?: string;
  }

  const customerNavItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: Sparkles },
    { id: 'ai-planner', label: 'AI Planner', icon: Sparkles, badge: 'Smart' },
    { id: 'vendors', label: 'Find Vendors', icon: Search },
    { id: 'packages', label: 'Packages', icon: Layers },
    { id: 'themes', label: 'Themes', icon: Store },
    { id: 'food', label: 'Food Planner', icon: Utensils },
    { id: 'invitations', label: 'Invitations', icon: Mail },
    { id: 'checklist', label: 'Checklist', icon: CheckSquare },
    { id: 'budget', label: 'Budget', icon: DollarSign },
    { id: 'bookings', label: 'My Bookings', icon: Calendar },
  ];

  const dealerNavItems: NavItem[] = [
    { id: 'dealer-leads', label: 'Overview & Leads', icon: Store },
    { id: 'dealer-packages', label: 'My Packages', icon: Layers },
    { id: 'dealer-calendar', label: 'Availability Calendar', icon: CheckSquare },
    { id: 'dealer-profile', label: 'Business Profile', icon: Briefcase },
  ];

  const currentNav = role === 'customer' ? customerNavItems : dealerNavItems;

  const popularLocations = [
    'Chennai, Tamil Nadu',
    'Bangalore, Karnataka',
    'Coimbatore, Tamil Nadu',
    'Hyderabad, Telangana',
    'Madurai, Tamil Nadu',
    'Mumbai, Maharashtra',
    'Delhi NCR',
    'Kochi, Kerala',
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      {/* Top micro bar for Demo Switcher & Quick Location */}
      <div className="bg-stone-900 text-stone-200 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 font-medium text-amber-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Demo Environment Ready
          </span>
          <span className="hidden sm:inline text-stone-400">|</span>
          <span className="hidden md:inline text-stone-300">
            Switch perspective to test Customer booking & Dealer dashboard:
          </span>
          <div className="inline-flex items-center bg-stone-800 p-0.5 rounded-full border border-stone-700">
            <button
              id="nav-switch-customer"
              onClick={() => switchDemoRole('customer')}
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-all ${
                role === 'customer'
                  ? 'bg-amber-500 text-stone-950 font-semibold shadow-xs'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Customer View
            </button>
            <button
              id="nav-switch-dealer"
              onClick={() => switchDemoRole('dealer')}
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-all ${
                role === 'dealer'
                  ? 'bg-amber-500 text-stone-950 font-semibold shadow-xs'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Vendor / Dealer View
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <button
            id="nav-location-selector"
            onClick={() => setIsLocationModalOpen(true)}
            className="flex items-center gap-1.5 text-stone-300 hover:text-amber-300 transition-colors font-medium cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span className="truncate max-w-[140px] sm:max-w-none">{userLocation}</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              id="nav-brand-logo"
              onClick={() => setActiveTab(role === 'customer' ? 'home' : 'dealer-dashboard')}
              className="flex items-center gap-2.5 group text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-400 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-stone-950" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-royal text-xl font-bold tracking-wide text-stone-900 group-hover:text-amber-700 transition-colors">
                    EventEase
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-sm bg-amber-100 text-amber-800 border border-amber-200">
                    {role === 'customer' ? 'Customer' : 'Vendor Portal'}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 font-medium tracking-tight">Plan Everything. Celebrate More.</p>
              </div>
            </button>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {currentNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id || (item.id === 'dealer-leads' && activeTab === 'dealer');
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold tracking-normal transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-50 text-amber-900 border border-amber-200/80 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-700' : 'text-stone-500'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-500 text-stone-950">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right utility actions */}
          <div className="flex items-center gap-2">
            {/* Compare Drawer trigger */}
            {role === 'customer' && compareVendors.length > 0 && (
              <button
                id="nav-compare-btn"
                onClick={() => setActiveTab('compare')}
                className="relative hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200 hover:bg-indigo-100 cursor-pointer transition-colors"
                title="Compare Selected Vendors"
              >
                <Scale className="w-3.5 h-3.5 text-indigo-600" />
                <span>Compare</span>
                <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {compareVendors.length}
                </span>
              </button>
            )}

            {/* Favorites Icon */}
            {role === 'customer' && (
              <button
                id="nav-favorites-btn"
                onClick={() => {
                  setActiveTab('vendors');
                }}
                className="p-2 text-stone-600 hover:text-rose-600 hover:bg-stone-100 rounded-lg relative cursor-pointer"
                title="Saved Favorites"
              >
                <Heart className={`w-5 h-5 ${favorites.length > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
                {favorites.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </button>
            )}

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                id="nav-notifications-btn"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg relative cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white"></span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-stone-200 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-100 mb-2">
                    <span className="font-bold text-sm text-stone-900">Notifications</span>
                    <span className="text-xs text-amber-700 font-medium">
                      {unreadNotifs.length} new alert{unreadNotifs.length === 1 ? '' : 's'}
                    </span>
                  </div>
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationRead(notif.id);
                          if (notif.actionUrl) {
                            setActiveTab(notif.actionUrl);
                            setIsNotifOpen(false);
                          }
                        }}
                        className={`p-2.5 rounded-lg text-xs cursor-pointer transition-colors ${
                          notif.read ? 'bg-stone-50 text-stone-600' : 'bg-amber-50/70 border border-amber-200/50 text-stone-900'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1 mb-1">
                          <span className="font-semibold">{notif.title}</span>
                          <span className="text-[10px] text-stone-400 shrink-0">{notif.date}</span>
                        </div>
                        <p className="text-stone-600 leading-relaxed">{notif.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Account / Profile */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
                <button
                  id="nav-account-btn"
                  onClick={() => setActiveTab('login')}
                  title="Manage Account / Switch User"
                  className="text-right hidden sm:block hover:opacity-80 cursor-pointer"
                >
                  <div className="text-xs font-bold text-stone-900">{user.name}</div>
                  <div className="text-[10px] text-stone-500 capitalize">{role} Account</div>
                </button>
                <button
                  id="nav-logout-btn"
                  onClick={logoutUser}
                  title="Logout"
                  className="p-2 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 pl-2 border-l border-stone-200">
                <button
                  id="nav-login-btn"
                  onClick={() => {
                    setAuthModalMode('login');
                    setActiveTab('login');
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900 cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  id="nav-register-btn"
                  onClick={() => {
                    setAuthModalMode('register');
                    setActiveTab('login');
                  }}
                  className="px-3 py-1.5 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-amber-600 hover:text-stone-950 transition-colors shadow-xs cursor-pointer"
                >
                  Register
                </button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              id="nav-mobile-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-stone-700 hover:bg-stone-100 rounded-lg cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-4 pt-2 pb-4 space-y-1 shadow-lg">
          <div className="text-xs font-bold text-stone-400 uppercase tracking-wider px-3 py-1">
            {role === 'customer' ? 'Customer Navigation' : 'Vendor Navigation'}
          </div>
          {currentNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (item.id === 'dealer-leads' && activeTab === 'dealer');
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-amber-100 text-amber-950 font-semibold' : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-800' : 'text-stone-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-stone-950">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Location Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-600" />
                <h3 className="font-serif text-lg font-bold text-stone-900">Select Event Location</h3>
              </div>
              <button
                onClick={() => setIsLocationModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-stone-600 mb-4">
              We calculate realistic travel distances, travel times, and venue recommendations based on your event city.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              {popularLocations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    setUserLocation(loc);
                    setIsLocationModalOpen(false);
                  }}
                  className={`text-left text-xs p-2.5 rounded-lg border transition-all cursor-pointer ${
                    userLocation === loc
                      ? 'border-amber-500 bg-amber-50 text-amber-950 font-semibold'
                      : 'border-stone-200 hover:border-stone-300 text-stone-700'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Or type custom city..."
                className="flex-1 text-xs border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    setUserLocation(e.currentTarget.value.trim());
                    setIsLocationModalOpen(false);
                  }
                }}
              />
              <button
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                  if (input && input.value.trim()) {
                    setUserLocation(input.value.trim());
                    setIsLocationModalOpen(false);
                  }
                }}
                className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 cursor-pointer"
              >
                Set
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
