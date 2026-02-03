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
          bg: '#0a0a14',
          card: '#0d0d1f',
          text: '#c7d2fe',
          accent: '#a3bffa',
          muted: '#43447a',
          danger: '#f1c0c0'
        },
  			background: '#0a0a14',
  			foreground: '#c7d2fe',
  			muted: {
  				DEFAULT: 'hsl(244 15% 15%)',
  				foreground: 'hsl(244 15% 65%)'
  			},
  			primary: {
  				DEFAULT: '#a3bffa',
  				foreground: '#0a0a14'
  			},
  			border: '#111122',
  			ring: '#a3bffa',
  			card: {
  				DEFAULT: '#0d0d1f',
  				foreground: '#c7d2fe'
  			},
  			secondary: {
  				DEFAULT: '#111122',
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