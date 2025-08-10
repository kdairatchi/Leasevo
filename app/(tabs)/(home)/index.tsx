import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Home, 
  DollarSign, 
  Calendar, 
  AlertCircle,
  TrendingUp,
  Building,
  Users,
  Plus,
  Bell,
  Settings
} from 'lucide-react-native';
import { router } from 'expo-router';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { PremiumRentTracker } from '@/components/PremiumRentTracker';
import { DynamicIslandWidget } from '@/components/DynamicIslandWidget';
import { GlassCard } from '@/components/GlassCard';
import { AnimatedMessageIcon } from '@/components/AnimatedMessageIcon';
import { SkeletonCard } from '@/components/LoadingSkeleton';
import { theme } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useProperties } from '@/hooks/useProperties';
import { usePayments } from '@/hooks/usePayments';


export default function HomeScreen() {
  const { user } = useAuth();
  const { properties, units, getTenantUnit, isLoading } = useProperties();
  const { getUpcomingPayments } = usePayments();
  const [refreshing, setRefreshing] = React.useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  const isLandlord = user?.role === 'landlord';
  const tenantUnit = !isLandlord && user ? getTenantUnit(user.id) : null;
  const upcomingPayment = !isLandlord && user ? getUpcomingPayments(user.id)[0] : null;

  useEffect(() => {
    if (!isLoading) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isLoading, fadeAnim, slideAnim]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fadeAnim.setValue(0);
    slideAnim.setValue(50);
    setTimeout(() => {
      setRefreshing(false);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }, 1500);
  }, [fadeAnim, slideAnim]);

  const landlordStats = {
    totalProperties: properties.filter(p => p.landlordId === user?.id).length,
    totalUnits: units.filter(u => {
      const property = properties.find(p => p.id === u.propertyId);
      return property?.landlordId === user?.id;
    }).length,
    occupiedUnits: units.filter(u => {
      const property = properties.find(p => p.id === u.propertyId);
      return property?.landlordId === user?.id && u.status === 'occupied';
    }).length,
    monthlyIncome: units
      .filter(u => {
        const property = properties.find(p => p.id === u.propertyId);
        return property?.landlordId === user?.id && u.status === 'occupied';
      })
      .reduce((sum, unit) => sum + unit.rentAmount, 0),
  };

  const mockPaymentData = [
    {
      id: '1',
      unitNumber: '101',
      tenantName: 'John Smith',
      rentAmount: 2500,
      paidAmount: 2500,
      dueDate: '2024-01-01',
      status: 'paid' as const,
    },
    {
      id: '2',
      unitNumber: '102',
      tenantName: 'Sarah Johnson',
      rentAmount: 2200,
      paidAmount: 1100,
      dueDate: '2024-01-01',
      status: 'partial' as const,
    },
    {
      id: '3',
      unitNumber: '201',
      tenantName: 'Mike Davis',
      rentAmount: 2800,
      paidAmount: 0,
      dueDate: '2023-12-25',
      status: 'overdue' as const,
      daysLate: 7,
    },
    {
      id: '4',
      unitNumber: '202',
      tenantName: 'Emily Wilson',
      rentAmount: 2600,
      paidAmount: 0,
      dueDate: '2024-01-05',
      status: 'pending' as const,
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.primaryLight]}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.userName}>{user?.name || 'User'}</Text>
              <Text style={styles.userRole}>
                {isLandlord ? 'Property Manager' : 'Tenant'}
              </Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.headerIcon}>
                <Bell size={20} color={theme.colors.white} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerIcon}>
                <Settings size={20} color={theme.colors.white} />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <View style={styles.statsGrid}>
                <SkeletonCard style={styles.statCard} />
                <SkeletonCard style={styles.statCard} />
                <SkeletonCard style={styles.statCard} />
                <SkeletonCard style={styles.statCard} />
              </View>
              <SkeletonCard style={{ marginBottom: theme.spacing.lg }} />
              <SkeletonCard style={{ marginBottom: theme.spacing.lg }} />
            </View>
          ) : (
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }}
            >
              {isLandlord ? (
                <>
                  <View style={styles.statsGrid}>
                    <Animated.View style={[styles.statCard, { transform: [{ scale: fadeAnim }] }]}>
                      <GlassCard style={styles.statCardInner} depth="md" animated={true}>
                        <Building size={24} color={theme.colors.primary} />
                        <Text style={styles.statValue}>{landlordStats.totalProperties}</Text>
                        <Text style={styles.statLabel}>Properties</Text>
                      </GlassCard>
                    </Animated.View>
                    <Animated.View style={[styles.statCard, { transform: [{ scale: fadeAnim }] }]}>
                      <GlassCard style={styles.statCardInner} depth="md" animated={true}>
                        <Home size={24} color={theme.colors.gold} />
                        <Text style={styles.statValue}>{landlordStats.totalUnits}</Text>
                        <Text style={styles.statLabel}>Total Units</Text>
                      </GlassCard>
                    </Animated.View>
                    <Animated.View style={[styles.statCard, { transform: [{ scale: fadeAnim }] }]}>
                      <GlassCard style={styles.statCardInner} depth="md" animated={true}>
                        <Users size={24} color={theme.colors.warning} />
                        <Text style={styles.statValue}>{landlordStats.occupiedUnits}</Text>
                        <Text style={styles.statLabel}>Occupied</Text>
                      </GlassCard>
                    </Animated.View>
                    <Animated.View style={[styles.statCard, { transform: [{ scale: fadeAnim }] }]}>
                      <GlassCard style={styles.statCardInner} depth="md" animated={true}>
                        <DollarSign size={24} color={theme.colors.success} />
                        <Text style={styles.statValue}>${landlordStats.monthlyIncome.toLocaleString()}</Text>
                        <Text style={styles.statLabel}>Monthly Income</Text>
                      </GlassCard>
                    </Animated.View>
                  </View>

                  <View style={styles.widgetsContainer}>
                    <DynamicIslandWidget
                      type="payment"
                      title="Rent Due"
                      subtitle="3 units pending"
                      value="$7,300"
                      isExpanded={true}
                      onPress={() => console.log('Payment widget pressed')}
                    />
                    <DynamicIslandWidget
                      type="alert"
                      title="Overdue"
                      subtitle="Unit 201 - 7 days"
                      value="$2,800"
                      onPress={() => console.log('Alert widget pressed')}
                    />
                  </View>

                  <PremiumRentTracker 
                    payments={mockPaymentData}
                    onUnitPress={(payment) => {
                      console.log('Unit pressed:', payment);
                    }}
                  />

                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionTitle}>Quick Actions</Text>
                    </View>
                    <View style={styles.actionGrid}>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => {}}
                      >
                        <View style={[styles.actionIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                          <Plus size={20} color={theme.colors.primary} />
                        </View>
                        <Text style={styles.actionText}>Add Property</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actionButton}>
                        <View style={[styles.actionIcon, { backgroundColor: theme.colors.gold + '20' }]}>
                          <Users size={20} color={theme.colors.gold} />
                        </View>
                        <Text style={styles.actionText}>Invite Tenant</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actionButton}>
                        <View style={[styles.actionIcon, { backgroundColor: theme.colors.warning + '20' }]}>
                          <TrendingUp size={20} color={theme.colors.warning} />
                        </View>
                        <Text style={styles.actionText}>View Reports</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionTitle}>Recent Activity</Text>
                      <TouchableOpacity>
                        <Text style={styles.seeAll}>See All</Text>
                      </TouchableOpacity>
                    </View>
                    <Card style={styles.activityCard}>
                      <View style={styles.activityIcon}>
                        <DollarSign size={16} color={theme.colors.success} />
                      </View>
                      <View style={styles.activityContent}>
                        <Text style={styles.activityTitle}>Payment Received</Text>
                        <Text style={styles.activityDescription}>Unit 101 - $2,500</Text>
                      </View>
                      <Text style={styles.activityTime}>2h ago</Text>
                    </Card>
                    <Card style={styles.activityCard}>
                      <View style={styles.activityIcon}>
                        <AlertCircle size={16} color={theme.colors.warning} />
                      </View>
                      <View style={styles.activityContent}>
                        <Text style={styles.activityTitle}>Maintenance Request</Text>
                        <Text style={styles.activityDescription}>Unit 201 - AC Issue</Text>
                      </View>
                      <Text style={styles.activityTime}>5h ago</Text>
                    </Card>
                  </View>
                </>
              ) : (
            <>
              {upcomingPayment && (
                <Card style={styles.paymentCard}>
                  <View style={styles.paymentHeader}>
                    <View>
                      <Text style={styles.paymentLabel}>Next Payment Due</Text>
                      <Text style={styles.paymentAmount}>${upcomingPayment.amount}</Text>
                    </View>
                    <View style={styles.paymentDue}>
                      <Calendar size={16} color={theme.colors.gray[500]} />
                      <Text style={styles.paymentDueText}>
                        {new Date(upcomingPayment.dueDate).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                  <Button
                    title="Pay Now"
                    onPress={() => router.push('/payment')}
                    size="medium"
                    style={styles.payButton}
                  />
                </Card>
              )}

              {tenantUnit && (
                <Card style={styles.unitCard}>
                  <Text style={styles.cardTitle}>Your Residence</Text>
                  <View style={styles.unitInfo}>
                    <Home size={20} color={theme.colors.primary} />
                    <View style={styles.unitDetails}>
                      <Text style={styles.unitNumber}>Unit {tenantUnit.unitNumber}</Text>
                      <Text style={styles.unitAddress}>123 Main St, San Francisco</Text>
                    </View>
                  </View>
                  <View style={styles.unitStats}>
                    <View style={styles.unitStat}>
                      <Text style={styles.unitStatLabel}>Monthly Rent</Text>
                      <Text style={styles.unitStatValue}>${tenantUnit.rentAmount}</Text>
                    </View>
                    <View style={styles.unitStat}>
                      <Text style={styles.unitStatLabel}>Lease Ends</Text>
                      <Text style={styles.unitStatValue}>
                        {tenantUnit.leaseEnd ? new Date(tenantUnit.leaseEnd).toLocaleDateString() : 'N/A'}
                      </Text>
                    </View>
                  </View>
                </Card>
              )}

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.quickActions}>
                  <TouchableOpacity 
                    style={styles.quickAction}
                    onPress={() => router.push('/maintenance-request')}
                  >
                    <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.warning + '20' }]}>
                      <AlertCircle size={24} color={theme.colors.warning} />
                    </View>
                    <Text style={styles.quickActionText}>Request</Text>
                    <Text style={styles.quickActionText}>Maintenance</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.quickAction}
                    onPress={() => router.push('/chat')}
                  >
                    <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                      <AnimatedMessageIcon 
                        hasNewMessages={true}
                        size={24}
                        color={theme.colors.primary}
                      />
                    </View>
                    <Text style={styles.quickActionText}>Message</Text>
                    <Text style={styles.quickActionText}>Landlord</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.quickAction}>
                    <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.gold + '20' }]}>
                      <Calendar size={24} color={theme.colors.gold} />
                    </View>
                    <Text style={styles.quickActionText}>Schedule</Text>
                    <Text style={styles.quickActionText}>Autopay</Text>
                  </TouchableOpacity>
                </View>
              </View>
                </>
              )}
            </Animated.View>
          )}
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
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
    borderBottomLeftRadius: theme.borderRadius.xl,
    borderBottomRightRadius: theme.borderRadius.xl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  userName: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: theme.colors.white,
    marginTop: theme.spacing.xs,
  },
  userRole: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: theme.spacing.xs,
  },
  content: {
    padding: theme.spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  loadingContainer: {
    flex: 1,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
  },
  statCardInner: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.sm,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: theme.colors.text.primary,
  },
  seeAll: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '500' as const,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  actionText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: theme.colors.text.primary,
  },
  activityDescription: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  activityTime: {
    fontSize: 12,
    color: theme.colors.text.tertiary,
  },
  paymentCard: {
    marginBottom: theme.spacing.lg,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  paymentLabel: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  paymentAmount: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: theme.colors.text.primary,
  },
  paymentDue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  paymentDueText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  payButton: {
    marginTop: theme.spacing.sm,
  },
  unitCard: {
    marginBottom: theme.spacing.lg,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  unitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  unitDetails: {
    marginLeft: theme.spacing.md,
  },
  unitNumber: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: theme.colors.text.primary,
  },
  unitAddress: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  unitStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray[200],
  },
  unitStat: {
    alignItems: 'center',
  },
  unitStatLabel: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  unitStatValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: theme.colors.text.primary,
  },
  quickActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  quickActionText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  widgetsContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
});