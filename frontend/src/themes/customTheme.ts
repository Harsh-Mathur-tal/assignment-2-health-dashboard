import { createTheme, ThemeOptions } from '@mui/material/styles';

// Custom color palette for enhanced CI/CD dashboard
const customColors = {
  primary: {
    50: '#e8f4fd',
    100: '#d1e7fb',
    200: '#a3d0f7',
    300: '#75b8f3',
    400: '#47a1ef',
    500: '#1976d2', // Main primary
    600: '#1565c0',
    700: '#1153a1',
    800: '#0d4282',
    900: '#0a3163',
  },
  secondary: {
    50: '#fdf2e8',
    100: '#fbe5d1',
    200: '#f7cca3',
    300: '#f3b275',
    400: '#ef9947',
    500: '#ed6c02', // Main secondary (orange)
    600: '#d84315',
    700: '#c23711',
    800: '#ad2b0d',
    900: '#971f0a',
  },
  success: {
    50: '#e8f5e8',
    100: '#c8e6c8',
    200: '#9dd49d',
    300: '#6ec26e',
    400: '#4caf50',
    500: '#2e7d32', // Main success
    600: '#2c6b2f',
    700: '#1b5e20',
    800: '#145218',
    900: '#0d4511',
  },
  warning: {
    50: '#fff8e1',
    100: '#ffecb3',
    200: '#ffe082',
    300: '#ffd54f',
    400: '#ffca28',
    500: '#ff9800', // Main warning
    600: '#f57c00',
    700: '#ef6c00',
    800: '#e65100',
    900: '#d84315',
  },
  error: {
    50: '#ffebee',
    100: '#ffcdd2',
    200: '#ef9a9a',
    300: '#e57373',
    400: '#ef5350',
    500: '#f44336', // Main error
    600: '#e53935',
    700: '#d32f2f',
    800: '#c62828',
    900: '#b71c1c',
  }
};

// Custom typography - distinct from Material-UI defaults
const customTypography = {
  fontFamily: [
    '"Inter"',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif'
  ].join(','),
  h1: {
    fontSize: '2.75rem',
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
  },
  h2: {
    fontSize: '2.25rem',
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h4: {
    fontSize: '1.375rem',
    fontWeight: 500,
    lineHeight: 1.4,
  },
  h5: {
    fontSize: '1.125rem',
    fontWeight: 500,
    lineHeight: 1.5,
  },
  h6: {
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: 1.5,
  },
  body1: {
    fontSize: '1rem',
    lineHeight: 1.6,
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.5,
  }
};

// Light theme configuration
const lightThemeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: customColors.primary[500],
      light: customColors.primary[300],
      dark: customColors.primary[700],
      contrastText: '#ffffff',
    },
    secondary: {
      main: customColors.secondary[500],
      light: customColors.secondary[300],
      dark: customColors.secondary[700],
      contrastText: '#ffffff',
    },
    success: {
      main: customColors.success[500],
      light: customColors.success[300],
      dark: customColors.success[700],
      contrastText: '#ffffff',
    },
    warning: {
      main: customColors.warning[500],
      light: customColors.warning[300],
      dark: customColors.warning[700],
      contrastText: '#000000',
    },
    error: {
      main: customColors.error[500],
      light: customColors.error[300],
      dark: customColors.error[700],
      contrastText: '#ffffff',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
    },
  },
  typography: customTypography,
  shape: {
    borderRadius: 12, // More rounded corners
  },
  spacing: 8,
  shadows: [
    'none',
    '0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 1px rgba(0, 0, 0, 0.14), 0px 2px 1px rgba(0, 0, 0, 0.20)',
    '0px 1px 5px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.14), 0px 3px 1px rgba(0, 0, 0, 0.20)',
    '0px 1px 8px rgba(0, 0, 0, 0.12), 0px 3px 4px rgba(0, 0, 0, 0.14), 0px 3px 3px rgba(0, 0, 0, 0.20)',
    '0px 2px 4px rgba(0, 0, 0, 0.12), 0px 4px 5px rgba(0, 0, 0, 0.14), 0px 1px 10px rgba(0, 0, 0, 0.20)',
    '0px 3px 5px rgba(0, 0, 0, 0.12), 0px 5px 8px rgba(0, 0, 0, 0.14), 0px 1px 14px rgba(0, 0, 0, 0.20)',
    '0px 3px 5px rgba(0, 0, 0, 0.12), 0px 6px 10px rgba(0, 0, 0, 0.14), 0px 1px 18px rgba(0, 0, 0, 0.20)',
    '0px 4px 5px rgba(0, 0, 0, 0.12), 0px 7px 10px rgba(0, 0, 0, 0.14), 0px 2px 16px rgba(0, 0, 0, 0.20)',
    '0px 5px 5px rgba(0, 0, 0, 0.12), 0px 8px 10px rgba(0, 0, 0, 0.14), 0px 3px 14px rgba(0, 0, 0, 0.20)',
    '0px 5px 6px rgba(0, 0, 0, 0.12), 0px 9px 12px rgba(0, 0, 0, 0.14), 0px 3px 16px rgba(0, 0, 0, 0.20)',
    '0px 6px 6px rgba(0, 0, 0, 0.12), 0px 10px 14px rgba(0, 0, 0, 0.14), 0px 4px 18px rgba(0, 0, 0, 0.20)',
    '0px 6px 7px rgba(0, 0, 0, 0.12), 0px 11px 15px rgba(0, 0, 0, 0.14), 0px 4px 20px rgba(0, 0, 0, 0.20)',
    '0px 7px 8px rgba(0, 0, 0, 0.12), 0px 12px 17px rgba(0, 0, 0, 0.14), 0px 5px 22px rgba(0, 0, 0, 0.20)',
    '0px 7px 8px rgba(0, 0, 0, 0.12), 0px 13px 19px rgba(0, 0, 0, 0.14), 0px 5px 24px rgba(0, 0, 0, 0.20)',
    '0px 7px 9px rgba(0, 0, 0, 0.12), 0px 14px 21px rgba(0, 0, 0, 0.14), 0px 5px 26px rgba(0, 0, 0, 0.20)',
    '0px 8px 9px rgba(0, 0, 0, 0.12), 0px 15px 22px rgba(0, 0, 0, 0.14), 0px 6px 28px rgba(0, 0, 0, 0.20)',
    '0px 8px 10px rgba(0, 0, 0, 0.12), 0px 16px 24px rgba(0, 0, 0, 0.14), 0px 6px 30px rgba(0, 0, 0, 0.20)',
    '0px 8px 11px rgba(0, 0, 0, 0.12), 0px 17px 26px rgba(0, 0, 0, 0.14), 0px 6px 32px rgba(0, 0, 0, 0.20)',
    '0px 9px 11px rgba(0, 0, 0, 0.12), 0px 18px 28px rgba(0, 0, 0, 0.14), 0px 7px 34px rgba(0, 0, 0, 0.20)',
    '0px 9px 12px rgba(0, 0, 0, 0.12), 0px 19px 29px rgba(0, 0, 0, 0.14), 0px 7px 36px rgba(0, 0, 0, 0.20)',
    '0px 10px 13px rgba(0, 0, 0, 0.12), 0px 20px 31px rgba(0, 0, 0, 0.14), 0px 8px 38px rgba(0, 0, 0, 0.20)',
    '0px 10px 13px rgba(0, 0, 0, 0.12), 0px 21px 33px rgba(0, 0, 0, 0.14), 0px 8px 40px rgba(0, 0, 0, 0.20)',
    '0px 10px 14px rgba(0, 0, 0, 0.12), 0px 22px 35px rgba(0, 0, 0, 0.14), 0px 8px 42px rgba(0, 0, 0, 0.20)',
    '0px 11px 14px rgba(0, 0, 0, 0.12), 0px 23px 36px rgba(0, 0, 0, 0.14), 0px 9px 44px rgba(0, 0, 0, 0.20)',
    '0px 11px 15px rgba(0, 0, 0, 0.12), 0px 24px 38px rgba(0, 0, 0, 0.14), 0px 9px 46px rgba(0, 0, 0, 0.20)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontWeight: 600,
          padding: '10px 24px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
};

// Dark theme configuration - unique dark mode
const darkThemeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#4fc3f7', // Cyan blue for dark mode
      light: '#81d4fa',
      dark: '#29b6f6',
      contrastText: '#000000',
    },
    secondary: {
      main: '#ffab40', // Bright orange for dark mode
      light: '#ffcc02',
      dark: '#ff9100',
      contrastText: '#000000',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
      contrastText: '#000000',
    },
    warning: {
      main: '#ffb74d',
      light: '#ffcc02',
      dark: '#ffa726',
      contrastText: '#000000',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
      contrastText: '#ffffff',
    },
    background: {
      default: '#0a0e1a', // Very dark blue background
      paper: '#1a1d2e',   // Dark blue-gray for cards
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
  typography: {
    ...customTypography,
    allVariants: {
      color: '#ffffff',
    },
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1d2e',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1a1d2e',
          borderRight: '1px solid rgba(255, 255, 255, 0.12)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontWeight: 600,
          padding: '10px 24px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundImage: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: '#1a1d2e',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
};

// Create themes
export const lightTheme = createTheme(lightThemeOptions);
export const darkTheme = createTheme(darkThemeOptions);

// Theme configuration object
export const themeConfig = {
  light: lightTheme,
  dark: darkTheme,
  default: 'light' as 'light' | 'dark',
};

// Export theme selector utility
export const getTheme = (mode: 'light' | 'dark') => {
  return mode === 'dark' ? darkTheme : lightTheme;
};
