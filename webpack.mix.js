let mix = require("laravel-mix");
let tailwindcss = require("tailwindcss");
let glob = require("glob-all");
let PurgecssPlugin = require("purgecss-webpack-plugin");

class TailwindExtractor {
    static extract(content) {
        return content.match(/[A-z0-9-:\/]+/g) || [];
    }
}

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix
  .js("resources/assets/js/app.js", "public/js")
  .sass("resources/assets/sass/app.scss", "public/css").options({
      processCssUrls: false,
      postCss: [tailwindcss("./tailwind.js")]
  });

mix.browserSync("localhost:8000");

// PurgeCSS is a utility that parses your application view files, identifies which
// utility classes are actually being used, removing unused classes. This means
// your final CSS will be much smaller, containing just the styles you need.
//
// Only run PurgeCSS in production builds keeping your development builds fast,
// whilst still leaving you with a full set of utilities during development.
if (mix.inProduction()) {
  mix.webpackConfig({
    plugins: [
      new PurgecssPlugin({
        // Specify the locations of any files you want to scan for class names.
        paths: glob.sync([
          path.join(__dirname, "resources/views/**/*.blade.php"),
          path.join(__dirname, "resources/assets/js/**/*.vue")
        ]),
        extractors: [
          {
            extractor: TailwindExtractor,

            // Specify the file extensions to include when scanning for class names.
            extensions: ["html", "js", "php", "vue"]
          }
        ]
      })
    ]
  });
}

mix.version();
