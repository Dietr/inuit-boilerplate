'use strict';


// ---
// Setup: load plugins and define config variables
// ---


// Plugins
const gulp = require("gulp");
const plumber = require("gulp-plumber");
const cp = require("child_process");
const gnf = require("gulp-npm-files");
const browsersync = require("browser-sync").create();
const del = require("del");
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const cheerio = require("gulp-cheerio");
const svgmin = require("gulp-svgmin");
const svgSymbols = require("gulp-svg-symbols");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");

// Config
const config = {
  browsersync: {
    server: {
      baseDir: '_site',
      reloadDelay: 2000,
      debounce: 200,
      notify: true,
      ghostMode: {
        clicks: true,
        location: true,
        forms: true,
        scroll: false
      }
    }
  },
  icons: {
    title: '%f icon',
    svgClassname: 'c-icon-set',
    templates: ['default-svg']
  },
  cheerio: {
    run: function ($) {
      $('[fill]').removeAttr('fill');
    },
    parserOptions: { xmlMode: true }
  },
  autoprefixer: {
    browsers: [
      'last 2 version',
      '> 2%',
      'ie >= 9',
      'ios >= 8',
      'android >= 4'
    ]
  },
  jsConcat: 'scripts.js'
};

// Paths
const paths = {
  vendor: './_vendor/',
  scssSrc: './assets/_scss/**/*.scss',
  cssSrc: './assets/css/',
  cssDist: './_site/assets/css/',
  jsSrc: [
    './_vendor/jquery/dist/jquery.slim.js',
    './_vendor/svgxuse/svgxuse.js',
    './assets/js/_scripts/*.js'
  ],
  jsDist: './assets/js/',
  jsJekyllDist: './_site/assets/js/',
  iconsSrc: './_artwork/icons/*.svg',
  iconsDist: './assets/img/svg/',
  imagesSrc: './assets/img/',
  imagesDist: './_site/assets/img/',
  cssWatch: './assets/_scss/**/*.scss',
  jsWatch: './assets/js/_scripts/**/*.js',
  iconsWatch: './_artwork/symbols/*.svg',
  imageWatch: './assets/img/**/*',
  siteWatch: [
    './assets/img/**/*.png',
    './assets/img/**/*.jpg',
    './assets/img/**/*.svg',
    './**/*.html',
    './_pages/**/*.md',
    './_posts/*.md',
    './_data/*.yml',
    './_config.yml',
    '!_site/**/*.*'
  ]
}

// Install
// ---
// Copy dependencies from `node_modules` to $paths.vendor
function copyNpmDependencies() {
  return gulp.src(gnf(), {base:'./'})
    .pipe(gulp.dest(paths.vendor));
}

// Move `$paths.vendor/node_modules/**/*` to `$paths.vendor/**/*`
function copyVendorDependencies() {
  return gulp.src(paths.vendor + 'node_modules/**/*')
    .pipe(gulp.dest(paths.vendor));
}

// Delete `$paths.vendor/node_modules`
function dependencies() {
  return del([paths.vendor + 'node_modules/']);
}

// BrowserSync
// ---
function browserSync(done) {
  browsersync.init(config.browsersync);
  done();
}

// BrowserSync Reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Jekyll
// ---
// Incremental build
function jekyll() {
  return cp.spawn("bundle", ["exec", "jekyll", "build","--incremental"], { stdio: "inherit" });
}

// Production build
function jekyllBuild() {
  return cp.spawn("bundle", ["exec", "jekyll", "build", "JEKYLL_ENV=production"], { stdio: "inherit" });
}

// Clean
// ---
// Clean assets
function clean() {
  return del(["./_site/assets/"]);
}

// Images
// ---
// Optimize Images
function images() {
  return gulp
    .src(paths.imagesSrc)
    .pipe(newer(paths.imagesDist))
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }]
      })
    )
    .pipe(gulp.dest(paths.imagesDist));
}

// Icons
// ---
// Convert multiple svg's to one symbol file
// https://css-tricks.com/svg-symbol-good-choice-icons/
function icons() {
  return gulp.src(paths.iconsSrc)
    .pipe(cheerio(config.cheerio))
    .pipe(svgmin())
    .pipe(svgSymbols(config.icons))
    .pipe(gulp.dest(paths.iconsDist))
    .pipe(browsersync.stream());
}

// CSS
// ---
function css() {
  return gulp
    .src(paths.scssSrc)
    .pipe(plumber())
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(gulp.dest(paths.cssSrc))
    .pipe(gulp.dest(paths.cssDist))
    .pipe(rename({ suffix: ".min" }))
    .pipe(postcss([autoprefixer(config.autoprefixer), cssnano()]))
    .pipe(gulp.dest(paths.cssSrc))
    .pipe(gulp.dest(paths.cssDist))
    .pipe(browsersync.stream());
}

// JS
// ---
// Transpile, concatenate and minify scripts
function scripts() {
  return gulp
    .src(paths.jsSrc)
    .pipe(plumber())
    .pipe(concat(config.jsConcat))
    .pipe(gulp.dest(paths.jsDist))
    .pipe(gulp.dest(paths.jsJekyllDist))
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest(paths.jsDist))
    .pipe(gulp.dest(paths.jsJekyllDist))
    .pipe(browsersync.stream())
}

// Watch files
// ---
function watchFiles() {
  gulp.watch(paths.cssWatch, css);
  gulp.watch(paths.jsWatch, scripts);
  gulp.watch(paths.jsWatch, scripts);
  gulp.watch(paths.iconsWatch, icons);
  gulp.watch(paths.imageWatch, images);
  gulp.watch(
    paths.siteWatch,
    gulp.series(jekyll, browserSyncReload)
  );
}

// Tasks
// ---
gulp.task("install", gulp.series(copyNpmDependencies, copyVendorDependencies, dependencies));
gulp.task("jekyll", jekyll);
gulp.task("jekyllBuild", jekyllBuild);
gulp.task("icons", icons);
gulp.task("images", images);
gulp.task("css", css);
gulp.task("scripts", scripts);
gulp.task("clean", clean);

// Default
gulp.task(
  "default",
  gulp.series(
    "install",
    clean,
    icons,
    gulp.parallel(css, scripts, images, jekyllBuild)
  )
);

// Build
gulp.task(
  "build",
  gulp.series(
    "install",
    clean,
    icons,
    gulp.parallel(css, scripts, images, jekyllBuild)
  )
);

// Watch
gulp.task("watch", gulp.parallel(watchFiles, browserSync));
