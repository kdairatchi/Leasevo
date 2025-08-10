import { User, Property, Unit, Payment, MaintenanceRequest, ChatMessage, Notice, Tenant } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'john.landlord@example.com',
    name: 'John Smith',
    phone: '+1 (555) 123-4567',
    role: 'landlord',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    twoFactorEnabled: true,
    createdAt: new Date('2023-01-15'),
  },
  {
    id: '2',
    email: 'sarah.tenant@example.com',
    name: 'Sarah Johnson',
    phone: '+1 (555) 987-6543',
    role: 'tenant',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    twoFactorEnabled: false,
    createdAt: new Date('2023-06-20'),
  },
];

export const mockProperties: Property[] = [
  {
    id: '1',
    landlordId: '1',
    name: 'Sunset Apartments',
    address: '123 Main St, San Francisco, CA 94102',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
    units: [],
    createdAt: new Date('2023-01-15'),
  },
  {
    id: '2',
    landlordId: '1',
    name: 'Bay View Complex',
    address: '456 Ocean Ave, San Francisco, CA 94112',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
    units: [],
    createdAt: new Date('2023-03-10'),
  },
];

export const mockUnits: Unit[] = [
  {
    id: '1',
    propertyId: '1',
    unitNumber: '101',
    rentAmount: 2500,
    tenantId: '2',
    status: 'occupied',
    leaseStart: new Date('2023-06-01'),
    leaseEnd: new Date('2024-05-31'),
  },
  {
    id: '2',
    propertyId: '1',
    unitNumber: '102',
    rentAmount: 2300,
    status: 'vacant',
  },
  {
    id: '3',
    propertyId: '2',
    unitNumber: '201',
    rentAmount: 3200,
    status: 'occupied',
    tenantId: '3',
    leaseStart: new Date('2023-08-01'),
    leaseEnd: new Date('2024-07-31'),
  },
];

export const mockPayments: Payment[] = [
  {
    id: '1',
    tenantId: '2',
    unitId: '1',
    amount: 2500,
    status: 'completed',
    dueDate: new Date('2024-01-01'),
    paidDate: new Date('2024-01-01'),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    tenantId: '2',
    unitId: '1',
    amount: 2500,
    status: 'completed',
    dueDate: new Date('2024-02-01'),
    paidDate: new Date('2024-01-30'),
    createdAt: new Date('2024-02-01'),
  },
  {
    id: '3',
    tenantId: '2',
    unitId: '1',
    amount: 2500,
    status: 'pending',
    dueDate: new Date('2024-03-01'),
    createdAt: new Date('2024-03-01'),
  },
];

export const mockMaintenanceRequests: MaintenanceRequest[] = [
  {
    id: '1',
    tenantId: '2',
    unitId: '1',
    title: 'Leaky Faucet',
    description: 'The kitchen faucet is dripping constantly',
    priority: 'medium',
    status: 'open',
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
  },
  {
    id: '2',
    tenantId: '2',
    unitId: '1',
    title: 'AC Not Working',
    description: 'Air conditioning unit is not cooling properly',
    priority: 'high',
    status: 'in_progress',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-12'),
  },
];

export const mockMessages: ChatMessage[] = [
  {
    id: '1',
    senderId: '2',
    receiverId: '1',
    message: 'Hi, I wanted to ask about the maintenance request I submitted.',
    timestamp: new Date('2024-02-15T10:00:00'),
    read: true,
    isAI: false,
  },
  {
    id: '2',
    senderId: '1',
    receiverId: '2',
    message: 'Hi Sarah, I\'ve scheduled a plumber to come by tomorrow at 2 PM.',
    timestamp: new Date('2024-02-15T10:30:00'),
    read: true,
    isAI: false,
  },
];

export const mockNotices: Notice[] = [
  {
    id: '1',
    type: '30-day',
    tenantId: '2',
    unitId: '1',
    title: 'Lease Renewal Notice',
    content: 'Your lease is expiring on May 31, 2024. Please let us know if you would like to renew.',
    sentDate: new Date('2024-02-01'),
    acknowledged: true,
  },
];

export const mockTenant: Tenant = {
  ...mockUsers[1],
  unitId: '1',
  autopayEnabled: true,
  rentDueDay: 1,
  paymentMethod: {
    id: '1',
    type: 'bank',
    last4: '4567',
    bankName: 'Chase Bank',
    isDefault: true,
  },
};