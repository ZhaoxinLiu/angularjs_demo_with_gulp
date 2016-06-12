'use strict';
const gulp = require('gulp'),
    $ = require("gulp-load-plugins")(),
    url = require('url'),
    browserSync = require('browser-sync'),
    browserReload = browserSync.reload,
    proxy = require('proxy-middleware'),
    config = require('../gulp_config')(),
    processor = require('process'),
    workspacepath = processor.cwd(),
    colors = require('colors'),
    fs = require("fs");
//require('gulp-stats')(gulp);
const onlyReload = {
    png: 1,
    jpg: 1,
    bmp: 1,
    gif: 1
};
const impl = {
    inject() { // js css  文件注入  并排除sprite.css文件
        let fliter = $.filter(['**/*.*', '!**/sprite.css']);
        return gulp.src(config.app.dir + '/index.html')
            .pipe($.inject(gulp.src([].concat(config.app.js, config.app.css), {
                read: false
            }).pipe(fliter), {
                relative: true
            }))
            .pipe(gulp.dest(config.app.dir));
    },
    startDevSer(done) {
        let proxyOptions = url.parse(config.APIproxy.url);
        proxyOptions.route = '/api';
        browserSync.init({
            port: config.devSer.port,
            host: config.devSer.hostName,
            open: 'external',
            index: config.app.entrance,
            logLevel: "silent",
            server: {
                baseDir: config.app.dir + '/',
                middleware: [proxy(proxyOptions)],
                routes: {
                    "/bower_components": "bower_components"
                }
            }
        });
        done();
    },
    watch(done) { //监控文件变化
        let watcher = $.watch([].concat(config.app.js, config.app.css, config.app.templates, config.app.dir + config.app.entrance, config.app.images));
        watcher.on('add', (file) => { //添加文件
            let mat = file.match(/(\w+)\.(\w+)$/);
            if (mat) {
                fs.stat(file, (err, data) => {
                    if (err) {
                        return console.error(err);
                    }
                    if (data.size === 0 && mat[2].toLocaleLowerCase() !== 'css') {
                        console.log("Only a blank file[added]".magenta);
                    } else {
                        if (onlyReload[mat[2].toLocaleLowerCase()]) {
                            gulp.series(impl.reload)();
                        } else {
                            gulp.series(impl.inject, impl.reload)();
                        }
                    }
                });
            } else {
                return;
            }
        });
        watcher.on('unlink', (file) => {
            let mat = file.match(/(\w+)\.(\w+)$/);
            if (mat) {
                console.log((file.replace(workspacepath, 'The File:') + ' [is deleted]').magenta);
                if (onlyReload[mat[2].toLocaleLowerCase()]) {
                    gulp.series(impl.reload)();
                } else {
                    gulp.series(impl.inject, impl.reload)();
                }
            } else {
                return;
            }
        });
        watcher.on('change', (file) => {
            let mat = file.match(/(\w+)\.(\w+)$/),
                stream = false;
            if (mat) {
                if (mat[2].toLocaleLowerCase() === 'css') { //判断是不是css文件
                    stream = true;
                }
                console.log((file.replace(workspacepath, 'The File:') + ' [is changed]').magenta);
                if (stream) {
                    gulp.src(file).pipe(browserReload({
                        stream: true
                    })); //css注入
                } else {
                    gulp.series(impl.reload)(); //其他的刷新
                }
            } else {
                return;
            }
        });
        done();
    },
    reload(done) { //刷新浏览器
        browserReload();
        done();
    }
};

module.exports = impl;