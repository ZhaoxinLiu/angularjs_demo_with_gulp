'use strict';
const gulp = require('gulp'),
    $ = require("gulp-load-plugins")(),
    config = require('../gulp_config')(),
    del = require('del'),
    processor = require('process'),
    iconv = require('iconv-lite'),
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
                console.log("正在修正node_module[css-spritesmith]".magenta)
                fs.readFile(imageSetSpriteCreatorJSPath, (err, data) => {
                    if (err) {
                        throw err;
                    }
                    let newFileContent = iconv.decode(data, 'utf8').replace('list.push(PLACE_IMAGE_BEFORE)', 'list.unshift(PLACE_IMAGE_BEFORE)');
                    fs.writeFile(imageSetSpriteCreatorJSPath, new Buffer(newFileContent), function(err) {
                        if (err) {
                            throw err;
                        }
                        console.log('完成！任务继续'.magenta);
                        done();
                    });
                });
            } else {
                done();
            }
        });
    },
    miniImg() {
        //  console.log(config.images)
        return gulp.src(config.app.images)
            .pipe($.imagemin())
            .pipe(gulp.dest('./dist/'));
    },
    sprites() {
        return gulp.src(config.app.iconCSS)
            .pipe($.cssSpriter({
                spriteSheet: './dist/images/sprite.png',
            }))
            .pipe(gulp.dest('./dist/css'));
    },
    sprites2x() {
        return gulp.src(config.app.iconCSS)
            .pipe($.concat('sprite.css'))
            .pipe(gulp.dest('app/css/icon/'))
            .pipe($.cssSpritesmith({
                imagepath: './app/images/icons/',
                spritedest: 'images/icons/',
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