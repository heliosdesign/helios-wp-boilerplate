var gulp            = require('gulp'),
    gutil           = require('gulp-util'),
    sequence        = require('gulp-run-sequence')
    compass         = require('gulp-compass'),
    sass            = require('gulp-ruby-sass'),
    autoprefixer    = require('gulp-autoprefixer'),
    minifycss       = require('gulp-minify-css'),
    jshint          = require('gulp-jshint'),
    uglify          = require('gulp-uglify'),
    imagemin        = require('gulp-imagemin'),
    rename          = require('gulp-rename'),
    clean           = require('gulp-clean'),
    concat          = require('gulp-concat'),
    notify          = require('gulp-notify'),
    cache           = require('gulp-cache'),
    livereload      = require('gulp-livereload'),
    lr              = require('tiny-lr'),
    server          = lr(),
    info            = require('./config.json');


gulp.task('styles', function() {
    return gulp.src('_src/sass/style.sass')
        .pipe(sass({ style: 'expanded', compass: true }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        //.pipe(gulp.dest('../dist/'))
        //.pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('./'))
        .pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('main-style', function(){
    gulp.src('style.css')
        .pipe(livereload(server));
});

gulp.task('scripts', function() {
    return gulp.src('_src/js/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('./js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('./js'))
        .pipe(livereload(server))
        .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('images', function() {
  return gulp.src('_src/assets/img/**/*')
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('./assets/img'))
    .pipe(livereload(server))
    .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('clean', function() {
  return gulp.src(['./js', './assets/img'], {read: false})
    .pipe(clean());
});

gulp.task('build', ['clean'], function() {
    gulp.start('styles', 'images');
});

gulp.task('watch', function() {
    server.listen(35729, function(err){
        if(err) {
            return console.log(err)
        }

        gulp.watch('_src/sass/**/*.sass', ['styles']);
        gulp.watch('_src/js/*.js', ['scripts']);
        gulp.watch('_src/assets/img/**/*', ['images']);
        gulp.watch('style.css', ['main-style']);
    });    
});