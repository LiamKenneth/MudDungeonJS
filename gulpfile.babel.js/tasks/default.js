'use strict';

import gulp from 'gulp';
import nodemon from 'gulp-nodemon';

gulp.task('default', () => {
  nodemon({
    script: 'mudDungeon.js',
    ext: 'js',
    env: {
      PORT: 23
    },
    ignore: ['/node_modules/**']
  }).on('restart', () => {
    console.log('Restarted server');
  });
});
