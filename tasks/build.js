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
        del(['dist', 'tmp'], done());
    },
    fixBUG(done) {
        let pkginfo = require(config.workspace + '/node_modules/css-spritesmith/package.json');
        if (pkginfo.version === '0.0.4') {
            const imageSetSpriteCreatorJSPath = config.workspace + '/node_modules/css-spritesmith/lib/imageSetSpriteCreator.js';
            var fs = require('fs');
            fs.exists(imageSetSpriteCreatorJSPath, (exists) => {
                if (exists) {
                    fs.readFile(imageSetSpriteCreatorJSPath, (err, data) => {
                        if (err) {
                            throw err;
                        }
                        let newFileContent = iconv.decode(data, 'utf8').replace(/\.([^\d]{1,4})\(PLACE_IMAGE/g, '.unshift(PLACE_IMAGE');
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
        }
    },

    ngTemplate() {
        var destSrc = 'tmp/templatecache/';
        return gulp.src(config.app.htmls)
            .pipe($.minifyHtml())
            .pipe($.angularTemplatecache({
                module: config.build.appModuleName,
                base: config.build.ngTemplateBase
            }))
            .pipe(gulp.dest(destSrc));
    },
    useMini() {
        let fliter = $.filter(['**/*.*', '!**/icon/*.css', '!**/app.js', '!**/main.css']),
            FileStream = gulp.src([].concat(config.build.spriteCSS, config.app.js, config.app.css, ['tmp/templatecache/templates.js']), {
                read: false
            }).pipe(fliter),
            MainFileStream = gulp.src([].concat(config.app.mainFile, [config.build.spriteCSS + 'sprite.css']));
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
                js2: [$.jslint(), $.sourcemaps.init(), $.ngAnnotate(), $.uglify({
                    compress: {
                        'drop_console': true
                    }
                }), $.rev(), $.sourcemaps.write('./')]
            }))
            .pipe(gulp.dest(config.build.outPath))
            .pipe($.rev.manifest())
            .pipe(gulp.dest('tmp/manifest'));
    },
    miniImg() {
        let fliter = $.filter(['**/*.*', '!**/icons/**/*.*']);
        return gulp.src([].concat(config.app.images, ['./tmp/sprite/*.png']))
            .pipe(fliter)
            .pipe($.imagemin())
            .pipe(gulp.dest('./dist/images'));
    },
    sprites() {
        let fliter = $.filter(['**/*.*', '!**/sprite.css']);
        return gulp.src(config.build.iconCSS)
            .pipe(fliter)
            .pipe($.concat('sprite.css'))
            .pipe(gulp.dest(config.build.spriteCSS))
            .pipe($.cssSpritesmith({
                imagepath: config.build.spriteIMG,
                spritedest: './tmp/sprite',
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
                baseDir: config.build.outPath + '/',
                middleware: [proxy(proxyOptions)]
            }
        });
        done();
    }
};
module.exports = impl;