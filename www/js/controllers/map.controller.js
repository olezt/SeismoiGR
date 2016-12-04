angular
    .module('app')
    .controller('MapCtrl', MapCtrl);

    MapCtrl.inject = ['MapService'];

        
        function MapCtrl(MapService) {

        	MapService.initialise();

        }