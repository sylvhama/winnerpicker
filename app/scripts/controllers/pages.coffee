'use strict'

angular.module('winnerpickerApp').controller 'PagesCtrl', ['$scope', '$location', '$cacheFactory', 'Facebook', 'usSpinnerService', ($scope, $location, $cacheFactory, Facebook, usSpinnerService) ->

  if Facebook.isInit()
    Facebook.getLoginStatus()

  $scope.pages = []
  $scope.ready = false
  cache = $cacheFactory.get('pageSelected')
  if typeof cache == "undefined"
    cache = $cacheFactory('pageSelected')

  $scope.$on "fb_loaded", (event,response) ->
    Facebook.getLoginStatus()

  $scope.$on "fb_statusChange", (event,response) ->
    fbstatus = response.status
    if fbstatus != 'connected'
      $location.path '/'
      $scope.$apply()
    else
      Facebook.getPages()

  $scope.$on "fb_get_pages_success", (event,response) ->
    for page in response.pages.data
      $scope.pages.push({"name":page.name, "id":page.id, "category":page.category, "likes":page.likes})
    $scope.pageSelected = $scope.pages[0]
    $scope.ready = true
    usSpinnerService.stop('spinner-1')
    $scope.$apply()

  $scope.next = ($event) ->
    $event.preventDefault()
    if $scope.ready and typeof $scope.pageSelected.name != "undefined"
      cache.put("id", $scope.pageSelected.id)
      cache.put("pageName", $scope.pageSelected.name)
      $location.path '/posts'
]