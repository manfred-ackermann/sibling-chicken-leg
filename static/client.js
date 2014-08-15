// creating a new websocket
var socket = io.connect();

// Send and log id of every link clicked
$('a').click( function (event) { 
  $('#alert').html("Requesting: "+event.target.id);
  $('#container').html( "" );
  socket.emit(event.target.id);
  console.log("Requested: "+event.target.id);
});

// React on server message
socket.on('home', function () {
  $('#alert').html("Please select a menu entry...");
});

// React on server message
socket.on('views', function () {
  $('#alert').html("Select a view please.");
});

// React on server message
socket.on('nodesData', function (data) {
  console.log("Got "+data.length+" nodes from server.");
  //console.log(JSON.stringify(data, null, 1 ));
  //var _data = JSON.parse(data);
  //console.log("Got name: "+data[0].n.id);
  //$('#container').html("Nodes confirmed by server."+JSON.stringify(data, null, 1 ));
  //$('#container').html(jade.compileClient('p TEST', {'filename':'/jade/nodes.jade'}));
  $('#alert').html("Got "+data.length+" nodes.");
  $('#container').html( jade.render( jade_nodes.join('\n'), {data: data} ) );
});

// React on server message
socket.on('relationsData', function () {
  console.log("Relations confirmed by server.");
  $('#alert').html("Relations confirmed by server.");
});

//        socket.on('welcome', function (data) {
//          //console.log("Notification received.");
//          // convert the json string into a valid javascript object
//          var _data = JSON.parse(data);
//          $('#container').html(_data.app.hello);
//        });