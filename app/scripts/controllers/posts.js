(function() {
  'use strict';
  angular.module('winnerpickerApp').controller('PostsCtrl', [
    '$scope', '$location', '$cacheFactory', 'Facebook', 'usSpinnerService', 'winnerpickerServices', function($scope, $location, $cacheFactory, Facebook, usSpinnerService, winnerpickerServices) {
      var cache, createTab, createTab2, id, init, query, ready, setType, types;
      if (Facebook.isInit()) {
        Facebook.getLoginStatus();
      }
      ready = false;
      $scope.errorMsg = '';
      cache = '';
      id = '';
      query = '';
      types = [
        {
          type: 11,
          name: 'Group created'
        }, {
          type: 12,
          name: 'Event created'
        }, {
          type: 46,
          name: 'Status update'
        }, {
          type: 56,
          name: 'Post on wall from another user'
        }, {
          type: 66,
          name: 'Note created'
        }, {
          type: 80,
          name: 'Link posted'
        }, {
          type: 128,
          name: 'Video posted'
        }, {
          type: 247,
          name: 'Photos posted'
        }, {
          type: 237,
          name: 'App story'
        }, {
          type: 257,
          name: 'Comment created'
        }, {
          type: 272,
          name: 'App story'
        }, {
          type: 285,
          name: 'Checkin to a place'
        }, {
          type: 308,
          name: 'Post in Group'
        }
      ];
      init = function() {
        var currentDate, day, month, prevmonth, year;
        cache = $cacheFactory.get('pageSelected');
        if (typeof cache === "undefined") {
          $location.path('/');
          return $scope.$apply();
        } else {
          id = cache.get('id');
          if (id === "undefined") {
            $location.path('/');
            return $scope.$apply();
          } else {
            $scope.ariane_pageId = id;
            $scope.ariane_pageName = cache.get('pageName');
            currentDate = new Date();
            day = currentDate.getDate();
            month = currentDate.getMonth() + 1;
            prevmonth = currentDate.getMonth();
            if (day < 10) {
              day = '0' + day;
            }
            if (month < 10) {
              month = '0' + month;
              prevmonth = '0' + prevmonth;
            }
            year = currentDate.getFullYear();
            $scope.since = year + '-' + prevmonth + '-' + day;
            $scope.until = year + '-' + month + '-' + day;
            $scope.limit = 1000;
            $scope.ogid = '';
            $scope.tab = [];
            ready = true;
            usSpinnerService.stop('spinner-1');
            return $scope.$apply();
          }
        }
      };
      setType = function(code) {
        var type, _i, _len;
        for (_i = 0, _len = types.length; _i < _len; _i++) {
          type = types[_i];
          if (parseInt(type.type) === parseInt(code)) {
            return type.name;
          }
        }
        return code;
      };
      createTab = function(data) {
        var col, d, post, row, _i, _len, _ref;
        $scope.tab = [];
        col = [];
        $scope.index = 0;
        $scope.posts_count = 0;
        _ref = data.result;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          post = _ref[_i];
          $scope.posts_count++;
          if (col.length === 5) {
            $scope.tab.push(col);
            col = [];
          }
          row = {};
          row.post_id = post.post_id;
          row.type = setType(post.type);
          row.message = post.message;
          row.likes = post.likes.count;
          row.comments = post.comments.count;
          row.shares = post.share_count;
          d = new Date(post.created_time * 1000);
          row.created_time = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
          col.push(row);
        }
        $scope.tab.push(col);
        if ($scope.tab[0].length === 0) {
          $scope.errorMsg = 'The list returned is empty.';
        }
        return usSpinnerService.stop('spinner-1');
      };
      createTab2 = function(post) {
        var col, row;
        $scope.tab = [];
        col = [];
        row = {};
        $scope.index = 0;
        $scope.posts_count = 1;
        row.post_id = $scope.ogid;
        row.type = post.type;
        row.message = post.message;
        row.likes = post.likes;
        row.comments = post.comments;
        row.shares = post.shares;
        row.created_time = post.created_time.slice(0, 10);
        col.push(row);
        $scope.tab.push(col);
        if ($scope.tab[0].length === 0) {
          $scope.errorMsg = 'The list returned is empty.';
        }
        return usSpinnerService.stop('spinner-1');
      };
      $scope.turnPage = function(direction) {
        if (direction) {
          if ($scope.index === $scope.tab.length - 1) {
            return $scope.index = 0;
          } else {
            return $scope.index++;
          }
        } else {
          if ($scope.index === 0) {
            return $scope.index = $scope.tab.length - 1;
          } else {
            return $scope.index--;
          }
        }
      };
      $scope.getId = function(id) {
        return winnerpickerServices.getId(id);
      };
      $scope.pick = function(post_id) {
        cache.put('post_id', post_id);
        return $location.path('filters');
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
      $scope.$on("fb_fql_success", function(event, response) {
        createTab(response);
        return $scope.$apply();
      });
      $scope.$on("fb_get_postinfos_success", function(event, response) {
        createTab2(response.infos);
        return $scope.$apply();
      });
      $scope.$on("fb_fql_failed", function(event, response) {
        $scope.errorMsg = 'An error occured with your request.';
        $scope.tab = [];
        console.log(response);
        usSpinnerService.stop('spinner-1');
        return $scope.$apply();
      });
      $scope.$on("fb_get_postinfos_failed", function(event, response) {
        $scope.errorMsg = 'An error occured with your request.';
        $scope.tab = [];
        console.log(response);
        usSpinnerService.stop('spinner-1');
        return $scope.$apply();
      });
      return $scope.request = function() {
        var limit, ssince, suntil;
        $scope.errorMsg = '';
        $scope.tab = [];
        usSpinnerService.spin('spinner-1');
        if (ready) {
          if ($scope.ogid === '') {
            ssince = '';
            suntil = '';
            if ($scope.since !== '' && $scope.until !== '' && $scope.since <= $scope.until) {
              ssince = ' AND created_time >= ' + Date.parse($scope.since) / 1000;
              suntil = ' AND created_time <= ' + Date.parse($scope.until) / 1000;
            }
            limit = 1000;
            if ($scope.limit > 0) {
              limit = ' LIMIT ' + $scope.limit;
            }
            query = 'SELECT post_id, message, likes.count, comments.count, share_count, type, created_time FROM stream WHERE post_id in (SELECT post_id FROM stream WHERE source_id="' + id + '" AND type > 0 AND message != ""' + ssince + suntil + ' ORDER BY created_time DESC' + limit + ')';
            return Facebook.query(query);
          } else {
            return Facebook.getPostInfos(id, $scope.ogid);
          }
        }
      };
    }
  ]);

}).call(this);

/*
//@ sourceMappingURL=posts.js.map
*/