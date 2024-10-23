const themeDir = "./";
let mix = require("laravel-mix");
require("mix-tailwindcss");
let productionSourceMaps = false;

mix
  .setPublicPath("./dist/")
  .setResourceRoot("/nordic-marketeers/dist/")
  .webpackConfig({
    output: {
      publicPath: "/nordic-marketeers/dist/",
    },
  })
  // CSS Fonts
  .css(`${themeDir}/src/css/fonts.css`, `${themeDir}/dist/css`)
  .minify(`${themeDir}/dist/css/fonts.css`)

  // CSS main global
  .css(`${themeDir}/src/css/main.css`, `${themeDir}/dist/css`)
  .tailwind()
  .minify(`${themeDir}/dist/css/main.css`)

  .js( `${themeDir}/src/js/main.js`, `${themeDir}/dist/js` )
  .minify(`${themeDir}/dist/js/main.js`)
  .sourceMaps(productionSourceMaps, 'source-map');