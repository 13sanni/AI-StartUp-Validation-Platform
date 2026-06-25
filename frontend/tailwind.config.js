/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'], // Removed Syne, using Inter everywhere for minimalism
      },
      colors: {
        brand: {
          primary: '#ffffff', // Primary action is white
          secondary: '#cccccc',
          accent: '#ffffff',
          green: '#ffffff',
          orange: '#ffffff',
        },
        dark: {
          base: '#000000',     // Pure black background
          surface: '#0a0a0a',  // Slightly lighter black for cards
          card: '#0a0a0a',
          'card-hover': '#111111',
          glass: 'rgba(255,255,255,0.02)',
        },
      },
      backgroundImage: {
        'grad-brand': 'linear-gradient(135deg, #ffffff, #cccccc)',
        'grad-accent': 'linear-gradient(135deg, #ffffff, #aaaaaa)',
        'grad-green': 'linear-gradient(135deg, #ffffff, #ffffff)',
        'grad-orange': 'linear-gradient(135deg, #ffffff, #ffffff)',
        'grad-surface': 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))',
      },
      boxShadow: {
        'glow': '0 0 40px rgba(255,255,255,0.05)',
        'glow-green': '0 0 30px rgba(255,255,255,0.05)',
        'glow-pink': '0 0 30px rgba(255,255,255,0.05)',
        'glow-lg': '0 8px 40px rgba(255,255,255,0.08)',
        'card': '0 4px 20px rgba(0,0,0,0.5)',
      },
      borderColor: {
        subtle: 'rgba(255,255,255,0.05)',
        medium: 'rgba(255,255,255,0.1)',
        accent: 'rgba(255,255,255,0.3)',
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2s ease-in-out infinite',
        'spin-slow': 'spin-slow 8s linear infinite',
        'fade-in-up': 'fadeInUp 0.6s ease forwards',
        'fade-in-scale': 'fadeInScale 0.4s ease forwards',
        'agent-pulse': 'agentPulse 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'dot-bounce': 'dotBounce 1.2s ease-in-out infinite',
        'check-in': 'checkIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'border-glow': 'borderGlow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'pulse-ring': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.05)', opacity: '0.5' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInScale: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        agentPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255,255,255,0.2)' },
          '50%': { boxShadow: '0 0 0 8px rgba(255,255,255,0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        dotBounce: {
          '0%, 80%, 100%': { transform: 'translateY(0)', opacity: '0.5' },
          '40%': { transform: 'translateY(-6px)', opacity: '1' },
        },
        checkIn: {
          '0%': { transform: 'scale(0) rotate(-45deg)', opacity: '0' },
          '60%': { transform: 'scale(1.3) rotate(5deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        borderGlow: {
          '0%, 100%': { borderColor: 'rgba(255,255,255,0.1)' },
          '50%': { borderColor: 'rgba(255,255,255,0.4)' },
        },
      },
    },
  },
  plugins: [],
}
