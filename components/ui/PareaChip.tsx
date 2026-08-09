import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS } from '@/constants/Colors';
import { LAYOUT } from '@/constants/layout';

interface PareaChipProps {
  label: string;
  onPress?: () => void;
  selected?: boolean;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  icon?: string;
}

export const PareaChip: React.FC<PareaChipProps> = ({
  label,
  onPress,
  selected = false,
  style,
  labelStyle,
  icon,
}) => {
  return (
    <Pressable
      style={[
        styles.chip,
        selected && styles.selected,
        style,
      ]}
      onPress={onPress}
      android_ripple={{ color: COLORS.primaryLight, radius: 24 }}
    >
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={[styles.label, selected && styles.selectedLabel, labelStyle]}>
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: LAYOUT.borderRadius.full,
    paddingVertical: LAYOUT.spacing.sm,
    paddingHorizontal: LAYOUT.spacing.lg,
    marginRight: LAYOUT.spacing.sm,
    marginLeft: 0,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  icon: {
    marginRight: LAYOUT.spacing.xs,
  },
  label: {
    ...LAYOUT.typography.labelMedium,
    color: COLORS.textPrimary,
  },
  selectedLabel: {
    color: COLORS.white,
  },
});
