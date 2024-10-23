const { text } = require("stream/consumers");
const { inherit } = require("tailwindcss/colors");

module.exports = {
  plugins: [require("@tailwindcss/typography")],
  theme: {
    extend: {
      typography: (theme) => {
        const colors = theme('colors');
        const spacing = theme('spacing');
        const fontSize = theme('fontSize');
        const fontFamily = theme('fontFamily');
  
        return {
          /* For all screens */
          DEFAULT: {
            css: {
							fontSize: "var(--font-size-base)",
							lineHeight: "var(--line-height-base)",
							color: colors["charcoal-100"],
							maxWidth: "900px",

							"a": {
								color: colors["tomato"],
								textDecoration: "underline",
								textUnderlineOffset: "0.15em",
								textDecorationThickness: "1px",
								fontWeight: "inherit",

								"&:hover": {
									opacity: 0.75,
								}
							},
							
							"h1": {
								marginBottom: "0.43em;",
							},

							"h2": {
								marginBottom: "0.5em;",
							},

							"h3": {
								marginBottom: "0.3em;",
							},
							
							"h4, h5, h6": {
								marginBottom: "0.25em;",
							},

							"p": {
								marginTop: "1.1em;",
								marginBottom: "1.1em;",
							},

							"h1,h2,h3,h4,h5,h6" : {
								fontWeight: "unset",
							"em": {
								fontStyle: "unset",
							}
							},

							"p:first-child img": {
								marginTop: 0,
							},

							"ul li, ul ol li": {
								"&:first-child": {
									marginTop: 0,
								},
								"&:last-child": {
									marginBottom: 0,
								},
							},

							"li::marker": {
								color: colors["charcoal-100"],
							},

							".fineprint": {
								fontSize: fontSize.sm[0], 
								lineHeight: fontSize.sm[1], 
							},

							"hr.break": {
								margin: 0,
								borderTop:0,
								clear: "both",
								opacity: 0,
							},

							"iframe" : {
								maxWidth: '100%',
								width: '100%',
								aspectRatio: '16/9',
							},
						},
						},
        };
      },
    },
  },
};