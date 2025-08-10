import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  CreditCard, 
  Building2, 
  DollarSign,
  CheckCircle
} from 'lucide-react-native';
import { router } from 'expo-router';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

import { theme } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useProperties } from '@/hooks/useProperties';
import { usePayments } from '@/hooks/usePayments';

export default function PaymentScreen() {
  const { user } = useAuth();
  const { getTenantUnit } = useProperties();
  const { makePayment } = usePayments();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('bank');
  
  const unit = user ? getTenantUnit(user.id) : null;
  const rentAmount = unit?.rentAmount || 0;

  const handlePayment = async () => {
    const paymentAmount = amount ? parseFloat(amount) : rentAmount;
    
    if (!paymentAmount || paymentAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      await makePayment({
        tenantId: user?.id || '',
        unitId: unit?.id || '',
        amount: paymentAmount,
        status: 'completed',
        dueDate: new Date(),
        paidDate: new Date(),
      });
      
      Alert.alert(
        'Payment Successful',
        `Your payment of $${paymentAmount} has been processed successfully.`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch {
      Alert.alert('Error', 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    {
      id: 'bank',
      type: 'Bank Account',
      last4: '4567',
      name: 'Chase Bank',
      icon: <Building2 size={20} color={theme.colors.primary} />,
    },
    {
      id: 'card',
      type: 'Credit Card',
      last4: '1234',
      name: 'Visa',
      icon: <CreditCard size={20} color={theme.colors.primary} />,
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Card style={styles.amountCard}>
            <Text style={styles.sectionTitle}>Payment Amount</Text>
            <View style={styles.amountContainer}>
              <DollarSign size={32} color={theme.colors.primary} />
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={setAmount}
                placeholder={rentAmount.toString()}
                placeholderTextColor={theme.colors.gray[400]}
                keyboardType="numeric"
              />
            </View>
            <TouchableOpacity
              style={styles.quickAmount}
              onPress={() => setAmount(rentAmount.toString())}
            >
              <Text style={styles.quickAmountText}>
                Use full rent amount (${rentAmount})
              </Text>
            </TouchableOpacity>
          </Card>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                onPress={() => setSelectedMethod(method.id)}
              >
                <Card style={styles.methodCard}>
                  <View style={styles.methodLeft}>
                    {method.icon}
                    <View>
                      <Text style={styles.methodType}>{method.type}</Text>
                      <Text style={styles.methodDetails}>
                        {method.name} •••• {method.last4}
                      </Text>
                    </View>
                  </View>
                  {selectedMethod === method.id && (
                    <CheckCircle size={20} color={theme.colors.primary} />
                  )}
                </Card>
              </TouchableOpacity>
            ))}
          </View>

          <Card style={styles.summaryCard}>
            <Text style={styles.sectionTitle}>Payment Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Rent Amount</Text>
              <Text style={styles.summaryValue}>
                ${amount || rentAmount}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Processing Fee</Text>
              <Text style={styles.summaryValue}>$0.00</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                ${amount || rentAmount}
              </Text>
            </View>
          </Card>

          <Button
            title="Make Payment"
            onPress={handlePayment}
            loading={loading}
            size="large"
            style={styles.payButton}
          />

          <Text style={styles.disclaimer}>
            By making this payment, you agree to our terms and conditions.
            Your payment will be processed securely through our PCI-compliant payment system.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
  },
  amountCard: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  amountInput: {
    flex: 1,
    fontSize: 48,
    fontWeight: '700' as const,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
  },
  quickAmount: {
    alignSelf: 'center',
  },
  quickAmountText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '500' as const,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  methodCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  methodType: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: theme.colors.text.primary,
  },
  methodDetails: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  summaryCard: {
    marginBottom: theme.spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  summaryLabel: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  summaryValue: {
    fontSize: 14,
    color: theme.colors.text.primary,
  },
  totalRow: {
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray[200],
    marginTop: theme.spacing.sm,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: theme.colors.text.primary,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: theme.colors.primary,
  },
  payButton: {
    marginBottom: theme.spacing.md,
  },
  disclaimer: {
    fontSize: 12,
    color: theme.colors.text.light,
    textAlign: 'center',
    lineHeight: 18,
  },
});