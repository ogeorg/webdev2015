'use strict';

var gulp        = require('gulp'),
    rename      = require('gulp-rename'),
    uglify      = require('gulp-uglify'),
    concat      = require('gulp-concat'),
    sourcemaps  = require('gulp-sourcemaps'),
    stylus      = require('gulp-stylus'),
    jshint      = require('gulp-jshint'),
    livereload  = require('gulp-livereload'),
    watch       = require('gulp-watch'),
    //imagemin    = require('gulp-imagemin'),
    header      = require('gulp-header'),
    replace     = require('gulp-token-replace'),
    nib         = require('nib'),
    jade        = require('gulp-jade'),
    coffee      = require('gulp-coffee');

var pkg         = require('./package.json'),
    config      = require('./config.json');
    config.debug.version = pkg.version; 
    config.build.version = pkg.version; 

var srcPath         = config.srcPath,
    distPath        = config.distPath;

var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @author <%= pkg.author %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');

gulp.task('html', function() {
 
  gulp.src(srcPath+'/jade/*.jade')
    .pipe(jade({
      locals: config.debug, 
      pretty: true
    }))
    .pipe(gulp.dest(distPath))
    .pipe(livereload());
});

gulp.task('html-build', function() {
 
  gulp.src(srcPath+'/jade/*.jade')
    .pipe(jade({
      locals: config.build
    }))
    .pipe(gulp.dest(distPath));
});


gulp.task('js-build', function () {
  return gulp.src(srcPath+'/coffee/*.coffee')
    .pipe(sourcemaps.init())
    .pipe(coffee())
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(uglify())
    .pipe(concat(pkg.name+'.min.js'))
    .pipe(header(banner, { pkg : pkg } ))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(distPath+"/js/"));

});

gulp.task('js', function () {
  return gulp.src(srcPath+'/coffee/*.coffee')
    .pipe(sourcemaps.init())
    .pipe(coffee())
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat(pkg.name+'.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(distPath+"/js/"))
    .pipe(livereload());
});

gulp.task('css-build', function() {
  return gulp.src(srcPath+'/stylus/*.styl')
    .pipe(sourcemaps.init())
    .pipe(stylus({ use: nib(), compress: true }))
    .pipe(rename({ basename: pkg.name  , suffix:".min"}))
    .pipe(header(banner, { pkg : pkg } ))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(distPath+'/css/'));
});

gulp.task('css', function() {
  return gulp.src(srcPath+'/stylus/*.styl')
    .pipe(stylus({use: nib(),linenos: true}))
    .pipe(rename({ basename: pkg.name}))
    .pipe(gulp.dest(distPath+'/css/'))
    .pipe(livereload());

});

//gulp.task('img', function () {
//    return gulp.src(distPath+'/img/*.*')
//        .pipe(imagemin())
//        .pipe(gulp.dest(distPath+'/img/'));
//});


gulp.task('watch', function() {
  livereload.listen();
  gulp.watch(srcPath+'/jade/*.jade', ['html']);
  gulp.watch(srcPath+'/stylus/*.styl', ['css']);
  gulp.watch(srcPath+'/coffee/*.coffee', ['js']);
});


gulp.task('server', ['js-build', 'css-build', 'html-build']);
gulp.task('build', ['js-build', 'css-build', /*'img',*/ 'html-build']);
gulp.task('build-js', ['js-build']);
gulp.task('build-css', ['css-build']);
gulp.task('build-html', ['html-build']);

gulp.task('dev', ['js', 'css', 'html']);


gulp.task('default', ['js', 'css', 'html']);
