import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Trophy,
  Star,
  Flame,
  Calendar,
  TrendingUp,
  Award,
  Target,
  Zap,
} from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { GlassCard } from './GlassCard';

const { width: screenWidth } = Dimensions.get('window');

interface PaymentStreak {
  currentStreak: number;
  longestStreak: number;
  totalPayments: number;
  onTimePayments: number;
  lastPaymentDate: string;
  nextPaymentDue: string;
  streakStartDate: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  reward?: string;
}

interface PaymentStreakTrackerProps {
  streak: PaymentStreak;
  onViewAchievements?: () => void;
  onShareStreak?: () => void;
}

const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'Perfect Start',
    description: 'Make your first on-time payment',
    icon: 'star',
    unlocked: true,
    progress: 1,
    maxProgress: 1,
    reward: '🎉 Welcome bonus!',
  },
  {
    id: '2',
    title: 'Streak Master',
    description: 'Maintain a 3-month payment streak',
    icon: 'flame',
    unlocked: true,
    progress: 3,
    maxProgress: 3,
    reward: '💰 $25 credit',
  },
  {
    id: '3',
    title: 'Consistency King',
    description: 'Make 12 consecutive on-time payments',
    icon: 'trophy',
    unlocked: false,
    progress: 8,
    maxProgress: 12,
    reward: '🏆 Premium badge',
  },
  {
    id: '4',
    title: 'Early Bird',
    description: 'Pay rent 5 days early for 3 months',
    icon: 'target',
    unlocked: false,
    progress: 1,
    maxProgress: 3,
    reward: '⚡ Priority support',
  },
];

const mockStreak: PaymentStreak = {
  currentStreak: 8,
  longestStreak: 12,
  totalPayments: 24,
  onTimePayments: 22,
  lastPaymentDate: '2024-01-01',
  nextPaymentDue: '2024-02-01',
  streakStartDate: '2023-06-01',
};

export function PaymentStreakTracker({ 
  streak = mockStreak, 
  onViewAchievements, 
  onShareStreak 
}: PaymentStreakTrackerProps) {
  const [showDetails, setShowDetails] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const flameAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        ...theme.animations.spring,
      }),
      Animated.timing(progressAnim, {
        toValue: streak.currentStreak / 12,
        duration: 1200,
        useNativeDriver: false,
      }),
    ]).start();

    // Flame animation for active streaks
    if (streak.currentStreak > 0) {
      const flameAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(flameAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(flameAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      flameAnimation.start();
    }
  }, [fadeAnim, scaleAnim, flameAnim, progressAnim, streak.currentStreak]);

  const getStreakColor = (): [string, string] => {
    if (streak.currentStreak >= 12) return [theme.colors.gold, theme.colors.goldLight];
    if (streak.currentStreak >= 6) return [theme.colors.success, theme.colors.successLight];
    if (streak.currentStreak >= 3) return [theme.colors.primary, theme.colors.primaryLight];
    return [theme.colors.gray[400], theme.colors.gray[300]];
  };

  const getStreakEmoji = () => {
    if (streak.currentStreak >= 12) return '🔥';
    if (streak.currentStreak >= 6) return '⚡';
    if (streak.currentStreak >= 3) return '✨';
    return '🎯';
  };

  const onTimePercentage = Math.round((streak.onTimePayments / streak.totalPayments) * 100);

  const AchievementBadge = ({ achievement, index }: { achievement: Achievement; index: number }) => {
    const badgeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(badgeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    }, [badgeAnim, index]);

    const getIcon = () => {
      const iconProps = { 
        size: 16, 
        color: achievement.unlocked ? theme.colors.gold : theme.colors.gray[400] 
      };
      switch (achievement.icon) {
        case 'star': return <Star {...iconProps} />;
        case 'flame': return <Flame {...iconProps} />;
        case 'trophy': return <Trophy {...iconProps} />;
        case 'target': return <Target {...iconProps} />;
        default: return <Award {...iconProps} />;
      }
    };

    return (
      <Animated.View
        style={[
          styles.achievementBadge,
          {
            opacity: badgeAnim,
            transform: [
              {
                scale: badgeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity style={styles.badgeTouchable}>
          <View style={[
            styles.badgeIcon,
            { 
              backgroundColor: achievement.unlocked 
                ? theme.colors.gold + '20' 
                : theme.colors.gray[200] 
            }
          ]}>
            {getIcon()}
          </View>
          <Text style={[
            styles.badgeTitle,
            { color: achievement.unlocked ? theme.colors.text.primary : theme.colors.text.secondary }
          ]}>
            {achievement.title}
          </Text>
          {achievement.unlocked && achievement.reward && (
            <Text style={styles.badgeReward}>{achievement.reward}</Text>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}
    >
      <GlassCard style={styles.card} depth="lg">
        <LinearGradient
          colors={getStreakColor()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Animated.View style={{ transform: [{ scale: flameAnim }] }}>
                <Text style={styles.streakEmoji}>{getStreakEmoji()}</Text>
              </Animated.View>
              <View style={styles.headerText}>
                <Text style={styles.title}>Payment Streak</Text>
                <Text style={styles.subtitle}>Keep it going!</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.shareButton}
              onPress={onShareStreak}
            >
              <TrendingUp size={20} color={theme.colors.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.streakDisplay}>
            <Text style={styles.streakNumber}>{streak.currentStreak}</Text>
            <Text style={styles.streakLabel}>Months On-Time</Text>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {streak.currentStreak}/12 to Gold Status
            </Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Trophy size={16} color={theme.colors.white} />
              <Text style={styles.statValue}>{streak.longestStreak}</Text>
              <Text style={styles.statLabel}>Best Streak</Text>
            </View>
            <View style={styles.stat}>
              <Calendar size={16} color={theme.colors.white} />
              <Text style={styles.statValue}>{streak.totalPayments}</Text>
              <Text style={styles.statLabel}>Total Payments</Text>
            </View>
            <View style={styles.stat}>
              <Star size={16} color={theme.colors.white} />
              <Text style={styles.statValue}>{onTimePercentage}%</Text>
              <Text style={styles.statLabel}>On-Time Rate</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.detailsToggle}
            onPress={() => setShowDetails(!showDetails)}
          >
            <Text style={styles.detailsText}>
              {showDetails ? 'Hide' : 'Show'} Achievements
            </Text>
            <Zap size={16} color={theme.colors.white} />
          </TouchableOpacity>

          {showDetails && (
            <Animated.View style={styles.achievementsContainer}>
              <Text style={styles.achievementsTitle}>Your Achievements</Text>
              <View style={styles.achievementsList}>
                {mockAchievements.map((achievement, index) => (
                  <AchievementBadge 
                    key={achievement.id} 
                    achievement={achievement} 
                    index={index} 
                  />
                ))}
              </View>
              <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={onViewAchievements}
              >
                <Text style={styles.viewAllText}>View All Achievements</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </LinearGradient>
      </GlassCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.lg,
  },
  card: {
    overflow: 'hidden',
  },
  gradient: {
    padding: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  streakEmoji: {
    fontSize: 32,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: theme.colors.white,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakDisplay: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  streakNumber: {
    fontSize: 48,
    fontWeight: '800' as const,
    color: theme.colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  streakLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600' as const,
    marginTop: theme.spacing.xs,
  },
  progressContainer: {
    marginBottom: theme.spacing.lg,
  },
  progressTrack: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: theme.spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '500' as const,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.lg,
  },
  stat: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: theme.colors.white,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  detailsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: theme.borderRadius.lg,
  },
  detailsText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: theme.colors.white,
  },
  achievementsContainer: {
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  achievementsTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: theme.colors.white,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  achievementsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  achievementBadge: {
    flex: 1,
    minWidth: '45%',
  },
  badgeTouchable: {
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.borderRadius.lg,
  },
  badgeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  badgeTitle: {
    fontSize: 12,
    fontWeight: '600' as const,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  badgeReward: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  viewAllButton: {
    paddingVertical: theme.spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: theme.colors.white,
  },
});