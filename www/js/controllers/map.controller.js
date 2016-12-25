angular
    .module('app')
    .controller('MapCtrl', MapCtrl);

    MapCtrl.inject = ['MapService', 'ngMap', '$window', '$translate', 'SettingsService', '$scope', '$location', '$interval'];

function MapCtrl(MapService, NgMap, $window, $translate, SettingsService, $scope, $location, $interval) {
	var vm = this;
	vm.mapHeight = $window.innerHeight - 92 + "px";
	vm.refreshData = refreshData;
	var on = true;
	var blinkInterval;
	var recent = [];
	
	NgMap.getMap().then(function(map) {
		loadData(map);
        
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
		var apiUrl = 'http://www.seismicportal.eu/fdsnws/event/1/query?limit=1000&start=' + startTime + '&minlat=33.853&maxlat=41.707&minlon=18.578&maxlon=27.901&minmag=' + SettingsService.getRange() + '&format=json';
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
			if(magnitude<3){
				color = 'blue';
			}else if(magnitude<4){
				color = 'yellow';
			}else {
				color = 'red';
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
			        scale: Math.pow(2, magnitude) / 1.7,
			        strokeColor: strokeColor,
			        strokeWeight: .5
				},
				visible: true
			};
		});
	}

}