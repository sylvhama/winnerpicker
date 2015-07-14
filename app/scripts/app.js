(function() {
  'use strict';
  var app;

  app = angular.module('winnerpickerApp', ['ngCookies', 'ngResource', 'ngSanitize', 'ngRoute', 'angularSpinner', 'FacebookProvider']);

  app.config([
    '$routeProvider', 'FacebookConfigProvider', function($routeProvider, FacebookConfigProvider) {
      $routeProvider.when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      }).when('/pages', {
        templateUrl: 'views/pages.html',
        controller: 'PagesCtrl'
      }).when('/posts', {
        templateUrl: 'views/posts.html',
        controller: 'PostsCtrl'
      }).when('/filters', {
        templateUrl: 'views/filters.html',
        controller: 'FiltersCtrl'
      }).when('/winners', {
        templateUrl: 'views/winners.html',
        controller: 'WinnersCtrl'
      }).otherwise({
        redirectTo: '/'
      });
      FacebookConfigProvider.setAppId('1486818408200757');
      return FacebookConfigProvider.setLocale('en_US');
    }
  ]);

}).call(this);

/*
//@ sourceMappingURL=app.js.map
*/