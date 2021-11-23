var gulp = require('gulp'),
    less = require('gulp-less'),
    // 确保本地已安装gulp-minify-css [cnpm install gulp-minify-css --save-dev]
    cssmin = require('gulp-minify-css'),
    zip = require('gulp-zip'),
    clean = require('gulp-clean'),
    del = require('del');

gulp.task('less', function (){
    gulp.src('./src/less/main.less')
        .pipe(less())
        .pipe(cssmin()) // 兼容IE7及以下需设置compatibility属性 .pipe(cssmin({compatibility: 'ie7'}))
        .pipe(gulp.dest('./src/build/css'));
});

gulp.task('watch', function (){
    gulp.watch(['src/less/*.less', 'src/less/modal/*.less',
        'src/less/core/*.less',
        'src/less/views/*.less',
        'src/less/views/*/*.less'], ['less']); // 当所有less文件发生改变时，调用testLess任务
});

gulp.task('clean:map', function (cb){
    del([
        'src/build/js/*.map'
    ], cb);

});

gulp.task('zip', () => {
    return gulp.src('src/build/**')
        .pipe(zip('webapp.zip'))
        .pipe(gulp.dest('src/zip'));
});

gulp.task('clean', function (){
    return gulp.src('src/zip/*', {read: false})
        .pipe(clean());
});
