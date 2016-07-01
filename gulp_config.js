'use strict';
let processor = require('process'),
workspacepath = processor.cwd();

module.exports = () => {
    const config = {
        APIproxy: {
            url: '127.0.0.1:8080/api',
            path: '/api'
        },
        app: {
            dir: 'app/',//  app 目录
            mainFile: ['app/css/main.css', 'app/js/app/app.js'], //首先注入的文件
            js: ['app/js/lib/**/*.js', 'app/js/app/**/*.js'], // 你的js文件
            css: ['app/css/**/*.css'], //你的CSS文件
            cssPath: 'app/css', //css文件路径
            fonts: ['app/fonts/**/*.*'], //字体们
            images: ['app/images/**/*.*'], //图片们
            templates: ['app/template/**/*.html', 'app/views/**/*.html'], //模板跟views
            entrance: 'index.html'//app 入口文件

        },
        build: {
            dir: 'dist',
            spriteIMG:'app/images/icons/',
            appModuleName:'app',
            ngTemplateBaseDir:workspacepath+'/app/',
            iconCSS: ['app/css/icon/**/*.css'], //包含sprite图的CSS们
            spriteCSS: 'app/css/sprite/sprite.css', //sprite
            outPath:'dist'
        },
        devSer: { //测试服务器设置
            port: 3000,
            hostName: 'localhost'
        }
    };
    return config;
};