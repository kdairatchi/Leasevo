import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  DollarSign, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp
} from 'lucide-react-native';
import { theme } from '@/constants/theme';

interface DynamicIslandWidgetProps {
  type: 'payment' | 'alert' | 'success' | 'countdown';
  title: string;
  subtitle?: string;
  value?: string;
  onPress?: () => void;
  isExpanded?: boolean;
}

export function DynamicIslandWidget({
  type,
  title,
  subtitle,
  value,
  onPress,
  isExpanded = false,
}: DynamicIslandWidgetProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const expandAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [, setIsPressed] = useState(false);

  useEffect(() => {
    if (isExpanded) {
      Animated.spring(expandAnim, {
        toValue: 1,
        useNativeDriver: false,
        ...theme.animations.spring,
      }).start();
    } else {
      Animated.spring(expandAnim, {
        toValue: 0,
        useNativeDriver: false,
        ...theme.animations.spring,
      }).start();
    }
  }, [isExpanded, expandAnim]);

  useEffect(() => {
    if (type === 'alert') {
      const pulse = Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]);
      Animated.loop(pulse).start();
    }
  }, [type, pulseAnim]);

  const handlePressIn = () => {
    setIsPressed(true);
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      ...theme.animations.spring,
    }).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      ...theme.animations.spring,
    }).start();
  };

  const getIcon = () => {
    const iconProps = { size: 16, color: theme.colors.white };
    switch (type) {
      case 'payment': return <DollarSign {...iconProps} />;
      case 'alert': return <AlertTriangle {...iconProps} />;
      case 'success': return <CheckCircle {...iconProps} />;
      case 'countdown': return <Clock {...iconProps} />;
      default: return <TrendingUp {...iconProps} />;
    }
  };

  const getGradientColors = (): [string, string] => {
    switch (type) {
      case 'payment': return [theme.colors.success, theme.colors.successLight];
      case 'alert': return [theme.colors.error, theme.colors.errorLight];
      case 'success': return [theme.colors.green, theme.colors.greenLight];
      case 'countdown': return [theme.colors.primary, theme.colors.primaryLight];
      default: return [theme.colors.gray[800], theme.colors.gray[700]];
    }
  };

  const widthScale = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [120, 280],
  });

  const heightScale = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [36, 80],
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.widget,
          {
            width: widthScale,
            height: heightScale,
            transform: [
              { scale: scaleAnim },
              { scale: pulseAnim }
            ],
          },
        ]}
      >
        <LinearGradient
          colors={getGradientColors()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {Platform.OS !== 'web' ? (
            <BlurView intensity={20} style={styles.blur}>
              <View style={styles.content}>
                <View style={styles.iconContainer}>
                  {getIcon()}
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.title} numberOfLines={1}>
                    {title}
                  </Text>
                  {isExpanded && subtitle && (
                    <Animated.Text
                      style={[
                        styles.subtitle,
                        {
                          opacity: expandAnim,
                        },
                      ]}
                      numberOfLines={1}
                    >
                      <Text>{subtitle}</Text>
                    </Animated.Text>
                  )}
                </View>
                {value && (
                  <Text style={styles.value} numberOfLines={1}>
                    {value}
                  </Text>
                )}
              </View>
            </BlurView>
          ) : (
            <View style={[styles.blur, styles.webBlur]}>
              <View style={styles.content}>
                <View style={styles.iconContainer}>
                  {getIcon()}
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.title} numberOfLines={1}>
                    {title}
                  </Text>
                  {isExpanded && subtitle && (
                    <Animated.Text
                      style={[
                        styles.subtitle,
                        {
                          opacity: expandAnim,
                        },
                      ]}
                      numberOfLines={1}
                    >
                      <Text>{subtitle}</Text>
                    </Animated.Text>
                  )}
                </View>
                {value && (
                  <Text style={styles.value} numberOfLines={1}>
                    {value}
                  </Text>
                )}
              </View>
            </View>
          )}
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: theme.spacing.sm,
  },
  widget: {
    width: 120,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  gradient: {
    flex: 1,
  },
  blur: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  webBlur: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: theme.colors.white,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '400' as const,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  value: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: theme.colors.white,
  },
});