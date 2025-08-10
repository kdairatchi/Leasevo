import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { 
  Home, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  DollarSign,
  Calendar,
  TrendingUp
} from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { GlassCard } from './GlassCard';

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

interface PremiumRentTrackerProps {
  payments: PaymentStatus[];
  onUnitPress?: (payment: PaymentStatus) => void;
}

export function PremiumRentTracker({ payments, onUnitPress }: PremiumRentTrackerProps) {
  const [, setRefreshing] = useState(false);
  const refreshAnim = useRef(new Animated.Value(0)).current;

  const handleRefresh = () => {
    setRefreshing(true);
    
    Animated.sequence([
      Animated.timing(refreshAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(refreshAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setRefreshing(false);
    });
  };

  const getStatusColor = (status: string): [string, string] => {
    switch (status) {
      case 'paid': return [theme.colors.success, theme.colors.successLight];
      case 'partial': return [theme.colors.warning, theme.colors.warningLight];
      case 'overdue': return [theme.colors.error, theme.colors.errorLight];
      default: return [theme.colors.gray[400], theme.colors.gray[300]];
    }
  };

  const getStatusIcon = (status: string) => {
    const iconProps = { size: 16, color: theme.colors.white };
    switch (status) {
      case 'paid': return <CheckCircle {...iconProps} />;
      case 'partial': return <Clock {...iconProps} />;
      case 'overdue': return <AlertTriangle {...iconProps} />;
      default: return <Home {...iconProps} />;
    }
  };

  const PaymentCard = ({ payment, index }: { payment: PaymentStatus; index: number }) => {
    const fillPercentage = (payment.paidAmount / payment.rentAmount) * 100;
    const isOverdue = payment.status === 'overdue';
    const [primaryColor, secondaryColor] = getStatusColor(payment.status);

    const cardAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(cardAnim, {
        toValue: 1,
        duration: theme.animations.normal,
        delay: index * 100,
        useNativeDriver: true,
      }).start();

      Animated.timing(progressAnim, {
        toValue: fillPercentage / 100,
        duration: theme.animations.normal,
        delay: index * 150,
        useNativeDriver: false,
      }).start();

      if (isOverdue) {
        const pulse = Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.02,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]);
        Animated.loop(pulse).start();
      }
    }, [cardAnim, pulseAnim, progressAnim, index, isOverdue, fillPercentage]);

    return (
      <Animated.View
        style={[
          styles.unitCard,
          {
            opacity: cardAnim,
            transform: [
              { scale: pulseAnim },
              {
                translateY: cardAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => onUnitPress?.(payment)}
          style={styles.cardTouchable}
        >
          <GlassCard
            style={styles.card}
            onPress={() => onUnitPress?.(payment)}
            depth="lg"
          >
            <LinearGradient
              colors={[primaryColor, secondaryColor]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardGradient}
            >
              {Platform.OS !== 'web' ? (
                <BlurView intensity={30} style={styles.cardBlur}>
                  <View style={styles.cardContent}>
                    <CardContent payment={payment} fillPercentage={fillPercentage} progressAnim={progressAnim} />
                  </View>
                </BlurView>
              ) : (
                <View style={[styles.cardBlur, styles.webCardBlur]}>
                  <View style={styles.cardContent}>
                    <CardContent payment={payment} fillPercentage={fillPercentage} progressAnim={progressAnim} />
                  </View>
                </View>
              )}
            </LinearGradient>
          </GlassCard>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const CardContent = ({ payment, fillPercentage, progressAnim }: { payment: PaymentStatus; fillPercentage: number; progressAnim: Animated.Value }) => (
    <>
      <View style={styles.cardHeader}>
        <View style={styles.unitInfo}>
          <Home size={20} color={theme.colors.white} />
          <Text style={styles.unitNumber}>Unit {payment.unitNumber}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
          {getStatusIcon(payment.status)}
        </View>
      </View>
      
      <Text style={styles.tenantName}>{payment.tenantName}</Text>
      
      <View style={styles.amountContainer}>
        <View style={styles.amountRow}>
          <DollarSign size={16} color={theme.colors.white} />
          <Text style={styles.amount}>${payment.rentAmount.toLocaleString()}</Text>
        </View>
        <Text style={styles.amountLabel}>Monthly Rent</Text>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', `${Math.min(fillPercentage, 100)}%`],
                }),
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              },
            ]}
          />
          <View style={styles.progressOverlay}>
            <Animated.View
              style={[
                styles.progressGradient,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', `${Math.min(fillPercentage, 100)}%`],
                  })
                }
              ]}
            >
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.progressGradientInner}
              />
            </Animated.View>
          </View>
        </View>
        <Text style={styles.progressText}>
          ${payment.paidAmount.toLocaleString()} / ${payment.rentAmount.toLocaleString()}
        </Text>
      </View>
      
      <View style={styles.footer}>
        <View style={styles.dueDateContainer}>
          <Calendar size={12} color={theme.colors.white} />
          <Text style={styles.dueDate}>
            Due: {new Date(payment.dueDate).toLocaleDateString()}
          </Text>
        </View>
        {payment.daysLate && payment.daysLate > 0 && (
          <View style={styles.lateContainer}>
            <AlertTriangle size={12} color={theme.colors.white} />
            <Text style={styles.lateText}>
              {payment.daysLate} days late
            </Text>
          </View>
        )}
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TrendingUp size={24} color={theme.colors.primary} />
          <View style={styles.headerText}>
            <Text style={styles.title}>Rent Collection</Text>
            <Text style={styles.subtitle}>Swipe to view all units</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
          <Animated.View
            style={{
              transform: [{
                rotate: refreshAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              }],
            }}
          >
            <TrendingUp size={20} color={theme.colors.primary} />
          </Animated.View>
        </TouchableOpacity>
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={screenWidth * 0.8}
        snapToAlignment="start"
      >
        {payments.map((payment, index) => (
          <PaymentCard key={payment.id} payment={payment} index={index} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: theme.colors.text.primary,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
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
    minHeight: 200,
  },
  cardGradient: {
    flex: 1,
    borderRadius: theme.borderRadius.xl,
  },
  cardBlur: {
    flex: 1,
    borderRadius: theme.borderRadius.xl,
  },
  webCardBlur: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardContent: {
    flex: 1,
    padding: theme.spacing.lg,
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
    fontWeight: '700' as const,
    color: theme.colors.white,
  },
  statusBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tenantName: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: theme.spacing.md,
  },
  amountContainer: {
    marginBottom: theme.spacing.md,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  amountLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  amount: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: theme.colors.white,
  },
  progressContainer: {
    marginBottom: theme.spacing.md,
  },
  progressTrack: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: theme.spacing.sm,
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    width: '100%',
    borderRadius: 4,
    transformOrigin: 'left',
  },
  progressOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  progressGradient: {
    height: '100%',
    width: '100%',
    borderRadius: 4,
    transformOrigin: 'left',
  },
  progressGradientInner: {
    flex: 1,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '600' as const,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  dueDate: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  lateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  lateText: {
    fontSize: 12,
    color: theme.colors.white,
    fontWeight: '600' as const,
  },
});