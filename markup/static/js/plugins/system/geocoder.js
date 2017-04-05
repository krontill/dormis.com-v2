var user_address_autocomplete;
var geocoder = null;
var property_map;
var property_marker;
var property_circle;

function draw_map() {
    var marker_lat = 0,
        marker_lng = 0;

    if ((document.getElementById('property_longitude').value !== "0.0000") && (document.getElementById('property_latitude').value !== "0.0000")) {
        marker_lat = parseFloat(document.getElementById('property_latitude').value);
        marker_lng = parseFloat(document.getElementById('property_longitude').value);
    }

    var circle_lat = marker_lat;
    var circle_lng = marker_lng;

    property_map = new google.maps.Map( document.getElementById('flat-map-canvas'), {
        center: {lat: circle_lat, lng: circle_lng},
        zoom: 18
    });
    property_marker = new google.maps.Marker({
        position: {lat: marker_lat, lng: marker_lng},
        map: property_map,
        draggable: true

    });
    property_marker.addListener('dragend', changeCoord);

    property_circle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 1,
        fillOpacity: 0,
        map: property_map,
        center: {lat: circle_lat, lng: circle_lng },
        radius: 100
    });
}

function changeCoord(data) {
    var bounds = property_circle.getBounds();
    if(bounds.contains(data.latLng)) {
        $('#property_latitude').val(data.latLng.lat());
        $('#property_longitude').val(data.latLng.lng());
    } else {
        var pos = new google.maps.LatLng($('#property_latitude').val(), $('#property_longitude').val());
        property_marker.setPosition(pos);
    }
}

function geocodeAddress(geocoder, map) {
    var address = document.getElementById('property_address').value;
    geocoder.geocode({'address': address}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            var place_object = results[0].geometry.location;
            map.setCenter(place_object);

            document.getElementById('property_latitude').value = place_object.lat();
            document.getElementById('property_longitude').value = place_object.lng();

            property_marker.setPosition(place_object);
            property_circle.setCenter(place_object);
        } else {
            system_alert(translate.ALERT_PROPERTY_INVALID_ADDRESS);
        }
    });
}

function initialize() {
    var user_address_input = (document.getElementById('property_address'));
    user_address_autocomplete = new google.maps.places.Autocomplete(user_address_input);
    var user_address_info_window = new google.maps.InfoWindow();

    user_address_autocomplete.addListener('place_changed', function() {
        user_address_info_window.close();
        var place = user_address_autocomplete.getPlace();
        if (!place.geometry) {
            window.alert("Autocomplete's returned place contains no geometry");
            return;
        }

        $('#property_latitude').val(place.geometry.location.lat());
        $('#property_longitude').val(place.geometry.location.lng());

        if (document.getElementById('flat-map-canvas-hide').style.display == "none") {
            document.getElementById('flat-map-canvas-hide').style.display = "block";
            google.maps.event.trigger(property_map, 'resize');
        }

        property_map.setCenter(place.geometry.location);
        property_map.setZoom(18);

        property_marker.setPosition(place.geometry.location);
        property_circle.setCenter(place.geometry.location);
    });

    if ((document.getElementById('property_longitude').value !== "0.0000") && (document.getElementById('property_latitude').value !== "0.0000")) {
        document.getElementById('flat-map-canvas-hide').style.display = "block";
        var map = document.getElementById('flat-map-canvas');
        google.maps.event.trigger(map, 'resize');
    }

    draw_map();
    geocoder = new google.maps.Geocoder();
}