angular
    .module('app')
    .controller('MapCtrl', MapCtrl);

    MapCtrl.inject = ['MapService', 'ngMap', '$window'];

        function MapCtrl(MapService, NgMap, $window) {
        	var vm = this;
        	vm.mapHeight = $window.innerHeight-92+"px";
        	
        	NgMap.getMap().then(function(map) {
        	});
        	
        	//MapService.initialise();
        }