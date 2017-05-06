'use strict';

angular.module('GiveThatDevACookieApp')

.controller('BrowseAppsController', ['$scope', 'browseAppsFactory', 'favoriteFactory', function ($scope, browseAppsFactory, favoriteFactory) {
    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showApps = false;
    $scope.message = "Loading ...";

    browseAppsFactory.query(
        function (response) {
            $scope.apps = response;
            $scope.apps.forEach(function(app, index) {
              if (app.tags) app.tags = app.tags.split(' ');
            });
            $scope.showApps = true;
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        });

    $scope.select = function (setTab) {
        $scope.tab = setTab;

        if (setTab === 2) {
            $scope.filtText = "app";
        } else if (setTab === 3) {
            $scope.filtText = "script";
        } else if (setTab === 4) {
            $scope.filtText = "web_service";
        } else {
            $scope.filtText = "";
        }
    };

    $scope.isSelected = function (checkTab) {
        return ($scope.tab === checkTab);
    };

    $scope.addToFavorites = function(appid) {
        console.log('Add to favorites', appid);
        favoriteFactory.save({_id: appid});
        $scope.showFavorites = !$scope.showFavorites;
    };
}])

.controller('ContactController', ['$scope', 'feedbackFactory', function ($scope, feedbackFactory) {
  $scope.showSuccess = false;
  $scope.feedback = {
      firstName: "",
      lastName: "",
      email: "",
      comments: ""
  };

  $scope.sendFeedback = function () {
    /*
      Contact us page is functioning, but doesn't send any feedback at this moment.
      This feature was deprioritized during the project developemnt phase.
    */
    feedbackFactory.save($scope.feedback);
    console.log("[!] Contact us page is functioning, but doesn't send any feedback at this moment. This feature was deprioritized during the project developemnt phase.");
    $scope.feedback = {
        firstName: "",
        lastName: "",
        email: "",
        comments: ""
    };
    $scope.showSuccess = true;
    $scope.feedbackForm.$setPristine();
  };

}])

.controller('AppDetailController', ['$scope', '$state', '$stateParams', 'browseAppsFactory', 'commentFactory', 'AuthFactory', 'favoriteFactory', function ($scope, $state, $stateParams, browseAppsFactory, commentFactory, AuthFactory, favoriteFactory) {
    $scope.app = {};
    $scope.isLogin = !AuthFactory.isAuthenticated();
    $scope.showApp = false;
    $scope.message = "Loading ...";
    $scope.showFavorites = true;

    $scope.app = browseAppsFactory.get({ id: $stateParams.id }).$promise.then(
        function (response) {
            $scope.app = response;
            if ($scope.app.tags) $scope.app.tags = $scope.app.tags.split(' ');
            $scope.showApp = true;
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        }
    );

    $scope.mycomment = {
        rating: 5,
        comment: ""
    };

    $scope.submitComment = function () {
        commentFactory.save({id: $stateParams.id}, $scope.mycomment);
        $state.go($state.current, {}, {reload: true});
        $scope.commentForm.$setPristine();
        $scope.mycomment = {
            rating: 5,
            comment: ""
        };
    }

    $scope.addToFavorites = function(appid) {
        console.log('Add to favorites', appid);
        favoriteFactory.save({_id: appid});
        $scope.showFavorites = !$scope.showFavorites;
    };

}])

.controller('HomeController', ['$scope', 'browseAppsFactory', function ($scope, browseAppsFactory) {
    $scope.showApp = false;
    $scope.message = "Loading ...";
    $scope.apps = browseAppsFactory.query({
            featured: "true"
        })
        .$promise.then(
            function (response) {
                $scope.apps = response;
                $scope.apps.length = 3;
                $scope.showApp = true;
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );
}])

.controller('ShareAppController', ['$scope', 'shareAppFactory', function ($scope, shareAppFactory) {
    $scope.showSuccess = false;
    $scope.showError = false;
    $scope.errorMessage = '';

    $scope.newApp = {
      "appTitle":"Best app ever",
      "appDescription":"App can interact with the other objects in way nobody done before",
      "appImageUrl":"https://www.google.de/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
      "appDownloadUrl":"https://github.com/",
      "appCategory":"app",
      "appTags":"best_app innovation next_uber"
    };
    $scope.appCategories = [{
      "value":"app",
      "label":"App"
    },{
      "value":"script",
      "label":"Script"
    },{
      "value":"web_service",
      "label":"Web Service"
    }];
    $scope.shareApp = function(){
      shareAppFactory.create({
          "title": $scope.newApp.appTitle,
          "description": $scope.newApp.appDescription,
          "image_url": $scope.newApp.appImageUrl,
          "download_url": $scope.newApp.appDownloadUrl,
          "category": $scope.newApp.appCategory,
          "tags": $scope.newApp.appTags
      }).$promise.then(
          function (response) {
            $scope.newApp = {
              "appTitle":"",
              "appDescription":"",
              "appImageUrl":"",
              "appDownloadUrl":"",
              "appCategory":"",
              "appTags":""
            };
            $scope.shareAppForm.$setPristine();
            $scope.showSuccess = true;
          },
          function (response) {
            $scope.showError = true;
            $scope.errorMessage = response.status + " " + response.statusText;
          }
      );

    };
}])

.controller('FavoriteController', ['$scope', '$state', 'favoriteFactory', function ($scope, $state, favoriteFactory) {
    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showDetails = true; // $scope.showDetails = false;
    $scope.showDelete = true; // $scope.showDelete = false;
    $scope.showMenu = false;
    $scope.message = "Loading ...";

    favoriteFactory.query(
        function (response) {
            $scope.apps = response.apps;
            $scope.apps.forEach(function(app, index) {
              if (app.tags) app.tags = app.tags.split(' ');
            });
            $scope.showMenu = true;
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        });

    $scope.select = function (setTab) {
        $scope.tab = setTab;

        if (setTab === 2) {
            $scope.filtText = "app";
        } else if (setTab === 3) {
            $scope.filtText = "script";
        } else if (setTab === 4) {
            $scope.filtText = "web_service";
        } else {
            $scope.filtText = "";
        }
    };

    $scope.isSelected = function (checkTab) {
        return ($scope.tab === checkTab);
    };

    $scope.toggleDetails = function () {
        $scope.showDetails = !$scope.showDetails;
    };

    $scope.toggleDelete = function () {
        $scope.showDelete = !$scope.showDelete;
    };

    $scope.deleteFavorite = function(appid) {
        console.log('Delete favorites', appid);
        favoriteFactory.delete({id: appid});
        $scope.showDelete = !$scope.showDelete;
        $state.go($state.current, {}, {reload: true});
    };
}])

.controller('HeaderController', ['$scope', '$state', '$rootScope', 'ngDialog', 'AuthFactory', function ($scope, $state, $rootScope, ngDialog, AuthFactory) {
    $scope.loggedIn = false;
    $scope.username = '';

    if(AuthFactory.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthFactory.getUsername();
    }

    $scope.openLogin = function () {
        ngDialog.open({ template: 'views/login.html', scope: $scope, className: 'ngdialog-theme-default', controller:"LoginController" });
    };

    $scope.logOut = function() {
       AuthFactory.logout();
        $scope.loggedIn = false;
        $scope.username = '';
    };

    $rootScope.$on('login:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });

    $rootScope.$on('registration:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });

    $scope.stateis = function(curstate) {
       return $state.is(curstate);
    };

}])

.controller('LoginController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {
    $scope.loginData = $localStorage.getObject('userinfo','{}');
    $scope.doLogin = function() {
        if($scope.rememberMe)
           $localStorage.storeObject('userinfo',$scope.loginData);
        AuthFactory.login($scope.loginData);
        ngDialog.close();
    };

    $scope.openRegister = function () {
        ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default', controller:"RegisterController" });
    };

}])

.controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {
    $scope.register={};
    $scope.loginData={};
    $scope.doRegister = function() {
        console.log('Doing registration', $scope.registration);
        AuthFactory.register($scope.registration);
        ngDialog.close();

    };
}]);
