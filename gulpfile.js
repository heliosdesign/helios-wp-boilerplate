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
// const watchify        = require('watchify');
const browserify      = require('browserify');
const babel           = require('babelify');
const es              = require('event-stream');

const config = require('./gulpconfig');

let ENV = (argv.production || argv.prod || argv.p) ? 'production' : 'development';

if (argv.development || argv.dev || argv.d) {
  ENV = 'development';
}


/**
 * Functions
 */

function swallowError(error) {
  console.log(error.toString());
  this.emit('end');
};

function getBaseTheme(config) {
  return config.basetheme || config.themes[0];
}

function getLocation(argv) {
  if (argv.plugin) {
    return typeof argv.plugin === 'string' ? `plugins/${argv.plugin}` : 'plugins';
  } else if (argv.theme) {
    return typeof argv.theme === 'string' ? `themes/${argv.theme}` : 'themes';
  } else {
    return null;
  }
}

function setPath(matcher, replacer) {
  return matcher.replace('%location%', replacer);
}

function getSrc(matcher, location) {

  if (location && config.watchDirs.indexOf(location) === -1) {
    return [setPath(matcher, location)];
  }

  return config.watchDirs
    .filter((d) => !location || d === location)
    .map((dir) => config[dir].map((name) => setPath(matcher, `${dir}/${name}`)))
    .reduce((a, b) => a.concat(b), []);
}

function getSassSrc(argv, baseTheme) {
  const location = getLocation(argv);
  let sources = getSrc('./wp-content/%location%/src/sass/**/*.sass', location);

  // If we're running a child theme, make sure the parent
  // theme is included as well!
  if (typeof argv.theme === 'string' && argv.theme !== baseTheme) {
    sources.push('./wp-content/themes/' + baseTheme + '/src/sass/**/*.sass');
  }

  return sources;
}


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

function runScripts(sources, env) {
  getScriptsArr(sources)
    .then(files => files.map((entry) => bundle(entry, env)))
    .then(tasks => es.merge.apply(null, tasks))
    .catch(err => plugins.util.log(plugins.util.colors.yellow(err)));
}

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

  const baseTheme = getBaseTheme(config);
  const sources = getSassSrc(argv, baseTheme);

  // The third parameter is an include path. You can include any
  // sass file relatively at any time. This is mainly for
  // child theme styling purposes.
  runStyles(sources, ENV, ['./wp-content/themes/' + baseTheme + '/src/sass']);
  
});

// JavaScript compiling task.
gulp.task('scripts', ['lint'], () => {
  const location = getLocation(argv);
  const sources = getSrc('./wp-content/%location%/src/js/**.js', location);

  runScripts(sources, ENV);
});

gulp.task('lint', () => {

  const location = getLocation(argv);
  const sources = getSrc('./wp-content/%location%/src/js/**/*.js', location);

  return gulp.src(sources)
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
    .pipe(plugins.eslint.failAfterError());
});

// Image minifying task.
gulp.task('imagemin', () => {

  const location = getLocation(argv);
  const sources = getSrc('./wp-content/%location%/src/assets/img/**/*.{png,gif,jpg}', location)

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
  const sources = getSrc('./wp-content/%location%/src/assets/svg/**/*.svg', location);

  return gulp.src(sources, {base: './'})
    .pipe(plugins.svgmin())
    .pipe(plugins.rename((path) => {
      path.dirname = path.dirname.replace('src/assets', 'assets');
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('default', ['styles', 'scripts'], (done) => {

  plugins.livereload.listen();

  const location = getLocation(argv);
  const baseTheme = getBaseTheme(config);
  const sassSources = getSassSrc(argv, baseTheme);
  const cssSources = getSrc('./wp-content/%location%/**/*.css', location);
  const jsSources = getSrc('./wp-content/%location%/src/js/**/*.js', location);


  // If we're running a child theme only make sure the parent
  // theme is included as well!
  if (argv.theme && argv.theme !== baseTheme) {
    sassSources.push('./wp-content/themes/' + baseTheme + '/src/sass/**/*.sass');
  }

  // Styles
  gulp.watch(sassSources, ['styles']);

  // Scripts
  gulp.watch(jsSources, ['scripts']);

  // If any css or .bundle javascript file changes, reload.
  gulp.watch(cssSources.concat(getSrc('./wp-content/%location%/js/*.bundle.js', location)), plugins.livereload.changed);
});

gulp.task('build', ['info'], done => {
  ENV = (argv.dev || argv.d) ? 'development' : 'production';
  runSequence(['styles', 'scripts'], ['imagemin', 'svgmin'], done);
});