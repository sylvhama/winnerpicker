(function() {
  'use strict';
  angular.module('winnerpickerApp').controller('WinnersCtrl', [
    '$scope', '$location', '$cacheFactory', 'winnerpickerServices', function($scope, $location, $cacheFactory, winnerpickerServices) {
      var cache, post_id;
      cache = $cacheFactory.get('pageSelected');
      if (typeof cache === "undefined") {
        $location.path('/');
      } else {
        $scope.winners = cache.get('winners');
        if (typeof $scope.winners === "undefined") {
          $location.path('/');
        } else {
          if (typeof $scope.winners[0].photoSrc !== "undefined") {
            $scope.showPhotos = true;
          } else {
            $scope.showPhotos = false;
          }
          $scope.ariane_pageId = cache.get('id');
          $scope.ariane_pageName = cache.get('pageName');
          post_id = cache.get('post_id');
          $scope.ariane_postId = winnerpickerServices.getId(post_id).part2;
        }
      }
      $scope.getId = function(id) {
        return winnerpickerServices.getId(id);
      };
      $scope.countSelected = function() {
        var count, winner, _i, _len, _ref;
        count = 0;
        _ref = $scope.winners;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          winner = _ref[_i];
          if (winner.selected) {
            count++;
          }
        }
        return count;
      };
      $scope.selectWinner = function(id) {
        var winner, _i, _len, _ref, _results;
        _ref = $scope.winners;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          winner = _ref[_i];
          if (winner.id === id) {
            _results.push(winner.selected = !winner.selected);
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };
      $scope.selectAll = function() {
        var winner, _i, _len, _ref, _results;
        _ref = $scope.winners;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          winner = _ref[_i];
          _results.push(winner.selected = true);
        }
        return _results;
      };
      $scope.deselectAll = function() {
        var winner, _i, _len, _ref, _results;
        _ref = $scope.winners;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          winner = _ref[_i];
          _results.push(winner.selected = false);
        }
        return _results;
      };
      $scope.getWinners = function() {
        var columns, finalWinner, finalWinners, winner, _i, _len, _ref;
        finalWinners = [];
        columns = [];
        _ref = $scope.winners;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          winner = _ref[_i];
          if (winner.selected) {
            finalWinner = {};
            finalWinner.id = winner.id;
            finalWinner.name = winner.name;
            finalWinner.message = winner.message;
            finalWinner.link = 'https://www.facebook.com/' + winner.id;
            if (typeof winner.comment_id !== 'undefined') {
              finalWinner.comment = 'https://www.facebook.com/' + $scope.ariane_pageId + '/posts/' + $scope.ariane_postId + '?comment_id=' + $scope.getId(winner.comment_id).part2;
              if (!$scope.showPhotos) {
                columns = ['User ID', 'Name', 'Profile URL', 'Message', 'Comment URL'];
              } else {
                columns = ['User ID', 'Name', 'Profile URL', 'Message', 'Comment URL', 'Photo URL'];
                finalWinner.photoSrc = winner.photoSrc;
              }
            } else {
              columns = ['User ID', 'Name', 'Profile URL', 'Message'];
            }
            finalWinners.push(finalWinner);
          }
        }
        return winnerpickerServices.download(columns, finalWinners);
      };
      return $scope.dlPhotos = function() {
        var clickEvent, i;
        i = 0;
        while (i < document.getElementsByClassName("post-picture").length) {
          clickEvent = document.createEvent("MouseEvent");
          clickEvent.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
          document.getElementsByClassName("post-picture")[i].dispatchEvent(clickEvent);
          i++;
        }
      };
      /*$scope.winners = []
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
      $scope.winners.push(w9)
      */

    }
  ]);

}).call(this);

/*
//@ sourceMappingURL=winners.js.map
*/