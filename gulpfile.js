/* global console */
'use strict'

const argv = require('yargs').argv
const babel = require('babelify')
const browserify = require('browserify')
const buffer = require('vinyl-buffer')
const es = require('event-stream')
const fs = require('fs')
const glob = require('multi-glob').glob
const gulp = require('gulp')
const gulpLoadPlugins = require('gulp-load-plugins')
const path = require('path')
const plugins = gulpLoadPlugins()
const Q = require('q')
// const runSequence = require('run-sequence')
const source = require('vinyl-source-stream')

/**
 * Constants
 */
const config = require('./gulpconfig')

// ENV can be re-set in tasks.
let ENV = argv.production || argv.prod || argv.p ? 'production' : 'development'

const BASE_DIR = config.baseDir
const TEMPLATE_DIR = config.templateDir
const PROJECTS = config.projects

const ARG_PROJ = argv.project || argv.proj || argv.p || null
const ARG_TYPE = argv.type || argv.t || null

/**
 * Functions
 */

function swallowError(error) {
  console.log(error.toString())
  this.emit('end')
}

// Create a path based on the parameters.
//
// @param pattern   [string]  The suffix - where to look in the specified directory.
// @param location  [string]  The content directory. eg 'themes/base-theme'.
// @param base      [string]  Optional. The root directory. Defaults to BASE_DIR.
function setPath(pattern, location, base) {
  return `${base || BASE_DIR}/${location}/${pattern}`
}

// Get an array of sources based on config options and flags.
//
// @param pattern   [string]  The suffix - where to look in the specified directory.
// @param proj      [string]  A project id. Target that project specifically.
// @param type      [string]  Get the sources relevant to a type. eg. 'theme', 'plugin'.
function getSrc(pattern, proj, type) {
  return PROJECTS.filter(project => !proj || proj === project.id)
    .filter(project => !type || type === project.type)
    .map(project => setPath(pattern, `${project.type}s/${project.id}`))
}

// Helper to make sure parent themes are included when child-theme flags are specified.
function getSassSrc(id) {
  const sources = getSrc('src/sass/**/*.sass', id)

  // If we're running a child theme, make sure the parent theme is included as well!
  // if (typeof argv.theme === 'string' && argv.theme !== baseTheme) {
  if ((PROJECTS[id] || {}).parent) {
    sources.push(getSrc('src/sass/**/*.sass', PROJECTS[id].parent))
  }

  return sources
}

// Bundle up the JavaScripts.
//
// @param entry [string]  Path to the entry JS file.
// @param env   [env]     Optional. Dev environment. Defaults to 'development'.
function bundle(entry, env) {
  var paths = ['./node_modules']
  paths.push(entry.substr(0, entry.lastIndexOf('js/') + 2))

  return browserify({
    entries: [entry],
    paths: paths,
    debug: env !== 'production'
  })
    .transform(babel, { presets: ['@babel/preset-env'] })
    .bundle()
    .on('error', e => plugins.util.log(plugins.util.colors.red('Error: ') + e.message))
    .pipe(source(entry))
    .pipe(buffer())
    .pipe(plugins.if(env === 'production', plugins.uglify()))
    .pipe(
      plugins.rename(path => {
        path.dirname = path.dirname.replace('src/js', 'js')
        path.extname = '.bundle.js'
      })
    )
    .pipe(gulp.dest('./'))
}

// Parse the src blog into individual entry points.
//
// @param src   [array/string]  Source path(s).
function getScriptsArr(src) {
  return Q.Promise((resolve, reject) => {
    if (!src) {
      reject(new Error('No JS paths provided.'))
    }

    glob(src, (err, files) => {
      if (err) {
        reject(err)
      } else if (!files.length) {
        reject(new Error('No JS files to compile.'))
      } else {
        resolve(files)
      }
    })
  })
}

// Wrapper to map the entries (sources) for bundling.
// See the bundle function (line 109) for the real magic.
//
// @param sources       [array/string]  The sass sources.
// @param env           [env]           Optional. Dev environment. Defaults to 'development'.
function runScripts(sources, env) {
  return getScriptsArr(sources)
    .then(files => files.map(entry => bundle(entry, env)))
    .then(tasks => es.merge.apply(null, tasks))
    .catch(err => plugins.util.log(plugins.util.colors.yellow(err)))
}

// Helper for running styles.
//
// @param sources       [array/string]  The sass sources.
// @param env           [env]           Optional. Dev environment. Defaults to 'development'.
// @param includePaths  [array]         Set additional directories for the @include(s) to look in.
function runStyles(sources, env, includePaths) {
  let sassOpts = {
    outputStyle: env === 'production' ? 'compressed' : 'nested',
    sourceComments: env !== 'production',
    indentedSyntax: true
  }

  if ((includePaths || []).length > 0) {
    sassOpts.includePaths = includePaths
  }

  return gulp
    .src(sources, { base: './' })
    .pipe(plugins.sass(sassOpts).on('error', swallowError))
    .pipe(
      plugins.autoprefixer(
        'last 2 version',
        'safari 5',
        'ie 8',
        'ie 9',
        'opera 12.1',
        'ios 6',
        'android 4'
      )
    )
    .pipe(
      plugins.rename(path => {
        const repl = path.basename === 'style' ? '' : 'css'
        path.dirname = path.dirname.replace('src/sass', repl)
      })
    )
    .pipe(gulp.dest('./'))
}

// Write theme information variables into sass files.
//
// @param theme [object]  The theme info from gulpconfig.
// @param opts  [object]  Object variables. For now only
//                          -log [string]: 'none', 'title'
function writeInfo(theme, opts) {
  return Q.Promise((resolve, reject) => {
    const options = opts || {}
    const parent = theme.parent ? `'Template: ${theme.parent}'` : `''`
    const contents = [
      "// This file is auto-generated by 'gulp info' task.",
      `$info-id: '${theme.id}'`,
      `$info-name: '${theme.name}'`,
      `$info-description: '${theme.description}'`,
      `$info-parent: ${parent}`,
      `$info-version: '${theme.version}'`
    ].join('\r\n')

    const paths = getSrc('src/sass/global/_info-variables.sass', theme.id)

    if (paths[0]) {
      fs.writeFile(paths[0], contents, () => {
        if (options.log !== 'none') {
          console.log('')
          console.log(plugins.util.colors.green(`Writing info to ${theme.id}:`))

          if (options.log !== 'title') {
            console.log(contents)
          }
          console.log('')
        }

        resolve(paths[0])
      })
    } else {
      reject(new Error('No write path.'))
    }
  })
}

function newProject(project) {
  return Q.Promise((resolve, reject) => {
    const outPath = `${BASE_DIR}/${project.type}s/${project.id}`

    if (!fs.existsSync(path)) {
      const tmplName = `${project.parent ? 'child-' : ''}${project.type}`
      const stream = gulp.src(`${TEMPLATE_DIR}/${tmplName}${'/**/*.*'}`).pipe(gulp.dest(outPath))

      stream.on('end', () => {
        resolve()
      })

      stream.on('error', err => {
        reject(err)
      })
    } else {
      resolve()
    }
  })
}

/**
 * Tasks
 */

// Move and rename projects from template.
gulp.task('buildProject', done => {
  const promises = PROJECTS.filter(project => !ARG_PROJ || ARG_PROJ === project.id).map(project =>
    newProject(project)
  )

  Q.all(promises)
    .then(() => done())
    .catch(err => console.log(err.toString()))
})

// Set the info in theme CSS base on gulpconfig.js
gulp.task('info', done => {
  if (ARG_TYPE === 'plugin') {
    return done()
  }

  const promises = PROJECTS.filter(project => project.type === 'theme')
    .filter(project => !ARG_PROJ || ARG_PROJ === project.id)
    .map(theme => writeInfo(theme))

  Q.all(promises).then(() => {
    return done()
  })
})

// SASS compiling task.
gulp.task('styles', done => {
  const sources = getSassSrc(ARG_PROJ)

  const includePaths = PROJECTS.filter(project => project.type === 'theme' && project.parent)
    .filter(project => !ARG_PROJ || ARG_PROJ === project.id)
    .map(theme => getSrc('src/sass', theme.parent)[0])

  runStyles(sources, ENV, includePaths)

  done()
})

// JavaScript linter. See .eslintrc to adjust the rules.
gulp.task('lint', () => {
  const sources = getSrc('src/js/**/*.js', ARG_PROJ, ARG_TYPE)

  return gulp
    .src(sources)
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
    .pipe(plugins.eslint.failAfterError())
})

// JavaScript compiling task.
gulp.task(
  'scripts',
  gulp.series('lint', done => {
    const sources = getSrc('src/js/**.js', ARG_PROJ, ARG_TYPE)

    runScripts(sources, ENV).then(() => {
      done()
    })
  })
)

// Image minifying task.
gulp.task('imagemin', () => {
  const sources = getSrc('src/assets/img/**/*.{png,gif,jpg}', ARG_PROJ, ARG_TYPE)

  return gulp
    .src(sources, { base: './' })
    .pipe(plugins.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(
      plugins.rename(path => {
        path.dirname = path.dirname.replace('src/assets', 'assets')
      })
    )
    .pipe(gulp.dest('./'))
})

// SVG minifying task.
gulp.task('svgmin', () => {
  const sources = getSrc('src/assets/svg/**/*.svg', ARG_PROJ, ARG_TYPE)

  return gulp
    .src(sources, { base: './' })
    .pipe(plugins.svgmin())
    .pipe(
      plugins.rename(path => {
        path.dirname = path.dirname.replace('src/assets', 'assets')
      })
    )
    .pipe(gulp.dest('./'))
})

// The default task.
gulp.task(
  'default',
  gulp.series(plugins.livereload.listen, 'styles', 'scripts', 'imagemin', 'svgmin', done => {
    const sassSources = getSassSrc(ARG_PROJ)
    const cssSources = getSrc('**/*.css', ARG_PROJ, ARG_TYPE)
    const jsSources = getSrc('src/js/**/*.js')
    const imgSources = getSrc('src/assets/img/**/*.{png,gif,jpg}', ARG_PROJ, ARG_TYPE)
    const svgSources = getSrc('src/assets/svg/**/*.svg', ARG_PROJ, ARG_TYPE)
    const compiledSources = cssSources.concat(getSrc('js/*.bundle.js'))

    // Styles
    gulp.watch(sassSources, gulp.series('styles'))

    // Scripts
    gulp.watch(jsSources, gulp.series('scripts'))

    // Images
    gulp.watch(imgSources, gulp.series('imagemin'))

    // SVG
    gulp.watch(svgSources, gulp.series('svgmin'))

    // If any css or .bundle javascript file changes, reload.
    gulp.watch(compiledSources, done => {
      // plugins.livereload.changed()
      plugins.livereload.reload()
      done()
    })
    done()
  })
)

// Create new projects.
gulp.task(
  'create',
  gulp.series('buildProject', 'info', 'styles', 'scripts', done => {
    done()
    // runSequence(, done)
  })
)

// Build the thing in production mode (unless otherwise specified);
gulp.task(
  'build',
  gulp.series('info', () => {
    ENV = argv.development || argv.dev || argv.d ? 'development' : 'production'
    gulp.series('styles', 'scripts', 'imagemin', 'svgmin', done => {
      done()
    })
    // runSequence(['styles', 'scripts'], ['imagemin', 'svgmin'], done)
  })
)
