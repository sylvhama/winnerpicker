(function() {
  'use strict';
  
  var app;

  app = angular.module("FacebookProvider", []);

  app.provider('FacebookConfig', function() {
    this.appId = '';
    this.locale = 'en_US';

    this.$get = function() {
      var appId = this.appId;
      var locale = this.locale;
      return {
        getParams: function() {
          return {
            appId: appId,
            locale: locale
          }
        }
      };
    };

    this.setAppId = function(appId) {
      this.appId = appId;
    };
    this.setLocale = function(locale) {
      this.locale = locale;
    };
  });

  app.factory("Facebook", ['$rootScope', 'FacebookConfig', function($rootScope, FacebookConfig) {
    return {
      getLoginStatus: function() {
        return FB.getLoginStatus((function(response) {
          return $rootScope.$broadcast("fb_statusChange", {
            status: response.status
          });
        }), true);
      },
      login: function(_scope) {
        return FB.login((function(response) {
          if (response.authResponse) {
            return $rootScope.$broadcast("fb_connected", {
              facebook_id: response.authResponse.userID
            });
          } else {
            return $rootScope.$broadcast("fb_login_failed");
          }
        }), {
          scope: _scope
        });
      },
      logout: function() {
        return FB.logout(function(response) {
          if (response) {
            return $rootScope.$broadcast("fb_logout_succeded");
          } else {
            return $rootScope.$broadcast("fb_logout_failed");
          }
        });
      },
      getInfo: function() {
        return FB.api("/me", function(response) {
          return $rootScope.$broadcast("fb_infos", {
            user: response
          });
        });
      },
      getGroupFeed: function(id) {
        return FB.api("/" + id + "/feed", { limit: 25 }, function(response) {
          return $rootScope.$broadcast("fb_get_group_feed", {
            group_feed: response
          });
        });
      },
      unsubscribe: function() {
        return FB.api("/me/permissions", "DELETE", function(response) {
          return $rootScope.$broadcast("fb_get_login_status");
        });
      },
      addFeed: function(param) {
        var config = FacebookConfig.getParams();
        return FB.ui({ method:'feed', app_id: config.appId, redirect_ur: param.redirect_ur, from: param.from, to: param.to, link: param.link, picture: param.picture, source: param.source, name: param.name, caption: param.caption, description: param.description, ref: param.ref
          }, function(response){
          if (response != null) {
            return $rootScope.$broadcast("fb_post_feed_success",{
              postID: response.post_id
            });
          }
        });
      },
      shareLink: function(link, caption) {
        return FB.ui({
          method: 'feed',
          link: link,
          caption: caption
        },function(response){
          if (response != null) {
            return $rootScope.$broadcast("fb_post_link_success",{
              postID: response.post_id
            });
          }
        });
      },
      addPhoto: function(message,img,tags) {
        FB.api('me/photos','post',
          {
            message: message,
            url: img
          },
          function(response) {
            if (!response || response.error) {
              $rootScope.$broadcast("fb_post_photo_failed",{
                data: response
              });
            } else {
              var postId = response.id;
              $rootScope.$broadcast("fb_post_photo_sucess",{
                data: response
              });
              if(tags.length > 0) {
                FB.api(postId+'/tags?tags='+JSON.stringify(tags), 'post', function(response){
                  if (!response || response.error) {
                    return $rootScope.$broadcast("fb_tag_photo_failed",{
                      data: response
                    });
                  } else {
                    return $rootScope.$broadcast("fb_tag_photo_success",{
                      data: response
                    });
                  }
                });
              }
            }
          }
        );
      },
      addPost: function(message) {
        FB.api('me/feed','post',
          {
            message: message
          },
          function(response) {
            if (!response || response.error) {
              return $rootScope.$broadcast("fb_post_failed",{
                data: response
              });
            } else {
              return $rootScope.$broadcast("fb_post_success",{
                data: response
              });
            }
          }
        );
      },
      addStory: function(param) {
        var config = FacebookConfig.getParams();
        FB.api(
          'me/'+ param.action,
          'post', {
            itinerary: {//object name
              app_id: config.appId,
              type: param.type,
              title: param.title,
              url: partam.url,
              image: param.image,
              description: param.description
            }
          },
          function(response) {
            if (!response || response.error) {
              return $rootScope.$broadcast("fb_action_failed",{
                data: response
              });
            } else {
              return $rootScope.$broadcast("fb_action_success",{
                data: response
              });
            }
          }
        );
      },
      isInit: function() {
        if (typeof(FB) != 'undefined' && FB != null ) {
          return true;
        }else {
          return false;
        }
      },
      getFriends: function() {
        FB.api('/me/friends',
          function(response) {
            if (!response || response.error) {
              return $rootScope.$broadcast("fb_get_friends_failed",{
                data: response
              });
            } else {
              return $rootScope.$broadcast("fb_get_friends_success",{
                friends: response.data
              });
            }
          }
        );
      },
      getLikes: function() {
        FB.api('/me/likes',
          function(response) {
            if (!response || response.error) {
              return $rootScope.$broadcast("fb_get_likes_failed",{
                data: response
              });
            } else {
              return $rootScope.$broadcast("fb_get_likes_success",{
                likes: response.data
              });
            }
          }
        );
      },
      getAcessToken: function() {
        return FB.getAuthResponse()['accessToken'];
      },

      getPages: function() {
        FB.api('/me/accounts?fields=id,name,likes,category',
          function(response) {
            if (response && !response.error) {
              return $rootScope.$broadcast("fb_get_pages_success",{
                pages: response
              });
            } else {
              return $rootScope.$broadcast("fb_get_pages_failed",{
                error: response
              });
            }
          }
        );
      },
      getPagePosts: function(id) {
        FB.api('/' + id +'/posts',
          function(response) {
            if (response && !response.error) {
              return $rootScope.$broadcast("fb_get_pageposts_success",{
                posts: response
              });
            } else {
              return $rootScope.$broadcast("fb_get_pageposts_failed",{
                error: response
              });
            }
          }
        );
      },
      getPagePostsByDate: function(id, since, until) {
        FB.api('/' + id +'/posts?since=' + since + 'until=' + until,
          function(response) {
            if (response && !response.error) {
              return $rootScope.$broadcast("fb_get_pagepostsbydate_success",{
                posts: response
              });
            } else {
              return $rootScope.$broadcast("fb_get_pagepostsbydate_failed",{
                error: response
              });
            }
          }
        );
      },
      getPostInfos: function(pageId, id) { //780592308632167/sharedposts?fields=id,created_time,from&limit=5000 + read_stream
        FB.api('/' + id,
          function(response) {
            if (response.error) {
              id = pageId + '_' + id
            }
            var result = {};
            FB.api('/' + id,
              function(response) {
                if (response && !response.error) {
                  if (response.name) {
                    if (typeof(response.message) === 'undefined') {
                      result.message = response.name;
                    }else {
                      result.message = response.message;
                    }
                    result.type = 'Link';
                  } else if (response.message) {
                    result.message = response.message;
                    result.type = 'Statue';
                  } else {
                    result.message = 'NA';
                    result.type = 'NA';
                  }
                  if (response.images || response.album) {
                    result.type = "Photo";
                  }
                  if (response.created_time) {
                    result.created_time = response.created_time;
                  } else if (response.updated_time) {
                    result.created_time = response.updated_time;
                  } else {
                    result.created_time = 'NA';
                  }
                  if (response.shares) {
                    result.shares = response.shares.count;
                  } else {
                    result.shares = 'NA';
                  }
                  FB.api('/' + id + '/likes?summary=true',
                    function(response) {
                      if (response && !response.error) {
                        result.likes = response.summary.total_count;
                        FB.api('/' + id + '/sharedposts?fields=id,created_time,from&limit=5000',
                          function(response) {
                            if (response && !response.error) {
                              if(result.shares == 'NA') {
                                result.shares = response.data.length;
                              }
                              FB.api('/' + id + '/comments?summary=true',
                                function(response) {
                                  if (response && !response.error) {
                                    result.comments = response.summary.total_count;
                                    return $rootScope.$broadcast("fb_get_postinfos_success",{
                                      infos: result
                                    });
                                  }
                                  else {
                                    return $rootScope.$broadcast("fb_get_postinfos_failed",{
                                      error: response.error
                                    });
                                  }
                                }
                              );
                            }
                            else {
                              return $rootScope.$broadcast("fb_get_postinfos_failed",{
                                error: response.error
                              });
                            }
                          }
                        )
                      }
                      else {
                        return $rootScope.$broadcast("fb_get_postinfos_failed",{
                          error: response.error
                        });
                      }
                    }
                  );
                }else {
                  return $rootScope.$broadcast("fb_get_postinfos_failed",{
                    error: response.error
                  });
                }
              }
            );
          }
        );
      },
      query: function(query) {
        FB.api({
          method: 'fql.query',
          query: query
        }, function(response){
          if (response && !response.error) {
            return $rootScope.$broadcast("fb_fql_success",{
              result: response
            });
          } else {
            return $rootScope.$broadcast("fb_fql_failed",{
              error: response
            });
          }
        });
      },
      getPostLikes: function(id) {
        FB.api('/' + id +'/likes?fields=id,name&limit=10000',
          function(response) {
            if (response && !response.error) {
              return $rootScope.$broadcast("fb_get_postlikes_success",{
                likes: response
              });
            } else {
              return $rootScope.$broadcast("fb_get_postlikes_failed",{
                error: response
              });
            }
          }
        );
      },
      getPostComments: function(id) {
        FB.api('/' + id +'/comments?fields=attachment,id,like_count,message_tags,message,from,created_time&limit=10000',
          function(response) {
            if (response && !response.error) {
              return $rootScope.$broadcast("fb_get_postcomments_success",{
                comments: response
              });
            } else {
              return $rootScope.$broadcast("fb_get_postcomments_failed",{
                error: response
              });
            }
          }
        );
      }
    };
  }]);

  app.run(['$location', '$rootScope', 'FacebookConfig', function($location, $rootScope, FacebookConfig) {
    var config = FacebookConfig.getParams();
    window.fbAsyncInit = function() {
      FB.init({
        appId      : config.appId,
        cookie     : true,  // enable cookies to allow the server to access
        // the session
        xfbml      : true,  // parse social plugins on this page
        version    : 'v2.3' // use version 2.0
      });
      //FB.Canvas.setAutoGrow();
      FB.getLoginStatus(function(response) {
        return $rootScope.$broadcast("fb_statusChange", response);
      });
      $rootScope.$broadcast("fb_loaded");
    }

    return (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/" + config.locale + "/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

  }]);
}).call(this);


