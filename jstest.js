const tal = 2;
console.log(tal);
var smhi = null;
//const SLHallPlatsKey =  4da9a566e24f4aed9b16d805faa8d142
//const slPlatsupslagURL = 
// {
//   "Name": "Sandviksvägen (Ekerö)",
//   "SiteId": "3067",
//   "Type": "Station",
//   "X": "17792987",
//   "Y": "59272704"
//   },

//SL
//
var cors_api_url = 'https://cors-anywhere.herokuapp.com/'
var req_uri = ''
const sandviksVagenSiteID = '3067';
const format = 'json';
const timeWindow = '30';
const realTimeInfoKey = '7ca1df5ecd844a299af35ff9acd5de0a';
let nextDeparuteURI = 'http://api.sl.se/api2/realtimedeparturesV4.' + format + '?key=' + realTimeInfoKey + '&siteid=' + sandviksVagenSiteID + '&timewindow=' + timeWindow
//var buses
function upDateBuses(buses) {
  let text = '';
  buses.forEach(function (bus) {
    // if (bus.DisplayTime.search(':')) {
    //   console.log(bus.DisplayTime)
    // }
    text += `Buss ${bus.LineNumber} avgår om ${bus.DisplayTime}<br>`;
  })
  console.log(text)
  // Using Date() function 
  let d = new Date();

  // Converting the number value to string 
  //a = d.toString()  
  h = d.getHours();
  m = d.getMinutes();

  // Printing the current date 
  //document.write("The current time is: " + h + ":" + m);

  document.getElementById("departures").innerHTML = text
  //window.buses1 = bus
}

function reqListener() {
  myJson = JSON.parse(this.response)
  //console.log(myJson.ResponseData.Buses)
  //console.log(this.response + 'made it!');
  upDateBuses(myJson.ResponseData.Buses)
}

var oReq = new XMLHttpRequest();
oReq.addEventListener("load", reqListener);
oReq.open("GET", cors_api_url + nextDeparuteURI);
oReq.send();


// function nextDeparture(siteID, timeWindow) {

//   fetch('http://api.sl.se/api2/realtimedeparturesV4.<json>?key=<'+realTimeInfoKey+'>&siteid=<'+siteID+'>&timewindow=<'+timeWindow+'>',{mode: "no-cors"})
//   .then((res)=>res.json())
//   .then((data)=>console.log(data))
//   .catch((err)=>console.log('Fetch Error :-S', err));
// }
// var headers = new Headers();

// var requestOptions = { method: 'GET',
//                headers: headers,
//                mode: 'no-cors',
//                cache: 'no-cache'
//                };
// fetch('http://api.sl.se/api2/realtimedeparturesV4.json?key=7ca1df5ecd844a299af35ff9acd5de0a&siteid=3067&timewindow=15',{method: 'GET', mode: 'no-cors'})
//   //"Content-Type": "application/x-www-form-urlencoded",

//   .then((res)=>res.json())
//   .then((data) => console.log(data))
//   .catch((err)=>console.log('Fetch Error :-S', err))
// //nextDeparture(sandviksVagenSiteID,timeWindow)

document.getElementById('b2').onclick = displayDate;
function displayDate() {
  document.getElementById("buses").innerHTML = Date()
};

//8a864dd62c4445d98babe9f0a4ea8091
//
// fetch('http://api.sl.se/api2/trafficsituation.json?key=8a864dd62c4445d98babe9f0a4ea8091', {mode: 'no-cors'})
//   .then((res)=>res.json())
//   .then((data) => console.log(data))
//   .catch((err)=>console.log('Fetch Error :-S', err))

//SMHI
const getWeather = () => {
  fetch('https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/16/lat/58/data.json')
    .then((res) => res.json())
    .then((data) => {
      let output = '<h2>Weather</h2>';
      //console.log(data.timeSeries[1].validTime);
      for (var i = 0; i < data.timeSeries.length; i++) {
        //   console.log(data.timeSeries[i].validTime);
        // }
        //data.forEach(function(timeSeries){
        //Array.prototype.forEach.call(data, function (timeSeries){  
        //   console.log(validTime);
        output += `<div>Time: ${data.timeSeries[i].validTime} ${data.timeSeries[i].parameters[1].values[0]}</div>`
      }
      document.getElementById("output").innerHTML = output;
      //document.getElementById("output").innerHTML = data.timeSeries[0].parameters[0].name
    })
    .catch(function (err) {
      console.log('Fetch Error :-S', err)
    })
};
getWeather()
//   function(response) {
//     if (response.status !== 200) {
//       console.log('Looks like there was a problem. Status Code: ' +
//         response.status);
//       return;
//     }


//     // Examine the text in the response
//     response.json().then(function(data) {

//       console.log(data);
//       //document.getElementById("demo").innerHTML = data;
//     });
//   }
// )





let sec = null;
    //let tic = new Promise(function(resolve, reject) {});


