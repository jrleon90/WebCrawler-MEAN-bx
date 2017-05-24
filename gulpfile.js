/**
 * Created by jrleon90 on 5/24/17.
 */
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var nodemon = require('nodemon');
var minify = require('gulp-minify');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var pump = require('pump');

var jsfiles = ['*.js','src/**/*.js'];

gulp.task('style', function(){
    return gulp.src(jsfiles)
        .pipe(jshint());
});

gulp.task('inject', function(){
    var wiredep = require('wiredep').stream;
    var inject = require('gulp-inject');

    var injectSrc = gulp.src(['./public/css/*.css','./public/js/*.js']);
    var injectOptions = {
        ignorePath:'/public'
    };

    var options = {bowerJson: require('./bower.json'),
        directory: './bower_components',
        ignorePath:'../../bower_components'

    };

    return gulp.src('./src/views/*.ejs')
        .pipe(wiredep(options))
        .pipe(inject(injectSrc,injectOptions))
        .pipe(gulp.dest('./src/views/'))
});

gulp.task('compress', function () {
    gulp.src('public/js/*.js')
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/js'))
});
gulp.task('minify-css', function() {
    return gulp.src('public/css/*.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('serve', ['style', 'compress','minify-css','inject'], function(){
    var options = {
        script: 'app.js',
        delayTime: 1,
        watch: jsfiles
    };
    return nodemon(options)
        .on('restart', function(ev){
            console.log('Restarting Server....');
        })
});