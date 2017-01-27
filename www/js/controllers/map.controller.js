angular
    .module('app')
    .controller('MapCtrl', MapCtrl);

    MapCtrl.inject = ['MapService', 'ngMap', '$window', '$translate', 'SettingsService', '$scope', '$location', '$interval', 'STATIC_BOUNDS', 'SETTINGS', 'ConnectionService'];

function MapCtrl(MapService, NgMap, $window, $translate, SettingsService, $scope, $location, $interval, STATIC_BOUNDS, SETTINGS, ConnectionService) {
	var vm = this;
	vm.mapHeight = 600 - 48.99 + "px";
	console.log(vm.mapHeight);
	vm.refreshData = refreshData;
	vm.setBounds = setBounds;
	var globalMap;
	var fillOpacity = 0.5;
	var blinkInterval;
	var recent = [];
	var rectangle;
	window.L_DISABLE_3D = true;
	
	if(ConnectionService.getConnection()){
		vm.isOnline = true;
		initMap();
	}else{
		vm.isOnline = false;
	}
	addConnectivityListeners();
	
	function initMap() {
		NgMap.getMap().then(function(map) {
//			addAdMob();
			globalMap = map;
			addBoundsListener();
			fitBounds();
			refreshData(true);
			
			$scope.$on('$locationChangeSuccess', function(event) {
				if ($location.url() == '/app/map') {
					setBounds();
				}
			});

		});
	}

	function refreshData(init){
		clearData();
		loadData(init);
	}
	
	function loadData(init) {
		var bounceDate = new Date();
		bounceDate.setHours(bounceDate.getHours() + 2 - 4);
		globalMap.data.loadGeoJson(calculateApiUrl(init), null, function() {
			createInfoWindows();
			setIconStyle(bounceDate);
			blinkRecent();
		});
	}

	function clearData() {
		globalMap.data.forEach(function(feature) {
			globalMap.data.remove(feature);
		});
		recent = [];
		$interval.cancel(blinkInterval);
		blinkInterval = undefined;
		google.maps.event.clearListeners(globalMap.data, 'click');
	}
	
	function calculateApiUrl(init) {
		var startTime = calculateTimeRequest();
		var apiUrl;
		if(!init && MapService.getDynamicBounds()){
			var dynamicBounds = JSON.parse(MapService.getDynamicBounds());
			apiUrl = 'https://cors-anywhere.herokuapp.com/http://www.seismicportal.eu/fdsnws/event/1/query?limit='+SETTINGS.MARKERS_LIMIT+'&start=' + startTime + '&minlat='+dynamicBounds.south+'&maxlat='+dynamicBounds.north+'&minlon='+dynamicBounds.west+'&maxlon='+dynamicBounds.east+'&minmag=' + SettingsService.getRange() + '&format=json';
		}else{
			apiUrl = 'https://cors-anywhere.herokuapp.com/http://www.seismicportal.eu/fdsnws/event/1/query?limit='+SETTINGS.MARKERS_LIMIT+'&start=' + startTime + '&minlat='+STATIC_BOUNDS.SOUTH+'&maxlat='+STATIC_BOUNDS.NORTH+'&minlon='+STATIC_BOUNDS.WEST+'&maxlon='+STATIC_BOUNDS.EAST+'&minmag=' + SettingsService.getRange() + '&format=json';
		}
		return apiUrl;
	}

	function calculateTimeRequest() {
		var date = new Date();
		date.setHours(date.getHours() - SettingsService.getHours() + 2);
		return date.toJSON();
	}

	function createInfoWindows() {
		var infowindow = new google.maps.InfoWindow();
		var magTranslation;
		$translate('magnitude_msg').then(function(mag) {
			magTranslation = mag;
		}, function(translationId) {});
		$translate('depth_msg').then(function(depth) {
			depthTranslation = depth;
		}, function(translationId) {});
		listenerHandle = globalMap.data.addListener('click', function(event) {
			var date = new Date(event.feature.getProperty("time"));
			var mag = event.feature.getProperty("mag");
			var depth = event.feature.getProperty("depth");
			infowindow.setContent("<div style='width:160px; text-align: left;'>"+date.toDateString() +", "+ date.toLocaleTimeString('en-US',{ hour12: false }) +"<br><b>"+ magTranslation + ":</b> " + mag + " M<br><b>"+depthTranslation+"</b>: "+depth+" km</div>");
			infowindow.setPosition(event.feature.getGeometry().get());
			infowindow.setOptions({
				pixelOffset : new google.maps.Size(0, -5)
			});
			infowindow.open(globalMap);
		});
	}
	
	function blinkRecent(){
		blinkInterval = $interval(function() {
			recent.forEach(function(feature) {
				globalMap.data.overrideStyle(feature, {
					icon : {
						path: google.maps.SymbolPath.CIRCLE,
				        fillColor: (feature.getProperty('mag')<3?'#0004FF':(feature.getProperty('mag')<4?'#FFF300':(feature.getProperty('mag')<6?'#FF0000':'#A20404'))),
				        fillOpacity: fillOpacity,
				        scale: 1.7*feature.getProperty('mag'),
				        strokeColor: 'black',
				        strokeWeight: fillOpacity
					}
				});
			});
			if(fillOpacity == 0.5){
				fillOpacity = 0;
			}else{
				fillOpacity = 0.5;
			}
		}, 500);
	}
	
	
	function setIconStyle(bounceDate) {
		globalMap.data.setStyle(function(feature) {
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
	
	function addBoundsListener () {
    	google.maps.event.addListener(globalMap, 'bounds_changed', function() {
        	try {
            	vm.currentBounds = globalMap.getBounds();
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
	
	function fitBounds(){
		var ne = new google.maps.LatLng(STATIC_BOUNDS.NORTH, STATIC_BOUNDS.EAST);
    	var sw = new google.maps.LatLng(STATIC_BOUNDS.SOUTH, STATIC_BOUNDS.WEST);
    	var bounds = new google.maps.LatLngBounds(sw, ne);
    	globalMap.fitBounds(bounds);
		globalMap.setZoom(globalMap.getZoom()+1);
		drawRectangle(bounds);
	}
	
	function drawRectangle(bounds){
		if(!rectangle){
			rectangle = new google.maps.Rectangle({
	          strokeColor: '#FF0000',
	          strokeOpacity: 0.4,
	          strokeWeight: 1,
	          fillOpacity: 0,
	          map: globalMap,
	          bounds: bounds
	        });
		}else{
			rectangle.setBounds(bounds);
		}
	}

    function setBounds(){
    	if(vm.currentBounds){
    		MapService.setDynamicBounds(JSON.stringify(vm.currentBounds));
    		drawRectangle(createDynamicLatLngBounds());
    	}
    	refreshData(false);
    }

	function onOffline(){
		vm.isOnline = false;
	}
	
	function onOnline(){
		vm.isOnline = true;
        refreshData(false);
	}
    
    function addConnectivityListeners() {
    	window.addEventListener("online", onOnline, false);
    	window.addEventListener("offline", onOffline, false);
    }
    
	function addAdMob(){
		if(AdMob){
			AdMob.createBanner({
				adId: 'ca-app-pub-4306883957951881/4263180858', 
				isTesting: true,
				position: AdMob.AD_POSITION.TOP_CENTER,
				autoShow: true,
				success: function(){
					vm.mapHeight = $window.innerHeight - 98.99 + "px";
			  }
			});
		}
	}
}