/*
 * @Author: mikey.zhaopeng 
 * @Date: 2019-02-18 08:51:56 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-02-18 10:00:39
 */

var gulp = require("gulp"); //载入gulp
var sass = require("gulp-sass"); //载入sass编译
var mincss = require("gulp-clean-css"); //载入压缩css
var uglify = require("gulp-uglify"); //载入压缩js
var babel = require("gulp-babel"); //载入编译js
var concat = require("gulp-concat"); //载入合并
var server = require("gulp-webserver"); //载入开启服务
var htmlmin = require('gulp-htmlmin');
var imagemin = require('gulp-imagemin');
var fs = require("fs");
var path = require("path");
var url = require("url");

//开发管理

//编译sass
gulp.task("comsass", function() {
    return gulp.src("./src/scss/**/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("./src/css"))
})

//编译js
gulp.task('comjs', () =>
    gulp.src('./src/script/**/*.js')
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(gulp.dest('./src/js'))
);


//合并js
gulp.task('conjs', function() {
    return gulp.src('./src/js/**/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./dist/'));
});

//监听
gulp.task("auto", gulp.watch("./src/css", gulp.series("comsass")))


//开启服务

gulp.task('webserver', function() {
    gulp.src('src')
        .pipe(server({
            livereload: true,
            directoryListing: true,
            middleware: function(req, res, next) {
                var pathname = url.parse(req.url).pathname;
                console.log(pathname)
                if (pathname === "./api/list") {
                    //判断是端口
                    res.end(JSON.stringify({ code: 1, msg: data }))
                } else {
                    //判断是文件
                    pathname = pathname === "/" ? "index.html" : pathname;
                    var upath = path.join(__dirname, "src", pathname);
                    res.end(fs.readFileSync(upath))
                }
            }
        }));
});

//上线管理


//压缩html
gulp.task('ziphtml', () => {
    return gulp.src('src/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist'));
});

//压缩css
gulp.task('zipcss', () => {
    return gulp.src('./src/css/**/*.css')
        .pipe(mincss())
        .pipe(gulp.dest('dist/css'));
});


//压缩js
gulp.task('zipjs', () => {
    return gulp.src('./src/js/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

//压缩img
gulp.task('default', () =>
    gulp.src('src/image/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'))
);

//
gulp.task("build", gulp.parallel("ziphtml", "zipcss", "zipjs", "default"))