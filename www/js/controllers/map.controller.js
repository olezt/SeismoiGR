angular
    .module('app')
    .controller('MapCtrl', MapCtrl);

    MapCtrl.inject = ['MapService', 'ngMap', '$window', '$translate', 'SettingsService'];

function MapCtrl(MapService, NgMap, $window, $translate, SettingsService) {
	var vm = this;
	vm.mapHeight = $window.innerHeight - 92 + "px";

	NgMap.getMap().then(function(map) {
		loadData(map);
		var refreshDiv = document.createElement('div');
        var centerControl = new CenterControl(refreshDiv, map);

        refreshDiv.index = 1;
        map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(refreshDiv);
	});
	
	
	function loadData(map) {
		map.data.loadGeoJson(calculateApiUrl(), null, function() {
			createInfoWindows(map);
			setIconStyle(map);
		});
	}

	function clearData(map) {
		map.data.forEach(function(feature) {
		    map.data.remove(feature);
		});
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
//		var magTranslation;
//		$translate('magnitude_msg').then(function(mag) {
//			magTranslation = mag;
//		}, function(translationId) {});
		$translate('depth_msg').then(function(depth) {
			depthTranslation = depth;
		}, function(translationId) {});
		listenerHandle = map.data.addListener('click', function(event) {
			var date = new Date(event.feature.getProperty("time"));
			var mag = event.feature.getProperty("mag");
			var depth = event.feature.getProperty("depth");
			infowindow.setContent("<div style='width:150px; text-align: left;'><b>" + mag + " M<br>"+date.toDateString() +", "+ date.toLocaleTimeString() +"</b><br><br>" +
					"<b>"+depthTranslation+"</b>: "+depth+"</div>");
			infowindow.setPosition(event.feature.getGeometry().get());
			infowindow.setOptions({
				pixelOffset : new google.maps.Size(0, -5)
			});
			infowindow.open(map);
		});
	}

	function setIconStyle(map) {
		map.data.setStyle(function(feature) {
			var magnitude = feature.getProperty('mag');
			var color;
			if(magnitude<3){
				color = 'blue';
			}else if(magnitude<4){
				color = 'yellow';
			}else {
				color = 'red';
			}
			return {
				icon : {
					path: google.maps.SymbolPath.CIRCLE,
			        fillColor: color,
			        fillOpacity: .5,
			        scale: Math.pow(2, magnitude) / 1.7,
			        strokeColor: 'white',
			        strokeWeight: .5
				}
			};
		});
	}
	
    function CenterControl(controlDiv, map) {

        // Set CSS for the control border.
        var controlUI = document.createElement('div');
        controlUI.style.backgroundColor = '#fff';
        controlUI.style.border = '2px solid #fff';
        controlUI.style.borderRadius = '3px';
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginBottom = '22px';
        controlUI.style.textAlign = 'center';
        controlUI.style.marginRight = '10px';
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior.
        var controlText = document.createElement('div');
        controlText.style.color = 'rgb(25,25,25)';
        controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText.style.fontSize = '16px';
        controlText.style.lineHeight = '25px';
        controlText.style.paddingLeft = '5px';
        controlText.style.paddingRight = '5px';
        controlText.innerHTML = '<i class = "icon icon ion-refresh"></i>';
        controlUI.appendChild(controlText);

        // Setup the click event listeners: simply set the map to Chicago.
        controlUI.addEventListener('click', function() {
        	clearData(map);
        	loadData(map);
        });

      }
}