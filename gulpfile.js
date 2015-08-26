var gulp            = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins         = gulpLoadPlugins();
var runSequence     = require('run-sequence');

var cwd       = './wp-content/themes/base-theme';
var cwdChild  = './wp-content/themes/child-theme';
// process.chdir();

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
var swallowError = function(error) {
  console.log(error.toString());
  this.emit('end');
};

var checkCWD = function() {
  /**
   * Check that the current working directory is set.
   * If it isn't, set it to the default.
   */
  if (process.cwd() === process.env.INIT_CWD) {
    console.log('Setting the CWD to %s.', cwd);
    process.chdir(cwd);
  }
};

/**
 * Tasks
 */
// SASS compiling task.
gulp.task('sass', function() {
  checkCWD();
  return gulp.src([src.sass + '**/*.sass'])
    .pipe(plugins.sass())
    .on('error', swallowError)
    .pipe(plugins.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest(dist.base));
});

// CSS minifying task
gulp.task('cssmin', function () {
  return gulp.src([src.base + 'style.css'])
    .pipe(plugins.cssmin())
    .pipe(gulp.dest(dist.base));
});

// JS linting task.
gulp.task('jshint', function () {
  checkCWD();
  return gulp.src([src.js + '**/*.js', '!' + src.js + 'lib/**.*'])
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('default'))
    .pipe(plugins.jshint.reporter('fail'));
});

// JS minifying task.
gulp.task('uglify', function () {
  return gulp.src([
      src.js + 'lib/**/.js',
      src.js + '**/*.js',
      '!' + src.js + 'noconcat/**/*.js'
    ])
    .pipe(plugins.uglify())
    .pipe(plugins.concat('application.min.js'))
    .pipe(gulp.dest(dist.js));
});

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

gulp.task('watch', function() {
  checkCWD();
  plugins.livereload.listen();

  // watch just the CSS so livereload doesn’t reload the entire page
  gulp.watch([src.sass + '**/*.sass'], ['sass']);
  gulp.watch(src.base + '**/*.css', plugins.livereload.changed);

  gulp.watch(src.js + '**/*.js', ['jshint']).on('change', plugins.livereload.changed);
});

gulp.task('default', function(done) {
  process.chdir(cwd);
  runSequence('sass', ['imagemin', 'svgmin'], 'jshint', 'watch', done);
});

gulp.task('child', function(done) {
  process.chdir(cwdChild);
  runSequence('sass', ['imagemin', 'svgmin'], 'jshint', 'watch', done);
});

gulp.task('build', function(done) {
  process.chdir(cwd);
  runSequence('sass', ['cssmin', 'imagemin', 'svgmin'], 'jshint', ['uglify', 'noconcat'], done);
});

gulp.task('build:child', function(done) {
  process.chdir(cwdChild);
  runSequence('sass', ['cssmin', 'imagemin', 'svgmin'], 'jshint', ['uglify', 'noconcat'], done);
});
