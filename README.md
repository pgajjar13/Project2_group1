# Project2_group1
Understanding Bicycle Theft Patterns in Toronto

# Overview
This code is designed to interact with an SQLite database containing information about stolen bicycle in Toronto. It provides functionality to load the database from a file, execute custom SQL queries, and visualize the data on a map.

# Details - Sanjeev

- cleaned the data using Pandas 
    - Downloaded the data from the Toronto Police open data (https://data.torontopolice.on.ca/pages/open-data)

- loaded it to a database (SQLite)

- Created a Flask API
    - different routes in the flask app
        - /data, the sqllite data base was loaded
        - /hood, the geojson file we downloaded
        - /, the main home page

- Once the app.py is run through the terminal, the website should pop-up under local host
http://localhost:5000/

## Charts - Sughra 
 using d3 we created three different charts (logic2.js)
- Line Chart
  "Bike Stolen - By day of the week",
  
- Bar Chart
  "Bike Stolen - By Month"
  
- Bubble Charts
  "Bike Stolen - By Years"

### Loading Database - Jihye

1. Include the logic.js file in your HTML file.
2. Make sure you have an input element with the id `select-file`, which allows users to select the SQLite file.
3. When a file is selected, the code will load its content and initialize the SQLite database.

```html
<input type="file" id="select-file">
```

### Executing Custom Queries

1. Add an input element with the id `query-statement` to provide custom SQL queries.
2. Use a button (with the id `make-query`) to trigger the execution of the query.

```html
<input type="text" id="query-statement">
<button id="make-query">Execute Query</button>
```
``` let queryButton = document.getElementById('make-query');
    queryButton.addEventListener('click', function() {
        let queryStatement = document.getElementById('query-statement').value;
        console.log("Executing: ", queryStatement)
        const result = db.exec(queryStatement);
        console.log(result[0].values.slice(0,10));
    });

```
```let makeMapButton = document.getElementById('visualize');
    makeMapButton.addEventListener('click', function() {
        // Your own logic to fetch data from SQLite
        const result = db.exec(`
SELECT info.NEIGHBOURHOOD_158, count(info.NEIGHBOURHOOD_158), latlnginfo.LONG_WGS84, latlnginfo.LAT_WGS84
FROM info
INNER JOIN (
    SELECT min(NEIGHBOURHOOD_158) as NEIGHBOURHOOD, LONG_WGS84, LAT_WGS84
    FROM info
    WHERE STATUS = 'STOLEN'
    GROUP BY NEIGHBOURHOOD_158
) latlnginfo ON info.NEIGHBOURHOOD_158= latlnginfo.NEIGHBOURHOOD
WHERE STATUS = 'STOLEN'
GROUP BY NEIGHBOURHOOD_158;
`);
        ```

### Visualizing Data on a Map
 Create an HTML element (e.g., `<div id="map"></div>`) where the map will be displayed.

```html
<button id="visualize">Visualize Data</button>
<div id="map"></div>
```
```
let myMap = L.map("map", {
        center: [43.65 , -79.38],
        zoom: 12
        });
```
### ADD A TILE LAYER
```
 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(myMap);
```
## circles assign colors based on the count of stolen bikes
```
result[0].values.forEach(function(item){
            // console.log(item);
            let neighbourhood = item[0];
            let stolenCount = item[1];
            let lat = item[3]
            let lng = item[2]
            L.circle([lat, lng], {
                radius: Math.log(stolenCount)*60,
                color: "black",
                weight: 0.3,
                fillColor: getColor(stolenCount),
                fillOpacity: 1,
            }).bindPopup(`<h1>${neighbourhood}</h1> <hr> <h3>Stolen count: ${stolenCount}</h3>`).addTo(myMap);
        });
        ```

### Color Legend

The code provides a color legend to represent different ranges of stolen bikes counts. The legend will be displayed in the bottom-right corner of the map.
```
var legend = L.control({position: 'bottomright'});

        legend.onAdd = function (myMap) {

            var div = L.DomUtil.create('div', 'info legend'),
                grades = [0,51,151,501,751,1001],
                labels = [];

            // loop through our density intervals and generate a label with a colored square for each interval
            for (var i = 0; i < grades.length; i++) {
                currentSegment = grades[i];
                nextSegment = grades[i + 1]
                endingNumber = nextSegment ? nextSegment - 1 : 0;
                console.log(currentSegment, nextSegment, endingNumber);
                div.innerHTML +=
                    '<i style="background:' + getColor(currentSegment) + '"></i> ' +
                    currentSegment + (nextSegment ? '&ndash;' + endingNumber + '<br>' : '+');
            }

            return div;
        };

        legend.addTo(myMap);
    });
}


function getColor(count) {
    if (count <= 50) {
        return "#9bf541"
    } else if (count <= 150) {
        return "#dcf238"
        ```

## Dependencies

- This code relies on the [Leaflet](https://leafletjs.com/) library for map visualization.
- It also utilizes [SQL.js](https://github.com/sql-js/sql.js) for working with SQLite databases in the browser.

## Additional Information

- The database should have a table named `info` with columns `STATUS`, `NEIGHBOURHOOD_158`, `LONG_WGS84`, and `LAT_WGS84`.
- The `getStatus` function is used to assign colors based on the count of stolen bikes.

