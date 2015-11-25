(function(r) {
    "use strict";

    var gulp = r('gulp');
    var nodemon = r('gulp-nodemon');
    var env = r('gulp-env');

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
