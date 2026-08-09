import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/Colors';
import { LAYOUT } from '@/constants/layout';

interface SafeBottomActionsProps {
  children: React.ReactNode;
  backgroundColor?: string;
}

export const SafeBottomActions: React.FC<SafeBottomActionsProps> = ({
  children,
  backgroundColor = COLORS.background,
}) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, { backgroundColor, paddingBottom: insets.bottom }]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: LAYOUT.screenPadding,
    paddingTop: LAYOUT.spacing.md,
    paddingBottom: LAYOUT.spacing.md, // This will be combined with safe area inset
  },
});