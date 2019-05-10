/*
 This is a demo application. It uses jQuery.
 Use it on your on risk. No warranties are made.
 It is intended as a working example on how to use the API.
 */
/*
 Declaration of smhi and functions for retrieval of data in json format
 */
(function (smhi, $, undefined) {

    /*
     The API end point. This is the only hardcoded url.
     All other urls are returned in responses.
     */
    smhi.endPoint = "https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/{lon}/lat/{lat}/data.json";
    
    smhi.forecast = null;
    
	smhi.returnedLatitude = null;
	smhi.returnedLongitude = null;

	smhi.approvedTime = null;
	smhi.referenceTime = null;
	
    smhi.latitude = "58";
    smhi.longitude = "16";
    
	smhi.previousMarker = null;
	smhi.selectedParameter = null;

    /*
     Get the latest forecast - 'callback(forecast)' is called on completion. No error handling!
     */
    smhi.getForecast = function (callback) {

    	var endPoint = smhi.endPoint.replace("{lat}", smhi.latitude).replace("{lon}", smhi.longitude);
    	
    	$.getJSON(endPoint).done(function (forecast) {
    		
    		smhi.forecast = forecast;
    		smhi.returnedLatitude = null;
    		smhi.returnedLongitude = null;
    		smhi.approvedTime = new Date(forecast.approvedTime).toISOString().replace(/[a-zA-Z]/g, ' ').substr(0, 16);
    		smhi.referenceTime = new Date(forecast.referenceTime).toISOString().replace(/[a-zA-Z]/g, ' ').substr(0, 16);
    		
    		callback(forecast);
    	});
    };

}(window.smhi = window.smhi || {}, jQuery));


$(document).ready(function () {

	// create leaflet map and disable interaction
	var southWest = L.latLng(52.500440,2.250475);
	var northEast = L.latLng(70.742227,37.934697);
	bounds = L.latLngBounds(southWest, northEast);

	var map = L.map('map', {
		crs: L.CRS.EPSG900913, 
		zoomControl: false,
		minZoom: 4,
		maxZoom: 9,
		maxBounds: bounds
	}).setView([63, 17], 4);

	map.on('click', function(e) {

		smhi.forecast = null;
		$('#demo-values').html('');
		
		if (smhi.previousMarker != null) {  
			map.removeLayer(smhi.previousMarker);
		}
		
		smhi.latitude = Math.floor(e.latlng.lat * 1000000) / 1000000;
		smhi.longitude = Math.floor(e.latlng.lng * 1000000) / 1000000;
		smhi.previousMarker = L.circleMarker([smhi.latitude, smhi.longitude], { color: 'red' }).setRadius(6);
		
		map.addLayer(smhi.previousMarker);
		
		smhi.getForecast(function (forecast) {
			makeValueTable(smhi.selectedParameter);
		});
	});
	L.control.mousePosition().addTo(map);
	// the map layer
	var background = L.tileLayer.wms("https://opendata-view.smhi.se/wms", {
		layers: 'opendata_default_map_2',
		format: 'image/png',
		transparent: false,
		bgcolor: '#B2D0FD',
		attribution: "copyright 2014 SMHI"
	});
	map.addLayer(background);

	smhi.previousMarker = L.circleMarker([smhi.latitude, smhi.longitude], { color: 'red' }).setRadius(6);
	map.addLayer(smhi.previousMarker);

	// clear previous content
	$('#demo-parameters').html('');
	$('#demo-values').html('');

	$('#input-latitude').val(smhi.latitude);
	$('#input-longitude').val(smhi.longitude);

	// Get the latest forecast
	smhi.getForecast(function (forecast) {

		var firstTimeSerie = smhi.forecast.timeSeries[0];

		var html = '<div class="btn-group-vertical">';

		var first = true;
		
		jQuery.each(firstTimeSerie, function(name, value) {

			if (name != "validTime") {
				
				jQuery.each(value, function(index, param) {
					
					var parameterName = param.name;
					
					if (smhi.selectedParameter == null) {
						smhi.selectedParameter = parameterName;
					}

					html += '<button type="button" class="btn btn-default' + (first ? ' active' : '') + '" data-toggle="tooltip" title="">' + parameterName + '</b> (' + param.levelType + ', ' + param.level + ')</button>';
					first = false;

					var item = $(html);
					var parameter = {parameterName : parameterName};
					// save parameter in tag data for use on click.
					$('button', item).data(parameter);
				});
			}
		});

		html += '<div>';
		var item2 = $(html);
		$('#demo-parameters').append(item2);
		
		$('[data-toggle="tooltip"]').tooltip({
		    'placement': 'right'
		});
		
		makeValueTable();
	});
	
	return false;
});


/*
on click - show data for the parameters when it is clicked.
*/
$(document).on('click', "button.btn", function (e) {
 
	e.preventDefault();

    // clear previous content
	$('#demo-values').html('');
	var buttonText = $(this).text();
	smhi.selectedParameter = buttonText.substr(0, buttonText.indexOf(" "));
	$(this).addClass('active').siblings().removeClass('active');

	makeValueTable();
	
	return false;
});


/*
 helper method for constructing data tables.
 */
function makeValueTable() {
    
	if (smhi.forecast.timeSeries == null) {
        return '<p>No values</p>';
    }
	
	$('#selected-latitude').html(smhi.latitude);
	$('#selected-longitude').html(smhi.longitude);
	$('#returned-latitude').html(smhi.returnedLatitude);
	$('#returned-longitude').html(smhi.returnedLongitude);
	$('#reference-time').html(smhi.referenceTime);
	$('#approved-time').html(smhi.approvedTime);
	
	smhi.returnedLatitude = smhi.forecast.geometry.coordinates[0][1];
	smhi.returnedLongitude = smhi.forecast.geometry.coordinates[0][0];
	
    var html = '<table class="table">';

    for (var i = 0; i < smhi.forecast.timeSeries.length; i++) {

    	var timeSerie = smhi.forecast.timeSeries[i];
    	html += '<tr class="success">';
    	
    	jQuery.each(timeSerie, function(name, value) {
    		
    		if (name == "validTime") {

    			var dateString = new Date(value).toISOString().replace(/[a-zA-Z]/g, ' ').substr(0, 16);
    			html += '<td>' + dateString + '</td>';

    		} else if (name == "parameters") {
    			
    			jQuery.each(value, function(index, param) {

    				if (param.name == smhi.selectedParameter) {
    					// the value itself.
    					html += '<td>' + param.values[0] + '</td></tr>';
    					return false;
    				}
    			});
    		}
    	});
    }
    
	$('#returned-latitude').html(smhi.returnedLatitude);
	$('#returned-longitude').html(smhi.returnedLongitude);

    html += '</table>';
    
    $('#demo-values').html(html);
}