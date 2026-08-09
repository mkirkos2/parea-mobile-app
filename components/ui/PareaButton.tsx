import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { COLORS } from '@/constants/Colors';
import { LAYOUT } from '@/constants/layout';

interface PareaButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const PareaButton: React.FC<PareaButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle = {
      ...styles.base,
      ...LAYOUT.button[size],
      ...(variant === 'primary' && styles.primary),
      ...(variant === 'secondary' && styles.secondary),
      ...(variant === 'tertiary' && styles.tertiary),
      ...(variant === 'outline' && styles.outline),
      ...(variant === 'ghost' && styles.ghost),
      ...(disabled && styles.disabled),
      ...style,
    };
    
    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle = {
      ...styles.textBase,
      ...(size === 'large' && styles.textLarge),
      ...(size === 'medium' && styles.textMedium),
      ...(size === 'small' && styles.textSmall),
      ...(variant === 'primary' && styles.textPrimary),
      ...(variant === 'secondary' && styles.textSecondary),
      ...(variant === 'tertiary' && styles.textTertiary),
      ...(variant === 'outline' && styles.textOutline),
      ...(variant === 'ghost' && styles.textGhost),
      ...(disabled && styles.textDisabled),
      ...textStyle,
    };
    
    return baseTextStyle;
  };

  return (
    <Pressable
      style={({ pressed }) => [
        getButtonStyle(),
        pressed && !disabled && styles.pressed,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      android_ripple={{ color: variant === 'primary' ? COLORS.primaryLight : COLORS.gray300, radius: 24 }}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' ? COLORS.white : COLORS.primary} 
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: LAYOUT.borderRadius.md,
    borderWidth: 1,
  },
  primary: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  secondary: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  tertiary: {
    backgroundColor: COLORS.tertiary,
    borderColor: COLORS.tertiary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: COLORS.border,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
  },
  textBase: {
    fontWeight: '600',
    textAlign: 'center',
  },
  textLarge: {
    ...LAYOUT.typography.labelLarge,
  },
  textMedium: {
    ...LAYOUT.typography.labelMedium,
  },
  textSmall: {
    ...LAYOUT.typography.labelSmall,
  },
  textPrimary: {
    color: COLORS.white,
  },
  textSecondary: {
    color: COLORS.white,
  },
  textTertiary: {
    color: COLORS.white,
  },
  textOutline: {
    color: COLORS.textPrimary,
  },
  textGhost: {
    color: COLORS.primary,
  },
  textDisabled: {
    color: COLORS.textDisabled,
  },
});
