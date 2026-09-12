import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  CustomerEvent,
  Vendor,
  Booking,
  ChecklistTask,
  NotificationItem,
  AIEventPlan,
} from '../types';
import { DEMO_CUSTOMER_EVENT, INITIAL_CHECKLIST_TEMPLATES } from '../data/sampleVendors';

interface AppContextType {
  user: User | null;
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeEvent: CustomerEvent;
  setActiveEvent: (event: CustomerEvent) => void;
  allEvents: CustomerEvent[];
  updateEvent: (event: CustomerEvent) => Promise<void>;
  vendors: Vendor[];
  refreshVendors: (params?: Record<string, string>) => Promise<void>;
  selectedVendor: Vendor | null;
  setSelectedVendor: (v: Vendor | null) => void;
  compareVendors: Vendor[];
  addToCompare: (v: Vendor) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  favorites: string[];
  toggleFavorite: (vendorId: string) => void;
  bookings: Booking[];
  refreshBookings: () => Promise<void>;
  createBooking: (bookingData: Partial<Booking>) => Promise<boolean>;
  updateBookingStatus: (id: string, status: Booking['status'], quote?: number, notes?: string) => Promise<void>;
  checklist: ChecklistTask[];
  updateChecklistTask: (task: ChecklistTask) => Promise<void>;
  addChecklistTask: (task: Partial<ChecklistTask>) => Promise<void>;
  activeAIPlan: AIEventPlan | null;
  setActiveAIPlan: (plan: AIEventPlan | null) => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
  loginUser: (user: User, token?: string) => void;
  logoutUser: () => void;
  switchDemoRole: (role: UserRole) => void;
  userLocation: string;
  setUserLocation: (loc: string) => void;
  addVendorReview: (vendorId: string, review: any) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(() => {
    try {
      const savedUser = localStorage.getItem('eventease_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        return parsed.role || 'customer';
      }
    } catch {}
    return 'customer';
  });
  const [activeTab, setActiveTab] = useState<string>('home');
  const [userLocation, setUserLocation] = useState<string>('Chennai, Tamil Nadu');

  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('eventease_user');
      if (savedUser) {
        return JSON.parse(savedUser);
      }
    } catch {}
    return {
      id: 'cust-demo-1',
      name: 'Priya & Karthik',
      email: 'priya.karthik@gmail.com',
      role: 'customer',
      phone: '+91 98400 11223',
      location: 'Chennai, Tamil Nadu',
    };
  });

  const [activeEvent, setActiveEvent] = useState<CustomerEvent>(DEMO_CUSTOMER_EVENT);
  const [allEvents, setAllEvents] = useState<CustomerEvent[]>([DEMO_CUSTOMER_EVENT]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [compareVendors, setCompareVendors] = useState<Vendor[]>([]);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('eventease_favorites');
      return saved ? JSON.parse(saved) : ['ven-1', 'ven-3'];
    } catch {
      return ['ven-1', 'ven-3'];
    }
  });

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [checklist, setChecklist] = useState<ChecklistTask[]>(INITIAL_CHECKLIST_TEMPLATES.default);
  const [activeAIPlan, setActiveAIPlan] = useState<AIEventPlan | null>(null);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      userId: 'cust-demo-1',
      role: 'customer',
      title: 'Booking Accepted! 🎉',
      message: 'Sri Venkateswara Grand Palace accepted your booking request for 20 Dec 2026.',
      type: 'booking',
      date: '2 hours ago',
      read: false,
      actionUrl: 'bookings',
    },
    {
      id: 'notif-2',
      userId: 'cust-demo-1',
      role: 'customer',
      title: 'Checklist Reminder ⏰',
      message: 'Time to finalize your Catering Menu & taste samples with family.',
      type: 'reminder',
      date: '1 day ago',
      read: false,
      actionUrl: 'checklist',
    },
    {
      id: 'notif-3',
      userId: 'ven-1',
      role: 'dealer',
      title: 'New Booking Request 📥',
      message: 'New enquiry received from Priya & Karthik for Muhurtham Package.',
      type: 'booking',
      date: 'Just now',
      read: false,
      actionUrl: 'dealer-dashboard',
    },
  ]);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Load vendors from API
  const refreshVendors = async (params: Record<string, string> = {}) => {
    try {
      const searchParams = new URLSearchParams({
        location: userLocation,
        ...params,
      });
      const res = await fetch(`/api/vendors?${searchParams.toString()}`);
      const data = await res.json();
      if (data.success && data.vendors) {
        setVendors(data.vendors);
      }
    } catch (err) {
      console.error('Failed to load vendors', err);
    }
  };

  // Load bookings
  const refreshBookings = async () => {
    try {
      const param = role === 'dealer' && user?.vendorId ? `vendorId=${user.vendorId}` : `customerId=${user?.id || 'cust-demo-1'}`;
      const res = await fetch(`/api/bookings?${param}`);
      const data = await res.json();
      if (data.success && data.bookings) {
        setBookings(data.bookings);
      }
    } catch (err) {
      console.error('Failed to load bookings', err);
    }
  };

  // Load checklist
  const refreshChecklist = async (eventId: string) => {
    try {
      const res = await fetch(`/api/checklists/${eventId}`);
      const data = await res.json();
      if (data.success && data.checklist) {
        setChecklist(data.checklist);
      }
    } catch (err) {
      console.error('Failed to load checklist', err);
    }
  };

  useEffect(() => {
    refreshVendors();
    refreshBookings();
    refreshChecklist(activeEvent.id);
  }, [userLocation]);

  useEffect(() => {
    try {
      localStorage.setItem('eventease_favorites', JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  const toggleFavorite = (vendorId: string) => {
    setFavorites((prev) =>
      prev.includes(vendorId) ? prev.filter((id) => id !== vendorId) : [...prev, vendorId]
    );
  };

  const addToCompare = (v: Vendor) => {
    if (compareVendors.find((item) => item.id === v.id)) return;
    if (compareVendors.length >= 3) {
      alert('You can compare a maximum of 3 vendors at a time.');
      return;
    }
    setCompareVendors((prev) => [...prev, v]);
  };

  const removeFromCompare = (id: string) => {
    setCompareVendors((prev) => prev.filter((v) => v.id !== id));
  };

  const clearCompare = () => {
    setCompareVendors([]);
  };

  const updateEvent = async (event: CustomerEvent) => {
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });
      const data = await res.json();
      if (data.success) {
        setActiveEvent(data.event);
        setAllEvents((prev) => {
          const idx = prev.findIndex((e) => e.id === data.event.id);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = data.event;
            return next;
          }
          return [data.event, ...prev];
        });
      }
    } catch (err) {
      console.error('Failed to update event', err);
    }
  };

  const createBooking = async (bookingData: Partial<Booking>): Promise<boolean> => {
    try {
      const payload: Partial<Booking> = {
        eventId: activeEvent.id,
        eventTitle: activeEvent.title,
        customerId: user?.id || 'cust-demo-1',
        customerName: user?.name || 'Priya & Karthik',
        customerPhone: user?.phone || '+91 98400 11223',
        customerEmail: user?.email || 'customer@eventease.com',
        ...bookingData,
      };
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setBookings((prev) => [data.booking, ...prev]);
        setNotifications((prev) => [
          {
            id: `notif-${Date.now()}`,
            userId: user?.id || 'cust-demo-1',
            role: 'customer',
            title: 'Booking Request Submitted 📋',
            message: `Your booking request for ${data.booking.vendorName} has been sent to the vendor.`,
            type: 'booking',
            date: 'Just now',
            read: false,
          },
          ...prev,
        ]);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to create booking', err);
      return false;
    }
  };

  const updateBookingStatus = async (id: string, status: Booking['status'], quote?: number, notes?: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, quoteAmount: quote, notes }),
      });
      const data = await res.json();
      if (data.success) {
        setBookings((prev) => prev.map((b) => (b.id === id ? data.booking : b)));
      }
    } catch (err) {
      console.error('Failed to update booking status', err);
    }
  };

  const updateChecklistTask = async (task: ChecklistTask) => {
    try {
      const res = await fetch(`/api/checklists/${activeEvent.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      const data = await res.json();
      if (data.success) {
        setChecklist(data.checklist);
      }
    } catch (err) {
      console.error('Failed to update checklist task', err);
    }
  };

  const addChecklistTask = async (task: Partial<ChecklistTask>) => {
    try {
      const fullTask: ChecklistTask = {
        id: `chk-${Date.now()}`,
        eventId: activeEvent.id,
        timeframe: task.timeframe || '1 Month Before',
        title: task.title || 'New Checklist Item',
        description: task.description || '',
        status: task.status || 'Pending',
        category: task.category || 'General',
      };
      await updateChecklistTask(fullTask);
    } catch (err) {
      console.error('Failed to add checklist task', err);
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const loginUser = (newUser: User, token?: string) => {
    setUser(newUser);
    setRole(newUser.role);
    try {
      localStorage.setItem('eventease_user', JSON.stringify(newUser));
      if (token) {
        localStorage.setItem('eventease_token', token);
      }
    } catch {}
    if (newUser.role === 'dealer') {
      setActiveTab('dealer');
    } else {
      setActiveTab('home');
    }
  };

  const logoutUser = () => {
    setUser(null);
    try {
      localStorage.removeItem('eventease_user');
      localStorage.removeItem('eventease_token');
    } catch {}
    setRole('customer');
    setActiveTab('login');
  };

  const switchDemoRole = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'dealer') {
      const demoDealer: User = {
        id: 'dealer-demo-1',
        name: 'Venkatesh Ramanathan',
        businessName: 'Sri Venkateswara Grand Palace & Convention',
        vendorId: 'ven-1',
        email: 'manager@grandpalace.com',
        role: 'dealer',
        phone: '+91 98401 22345',
        location: 'Anna Nagar, Chennai',
      };
      setUser(demoDealer);
      try {
        localStorage.setItem('eventease_user', JSON.stringify(demoDealer));
      } catch {}
      setActiveTab('dealer');
    } else {
      const demoCustomer: User = {
        id: 'cust-demo-1',
        name: 'Priya & Karthik',
        email: 'priya.karthik@gmail.com',
        role: 'customer',
        phone: '+91 98400 11223',
        location: 'Chennai, Tamil Nadu',
      };
      setUser(demoCustomer);
      try {
        localStorage.setItem('eventease_user', JSON.stringify(demoCustomer));
      } catch {}
      setActiveTab('home');
    }
  };

  const addVendorReview = async (vendorId: string, review: any) => {
    try {
      const res = await fetch(`/api/vendors/${vendorId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review),
      });
      const data = await res.json();
      if (data.success) {
        refreshVendors();
        if (selectedVendor && selectedVendor.id === vendorId) {
          setSelectedVendor(data.vendor);
        }
      }
    } catch (err) {
      console.error('Failed to post review', err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        role,
        setRole,
        activeTab,
        setActiveTab,
        activeEvent,
        setActiveEvent,
        allEvents,
        updateEvent,
        vendors,
        refreshVendors,
        selectedVendor,
        setSelectedVendor,
        compareVendors,
        addToCompare,
        removeFromCompare,
        clearCompare,
        favorites,
        toggleFavorite,
        bookings,
        refreshBookings,
        createBooking,
        updateBookingStatus,
        checklist,
        updateChecklistTask,
        addChecklistTask,
        activeAIPlan,
        setActiveAIPlan,
        notifications,
        markNotificationRead,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        loginUser,
        logoutUser,
        switchDemoRole,
        userLocation,
        setUserLocation,
        addVendorReview,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
