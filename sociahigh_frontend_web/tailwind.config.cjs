/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Barlow'],
        serif: ['Changa One'],
      },
    },
  },
  safelist: [ // Buttons dynamic classes generation:
    'bg-orange-500',
    'bg-green-500',
    'bg-red-500',
    'border-orange-600',
    'border-green-600',
    'border-red-600',
    'text-orange-600',
    'text-green-600',
    'text-red-600',
    'hover:bg-orange-600',
    'hover:bg-green-600',
    'hover:bg-red-600',
    'active:bg-orange-700',
    'active:bg-green-700',
    'active:bg-red-700',
    'active:border-orange-700',
    'active:border-green-700',
    'active:border-red-700',
  ],
  plugins: [],
};
