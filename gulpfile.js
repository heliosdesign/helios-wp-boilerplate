var fs              = require('fs');

var gulp            = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins         = gulpLoadPlugins();
var runSequence     = require('run-sequence');
var argv            = require('yargs').argv;

var source          = require('vinyl-source-stream');
var buffer          = require('vinyl-buffer');
var watchify        = require('watchify');
var browserify      = require('browserify');
var babel           = require('babelify');

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
 * Set up the current working directory before each command.
 */

// These are the path defaults. Change them if you update the
// theme or plugin name or location.
var chdirs = {
  default: './wp-content/themes/base-theme',
  child: './wp-content/themes/child-theme',
  plugin: './wp-content/plugins/base-plugin'
};

var cwd = chdirs[argv.dir] || chdirs[argv.d] || argv.path || argv.p || chdirs.default;

process.chdir(cwd);


/**
 * Functions
 */
function swallowError(error) {
  console.log(error.toString());
  this.emit('end');
};

function bundle(w, env) {
  var prod = env === 'production';
  // For now, let's see if always compiling to bundle works for us.
  // If it's too weird using the same filename for both environments
  // change the first string in the ternary to 'bundle.min.js'.
  var name = prod ? '/bundle.js' : 'bundle.js';

  if (!w) { return; }

  return w.bundle()
    .on('error', e => plugins.util.log(plugins.util.colors.red('Error: ') + e.message))
    .pipe(source(src.base + name))
    .pipe(buffer())
    .pipe(plugins.if(prod, plugins.uglify()))
    .pipe(gulp.dest(dist.js));
}

function runScripts(env, cb) {

  // var env = env || 'development';
  var entry = src.js + 'index.js';

  fs.stat(entry, function(err, stat) {
    var b;

    if (!err) {
      b = browserify({
        entries: [entry],
        paths: ['./node_modules', src.js + '/'],
        debug: env === 'development',
      }).transform(babel, {presets: ['es2015']});
    }

    if (cb) {
      cb(b);
    }
  });
}

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
  runScripts('production', function(b) {

    return bundle(b, 'production');

    // return b.bundle()
    //   .on('error', e => plugins.util.log(plugins.util.colors.red('Error: ') + e.message))
    //   .pipe(source(src.base + '/bundle.min.js'))
    //   .pipe(buffer())
    //   .pipe(plugins.uglify())
    //   .pipe(gulp.dest(dist.js));
  });
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

  runScripts(null, (b) => {

    if (b) {
      var w = watchify(b);
      w.on('update', () => bundle(w));
      bundle(w);
    }

  });
});

gulp.task('build', function(done) {
  runSequence('styles', 'lint', 'scripts:prod', ['imagemin', 'svgmin'], 'noconcat', done);
});
