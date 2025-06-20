import type { Config } from 'tailwindcss';

const config: Omit<Config, 'content'> = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Noto Sans KR', 'sans-serif'],
      },
      colors: {
        title: '#252525',
        body: '#3b3b3b',
        subBody: '#686868',
        placeholder: '#8c8c8c',
        line: '#b4b4b4',
        disabled: '#dadada',
        background: '#f1f1f1',

        main: '#64b5f7',
        mainText: '#045a9a',
        mainLight: '#a2d5ff',
        mainLighter: '#cde9ff',
        mainLightest: '#ebf6ff',

        alert: '#7ADC79',
        alertLight: '#DCFBB4',

        warning: '#FDB74D',
        warningMedium: '#EF9409',
        warningLight: '#FFE5C0',

        danger: '#F2597F',
        dangerLight: '#FF9BB4',
        dangerLightest: '#FFD1DD',
      },
      fontSize: {
        h1: '32px',
        h2: '28px',
        h3: '24px',
        body: '16px',
        caption: '12px',
        button: '16px',
      },
      lineHeight: {
        tight: '1.2',
        normal: '1.4',
        relaxed: '1.6',
      },
      borderRadius: {
        button: '8px',
        modal: '12px',
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '3rem',
        '5xl': '4rem',
      },
      zIndex: {
        dropdown: 1000,
        sticky: 1020,
        fixed: 1030,
        modalBackdrop: 1040,
        modal: 1050,
        popover: 1060,
        tooltip: 1070,
        toast: 1080,
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
        modal: '0 20px 25px rgba(0, 0, 0, 0.15)',
      },
      transitionDuration: {
        fast: '150ms',
        normal: '250ms',
        slow: '350ms',
      },
      transitionTimingFunction: {
        'in-out': 'ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 250ms ease-in-out',
        slideUp: 'slideUp 250ms ease-in-out',
        scaleIn: 'scaleIn 250ms ease-in-out',
      },
    },
  },
  plugins: [],
};
export default config;
