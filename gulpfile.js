'use strict'

const fs              = require('fs');
const Q               = require('q');

const gulp            = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const plugins         = gulpLoadPlugins();
const runSequence     = require('run-sequence');
const argv            = require('yargs').argv;

const source          = require('vinyl-source-stream');
const buffer          = require('vinyl-buffer');
const watchify        = require('watchify');
const browserify      = require('browserify');
const babel           = require('babelify');


/**
 * Set up the current working directory before each command.
 */

// These are the path defaults. Change them if you update the
// theme or plugin name or location.
const chdirs = {
  default: './wp-content/themes/base-theme',
  child: './wp-content/themes/child-theme',
  plugin: './wp-content/plugins/base-plugin'
};

let cwd = chdirs[argv.dir] || chdirs[argv.d] || argv.path || argv.p || chdirs.default;

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
    .pipe(source(cwd + name))
    .pipe(buffer())
    .pipe(plugins.if(prod, plugins.uglify()))
    .pipe(plugins.rename((path) => {
      path.dirname += '/js';
    }))
    .pipe(gulp.dest('./'));
}

function runScripts(env, cb) {
  const entry = cwd + '/src/js/index.js';

  fs.stat(entry, function(err, stat) {
    let b;

    if (!err) {
      b = browserify({
        entries: [entry],
        paths: ['./node_modules', cwd + '/src/js'],
        debug: env !== 'production',
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
  return gulp.src([cwd + '/src/sass/**/*.sass'])
    .pipe(plugins.sass({
      style: 'compressed',
      indentedSyntax: true
    }))
    .on('error', swallowError)
    .pipe(plugins.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(plugins.cssmin())
    .pipe(gulp.dest(cwd));
});


gulp.task('scripts', () => {
  runScripts(null, b => bundle(b));
});


gulp.task('scripts:prod', () => {
  runScripts('production', b => bundle(b, 'production'));
});


gulp.task('lint', () => {
  return gulp.src([cwd + '/src/js/**/*.js'])
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
  return gulp.src(cwd + '/src/js/noconcat/**/*.js')
    .pipe(plugins.uglify())
    .pipe(gulp.dest(cwd + '/js/noconcat'));
});

// Image minifying task.
gulp.task('imagemin', () => {
  return gulp.src(cwd + '/src/assets/img/**/*.{png,gif,jpg}')
    .pipe(plugins.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest(cwd + '/assets/img'));
});

// SVG minifying task.
gulp.task('svgmin', () => {
  return gulp.src(cwd + '/src/assets/svg/**/*.svg')
    .pipe(plugins.svgmin())
    .pipe(gulp.dest(cwd + '/assets/svg'));
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

gulp.task('build', done => {
  runSequence('styles', 'lint', 'scripts:prod', ['imagemin', 'svgmin'], done);
});

gulp.task('build:all', done => {

  // Runs through all the paths listed in the chdirs object and executes
  // the build process for them.

  let paths = Object.keys(chdirs).map((key) => chdirs[key]);

  function runBuild(path) {

    console.log('');
    console.log('');
    plugins.util.log(plugins.util.colors.green('Running build for: ') + path);

    return Q.Promise(function(resolve, reject) {
      cwd = path;

      runSequence('styles', 'lint', 'scripts:prod', ['imagemin', 'svgmin'], function() {
        console.log('');
        resolve();
      });
    });
  }

  let result = Q();
  paths.forEach(path => {
    result = result.then(runBuild.bind(null, path));
  });
  return result;

});