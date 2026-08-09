// Layout Constants
export const LAYOUT = {
  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // Border radius
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    full: 9999,
  },
  
  // Shadows
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.20,
      shadowRadius: 1.41,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 8,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.35,
      shadowRadius: 9.20,
      elevation: 16,
    },
  },
  
  // Screen padding
  screenPadding: 16,
  
  // Card padding
  cardPadding: 16,
  
  // Typography
  typography: {
    displayLarge: {
      fontSize: 32,
      lineHeight: 40,
      fontWeight: '700' as const,
    },
    displayMedium: {
      fontSize: 28,
      lineHeight: 36,
      fontWeight: '700' as const,
    },
    displaySmall: {
      fontSize: 24,
      lineHeight: 32,
      fontWeight: '700' as const,
    },
    headlineLarge: {
      fontSize: 22,
      lineHeight: 28,
      fontWeight: '600' as const,
    },
    headlineMedium: {
      fontSize: 20,
      lineHeight: 26,
      fontWeight: '600' as const,
    },
    headlineSmall: {
      fontSize: 18,
      lineHeight: 24,
      fontWeight: '600' as const,
    },
    titleLarge: {
      fontSize: 16,
      lineHeight: 22,
      fontWeight: '600' as const,
    },
    titleMedium: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '600' as const,
    },
    titleSmall: {
      fontSize: 12,
      lineHeight: 18,
      fontWeight: '600' as const,
    },
    bodyLarge: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400' as const,
    },
    bodyMedium: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400' as const,
    },
    bodySmall: {
      fontSize: 12,
      lineHeight: 18,
      fontWeight: '400' as const,
    },
    labelLarge: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '500' as const,
    },
    labelMedium: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '500' as const,
    },
    labelSmall: {
      fontSize: 10,
      lineHeight: 14,
      fontWeight: '500' as const,
    },
  },
  
  // Icon sizes
  icon: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
  },
  
  // Button sizes
  button: {
    large: {
      height: 48,
      paddingHorizontal: 24,
      borderRadius: 12,
    },
    medium: {
      height: 40,
      paddingHorizontal: 20,
      borderRadius: 10,
    },
    small: {
      height: 32,
      paddingHorizontal: 16,
      borderRadius: 8,
    },
  },
};

export default LAYOUT;