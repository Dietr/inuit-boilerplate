'use strict';


// ---
// Setup: load plugins and load tasks
// ---

// Project variables
const project = {
  buildSrc: 'src',
  buildDest: '_site',
  cssSrc: '/assets/_scss/*.scss',
  cssDest: '/assets/css/',
  scriptsSrc: [
    '_vendor/jquery/dist/jquery.slim.min.js',
    '_vendor/svgxuse/svgxuse.min.js',
    '_vendor/picturefill/dist/picturefill.min.js',
    '_vendor/lazysizes/lazysizes.js',
    '_vendor/lazysizes/plugins/unveilhooks/ls.unveilhooks.js',
    'src/assets/js/**/*.js'
  ],
  scriptsDest: '/assets/js',
  iconSrc: './_artwork/icons/*.svg',
  iconDest: '/assets/img/svg/',
  vendorDest: './_vendor/'
}

// Plugins
var gulp         = require('gulp');
var shell        = require('gulp-shell');
var gnf          = require("gulp-npm-files");
var del          = require("del");
var browsersync  = require("browser-sync").create();
var clean        = require('gulp-clean');
var sass         = require("gulp-sass");
var postcss      = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var cssnano      = require("cssnano");
var uglify       = require('gulp-uglify');
var concat       = require('gulp-concat');
var cheerio      = require("gulp-cheerio");
var svgSymbols   = require("gulp-svg-symbols");
var os           = require("os");
var parallel     = require("concurrent-transform");
var rename       = require("gulp-rename");
var imageResize  = require('gulp-image-resize');


// ---
// Functions
// ---

// Install
// ---
// Copy dependencies from `node_modules` to $paths.vendor
function copyNpmDependencies() {
  return gulp.src(gnf(), {base:'./'})
    .pipe(gulp.dest(project.vendorDest));
}

// Move `$paths.vendor/node_modules/**/*` to `$paths.vendor/**/*`
function copyVendorDependencies() {
  return gulp.src(project.vendorDest + 'node_modules/**/*')
    .pipe(gulp.dest(project.vendorDest));
}

// Delete `$paths.vendor/node_modules`
function dependencies() {
  return del([project.vendorDest + 'node_modules/']);
}


// Run our static site generator to build the pages
// ---
gulp.task('generate', shell.task('eleventy'));


// Browsersync
// ---
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: project.buildDest,
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
  });
  done();
}

// BrowserSync Reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Clean
// ---
function cleanBuild() {
  return gulp.src(project.buildDest, {read: false, allowEmpty: true},)
    .pipe(clean());
}


// Compile SCSS files to CSS
// ---
function css() {
  return gulp.src(project.buildSrc + project.cssSrc)
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(postcss([autoprefixer({
      browsers: [
        'last 2 version',
        '> 2%',
        'ie >= 9',
        'ios >= 8',
        'android >= 4'
      ]
    }), cssnano()]))
    .pipe(gulp.dest(project.buildDest + project.cssDest))
    .pipe(browsersync.stream());
}


// Uglify our javascript files into one.
// ---
function scripts() {
  return gulp
    .src(project.scriptsSrc)
    .pipe(concat('scripts.js'))
    .pipe(uglify())
    .pipe(gulp.dest(project.buildDest + project.scriptsDest))
    .pipe(browsersync.stream());
}


// Icons
// ---
// Convert multiple svg's to one symbol file
// https://css-tricks.com/svg-symbol-good-choice-icons/
function icons() {
  return gulp.src(project.iconSrc)
    .pipe(cheerio({
      run: function ($) {
        $('[fill]').removeAttr('fill');
      },
      parserOptions: { xmlMode: true }
    }))
    .pipe(svgSymbols({
      title: '%f icon',
      svgAttrs: {
        class: 'c-icon-set',
      },
      templates: ['default-svg']
    }))
    .pipe(gulp.dest(project.buildSrc + project.iconDest))
    .pipe(gulp.dest(project.buildDest + project.iconDest))
    .pipe(browsersync.stream());
}


// create a set of resize tasks at defined image widths
var resizeImageTasks = [];
[400,1000].forEach(function(size) {
  var resizeImageTask = 'resize_' + size;
  gulp.task(resizeImageTask, function(done) {
    gulp.src(project.buildSrc + '/assets/img/*')
    .pipe(parallel(
      imageResize({ width : size }),
      os.cpus().length
    ))
    .pipe(rename(function (path) { path.basename += "-" + size; }))
    .pipe(gulp.dest(project.buildDest+ '/assets/img'));
    done();
  });
  resizeImageTasks.push(resizeImageTask);
});


// Copy our core images to the dist folder, and resize all preview images
gulp.task('images', gulp.parallel(resizeImageTasks, function copyOriginalImages(done) {
  gulp.src(project.buildSrc + '/assets/img/*')
    .pipe(gulp.dest(project.buildDest+ '/assets/img'))
    done();
}));


// Watch folders for changes
// ---
function watchFiles() {
  gulp.watch(project.buildSrc + "/assets/_scss/**/*", gulp.parallel('css'));
  gulp.watch(project.buildSrc + "/assets/js/**/*", gulp.parallel('scripts'));
  gulp.watch("./_artwork/icons/*.svg", gulp.parallel('icons'));
  gulp.watch(
    [
      project.buildSrc + '/assets/img/**/*.png',
      project.buildSrc + '/assets/img/**/*.jpg',
      project.buildSrc + '/assets/img/**/*.svg',
      project.buildSrc + '/pages/**/*',
      project.buildSrc + '/_data/**/*.json',
      project.buildSrc + '/_includes/**/*.liquid',
      project.buildSrc + '/_includes/**/*.liquid',
      project.buildSrc + '/_pages/*.md',
      project.buildSrc + '/_articles/*.md',
      project.buildSrc + '/_cases/*.md'
    ],
    gulp.series('generate', 'browserSyncReload')
  );
}


// ---
// Tasks
// ---
gulp.task('install', gulp.series(copyNpmDependencies, copyVendorDependencies, dependencies));
gulp.task('cleanBuild', cleanBuild);
gulp.task('css', css);
gulp.task('scripts', scripts);
gulp.task('icons', icons);
gulp.task('watchFiles', watchFiles);
gulp.task('browserSync', browserSync);
gulp.task('browserSyncReload', browserSyncReload);


// Assets
gulp.task('assets', gulp.parallel(
  'icons',
  'css',
  'scripts'
));


// Default
gulp.task('default', gulp.series(
  'install',
  'cleanBuild',
  'generate',
  'assets'
));


// Watch
gulp.task('watch', gulp.series(
    'default',
    gulp.parallel('watchFiles', 'browserSync')
  )
);


