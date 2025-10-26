// client/tailwind.config.js
export default {
  darkMode: 'class', // enables Tailwind's dark mode toggle via class
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          50: '#1e1e1e',
          100: '#2a2a2a',
          200: '#333333',
          300: '#3d3d3d',
          400: '#555555',
          500: '#777777',
          600: '#999999',
        },
        primary: {
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
    },
  },
  plugins: [],
}
