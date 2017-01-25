'use strict'

const fs              = require('fs');
const Q               = require('q');

const gulp            = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const glob            = require('multi-glob').glob;
const plugins         = gulpLoadPlugins();
const runSequence     = require('run-sequence');
const argv            = require('yargs').argv;

const source          = require('vinyl-source-stream');
const buffer          = require('vinyl-buffer');
const browserify      = require('browserify');
const babel           = require('babelify');
const es              = require('event-stream');


/**
 * Constants
 */
const config = require('./gulpconfig');

// ENV can be re-set in tasks.
let ENV = (argv.production || argv.prod || argv.p) ? 'production' : 'development';

const BASE_DIR = config.baseDir;
const WATCH_DIRS = config.watchDirs;
const DEV_DIRS = config.devDirs;
const BASE_THEME = config.baseTheme;


/**
 * Functions
 */

function swallowError(error) {
  console.log(error.toString());
  this.emit('end');
};

// Return a location string based on opts object.
// Will either be 'dir/name' or 'dir' depending on opts specificity.
function getLocation(opts) {
  if (opts.plugin) {
    return typeof opts.plugin === 'string' ? `plugins/${opts.plugin}` : 'plugins';
  } else if (opts.theme) {
    return typeof opts.theme === 'string' ? `themes/${opts.theme}` : 'themes';
  } else {
    return null;
  }
}

// Create a path based on the parameters.
//
// @param pattern   [string]  The suffix - where to look in the specified directory.
// @param location  [string]  The content directory. eg 'themes/base-theme'.
// @param base      [string]  Optional. The root directory. Defaults to BASE_DIR.
function setPath(pattern, location, base) {
  return `${base || BASE_DIR}/${location}/${pattern}`;
}

// Get an array of sources based on config options and flags.
//
// @param pattern   [string]  The suffix - where to look in the specified directory.
// @param opts      [object]  Override the argv flags. eg: {theme: 'child-theme'}.  
function getSrc(pattern, opts) {

  const location = getLocation(opts || argv);

  if (location && WATCH_DIRS.indexOf(location) === -1) {
    return [setPath(pattern, location)];
  } else {
    return WATCH_DIRS
      .filter((d) => !location || d === location)
      .map((dir) => DEV_DIRS[dir].map((name) => setPath(pattern, `${dir}/${name}`)))
      .reduce((a, b) => a.concat(b), []);
  }

}

// Helper to make sure parent themes are included when child-theme flags are specified.
function getSassSrc(argv, baseTheme) {

  const sources = getSrc('src/sass/**/*.sass');

  // If we're running a child theme, make sure the parent theme is included as well!
  if (typeof argv.theme === 'string' && argv.theme !== baseTheme) {
    return sources.concat(getSrc('src/sass/**/*.sass', {theme: baseTheme}));
  } else {
    return sources;
  }
  
}

// Bundle up the JavaScripts.
//
// @param entry [string]  Path to the entry JS file.
// @param env   [env]     Optional. Dev environment. Defaults to 'development'.
function bundle(entry, env) {
  var paths = ['./node_modules'];
  paths.push(entry.substr(0, entry.lastIndexOf('js/')+2));

  return browserify({
    entries: [entry],
    paths: paths,
    debug: env !== 'production',
  }).transform(babel, {presets: ['es2015']})
    .bundle()
    .on('error', e => plugins.util.log(plugins.util.colors.red('Error: ') + e.message))
    .pipe(source(entry))
    .pipe(buffer())
    .pipe(plugins.if(env === 'production', plugins.uglify()))
    .pipe(plugins.rename((path) => {
      path.dirname = path.dirname.replace('src/js', 'js');
      path.extname = '.bundle.js';
    }))
    .pipe(gulp.dest('./'));
}

// Parse the src blog into individual entry points.
//
// @param src   [array/string]  Source path(s).
function getScriptsArr(src) {
  return Q.Promise((resolve, reject) => {
    if (!src) {
      reject(new Error('No JS paths provided.'));
    }

    glob(src, (err, files) => {
      if (err) {
        reject(err);
      } else if (!files.length) {
        reject(new Error('No JS files to compile.'));
      } else {
        resolve(files);
      }
    });
  });
}

// Wrapper to map the entries (sources) for bundling. 
// See the bundle function (line 96) for the real magic.
function runScripts(sources, env) {
  getScriptsArr(sources)
    .then(files => files.map((entry) => bundle(entry, env)))
    .then(tasks => es.merge.apply(null, tasks))
    .catch(err => plugins.util.log(plugins.util.colors.yellow(err)));
}

// Helper for running styles.
function runStyles(sources, env, includePaths) {

  let sassOpts = {
    outputStyle: env === 'production' ? 'compressed' : 'nested',
    sourceComments: env !== 'production',
    indentedSyntax: true
  };

  if (includePaths) {
    sassOpts.includePaths = includePaths;
  }

  return gulp.src(sources, {base: './'})
    .pipe(plugins.sass(sassOpts).on('error', swallowError))
    .pipe(plugins.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(plugins.rename((path) => {
      const repl = path.basename === 'style' ? '' : 'css';
      path.dirname = path.dirname.replace('src/sass', repl);
    }))
    .pipe(gulp.dest('./'));
}

/**
 * Tasks
 */

// SASS compiling task.
gulp.task('styles', function() {

  const sources = getSassSrc(argv, BASE_THEME);

  // The third parameter is an include path. You can include any
  // sass file relatively at any time. This is mainly for
  // child theme styling purposes.
  const includePath = getSrc('src/sass', {theme: BASE_THEME});

  runStyles(sources, ENV, includePath);
  
});

// JavaScript compiling task.
gulp.task('scripts', ['lint'], () => {
  const sources = getSrc('src/js/**.js');

  runScripts(sources, ENV);
});

// JavaScript linter. See .eslintrc to adjust the rules.
gulp.task('lint', () => {
  const sources = getSrc('src/js/**/*.js');

  return gulp.src(sources)
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
    .pipe(plugins.eslint.failAfterError());
});

// Image minifying task.
gulp.task('imagemin', () => {
  const sources = getSrc('src/assets/img/**/*.{png,gif,jpg}');

  return gulp.src(sources, {base: './'})
    .pipe(plugins.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(plugins.rename((path) => {
      path.dirname = path.dirname.replace('src/assets', 'assets');
    }))
    .pipe(gulp.dest('./'));
});

// SVG minifying task.
gulp.task('svgmin', () => {

  const location = getLocation(argv);
  const sources = getSrc('src/assets/svg/**/*.svg');

  return gulp.src(sources, {base: './'})
    .pipe(plugins.svgmin())
    .pipe(plugins.rename((path) => {
      path.dirname = path.dirname.replace('src/assets', 'assets');
    }))
    .pipe(gulp.dest('./'));
});


// The default task.
gulp.task('default', ['styles', 'scripts'], (done) => {

  plugins.livereload.listen();

  const sassSources = getSassSrc(argv, BASE_THEME);
  const cssSources = getSrc('**/*.css');
  const jsSources = getSrc('src/js/**/*.js');
  const compiledSources = cssSources.concat(getSrc('js/*.bundle.js'));

  // Styles
  gulp.watch(sassSources, ['styles']);

  // Scripts
  gulp.watch(jsSources, ['scripts']);

  // If any css or .bundle javascript file changes, reload.
  gulp.watch(compiledSources, plugins.livereload.changed);
});


// Build the thing in production mode (unless otherwise specified);
gulp.task('build', ['info'], done => {
  ENV = (argv.development || argv.dev || argv.d) ? 'development' : 'production';
  runSequence(['styles', 'scripts'], ['imagemin', 'svgmin'], done);
});