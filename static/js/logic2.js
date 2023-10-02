
// Promise Pending
const dataPromise = d3.json('/data');
console.log("Data Promise: ", dataPromise);

// Fetch from SQL database
d3.json('/data').then(function(data){
    d3.json('/hood').then(function(hood) {
       console.log(data);
       console.log(hood);
       



        // bar chart

        var weekdays = {"Monday":0, "Tuesday":0, "Wednesday":0, "Thursday":0, "Friday":0, "Saturday":0, "Sunday":0};
        data.forEach((bike) => {
            if (moment(bike.OCC_DATE).format("dddd") == "Monday") {
                weekdays["Monday"] += 1
            } else if (moment(bike.OCC_DATE).format("dddd") == "Tuesday") {
                weekdays["Tuesday"] += 1
            } else if (moment(bike.OCC_DATE).format("dddd") == "Wednesday") {
                weekdays["Wednesday"] += 1
            } else if (moment(bike.OCC_DATE).format("dddd") == "Thursday") {
                weekdays["Thursday"] += 1
            } else if (moment(bike.OCC_DATE).format("dddd") == "Friday") {
                weekdays["Friday"] += 1
            } else if (moment(bike.OCC_DATE).format("dddd") == "Saturday") {
                weekdays["Saturday"] += 1
            } else if (moment(bike.OCC_DATE).format("dddd") == "Sunday") {
                weekdays["Sunday"] += 1
            }
        });    

        

        console.log(Object.keys(weekdays));
        console.log(Object.values(weekdays));

        var weekData = [{
            type: "bar", 
            x: Object.keys(weekdays), 
            y: Object.values(weekdays), 
        }];

        var layout = {
            title: "Bike Stolen - By day of the week", 
            yaxis: {title: "No. of Thefts", showgrid: false},
            font: {
                color: "black", 
                family: "cursive",
                size: 12
            },
        };
        
        Plotly.newPlot("bar", weekData, layout);

        
        
        // line chart

        var month = {"January":0, "February":0, "March":0, "April":0, "May":0, "June":0, "July":0,"August":0, "September":0, "October":0, "November":0, "December":0 };
        data.forEach((bike) => {
            if (moment(bike.OCC_DATE).format("MMMM") == "January") {
                month["January"] += 1
            } else if (moment(bike.OCC_DATE).format("MMMM") == "February") {
                month["February"] += 1
            } else if (moment(bike.OCC_DATE).format("MMMM") == "March") {
                month["March"] += 1
            } else if (moment(bike.OCC_DATE).format("MMMM") == "April") {
                month["April"] += 1
            } else if (moment(bike.OCC_DATE).format("MMMM") == "May") {
                month["May"] += 1
            } else if (moment(bike.OCC_DATE).format("MMMM") == "June") {
                month["June"] += 1
            } else if (moment(bike.OCC_DATE).format("MMMM") == "August") {
                month["July"] += 1
            } else if (moment(bike.OCC_DATE).format("MMMM") == "July") {
                month["August"] += 1
            } else if (moment(bike.OCC_DATE).format("MMMM") == "September") {
                month["September"] += 1
            } else if (moment(bike.OCC_DATE).format("MMMM") == "October") {
                month["October"] += 1
            } else if (moment(bike.OCC_DATE).format("MMMM") == "November") {
                month["November"] += 1
            } else if (moment(bike.OCC_DATE).format("MMMM") == "December") {
                month["December"] += 1      
            }
        }); 

        console.log(Object.keys(month));
        console.log(Object.values(month));

        var monthData = [{
            type: "line", 
            x: Object.keys(month), 
            y: Object.values(month), 
        }];

        var layout_m = {
            title: "Bike Stolen - By Month", 
            yaxis: {title: "No. of Thefts", showgrid: false},
            font: {
                color: "black", 
                family: "cursive",
                size: 12
            },
        };
        
        Plotly.newPlot("bar1", monthData, layout_m);
        
    });   
});        