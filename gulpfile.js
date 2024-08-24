const { series, src, dest, watch } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const browserSync = require("browser-sync").create();
const cssnano = require("cssnano");
const rename = require("gulp-rename");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csscomb = require("gulp-csscomb");
const mqpacker = require("css-mqpacker");
const sortCSSmq = require("sort-css-media-queries");
const pug = require("gulp-pug");
const uglify = require("gulp-uglify");

const plugins = [
  cssnano({ preset: "default" }),
  autoprefixer({
    overrideBrowserslist: ["last 2 versions"],
    cascade: true,
  }),
  mqpacker({ sort: sortCSSmq }),
];

function scss() {
  return src("./assets/styles.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(dest("./assets/css"))
    .pipe(browserSync.stream())
    .pipe(postcss(plugins))
    .pipe(rename({ suffix: ".min" }))
    .pipe(dest("./assets/css"));
}

function compilePug() {
  return src("./index.pug")
    .pipe(pug({ pretty: true }))
    .pipe(dest("./templates/"));
}

function comb() {
  return src("./assets/*.styles.scss")
    .pipe(csscomb("./.csscomb.json"))
    .pipe(dest("./assets/styles.scss"));
}

function uglifyFile() {
  return src("./index.js")
  .pipe(uglify())
  .pipe(dest("./public"));
}

function watchInit() {
  browserSync.init({
    server: {
      baseDir: "./",
    },
  });
}

async function sync() {
  browserSync.reload();
}

function watchFiles() {
  watchInit();
  watch("./assets/**/*.scss", scss);
  watch("./*.html", sync);
  watch("./*.js", sync);
}

exports.default = series(scss, compilePug, comb, uglifyFile, watchFiles);
