angular
    .module('app')
    .controller('MapCtrl', MapCtrl);

    MapCtrl.inject = ['MapService', 'ngMap', '$window', '$translate', 'SettingsService'];

function MapCtrl(MapService, NgMap, $window, $translate, SettingsService) {
	var vm = this;
	vm.mapHeight = $window.innerHeight - 92 + "px";

	NgMap.getMap().then(function(map) {
		map.data.loadGeoJson(calculateApiUrl(), null, function() {
			createInfoWindows(map);
			setIconStyle(map);
		});
	});

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
		listenerHandle = map.data.addListener('click', function(event) {
			var date = new Date(event.feature.getProperty("time"));
			var mag = event.feature.getProperty("mag");
			infowindow.setContent("<div style='width:150px; text-align: center;'>" + magTranslation + " " + mag + "<br>" + date + "</div>");
			infowindow.setPosition(event.feature.getGeometry().get());
			infowindow.setOptions({
				pixelOffset : new google.maps.Size(0, -5)
			});
			infowindow.open(map);
		});
	}

	function setIconStyle(map) {
		map.data.setStyle(function(feature) {
			var mag = feature.getProperty('mag');
			return {
				icon : {
					path : google.maps.SymbolPath.CIRCLE,
					scale : mag + 2
				}
			};
		});
	}

}