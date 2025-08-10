import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { MessageSquare } from 'lucide-react-native';
import { theme } from '@/constants/theme';

interface AnimatedMessageIconProps {
  hasNewMessages?: boolean;
  size?: number;
  color?: string;
}

export function AnimatedMessageIcon({ 
  hasNewMessages = false, 
  size = 24, 
  color = theme.colors.primary 
}: AnimatedMessageIconProps) {
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (hasNewMessages) {
      const bounce = Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0.9,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]);

      const pulse = Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]);

      bounce.start();
      Animated.loop(pulse, { iterations: 3 }).start();
    }
  }, [hasNewMessages, bounceAnim, pulseAnim]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.iconContainer,
          {
            transform: [
              { scale: bounceAnim },
              { scale: hasNewMessages ? pulseAnim : 1 },
            ],
          },
        ]}
      >
        <MessageSquare size={size} color={color} />
      </Animated.View>
      {hasNewMessages && (
        <View style={styles.badge}>
          <View style={styles.badgeInner} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.white,
  },
  badgeInner: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.white,
  },
});