'use strict';
const gulp = require('gulp'),
    $ = require("gulp-load-plugins")(),
    config = require('../gulp_config')(),
    del = require('del');
const impl = {
    del(done) {
        del(['dist'], done());
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
            .pipe($.cssSpriter({
                spriteSheet: './dist/images/sprite2x.png',
                spritesmithOptions: {
                    retinaSrcFilter: '**/*@2x.png',
                    imgName: 'sprite.png',
                    retinaImgName: 'sprite@2x.png',
                    cssName: 'sprite.css'
                }
            }))
            .pipe(gulp.dest('./dist/css'));
    },
    useMini() {

    }
};
module.exports = impl;