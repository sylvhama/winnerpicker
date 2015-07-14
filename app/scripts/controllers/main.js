(function() {
  'use strict';
  angular.module('winnerpickerApp').controller('MainCtrl', [
    '$scope', '$location', function($scope, $location) {
      $scope.gifNum = Math.floor((Math.random() * 6) + 1);
      return $scope.$on("fb_authenticated", function() {
        $location.path('pages');
        return $scope.$apply();
      });
    }
  ]);

}).call(this);

/*
//@ sourceMappingURL=main.js.map
*/