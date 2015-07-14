(function() {
  'use strict';
  angular.module('winnerpickerApp').controller('FiltersCtrl', [
    '$scope', '$location', '$cacheFactory', 'Facebook', 'usSpinnerService', 'winnerpickerServices', function($scope, $location, $cacheFactory, Facebook, usSpinnerService, winnerpickerServices) {
      var alreadyCommented, cache, commenters, compareDate, compareLikeCount, createList, id, init, likers, post_id, rawComments, rawLikes, ready;
      if (Facebook.isInit()) {
        Facebook.getLoginStatus();
      }
      ready = false;
      $scope.errorMsg = '';
      cache = '';
      id = '';
      post_id = '';
      rawLikes = [];
      rawComments = [];
      likers = [];
      commenters = [];
      init = function() {
        likers = [];
        commenters = [];
        cache = $cacheFactory.get('pageSelected');
        if (typeof cache === "undefined") {
          $location.path('/');
          return $scope.$apply();
        } else {
          id = cache.get('id');
          post_id = cache.get('post_id');
          if (typeof id === "undefined" || typeof post_id === "undefined") {
            $location.path('/');
            return $scope.$apply();
          } else {
            $scope.ariane_pageId = id;
            $scope.ariane_pageName = cache.get('pageName');
            $scope.ariane_postId = winnerpickerServices.getId(post_id).part2;
            $scope.action = 'l';
            $scope.word = '';
            $scope.wordType = 'type1';
            $scope.multiCom = 'type1';
            $scope.checkTags = false;
            $scope.checkLink = false;
            $scope.checkPhoto = false;
            $scope.nbwin = 10;
            $scope.winType = 'type1';
            $scope.from = '';
            $scope.to = '';
            return Facebook.getPostLikes(post_id);
          }
        }
      };
      compareLikeCount = function(a, b) {
        if (a.comment.like_count < b.comment.like_count) {
          return 1;
        }
        if (a.comment.like_count > b.comment.like_count) {
          return -1;
        }
        return compareDate(a, b);
      };
      compareDate = function(a, b) {
        if (a.comment.date < b.comment.date) {
          return -1;
        }
        if (a.comment.date > b.comment.date) {
          return 1;
        }
        return 0;
      };
      alreadyCommented = function(id) {
        var already, commenter, i, _i, _len;
        already = false;
        i = 0;
        for (_i = 0, _len = commenters.length; _i < _len; _i++) {
          commenter = commenters[_i];
          if (commenter.id === id) {
            already = true;
            commenter.alreadyCommented = true;
          }
          i++;
        }
        return already;
      };
      createList = function() {
        var comment, commenter, hasLiked, index, like, tempLikes, _i, _j, _len, _len1;
        tempLikes = rawLikes.slice();
        for (_i = 0, _len = rawComments.length; _i < _len; _i++) {
          comment = rawComments[_i];
          commenter = {};
          hasLiked = false;
          for (_j = 0, _len1 = tempLikes.length; _j < _len1; _j++) {
            like = tempLikes[_j];
            if (like.id === comment.from.id) {
              hasLiked = true;
              index = tempLikes.indexOf(like);
              tempLikes.splice(index, 1);
              break;
            }
          }
          commenter.id = comment.from.id;
          commenter.name = comment.from.name;
          commenter.hasLiked = hasLiked;
          commenter.comment = {};
          commenter.comment.id = comment.id;
          commenter.comment.like_count = comment.like_count;
          commenter.comment.message = comment.message;
          commenter.comment.date = comment.created_time;
          if (comment.message_tags) {
            commenter.comment.withTags = true;
          } else {
            commenter.comment.withTags = false;
          }
          if (comment.attachment) {
            if (comment.attachment.type === 'photo') {
              commenter.comment.photo = true;
              commenter.comment.src = comment.attachment.media.image.src;
              commenter.comment.link = false;
            } else {
              commenter.comment.photo = false;
              commenter.comment.link = true;
            }
          } else {
            commenter.comment.photo = false;
            commenter.comment.link = false;
          }
          if (alreadyCommented(comment.from.id)) {
            commenter.alreadyCommented = true;
          } else {
            commenter.alreadyCommented = false;
          }
          commenters.push(commenter);
        }
        likers = tempLikes;
        ready = true;
        $scope.showDl = true;
        usSpinnerService.stop('spinner-1');
        return $scope.$apply();
      };
      $scope.pickWinners = function() {
        var cleanedWinner, cleanedWinners, commenter, commenter2, count, finalList, i, j, lowerMsg, r, splice, tempList, tempList2, winner, winners, word, words, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _len6, _m, _n, _o;
        $scope.checkForm = true;
        $scope.errorMsg = '';
        winners = [];
        finalList = [];
        if ($scope.filterForm.$valid && $scope.nbwin > 0 && ready) {
          tempList = [];
          tempList2 = commenters.slice();
          i = 0;
          if ($scope.action === 'l') {
            finalList = likers.slice();
          } else {
            for (_i = 0, _len = tempList2.length; _i < _len; _i++) {
              commenter = tempList2[_i];
              splice = false;
              if ($scope.action === 'cl' && !commenter.hasLiked) {
                splice = true;
              }
              if ($scope.word.length > 0) {
                lowerMsg = commenter.comment.message.toLowerCase();
                if ($scope.wordType === 'type1') {
                  words = $scope.word.match(/\S+/g);
                  for (_j = 0, _len1 = words.length; _j < _len1; _j++) {
                    word = words[_j];
                    if (lowerMsg.indexOf(word.toLowerCase()) === -1) {
                      splice = true;
                    }
                  }
                } else if ($scope.wordType === 'type2') {
                  words = $scope.word.match(/\S+/g);
                  for (_k = 0, _len2 = words.length; _k < _len2; _k++) {
                    word = words[_k];
                    if (lowerMsg.indexOf(word.toLowerCase()) === -1) {
                      splice = true;
                    } else {
                      splice = false;
                      break;
                    }
                  }
                } else if ($scope.wordType === 'type3') {
                  if (lowerMsg.indexOf($scope.word.toLowerCase()) === -1) {
                    splice = true;
                  }
                }
              }
              if ($scope.from <= $scope.to && $scope.to !== '' && $scope.from !== '') {
                if (commenter.comment.date.substring(0, 10) < $scope.from || commenter.comment.date.substring(0, 10) > $scope.to) {
                  splice = true;
                }
              }
              if ($scope.checkTags && !commenter.comment.withTags) {
                splice = true;
              }
              if ($scope.checkLink && !commenter.comment.link) {
                splice = true;
              }
              if ($scope.checkPhoto && !commenter.comment.photo) {
                splice = true;
              }
              if (!splice) {
                tempList.push(commenters[i]);
              }
              i++;
            }
            tempList2 = tempList;
            i = 0;
            for (_l = 0, _len3 = tempList2.length; _l < _len3; _l++) {
              commenter = tempList2[_l];
              splice = false;
              if (commenter.alreadyCommented && $scope.multiCom !== 'type3') {
                j = 0;
                for (_m = 0, _len4 = tempList2.length; _m < _len4; _m++) {
                  commenter2 = tempList2[_m];
                  if (commenter.id === commenter2.id && commenter.comment.id !== commenter2.comment.id) {
                    if ($scope.multiCom === 'type1') {
                      if (commenter.comment.like_count < commenter2.comment.like_count) {
                        splice = true;
                      } else if (commenter.comment.like_count === commenter2.comment.like_count && commenter.comment.date > commenter2.comment.date) {
                        splice = true;
                      }
                    } else if ($scope.multiCom === 'type2') {
                      if (commenter.comment.date > commenter2.comment.date) {
                        splice = true;
                      } else if (commenter.comment.date === commenter2.comment.date && commenter.comment.like_count < commenter2.like_count) {
                        splice = true;
                      }
                    }
                  }
                  j++;
                }
              }
              if (!splice) {
                finalList.push(tempList2[i]);
              }
              i++;
            }
          }
          if ($scope.nbwin <= finalList.length) {
            if ($scope.winType === 'type1') {
              count = 0;
              while (count < $scope.nbwin) {
                r = Math.floor(Math.random() * finalList.length);
                winners.push(finalList[r]);
                finalList.splice(r, 1);
                count++;
              }
            } else if ($scope.winType === 'type2') {
              if ($scope.topLike <= finalList.length) {
                if ($scope.nbwin <= $scope.topLike) {
                  finalList.sort(compareLikeCount);
                  finalList.splice($scope.topLike, finalList.length - $scope.topLike);
                  count = 0;
                  while (count < $scope.nbwin) {
                    r = Math.floor(Math.random() * finalList.length);
                    winners.push(finalList[r]);
                    finalList.splice(r, 1);
                    count++;
                  }
                  winners.sort(compareLikeCount);
                } else {
                  $scope.errorMsg = 'Error, you can not ask ' + $scope.nbwin + ' winners from ' + $scope.topLike + ' most liked comments.';
                }
              } else {
                $scope.errorMsg = 'Error, too many most liked comments asked. The maximum with these filters is: ' + finalList.length;
              }
            } else if ($scope.winType === 'type3') {
              finalList.sort(compareLikeCount);
              count = 0;
              while (count < $scope.nbwin) {
                winners.push(finalList[count]);
                count++;
              }
              winners.sort(compareLikeCount);
            }
          } else {
            $scope.errorMsg = 'Error, too many winners asked. The maximum with these filters is: ' + finalList.length;
          }
          if ($scope.errorMsg.length === 0) {
            if ($scope.action === 'l') {
              for (_n = 0, _len5 = winners.length; _n < _len5; _n++) {
                winner = winners[_n];
                winner.selected = false;
              }
              cache.put('winners', winners);
              return $location.path('winners');
            } else {
              cleanedWinners = [];
              for (_o = 0, _len6 = winners.length; _o < _len6; _o++) {
                winner = winners[_o];
                cleanedWinner = {};
                cleanedWinner.id = winner.id;
                cleanedWinner.message = winner.comment.message;
                cleanedWinner.comment_id = winner.comment.id;
                cleanedWinner.name = winner.name;
                if (typeof winner.comment.src !== "undefined" && $scope.checkPhoto) {
                  cleanedWinner.photoSrc = winner.comment.src;
                }
                cleanedWinner.selected = false;
                cleanedWinners.push(cleanedWinner);
              }
              cache.put('winners', cleanedWinners);
              return $location.path('winners');
            }
          }
        }
      };
      $scope.dlRawLikes = function() {
        var columns, like, tempLikes, _i, _len;
        columns = ['User ID', 'Name', 'Profile URL'];
        tempLikes = rawLikes.slice();
        for (_i = 0, _len = tempLikes.length; _i < _len; _i++) {
          like = tempLikes[_i];
          like.link = 'https://www.facebook.com/' + like.id;
        }
        return winnerpickerServices.download(columns, rawLikes);
      };
      $scope.dlRawComments = function() {
        var columns, comment, tempComments, _i, _len;
        columns = ['User ID', 'Name', 'Profile URL', 'Message', 'Comment URL', 'Likes', 'Date'];
        tempComments = rawComments.slice();
        for (_i = 0, _len = tempComments.length; _i < _len; _i++) {
          comment = tempComments[_i];
          comment.comment_id = comment.id;
          comment.id = comment.from.id;
          comment.name = comment.from.name;
          comment.link = 'https://www.facebook.com/' + comment.id;
          comment.comment = 'https://www.facebook.com/' + $scope.ariane_pageId + '/posts/' + $scope.ariane_postId + '?comment_id=' + winnerpickerServices.getId(comment.comment_id).part2;
        }
        return winnerpickerServices.download(columns, rawComments);
      };
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
          return init();
        }
      });
      $scope.$on("fb_get_postlikes_success", function(event, response) {
        rawLikes = response.likes.data;
        return Facebook.getPostComments(post_id);
      });
      $scope.$on("fb_get_postcomments_success", function(event, response) {
        rawComments = response.comments.data;
        if (rawLikes !== '') {
          return createList();
        }
      });
      $scope.$on("fb_get_postlikes_failed", function(event, response) {
        $scope.errorMsg = 'Error, please reload the page.';
        console.log(response);
        return $scope.$apply();
      });
      return $scope.$on("fb_get_postcomments_failed", function(event, response) {
        $scope.errorMsg = 'Error, please reload the page.';
        console.log(response);
        return $scope.$apply();
      });
    }
  ]);

}).call(this);

/*
//@ sourceMappingURL=filters.js.map
*/