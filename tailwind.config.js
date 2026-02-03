/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: ['JetBrains Mono', 'monospace'],
  			mono: ['JetBrains Mono', 'monospace'],
  		},
  		colors: {
        'retro': {
          bg: '#050510',
          card: '#0a0a20',
          text: '#e2e8f0',
          accent: '#4ade80',
          muted: '#6366f1',
          danger: '#f87171'
        },
  			background: '#050510',
  			foreground: '#e2e8f0',
  			muted: {
  				DEFAULT: 'hsl(240 5% 15%)',
  				foreground: 'hsl(240 5% 65%)'
  			},
  			primary: {
  				DEFAULT: '#4ade80',
  				foreground: '#050510'
  			},
  			border: '#1e1b4b',
  			ring: '#4ade80',
  			card: {
  				DEFAULT: '#0a0a20',
  				foreground: '#e2e8f0'
  			},
  			secondary: {
  				DEFAULT: '#1e1b4b',
  				foreground: '#e2e8f0'
  			},
  		},
  		borderRadius: {
  			none: '0',
        sm: '0',
        md: '0',
        lg: '0',
  		},
  	}
  },
  plugins: [require("tailwindcss-animate")]
}