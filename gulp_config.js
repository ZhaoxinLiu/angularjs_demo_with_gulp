'use strict';

module.exports = () => {
    const config = {
        APIproxy: {
            url: '127.0.0.1:8080/api',
            path: '/api'
        },
        workspace:__dirname,
        app: {
            dir: 'src/',//  app 目录
            mainFile: ['src/css/main.css', 'src/js/app/app.js'], //首先注入的文件 (app.js 为angualrjs 的入口文件)
            js: ['src/js/lib/**/*.js', 'src/js/app/**/*.js','src/route.js'], // 你的js文件
            css: ['src/css/**/*.css'], //你的CSS文件
            cssPath: 'src/css', //css文件路径
            fonts: ['src/fonts/**/*.*'], //字体们
            images: ['src/images/**/*.*'], //图片们
            htmls: ['src/views/**/*.html','src/template/**/*.html'], //模板跟views
            entrance: 'index.html'//app 入口文件
        },
        build: {
            spriteIMG:'src/images/icons/',
            ngTemplateBase:__dirname+'/src',
            appModuleName:'app',
            iconCSS: ['src/css/icon/**/*.css'], //包含sprite图的CSS们
            spriteCSS: 'src/css/icon/', //sprite
            outPath:'dist'
        },
        devSer: { //测试服务器设置
            port: 3000,
            hostName: 'localhost'
        }
    };
    return config;
};