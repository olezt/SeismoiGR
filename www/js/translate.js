angular
    .module('app')
    .config(['$translateProvider', function ($translateProvider) {

        $translateProvider.translations('en', {
            'last_hours_msg': 'Last hours',
            'range_msg': 'Range',
			'lang_msg': 'Language',
			'map_msg': 'Map',
			'settings_msg': 'Settings'
        });
  
        $translateProvider.translations('gr', {
        	'last_hours_msg': 'Διάστημα ωρών',
            'range_msg': 'Διακύμανση',
			'lang_msg': 'Γλώσσα',
			'map_msg': 'Χαρτης',
			'settings_msg': 'Ρυθμίσεις'
        });
        
        $translateProvider.preferredLanguage('gr');
    
        $translateProvider.forceAsyncReload(true);

        $translateProvider.useSanitizeValueStrategy('sanitizeParameters');
    }]);