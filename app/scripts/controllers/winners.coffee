'use strict'

angular.module('winnerpickerApp').controller 'WinnersCtrl', ['$scope', '$location', '$cacheFactory', 'winnerpickerServices', ($scope, $location, $cacheFactory, winnerpickerServices) ->

  cache = $cacheFactory.get('pageSelected')
  if typeof cache == "undefined"
    $location.path '/'
  else
    $scope.winners = cache.get('winners')
    if typeof $scope.winners  == "undefined"
      $location.path '/'
    else
      if typeof $scope.winners[0].photoSrc != "undefined"
        $scope.showPhotos = true
      else
        $scope.showPhotos = false
      $scope.ariane_pageId = cache.get('id')
      $scope.ariane_pageName = cache.get('pageName')
      post_id = cache.get('post_id')
      $scope.ariane_postId = winnerpickerServices.getId(post_id).part2

  $scope.getId = (id) ->
    return winnerpickerServices.getId(id)

  $scope.countSelected = () ->
    count = 0
    for winner in $scope.winners
      if winner.selected
        count++
    return count

  $scope.selectWinner = (id) ->
    for winner in $scope.winners
      if winner.id == id
        winner.selected = !winner.selected

  $scope.selectAll = () ->
    for winner in $scope.winners
      winner.selected = true

  $scope.deselectAll = () ->
    for winner in $scope.winners
      winner.selected = false

  $scope.getWinners = () ->
    finalWinners = []
    columns = []
    for winner in $scope.winners
      if winner.selected
        finalWinner = {}
        finalWinner.id = winner.id
        finalWinner.name = winner.name
        finalWinner.message = winner.message
        finalWinner.link = 'https://www.facebook.com/' + winner.id
        if typeof winner.comment_id != 'undefined'
          finalWinner.comment = 'https://www.facebook.com/' + $scope.ariane_pageId + '/posts/' + $scope.ariane_postId + '?comment_id=' + $scope.getId(winner.comment_id).part2
          if !$scope.showPhotos
            columns = ['User ID', 'Name', 'Profile URL', 'Message', 'Comment URL']
          else
            columns = ['User ID', 'Name', 'Profile URL', 'Message', 'Comment URL', 'Photo URL']
            finalWinner.photoSrc = winner.photoSrc
        else
          columns = ['User ID', 'Name', 'Profile URL', 'Message']
        finalWinners.push(finalWinner)
    winnerpickerServices.download(columns, finalWinners)

  $scope.dlPhotos = () ->
    i = 0

    while i < document.getElementsByClassName("post-picture").length
      clickEvent = document.createEvent("MouseEvent")
      clickEvent.initMouseEvent "click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null
      document.getElementsByClassName("post-picture")[i].dispatchEvent clickEvent
      i++
    return

  ###$scope.winners = []
  w1 = {id:'1111028852', name:'Sylvain Hamann', selected:false}
  $scope.winners.push(w1)
  w2 = {id:'520640534', name:'Blair Williams', selected:false}
  $scope.winners.push(w2)
  w3 = {id:'706990623', name:'Jenn Y. Jin', selected:false}
  $scope.winners.push(w3)
  w4 = {id:'100000122617297', name:'Yunjoo Park', selected:false}
  $scope.winners.push(w4)
  w5 = {id:'684751977', name:'Laurent', selected:false}
  $scope.winners.push(w5)
  w6 = {id:'100001188652503', name:'Hyunjung', selected:false}
  $scope.winners.push(w6)
  w7 = {id:'100001889554504', name:'Daejong', selected:false}
  $scope.winners.push(w7)
  w8 = {id:'100000747100832', name:'Seongkyung', selected:false}
  $scope.winners.push(w8)
  w9 = {id:'100001788143858', name:'Philip', selected:false}
  $scope.winners.push(w9)###
]