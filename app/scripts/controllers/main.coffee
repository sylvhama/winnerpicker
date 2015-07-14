'use strict'

angular.module('winnerpickerApp').controller 'MainCtrl', ['$scope', '$location', ($scope, $location) ->

  $scope.gifNum = Math.floor((Math.random()*6)+1);

  $scope.$on "fb_authenticated", ->
    $location.path 'pages'
    $scope.$apply()
]