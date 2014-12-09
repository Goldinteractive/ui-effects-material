/* jshint node:true */
'use strict';

var gulp = require('gulp'),
  jshint = require('gulp-jshint');


gulp.task('test', function () {
  gulp.src(['src/index.js'])
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'));
});