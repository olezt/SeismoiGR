angular
    .module('app')
    .controller('MapCtrl', MapCtrl);

    MapCtrl.inject = ['MapService', 'ngMap', '$window', '$translate', 'SettingsService', '$scope', '$location', '$interval'];

function MapCtrl(MapService, NgMap, $window, $translate, SettingsService, $scope, $location, $interval) {
	var vm = this;
	vm.mapHeight = $window.innerHeight - 92 + "px";
	vm.refreshData = refreshData;
	vm.setBounds = setBounds;
	vm.initMode = initMode;
	var on = true;
	var blinkInterval;
	var recent = [];
	var rectangle;
	
	NgMap.getMap().then(function(map) {
		addBoundsListener(map);
		fitBounds(map);
		
	    $scope.$watch('vm.mode', function() {
	        updateMode(map);
	    });
		
    	$scope.$on('$locationChangeSuccess', function(event) {
    		if($location.url()=='/app/map'){
    			refreshData(map);
    		}
  		});
        
	});
	
	function refreshData(map){
		clearData(map);
		loadData(map);
	}
	
	function loadData(map) {
		var bounceDate = new Date();
		bounceDate.setHours(bounceDate.getHours() + 2 - 4);
		map.data.loadGeoJson(calculateApiUrl(), null, function() {
			createInfoWindows(map);
			setIconStyle(map, bounceDate);
			blinkRecent(map);
		});
	}

	function clearData(map) {
		map.data.forEach(function(feature) {
		    map.data.remove(feature);
		});
		recent = [];
		$interval.cancel(blinkInterval);
		blinkInterval = undefined;
		google.maps.event.clearListeners(map.data, 'click');
	}
	
	function calculateApiUrl() {
		var startTime = calculateTimeRequest();
		var apiUrl;
		if(vm.mode == "static"){
			apiUrl = 'http://www.seismicportal.eu/fdsnws/event/1/query?limit=1000&start=' + startTime + '&minlat=33.853&maxlat=41.707&minlon=18.578&maxlon=27.901&minmag=' + SettingsService.getRange() + '&format=json';
		}else if(vm.mode == "dynamic" && MapService.getDynamicBounds()){
			var dynamicBounds = JSON.parse(MapService.getDynamicBounds());
			apiUrl = 'http://www.seismicportal.eu/fdsnws/event/1/query?limit=1000&start=' + startTime + '&minlat='+dynamicBounds.south+'&maxlat='+dynamicBounds.north+'&minlon='+dynamicBounds.west+'&maxlon='+dynamicBounds.east+'&minmag=' + SettingsService.getRange() + '&format=json';
		}else{
			apiUrl = 'http://www.seismicportal.eu/fdsnws/event/1/query?limit=1000&start=' + startTime + '&minlat=33.853&maxlat=41.707&minlon=18.578&maxlon=27.901&minmag=' + SettingsService.getRange() + '&format=json';
		}
		return apiUrl;
	}

	function calculateTimeRequest() {
		var date = new Date();
		date.setHours(date.getHours() - SettingsService.getHours() + 2);
		return date.toJSON();
	}

	function createInfoWindows(map) {
		var infowindow = new google.maps.InfoWindow();
		var magTranslation;
		$translate('magnitude_msg').then(function(mag) {
			magTranslation = mag;
		}, function(translationId) {});
		$translate('depth_msg').then(function(depth) {
			depthTranslation = depth;
		}, function(translationId) {});
		listenerHandle = map.data.addListener('click', function(event) {
			var date = new Date(event.feature.getProperty("time"));
			var mag = event.feature.getProperty("mag");
			var depth = event.feature.getProperty("depth");
			infowindow.setContent("<div style='width:160px; text-align: left;'>"+date.toDateString() +", "+ date.toLocaleTimeString('en-US',{ hour12: false }) +"<br><b>"+ magTranslation + ":</b> " + mag + " M<br><b>"+depthTranslation+"</b>: "+depth+" km</div>");
			infowindow.setPosition(event.feature.getGeometry().get());
			infowindow.setOptions({
				pixelOffset : new google.maps.Size(0, -5)
			});
			infowindow.open(map);
		});
	}
	
	function blinkRecent(map){
		blinkInterval = $interval(function() {
			recent.forEach(function(feature) {
				map.data.overrideStyle(feature, {visible : on});
			});
			on = !on;
		}, 500);
	}
	
	
	function setIconStyle(map, bounceDate) {
		map.data.setStyle(function(feature) {
			var magnitude = feature.getProperty('mag');
			var featureDate = new Date(feature.getProperty("time"));
			var strokeColor = 'white';
			var color;
			var scale;
			if(magnitude<3){
				color = '#0004FF'; //blue
			}else if(magnitude < 4){
				color = '#FFF300'; //yellow
			}else if(magnitude < 6){
				color = '#FF0000'; //red
			}else{
				color = '#A20404'; //dark red
			}
			if(featureDate > bounceDate){
				recent.push(feature);
				strokeColor = 'black';
			}

			return {
				icon : {
					path: google.maps.SymbolPath.CIRCLE,
			        fillColor: color,
			        fillOpacity: .5,
			        scale: 1.7*magnitude,
			        strokeColor: strokeColor,
			        strokeWeight: .5
				},
				visible: true
			};
		});
	}
	
	function addBoundsListener (map) {
    	google.maps.event.addListener(map, 'bounds_changed', function() {
        	try {
            	vm.currentBounds = map.getBounds();
        	} catch( err ) {
            	alert( err );
        	}
    	});
	}
    
	function createDynamicLatLngBounds(){
		var dynamicBounds = JSON.parse(MapService.getDynamicBounds());
		var ne = new google.maps.LatLng(dynamicBounds.north, dynamicBounds.east);
		var sw = new google.maps.LatLng(dynamicBounds.south, dynamicBounds.west);
		return new google.maps.LatLngBounds(sw, ne);
	}
	
	function fitBounds(map){
		var bounds;
		if(vm.mode == "dynamic"){
    		bounds = createDynamicLatLngBounds();
    		map.fitBounds(bounds);
    	}else{
			var ne = new google.maps.LatLng(41.707, 27.901);
    		var sw = new google.maps.LatLng(33.853, 18.578);
    		bounds = new google.maps.LatLngBounds(sw, ne);
    		map.fitBounds(bounds);
    	}
		if(!rectangle){
			rectangle = new google.maps.Rectangle({
	          strokeColor: '#FF0000',
	          strokeOpacity: 0.4,
	          strokeWeight: 1,
	          fillOpacity: 0,
	          map: map,
	          bounds: bounds
	        });
		}else{
			rectangle.setBounds(bounds);
		}
	}
	
    function updateMode (map) {
    	MapService.setMode(vm.mode);
    	refreshData(map);
    	fitBounds(map);
    }
    
    function initMode(){
    	vm.mode = MapService.getMode();
    }

    function setBounds(map){
    	if(vm.currentBounds){
    		MapService.setDynamicBounds(JSON.stringify(vm.currentBounds));
        	rectangle.setBounds(createDynamicLatLngBounds());
    	}
    	refreshData(map);
    }

}