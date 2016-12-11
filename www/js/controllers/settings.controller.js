angular
	.module('app')
	.controller('SettingsCtrl', SettingsCtrl);

SettingsCtrl.$inject = ['SettingsService', '$translate', '$scope'];

function SettingsCtrl(SettingsService, $translate, $scope) {
	var vm = this;
	vm.setRange = updateRange;
	vm.setHours = updateHours;
	vm.updateLang = vm.updateLang;
    vm.initLang = initLang;

	vm.earthquake = SettingsService.getSettings();

    $scope.$watch('vm.lang', function() {
        updateLang();
    });
	
	function updateRange(earthquakeRange) {
		SettingsService.setRange(earthquakeRange);
	}

	function updateHours(earthquakeHours) {
		SettingsService.setHours(earthquakeHours);
	}
	
	function updateLang () {
    	$translate.use(vm.lang);
    	SettingsService.setLang(vm.lang);
    }
    
    function initLang(){
    	vm.lang = SettingsService.getLang();
    	$translate.use(vm.lang);
    }

}
