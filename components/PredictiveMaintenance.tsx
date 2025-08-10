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
  Brain,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Wrench,
  Thermometer,
  Droplets,
  Zap,
  Wind,
  Shield,
  Clock,
  DollarSign,
  CheckCircle,
} from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { GlassCard } from './GlassCard';

interface PredictiveAlert {
  id: string;
  title: string;
  description: string;
  category: 'hvac' | 'plumbing' | 'electrical' | 'structural' | 'appliance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  probability: number;
  estimatedTimeframe: string;
  estimatedCost: number;
  preventiveCost: number;
  historicalData: string;
  recommendations: string[];
  unitAffected: string;
  lastInspection?: string;
}

interface PredictiveMaintenanceProps {
  propertyId?: string;
  onScheduleMaintenance?: (alert: PredictiveAlert) => void;
  onViewDetails?: (alert: PredictiveAlert) => void;
}

const mockAlerts: PredictiveAlert[] = [
  {
    id: '1',
    title: 'HVAC Filter Replacement Due',
    description: 'Air filter efficiency dropping based on usage patterns',
    category: 'hvac',
    severity: 'medium',
    probability: 85,
    estimatedTimeframe: '2-3 weeks',
    estimatedCost: 450,
    preventiveCost: 75,
    historicalData: 'Last 3 filters lasted 2.5 months average',
    recommendations: [
      'Schedule filter replacement now',
      'Consider upgrading to HEPA filters',
      'Set up quarterly maintenance schedule'
    ],
    unitAffected: 'Building A - Units 101-104',
    lastInspection: '2023-11-15',
  },
  {
    id: '2',
    title: 'Water Heater Efficiency Decline',
    description: 'Unit 201 water heater showing signs of sediment buildup',
    category: 'plumbing',
    severity: 'high',
    probability: 92,
    estimatedTimeframe: '1-2 months',
    estimatedCost: 1200,
    preventiveCost: 180,
    historicalData: 'Similar units failed after 8 years, this is 7.5 years old',
    recommendations: [
      'Flush water heater immediately',
      'Replace anode rod',
      'Schedule professional inspection'
    ],
    unitAffected: 'Unit 201',
    lastInspection: '2023-10-20',
  },
  {
    id: '3',
    title: 'Electrical Panel Upgrade Needed',
    description: 'Circuit breaker tripping frequency increasing',
    category: 'electrical',
    severity: 'critical',
    probability: 78,
    estimatedTimeframe: '3-4 weeks',
    estimatedCost: 2500,
    preventiveCost: 350,
    historicalData: 'Breaker trips increased 40% in last 3 months',
    recommendations: [
      'Immediate electrical inspection',
      'Load balancing assessment',
      'Consider panel upgrade'
    ],
    unitAffected: 'Unit 102',
    lastInspection: '2023-09-10',
  },
  {
    id: '4',
    title: 'Roof Leak Risk Assessment',
    description: 'Weather patterns suggest potential leak points',
    category: 'structural',
    severity: 'medium',
    probability: 65,
    estimatedTimeframe: 'Next rainy season',
    estimatedCost: 3500,
    preventiveCost: 450,
    historicalData: 'Similar weather caused leaks in 2019 and 2021',
    recommendations: [
      'Inspect roof gutters',
      'Seal potential entry points',
      'Schedule professional roof assessment'
    ],
    unitAffected: 'Building A - Top floor units',
    lastInspection: '2023-08-15',
  },
];

export function PredictiveMaintenance({ 
  propertyId = 'prop-1', 
  onScheduleMaintenance, 
  onViewDetails 
}: PredictiveMaintenanceProps) {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const severityFilters = ['all', 'critical', 'high', 'medium', 'low'];

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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return theme.colors.error;
      case 'high': return theme.colors.warning;
      case 'medium': return theme.colors.primary;
      case 'low': return theme.colors.success;
      default: return theme.colors.gray[400];
    }
  };

  const getCategoryIcon = (category: string) => {
    const iconProps = { size: 20, color: theme.colors.primary };
    switch (category) {
      case 'hvac': return <Wind {...iconProps} />;
      case 'plumbing': return <Droplets {...iconProps} />;
      case 'electrical': return <Zap {...iconProps} />;
      case 'structural': return <Shield {...iconProps} />;
      case 'appliance': return <Wrench {...iconProps} />;
      default: return <Wrench {...iconProps} />;
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 90) return theme.colors.error;
    if (probability >= 70) return theme.colors.warning;
    if (probability >= 50) return theme.colors.primary;
    return theme.colors.success;
  };

  const filteredAlerts = mockAlerts.filter(alert => {
    if (selectedSeverity === 'all') return true;
    return alert.severity === selectedSeverity;
  });

  const PredictiveCard = ({ alert, index }: { alert: PredictiveAlert; index: number }) => {
    const cardAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
      Animated.timing(cardAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }).start();

      if (alert.severity === 'critical') {
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
    }, [cardAnim, pulseAnim, index, alert.severity]);

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

    const handleSchedule = () => {
      Alert.alert(
        'Schedule Maintenance',
        `Schedule preventive maintenance for "${alert.title}"?\\n\\nEstimated cost: $${alert.preventiveCost}`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Schedule', 
            onPress: () => onScheduleMaintenance?.(alert)
          },
        ]
      );
    };

    const savingsAmount = alert.estimatedCost - alert.preventiveCost;
    const savingsPercentage = Math.round((savingsAmount / alert.estimatedCost) * 100);

    return (
      <Animated.View
        style={[
          styles.alertCard,
          {
            opacity: cardAnim,
            transform: [
              { scale: scaleAnim },
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
          onPress={() => onViewDetails?.(alert)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.cardTouchable}
        >
          <GlassCard style={styles.card} depth="md">
            <View style={styles.cardHeader}>
              <View style={styles.leftHeader}>
                <View style={styles.categoryIcon}>
                  {getCategoryIcon(alert.category)}
                </View>
                <View style={styles.headerText}>
                  <Text style={styles.alertTitle}>{alert.title}</Text>
                  <Text style={styles.unitAffected}>{alert.unitAffected}</Text>
                </View>
              </View>
              <View style={styles.rightHeader}>
                <View style={[
                  styles.severityBadge,
                  { backgroundColor: getSeverityColor(alert.severity) }
                ]}>
                  <AlertTriangle size={12} color={theme.colors.white} />
                  <Text style={styles.severityText}>
                    {alert.severity.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>

            <Text style={styles.description}>{alert.description}</Text>

            <View style={styles.probabilityContainer}>
              <View style={styles.probabilityHeader}>
                <Brain size={16} color={getProbabilityColor(alert.probability)} />
                <Text style={styles.probabilityLabel}>AI Prediction</Text>
              </View>
              <View style={styles.probabilityBar}>
                <View style={styles.probabilityTrack}>
                  <Animated.View
                    style={[
                      styles.probabilityFill,
                      {
                        width: `${alert.probability}%`,
                        backgroundColor: getProbabilityColor(alert.probability),
                      },
                    ]}
                  />
                </View>
                <Text style={styles.probabilityText}>{alert.probability}% likely</Text>
              </View>
            </View>

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Clock size={14} color={theme.colors.text.secondary} />
                <Text style={styles.metaText}>{alert.estimatedTimeframe}</Text>
              </View>
              <View style={styles.metaItem}>
                <Calendar size={14} color={theme.colors.text.secondary} />
                <Text style={styles.metaText}>
                  Last: {alert.lastInspection ? new Date(alert.lastInspection).toLocaleDateString() : 'N/A'}
                </Text>
              </View>
            </View>

            <View style={styles.costComparison}>
              <View style={styles.costItem}>
                <Text style={styles.costLabel}>If ignored</Text>
                <Text style={styles.costValue}>${alert.estimatedCost}</Text>
              </View>
              <View style={styles.costDivider} />
              <View style={styles.costItem}>
                <Text style={styles.costLabel}>Preventive</Text>
                <Text style={[styles.costValue, { color: theme.colors.success }]}>
                  ${alert.preventiveCost}
                </Text>
              </View>
              <View style={styles.savingsContainer}>
                <Text style={styles.savingsText}>
                  Save ${savingsAmount} ({savingsPercentage}%)
                </Text>
              </View>
            </View>

            <View style={styles.recommendations}>
              <Text style={styles.recommendationsTitle}>AI Recommendations:</Text>
              {alert.recommendations.slice(0, 2).map((rec, idx) => (
                <View key={idx} style={styles.recommendationItem}>
                  <CheckCircle size={12} color={theme.colors.success} />
                  <Text style={styles.recommendationText}>{rec}</Text>
                </View>
              ))}
            </View>

            <View style={styles.cardActions}>
              <TouchableOpacity 
                style={styles.detailsButton}
                onPress={() => onViewDetails?.(alert)}
              >
                <TrendingUp size={16} color={theme.colors.primary} />
                <Text style={styles.detailsText}>View Analysis</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.scheduleButton}
                onPress={handleSchedule}
              >
                <LinearGradient
                  colors={[theme.colors.success, theme.colors.successLight]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.scheduleGradient}
                >
                  <Wrench size={16} color={theme.colors.white} />
                  <Text style={styles.scheduleText}>Schedule Now</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </GlassCard>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const getFilterCount = (filter: string) => {
    if (filter === 'all') return mockAlerts.length;
    return mockAlerts.filter(alert => alert.severity === filter).length;
  };

  const totalSavings = mockAlerts.reduce((sum, alert) => 
    sum + (alert.estimatedCost - alert.preventiveCost), 0
  );

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
          <Brain size={24} color={theme.colors.primary} />
          <View style={styles.headerText}>
            <Text style={styles.title}>Predictive Maintenance</Text>
            <Text style={styles.subtitle}>AI-powered insights</Text>
          </View>
        </View>
        <View style={styles.savingsBadge}>
          <DollarSign size={12} color={theme.colors.success} />
          <Text style={styles.savingsText}>Save ${totalSavings.toLocaleString()}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <View style={[styles.statIcon, { backgroundColor: theme.colors.error + '20' }]}>
            <AlertTriangle size={16} color={theme.colors.error} />
          </View>
          <Text style={styles.statValue}>
            {mockAlerts.filter(a => a.severity === 'critical').length}
          </Text>
          <Text style={styles.statLabel}>Critical</Text>
        </View>
        <View style={styles.stat}>
          <View style={[styles.statIcon, { backgroundColor: theme.colors.warning + '20' }]}>
            <Clock size={16} color={theme.colors.warning} />
          </View>
          <Text style={styles.statValue}>
            {mockAlerts.filter(a => a.severity === 'high').length}
          </Text>
          <Text style={styles.statLabel}>High Priority</Text>
        </View>
        <View style={styles.stat}>
          <View style={[styles.statIcon, { backgroundColor: theme.colors.success + '20' }]}>
            <TrendingUp size={16} color={theme.colors.success} />
          </View>
          <Text style={styles.statValue}>
            {Math.round(mockAlerts.reduce((sum, a) => sum + a.probability, 0) / mockAlerts.length)}%
          </Text>
          <Text style={styles.statLabel}>Avg Accuracy</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
        style={styles.filters}
      >
        {severityFilters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedSeverity === filter && styles.filterButtonActive
            ]}
            onPress={() => setSelectedSeverity(filter)}
          >
            <Text style={[
              styles.filterText,
              selectedSeverity === filter && styles.filterTextActive
            ]}>
              {filter.charAt(0).toUpperCase() + filter.slice(1)} ({getFilterCount(filter)})
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.alertsContainer}
      >
        {filteredAlerts.map((alert, index) => (
          <PredictiveCard key={alert.id} alert={alert} index={index} />
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
  savingsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.success + '20',
    borderRadius: theme.borderRadius.md,
  },
  savingsText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: theme.colors.success,
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
    textAlign: 'center',
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
  alertsContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  alertCard: {
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
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightHeader: {
    alignItems: 'flex-end',
  },
  severityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  severityText: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: theme.colors.white,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  unitAffected: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  description: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  probabilityContainer: {
    marginBottom: theme.spacing.md,
  },
  probabilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  probabilityLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: theme.colors.text.primary,
  },
  probabilityBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  probabilityTrack: {
    flex: 1,
    height: 6,
    backgroundColor: theme.colors.gray[200],
    borderRadius: 3,
    overflow: 'hidden',
  },
  probabilityFill: {
    height: '100%',
    borderRadius: 3,
  },
  probabilityText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: theme.colors.text.primary,
    minWidth: 60,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  metaText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  costComparison: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.gray[50],
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  costItem: {
    flex: 1,
    alignItems: 'center',
  },
  costLabel: {
    fontSize: 11,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  costValue: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: theme.colors.text.primary,
  },
  costDivider: {
    width: 1,
    height: 30,
    backgroundColor: theme.colors.gray[300],
    marginHorizontal: theme.spacing.md,
  },
  savingsContainer: {
    position: 'absolute',
    bottom: -8,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  recommendations: {
    marginBottom: theme.spacing.md,
  },
  recommendationsTitle: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  recommendationText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    flex: 1,
    lineHeight: 16,
  },
  cardActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  detailsButton: {
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
  detailsText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: theme.colors.primary,
  },
  scheduleButton: {
    flex: 1,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  scheduleGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
  },
  scheduleText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: theme.colors.white,
  },
});