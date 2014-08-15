// creating a new websocket connection
var socket = io.connect();

// Send request and log id of every link clicked
$('a').click( function (event) { 
  // TODO: $('a').setProperty("class","inactive");
  //       $('#'+event.target.id).setProperty("class","active");
  $('li').removeClass('active');
  $('#'+event.target.id).addClass('active');
  $('#alert').html("Request send...");
  $('#container').html( "" );
  socket.emit(event.target.id);
  console.log("Requested: "+event.target.id);
});

// React on server message
socket.on('home', function () {
  //$('#alert').html("<p>xxx</p><p>Please select a menu entry...</p>");
  $('#container').html( jade.render( tpl.HOME() ) );
  $('#home').addClass('active');
  $('#alert').html("Welcome.");
});

// React on server message
socket.on('views', function () {
  $('#alert').html("Select a view please.");
});

// React on server message
socket.on('viewNetworkHamburg', function () {
  console.log("Got viewNetworkHamburg response from server.");
  $('#alert').html("Network Hamburg - Last update: "+String(new Date()));
  $('#container').html( jade.render( tpl.VIEW_NETWORK_HAMBURG() ) );
  
  var root = d3.select('#chart').append('svg')
      .attr('width',  '100%')
      //.attr('height', '100%')
      .attr('height', 600)
      .style('border', '1px solid black');
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
  $('#container').html( jade.render( tpl.NODES_TABLE(), {data: data} ) );
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