/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#4CAF50',
          'green-dark': '#388E3C',
          'green-light': '#81C784',
        },
        dark: {
          900: '#0A0A0A',
          800: '#111111',
          700: '#1A1A1A',
          600: '#222222',
          500: '#2A2A2A',
          400: '#333333',
          300: '#444444',
        },
        klean: {
          gold: '#D4AF37',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        script: ['"Dancing Script"', 'cursive'],
        sans: ['"Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}