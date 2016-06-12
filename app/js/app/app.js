'use strict';
(function(window, angular, undefined) {
    var app = angular.module('app', ['ui.router']);
    app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.when("", "/home");
        $stateProvider.state("home",{
            url:'/home',
            templateUrl:"../../views/home/home.html"
        });
        // $stateProvider
        //     .state("home", {
        //         url: '/home',
        //         templateUrl: 'views/home/home.html'
        //     }).state("login", {
        //         url: '/login',
        //         templateUrl: 'views/login/login.html'
        //     }).state('qiyu', {
        //         url: '/qiyu',
        //         templateUrl: 'views/home/qiyukaoqin.html'
        //     });
    }]);
})(window, angular);