var gulp            = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins         = gulpLoadPlugins();
var runSequence     = require('run-sequence');

var source          = require('vinyl-source-stream');
var buffer          = require('vinyl-buffer');
var watchify        = require('watchify');
var browserify      = require('browserify');
var babel           = require('babelify');

var cwd       = './wp-content/themes/base-theme';
var cwdChild  = './wp-content/themes/child-theme';
process.chdir(cwd);

var src = {
  base: './',
  css: './css',
  sass: './src/sass/',
  js: './src/js/',
  img: './src/assets/img/',
  svg: './src/assets/svg/',
  sprite: './src/assets/svgsprites'
};

var dist = {
  base: './',
  css: './css/',
  js: './js/',
  img: './assets/img/',
  svg: './assets/svg/'
};

/**
 * Functions
 */
function swallowError(error) {
  console.log(error.toString());
  this.emit('end');
};

function bundle(w) {
  return w.bundle()
    .on('error', e => plugins.util.log(plugins.util.colors.red('Error: ') + e.message))
    .pipe(source(src.base + '/bundle.js'))
    .pipe(buffer())
    .pipe(plugins.sourcemaps.init({ loadMaps: true }))
    .pipe(plugins.sourcemaps.write('./'))
    .pipe(gulp.dest(dist.js));
}

function runScripts(env) {
  var env = env || 'development';
  var w = browserify({
    entries: [src.js + '/index.js'],
    paths: ['./node_modules', src.js + '/'],
    debug: env === 'development',
  }).transform(babel, {presets: ['es2015']});

  return w;
}

/**
 * Check that the current working directory is set.
 * If it isn't, set it to the default.
 */
// var checkCWD = function() {

//   if (process.cwd() === process.env.INIT_CWD) {
//     console.log('Setting the CWD to %s.', cwd);
//     process.chdir(cwd);
//   }
// };

/**
 * Tasks
 */
// SASS compiling task.
gulp.task('styles', function() {
  return gulp.src([src.sass + '**/*.sass'])
    .pipe(plugins.sass({
      style: 'compressed',
      indentedSyntax: true
    }))
    .on('error', swallowError)
    .pipe(plugins.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(plugins.cssmin())
    .pipe(gulp.dest(dist.base));
});

gulp.task('scripts:prod', function() {
  var w = runScripts('production');

  return w.bundle()
    .on('error', e => plugins.util.log(plugins.util.colors.red('Error: ') + e.message))
    .pipe(source(src.base + '/bundle.min.js'))
    .pipe(buffer())
    .pipe(plugins.uglify())
    .pipe(gulp.dest(dist.js));
});

gulp.task('lint', () => {
  return gulp.src([src.js + '**/*.js'])
      .pipe(plugins.eslint())
      .pipe(plugins.eslint.format())
      .pipe(plugins.eslint.failAfterError());
});

// CSS minifying task
// gulp.task('cssmin', function () {
//   return gulp.src([src.base + 'style.css'])
//     .pipe(plugins.cssmin())
//     .pipe(gulp.dest(dist.base));
// });

gulp.task('noconcat', function () {
  return gulp.src(src.js + 'noconcat/**/*.js')
    .pipe(plugins.uglify())
    .pipe(gulp.dest(dist.js));
});

// Image minifying task.
gulp.task('imagemin', function() {
  return gulp.src(src.img + '**/*.{png,gif,jpg}')
    .pipe(plugins.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest(dist.img));
});

// SVG minifying task.
gulp.task('svgmin', function() {
  return gulp.src(src.svg + '**/*.svg')
    .pipe(plugins.svgmin())
    .pipe(gulp.dest(dist.svg));
});

gulp.task('default', ['styles', 'lint'], (done) => {
  plugins.livereload.listen();

  // Styles
  gulp.watch(src.sass + '/**/*.sass', ['styles']);
  gulp.watch([
    src.base + '/js/*.js',
    src.base + '/style.css'
  ], plugins.livereload.changed)

  // Scripts
  var w = watchify(runScripts());

  w.on('update', () => {
    bundle(w);
  });

  bundle(w);

});

gulp.task('build', function(done) {
  runSequence('styles', 'lint', 'scripts:prod', ['imagemin', 'svgmin'], 'noconcat', done);
});

// TODO: Functionality for switching to child directory and plugin directories.

// gulp.task('child', function(done) {
//   process.chdir(cwdChild);
//   runSequence('styles', ['imagemin', 'svgmin'], 'jshint', 'watch', done);
// });

// gulp.task('build:child', function(done) {
//   process.chdir(cwdChild);
//   runSequence('styles', ['cssmin', 'imagemin', 'svgmin'], 'jshint', ['uglify', 'noconcat'], done);
// });
