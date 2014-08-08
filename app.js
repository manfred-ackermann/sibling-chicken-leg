var express = require('express');
var app     = express();
var server  = require('http').Server(app);
var io      = require('socket.io')(server);
var fs      = require('fs');
var morgan  = require('morgan');

var PORT  = '8080';
var IP    = '127.0.0.1';

if ( process.env.PORT !== "" ) PORT = process.env.PORT;
if ( process.env.IP   !== "" )   IP = process.env.IP;

server.listen(PORT, IP);

// creating a new websocket to keep the content updated without any AJAX request
io.on('connection', function(socket) {
  console.log("User connected.");

  socket.emit('home');

  socket.on('disconnect', function(){ console.log('User disconnected'); });
  
  socket.on('home', function(){ 
    console.log('Got request: home');
    socket.emit('home');
  });
  
  socket.on('views', function(){ 
    console.log('Got request: views');
    socket.emit('views'); 
  });
  
  socket.on('nodes', function(){ 
    console.log('Got request: nodes');
    socket.emit('nodesData'); 
  });
  
  socket.on('relations',  function(){
    console.log('Got request: relations');
    socket.emit('relationsData');
  });

  setTimeout(function() {}, 10);(function() {
    var msg  = JSON.stringify( {app:{hello:"Please wait ..."}} );
    socket.volatile.emit('welcome', msg); 
  }, 500);
  
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
      return res.end('Error loading /static/app.css');
    }
    res.writeHead(200);
    res.end(data);
  });
});

app.get('/static/client.js', function (req, res) {
  fs.readFile(__dirname + '/static/client.js', function(err, data) {
    if (err) {
      console.log(err);
      res.writeHead(500);
      return res.end('Error loading /static/client.js');
    }
    res.writeHead(200);
    res.end(data);
  });
});

console.log("Server started at: http://"+IP+":"+PORT+
                               ", ws://"+IP+":"+PORT+"/socket.io");