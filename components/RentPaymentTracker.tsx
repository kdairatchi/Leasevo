import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  PanResponder,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Home, Clock, CheckCircle, AlertTriangle } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { Card } from './Card';

const { width: screenWidth } = Dimensions.get('window');

interface PaymentStatus {
  id: string;
  unitNumber: string;
  tenantName: string;
  rentAmount: number;
  paidAmount: number;
  dueDate: string;
  status: 'paid' | 'partial' | 'overdue' | 'pending';
  daysLate?: number;
}

interface RentPaymentTrackerProps {
  payments: PaymentStatus[];
  onUnitPress?: (payment: PaymentStatus) => void;
}

export function RentPaymentTracker({ payments, onUnitPress }: RentPaymentTrackerProps) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const hasOverdue = payments.some(p => p.status === 'overdue');
    if (hasOverdue) {
      const pulse = Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]);
      Animated.loop(pulse).start();
    }
  }, [payments, pulseAnim]);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
    },
    onPanResponderGrant: () => {},
    onPanResponderMove: Animated.event(
      [null, { dx: scrollX }],
      { useNativeDriver: false }
    ),
    onPanResponderRelease: () => {},
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return theme.colors.success;
      case 'partial': return theme.colors.warning;
      case 'overdue': return theme.colors.error;
      default: return theme.colors.gray[300];
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle size={16} color={theme.colors.white} />;
      case 'partial': return <Clock size={16} color={theme.colors.white} />;
      case 'overdue': return <AlertTriangle size={16} color={theme.colors.white} />;
      default: return <Home size={16} color={theme.colors.gray[500]} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Rent Payment Status</Text>
        <Text style={styles.subtitle}>Swipe to view all units</Text>
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        {...panResponder.panHandlers}
      >
        {payments.map((payment, index) => {
          const fillPercentage = (payment.paidAmount / payment.rentAmount) * 100;
          const isOverdue = payment.status === 'overdue';
          
          return (
            <Animated.View
              key={payment.id}
              style={[
                styles.unitCard,
                isOverdue && {
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => onUnitPress?.(payment)}
                style={styles.cardTouchable}
              >
                <Card style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={styles.unitInfo}>
                      <Home size={20} color={theme.colors.primary} />
                      <Text style={styles.unitNumber}>Unit {payment.unitNumber}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(payment.status) }]}>
                      {getStatusIcon(payment.status)}
                    </View>
                  </View>
                  
                  <Text style={styles.tenantName}>{payment.tenantName}</Text>
                  
                  <View style={styles.amountContainer}>
                    <Text style={styles.amountLabel}>Rent Amount</Text>
                    <Text style={styles.amount}>${payment.rentAmount.toLocaleString()}</Text>
                  </View>
                  
                  <View style={styles.progressContainer}>
                    <View style={styles.progressTrack}>
                      <Animated.View
                        style={[
                          styles.progressFill,
                          {
                            width: `${Math.min(fillPercentage, 100)}%`,
                            backgroundColor: getStatusColor(payment.status),
                          },
                        ]}
                      />
                      {fillPercentage > 0 && (
                        <LinearGradient
                          colors={[getStatusColor(payment.status), getStatusColor(payment.status) + '80']}
                          style={[
                            styles.progressGradient,
                            { width: `${Math.min(fillPercentage, 100)}%` },
                          ]}
                        />
                      )}
                    </View>
                    <Text style={styles.progressText}>
                      ${payment.paidAmount.toLocaleString()} / ${payment.rentAmount.toLocaleString()}
                    </Text>
                  </View>
                  
                  <View style={styles.footer}>
                    <Text style={styles.dueDate}>
                      Due: {new Date(payment.dueDate).toLocaleDateString()}
                    </Text>
                    {payment.daysLate && payment.daysLate > 0 && (
                      <Text style={styles.lateText}>
                        {payment.daysLate} days late
                      </Text>
                    )}
                  </View>
                </Card>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.lg,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  unitCard: {
    width: screenWidth * 0.75,
  },
  cardTouchable: {
    flex: 1,
  },
  card: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  unitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  unitNumber: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: theme.colors.text.primary,
  },
  statusBadge: {
    width: 28,
    height: 28,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tenantName: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  amountContainer: {
    marginBottom: theme.spacing.md,
  },
  amountLabel: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  amount: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: theme.colors.text.primary,
  },
  progressContainer: {
    marginBottom: theme.spacing.md,
  },
  progressTrack: {
    height: 8,
    backgroundColor: theme.colors.gray[200],
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
    marginBottom: theme.spacing.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: theme.borderRadius.sm,
  },
  progressGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    borderRadius: theme.borderRadius.sm,
  },
  progressText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dueDate: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  lateText: {
    fontSize: 12,
    color: theme.colors.error,
    fontWeight: '500' as const,
  },
});