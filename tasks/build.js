'use strict';
const gulp = require('gulp'),
    $ = require("gulp-load-plugins")(),
    config = require('../gulp_config')(),
    url = require('url'),
    browserSync = require('browser-sync'),
    proxy = require('proxy-middleware'),
    del = require('del'),
    processor = require('process'),
    iconv = require('iconv-lite'),
    series = require('stream-series'),
    workspacepath = processor.cwd();
const impl = {
    del(done) {
        del(['dist', '.tmp'], done());
    },
    fixBUG(done) {
        const imageSetSpriteCreatorJSPath = workspacepath + '/node_modules/css-spritesmith/lib/imageSetSpriteCreator.js';
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
        var destSrc = '.tmp/templatecache/';
        return gulp.src(config.app.templates)
            .pipe($.minifyHtml())
            .pipe($.angularTemplatecache({
                module: config.build.appModuleName,
                base: config.build.ngTemplateBaseDir
            }))
            .pipe(gulp.dest(destSrc));
    },
    useMini(done) {
        let fliter = $.filter(['**/*.*', '!**/icon/*.css', '!**/app.js', '!**/main.css']),
            FileStream = gulp.src([].concat(config.build.spriteCSS, config.app.js, config.app.css, ['tmp/templatecache/templates.js']), {
                read: false
            }).pipe(fliter),
            MainFileStream = gulp.src(config.app.mainFile);
        return gulp.src('app/index.html')
            .pipe($.inject(series(MainFileStream, FileStream), {
                relative: true
            })).pipe($.usemin({
                assetsDir: 'app',
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
            .pipe(gulp.dest('.tmp/manifest'));
    },
    // revReplace() {
    //     let manifest = gulp.src(config.tmpForder + "/manifest/rev-manifest.json");
    //     return gulp.src(config.buildOutPath + config.revReplaceEntrance)
    //         .pipe($.revReplace({
    //             manifest: manifest
    //         }))
    //         .pipe(gulp.dest(config.buildOutPath))
    // },
    // inject() {
    //     let fliter = $.filter(['**/*.*', '!**/icon/*.css', '!**/app.js', '!**/main.css']),
    //         FileStream = gulp.src([].concat(config.build.spriteCSS, config.app.js, config.app.css, ['tmp/templatecache/templates.js']), {
    //             read: false
    //         }).pipe(fliter),
    //         MainFileStream = gulp.src(config.app.mainFile);
    //     return gulp.src(config.app.dir + '/index.html')
    //         .pipe($.inject(series(MainFileStream, FileStream), {
    //             relative: true
    //         }))
    //         .pipe(gulp.dest(config.app.dir));
    // },
    miniImg() {
        //  console.log(config.images)
        return gulp.src(config.app.images)
            .pipe($.imagemin())
            .pipe(gulp.dest('./dist/'));
    },
    sprites() {
        let fliter = $.filter(['**/*.*', '!**/sprite.css']);
        return gulp.src(config.build.iconCSS)
            .pipe(fliter)
            .pipe($.concat('sprite.css'))
            .pipe(gulp.dest('app/css/icon/'))
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