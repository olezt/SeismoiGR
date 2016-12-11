angular
	.module('app', [
		'ionic',
        'pascalprecht.translate'
		])

	.run(function($ionicPlatform) {
		$ionicPlatform.ready(function() {
			// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
			// for form inputs)
			if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				cordova.plugins.Keyboard.disableScroll(true);
			}
			if (window.StatusBar) {
				// org.apache.cordova.statusbar required
				StatusBar.styleDefault();
			}
		});
	})

	.config(function($stateProvider, $urlRouterProvider) {

		$stateProvider

			// setup an abstract state for the tabs directive
			.state('app', {
				url: '/app',
				abstract: true,
				templateUrl: 'templates/tabs.html'
			})

			// Each tab has its own nav history stack:

			.state('app.map', {
				url: '/map',
				views: {
					'tab-map': {
        templateUrl: 'templates/tab-map.html',
        controller: 'MapCtrl as vm'
      }
    }
  })

  .state('app.settings', {
      url: '/settings',
      views: {
        'tab-settings': {
          templateUrl: 'templates/tab-settings.html',
          controller: 'SettingsCtrl as vm'
        }
      }
    })
    
    
    $urlRouterProvider.otherwise('/app/map');

  });

