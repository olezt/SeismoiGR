angular
    .module('app')
    .factory('SettingsService', SettingsService);

function SettingsService() {
	var settings = [];
	initSettings();

	var service = {
		getRange : getRange,
		setRange : setRange,
		getHours : getHours,
		setHours : setHours,
		getSettings : getSettings
	};
	return service;

	function initSettings() {
		settings = [];
		settings.push({
			range : window.localStorage['range'],
			hours : window.localStorage['hours']
		});
	}

	function getSettings() {
		initSettings();
		return settings;
	}

	function getHours() {
		return window.localStorage['hours'];
	}

	function setHours(hours) {
		window.localStorage['hours'] = hours;
	}

	function getRange() {
		return window.localStorage['range'];
	}

	function setRange(range) {
		window.localStorage['range'] = range;
	}

};
