
export type UserRole = 'SUPER_ADMIN' | 'MANAGER' | 'RESTAURANT_OWNER' | 'RIDER';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  loginDevice: string;
  ipAddress: string;
  sessionId: string;
  lastLoginTime: number;
  walletBalance: number;
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED';
}

export interface Restaurant {
  id: string;
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  gstId: string;
  address: string;
  rating: number;
  orderCount: number;
  revenue: number;
  bankDetails: {
    accountNo: string;
    ifsc: string;
    bankName: string;
  };
  upiId: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
}

export interface Rider {
  id: string;
  name: string;
  phone: string;
  vehicleType: 'BIKE' | 'SCOOTER' | 'CYCLE';
  licenseNo: string;
  activeStatus: 'ONLINE' | 'OFFLINE' | 'ON_ORDER';
  assignedOrders: number;
  earnings: number;
  bankDetails: {
    accountNo: string;
    ifsc: string;
  };
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  restaurantId: string;
  restaurantName: string;
  riderId?: string;
  riderName?: string;
  items: { name: string; quantity: number; price: number }[];
  billAmount: number;
  tax: number;
  deliveryFee: number;
  couponApplied?: string;
  paymentMode: 'UPI' | 'CARD' | 'CASH' | 'WALLET';
  paymentStatus: 'PAID' | 'PENDING' | 'FAILED';
  orderStatus: 'PLACED' | 'CONFIRMED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  timestamp: number;
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  gateway: 'RAZORPAY' | 'STRIPE' | 'PAYTM' | 'WALLET';
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  refundStatus?: 'NONE' | 'REQUESTED' | 'PROCESSED';
  timestamp: number;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number;
  expiryDate: number;
  usageCount: number;
  status: 'ACTIVE' | 'EXPIRED' | 'DISABLED';
}

export interface DeviceSession {
  id: string;
  userId: string;
  userName: string;
  device: string;
  browser: string;
  ipAddress: string;
  loginTime: number;
  logoutTime?: number;
}
