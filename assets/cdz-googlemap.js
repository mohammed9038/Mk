/*============= Cdz Google Map ==============*/
$.widget('codazon.googleMap', {
	options: {
		mapLat: 45.6107667,
		mapLong: -73.6108024,
		mapZoom: 10,
		mapAddress: 'Demo0321',
		markerTitle: 'Infinit',
		jsSource: '//maps.googleapis.com/maps/api/js?v=3.31&key=',
		apiKey: 'AIzaSyDK5UahtlWXSFx4SHa1dW_dQmkPSf2YLfM'
	},
	_create: function(){
		var self  = this, config = this.options;
		var additionalMarkers = [];
		$('.googleMapWrapper .data-additionalMarkers').each(function(){
			var addTitle = $(this).attr('data-title');
			var addAddress = $(this).attr('data-add');
			var addLat = $(this).attr('data-lat');
			var addLong = $(this).attr('data-long');
			additionalMarkers.push({
					title: addTitle,
					address: addAddress,
					latitude: addLat,
					longitude: addLong
			});
		});
		$(this.element).parents('.google-map-wrap').first().css("padding-bottom" , config.map_ratio*100 + "%");
		var require = function(jsSource, handler) {
			var $jsMap = $('#google_maps_script');
			if ($jsMap.length == 0) {
				var googlecript = document.createElement('script');
				googlecript.id = 'google_maps_script';
				googlecript.type = 'text/javascript';
				googlecript.src = config.jsSource + config.apiKey;
				$(googlecript).load(function () {
					handler();
					$(this).data('completed', true);
				});
				document.head.appendChild(googlecript);
			} else {
				if ($jsMap.data('completed')) {
					handler();
				} else {
					$jsMap.load(function () {
						handler();
					});
				}
			}
		}		
		require(config.jsSource, function(){
			var myLatlng = new google.maps.LatLng(config.mapLat, config.mapLong);
			var mapOptions = {
				zoom: config.mapZoom,
				center: myLatlng,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			var map = null;
			function createMap(){
				var map = new google.maps.Map(self.element.get(0), mapOptions);
				var markers = [];
				markers.push({
					title: config.markerTitle,
					address: config.mapAddress,
					latitude: config.mapLat,
					longitude: config.mapLong
				});
	
				google.maps.event.addListenerOnce(map, 'idle', function(){});

				if (typeof additionalMarkers == 'object') {
					if (additionalMarkers.length) {
						$.each(additionalMarkers, function(i, location) {
							markers.push(location);
						});
					}
				}
				
				var infowindow = new google.maps.InfoWindow();
				$.each(markers, function(i, location) {
					var marker = new google.maps.Marker({
						position: new google.maps.LatLng(parseFloat(location.latitude), parseFloat(location.longitude)),
						map: map,
						title: location.title
					});
					google.maps.event.addListener(marker, 'click', function() {
						infowindow.setContent(location.address);
						infowindow.open(map, marker);
					});
				});
				
				return map;
			}			
			map = createMap();
		});
	}
});