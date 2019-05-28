
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


//Firebase

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyAsoUo8yNDW5XnaKgON-tD00Eenpo6BJMM",
    authDomain: "clever-abbey-239911.firebaseapp.com",
    databaseURL: "https://clever-abbey-239911.firebaseio.com",
    projectId: "clever-abbey-239911",
    storageBucket: "clever-abbey-239911.appspot.com",
    messagingSenderId: "433135968722",
    appId: "1:433135968722:web:1fd66818c1173817"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var db = firebase.firestore()

  //getting from db
  db.collection("users").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data().name);
    });
});
var dogOutput = ''
//listening on dogWalks
db.collection("dogWalks")
    .onSnapshot(function(qSnapshot) {
      qSnapshot.forEach(function(doc){
        dogOutput += `${doc.data().user} gjorde en promenad på ${doc.data().duration} minuter <br>`
        console.log("Current data: ", doc.data())});
        document.getElementById("under").innerHTML =dogOutput
      })
  //console.log(db.collection("users"))
  
  
  function newDogWalk(s,n,ts){
    let t = Date.now();
    //let ts = t.toTimeString()
    db.collection("dogWalks").doc(2).set({
      user: s,
      duration: n,
      timestamp: firebase.firestore.Timestamp.fromDate(new Date())
     
      
  })
  .then(function(docRef) {
    console.log("Document written with ID: ", docRef.id);
})
.catch(function(error) {
    console.error("Error adding document: ", error);
  });
}
//newDogWalk('olle', "15")
  //dogOutput += user + 'gick i' + walkTime +' minuter <br>'
  //document.getElementById("output").innerHTML = dogOutput
  //console.log(user + walkTime)
  //}



//RAandom




function myFunction() {
  var x = document.getElementById("myInput").value;
  document.getElementById("output").innerHTML = "You wrote: " + x;
}


//SL
//
var cors_api_url = 'https://cors-anywhere.herokuapp.com/'
//var req_uri = ''
const sandviksVagenSiteID = '3067';
const format = 'json';
const timeWindow = '60';
const realTimeInfoKey = '7ca1df5ecd844a299af35ff9acd5de0a';
let nextDeparuteURI = 'https://api.sl.se/api2/realtimedeparturesV4.' + format + '?key=' + realTimeInfoKey + '&siteid=' + sandviksVagenSiteID + '&timewindow=' + timeWindow
const testBuses = [{'DisplayTime':'3 min', 'ExpectedDateTime':"2019-05-12T18:10:25", 'LineNumber':'177'}, {'DisplayTime':'18:17', 'ExpectedDateTime': "2019-05-12T18:17:05", 'LineNumber':'177'}];

var buses

//setInterval(function(){ upDateBuses() }, 10000);

function upDateBuses() {

  let now = new Date()
  let nowMin = now.getMinutes()
  {let busOutput ='' 
  window.buses.forEach((bus)=>{
    let timeLeft
    let departure = new Date(bus.ExpectedDateTime)
    
    if(nowMin<departure.getMinutes()){
      timeLeft = `${departure.getMinutes() - nowMin} min`
    }
    else{
      timeLeft = `${60 - nowMin + departure.getMinutes()} min`
    }
    busOutput += `Buss ${bus.LineNumber} avgår om <b>${timeLeft}</b><br>`
  })
  document.getElementById("departures").innerHTML = busOutput
}
}



function getBuses() {
  fetch(cors_api_url + nextDeparuteURI)
    .then((res) => res.json())
    .then((data) => {
      window.buses = data.ResponseData.Buses
    })
    .then(() => console.log(window.buses))
    .catch((err) => console.log('Fetch Error :-S', err));
}

// function getTime(){
//   fetch('http://worldtimeapi.org/api/timezone/Europe/Stockholm',{mode:"no-cors"})
//     .then((res) => console.log(res))//res.json())
//     .then((data) => console.log(data))
// }
// getTime()



// var oReq = new XMLHttpRequest();
// oReq.addEventListener("load", reqListener);
// oReq.open("GET", cors_api_url + nextDeparuteURI);
// oReq.send();


// function nextDeparture(siteID, timeWindow) {


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
          output += `<div>Time: ${data.timeSeries[i].validTime.getHour()} ${data.timeSeries[i].parameters[1].values[0]}</div>`
        }
        document.getElementById("output").innerHTML = output;
        //document.getElementById("output").innerHTML = data.timeSeries[0].parameters[0].name
      })
      .catch(function (err) {
        console.log('Fetch Error :-S', err)
      })
    };
    
//getWeather()
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







