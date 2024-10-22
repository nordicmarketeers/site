const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");
const addBaseStyles = require('./tailwind-baseStyles.config.js');
const { transparent } = require("tailwindcss/colors.js");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      "../index.html",
  ],

  presets: [
    require("./tailwind-typography.config.js"),
  ],
  plugins: [
    plugin(({ addBase, theme }) => addBaseStyles({ addBase, theme })),
    require("tailwindcss-animated"),
  ],
  safelist: [
    /*
      The columns-component dynamically set the grid-cols class using prop,
      don't remove these strings before modifying the columns-component to work without the safelist
    */
    'grid-cols-1',
    'grid-cols-2',
    'grid-cols-3',
    'grid-cols-4',
    'grid-cols-5',
    'grid-cols-6',
   ],
  variants: {
    animation: ["motion-safe"],
  },
  theme: {
    colors: {
      /* Theme colors  */
      black: "var(--black)",
      "black-transparent": "var(--black-transparent)",
      transparent: "transparent",
      white: "var(--white)",
      
      "air-superiority-blue": "var(--air-superiority-blue)",
      "bone": "var(--bone)",
      "bone-trans-25": "var(--bone-trans-25)",
      "bone-trans-75": "var(--bone-trans-75)",    
      "bridal-heath": "var(--bridal-heath)",
      "cambridge-blue": "var(--cambridge-blue)",
      "charcoal": "var(--charcoal)",
      "charcoal-100": "var(--charcoal-100)",
      "charcoal-100-trans-50": "var(--charcoal-100-trans-50)",
      "charcoal-100-trans-75": "var(--charcoal-100-trans-75)",
      "gamoge": "var(--gamoge)",
      "jungle-mist": "var(--jungle-mist)",
      "tomato": "var(--tomato)",
      "melon": "var(--melon)",
      "melon-trans-25": "var(--melon-trans-25)",
    },
    fontFamily: {
      'family-regular': ['Inter', 'Helvetica', 'sans-serif'],
      'family-regular-italic': ['Inter-italic', 'Helvetica', 'sans-serif'],
    },
    boxShadow: {
      md: "0 2px 20px 0 rgba(0,0,0,0.10)",
      none:	"0",
    },
    extend: {
      appearance: ["none", "auto"],
      screens: {
        "xs": "400px",
        "2md": "920px",
        "2lg": "1360px",
        "2xl": "1440px",
        "3xl": "1600px",
      },
      fontSize: {
        xs: [pxToRem(14), pxToEm(14, 22)],
        "2xs": [pxToRem(16), pxToEm(14, 24)],
        sm: [pxToRem(18), pxToEm(18, 26)],
        lg: [pxToRem(20), pxToEm(20, 34)],
      },
      spacing: {
        /* Gutter spacing */
        gutter: "2.5rem",
        "gutter-1/8": "0.3125rem",
        "gutter-1/4": "0.625rem",
        "gutter-3/5": "1.5rem",
        "gutter-3/4": "1.875rem",
        "gutter-1/2": "1.25rem",
        "gutter-1-5x": "3.75rem",
        "gutter-2x": "5rem",
        "gutter-2-5x": "5.625rem",
        "gutter-3x": "7.5rem",
        /* Custom spacing */
        "1/5": "20%",
        "2/5": "40%",
        "3/5": "60%",
        "4/5": "80%",
        "1/6": "16.666667%",
        "2/6": "33.333333%",
        "3/6": "50%",
        "4/6": "66.666667%",
        "5/6": "83.333333%",
        "1/12": "8.333333%",
        "2/12": "16.666667%",
        "3/12": "25%",
        "4/12": "33.333333%",
        "5/12": "41.666667%",
        "6/12": "50%",
        "7/12": "58.333333%",
        "8/12": "66.666667%",
        "9/12": "75%",
        "10/12": "83.333333%",
        "11/12": "91.666667%",
 
      },
      scale: {
        101: "1.01",
        102: "1.02",
      },
      minWidth: {
        auto: "auto",
        px: "1px",
        0: "0",
        1: "0.25rem",
        2: "0.5rem",
        3: "0.75rem",
        4: "1rem",
        5: "1.25rem",
        6: "1.5rem",
        8: "2rem",
        10: "2.5rem",
        12: "3rem",
        16: "4rem",
        20: "5rem",
        24: "6rem",
        28: "7rem",
        32: "8rem",
        40: "10rem",
        48: "12rem",
        56: "14rem",
        64: "16rem",
        "1/2": "50%",
        "1/3": "33.333333%",
        "2/3": "66.666667%",
        "1/4": "25%",
        "2/4": "50%",
        "3/4": "75%",
        "1/5": "20%",
        "2/5": "40%",
        "3/5": "60%",
        "4/5": "80%",
        "1/6": "16.666667%",
        "2/6": "33.333333%",
        "3/6": "50%",
        "4/6": "66.666667%",
        "5/6": "83.333333%",
        "1/12": "8.333333%",
        "2/12": "16.666667%",
        "3/12": "25%",
        "4/12": "33.333333%",
        "5/12": "41.666667%",
        "6/12": "50%",
        "7/12": "58.333333%",
        "8/12": "66.666667%",
        "9/12": "75%",
        "10/12": "83.333333%",
        "11/12": "91.666667%",
        full: "100%",
        screen: "100vw",
      },
      minHeight: {
        "1/2-screen": "50vh",
        "3/4-screen": "75vh",
        "max-w-screen-3xl": "120rem",
      },
      maxWidth: {
        auto: "auto",
        px: "1px",
        screen: "100vw",
        0: "0",
        1: "0.25rem",
        2: "0.5rem",
        3: "0.75rem",
        4: "1rem",
        5: "1.25rem",
        6: "1.5rem",
        8: "2rem",
        10: "2.5rem",
        12: "3rem",
        16: "4rem",
        20: "5rem",
        24: "6rem",
        32: "8rem",
        40: "10rem",
        48: "12rem",
        56: "14rem",
        64: "16rem",
        "1/2": "50%",
        "1/3": "33.333333%",
        "2/3": "66.666667%",
        "1/4": "25%",
        "2/4": "50%",
        "3/4": "75%",
        "1/5": "20%",
        "2/5": "40%",
        "3/5": "60%",
        "4/5": "80%",
        "1/6": "16.666667%",
        "2/6": "33.333333%",
        "3/6": "50%",
        "4/6": "66.666667%",
        "5/6": "83.333333%",
        "1/12": "8.333333%",
        "2/12": "16.666667%",
        "3/12": "25%",
        "4/12": "33.333333%",
        "5/12": "41.666667%",
        "6/12": "50%",
        "7/12": "58.333333%",
        "8/12": "66.666667%",
        "9/12": "75%",
        "10/12": "83.333333%",
        "11/12": "91.666667%",
        "8xl": "88rem",
        "9xl": "96rem",
        "10xl": "100rem",
        "legible-xl": "100ch",
      },
      boxShadow: (theme) => ({
        'wcag-transparent': `0 0 0 5px ${theme('colors.wcag-transparent')}`,
      }),
      animation: {
        'slide-in': 'slideIn ease 0.5s',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        slideIn: {
          '0%': { marginTop: '-160px' },
          '100%': { marginTop: '0' },
        },
        pulse: {
          '0%, 100%': { opacity: 0.5 },
          '50%': { opacity: 0.2 },
        },
      },
      animationFill: {
        forwards: "forwards",
      },
      borderRadius: {
        "md": "2.5rem",
        "xl": "5.625rem",
      },
      borderWidth: {
        1: "1px",
      },
    },
  },
};


/**
 * Generates transparent color variants based on the given color.
 *
 * @param {string} color - The base color in rgba format.
 * @returns {Object} - An object containing color variants.
 */
function generateColorVariants(color) {
  let variants = {};
  ["20", "40", "60", "80"].forEach((variant) => {
    variants[`${color}/${variant}`] = `var(--${color}-${variant})`;
  });
  return variants;
}

function pxToRem(px) {
  const root = 16;
  return px / root + 'rem';
}

function pxToEm(defaultPx, px) {
  return px / defaultPx + 'em';
}