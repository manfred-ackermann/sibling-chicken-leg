var express = require('express');
var app     = express();
var server  = require('http').Server(app);
var io      = require('socket.io')(server);
var fs      = require('fs');
var neo4j   = require('neo4j-js');
var log4js  = require('log4js');
var log     = log4js.getLogger('appl');
var queries = require('./static/queries');

// Defaults (can be overwriten bei environment vars)
var PORT  = '8080';
var IP    = '127.0.0.1';
var DB    = 'http://localhost:7474/db/data/';

// I only wanna see INFO and upwards
log.setLevel(log4js.levels.DEBUG);

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
    socket.emit('viewNetworkHamburg');           // Send the data back to client
  });

  /**
   * Got a nodes request
   *
   * Get the data and send it back to client
   **/
  socket.on('nodes', function(){ 
    log.debug('Got request: nodes');                     // Just a debug message
    neo4j.connect(DB, function (err, graph) {                // ASYNC connect DB
      if (err) { log.fatal(err); throw err;              // Something went wrong
      }
      log.debug('Connected to DB: '+DB);                 // Just a debug message
      graph.query(queries.all_nodes, function (err, res) { // ASYNC do the query
        if (err) { log.error(err);                       // Something went wrong
        } else {
          //console.log(JSON.stringify(results, null, 1 ));
          //console.log("Got result id:"+results[0].n.id);
          log.info("Got "+res.length+" nodes as results on nodes request.");
          socket.emit('nodesData',res);          // Send the data back to client
        }
      });
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