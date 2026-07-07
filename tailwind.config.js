/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void: {
          50:  '#f5f0e8',
          100: '#ede6d4',
          200: '#d9ccad',
          300: '#c4ad84',
          400: '#b0905e',
          500: '#9a7545',
          600: '#7e5f37',
          700: '#63492c',
          800: '#483421',
          900: '#2d1f14',
          950: '#120c07',
        },
        ink: {
          50:  '#f2f2f2',
          100: '#e0e0e0',
          200: '#b8b8b8',
          300: '#909090',
          400: '#686868',
          500: '#404040',
          600: '#2a2a2a',
          700: '#1a1a1a',
          800: '#111111',
          900: '#080808',
          950: '#030303',
        },
        gold: {
          light:  '#f0d9a8',
          DEFAULT: '#c9a96e',
          dark:   '#9b7a42',
          glow:   'rgba(201,169,110,0.25)',
        },
        cream: {
          DEFAULT: '#f5f0e8',
          soft:    '#ede6d4',
          muted:   '#c4b8a0',
        },
        mystic: {
          teal:   '#4ecdc4',
          violet: '#7b68ee',
          rose:   '#c9647a',
        },
      },
      fontFamily: {
        serif:  ['Cormorant Garant', 'Playfair Display', 'Georgia', 'serif'],
        sans:   ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono:   ['JetBrains Mono', 'monospace'],
        display:['Cormorant Garant', 'serif'],
      },
      letterSpacing: {
        widest: '0.3em',
        ultra:  '0.5em',
      },
      backgroundImage: {
        'gold-gradient':  'linear-gradient(135deg, #f0d9a8 0%, #c9a96e 50%, #9b7a42 100%)',
        'ink-gradient':   'linear-gradient(180deg, #0a0a0a 0%, #111111 100%)',
        'radial-glow':    'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
        'star-texture':   "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Ccircle cx='50' cy='80' r='1' fill='rgba(255,255,255,0.4)'/%3E%3Ccircle cx='120' cy='30' r='0.5' fill='rgba(255,255,255,0.6)'/%3E%3Ccircle cx='200' cy='150' r='1.5' fill='rgba(255,255,255,0.3)'/%3E%3Ccircle cx='320' cy='60' r='1' fill='rgba(255,255,255,0.5)'/%3E%3Ccircle cx='380' cy='200' r='0.5' fill='rgba(255,255,255,0.7)'/%3E%3Ccircle cx='80' cy='300' r='1' fill='rgba(255,255,255,0.4)'/%3E%3Ccircle cx='260' cy='350' r='0.5' fill='rgba(255,255,255,0.6)'/%3E%3Ccircle cx='350' cy='320' r='1.5' fill='rgba(255,255,255,0.3)'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'gold':       '0 0 20px rgba(201,169,110,0.3), 0 0 60px rgba(201,169,110,0.1)',
        'gold-lg':    '0 0 40px rgba(201,169,110,0.4), 0 0 80px rgba(201,169,110,0.15)',
        'inner-dark': 'inset 0 2px 20px rgba(0,0,0,0.6)',
        'card':       '0 8px 40px rgba(0,0,0,0.6)',
        'arch':       '0 20px 60px rgba(0,0,0,0.8)',
      },
      animation: {
        'twinkle':    'twinkle 3s ease-in-out infinite alternate',
        'twinkle-2':  'twinkle 4.5s ease-in-out infinite alternate',
        'twinkle-3':  'twinkle 6s ease-in-out infinite alternate',
        'float':      'float 8s ease-in-out infinite',
        'float-slow': 'float 12s ease-in-out infinite reverse',
        'scan':       'scanLine 2s ease-in-out infinite',
        'fade-up':    'fadeUp 0.6s ease-out forwards',
        'fade-in':    'fadeIn 0.4s ease-out forwards',
        'glow-pulse': 'goldPulse 3s ease-in-out infinite',
        'radar':      'radarSpin 2s linear infinite',
        'shimmer':    'shimmer 2s linear infinite',
      },
      keyframes: {
        twinkle: {
          '0%':   { opacity: '0.2', transform: 'scale(0.8)' },
          '100%': { opacity: '1',   transform: 'scale(1.2)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-18px)' },
        },
        scanLine: {
          '0%':   { transform: 'translateY(-100%)', opacity: '0' },
          '50%':  { opacity: '1' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        goldPulse: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(201,169,110,0.3)' },
          '50%':      { boxShadow: '0 0 35px rgba(201,169,110,0.5)' },
        },
        radarSpin: {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
    },
  },
  plugins: [],
};
