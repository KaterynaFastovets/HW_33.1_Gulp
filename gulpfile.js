const {  series,  src, dest,watch} = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const browserSync = require('browser-sync').create();
const cssnano = require('cssnano')
const rename = require('gulp-rename')
const postcss = require('gulp-postcss')
const plugins = [cssnano({ preset: 'default' })]
const csscomb = require('gulp-csscomb')
const autoprefixer = require('autoprefixer');
const mqpacker = require('css-mqpacker')
const sortCSSmq = require('sort-css-media-queries')
const pug = require('gulp-pug');

const PATH = {
  scssRootFile: './assets/styles.scss',
  scssAllFiles: './assets/**/*.scss',
  scssFolder: './assets/scss/',
  cssFolder: './assets/css/',
  htmlFolder: './',
  htmlAllFiles: './*.html',
  jsFolder: './assets/js/',
  jsAllFiles: './*.js',
  pugAllFiles: './*.pug',
  pugFolder: './templates/',
  pugRootFile: './index.pug'
}

const PLUGINS = [
  autoprefixer({
    overrideBrowserslist: ['last 5 versions'],
    cascade: true
  }),
  mqpacker({ sort: sortCSSmq })
]

function scss() {
  return src(PATH.scssRootFile)
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(PLUGINS))
    .pipe(dest(PATH.cssFolder))
}



function scssMin () {
  const pluginsExtended = PLUGINS.concat([cssnano({
    preset: 'default'
})]);
  return src(PATH.scssRootFile)
  .pipe(sass().on('error', sass.logError))
  .pipe(postcss(plugins))
  .pipe(postcss(pluginsExtended))
  .pipe(rename({ suffix: '.min' }))
  .pipe(dest(PATH.cssFolder))
}
  

function compilePug() {
  return src(PATH.pugRootFile)
    .pipe(pug({ pretty: true }))
    .pipe(dest(PATH.pugFolder));
}

// function uglify() {
//   return src ("./index.js").pipe (uglify())
//   .pipe (dest("./public/"));
// }

function syncInit () {
  browserSync.init({
      server: {
          baseDir: PATH.htmlFolder
      }
  });
}

async function sync() {
  browserSync.reload()
}

function watchFiles() {
  syncInit()
  watch(PATH.scssAllFiles, scss)
  watch(PATH.htmlAllFiles, sync)
  watch(PATH.jsAllFiles, sync)
}

function comb() {
    return src('./assets/*.styles.scss')
      .pipe(csscomb('./.csscomb.json'))
      .pipe(dest('./assets/styles.scss'))
  }

exports.default= series(scss,comb,scssMin,compilePug,watchFiles) 
