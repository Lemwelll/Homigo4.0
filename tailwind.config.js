/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f2ff',
          100: '#b3d9ff',
          200: '#80bfff',
          300: '#4da6ff',
          400: '#1a8cff',
          500: '#0073e6',
          600: '#005bb3',
          700: '#004280',
          800: '#002a4d',
          900: '#00121a',
        },
        secondary: {
          50: '#e6f7f0',
          100: '#b3e6d1',
          200: '#80d5b2',
          300: '#4dc493',
          400: '#1ab374',
          500: '#00a35c',
          600: '#008047',
          700: '#005d33',
          800: '#003a1f',
          900: '#00170a',
        },
      },
      keyframes: {
        'fade-in-up': {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(20px)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0)' 
          },
        },
        'fade-in-delay': {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(10px)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0)' 
          },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.8s ease-out',
        'fade-in-delay': 'fade-in-delay 0.8s ease-out 0.3s both',
      },
    },
  },
  plugins: [],
}
