import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: boolean;
  shadow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  padding = true,
  shadow = true,
}) => {
  return (
    <View
      style={[
        styles.card,
        padding && styles.padding,
        shadow && theme.shadows.md,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
  },
  padding: {
    padding: theme.spacing.md,
  },
});