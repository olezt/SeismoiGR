angular
    .module('app')
    .factory('ConnectionService', ConnectionService);

function ConnectionService() {
	var service = {
		getConnection : getConnection
	};

	return service;

	function getConnection() {
		if (navigator.onLine) {
			return true;
		} else {
			return false;
		}
	}
}