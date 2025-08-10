import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Calendar,
  MapPin,
  Bell,
  TrendingUp,
  Scale,
  Home,
  DollarSign,
} from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { GlassCard } from './GlassCard';

interface ComplianceItem {
  id: string;
  title: string;
  description: string;
  type: 'inspection' | 'rent_cap' | 'notice' | 'license' | 'insurance';
  status: 'compliant' | 'warning' | 'overdue' | 'upcoming';
  dueDate: string;
  location?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionRequired?: string;
  estimatedCost?: number;
}

interface ComplianceCenterProps {
  propertyZipCode?: string;
  onItemPress?: (item: ComplianceItem) => void;
  onScheduleReminder?: (item: ComplianceItem) => void;
}

const mockComplianceItems: ComplianceItem[] = [
  {
    id: '1',
    title: 'Annual Fire Safety Inspection',
    description: 'Required fire safety inspection for multi-unit properties',
    type: 'inspection',
    status: 'upcoming',
    dueDate: '2024-02-15',
    location: 'San Francisco, CA',
    priority: 'high',
    actionRequired: 'Schedule with certified inspector',
    estimatedCost: 350,
  },
  {
    id: '2',
    title: 'Rent Increase Notice Period',
    description: 'SF requires 30-day notice for rent increases under 10%',
    type: 'notice',
    status: 'compliant',
    dueDate: '2024-01-30',
    location: 'San Francisco, CA',
    priority: 'medium',
  },
  {
    id: '3',
    title: 'Property Insurance Renewal',
    description: 'Landlord insurance policy expires soon',
    type: 'insurance',
    status: 'warning',
    dueDate: '2024-01-20',
    priority: 'critical',
    actionRequired: 'Contact insurance provider',
    estimatedCost: 2400,
  },
  {
    id: '4',
    title: 'Rent Stabilization Ordinance',
    description: 'Annual rent increase cap: 3.2% for 2024',
    type: 'rent_cap',
    status: 'compliant',
    dueDate: '2024-12-31',
    location: 'San Francisco, CA',
    priority: 'low',
  },
  {
    id: '5',
    title: 'Business License Renewal',
    description: 'City business license for rental property',
    type: 'license',
    status: 'overdue',
    dueDate: '2024-01-01',
    location: 'San Francisco, CA',
    priority: 'critical',
    actionRequired: 'Renew immediately to avoid penalties',
    estimatedCost: 150,
  },
];

export function ComplianceCenter({ 
  propertyZipCode = '94102', 
  onItemPress, 
  onScheduleReminder 
}: ComplianceCenterProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const filters = ['all', 'overdue', 'upcoming', 'compliant'];

  useEffect(() => {
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
  }, [fadeAnim, slideAnim]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return theme.colors.success;
      case 'warning': return theme.colors.warning;
      case 'overdue': return theme.colors.error;
      case 'upcoming': return theme.colors.primary;
      default: return theme.colors.gray[400];
    }
  };

  const getStatusIcon = (status: string) => {
    const iconProps = { size: 16, color: theme.colors.white };
    switch (status) {
      case 'compliant': return <CheckCircle {...iconProps} />;
      case 'warning': return <AlertTriangle {...iconProps} />;
      case 'overdue': return <AlertTriangle {...iconProps} />;
      case 'upcoming': return <Clock {...iconProps} />;
      default: return <Shield {...iconProps} />;
    }
  };

  const getTypeIcon = (type: string) => {
    const iconProps = { size: 20, color: theme.colors.primary };
    switch (type) {
      case 'inspection': return <Shield {...iconProps} />;
      case 'rent_cap': return <DollarSign {...iconProps} />;
      case 'notice': return <FileText {...iconProps} />;
      case 'license': return <Scale {...iconProps} />;
      case 'insurance': return <Home {...iconProps} />;
      default: return <Shield {...iconProps} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return theme.colors.error;
      case 'high': return theme.colors.warning;
      case 'medium': return theme.colors.primary;
      case 'low': return theme.colors.success;
      default: return theme.colors.gray[400];
    }
  };

  const filteredItems = mockComplianceItems.filter(item => {
    if (selectedFilter === 'all') return true;
    return item.status === selectedFilter;
  });

  const ComplianceCard = ({ item, index }: { item: ComplianceItem; index: number }) => {
    const cardAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
      Animated.timing(cardAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    }, [cardAnim, index]);

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        useNativeDriver: true,
        ...theme.animations.spring,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        ...theme.animations.spring,
      }).start();
    };

    const handleScheduleReminder = () => {
      Alert.alert(
        'Schedule Reminder',
        `Set a reminder for "${item.title}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Schedule', 
            onPress: () => onScheduleReminder?.(item)
          },
        ]
      );
    };

    return (
      <Animated.View
        style={[
          styles.complianceCard,
          {
            opacity: cardAnim,
            transform: [
              { scale: scaleAnim },
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
          onPress={() => onItemPress?.(item)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.cardTouchable}
        >
          <GlassCard style={styles.card} depth="md">
            <View style={styles.cardHeader}>
              <View style={styles.leftHeader}>
                <View style={styles.typeIcon}>
                  {getTypeIcon(item.type)}
                </View>
                <View style={styles.headerText}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  {item.location && (
                    <View style={styles.locationRow}>
                      <MapPin size={12} color={theme.colors.text.secondary} />
                      <Text style={styles.locationText}>{item.location}</Text>
                    </View>
                  )}
                </View>
              </View>
              <View style={styles.rightHeader}>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(item.status) }
                ]}>
                  {getStatusIcon(item.status)}
                </View>
                <View style={[
                  styles.priorityDot,
                  { backgroundColor: getPriorityColor(item.priority) }
                ]} />
              </View>
            </View>

            <Text style={styles.description}>{item.description}</Text>

            <View style={styles.cardMeta}>
              <View style={styles.dueDateContainer}>
                <Calendar size={14} color={theme.colors.text.secondary} />
                <Text style={styles.dueDateText}>
                  Due: {new Date(item.dueDate).toLocaleDateString()}
                </Text>
              </View>
              {item.estimatedCost && (
                <View style={styles.costContainer}>
                  <DollarSign size={14} color={theme.colors.success} />
                  <Text style={styles.costText}>
                    Est. ${item.estimatedCost}
                  </Text>
                </View>
              )}
            </View>

            {item.actionRequired && (
              <View style={styles.actionRequired}>
                <AlertTriangle size={14} color={theme.colors.warning} />
                <Text style={styles.actionText}>{item.actionRequired}</Text>
              </View>
            )}

            <View style={styles.cardActions}>
              <TouchableOpacity 
                style={styles.reminderButton}
                onPress={handleScheduleReminder}
              >
                <Bell size={16} color={theme.colors.primary} />
                <Text style={styles.reminderText}>Remind Me</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.viewButton}>
                <LinearGradient
                  colors={[theme.colors.primary, theme.colors.primaryLight]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.viewGradient}
                >
                  <FileText size={16} color={theme.colors.white} />
                  <Text style={styles.viewText}>View Details</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </GlassCard>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const getFilterCount = (filter: string) => {
    if (filter === 'all') return mockComplianceItems.length;
    return mockComplianceItems.filter(item => item.status === filter).length;
  };

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Shield size={24} color={theme.colors.primary} />
          <View style={styles.headerText}>
            <Text style={styles.title}>Compliance Center</Text>
            <Text style={styles.subtitle}>Stay compliant with local laws</Text>
          </View>
        </View>
        <View style={styles.locationBadge}>
          <MapPin size={12} color={theme.colors.primary} />
          <Text style={styles.locationBadgeText}>{propertyZipCode}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <View style={[styles.statIcon, { backgroundColor: theme.colors.success + '20' }]}>
            <CheckCircle size={16} color={theme.colors.success} />
          </View>
          <Text style={styles.statValue}>
            {mockComplianceItems.filter(i => i.status === 'compliant').length}
          </Text>
          <Text style={styles.statLabel}>Compliant</Text>
        </View>
        <View style={styles.stat}>
          <View style={[styles.statIcon, { backgroundColor: theme.colors.warning + '20' }]}>
            <Clock size={16} color={theme.colors.warning} />
          </View>
          <Text style={styles.statValue}>
            {mockComplianceItems.filter(i => i.status === 'upcoming').length}
          </Text>
          <Text style={styles.statLabel}>Upcoming</Text>
        </View>
        <View style={styles.stat}>
          <View style={[styles.statIcon, { backgroundColor: theme.colors.error + '20' }]}>
            <AlertTriangle size={16} color={theme.colors.error} />
          </View>
          <Text style={styles.statValue}>
            {mockComplianceItems.filter(i => i.status === 'overdue').length}
          </Text>
          <Text style={styles.statLabel}>Overdue</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
        style={styles.filters}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.filterButtonActive
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text style={[
              styles.filterText,
              selectedFilter === filter && styles.filterTextActive
            ]}>
              {filter.charAt(0).toUpperCase() + filter.slice(1)} ({getFilterCount(filter)})
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.itemsContainer}
      >
        {filteredItems.map((item, index) => (
          <ComplianceCard key={item.id} item={item} index={index} />
        ))}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    flex: 1,
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
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.primary + '20',
    borderRadius: theme.borderRadius.md,
  },
  locationBadgeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: theme.colors.primary,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  filters: {
    marginBottom: theme.spacing.lg,
  },
  filtersContainer: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  filterButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.gray[100],
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary + '20',
    borderColor: theme.colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: theme.colors.text.secondary,
  },
  filterTextActive: {
    color: theme.colors.primary,
    fontWeight: '600' as const,
  },
  itemsContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  complianceCard: {
    marginBottom: theme.spacing.sm,
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
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  leftHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
    flex: 1,
  },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightHeader: {
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  statusBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  locationText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  description: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  cardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  dueDateText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    fontWeight: '500' as const,
  },
  costContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  costText: {
    fontSize: 12,
    color: theme.colors.success,
    fontWeight: '600' as const,
  },
  actionRequired: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.warning + '10',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  actionText: {
    fontSize: 12,
    color: theme.colors.warning,
    fontWeight: '500' as const,
    flex: 1,
  },
  cardActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  reminderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.primary + '10',
    borderWidth: 1,
    borderColor: theme.colors.primary + '30',
  },
  reminderText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: theme.colors.primary,
  },
  viewButton: {
    flex: 1,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  viewGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
  },
  viewText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: theme.colors.white,
  },
});