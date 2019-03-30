
//all week
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

var query2 = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"

//get data
d3.json(url, function(response) {
  createFeatures(response.features);
});


function createFeatures(All_data) {


  // use on each to bind popup info for each  location
  function onEachFeature(feature, layer) {
    layer.bindPopup("<p>" + feature.properties.place +
      "</p><p>" + new Date(feature.properties.time) + "</p>" +
      "<p>Magnitude: " + feature.properties.mag + "</p>");
  }  


  // Create a GeoJSON layer containing the features of each quake location
  var geojsonLayer = L.geoJSON(All_data, {

    onEachFeature: onEachFeature,

    //red (255,0,0)
    //hue (0 - 100) - 0. is red
    pointToLayer: function (feature, latlng) {
      var color;
      var percent = (feature.properties.mag/6)*100;
      var g = percent<20 ? 255 : Math.floor(255-(percent*2-100)*255/100);
      var r = percent> 85 ? 255 : Math.floor((percent*2)*255/100);
      color = 'rgb('+r+','+g+',0)';
      
      var MarkerOptions = {
        radius: 4.5*feature.properties.mag,
        fillColor: color,
        color: "black",
        weight: 1,
        opacity: 1,
        fillOpacity: 1
      };
      return L.circleMarker(latlng, MarkerOptions);
    }
  });

  // Sending our earthquakes layer to the createMap function
  createMap(geojsonLayer);
  
}


function createMap(earthquakes) {

  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });


  function getColor(d) {
      return d < 1 ? 'rgb(0,255,0)' :
            d < 2  ? 'rgb(255,255,0)' :
            d < 3  ? 'rgb(173,255,47)' :
            d < 4  ? 'rgb(173,255,47)' :
            d < 5  ? 'rgb(255,165,0)' :
            d < 6  ? 'rgb(255,69,0)' :
            d < 7  ? 'rgb(255,0,0)' :
                        'rgb(139,0,0)';
  }

  // Create a legend to display information about our map
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'info legend'),
      labels = [1, 2, 3, 4, 5, 6]
      div.innerHTML+='Magnitude<br><hr>'
        for (var i = 0; i < labels.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(labels[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
              labels[i] + (labels[i + 1] ? '&ndash;' + labels[i + 1] + '<br>' : '+');
  }

  return div;
  };
  
  legend.addTo(myMap);
}