import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#0F2C4D', dark: '#091C36' },
        accent: '#E26A2C',
        muted: '#5A6A7A',
        line: '#E2E8F0',
        bg: '#F6F8FB',
      },
      fontFamily: {
        sans: ['"Hiragino Kaku Gothic ProN"', '"Hiragino Sans"', '"Yu Gothic"', 'Meiryo', 'sans-serif'],
      },
      maxWidth: { content: '760px' },
    },
  },
  plugins: [],
};
export default config;
