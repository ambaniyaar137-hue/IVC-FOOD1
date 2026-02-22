
import React, { useState, useEffect, createContext, useContext, useCallback, useRef } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { Routes, Route, Navigate } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { RestaurantDetail } from './pages/RestaurantDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Orders } from './pages/Orders';
import { OrderTracking } from './pages/OrderTracking';
import { Profile } from './pages/Profile';
import { FavoriteFoods } from './pages/FavoriteFoods';
import { SavedLocations } from './pages/SavedLocations';
import { AccountDetails } from './pages/AccountDetails';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { HelpSupport } from './pages/HelpSupport';
import { Wallet } from './pages/Wallet';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Welcome } from './pages/Welcome';
import { Search } from './pages/Search';
import { QRScanner } from './pages/QRScanner';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { Notifications } from './pages/Notifications';
import { ManageLocation } from './pages/ManageLocation';
import AdminApp from './admin/AdminApp';
import { 
  CartItem, User, MenuItem, FeaturedSlide, 
  WalletTransactionCategory, UserRole, 
  OnboardingConfig, AppDesignConfig, Category,
  AppNotification, DiningSession, DeliveryAddress
} from './types';

export type AppTheme = 'mint' | 'champagne' | 'dark' | 'yellow' | 'blue' | 'lavender';

export interface Location {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  address: string;
  isDefault: boolean;
}

export interface PromoDiscount {
  code: string;
  percentage: number;
  description: string;
}

export interface SliderItem {
  id: string;
  name: string;
  subtitle?: string;
  price?: number;
  rating?: number;
  img: string;
  enabled: boolean;
  category?: string;
}

interface WalletEngineParams {
  walletId: string;
  amount: number;
  type: 'credit' | 'debit';
  category: WalletTransactionCategory;
  description: string;
  orderId?: string;
  referenceId?: string;
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  cart: CartItem[];
  addToCart: (item: CartItem | MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  favorites: MenuItem[];
  toggleFavorite: (item: MenuItem) => void;
  locations: Location[];
  addLocation: (loc: Location) => void;
  removeLocation: (id: string) => void;
  setDefaultLocation: (id: string) => void;
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  appliedPromo: PromoDiscount | null;
  setAppliedPromo: (promo: PromoDiscount | null) => void;
  featuredSlides: FeaturedSlide[];
  setFeaturedSlides: (slides: FeaturedSlide[]) => void;
  trendingItems: SliderItem[];
  setTrendingItems: (items: SliderItem[]) => void;
  exclusiveDeals: SliderItem[];
  setExclusiveDeals: (items: SliderItem[]) => void;
  quickBites: SliderItem[];
  setQuickBites: (items: SliderItem[]) => void;
  onboardingConfig: OnboardingConfig;
  setOnboardingConfig: (config: OnboardingConfig) => void;
  designConfig: AppDesignConfig;
  setDesignConfig: (config: AppDesignConfig) => void;
  categories: Category[];
  setCategories: (cats: Category[]) => void;
  walletEngine: (params: WalletEngineParams) => Promise<{ success: boolean; message: string }>;
  processTransaction: (params: Omit<WalletEngineParams, 'walletId'>) => Promise<{ success: boolean; message: string }>;
  isOnline: boolean;
  isWalletEnabled: boolean;
  notifications: AppNotification[];
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  unreadCount: number;
  notificationSound: string;
  setNotificationSound: (sound: string) => void;
  // Dining Session State
  diningSession: DiningSession | null;
  setDiningSession: (session: DiningSession | null) => void;
  // Location Management
  currentLocation: DeliveryAddress;
  setCurrentLocation: (loc: DeliveryAddress) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

const DEFAULT_ONBOARDING: OnboardingConfig = {
  title: "Fast Delivery of Delicious Food",
  subtitle: "Order food within minutes and get exclusive bonuses.",
  buttonText: "Get Started",
  bgImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200",
  enableAnimation: true
};

const DEFAULT_DESIGN: AppDesignConfig = {
  borderRadius: '16px',
  primaryColor: '#FF6A00',
  secondaryColor: '#FFF7ED',
  fontFamily: 'Plus Jakarta Sans',
  darkMode: false,
  layoutSpacing: 'normal',
  logoUrl: 'https://img.icons8.com/fluency/144/hamburger.png' 
};

const THEME_CONFIG: Record<AppTheme, { primary: string, bg: string, isDark?: boolean }> = {
  mint: { primary: '#10B981', bg: '#F0FDF4' },
  yellow: { primary: '#F59E0B', bg: '#FFFBEB' },
  blue: { primary: '#3B82F6', bg: '#EFF6FF' },
  lavender: { primary: '#8B5CF6', bg: '#F5F3FF' },
  champagne: { primary: '#FF6A00', bg: '#FFFFFF' },
  dark: { primary: '#F9FAFB', bg: '#09090B', isDark: true }
};

const DEFAULT_SLIDES: FeaturedSlide[] = [
  {
    id: 'f1',
    title: 'Get Special Discount',
    subtitle: 'All restros available | T&C Applied',
    badge: 'Limited time!',
    cta: 'Claim',
    img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800',
    link: '/'
  },
  {
    id: 'f2',
    title: 'Weekend Mega Feast',
    subtitle: 'Free delivery on orders above ₹499',
    badge: 'Weekend Special',
    cta: 'Order Now',
    img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800',
    link: '/'
  },
  {
    id: 'f3',
    title: 'Fresh & Healthy Bowls',
    subtitle: 'Flat 30% OFF on all gourmet salads',
    badge: 'Healthy Living',
    cta: 'Explore',
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800',
    link: '/'
  }
];

const DEFAULT_TRENDING: SliderItem[] = [
  { id: 't1', name: 'Cheese Pizza', subtitle: 'Italian Classic', price: 299, rating: 4.8, img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600', enabled: true, category: 'Pizza' },
  { id: 't2', name: 'Veg Burger', subtitle: 'Gourmet Selection', price: 180, rating: 4.6, img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=600', enabled: true, category: 'Burger' },
  { id: 't3', name: 'Noodle Bowl', subtitle: 'Asian Street', price: 250, rating: 4.5, img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=600', enabled: true, category: 'Noodles' },
  { id: 't4', name: 'Greek Salad', subtitle: 'Mediterranean Mix', price: 210, rating: 4.4, img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600', enabled: true, category: 'Salads' },
  { id: 't5', name: 'Pepperoni Feast', subtitle: 'Extra Cheesy', price: 420, rating: 4.9, img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600', enabled: true, category: 'Pizza' },
  { id: 't6', name: 'Double Patty', subtitle: 'Beefy Supreme', price: 299, rating: 4.7, img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600', enabled: true, category: 'Burger' },
];

const DEFAULT_EXCLUSIVE: SliderItem[] = [
  { id: 'd1', name: '50% Off First Orders', subtitle: 'At Dominos Pizza', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600', enabled: true },
];

const DEFAULT_QUICKBITES: SliderItem[] = [
  { id: 'q1', name: 'Hot Samosa', price: 40, rating: 4.4, img: 'https://images.unsplash.com/photo-1601050638917-3d9437489101?q=80&w=400', enabled: true },
];

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'c1', name: 'Pizza', icon: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400' },
  { id: 'c2', name: 'Burger', icon: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400' },
  { id: 'c3', name: 'Noodles', icon: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=400' },
  { id: 'c4', name: 'Salads', icon: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400' },
];

const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    title: 'Order Delivered! 🍕',
    message: 'Your order from The Pizza Palace has been delivered. Enjoy your meal!',
    type: 'order',
    timestamp: Date.now() - 3600000,
    isRead: false,
    link: '/orders'
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : {
      uid: 'alex-001',
      name: 'Alex Johnson',
      email: 'alex@foodi.com',
      role: 'user',
      walletBalance: 1200.00,
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
    };
  });
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedPromo, setAppliedPromo] = useState<PromoDiscount | null>(null);
  const [favorites, setFavorites] = useState<MenuItem[]>(() => {
    const savedFavs = localStorage.getItem('favorites');
    return savedFavs ? JSON.parse(savedFavs) : [];
  });
  const [locations, setLocations] = useState<Location[]>([
    { id: '1', label: 'Home', address: '746 Utica Ave, NY 11203', isDefault: true }
  ]);
  const [theme, setTheme] = useState<AppTheme>(() => (localStorage.getItem('app_theme') as AppTheme) || 'champagne');

  const [onboardingConfig, setOnboardingConfig] = useState<OnboardingConfig>(() => {
    const saved = localStorage.getItem('admin_onboarding');
    return saved ? JSON.parse(saved) : DEFAULT_ONBOARDING;
  });
  const [designConfig, setDesignConfig] = useState<AppDesignConfig>(() => {
    const saved = localStorage.getItem('admin_design');
    const initial = saved ? JSON.parse(saved) : DEFAULT_DESIGN;
    const savedTheme = (localStorage.getItem('app_theme') as AppTheme) || 'champagne';
    return { ...initial, primaryColor: THEME_CONFIG[savedTheme].primary };
  });

  const [featuredSlides, setFeaturedSlides] = useState<FeaturedSlide[]>(() => {
    const saved = localStorage.getItem('admin_slides');
    return saved ? JSON.parse(saved) : DEFAULT_SLIDES;
  });
  const [trendingItems, setTrendingItems] = useState<SliderItem[]>(() => {
    const saved = localStorage.getItem('admin_trending');
    return saved ? JSON.parse(saved) : DEFAULT_TRENDING;
  });
  const [exclusiveDeals, setExclusiveDeals] = useState<SliderItem[]>(() => {
    const saved = localStorage.getItem('admin_exclusive');
    return saved ? JSON.parse(saved) : DEFAULT_EXCLUSIVE;
  });
  const [quickBites, setQuickBites] = useState<SliderItem[]>(() => {
    const saved = localStorage.getItem('admin_quick');
    return saved ? JSON.parse(saved) : DEFAULT_QUICKBITES;
  });
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('admin_categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('app_notifications');
    return saved ? JSON.parse(saved) : MOCK_NOTIFICATIONS;
  });

  const [notificationSound, setNotificationSound] = useState<string>(() => {
    return localStorage.getItem('app_notification_sound') || 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3';
  });

  const [diningSession, setDiningSession] = useState<DiningSession | null>(() => {
    const saved = localStorage.getItem('active_dining_session');
    return saved ? JSON.parse(saved) : null;
  });

  // Manage Location Persistance
  const [currentLocation, setCurrentLocation] = useState<DeliveryAddress>(() => {
    const saved = localStorage.getItem('delivery_location');
    return saved ? JSON.parse(saved) : {
      fullAddress: '746 Utica Ave',
      apartment: 'Apt 4B',
      zipCode: '11203',
      city: 'New York',
      state: 'NY',
      country: 'USA'
    };
  });

  const updateCurrentLocation = (loc: DeliveryAddress) => {
    setCurrentLocation(loc);
    localStorage.setItem('delivery_location', JSON.stringify(loc));
  };

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const isWalletEnabled = true;

  useEffect(() => {
    const config = THEME_CONFIG[theme];
    localStorage.setItem('app_theme', theme);
    document.documentElement.style.setProperty('--brand-primary', config.primary);
    document.documentElement.style.setProperty('--brand-bg', config.bg);
    setDesignConfig(prev => ({ 
      ...prev, 
      primaryColor: config.primary,
      darkMode: !!config.isDark
    }));
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('admin_onboarding', JSON.stringify(onboardingConfig));
    localStorage.setItem('admin_design', JSON.stringify(designConfig));
    localStorage.setItem('admin_slides', JSON.stringify(featuredSlides));
    localStorage.setItem('admin_trending', JSON.stringify(trendingItems));
    localStorage.setItem('admin_exclusive', JSON.stringify(exclusiveDeals));
    localStorage.setItem('admin_quick', JSON.stringify(quickBites));
    localStorage.setItem('admin_categories', JSON.stringify(categories));
    localStorage.setItem('app_notifications', JSON.stringify(notifications));
    localStorage.setItem('app_notification_sound', notificationSound);
    localStorage.setItem('active_dining_session', JSON.stringify(diningSession));
  }, [onboardingConfig, designConfig, featuredSlides, trendingItems, exclusiveDeals, quickBites, categories, notifications, notificationSound, diningSession]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const playNotificationSound = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(notificationSound);
    } else {
      audioRef.current.src = notificationSound;
    }
    audioRef.current.play().catch(e => console.debug('Sound block:', e));
  }, [notificationSound]);

  const addNotification = useCallback((n: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNote: AppNotification = {
      ...n,
      id: 'n-' + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      isRead: false
    };
    setNotifications(prev => [newNote, ...prev]);
    playNotificationSound();
  }, [playNotificationSound]);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const walletEngine = useCallback(async (params: any) => {
    return { success: true, message: 'Transaction simulated' };
  }, []);

  const processTransaction = useCallback(async (params: any) => {
    if (!user) return { success: false, message: 'Auth required' };
    return walletEngine({ ...params, walletId: user.uid });
  }, [user, walletEngine]);

  const addToCart = (item: CartItem | MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 } as CartItem];
    });
  };

  const removeFromCart = (itemId: string) => setCart(prev => prev.filter(i => i.id !== itemId));
  const clearCart = () => setCart([]);
  const updateQuantity = (itemId: string, delta: number) => {
    setCart(prev => prev.map(i => i.id === itemId ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i).filter(i => i.quantity > 0));
  };
  const toggleFavorite = (item: MenuItem) => {
    setFavorites(prev => prev.some(f => f.id === item.id) ? prev.filter(f => f.id !== item.id) : [...prev, item]);
  };
  const addLocation = (loc: Location) => setLocations(prev => [...prev, loc]);
  const removeLocation = (id: string) => setLocations(prev => prev.filter(l => l.id !== id));
  const setDefaultLocation = (id: string) => setLocations(prev => prev.map(l => ({ ...l, isDefault: l.id === id })));

  return (
    <AppContext.Provider value={{
      user, setUser, cart, addToCart, removeFromCart, updateQuantity, clearCart,
      favorites, toggleFavorite, locations, addLocation, removeLocation, setDefaultLocation,
      theme, setTheme, appliedPromo, setAppliedPromo,
      featuredSlides, setFeaturedSlides, 
      trendingItems, setTrendingItems,
      exclusiveDeals, setExclusiveDeals,
      quickBites, setQuickBites,
      onboardingConfig, setOnboardingConfig,
      designConfig, setDesignConfig, categories, setCategories,
      walletEngine, processTransaction, isOnline, isWalletEnabled,
      notifications, addNotification, markAsRead, markAllAsRead, deleteNotification, clearAllNotifications, unreadCount,
      notificationSound, setNotificationSound,
      diningSession, setDiningSession,
      currentLocation, setCurrentLocation: updateCurrentLocation
    }}>
      {children}
    </AppContext.Provider>
  );
};

const App: React.FC = () => {
  const [showWelcome, setShowWelcome] = useState(() => !localStorage.getItem('welcomed'));

  if (showWelcome) {
    return (
      <AppProvider>
        <Router>
          <Welcome onComplete={() => { localStorage.setItem('welcomed', 'true'); setShowWelcome(false); }} />
        </Router>
      </AppProvider>
    );
  }

  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/restaurant/:id" element={<RestaurantDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderTracking />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/favorites" element={<FavoriteFoods />} />
            <Route path="/profile/wallet" element={<Wallet />} />
            <Route path="/profile/locations" element={<SavedLocations />} />
            <Route path="/profile/details" element={<AccountDetails />} />
            <Route path="/profile/privacy" element={<PrivacyPolicy />} />
            <Route path="/profile/support" element={<HelpSupport />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/scan" element={<QRScanner />} />
            <Route path="/dashboard" element={<CustomerDashboard />} />
            <Route path="/manage-location" element={<ManageLocation />} />
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin/*" element={<AdminApp />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;
