var express = require('express');
var app     = express();
var server  = require('http').Server(app);
var io      = require('socket.io')(server);
var fs      = require('fs');
var neo4j   = require('neo4j-js');
var log4js  = require('log4js');
var log     = log4js.getLogger('appl');
var q       = require('./static/queries');

// Defaults (can be overwriten bei environment vars)
var PORT  = '8080';
var IP    = '127.0.0.1';
var DB    = 'http://localhost:7474/db/data/';

// I only wanna see INFO and upwards
log.setLevel(log4js.levels.INFO);

// Look for environment settings
if ( process.env.PORT !== "" ) {
  PORT = process.env.PORT; log.info("Set app to listen on PORT: "+ PORT);
} else {
  log.info("Set environment PORT to set listen port. Default is: "+ PORT);
}
if ( process.env.IP   !== "" ) {
  IP = process.env.IP; log.info("Set app to listen on IP: "+ IP);
} else {
  log.info("Set environment IP to set listen address. Default is: "+ IP);
}
if ( process.env.DB   !== "" ) { 
  DB = process.env.DB; log.info("Set app to use DB: "+ DB);
} else {
  log.info("Set environment DB to set Neo4j URL. Default is: "+ DB);
}

server.listen(PORT, IP);

var graph;

neo4j.connect(DB, function (err, agraph) {               // Get a DB connection
  if (err) { log.fatal(err); throw err; }                // Something went wrong
  log.debug('Connected to DB: '+DB);                     // Just a debug message
  graph = agraph;
});

/******************************************************************************
 * WEBSOCKETS Message Handling
 ******************************************************************************/

// creating a new websocket to keep the content updated
io.on('connection', function(socket) {
  log.debug("User connected.");

  socket.emit('home');

  socket.on('disconnect', function(){ log.debug('User disconnected'); });
  
  socket.on('home', function(){ 
    log.debug('Got request: home');
    socket.emit('home');
  });
  
  socket.on('views', function(){ 
    log.debug('Got request: views');
    socket.emit('views'); 
  });
  
  /**
   * Got a nodes request
   *
   * Get the data and send it back to client
   **/
  socket.on('viewNetworkHamburg', function(){ 
    log.debug('Got request: viewNetworkHamburg');        // Just a debug message
    graph.query(q.test_query(), function (err, res) {       // ASYNC do t. query
      if (err) { log.error(err); }                       // Something went wrong
      else {
        log.debug(JSON.stringify(res, null, 1 ));
        log.info("Got "+res.length+" obj as res. on viewNetworkHamburg req.");
        
        var dataset = {
          nodes: [
            { index: 0, name: "Myriel" },
            { index: 1, name: "Acki" },
            { index: 2, name: "Napoleon" },
            { index: 3, name: "Ping" },
            { index: 4, name: "Pong" },
            { index: 5, name: "Ping" },
            { index: 6, name: "Pong" },
          ],
          edges: [
            { source: 1,target: 0 },
            { source: 1,target: 2 },
            { source: 2,target: 0 },
            { source: 0,target: 3 },
            { source: 0,target: 4 },
            { source: 4,target: 5 },
            { source: 4,target: 6 },
          ]
        };

        socket.emit('viewNetworkHamburg',dataset);   // Send the data back to client
      }
    });
  });

  /**
   * Got a nodes request
   *
   * Get the data and send it back to client
   **/
  socket.on('testForceLayout', function(){ 
    log.debug('Got request: testForceLayout');           // Just a debug message
    log.info("Sending test dataset for testForceLayout req.");
    var dataset = {
      nodes: [
        { name: "Myriel" },
        { name: "Acki" },
        { name: "Napoleon" },
      ],
      edges: [
        { source: 1,target: 0 },
        { source: 1,target: 2 },
        { source: 0,target: 2 },
      ]
    };
    socket.emit('testForceLayout',dataset);      // Send the data back to client
  });

  /**
   * Got a nodes request
   *
   * Get the data and send it back to client
   **/
  socket.on('nodes', function(){ 
    log.debug('Got request: nodes');                     // Just a debug message
    graph.query(q.all_nodes(), function (err, res) {       // ASYNC do the query
      if (err) { log.error(err); }                       // Something went wrong
      else {
        log.debug(JSON.stringify(res, null, 1 ));
        log.info("Got "+res.length+" nodes as results on nodes request.");
        socket.emit('nodesData',res);            // Send the data back to client
      }
    });
  });
  
  /**
   * Got a relations request
   *
   * Send confirmation back to client
   **/
  socket.on('relations',  function(){
    log.debug('Got request: relations');
    socket.emit('relationsData');
  });

  /**
   * Do something regulary
   *
   * Send whatever to client
   **/
//  setTimeout(function() {}, 10);(function() {
//    var msg  = JSON.stringify( {app:{hello:"Please wait ..."}} );
//    socket.volatile.emit('welcome', msg); 
//  }, 500);
  
});

/******************************************************************************
 * HTTP Request Handling
 ******************************************************************************/

// Connect Log4js logger to Express
app.use(log4js.connectLogger( log4js.getLogger("http"), { 
  level: log4js.levels.INFO,
  format: ':remote-addr :method :url HTTP/:http-version :status' 
}));

app.use("/static", express.static(__dirname + '/static'));
app.get('/', function (req, res) { res.redirect('/static/app.html')});

/******************************************************************************
 * Done ... Show startup messsage
 ******************************************************************************/

log.info("Server started at: http://"+IP+":"+PORT+
                            ", ws://"+IP+":"+PORT+"/socket.io");