export const theme = {
  colors: {
    // iOS 26 inspired primary colors
    primary: '#007AFF',
    primaryDark: '#0056CC',
    primaryLight: '#4DA2FF',
    secondary: '#FF9500',
    secondaryDark: '#CC7700',
    secondaryLight: '#FFB84D',
    accent: '#5856D6',
    accentLight: '#8B89FF',
    
    // Status colors
    error: '#FF3B30',
    errorLight: '#FF6B60',
    warning: '#FF9500',
    warningLight: '#FFB84D',
    success: '#34C759',
    successLight: '#6BD96B',
    
    // Premium colors
    gold: '#FFD60A',
    goldLight: '#FFED4A',
    goldDark: '#D4AF37',
    green: '#30D158',
    greenLight: '#64D787',
    greenDark: '#248A3D',
    
    // iOS 26 system grays
    gray: {
      50: '#FAFAFA',
      100: '#F5F5F7',
      200: '#E5E5EA',
      300: '#D1D1D6',
      400: '#C7C7CC',
      500: '#AEAEB2',
      600: '#8E8E93',
      700: '#636366',
      800: '#48484A',
      900: '#1C1C1E',
    },
    
    // Base colors
    white: '#FFFFFF',
    black: '#000000',
    
    // Dynamic backgrounds
    background: '#F2F2F7',
    backgroundSecondary: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceSecondary: '#F2F2F7',
    
    // Glass effects
    glass: {
      light: 'rgba(255, 255, 255, 0.8)',
      dark: 'rgba(0, 0, 0, 0.3)',
      blur: 'rgba(255, 255, 255, 0.1)',
    },
    
    // Text colors
    text: {
      primary: '#000000',
      secondary: '#8E8E93',
      tertiary: '#C7C7CC',
      light: '#AEAEB2',
      inverse: '#FFFFFF',
      link: '#007AFF',
    },
    
    // Dark mode colors
    dark: {
      background: '#000000',
      backgroundSecondary: '#1C1C1E',
      surface: '#1C1C1E',
      surfaceSecondary: '#2C2C2E',
      text: {
        primary: '#FFFFFF',
        secondary: '#AEAEB2',
        tertiary: '#636366',
      },
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '700' as const,
      lineHeight: 40,
    },
    h2: {
      fontSize: 28,
      fontWeight: '600' as const,
      lineHeight: 36,
    },
    h3: {
      fontSize: 24,
      fontWeight: '600' as const,
      lineHeight: 32,
    },
    h4: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
    },
    caption: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 16,
    },
  },
  // iOS 26 style shadows
  shadows: {
    xs: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 1,
      elevation: 1,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 3,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 8,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.16,
      shadowRadius: 24,
      elevation: 16,
    },
  },
  
  // Animation timings
  animations: {
    fast: 200,
    normal: 300,
    slow: 500,
    spring: {
      damping: 15,
      stiffness: 150,
      mass: 1,
    },
  },
  
  // Blur effects
  blur: {
    light: 20,
    medium: 40,
    heavy: 80,
  },
};