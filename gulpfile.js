/**
 * Gulp configuration file.
 */


// NPM modules
const gulp     = require('gulp');
const cleanCSS = require('gulp-clean-css');
const header   = require('gulp-header');
const merge    = require('merge-stream');
const rename   = require("gulp-rename");
const sass     = require('gulp-sass');
const uglify   = require('gulp-uglify');


// Local modules
const pkg = require('./package.json');


// Set the banner content
const BANNER = ['/*!\n',
  ' * <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
  ' * Copyright 2013 - ' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
  ' */\n',
  ''
].join('');


// Copy third party libraries from /node_modules into /vendor
gulp.task('vendor', function() {

    return merge(

        // Bootstrap
        gulp.src([
            './node_modules/bootstrap/dist/**/*',
            '!./node_modules/bootstrap/dist/css/bootstrap-grid*',
            '!./node_modules/bootstrap/dist/css/bootstrap-reboot*'
        ]).pipe(gulp.dest('./vendor/bootstrap')),

        // Font Awesome 5
        gulp.src([
            './node_modules/@fortawesome/**/*'
        ]).pipe(gulp.dest('./vendor')),

        // jQuery
        gulp.src([
            './node_modules/jquery/dist/*',
            '!./node_modules/jquery/dist/core.js'
        ]).pipe(gulp.dest('./vendor/jquery')),

        // jQuery Easing
        gulp.src([
            './node_modules/jquery.easing/*.js'
        ]).pipe(gulp.dest('./vendor/jquery-easing')),

    );

});

// Compile SCSS
gulp.task('css:compile', function() {
  return gulp.src('./scss/**/*.scss')
    .pipe(sass.sync({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(header(BANNER, {
      pkg: pkg
    }))
    .pipe(gulp.dest('./css'))
});

// Minify CSS
gulp.task('css:minify', gulp.series('css:compile', function() {
  return gulp.src([
      './css/*.css',
      '!./css/*.min.css'
    ])
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./css'));
}));

// CSS
gulp.task('css', gulp.series('css:compile', 'css:minify'));

// Minify JavaScript
gulp.task('js:minify', function() {
  return gulp.src([
      './js/*.js',
      '!./js/*.min.js'
    ])
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(header(BANNER, {
      pkg: pkg
    }))
    .pipe(gulp.dest('./js'));
});

// JS
gulp.task('js', gulp.series('js:minify'));

// Default task
gulp.task('default', gulp.series(['css', 'js', 'vendor']));

// Dev task
gulp.task('dev', gulp.series('css', 'js', function() {
    gulp.watch('./scss/*.scss', gulp.series('css'));
    gulp.watch('./js/*.js', gulp.series('js'));
}));
