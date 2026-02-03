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
          bg: '#111827',
          card: '#1f2937',
          text: '#c7d2fe',
          accent: '#60a5fa',
          muted: '#4b5563',
          danger: '#f87171'
        },
  			background: '#111827',
  			foreground: '#c7d2fe',
  			muted: {
  				DEFAULT: 'hsl(215 25% 27%)',
  				foreground: 'hsl(215 20% 65%)'
  			},
  			primary: {
  				DEFAULT: '#60a5fa',
  				foreground: '#111827'
  			},
  			border: '#374151',
  			ring: '#60a5fa',
  			card: {
  				DEFAULT: '#1f2937',
  				foreground: '#c7d2fe'
  			},
  			secondary: {
  				DEFAULT: '#111827',
  				foreground: '#c7d2fe'
  			},
  		},
  		borderRadius: {
  			none: '0',
        sm: '0',
        md: '0',
        lg: '0',
  		},
      transitionDuration: {
        'DEFAULT': '300ms',
        'slow': '500ms',
      }
  	}
  },
  plugins: [require("tailwindcss-animate")]
}