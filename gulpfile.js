//Gulpfile
var gulp = require('gulp');
var sass = require('gulp-sass');
var jshint = require('gulp-jshint');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var minify = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');


//The serve tasks. Only compile CSS and autoreload.
gulp.task('sass', function() {
	//console.log('Building CSS...');
	return gulp.src('client/scss/**/*.scss')
	.pipe(sass())
	.pipe(gulp.dest('client/css'))
	.pipe(browserSync.stream());
});

gulp.task('jshint', function() {
	return gulp.src('client/js/**/*.js')
	.pipe(jshint())
	.pipe(jshint.reporter('jshint-stylish'))
	.pipe(browserSync.stream());	
});

gulp.task('browserSync', function() {
	browserSync.init({
		proxy: {
			target: 'localhost:3000',
		}, 
		port: '2000'
	});
});

gulp.task('watch', function() {
	gulp.watch('client/scss/**/*.scss', ['sass']);
	gulp.watch('client/js/**/*.js', ['jshint']);

});

gulp.task('html', function() {
	browserSync.reload();
});

gulp.task('serve', ['browserSync', 'sass'], function() {
	nodemon({
		script: 'server/app.js',
		env: {'NODE_ENV': 'development'}
	}).on('restart', function() {
		setTimeout(function reload() {
			browserSync.reload({
				stream: false
			});
		}, 500);
	});
	gulp.watch('client/scss/**/*.scss', ['sass']);
	gulp.watch('client/js/**/*.js', ['jshint']);
	gulp.watch('client/**/*.html', ['html']);
});


//Build tasks now!
//Concat the CSS and JS files into different files and put them and the HTML files into dist
gulp.task('useref', ['sass'], function() {
	var assets = useref.assets();
	return gulp.src('client/**/*.html')
	.pipe(assets)
	.pipe(gulpIf('*.js', uglify()))
	.pipe(gulpIf('*.css', minify()))
	.pipe(assets.restore())
	.pipe(useref())
	.pipe(gulp.dest('dist'));
});


gulp.task('imagemin', function() {
	return gulp.src('client/images/**/*.+(gif|png|jpeg|jpg|svg)')
	.pipe(cache(imagemin({interlaced: true})))
	.pipe(gulp.dest('dist/images'));
});

gulp.task('clean', function(callbacl) {
	del('dist');
	cache.clearAll(callback);
});

gulp.task('clean:dist', function(callback) {
	del(['dist/**/*', '!dist/images/**/*', 'dist/css/**/*', 'dist/js/**/*'], callback);
});

gulp.task('build', function() {
	runSequence('clean','build-css','useref', 'imagemin');
});
