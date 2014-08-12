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
  var jade_nodes = [
    '#row.row: #col-md-12.col-md-12: #panel-body.panel-body',
    ' table(class=["table", "table-hover", "table-striped", "table-bordered"])',
    '  thead',
    '   tr',
    '    th ID',
    '    th Name',
    '    th Address',
    '    th Operation System',
    '  tbody',
    '  - each val in data',
    '    tr',
    '     td= val.n.id',
    '     td= val.n.data.name',
    '     td= val.n.data.ip_addr',
    '     td= val.n.data.operation_system'
  ];

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