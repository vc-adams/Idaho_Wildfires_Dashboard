
var map = L.map('map').setView([37.8, -96], 4);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + API_KEY, {
    id: 'mapbox/light-v9',
    attribution: '',
    tileSize: 512,
    zoomOffset: -1
}).addTo(map);

L.geoJson(idahoData,{style: style}).addTo(map);


var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>'+ 'County Information' +'</h4>' + '<h3>' + (props ?
        '<b>' + props.NAME + '</b><br /></h3>' + 'County FIPS:   ' + props.CNTY_FIPS  + '<br />'
        + 'Sq Mi.'+ props.SQMI + 'sq. mi.'
        : 'Hover over a state');
};

info.addTo(map);


var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        sqmi = [0, 500, 1000, 2000, 4000, 6000, 8000, 10000],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < sqmi.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(sqmi[i] + 1) + '"></i> ' +
            sqmi[i] + (sqmi[i + 1] ? '&ndash;' + sqmi[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);


optionChanged()

function optionChanged(){
    d3.json('static/data/Idaho_Counties_Centroids.geojson').then(function(response){ 

        var features = response.features

        console.log(features)

        var name = features.map(function(d){
            return d.properties.NAME
        })

        var sortedName = name.sort()

        console.log("name sorted", sortedName)

        d3.select("#County")
                .selectAll("option")
                .data(sortedName)
                .enter()
                .append("option")
                .html(function(d) {
                    return `${d}`;
                });
                

        //Grab the dropdown value and save it to a variable
        var sel = document.getElementById('County');
        var sel_val = sel.options[sel.selectedIndex].value
        console.log(sel_val)

        var unsortedName = features.map(function(d){
            return d.properties.NAME
        })
        console.log("unsorted", unsortedName)



        var pop = features.map(function(d){
            return d.properties.POPULATION
        });

        console.log("Population", pop)

        
        var countyFiltered = features.filter(function(data) {
            return data.properties.NAME === sel_val;
        });

        console.log("county filtered", countyFiltered)

        var coords = countyFiltered.map(function(d){
            return d.geometry.coordinates
        });

        console.log("coords", coords)

        long = coords[0][0]
        lat =  coords[0][1]

        console.log("lat,long", lat, long)

        map.flyTo([lat, long], 8)

        d3.select("#myBarChart").remove()

        var age = countyFiltered.map(function(d){
            return [d.properties.AGE_UNDER5,
                d.properties.AGE_5_9, 
                d.properties.AGE_10_14,
                d.properties.AGE_15_19,
                d.properties.AGE_20_24,
                d.properties.AGE_25_34,
                d.properties.AGE_35_44,
                d.properties.AGE_45_54,
                d.properties.AGE_55_64,
                d.properties.AGE_65_74,
                d.properties.AGE_75_84,
                d.properties.AGE_85_UP                            
            ]

        });

        var ageLabels = ['Age Unders', 'Age 5-9', 'Age 10-14', 'Age 15-19', 'Age 20-24',
                'Age 25-34', 'Age 35-44', 'Age 45-54', 'Age 55-64', 'Age 65-74',
                'Age 75-84', 'Age 85+' 
            ]

        console.log("age", age)

        //Add the canvas back to the html
		d3.select("#canvasBarChart")
		.append("canvas")
		.attr("id", "myBarChart")
		

		//Create the bar chart for state totals
		var ctx = document.getElementById('myBarChart').getContext('2d');
		var myBarchart = new Chart(ctx, {
			// The type of chart we want to create
			type: 'bar',

			// The data for our dataset
			data: {
				labels: ageLabels,
				datasets: [{
					label: `Age Demographics - ${sel_val}`,
					backgroundColor: '#e0ecf4',
					borderColor: '#e0ecf4',
					data: age[0]
				}]
			},

			// Configuration options go here
			options: {scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true
					}
				}]
			}}
        });
        

        d3.select("#myBarChart2").remove()

        var race = countyFiltered.map(function(d){
            return [d.properties.WHITE,
                d.properties.BLACK, 
                d.properties.AMERI_ES,
                d.properties.ASIAN,
                d.properties.HAWN_PI,
                d.properties.HISPANIC,
                d.properties.OTHER,
                d.properties.MULT_RACE                            
            ]

        });

        var raceLabels = ['White' , 'Black', 'Native American', 'Asian', 'Pacific Islander',
                'Hispanic', 'Other', 'Multi-Race'
            ]

        console.log("race", race)

        //Add the canvas back to the html
		d3.select("#canvasBarChart2")
		.append("canvas")
		.attr("id", "myBarChart2")
		

		//Create the bar chart for state totals
		var ctx = document.getElementById('myBarChart2').getContext('2d');
		var myBarchart = new Chart(ctx, {
			// The type of chart we want to create
			type: 'bar',

			// The data for our dataset
			data: {
				labels: raceLabels,
				datasets: [{
					label: `Race Demographics - ${sel_val}`,
					backgroundColor: '#9ebcda',
					borderColor: '#9ebcda',
					data: race[0]
				}]
			},

			// Configuration options go here
			options: {scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true
					}
				}]
			}}
		});


        d3.select("#myBarChart3").remove()

        var crops = countyFiltered.map(function(d){
            return [
                d.properties.NO_FARMS12,
                d.properties.AVE_SIZE12,
                d.properties.CROP_ACR12,                       
            ]

        });

        var cropsLabels = ['Number of Farms' , 'Average Farm Size', 'Total Crop Average'
            ]

        console.log("crops", cropsLabels)

        //Add the canvas back to the html
		d3.select("#canvasBarChart3")
		.append("canvas")
		.attr("id", "myBarChart3")
		

		//Create the bar chart for state totals
		var ctx = document.getElementById('myBarChart3').getContext('2d');
		var myBarchart = new Chart(ctx, {
			// The type of chart we want to create
			type: 'bar',

			// The data for our dataset
			data: {
				labels: cropsLabels,
				datasets: [{
					label: `Farm and Crop Information  - ${sel_val}`,
					backgroundColor: '#8c6bb1',
					borderColor: '#8c6bb1',
					data: crops[0]
				}]
			},

			// Configuration options go here
			options: {scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true
					}
				}]
			}}
		});


        d3.select("#myBarChart4").remove()

        var households = countyFiltered.map(function(d){
            return [
                d.properties.HSE_UNITS,
                d.properties.VACANT,
                d.properties.OWNER_OCC,
                d.properties.RENTER_OCC,                       
            ]

        });

        var householdsLabels = ['Housing Units' , 'Vacant Units', 'Owner Occupied', 'Renter Occupied'
            ]

        console.log("households", householdsLabels)

        //Add the canvas back to the html
		d3.select("#canvasBarChart4")
		.append("canvas")
		.attr("id", "myBarChart4")
		

		//Create the bar chart for state totals
		var ctx = document.getElementById('myBarChart4').getContext('2d');
		var myBarchart = new Chart(ctx, {
			// The type of chart we want to create
			type: 'bar',

			// The data for our dataset
			data: {
				labels: householdsLabels,
				datasets: [{
					label: `Household Information - ${sel_val}`,
					backgroundColor: '#810f7c',
					borderColor: '#810f7c',
					data: households[0]
				}]
			},

			// Configuration options go here
			options: {scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true
					}
				}]
			}}
		});




        // var data = [{
        //     type: "choroplethmapbox", locations: ["NY", "MA", "VT"], z: [-50, -10, -20],
        //     geojson: "https://raw.githubusercontent.com/python-visualization/folium/master/examples/data/us-states.json"
        //   }];
          
        //   var layout = {mapbox: {center: {lon: -74, lat: 43}, zoom: 3.5},
        //                 width: 600, height:400};
          
        //   var config = {mapboxAccessToken: "your access token"};
          
        //   Plotly.newPlot('myDiv', data, layout, config);


        // var data = [{
        //     type: "choroplethmapbox", locations: unsortedName, z: pop,
        //     colorscale: "Hot", 
        //     reversescale: true,
        //     marker: {opacity: 1},
        //     geojson: "static/data/Idaho_Counties.geojson"
        // }];
        
        // var layout = {mapbox: {center: {lon: long, lat: lat}, 
        //                 style: 'light',
        //                 zoom: 5 },
        //                 width: 600, height:400,
        //                 margin: {
        //                     l: 5,
        //                     r: 5,
        //                     b: 15,
        //                     t: 15,
        //                     pad: 4
        //                   }
        //                 };
    
        // var config = {mapboxAccessToken: API_KEY};
        
        // Plotly.newPlot('myDiv', data, layout, config);

        // var statefiltered = features.filter(function(data) {
        //     return data.properties.STATE === '16';
        // });
    
        // console.log(statefiltered)

        // var abbr = statefiltered.map(function(d){
        //     return d.properties.NAME
        // })

        // console.log(abbr)

        // d3.select("#selDataset")
        // 		.selectAll("option")
        // 		.data(abbr)
        // 		.enter()
        // 		.append("option")
        // 		.html(function(d) {
        // 			return `${d}`;
        // 		});

        // var idahoCounties = response(function(data) {
        //     return data.properties.STATE ;
        // });

        // console.log("idaho counties", idahoCounties)
    })   
}
// //Unique function
// function onlyUnique(value,index, self) {
// 	return self.indexOf(value) === index;	
// }

function getColor(d) {
    return d > 10000 ? '#4d004b' :
           d > 8000 ? '#810f7c' :
           d > 6000 ? '#8c6bb1' :
           d > 4000  ? '#8c96c6' :
           d > 2000  ? '#9ebcda' :
           d > 1000  ? '#bfd3e6' :
           d > 500   ? '#e0ecf4' :
                      '#f7fcfd';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.POPULATION),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    info.update(layer.feature.properties);
}

var geojson;

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

geojson = L.geoJson(idahoData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);



