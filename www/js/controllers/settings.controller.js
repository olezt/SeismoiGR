angular
	.module('app')
	.controller('SettingsCtrl', SettingsCtrl);

SettingsCtrl.$inject = ['SettingsService'];

function SettingsCtrl(SettingsService) {
	var vm = this;
	vm.setRange = updateRange;
	vm.setHours = updateHours;

	vm.earthquake = getSettings();

	function updateRange(earthquakeRange) {
		SettingsService.setRange(earthquakeRange);
	}

	function updateHours(earthquakeHours) {
		SettingsService.setHours(earthquakeHours);
	}

}
