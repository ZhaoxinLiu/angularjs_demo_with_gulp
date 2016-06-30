'use strict';
const gulp = require('gulp'),
    $ = require("gulp-load-plugins")(),
    config = require('../gulp_config')(),
    del = require('del'),
    processor = require('process'),
    iconv = require('iconv-lite'),
    series = require('stream-series'),
    workspacepath = processor.cwd();
const impl = {
    del(done) {
        del(['dist'], done());
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
                module: config.build.appModuleName
            }))
            .pipe(gulp.dest(destSrc));
    },
    inject() {
        let fliter = $.filter(['**/*.*', '!**/icon/*.css', '!**/app.js', '!**/main.css']),
            FileStream = gulp.src([].concat(config.build.spriteCSS, config.app.js, config.app.css), {
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
    useMini() {

    }
};
module.exports = impl;