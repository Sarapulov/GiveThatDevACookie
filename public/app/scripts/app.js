'use strict';

angular.module('GiveThatDevACookieApp', ['ui.router','ngResource','ngDialog'])
.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

            // route for the home page
            .state('app', {
                url:'/',
                views: {
                    'header': {
                        templateUrl : 'views/header.html',
                        controller  : 'HeaderController'
                    },
                    'content': {
                        templateUrl : 'views/home.html',
                        controller  : 'HomeController'
                    },
                    'footer': {
                        templateUrl : 'views/footer.html',
                    }
                }

            })

            // route for the share app page
            .state('app.aboutus', {
                url:'shareapp',
                views: {
                    'content@': {
                        templateUrl : 'views/shareapp.html',
                        controller  : 'ShareAppController'
                    }
                }
            })

            // route for the contactus page
            .state('app.contactus', {
                url:'contactus',
                views: {
                    'content@': {
                        templateUrl : 'views/contactus.html',
                        controller  : 'ContactController'
                    }
                }
            })

            // route for the menu page
            .state('app.browseapps', {
                url: 'browseapps',
                views: {
                    'content@': {
                        templateUrl : 'views/browseapps.html',
                        controller  : 'BrowseAppsController'
                    }
                }
            })

            // route for the dishdetail page
            .state('app.appdetail', {
                url: 'browseapps/:id',
                views: {
                    'content@': {
                        templateUrl : 'views/appdetail.html',
                        controller  : 'AppDetailController'
                   }
                }
            })

            // route for the dishdetail page
            .state('app.favorites', {
                url: 'favorites',
                views: {
                    'content@': {
                        templateUrl : 'views/favorites.html',
                        controller  : 'FavoriteController'
                   }
                }
            });

        $urlRouterProvider.otherwise('/');
    })
;
