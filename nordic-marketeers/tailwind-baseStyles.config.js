const { line } = require("laravel-mix/src/Log");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = function({ addBase, theme }) {
  const colors = theme('colors');
  const fontFamily = theme('fontFamily');
  const spacing = theme('spacing');
  addBase({
    "*": {
      boxSizing: "border-box",
    },
    ":root": {
      color: colors["charcoal-100"],
    },

    "body, .mce-content-body": {
      '-webkit-font-smoothing': 'antialiased',
      fontFamily: fontFamily['family-regular'].join(', '),

      "em": {
        fontFamily: fontFamily['family-regular-italic'].join(', '),
      }
    },

    ".header-1": { 
      fontWeight: "300",
      fontSize: "var(--header-1)",
      lineHeight: "var(--header-1-line-height)",
    },

    ".header-1, .prose .header-1, .header-2-large, .prose .header-2-large": { 
      fontWeight: "300",
      fontSize: "var(--header-2-large)",
      lineHeight: "var(--header-2-large-line-height)",
    },

    ".header-2-hero, .prose .header-2-hero": { 
      fontWeight: "300",
      fontSize: "clamp(var(--header-2-large), 4vw, 300px)",
      lineHeight: "var(--header-2-large-line-height)",
    },

    ".header-2, .prose .header-2": { 
      fontWeight: "400",
      fontSize: "var(--header-2)",
      lineHeight: "var(--header-2-line-height)",
    },
    
    "a:focus-visible, button:focus-visible": {
      outline: '0',
    },
  });
};