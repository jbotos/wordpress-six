'use strict';

// npm install --save-dev gulp-sass gulp-concat gulp-concat gulp-rename gulp-uglify gulp-order

const gulp = require('gulp');
const { src, series, parallel, dest, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const order = require('gulp-order');

var paths = {
    styles: {
      src: 'wp-content/themes/**/_scss/**/*.scss',
      dest: 'wp-content/themes/**/assets/css'
    },
    scripts: {
      src: 'wp-content/themes/**/_js/**/*.js',
      dest: 'wp-content/themes/**/assets/js'
    }
};

function compileScss() {
	return src(paths.styles.src)
		.pipe(sass())
		.pipe(rename({
	  	basename: 'default',
	  	suffix: '.min'
		}))
		.pipe(sass({outputStyle: 'compressed'}))
		.pipe(concat('default.min.css'))
		.pipe(dest(paths.styles.dest));
}

function compileScripts() {
	return src(paths.scripts.src)
    .pipe(order([
        "_vendor/jquery-3.6.0.min.js",
        "_vendor/bootstrap.min.js",
        "_vendor/ie10-viewport-bug-workaround.js",
        "_vendor/*.js",
        "init.js",
        "*.js"
    ]))
		.pipe(uglify())
		.pipe(concat('default.min.js'))
		.pipe(dest(paths.scripts.dest));
}

function watchScss(cb) {
	gulp.watch('wp-content/themes/**/_scss/**/*.scss', compileScss);
  gulp.watch('wp-content/themes/**/_js/**/*.js', compileScripts);
	cb();
}

exports.compileScss = compileScss;
exports.default = series(
  compileScss,
  compileScripts,
	watchScss
);
