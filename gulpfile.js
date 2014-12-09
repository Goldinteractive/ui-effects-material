/* jshint node:true */

'use strict';

var gulp = require('gulp');

require('./tasks/build');
require('./tasks/test');
require('./tasks/watch');

gulp.task('default', ['build', 'test']);