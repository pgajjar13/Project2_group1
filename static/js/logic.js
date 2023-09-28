let db;

// This block helps to load the sqlite file and save in db variable
console.log("logic.js loaded")
window.onload = function() {
    console.log("Everything is loaded")
    let fileInput = document.getElementById('select-file');
    fileInput.addEventListener('change', function() {
        console.log("File selected")
        let f = fileInput.files[0];
        initSqlJs().then(function(SQL){
            const r = new FileReader();
            r.onload = function() {
                console.log("File content is loaded")
                const Uints = new Uint8Array(r.result);
                db = new SQL.Database(Uints);
                let sqlstr = "select STATUS, NEIGHBOURHOOD_158,LONG_WGS84,LAT_WGS84 FROM info WHERE STATUS = 'STOLEN';";
                const res = db.exec(sqlstr);
                console.log(res);
            }
            r.readAsArrayBuffer(f);
        });
    });


    let queryButton = document.getElementById('make-query');
    queryButton.addEventListener('click', function() {
        let queryStatement = document.getElementById('query-statement').value;
        console.log("Executing: ", queryStatement)
        const result = db.exec(queryStatement);
        console.log(result[0].values.slice(0,10));
    });


    let makeMapButton = document.getElementById('visualize');
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
        
        
        // Create a map object.
        let myMap = L.map("map", {
        center: [43.65 , -79.38],
        zoom: 12
        });

        // console.log(result[0].values.slice(0,10));\
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
          
        // Add a tile layer.
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(myMap);

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
    } else if (count <= 500) {
        return "#fbd335"
    } else if (count <= 750) {
        return "#ffac37"
    } else if (count <= 1000) {
        return "#ff9558"
    } else {
        return "#ff4f5b"
    }
}

