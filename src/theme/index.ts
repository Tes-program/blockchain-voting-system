// src/theme/index.ts
import { extendTheme } from '@chakra-ui/react';

const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
    600: '#3182ce',
    500: '#4299e1',
  },
  secondary: {
    900: '#324d67',
    800: '#3e5f81',
    700: '#4a729b',
    600: '#5584b5',
    500: '#6096cf',
  },
  success: {
    500: '#38a169',
  },
  warning: {
    500: '#d69e2e',
  },
  error: {
    500: '#e53e3e',
  },
};

const theme = extendTheme({
  colors,
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
        borderRadius: 'md',
      },
      variants: {
        solid: {
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600',
          },
        },
        outline: {
          border: '2px solid',
          borderColor: 'brand.500',
          color: 'brand.500',
        },
        secondary: {
          bg: 'secondary.500',
          color: 'white',
          _hover: {
            bg: 'secondary.600',
          },
        },
      },
    },
  },
});

export default theme;