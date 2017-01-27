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
		getSettings : getSettings,
		getLang : getLang,
		setLang : setLang
	};
	return service;

	function initSettings() {
		settings = [];
		settings.range = getRange();
		settings.hours = getHours();
	}

	function getSettings() {
		initSettings();
		return settings;
	}

	function getHours() {
		return window.localStorage['hours'] || 48;
	}

	function setHours(hours) {
		window.localStorage['hours'] = hours;
	}

	function getRange() {
		return window.localStorage['range'] || 0;
	}

	function setRange(range) {
		window.localStorage['range'] = range;
	}

	function getLang() {
		return window.localStorage['lang']  || 'en';
	}

	function setLang(newLang) {
		window.localStorage['lang'] = newLang;
	}
};
