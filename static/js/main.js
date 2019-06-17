var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


d3.json(url).then(function(response){
    console.log(response);


    // [{}, {}, {}, ...]
    features = response.features;
    // console.log(features);

    var lng = features.map(function(feature){
        return feature.geometry.coordinates[0]
    })
    var lat = features.map(function(feature){
        return feature.geometry.coordinates[1]
    })

    // Plot using lat and lng.
    var myMap = L.map("map").setView([34.046667, -117.50], 3);
    
    L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.satellite",
      accessToken: api_key
    }).addTo(myMap);
    
    
    // features.forEach(function(feature){
    //     // note coord[0] = longitude
    //     L.marker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]])
    //         .addTo(myMap);
    // });

    
    L.geoJSON(features, {
        onEachFeature: function(feature,layer){
			layer.bindPopup(`<h4>Magnitude: ${feature.properties.mag}</h4>
				<h4 style="color:${getColor(feature.properties.mag)}";>Location: ${feature.properties.place}</h4>\
				<hr><p>${new Date(feature.properties.time)}</p>`);
		},
		pointToLayer:function(feature,latlng){
			return new L.circle(latlng,{
				radius: getRadius(feature.properties.mag),
				fillColor: getColor(feature.properties.mag),
				fillOpacity:.6,
				stroke:false,
			}).addTo(myMap)
    }})

    // ------------------ Legend
    var legend = L.control({ position: "topright" });
      legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var limits = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
        var labelsColor = [];
        var labelsText = [];
  
        // Add min & max
        limits.forEach(function(limit, index) {
          labelsColor.push(`<li style="background-color: ${getColor(index)};"></li>`)
          labelsText.push(`<span class="legend-label">${limits[index]}</span>`)
        });
  
        var labelsColorHtml =  "<ul>" + labelsColor.join("") + "</ul>";
        var labelsTextHtml = `<div id="labels-text">${labelsText.join("<br>")}</div>`;
  
        var legendInfo = "<h4>Earthquake<br>Magnitude</h4>" +
          "<div class=\"labels\">" + labelsColorHtml + labelsTextHtml
          "</div>";
        div.innerHTML = legendInfo;
  
        return div;
      };
  
      // Adding legend to the map
      legend.addTo(myMap);

}); // ------------------------- End of d3.json(url)

function oef(feature, layer){
    layer.bindPopup(feature.properties.place)
};
function getColor(d){
    // ? => conditional operator.

    // if d > 5 assign "ff0000" otherwise move-on --> next if d>4 assign color after "?" and so on.
    return d > 5 ? "#FF4333":
    d  > 4 ? "#FF7933":
    d > 3 ? "#FFA633":
    d > 2 ? "#C0FF33":
    d > 1 ? "#7AFF33":
             "#90ee90"; // default.
  }
  
  function getRadius(value){
      return value*25000 //scaling.
  }


