var express = require('express'),
    app     = express(),
    server  = require('http').Server(app),
    io      = require('socket.io')(server),
    fs      = require('fs'),
    log4js  = require('log4js'),
    log     = log4js.getLogger('appl');

// Defaults (can be overwritten by environment vars)
const PORT = '8081',
      IP   = '127.0.0.1';

// I only wanna see INFO and upwards
logLevel = log4js.levels.DEBUG;
log.setLevel(logLevel);

// Look for environment settings
if (process.env.PORT !== undefined) {
    PORT = process.env.PORT;
    log.info("Set app to listen on PORT: " + PORT);
} else {
    log.info("Set environment PORT to set listen port. Default is: " + PORT);
}
if (process.env.IP !== undefined) {
    IP = process.env.IP;
    log.info("Set app to listen on IP  : " + IP);
} else {
    log.info("Set environment IP to set listen address. Default is: " + IP);
}

server.listen(PORT, IP);

/******************************************************************************
 * WEBSOCKETS Client Message Handling
 ******************************************************************************/
io.on('connection', function (socket) {

    log.debug("New connection.");

    // Got HELO (Handshake part 1) from client
    // Will emit HELLO with timestamp and register clientId
    socket.on('helo', function (data) {
        log.debug('HELO from '+socket.id);
        socket.emit('hello',{ ticks: Date.now() });

        // Send the home page as welcome content
        socket.emit('message',{ ticks: Date.now(), payload: 'Hello World!' });
    });

    // Got DISCONNECT for client
    // Will deregister clientId
    socket.on('disconnect', function () {
        log.debug('Client '+socket.id+' disconnected');
    });

    // Got MESSAGE
    socket.on('message', function (data) {
      socket.emit('message',{ ticks: Date.now(), payload: data });
    });

});

/******************************************************************************
 * Connect Log4js logger to Express
 ******************************************************************************/
app.use(log4js.connectLogger(log4js.getLogger("http"), {
    level: log4js.levels.INFO,
    format: ':remote-addr :method ":url" "HTTP/:http-version" :status'
}));

/******************************************************************************
 * HTTP Request Handling
 ******************************************************************************/
app.use("/static", express.static(__dirname + '/static'));
app.get('/', function (req, res) {
    res.redirect('/static/app.html')
});

/******************************************************************************
 * Done ... Show startup messsage
 ******************************************************************************/
log.info("Server started at: http://" + IP + ":" + PORT);