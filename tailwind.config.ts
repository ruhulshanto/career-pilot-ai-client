import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './features/**/*.{ts,tsx}',
    './providers/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B1120',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'rgba(255, 255, 255, 0.06)',
          foreground: 'hsl(var(--card-foreground))'
        },
        primary: {
          DEFAULT: '#4F46E5',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: '#7C3AED',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        accent: {
          DEFAULT: '#06B6D4',
          foreground: 'hsl(var(--accent-foreground))'
        },
        muted: 'hsl(var(--muted))',
        border: 'rgba(255, 255, 255, 0.08)'
      },
      borderRadius: {
        '3xl': '2rem',
        '2xl': '1.5rem',
        xl: '1rem',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      animation: {
        'bounce-slow': 'bounce-slow 3s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.5s ease-out'
      },
      keyframes: {
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
};

export default config;

