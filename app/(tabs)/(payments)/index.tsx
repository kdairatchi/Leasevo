import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  DollarSign, 
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react-native';
import { router } from 'expo-router';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { theme } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { usePayments } from '@/hooks/usePayments';
import { Payment } from '@/types';

export default function PaymentsScreen() {
  const { user } = useAuth();
  const { payments } = usePayments();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'late'>('all');
  
  const isLandlord = user?.role === 'landlord';
  
  const filteredPayments = payments.filter(payment => {
    if (filter === 'all') return true;
    return payment.status === filter;
  });

  const getStatusIcon = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} color={theme.colors.success} />;
      case 'pending':
        return <Clock size={16} color={theme.colors.warning} />;
      case 'late':
        return <AlertCircle size={16} color={theme.colors.error} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return theme.colors.success;
      case 'pending':
        return theme.colors.warning;
      case 'late':
        return theme.colors.error;
      default:
        return theme.colors.gray[500];
    }
  };

  const renderPaymentItem = ({ item }: { item: Payment }) => (
    <Card style={styles.paymentItem}>
      <View style={styles.paymentHeader}>
        <View style={styles.paymentInfo}>
          <Text style={styles.paymentAmount}>${item.amount}</Text>
          <Text style={styles.paymentDate}>
            Due: {new Date(item.dueDate).toLocaleDateString()}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          {getStatusIcon(item.status)}
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>
      {item.paidDate && (
        <Text style={styles.paidDate}>
          Paid: {new Date(item.paidDate).toLocaleDateString()}
        </Text>
      )}
      {item.status === 'pending' && !isLandlord && (
        <Button
          title="Pay Now"
          onPress={() => router.push('/payment')}
          size="small"
          style={styles.payButton}
        />
      )}
    </Card>
  );

  const totalPending = filteredPayments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPaid = filteredPayments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Card style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Pending</Text>
              <Text style={styles.summaryValue}>${totalPending}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Paid</Text>
              <Text style={[styles.summaryValue, { color: theme.colors.success }]}>
                ${totalPaid}
              </Text>
            </View>
          </View>
        </Card>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
        >
          {(['all', 'pending', 'completed', 'late'] as const).map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterChip,
                filter === status && styles.filterChipActive
              ]}
              onPress={() => setFilter(status)}
            >
              <Text style={[
                styles.filterText,
                filter === status && styles.filterTextActive
              ]}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredPayments}
        renderItem={renderPaymentItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <DollarSign size={48} color={theme.colors.gray[300]} />
            <Text style={styles.emptyText}>No payments found</Text>
          </View>
        }
      />

      {!isLandlord && (
        <View style={styles.footer}>
          <Button
            title="Set Up Autopay"
            onPress={() => {}}
            variant="outline"
            size="large"
            style={styles.footerButton}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    paddingBottom: 0,
  },
  summaryCard: {
    marginBottom: theme.spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: theme.colors.text.primary,
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: theme.colors.gray[200],
  },
  filterContainer: {
    marginBottom: theme.spacing.md,
  },
  filterChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.white,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  filterTextActive: {
    color: theme.colors.white,
    fontWeight: '600' as const,
  },
  listContent: {
    padding: theme.spacing.lg,
    paddingTop: 0,
  },
  paymentItem: {
    marginBottom: theme.spacing.md,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentAmount: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  paymentDate: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  paidDate: {
    fontSize: 12,
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing.xs,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  payButton: {
    marginTop: theme.spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.md,
  },
  footer: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray[200],
    backgroundColor: theme.colors.white,
  },
  footerButton: {
    width: '100%',
  },
});