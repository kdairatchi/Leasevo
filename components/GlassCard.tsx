import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Platform,
  ViewStyle,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/constants/theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  intensity?: number;
  gradient?: boolean;
  animated?: boolean;
  depth?: 'sm' | 'md' | 'lg' | 'xl';
}

export function GlassCard({
  children,
  style,
  onPress,
  intensity = 40,
  gradient = true,
  animated = true,
  depth = 'md',
}: GlassCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: theme.animations.normal,
        useNativeDriver: true,
      }).start();
    }
  }, [animated, opacityAnim]);

  const handlePressIn = () => {
    if (animated && onPress) {
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        useNativeDriver: true,
        ...theme.animations.spring,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (animated && onPress) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        ...theme.animations.spring,
      }).start();
    }
  };

  const getShadowStyle = () => {
    switch (depth) {
      case 'sm': return theme.shadows.sm;
      case 'md': return theme.shadows.md;
      case 'lg': return theme.shadows.lg;
      case 'xl': return theme.shadows.xl;
      default: return theme.shadows.md;
    }
  };

  const renderContent = () => (
    <Animated.View
      style={[
        styles.container,
        getShadowStyle(),
        style,
        animated && {
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      {Platform.OS !== 'web' ? (
        <BlurView intensity={intensity} style={styles.blur}>
          {gradient && (
            <LinearGradient
              colors={[
                'rgba(255, 255, 255, 0.1)',
                'rgba(255, 255, 255, 0.05)',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradient}
            />
          )}
          <View style={styles.content}>
            {children}
          </View>
        </BlurView>
      ) : (
        <View style={[styles.blur, styles.webGlass]}>
          {gradient && (
            <LinearGradient
              colors={[
                'rgba(255, 255, 255, 0.1)',
                'rgba(255, 255, 255, 0.05)',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradient}
            />
          )}
          <View style={styles.content}>
            {children}
          </View>
        </View>
      )}
    </Animated.View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        {renderContent()}
      </TouchableOpacity>
    );
  }

  return renderContent();
}

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  blur: {
    flex: 1,
  },
  webGlass: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    padding: theme.spacing.lg,
  },
});