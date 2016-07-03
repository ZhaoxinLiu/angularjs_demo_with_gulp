'use strict';
const gulp = require('gulp'),
    $ = require("gulp-load-plugins")(),
    config = require('../gulp_config')(),
    url = require('url'),
    browserSync = require('browser-sync'),
    proxy = require('proxy-middleware'),
    del = require('del'),
    iconv = require('iconv-lite'),
    series = require('stream-series');
const impl = {
    del(done) {
        del(['dist', '.tmp'], done());
    },
    fixBUG(done) {
        const imageSetSpriteCreatorJSPath = __dirname + '/node_modules/css-spritesmith/lib/imageSetSpriteCreator.js';
        var fs = require('fs');
        fs.exists(imageSetSpriteCreatorJSPath, (exists) => {
            if (exists) {
                fs.readFile(imageSetSpriteCreatorJSPath, (err, data) => {
                    if (err) {
                        throw err;
                    }
                    let newFileContent = iconv.decode(data, 'utf8').replace('list.push(PLACE_IMAGE_BEFORE)', 'list.unshift(PLACE_IMAGE_BEFORE)');
                    fs.writeFile(imageSetSpriteCreatorJSPath, new Buffer(newFileContent), function(err) {
                        if (err) {
                            throw err;
                        }
                        done();
                    });
                });
            } else {
                done();
            }
        });
    },
    ngTemplate() {
        var destSrc = 'tmp/templatecache/';
        return gulp.src(config.app.templates)
            .pipe($.minifyHtml())
            .pipe($.angularTemplatecache({
                module: config.build.appModuleName
            }))
            .pipe(gulp.dest(destSrc));
    },
    useMini() {
        let fliter = $.filter(['**/*.*', '!**/icon/*.css', '!**/app.js', '!**/main.css']),
            FileStream = gulp.src([].concat(config.build.spriteCSS, config.app.js, config.app.css, ['tmp/templatecache/templates.js']), {
                read: false
            }).pipe(fliter),
            MainFileStream = gulp.src(config.app.mainFile);
        return gulp.src('src/index.html')
            .pipe($.inject(series(MainFileStream, FileStream), {
                relative: true
            })).pipe($.usemin({
                assetsDir: 'src',
                css1: [$.autoprefixer({
                    browsers: ['last 2 versions'],
                    cascade: false
                }), $.minifyCss(), $.rev()],
                css2: [$.autoprefixer({
                    browsers: ['last 2 versions'],
                    cascade: false
                }), $.minifyCss(), $.rev()],
                js1: [$.jslint(), $.ngAnnotate(), $.uglify(), $.rev()],
                js2: [$.jslint(), $.ngAnnotate(), $.uglify(), $.rev()]
            }))
            .pipe(gulp.dest(config.build.outPath))
            .pipe($.rev.manifest())
            .pipe(gulp.dest('tmp/manifest'));
    },
    inject() {
        let fliter = $.filter(['**/*.*', '!**/icon/*.css', '!**/app.js', '!**/main.css']),
            FileStream = gulp.src([].concat(config.build.spriteCSS, config.app.js, config.app.css, ['tmp/templatecache/templates.js']), {
                read: false
            }).pipe(fliter),
            MainFileStream = gulp.src(config.app.mainFile);
        return gulp.src(config.app.dir + '/index.html')
            .pipe($.inject(series(MainFileStream, FileStream), {
                relative: true
            }))
            .pipe(gulp.dest(config.app.dir));
    },
    miniImg() {
        return gulp.src([config.build.spriteIMG+'sprite.png',config.build.spriteIMG+'sprite@2x.png'])
            .pipe($.imagemin())
            .pipe(gulp.dest('./dist/images'));
    },
    sprites() {
        let fliter = $.filter(['**/*.*', '!**/sprite.css']);
        return gulp.src(config.build.iconCSS)
            .pipe(fliter)
            .pipe($.concat('sprite.css'))
            .pipe(gulp.dest('src/css/icon/'))
            .pipe($.cssSpritesmith({
                imagepath: config.build.spriteIMG,
                spritedest: config.build.spriteIMG,
                spritepath: '../../images/',
                useimageset: true,
                newsprite: false,
                spritestamp: false,
                cssstamp: false
            })).pipe(gulp.dest('./'));
    },
    startBuildSer(done) {
        let proxyOptions = url.parse(config.APIproxy.url);
        proxyOptions.route = '/api';
        browserSync.init({
            port: config.devSer.port,
            host: config.devSer.hostName,
            open: 'external',
            index: config.app.entrance,
            logLevel: "silent",
            server: {
                baseDir: config.build.dir + '/',
                middleware: [proxy(proxyOptions)]
            }
        });
        done();
    }
};
module.exports = impl;