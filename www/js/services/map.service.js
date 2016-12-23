angular
    .module('app')
    .factory('MapService', MapService);
    
	//MapService.inject = [];
        
        function MapService(){
        	
        	var service = {
        			initialise: initialise
                };
        	return service;
            
        	function initialise() {
                myLatlng = new google.maps.LatLng(37.960990, 23.707768);
                mapOptions = {
                    zoom: 5,
                    center: myLatlng,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    streetViewControl: false
                }
                document.getElementById('map').style.height = "100%";
                map = new google.maps.Map(document.getElementById("map"), mapOptions);
            }
        };
