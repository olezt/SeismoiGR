angular
    .module('app')
    .config(['$translateProvider', function ($translateProvider) {

        $translateProvider.translations('en', {
            'last_hours_msg': 'Last hours',
            'range_msg': 'Min Magnitude',
			'lang_msg': 'Language',
			'map_msg': 'Map',
			'settings_msg': 'Settings',
			'magnitude_msg': 'Magnitude',
			'time_msg': 'Time',
			'depth_msg': 'Depth',
			'static_msg': 'Static',
			'dynamic_msg': 'Dynamic'
        });
  
        $translateProvider.translations('gr', {
        	'last_hours_msg': 'Διάστημα ωρών',
            'range_msg': 'Ελάχιστο μέγεθος',
			'lang_msg': 'Γλώσσα',
			'map_msg': 'Χαρτης',
			'settings_msg': 'Ρυθμίσεις',
			'magnitude_msg': 'Μέγεθος',
			'time_msg': 'Ώρα',
			'depth_msg': 'Εστιακό βάθος',
			'static_msg': 'Στατικό',
			'dynamic_msg': 'Δυναμικό'
        });
        
        $translateProvider.preferredLanguage('gr');
    
        $translateProvider.forceAsyncReload(true);

        $translateProvider.useSanitizeValueStrategy('sanitizeParameters');
    }]);