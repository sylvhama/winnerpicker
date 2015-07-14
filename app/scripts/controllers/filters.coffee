'use strict'

angular.module('winnerpickerApp').controller 'FiltersCtrl', ['$scope', '$location', '$cacheFactory', 'Facebook', 'usSpinnerService', 'winnerpickerServices', ($scope, $location, $cacheFactory, Facebook, usSpinnerService, winnerpickerServices) ->
  if Facebook.isInit()
    Facebook.getLoginStatus()

  ready = false
  $scope.errorMsg = ''
  cache = ''
  id = ''
  post_id = ''
  rawLikes = []
  rawComments = []
  likers = []
  commenters = []

  init = () ->
    likers = []
    commenters = []
    cache = $cacheFactory.get('pageSelected')
    if typeof cache == "undefined"
      $location.path '/'
      $scope.$apply()
    else
      id = cache.get('id')
      post_id = cache.get('post_id')
      if typeof id  == "undefined" or typeof post_id  == "undefined"
        $location.path '/'
        $scope.$apply()
      else
        $scope.ariane_pageId = id
        $scope.ariane_pageName = cache.get('pageName')
        $scope.ariane_postId = winnerpickerServices.getId(post_id).part2
        $scope.action = 'l'
        $scope.word = ''
        $scope.wordType = 'type1'
        $scope.multiCom = 'type1'
        $scope.checkTags = false
        $scope.checkLink = false
        $scope.checkPhoto = false
        $scope.nbwin = 10
        $scope.winType = 'type1'
        $scope.from = ''
        $scope.to = ''
        Facebook.getPostLikes(post_id)

  compareLikeCount = (a, b) ->
    if a.comment.like_count < b.comment.like_count
      return 1
    if a.comment.like_count > b.comment.like_count
      return -1
    return compareDate(a, b)

  compareDate = (a, b) ->
    if a.comment.date < b.comment.date
      return -1
    if a.comment.date > b.comment.date
      return 1
    return 0

  alreadyCommented = (id) ->
    already = false
    i = 0
    for commenter in commenters
      if commenter.id == id
        already = true
        commenter.alreadyCommented = true
      i++
    return already

  createList = () ->
    tempLikes = rawLikes.slice()
    for comment in rawComments
      commenter = {}
      hasLiked = false
      for like in tempLikes
        if like.id == comment.from.id
          hasLiked = true
          index = tempLikes.indexOf(like)
          tempLikes.splice(index,1)
          break
      commenter.id = comment.from.id
      commenter.name = comment.from.name
      commenter.hasLiked = hasLiked
      commenter.comment = {}
      commenter.comment.id = comment.id
      commenter.comment.like_count = comment.like_count
      commenter.comment.message = comment.message
      commenter.comment.date = comment.created_time
      if comment.message_tags
        commenter.comment.withTags = true
      else
        commenter.comment.withTags = false
      if comment.attachment
        if comment.attachment.type == 'photo'
          commenter.comment.photo = true
          commenter.comment.src = comment.attachment.media.image.src
          commenter.comment.link = false
        else
          commenter.comment.photo = false
          commenter.comment.link = true
      else
        commenter.comment.photo = false
        commenter.comment.link = false
      if alreadyCommented(comment.from.id)
        commenter.alreadyCommented = true
      else
        commenter.alreadyCommented = false
      commenters.push(commenter)
    likers = tempLikes
    ready = true
    $scope.showDl = true
    usSpinnerService.stop('spinner-1')
    $scope.$apply()

  $scope.pickWinners = () ->
    $scope.checkForm = true
    $scope.errorMsg = ''
    winners = []
    finalList = []
    if $scope.filterForm.$valid and $scope.nbwin > 0 and ready
      tempList = []
      tempList2 = commenters.slice()
      i = 0
      if $scope.action == 'l'
        finalList = likers.slice()
      else
        for commenter in tempList2
          splice = false
          if $scope.action == 'cl' and !commenter.hasLiked
              splice = true
          if $scope.word.length > 0
            lowerMsg = commenter.comment.message.toLowerCase()
            if $scope.wordType == 'type1'
              words = $scope.word.match(/\S+/g)
              for word in words
                if lowerMsg.indexOf(word.toLowerCase()) == -1
                  splice = true
            else if $scope.wordType == 'type2'
              words = $scope.word.match(/\S+/g)
              for word in words
                if lowerMsg.indexOf(word.toLowerCase()) == -1
                  splice = true
                else
                  splice = false
                  break
            else if $scope.wordType == 'type3'
              if lowerMsg.indexOf($scope.word.toLowerCase()) == -1
                splice = true
          if $scope.from <= $scope.to and $scope.to != '' and $scope.from != ''
            if commenter.comment.date.substring(0,10) < $scope.from or commenter.comment.date.substring(0,10) > $scope.to
              splice = true
          if $scope.checkTags and !commenter.comment.withTags
            splice = true
          if $scope.checkLink and !commenter.comment.link
            splice = true
          if $scope.checkPhoto and !commenter.comment.photo
            splice = true
          if !splice
            tempList.push(commenters[i])
          i++

        tempList2 = tempList
        i = 0
        for commenter in tempList2
          splice = false
          if commenter.alreadyCommented and $scope.multiCom != 'type3'
            j = 0
            for commenter2 in tempList2
              if commenter.id == commenter2.id and commenter.comment.id != commenter2.comment.id
                if $scope.multiCom == 'type1'
                  if commenter.comment.like_count < commenter2.comment.like_count
                    splice = true
                  else if commenter.comment.like_count == commenter2.comment.like_count and commenter.comment.date > commenter2.comment.date
                    splice = true
                else if $scope.multiCom == 'type2'
                  if commenter.comment.date > commenter2.comment.date
                    splice = true
                  else if commenter.comment.date == commenter2.comment.date and commenter.comment.like_count < commenter2.like_count
                    splice = true
              j++
          if !splice
            finalList.push(tempList2[i])
          i++
      if $scope.nbwin <= finalList.length
        if $scope.winType == 'type1'
          count = 0
          while count < $scope.nbwin
            r = Math.floor(Math.random() * finalList.length)
            winners.push(finalList[r])
            finalList.splice(r,1)
            count++
        else if $scope.winType == 'type2'
          if $scope.topLike <= finalList.length
            if $scope.nbwin <= $scope.topLike
              finalList.sort(compareLikeCount)
              finalList.splice($scope.topLike, finalList.length-$scope.topLike)
              count = 0
              while count < $scope.nbwin
                r = Math.floor(Math.random() * finalList.length)
                winners.push(finalList[r])
                finalList.splice(r,1)
                count++
              winners.sort(compareLikeCount)
            else
              $scope.errorMsg = 'Error, you can not ask ' + $scope.nbwin + ' winners from ' + $scope.topLike + ' most liked comments.'
          else
            $scope.errorMsg = 'Error, too many most liked comments asked. The maximum with these filters is: ' + finalList.length
        else if $scope.winType == 'type3'
          finalList.sort(compareLikeCount)
          count = 0
          while count < $scope.nbwin
            winners.push(finalList[count])
            count++
          winners.sort(compareLikeCount)
      else
        $scope.errorMsg = 'Error, too many winners asked. The maximum with these filters is: ' + finalList.length
      if $scope.errorMsg.length == 0
        if $scope.action == 'l'
          for winner in winners
            winner.selected = false
          cache.put('winners', winners)
          $location.path 'winners'
        else
          cleanedWinners = []
          for winner in winners
            cleanedWinner = {}
            cleanedWinner.id = winner.id
            cleanedWinner.message = winner.comment.message
            cleanedWinner.comment_id = winner.comment.id
            cleanedWinner.name = winner.name
            if typeof winner.comment.src != "undefined" and $scope.checkPhoto
              cleanedWinner.photoSrc = winner.comment.src
            cleanedWinner.selected = false
            cleanedWinners.push(cleanedWinner)
          cache.put('winners', cleanedWinners)
          $location.path 'winners'

  $scope.dlRawLikes = () ->
    columns = ['User ID', 'Name', 'Profile URL']
    tempLikes = rawLikes.slice()
    for like in tempLikes
      like.link = 'https://www.facebook.com/' + like.id
    winnerpickerServices.download(columns, rawLikes)

  $scope.dlRawComments = () ->
    columns = ['User ID', 'Name', 'Profile URL', 'Message', 'Comment URL','Likes', 'Date']
    tempComments = rawComments.slice()
    for comment in tempComments
      comment.comment_id = comment.id
      comment.id = comment.from.id
      comment.name = comment.from.name
      comment.link = 'https://www.facebook.com/' + comment.id
      comment.comment = 'https://www.facebook.com/' + $scope.ariane_pageId + '/posts/' + $scope.ariane_postId + '?comment_id=' + winnerpickerServices.getId(comment.comment_id).part2
    winnerpickerServices.download(columns, rawComments)

  $scope.$on "fb_loaded", (event,response) ->
    Facebook.getLoginStatus()

  $scope.$on "fb_statusChange", (event,response) ->
    fbstatus = response.status
    if fbstatus != 'connected'
      $location.path '/'
      $scope.$apply()
    else
      init()

  $scope.$on "fb_get_postlikes_success", (event,response) ->
    rawLikes = response.likes.data
    Facebook.getPostComments(post_id)

  $scope.$on "fb_get_postcomments_success", (event,response) ->
    rawComments = response.comments.data
    if rawLikes != ''
      createList()

  $scope.$on "fb_get_postlikes_failed", (event,response) ->
    $scope.errorMsg = 'Error, please reload the page.'
    console.log response
    $scope.$apply()

  $scope.$on "fb_get_postcomments_failed", (event,response) ->
    $scope.errorMsg = 'Error, please reload the page.'
    console.log response
    $scope.$apply()
]