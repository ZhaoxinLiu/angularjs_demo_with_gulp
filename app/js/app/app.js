'use strict';
(function(window, angular, undefined) {
    var app = angular.module('app', ['ui.router']);
    app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
       // $urlRouterProvider.otherwise('/404');
        $urlRouterProvider.when("", "/home");
        $stateProvider.state('home', {
                url: '/home',
                templateUrl: '../../views/home/home.html'
            })
            .state('/404', {
                url:'/404',
                templateUrl:'../../views/404page.html'
            })
            .state('/403',{
                url:'/403',
                templateUrl:'../../views/403page.html'
            });
    }]);
})(window, angular);