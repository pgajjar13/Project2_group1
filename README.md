# Project2_group1
Understanding Bicycle Theft Patterns in Toronto

# Members of the Group 
Sanjeev Chiplunkar
Sughra Shdab
Priyanshi Gajjar
Jihye Yoon

# Overview
This code is designed to interact with an SQLite database containing information about stolen bicycle in Toronto. It provides functionality to load the database from a file, execute custom SQL queries, and visualize the data on a map.

# Steps

1. Obtaining the Data: The database is sourced from the Toronto Police open data, which can be found here.

2. Loading the Database: The following steps outline how to load the database:
        (i) Include the logic.js file in your HTML file.
        (ii) Ensure you have an input element with the ID select-file to allow users to select the SQLite file.

'''HTML
    <input type="file" id="select-file">


3. Executing Custom Queries: If you need to run custom SQL queries, follow these steps:
    (i) Add an input element with the ID query-statement to provide custom SQL queries.
    (ii) Use a button with the ID make-query to execute the query.

```html
<input type="text" id="query-statement">
<button id="make-query">Execute Query</button>
```

'''Javascript

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

4.  Visualizing Data on a Map: To visualize the data on a map, follow these steps:
        (i) Create an HTML element (e.g., <div id="map"></div>) where the map will be displayed.

```html
<button id="visualize">Visualize Data</button>
<div id="map"></div>
```
```
javascript
''
let myMap = L.map("map", {
        center: [43.65 , -79.38],
        zoom: 12
        });
```


5. Add a Tile Layer

```
javascript
''
 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(myMap);
```
6. Circles with Color-Coding: The code below assigns colors to circles based on the count of stolen bikes.

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

7. Color Legend: The code also provides a color legend to represent different ranges of stolen bike counts, displayed in the bottom-right corner of the map.
```
javascript
'''
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

8. Additional Information: Make sure your database includes a table named info with columns STATUS, NEIGHBOURHOOD_158, LONG_WGS84, and LAT_WGS84. The getStatus function is used to assign colors based on the count of stolen bikes.

# Details 

1. Data Cleaning: Data was cleaned using Pandas and downloaded from the Toronto Police open data here.
2. The cleaned data was loaded into an SQLite database.
3. A Flask API was created with different routes, including loading the SQLite database, handling geojson files, and serving the main home page. Running app.py in the terminal opens the website at http://localhost:5000/.

## Charts 

- Using D3.js, three different charts were created in logic2.js:
       
        (1) Line Chart: Displays "Bike Stolen - By Day of the Week" : tracking theft trends over weekdays graphically.
       ![newplot](https://github.com/pgajjar13/Project2_group1/assets/135158002/632677ae-8679-4057-86a6-a1822dac4afe)

        (2) Bar Chart: Shows "Bike Stolen - By Month" : showcasing monthly bike theft statistics in a graphical format.
  ![newplot (1)](https://github.com/pgajjar13/Project2_group1/assets/135158002/58d240f5-6d68-4241-b188-0f7585fd94f9)

        (3) Horizontal Bar Graph: Depicts ""Top 5 Neighbourhoods"" : using dynamic Horizontal Bar Graph, depicting theft patterns over in top 5 Neighbourhood.

  ![newplot (2)](https://github.com/pgajjar13/Project2_group1/assets/135158002/5d906909-e439-4cf5-b8fd-30fc2631a9ec)


## Dependencies

- This code relies on the [Leaflet](https://leafletjs.com/) library for map visualization.
- It also utilizes [SQL.js](https://github.com/sql-js/sql.js) for working with SQLite databases in the browser.

## Additional Information

- The database should have a table named `info` with columns `STATUS`, `NEIGHBOURHOOD_158`, `LONG_WGS84`, and `LAT_WGS84`.
- The `getStatus` function is used to assign colors based on the count of stolen bikes.

