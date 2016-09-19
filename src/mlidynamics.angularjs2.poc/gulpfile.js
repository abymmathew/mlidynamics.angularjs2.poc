"use strict";

var gulp = require("gulp");
var concat = require("gulp-concat");
var cssmin = require("gulp-cssmin");
var uglify = require("gulp-uglify");
var clean = require('gulp-clean');
var del = require('del');
var ts = require('gulp-typescript');
var config = require('./gulp.config.json');

var paths = config.paths;

// -- Clean js and css files
gulp.task("clean:js", function (cb) {
    del(paths.concatJsDest, cb);
});

gulp.task("clean:css", function (cb) {
    del(paths.concatCssDest, cb);
});

gulp.task("clean", ["clean:js", "clean:css"]);
// -- end 

// -- Min js and css files
gulp.task("min:js", function () {
    return gulp.src([paths.js, "!" + paths.minJs], { base: "." })
        .pipe(concat(paths.concatJsDest))
        .pipe(uglify())
        .pipe(gulp.dest("."));
});

gulp.task("min:css", function () {
    return gulp.src([paths.css, "!" + paths.minCss])
        .pipe(concat(paths.concatCssDest))
        .pipe(cssmin())
        .pipe(gulp.dest("."));
});

gulp.task("min", ["min:js", "min:css"]);
// -- end

// -- copy node dependent modules
gulp.task("copy-node-modules", () => {
    gulp.src(config.sources.node_modules_js,
        {
            cwd: "node_modules/**"
        })
        .pipe(gulp.dest(config.folders.ts2js));

    gulp.src(config.sources.node_modules_css,
        {
            cwd: "node_modules/**"
        })
        .pipe(gulp.dest(config.folders.ts2js + 'css'));
});
// -- end

// -- transpile typescript files
var tsProject = ts.createProject('tsconfig.json');
gulp.task('ts', function () {
    var tsResult = gulp.src([
            "app-ts/*.ts", 'typings/index.d.ts'
    ])
        .pipe(ts(tsProject), undefined, ts.reporter.fullReporter());

    gulp.src('css/*.css',
        {
            cwd: "app-ts/**"
        })
        .pipe(gulp.dest(config.folders.root));

    gulp.src('templates/*.html',
        {
            cwd: "app-ts/**"
        })
        .pipe(gulp.dest(config.folders.root));

    return tsResult.js.pipe(gulp.dest(config.folders.root + '/app'));
});
// -- end

// -- watch for changes on typescript files
gulp.task('watch', ['watch.ts']);

gulp.task('watch.ts', ['ts'], function () {
    return gulp.watch('app/*.ts', ['ts']);
});
// -- end

gulp.task('default', ['copy-node-modules', 'watch']);