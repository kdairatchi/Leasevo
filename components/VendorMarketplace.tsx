import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import {
  Wrench,
  Star,
  MapPin,
  Phone,
  Clock,
  DollarSign,
  CheckCircle,
  Calendar,
  Zap,
  Shield,
  Award,
} from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { GlassCard } from './GlassCard';

const { width: screenWidth } = Dimensions.get('window');

interface Vendor {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  distance: string;
  phone: string;
  hourlyRate: number;
  availability: 'available' | 'busy' | 'unavailable';
  specialties: string[];
  verified: boolean;
  responseTime: string;
  completedJobs: number;
  image?: string;
}

interface VendorMarketplaceProps {
  onVendorSelect?: (vendor: Vendor) => void;
  onBookNow?: (vendor: Vendor) => void;
}

const mockVendors: Vendor[] = [
  {
    id: '1',
    name: 'Mike\'s Plumbing Pro',
    category: 'Plumbing',
    rating: 4.9,
    reviewCount: 127,
    distance: '0.8 mi',
    phone: '(555) 123-4567',
    hourlyRate: 85,
    availability: 'available',
    specialties: ['Emergency Repairs', 'Pipe Installation', 'Water Heaters'],
    verified: true,
    responseTime: '< 30 min',
    completedJobs: 340,
  },
  {
    id: '2',
    name: 'Elite Electric Solutions',
    category: 'Electrical',
    rating: 4.8,
    reviewCount: 89,
    distance: '1.2 mi',
    phone: '(555) 987-6543',
    hourlyRate: 95,
    availability: 'busy',
    specialties: ['Wiring', 'Panel Upgrades', 'Smart Home'],
    verified: true,
    responseTime: '< 1 hour',
    completedJobs: 256,
  },
  {
    id: '3',
    name: 'HVAC Masters',
    category: 'HVAC',
    rating: 4.7,
    reviewCount: 203,
    distance: '2.1 mi',
    phone: '(555) 456-7890',
    hourlyRate: 110,
    availability: 'available',
    specialties: ['AC Repair', 'Heating Systems', 'Duct Cleaning'],
    verified: true,
    responseTime: '< 45 min',
    completedJobs: 512,
  },
];

export function VendorMarketplace({ onVendorSelect, onBookNow }: VendorMarketplaceProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const scrollX = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const categories = ['All', 'Plumbing', 'Electrical', 'HVAC', 'Handyman', 'Cleaning'];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return theme.colors.success;
      case 'busy': return theme.colors.warning;
      case 'unavailable': return theme.colors.error;
      default: return theme.colors.gray[400];
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'available': return 'Available Now';
      case 'busy': return 'Busy';
      case 'unavailable': return 'Unavailable';
      default: return 'Unknown';
    }
  };

  const VendorCard = ({ vendor, index }: { vendor: Vendor; index: number }) => {
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

    return (
      <Animated.View
        style={[
          styles.vendorCard,
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
          onPress={() => onVendorSelect?.(vendor)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.cardTouchable}
        >
          <GlassCard style={styles.card} depth="lg">
            <View style={styles.cardHeader}>
              <View style={styles.vendorInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.vendorName}>{vendor.name}</Text>
                  {vendor.verified && (
                    <View style={styles.verifiedBadge}>
                      <Shield size={12} color={theme.colors.success} />
                    </View>
                  )}
                </View>
                <Text style={styles.vendorCategory}>{vendor.category}</Text>
              </View>
              <View style={[
                styles.availabilityBadge,
                { backgroundColor: getAvailabilityColor(vendor.availability) + '20' }
              ]}>
                <View style={[
                  styles.availabilityDot,
                  { backgroundColor: getAvailabilityColor(vendor.availability) }
                ]} />
                <Text style={[
                  styles.availabilityText,
                  { color: getAvailabilityColor(vendor.availability) }
                ]}>
                  {getAvailabilityText(vendor.availability)}
                </Text>
              </View>
            </View>

            <View style={styles.ratingRow}>
              <View style={styles.rating}>
                <Star size={14} color={theme.colors.gold} fill={theme.colors.gold} />
                <Text style={styles.ratingText}>{vendor.rating}</Text>
                <Text style={styles.reviewCount}>({vendor.reviewCount})</Text>
              </View>
              <View style={styles.distance}>
                <MapPin size={12} color={theme.colors.text.secondary} />
                <Text style={styles.distanceText}>{vendor.distance}</Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Clock size={12} color={theme.colors.primary} />
                <Text style={styles.statText}>{vendor.responseTime}</Text>
              </View>
              <View style={styles.stat}>
                <Award size={12} color={theme.colors.gold} />
                <Text style={styles.statText}>{vendor.completedJobs} jobs</Text>
              </View>
              <View style={styles.stat}>
                <DollarSign size={12} color={theme.colors.success} />
                <Text style={styles.statText}>${vendor.hourlyRate}/hr</Text>
              </View>
            </View>

            <View style={styles.specialties}>
              {vendor.specialties.slice(0, 2).map((specialty, idx) => (
                <View key={idx} style={styles.specialtyTag}>
                  <Text style={styles.specialtyText}>{specialty}</Text>
                </View>
              ))}
              {vendor.specialties.length > 2 && (
                <View style={styles.moreTag}>
                  <Text style={styles.moreText}>+{vendor.specialties.length - 2}</Text>
                </View>
              )}
            </View>

            <View style={styles.cardActions}>
              <TouchableOpacity style={styles.contactButton}>
                <Phone size={16} color={theme.colors.primary} />
                <Text style={styles.contactText}>Contact</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.bookButton,
                  vendor.availability !== 'available' && styles.bookButtonDisabled
                ]}
                onPress={() => onBookNow?.(vendor)}
                disabled={vendor.availability !== 'available'}
              >
                <LinearGradient
                  colors={vendor.availability === 'available' 
                    ? [theme.colors.primary, theme.colors.primaryLight]
                    : [theme.colors.gray[400], theme.colors.gray[300]]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.bookGradient}
                >
                  <Zap size={16} color={theme.colors.white} />
                  <Text style={styles.bookText}>Book Now</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </GlassCard>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Wrench size={24} color={theme.colors.primary} />
          <View style={styles.headerText}>
            <Text style={styles.title}>Vendor Marketplace</Text>
            <Text style={styles.subtitle}>Trusted local contractors</Text>
          </View>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
        style={styles.categories}
      >
        {categories.map((category, index) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category && styles.categoryTextActive
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.vendorsContainer}
      >
        {mockVendors.map((vendor, index) => (
          <VendorCard key={vendor.id} vendor={vendor} index={index} />
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
  categories: {
    marginBottom: theme.spacing.lg,
  },
  categoriesContainer: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  categoryButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.gray[100],
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryButtonActive: {
    backgroundColor: theme.colors.primary + '20',
    borderColor: theme.colors.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: theme.colors.text.secondary,
  },
  categoryTextActive: {
    color: theme.colors.primary,
    fontWeight: '600' as const,
  },
  vendorsContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  vendorCard: {
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
  vendorInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  vendorName: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: theme.colors.text.primary,
  },
  verifiedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.success + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vendorCategory: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  availabilityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: theme.colors.text.primary,
  },
  reviewCount: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  distance: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  distanceText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  statText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    fontWeight: '500' as const,
  },
  specialties: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
  },
  specialtyTag: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.primary + '10',
    borderRadius: theme.borderRadius.sm,
  },
  specialtyText: {
    fontSize: 11,
    color: theme.colors.primary,
    fontWeight: '500' as const,
  },
  moreTag: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.gray[200],
    borderRadius: theme.borderRadius.sm,
  },
  moreText: {
    fontSize: 11,
    color: theme.colors.text.secondary,
    fontWeight: '500' as const,
  },
  cardActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  contactButton: {
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
  contactText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: theme.colors.primary,
  },
  bookButton: {
    flex: 1,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  bookButtonDisabled: {
    opacity: 0.6,
  },
  bookGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
  },
  bookText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: theme.colors.white,
  },
});