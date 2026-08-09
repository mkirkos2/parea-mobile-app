import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS } from '@/constants/Colors';
import { LAYOUT } from '@/constants/layout';

interface PareaCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  title?: string;
  titleStyle?: TextStyle;
  subtitle?: string;
  subtitleStyle?: TextStyle;
  footer?: React.ReactNode;
  elevated?: boolean;
}

export const PareaCard: React.FC<PareaCardProps> = ({
  children,
  style,
  title,
  titleStyle,
  subtitle,
  subtitleStyle,
  footer,
  elevated = false,
}) => {
  return (
    <View style={[styles.card, elevated && styles.elevated, style]}>
      {(title || subtitle) && (
        <View style={styles.header}>
          {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
          {subtitle && <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>}
        </View>
      )}
      <View style={styles.content}>{children}</View>
      {footer && <View style={styles.footer}>{footer}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: LAYOUT.borderRadius.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  elevated: {
    ...LAYOUT.shadows.md,
  },
  header: {
    padding: LAYOUT.screenPadding,
    paddingBottom: LAYOUT.spacing.sm,
  },
  content: {
    padding: LAYOUT.screenPadding,
  },
  footer: {
    padding: LAYOUT.screenPadding,
    paddingTop: 0,
  },
  title: {
    ...LAYOUT.typography.headlineSmall,
    color: COLORS.textPrimary,
  },
  subtitle: {
    ...LAYOUT.typography.bodySmall,
    color: COLORS.textSecondary,
    marginTop: LAYOUT.spacing.xs,
  },
});
