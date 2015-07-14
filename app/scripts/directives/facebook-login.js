(function() {
  'use strict';
  angular.module('winnerpickerApp').directive('facebookLogin', [
    'Facebook', function(Facebook) {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          var fbstatus;
          fbstatus = '';
          if (Facebook.isInit()) {
            Facebook.getLoginStatus();
          }
          $(element).on("click", function(event) {
            event.preventDefault();
            if (fbstatus !== 'connected') {
              return Facebook.login('manage_pages');
            } else if (fbstatus === 'connected') {
              return scope.start();
            }
          });
          return scope.$on("fb_statusChange", function(event, response) {
            fbstatus = response.status;
            if (fbstatus !== "not_authorized") {
              return scope.$emit("fb_authenticated");
            }
          });
        }
      };
    }
  ]);

}).call(this);

/*
//@ sourceMappingURL=facebook-login.js.map
*/