// creating a new websocket connection
var socket = io.connect();

/******************************************************************************
 * Register all Anquors to send request and log id of every link clicked
 ******************************************************************************/

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

/******************************************************************************
 * WS Message Handling: disconnect (got disconnected from server)
 ******************************************************************************/

socket.on('disconnect', function(){
  console.log('Lost Server (disconnected)');
  $('#alert').html('Lost Server (disconnected)');
});

/******************************************************************************
 * WS Message Handling: home
 ******************************************************************************/

socket.on('home', function () {
  //$('#alert').html("<p>xxx</p><p>Please select a menu entry...</p>");
  $('#container').html( jade.render( tpl.HOME() ) );
  $('#home').addClass('active');
  $('#alert').html("Welcome.");
});

/******************************************************************************
 * WS Message Handling: views
 ******************************************************************************/

socket.on('views', function () {
  $('#alert').html("Select a view please.");
});

/******************************************************************************
 * WS Message Handling: testForceLayout
 ******************************************************************************/

socket.on('testForceLayout', function (data) {
  console.log("Got testForceLayout response from server.");
  $('#alert').html("D3 Force Layout - Last update: "+String(new Date()));
  $('#container').html( jade.render( tpl.D3_STUB() ) );

  //console.log(JSON.stringify(data, null, 1 ));
  
  var fill  = d3.scale.category20();
  var svg   = d3.select('#chart').append('svg')
            .attr('width',  800)
            .attr('height', 600)
            .style('border', '1px solid black');

  var force = d3.layout.force()
            .nodes(data.nodes)
            .links(data.edges)
            .size([800, 600])
            .linkDistance([50])
            .charge([-100])
            .start();

  var edges = svg.selectAll("lines")
              .data(data.edges)
              .enter()
              .append("line")
              .style("stroke", "#ccc")
              .style("stroke-width", 1);

  var nodes = svg.selectAll("circle")
              .data(data.nodes)
              .enter().append("circle")
              .attr("class", "node")
              .attr("cx", function(d) { return d.x; })
              .attr("cy", function(d) { return d.y; })
              .attr("r", 8)
              .style("fill",   function(d, i) { return fill(i); })
              .style("stroke", function(d, i) { return d3.rgb(fill(i)).darker(2); })
              .call(force.drag)
              .on("mousedown", function() { d3.event.stopPropagation(); });

  force.on("tick", function() {
    edges.attr("x1", function(d) { return d.source.x; })
         .attr("y1", function(d) { return d.source.y; })
         .attr("x2", function(d) { return d.target.x; })
         .attr("y2", function(d) { return d.target.y; });
  
    nodes.attr("cx", function(d) { return d.x; })
         .attr("cy", function(d) { return d.y; });
  });
  
});

/******************************************************************************
 * WS Message Handling: viewNetworkHamburg
 ******************************************************************************/

socket.on('viewNetworkHamburg', function (data) {
  console.log("Got viewNetworkHamburg response from server.");
  $('#alert').html("Network Hamburg - Last update: "+String(new Date()));
  $('#container').html( jade.render( tpl.D3_STUB() ) );
  
  //console.log(JSON.stringify(data, null, 1 ));
  
  var fill  = d3.scale.category20();
  var svg   = d3.select('#chart').append('svg')
            .attr('width',  800)
            .attr('height', 600)
            .style('border', '1px solid black');

  var force = d3.layout.force()
            .nodes(data.nodes)
            .links(data.edges)
            .size([800, 600])
            .linkDistance([50])
            .charge([-400])
            .gravity(0.05)
            .start();

  var edges = svg.selectAll("lines")
              .data(data.edges)
              .enter()
              .append("line")
              .style("stroke", "#ccc")
              .style("stroke-width", 1);

  var nodes = svg.selectAll("circle")
              .data(data.nodes)
              .enter().append("circle")
              .attr("class", "node")
              .attr("cx", function(d) { return d.x; })
              .attr("cy", function(d) { return d.y; })
              .attr("r", 8)
              .style("fill",   function(d, i) { return fill(i); })
              .style("stroke", function(d, i) { return d3.rgb(fill(i)).darker(2); })
              .call(force.drag)
              .on("mousedown", function() { d3.event.stopPropagation(); });

  force.on("tick", function() {
    edges.attr("x1", function(d) { return d.source.x; })
         .attr("y1", function(d) { return d.source.y; })
         .attr("x2", function(d) { return d.target.x; })
         .attr("y2", function(d) { return d.target.y; });
  
    nodes.attr("cx", function(d) { return d.x; })
         .attr("cy", function(d) { return d.y; });
  });
  
});

/******************************************************************************
 * WS Message Handling: nodesData
 ******************************************************************************/

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

/******************************************************************************
 * WS Message Handling: relationsData
 ******************************************************************************/

socket.on('relationsData', function () {
  console.log("Relations confirmed by server.");
  $('#alert').html("Relations confirmed by server.");
});

// Returns a list of all nodes under the root.
function flatten(root) {
  var nodes = [], i = 0;

  function recurse(node) {
    if (node.children) node.children.forEach(recurse);
    if (!node.id) node.id = ++i;
    nodes.push(node);
  }

  recurse(root);
  return nodes;
}

// Color leaf nodes orange, and packages white or blue.
function color(d) {
  return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
}

//        socket.on('welcome', function (data) {
//          //console.log("Notification received.");
//          // convert the json string into a valid javascript object
//          var _data = JSON.parse(data);
//          $('#container').html(_data.app.hello);
//        });