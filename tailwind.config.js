/** @type {import('tailwindcss').Config} */
// Valent Trust design tokens per docs/20-design-system.md.
// Light-surface, low-chroma, three semantic tones + one brand accent.
// Everything in here is load-bearing for the UI — do not add ad-hoc colors in components.

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Surface tones — light paper.
        paper: {
          0: '#FFFFFF',
          50: '#F8F9FB',
          100: '#F1F3F7',
          200: '#E6E9F0',
          300: '#D5D9E2',
          400: '#BAC0CC',
        },
        // Ink tones — text.
        ink: {
          400: '#9099AA',
          500: '#6B7388',
          600: '#4B5669',
          700: '#344055',
          800: '#1A2233',
          900: '#0B1220',
        },
        // Semantic tones — exactly three.
        ok: {
          DEFAULT: '#10B981', // emerald — pass / ready / healthy
          50: '#ECFDF5',
          100: '#D1FAE5',
          700: '#047857',
        },
        warn: {
          DEFAULT: '#F59E0B', // amber — pending / aging
          50: '#FFFBEB',
          100: '#FEF3C7',
          700: '#B45309',
        },
        block: {
          DEFAULT: '#EF4444', // red — fail / missing / blocked
          50: '#FEF2F2',
          100: '#FEE2E2',
          700: '#B91C1C',
        },
        // Brand accent — cyan. Never used to encode data.
        // `ink` is the darker text-safe variant for labels on accent-tinted
        // surfaces (e.g. the "good extraction" captured-field chip). Still
        // a brand marker, not a semantic encoding.
        accent: {
          DEFAULT: '#22D3EE',
          soft: 'rgba(34, 211, 238, 0.25)',
          ink: '#0E7490',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        // Scale per design system.
        xs: ['11px', { lineHeight: '16px' }],
        sm: ['13px', { lineHeight: '18px' }],
        base: ['14px', { lineHeight: '20px' }],
        lg: ['16px', { lineHeight: '22px' }],
        xl: ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '36px' }],
        '4xl': ['36px', { lineHeight: '42px' }],
      },
      borderRadius: {
        md: '6px',
        lg: '8px',
        xl: '12px',
        '2xl': '16px',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(11, 18, 32, 0.04)',
        md: '0 8px 24px -6px rgba(11, 18, 32, 0.12), 0 2px 6px -2px rgba(11, 18, 32, 0.08)',
        focus: '0 0 0 3px rgba(34, 211, 238, 0.25)',
      },
      keyframes: {
        'pulse-soft': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.55', transform: 'scale(0.9)' },
        },
        'boot-shimmer': {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(350%)' },
        },
      },
      animation: {
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'boot-shimmer': 'boot-shimmer 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
