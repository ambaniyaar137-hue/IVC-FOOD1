
import React from 'react';

export const OrderStatus = {
  PLACED: 'PLACED',
  ACCEPTED: 'ACCEPTED',
  PREPARING: 'PREPARING',
  READY: 'READY',
  PICKED_UP: 'PICKED UP',
  OUT_FOR_DELIVERY: 'OUT FOR DELIVERY',
  SERVED: 'SERVED', // New for Table Ordering
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED'
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

export type UserRole = 'user' | 'admin' | 'rider';

export interface User {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  walletBalance?: number;
  avatarUrl?: string;
  address?: string;
  phone?: string;
}

export interface MenuItem {
  id: string;
  outletId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  available: boolean;
  category: string;
  isVeg: boolean;
  rating?: number;
  prepTime?: number;
  spiceLevels?: string[];
  addOns?: { name: string; price: number }[];
}

export interface CartItem extends MenuItem {
  quantity: number;
  selectedSpice?: string;
  selectedAddOns?: string[];
}

export interface DiningSession {
  restaurantId: string;
  restaurantName: string;
  branchId: string;
  tableNumber: string;
  sessionToken: string;
  startTime: number;
}

export interface FeaturedSlide {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  cta: string;
  img: string;
  link: string;
}

export enum WalletTransactionCategory {
  ORDER_PAYMENT = 'ORDER_PAYMENT',
  WALLET_TOPUP = 'WALLET_TOPUP',
  REFUND = 'REFUND',
  WITHDRAWAL = 'WITHDRAWAL'
}

export interface WalletTransaction {
  transactionId: string;
  walletId: string;
  amount: number;
  transactionType: 'credit' | 'debit';
  transactionCategory: WalletTransactionCategory;
  description: string;
  createdAt: number;
  orderId?: string;
}

export interface WalletRequest {
  id: string;
  userUid: string;
  userName: string;
  userRole: string;
  amount: number;
  type: 'TOPUP' | 'WITHDRAWAL';
  utr?: string;
  proofImage?: string; 
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: number;
}

export interface OnboardingConfig {
  title: string;
  subtitle: string;
  buttonText: string;
  bgImage: string;
  enableAnimation: boolean;
}

export interface AppDesignConfig {
  borderRadius: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  darkMode: boolean;
  layoutSpacing: string;
  logoUrl: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Outlet {
  id: string;
  name: string;
  locationName: string;
  cuisine: string[];
  imageUrl: string;
  rating: number;
  prepTime: number;
  address: string;
  approved: boolean;
  isOpen: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface SupportConfig {
  chatEnabled: boolean;
  callEnabled: boolean;
  emailEnabled: boolean;
  supportPhone: string;
  supportEmail: string;
}

export interface AdminUser {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export interface StatCardData {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

export type NotificationType = 'order' | 'promo' | 'system' | 'recommendation';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: number;
  isRead: boolean;
  link?: string;
}

export interface DeliveryAddress {
  fullAddress: string;
  apartment?: string;
  zipCode: string;
  city: string;
  state: string;
  country: string;
}
