/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'clearreq': {
          primary: '#2563eb',    // Royal Blue
          secondary: '#f8fafc',  // Light Gray
          accent: '#059669',     // Emerald Green
          white: '#ffffff',      // White
          orange: '#ea580c',     // Orange for non-functional requirements
          red: '#dc2626',        // Red for ambiguities
        }
      },
      fontFamily: {
        'inter': ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
} 