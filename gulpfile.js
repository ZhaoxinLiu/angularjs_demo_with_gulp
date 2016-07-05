'use strict';
const gulp = require('gulp'),
    dev = require('./tasks/dev'),
    build = require('./tasks/build'),
    colors = require('colors'),
    packageInfo = require('./package.json');
const dateformat = (d, fmt) => {
    var o = {
        "M+": d.getMonth() + 1, //月份   
        "d+": d.getDate(), //日   
        "h+": d.getHours(), //小时   
        "m+": d.getMinutes(), //分   
        "s+": d.getSeconds(), //秒   
        "q+": Math.floor((d.getMonth() + 3) / 3), //季度   
        "S": d.getMilliseconds() //毫秒   
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};

console.log(`
==============================
开始时间:%s
项目名称:%s
作者:%s
工作目录:%s
==============================
`.blue, dateformat(new Date(), 'yyyy-MM-dd hh:mm:ss'), packageInfo.name, packageInfo.author, __dirname);
gulp.task('default', gulp.series(dev.inject, dev.watch, dev.startDevSer));
gulp.task("build", gulp.series(build.fixBUG,build.del, gulp.parallel(build.sprites, build.ngTemplate), gulp.parallel(build.useMini, build.miniImg), build.startBuildSer));