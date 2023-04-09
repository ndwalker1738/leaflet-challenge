var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryUrl).then(function (data) {
    createFeatures(data.features);
});

function createFeatures(quakeData) {
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3> Where: " + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<br><h2> Magnitude: " + feature.properties.mag + "</h2>");
    }

    function createCircleMarker(feature, latlog) {
        let options = {
            radius: feature.properties.mag * 5,
            fillColor: chooseColor(feature.properties.mag),
            color: choose(feature.properties.mag),
            weight: 1
        opacity: 0.8,
            fill0pacity: 0.35
        }
        return L.circleMaker(latlog, options);
    }

    let quakes = L.geoJSON(quakeData, {
        onEachFeature: onEachFeature
        pointToLayer: createCircleMarker
    });

    createMap(quakes);
}

function chooseColor(mag) {
    switch (true) {
        case (1.0 <= mag && mag <= 2.5):
            return "#0071BC";
        case (2.5 <= mag && mag <= 4.0):
            return "#35BC00";
        case (4.0 <= mag && mag <= 5.5):
            return "#BCBC00";
        case (5.5 <= mag && mag <= 8.0):
            return "#BC3500";
        case (8.0 <= mag && mag <= 20.0):
            return "#BC0000";
        default:
            return "#E2FFAE";
    }
}


let legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
    let div = L.DomUtil.create('div', 'info legend'),
        grades = [1.0, 2.5, 4.0, 5.5, 8.0],
        labels = [];


    for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + chooseColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
};

