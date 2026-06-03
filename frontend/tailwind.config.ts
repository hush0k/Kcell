import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        accent: {
          DEFAULT: '#8a1bd1',
          600: '#7314b3',
          700: '#5d0f93',
          soft: '#f4e9fc',
          softer: '#faf5fe',
        },
        ink: {
          DEFAULT: '#1d1726',
          2: '#463d52',
        },
        muted: '#847b8f',
        surface: '#ffffff',
        border: {
          DEFAULT: '#ece6f3',
          2: '#ddd3e8',
        },
        done: {
          DEFAULT: '#16a34a',
          soft: '#e7f6ec',
        },
        pending: {
          DEFAULT: '#d97706',
          soft: '#fdf0dd',
        },
      },
      borderRadius: {
        sm: '10px',
        DEFAULT: '16px',
        lg: '22px',
        xl: '28px',
        full: '9999px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(31,27,24,.05), 0 1px 3px rgba(31,27,24,.06)',
        DEFAULT: '0 4px 14px rgba(31,27,24,.07), 0 2px 6px rgba(31,27,24,.05)',
        lg: '0 18px 50px rgba(31,27,24,.14), 0 6px 18px rgba(31,27,24,.08)',
        accent: '0 10px 26px rgba(138,27,209,.34)',
        'accent-hover': '0 14px 34px rgba(138,27,209,.42)',
      },
    },
  },
  plugins: [],
} satisfies Config;
