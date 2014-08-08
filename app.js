var express = require('express');
var app     = express();
var server  = require('http').Server(app);
var io      = require('socket.io')(server);
var fs      = require('fs');
var morgan  = require('morgan');

server.listen(process.env.PORT, process.env.IP);

// creating a new websocket to keep the content updated without any AJAX request
io.on('connection', function(socket) {
  console.log("User connection.");

  setInterval(function() {
    var msg  = JSON.stringify( {app:{ hello:"Hello World!", timestamp:Date.now()} } );

    socket.volatile.emit('notification', msg); 
    //console.log("Notification send: " + msg);
  }, 100);
  
});

//app.engine('jade', require('jade').__express);  => Jade drin dann gehts nicht!
//app.engine('html', require('jade').renderFile); <= Scheint zu gehen: CHECKEN!
app.use(morgan('combined'));

// on server started we can load our client.html page
app.get('/', function (req, res) {
  fs.readFile(__dirname + '/app.html', function(err, data) {
    if (err) {
      console.log(err);
      res.writeHead(500);
      return res.end('Error loading /');
    }
    res.writeHead(200);
    res.end(data);
  });
});

app.get('/app.html', function (req, res) {
  fs.readFile(__dirname + '/app.html', function(err, data) {
    if (err) {
      console.log(err);
      res.writeHead(500);
      return res.end('Error loading app.html');
    }
    res.writeHead(200);
    res.end(data);
  });
});

app.get('/static/app.css', function (req, res) {
  fs.readFile(__dirname + '/static/app.css', function(err, data) {
    if (err) {
      console.log(err);
      res.writeHead(500);
      return res.end('Error loading app.css');
    }
    res.writeHead(200);
    res.end(data);
  });
});

console.log("Server started at: http://sibling-chicken-leg-c9-manfred_ackermann.c9.io");