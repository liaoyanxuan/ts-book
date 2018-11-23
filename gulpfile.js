'use strict';

var browserify  = require('browserify'),
    gulp        = require('gulp'),
    run         = require('gulp-run'),
    transform   = require('vinyl-transform'),
    uglify      = require('gulp-uglify'),
    sourcemaps  = require('gulp-sourcemaps'),
    ts          = require('gulp-typescript'),
    tslint      = require('gulp-tslint'),
	runSequence = require('run-sequence');
	

 
//语法和规范性检查 
gulp.task('ts-lint',function(){
	return gulp.src([
		'./source/ts/**/**.ts','./test/**/**.test.ts'
	]).pipe(tslint({
		formatter: "verbose"
	}))
	  .pipe(tslint.report());
});


var ts=require('gulp-typescript');
var tsProject=ts.createProject({
	removeComments:true,
	noImplicitAny:true,
	target:'ES3',
	module:'commonjs',
	declarationFiles:false
});

//编译source成js
gulp.task('tsc',function(){
	return gulp.src('./source/ts/**/**.ts')
			   .pipe(tsProject())
			   .js.pipe(gulp.dest('./temp/source/js'));
});

//编译test成js
gulp.task('tsc-tests',function(){
	return gulp.src('./test/**/**.test.ts')
			   .pipe(tsProject())
			   .js.pipe(gulp.dest('./temp/test/'));
});

//打包（把所有js和其依赖打包到一个文件）
gulp.task('bundle-js', function () {
  // transform regular node stream to gulp (buffered vinyl) stream
  var browserified = transform(function(filename) {
    var b = browserify({ entries: filename, debug: true });
    return b.bundle();
  });

  return gulp.src('./temp/source/js/main.js')
             .pipe(browserified)
             .pipe(sourcemaps.init({ loadMaps: true }))
             .pipe(uglify())
             .pipe(sourcemaps.write('./'))
             .pipe(gulp.dest('./dist/source/js/'));
});


gulp.task('bundle-test', function () {
  // transform regular node stream to gulp (buffered vinyl) stream
  var browserified = transform(function(filename) {
    var b = browserify({ entries: filename, debug: true });
    return b.bundle();
  });

  return gulp.src('./temp/test/**/**.test.js')
             .pipe(browserified)
             .pipe(gulp.dest('./dist/test/'));
});


gulp.task('test', function(cb) {
  runSequence('ts-lint',            //检查
			  ['tsc', 'tsc-tests'],  //编译
              ['bundle-js', 'bundle-test'],   //打包
			  cb);
});



gulp.task('default', ['test']);