import React from 'react';
import { View, ScrollView, StyleSheet, ViewStyle, ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/Colors';

interface PareaScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
  scrollable?: boolean;
  scrollViewProps?: ScrollViewProps;
  backgroundColor?: string;
  bottomSpacing?: boolean; // Add bottom spacing for bottom navigation
}

export const PareaScreen: React.FC<PareaScreenProps> = ({
  children,
  style,
  scrollable = false,
  scrollViewProps = {},
  backgroundColor = COLORS.background,
  bottomSpacing = false,
}) => {
  const insets = useSafeAreaInsets();

  const containerStyle = [
    styles.container,
    { 
      backgroundColor,
      paddingTop: insets.top,
      paddingBottom: bottomSpacing ? insets.bottom + 80 : insets.bottom, // Add extra space for bottom navigation
      paddingLeft: insets.left,
      paddingRight: insets.right,
    },
    style,
  ];

  if (scrollable) {
    return (
      <ScrollView
        style={containerStyle}
        contentContainerStyle={[styles.scrollContent, bottomSpacing && styles.bottomSpacing]}
        showsVerticalScrollIndicator={false}
        {...scrollViewProps}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View style={containerStyle}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  bottomSpacing: {
    paddingBottom: 80, // Extra space for bottom navigation
  },
});
