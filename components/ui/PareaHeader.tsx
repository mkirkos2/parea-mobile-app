import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS } from '@/constants/Colors';
import { LAYOUT } from '@/constants/layout';

interface PareaHeaderProps {
  title: string;
  subtitle?: string;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  accessoryLeft?: React.ReactNode;
  accessoryRight?: React.ReactNode;
}

export const PareaHeader: React.FC<PareaHeaderProps> = ({
  title,
  subtitle,
  style,
  titleStyle,
  subtitleStyle,
  accessoryLeft,
  accessoryRight,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        {accessoryLeft && <View style={styles.accessoryLeft}>{accessoryLeft}</View>}
        <View style={styles.textContainer}>
          <Text style={[styles.title, titleStyle]} numberOfLines={1}>{title}</Text>
          {subtitle && <Text style={[styles.subtitle, subtitleStyle]} numberOfLines={1}>{subtitle}</Text>}
        </View>
        {accessoryRight && <View style={styles.accessoryRight}>{accessoryRight}</View>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: LAYOUT.screenPadding,
    paddingVertical: LAYOUT.spacing.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginHorizontal: LAYOUT.spacing.sm,
  },
  title: {
    ...LAYOUT.typography.headlineMedium,
    color: COLORS.textPrimary,
  },
  subtitle: {
    ...LAYOUT.typography.bodySmall,
    color: COLORS.textSecondary,
    marginTop: LAYOUT.spacing.xs,
  },
  accessoryLeft: {
    marginRight: LAYOUT.spacing.sm,
  },
  accessoryRight: {
    marginLeft: LAYOUT.spacing.sm,
  },
});
