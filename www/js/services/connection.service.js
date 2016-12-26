angular
    .module('app')
    .factory('ConnectionService', ConnectionService);

ConnectionService.inject = [ '$cordovaNetwork', '$rootScope' ];

function ConnectionService($cordovaNetwork, $rootScope) {
	var service = {
		getConnection : getConnection
	};

	return service;

	function getConnection() {
		//device                  
		if (ionic.Platform.isWebView()) {
			if ($cordovaNetwork.isOnline()) {
				return true;
			} else {
				return false;
			}
		//browser
		} else {
			if (navigator.onLine) {
				return true;
			} else {
				return false;
			}
		}
	}
}