'use strict';

const gulp = require('gulp'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    ts = require('gulp-typescript'),
    less = require('gulp-less'),
    autoprefixer = require('autoprefixer'),
    postcss = require('gulp-postcss'),
    cssnano = require('cssnano'),
    browserSync = require('browser-sync').create(),
    concat = require('gulp-concat'),
    merge2 = require('merge2'),
    jsString = require('gulp-js-string');

const tsProject = ts.createProject('tsconfig.json');


gulp.task('default', ['serve']);
gulp.task('build', ['js', 'css']);


gulp.task('serve', ['build'], function (callback) {
    browserSync.init({
        server: ['demo', 'dist'],
        ui: false
    });

    gulp.watch(["lib/**/*.ts", "lib/**/*.html", "lib/**/*.svg"], ['js']);
    gulp.watch(["lib/**/*.less"], ['css']);

    gulp.watch(["demo/**/*.html", "dist/**/*.js", "dist/**/*.css"])
        .on('change', browserSync.reload);
});


gulp.task('css', function (callback) {
    return gulp.src('lib/*.less')
        .pipe(less())
        .pipe(postcss([autoprefixer({
            browsers: [
                'ie >= 10',
                'ie_mob >= 10',
                'ff >= 30',
                'chrome >= 34',
                'safari >= 7',
                'opera >= 23',
                'ios >= 7',
                'android >= 4.4',
                'bb >= 10'
            ]
        })]))
        .pipe(gulp.dest('dist'))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(postcss([cssnano({
            discardComments: { removeAll: true }
        })]))
        .pipe(gulp.dest('dist'));
});


gulp.task('js', function (callback) {
    const str = (src, scope) => {
        return gulp
            .src(src)
            .pipe(jsString((str, file, ...args) => [
                `window.${scope} = window.${scope} || {};`,
                `window.${scope}['${file.basename}'] = '${str}';`
            ].join('\n')))
            .pipe(concat(scope));
    }

    return merge2()
        .add( str(['lib/*.html'], 'TEMPLATES') )
        .add( str(['lib/icons/*.svg'], 'ICONS') )
        .add( gulp.src('lib/*.ts').pipe(tsProject()) )

        .pipe(concat('material-steppers.js'))
        .pipe(gulp.dest('dist/'))
        .pipe(rename({ extname: '.min.js' }))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});
