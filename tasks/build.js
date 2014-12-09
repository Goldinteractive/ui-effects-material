/* jshint node:true */
'use strict';

var gulp = require('gulp'),
	fs = require('fs'),
	wrap = require('gulp-wrap'),
	to5 = require('gulp-6to5'),
	startFrag = fs.readFileSync('src/frag/start.frag', 'utf8'),
	endFrag = fs.readFileSync('src/frag/end.frag', 'utf8');

gulp.task('build', function () {
	return gulp.src('src/index.js')
		.pipe(to5({
			blacklist: ['useStrict'],
			modules: 'commonInterop'
		}))
		.pipe(wrap(startFrag + '\n<%= contents %>\n' + endFrag))
		.pipe(gulp.dest('./'));
});