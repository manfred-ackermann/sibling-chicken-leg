// creating a new websocket
var socket = io.connect();

// Send and log id of every link clicked
$('a').click( function (event) { 
  socket.emit(event.target.id) 
  console.log("Requested: "+event.target.id);
});

// React on server message
socket.on('home', function () {
  $('#container').html("Please select a menu entry...");
});

// React on server message
socket.on('views', function () {
  $('#container').html("Select a view please.");
});

// React on server message
socket.on('nodesData', function () {
  console.log("Nodes confirmed by server.");
  $('#container').html("Nodes confirmed by server.");
});

// React on server message
socket.on('relationsData', function () {
  console.log("Relations confirmed by server.");
  $('#container').html("Relations confirmed by server.");
});

//        socket.on('welcome', function (data) {
//          //console.log("Notification received.");
//          // convert the json string into a valid javascript object
//          var _data = JSON.parse(data);
//          $('#container').html(_data.app.hello);
//        });