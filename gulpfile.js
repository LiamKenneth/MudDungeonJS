(function(r) {
    "use strict";

    var gulp = r('gulp');
    var nodemon = r('gulp-nodemon');
    var env = r('gulp-env');
    var mocha = r('gulp-mocha');
    var istanbul = r('gulp-istanbul');

    gulp.task('pre-test', function () {
      return gulp.src(['./Game/**/*.js'])
        // Covering files
        .pipe(istanbul())
        // Force `require` to return covered files
        .pipe(istanbul.hookRequire());
    });

    gulp.task('test',['pre-test'], function () {
       gulp.src('./Tests/**/*.js', {read:false})
            .pipe(mocha({reporter: 'nyan'}))
            // Creating the reports after tests ran
    .pipe(istanbul.writeReports())

    });

    gulp.task('default', function () {
        nodemon({
            script: 'mudDungeon.js',
            ext: 'js',
            env: {
                PORT: 23
            },
            ignore: ['./node_modules/**']
        }).on('restart', function () {
            console.log("Restarted server");
        });
    });


})(require)
