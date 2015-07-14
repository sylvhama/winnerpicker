(function() {
  'use strict';
  angular.module('winnerpickerApp').controller('PagesCtrl', [
    '$scope', '$location', '$cacheFactory', 'Facebook', 'usSpinnerService', function($scope, $location, $cacheFactory, Facebook, usSpinnerService) {
      var cache;
      if (Facebook.isInit()) {
        Facebook.getLoginStatus();
      }
      $scope.pages = [];
      $scope.ready = false;
      cache = $cacheFactory.get('pageSelected');
      if (typeof cache === "undefined") {
        cache = $cacheFactory('pageSelected');
      }
      $scope.$on("fb_loaded", function(event, response) {
        return Facebook.getLoginStatus();
      });
      $scope.$on("fb_statusChange", function(event, response) {
        var fbstatus;
        fbstatus = response.status;
        if (fbstatus !== 'connected') {
          $location.path('/');
          return $scope.$apply();
        } else {
          return Facebook.getPages();
        }
      });
      $scope.$on("fb_get_pages_success", function(event, response) {
        var page, _i, _len, _ref;
        _ref = response.pages.data;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          page = _ref[_i];
          $scope.pages.push({
            "name": page.name,
            "id": page.id,
            "category": page.category,
            "likes": page.likes
          });
        }
        $scope.pageSelected = $scope.pages[0];
        $scope.ready = true;
        usSpinnerService.stop('spinner-1');
        return $scope.$apply();
      });
      return $scope.next = function($event) {
        $event.preventDefault();
        if ($scope.ready && typeof $scope.pageSelected.name !== "undefined") {
          cache.put("id", $scope.pageSelected.id);
          cache.put("pageName", $scope.pageSelected.name);
          return $location.path('/posts');
        }
      };
    }
  ]);

}).call(this);

/*
//@ sourceMappingURL=pages.js.map
*/