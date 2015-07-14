'use strict';

angular.module('winnerpickerApp')
  .directive('facebookLogin', ['Facebook', (Facebook) ->
    restrict: 'A'
    link: (scope, element, attrs) ->
      fbstatus = ''

      if Facebook.isInit()
        Facebook.getLoginStatus()

      $(element).on "click", (event) ->
        event.preventDefault()
        if fbstatus != 'connected'
          Facebook.login('manage_pages')
        else if fbstatus is 'connected'
          scope.start()

      scope.$on "fb_statusChange", (event, response) ->
        #console.log "facebookLogin directive: fb_statusChange " + response.status
        fbstatus = response.status
        if fbstatus isnt "not_authorized"
          scope.$emit "fb_authenticated"
  ]
)