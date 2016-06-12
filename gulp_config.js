'use strict';

module.exports = ()=> {
    const config = {
        APIproxy:{
            url:'127.0.0.1:8080/api',
            path:'/api'
        },
        app:{
            dir:'./app/', //  app 目录
            js:['./app/js/*.js', './app/js/lib/**/*.js', './app/js/app/**/*.js'],// 你的js文件
            css:['./app/css/**/*.css'],
            fonts:['./app/fonts/**/*.*'],
            images:['./app/images/**/*.*'],
            entrance:'index.html',//app 入口文件
            templates:['./app/template/**/*.html','./app/views/**/*.html']  //模板跟views
        },
        devSer:{      //测试服务器设置
            port:3000,
            hostName:'localhost'
        }
    };
    return config;
};