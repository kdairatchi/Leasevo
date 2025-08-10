export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'tenant' | 'landlord';
  avatar?: string;
  twoFactorEnabled: boolean;
  createdAt: Date;
}

export interface Property {
  id: string;
  landlordId: string;
  name: string;
  address: string;
  units: Unit[];
  image?: string;
  createdAt: Date;
}

export interface Unit {
  id: string;
  propertyId: string;
  unitNumber: string;
  rentAmount: number;
  tenantId?: string;
  tenant?: Tenant;
  leaseStart?: Date;
  leaseEnd?: Date;
  status: 'vacant' | 'occupied';
}

export interface Tenant extends User {
  unitId?: string;
  autopayEnabled: boolean;
  paymentMethod?: PaymentMethod;
  rentDueDay: number;
}

export interface Payment {
  id: string;
  tenantId: string;
  unitId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'late';
  dueDate: Date;
  paidDate?: Date;
  lateFee?: number;
  receiptUrl?: string;
  createdAt: Date;
}

export interface PaymentMethod {
  id: string;
  type: 'bank' | 'card';
  last4: string;
  bankName?: string;
  cardBrand?: string;
  isDefault: boolean;
}

export interface MaintenanceRequest {
  id: string;
  tenantId: string;
  unitId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'emergency';
  status: 'open' | 'in_progress' | 'resolved';
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  isAI?: boolean;
  timestamp: Date;
  read: boolean;
}

export interface Notice {
  id: string;
  type: '3-day' | '7-day' | '30-day' | 'custom';
  tenantId: string;
  unitId: string;
  title: string;
  content: string;
  sentDate: Date;
  acknowledged: boolean;
}

export interface LeaseDocument {
  id: string;
  unitId: string;
  tenantId: string;
  documentUrl: string;
  signedByTenant: boolean;
  signedByLandlord: boolean;
  createdAt: Date;
  expiresAt: Date;
}