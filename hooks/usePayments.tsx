import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Payment } from '@/types';
import { mockPayments } from '@/mocks/data';

interface PaymentsState {
  payments: Payment[];
  isLoading: boolean;
  makePayment: (payment: Omit<Payment, 'id' | 'createdAt'>) => Promise<void>;
  getPaymentHistory: (tenantId: string) => Payment[];
  getUpcomingPayments: (tenantId: string) => Payment[];
  updatePaymentStatus: (paymentId: string, status: Payment['status']) => Promise<void>;
}

export const [PaymentsProvider, usePayments] = createContextHook<PaymentsState>(() => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const stored = await AsyncStorage.getItem('payments');
      if (stored) {
        setPayments(JSON.parse(stored));
      } else {
        setPayments(mockPayments);
        await AsyncStorage.setItem('payments', JSON.stringify(mockPayments));
      }
    } catch (error) {
      console.error('Failed to load payments:', error);
      setPayments(mockPayments);
    } finally {
      setIsLoading(false);
    }
  };

  const makePayment = useCallback(async (payment: Omit<Payment, 'id' | 'createdAt'>) => {
    const newPayment: Payment = {
      ...payment,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    
    const updated = [...payments, newPayment];
    setPayments(updated);
    await AsyncStorage.setItem('payments', JSON.stringify(updated));
  }, [payments]);

  const getPaymentHistory = useCallback((tenantId: string) => {
    return payments
      .filter(p => p.tenantId === tenantId && p.status === 'completed')
      .sort((a, b) => b.paidDate!.getTime() - a.paidDate!.getTime());
  }, [payments]);

  const getUpcomingPayments = useCallback((tenantId: string) => {
    return payments
      .filter(p => p.tenantId === tenantId && p.status === 'pending')
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  }, [payments]);

  const updatePaymentStatus = useCallback(async (paymentId: string, status: Payment['status']) => {
    const updated = payments.map(p => 
      p.id === paymentId 
        ? { ...p, status, paidDate: status === 'completed' ? new Date() : undefined }
        : p
    );
    setPayments(updated);
    await AsyncStorage.setItem('payments', JSON.stringify(updated));
  }, [payments]);

  return useMemo(() => ({
    payments,
    isLoading,
    makePayment,
    getPaymentHistory,
    getUpcomingPayments,
    updatePaymentStatus,
  }), [payments, isLoading, makePayment, getPaymentHistory, getUpcomingPayments, updatePaymentStatus]);
});