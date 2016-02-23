'use strict';

import gulp from 'gulp';
import mocha from 'gulp-mocha';
import istanbul from 'gulp-istanbul';

gulp.task('pre-test', () => {
  return gulp.src(['./Game/**/*.js'])

    // Covering files
    .pipe(istanbul())

    // Force `require` to return covered files
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], () => {
  gulp.src('./Tests/**/*.js', { read: false })
    .pipe(mocha({ reporter: 'nyan' }))

    // Creating the reports after tests ran
    .pipe(istanbul.writeReports())
});
