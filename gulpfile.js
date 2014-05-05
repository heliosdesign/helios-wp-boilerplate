var gulp            = require('gulp'),
    // gutil           = require('gulp-util'),
    //sequence        = require('gulp-run-sequence')
    compass         = require('gulp-compass'),
    sass            = require('gulp-ruby-sass'),
    //autoprefixer    = require('gulp-autoprefixer'),
    minifycss       = require('gulp-minify-css'),
    jshint          = require('gulp-jshint'),
    uglify          = require('gulp-uglify'),
    imagemin        = require('gulp-imagemin'),
    svgmin          = require('gulp-svgmin'),
    rename          = require('gulp-rename'),
    clean           = require('gulp-clean'),
    concat          = require('gulp-concat'),
    notify          = require('gulp-notify'),
    //cache           = require('gulp-cache'),
    livereload      = require('gulp-livereload'),
    lr              = require('tiny-lr'),
    server          = lr();

var src = {
    base: './src',
    styles: './src/sass',
    scripts: './src/js',
    assets: './src/assets'
}
var dist = {
    base: './dist',
    styles: './dist/css',
    scripts: './dist/js',
    assets: './dist/assets'
}

gulp.task('styles', function() {
    return gulp.src(src.styles + '/style.sass')
        .pipe(sass({ style: 'expanded', compass: true }))
        .on('error', function(e){ gutil.log(e.message) })
        //.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest(src.base))
        //.pipe(rename({suffix: '.min'}))
        //.pipe(minifycss())
        .pipe(livereload(server))
        //.pipe(gulp.dest(dist.base))
        .pipe(notify({ message: 'Styles task complete.' }));
});

gulp.task('scripts', function() {
    return gulp.src(src.scripts + '/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        //.pipe(concat('main.js'))
        //.pipe(gulp.dest(src.scripts))
        //.pipe(rename({suffix: '.min'}))
        // .pipe(uglify())
        .pipe(gulp.dest(src.scripts))
        .pipe(livereload(server))
        .pipe(notify({ message: 'Scripts task complete.' }));
});

var buildStyles = function() {
    return gulp.src(src.styles + '/style.sass')
        .pipe(sass({ style: 'compressed', compass: true }))
        .on('error', function(e){ gutil.log(e.message) })
        //.pipe(minifycss())
        .pipe(gulp.dest(dist.base))
        .pipe(notify({ message: 'Styles built.' }));
}

var buildScripts = function() {
    return gulp.src(src.scripts + '/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(dist.scripts))
        .pipe(notify({ message: 'Scripts built.' }));
}

var buildImg = function() {
    return gulp.src(src.assets + '/img/**/*')
        .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
        .pipe(gulp.dest(dist.assets + '/img'))
        //.pipe(livereload(server))
        .pipe(notify({ message: 'Images compressed and moved.' }));
};

var buildSVG = function() {
    return gulp.src(src.assets + '/svg/**/*')
        .pipe(gulp.dest(dist.assets + '/svg'))
        .pipe(svgmin())
        .pipe(notify({ message: 'SVGs compressed and moved.' }));
}

var moveFiles = function() {
    gulp.src([
        src.base + '/**/*.php',
        src.base + '/fonts/*'
    ], {base: src.base})
        .pipe(gulp.dest(dist.base))
}

gulp.task('clean', function() {
    return gulp.src([dist.base], {read: false})
        .pipe(clean());
});

gulp.task('build', ['clean'], function() {
    buildStyles();
    buildScripts();
    buildImg();
    moveFiles();
});

gulp.task('watch', function() {
    server.listen(35729, function(err){
        if(err) {
            return console.log(err)
        }

        gulp.watch(src.styles + '/**/*.sass', ['styles']);
        //gulp.watch(src.scripts + '/*.js', ['scripts']);
        gulp.watch(src.assets + '/img/**/*', ['images']);
    });    
});