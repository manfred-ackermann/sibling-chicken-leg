var express = require('express'),
    app     = express(),
    server  = require('http').Server(app),
    io      = require('socket.io')(server),
    fs      = require('fs'),
    pug     = require('pug'),
    log4js  = require('log4js'),
    log     = log4js.getLogger('appl'),
    eRouter = require('./eventRouter');

// Defaults (can be overwritten bei environment vars)
const PORT = '8080',
      IP   = '127.0.0.1';

// MessageTypes enum
const MTYPE = {
  CLICKEVENT : {value: 0, name: "clickevent"},
  CONTENT    : {value: 1, name: "content"}
};

// I only wanna see INFO and upwards
logLevel = log4js.levels.DEBUG;
log.setLevel(logLevel);

eRouter.hello();

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
 * Prepare pug template cache
 ******************************************************************************/
var template_cache = {};
template_cache['error404'] = fs.readFileSync('static/template/error404.pug');

/******************************************************************************
 * Prepare client session registry
 ******************************************************************************/
const session_registry = new Array;

/******************************************************************************
 * WEBSOCKETS Client Message Handling
 ******************************************************************************/
io.on('connection', function (socket) {
    var template;

    log.debug("New connection.");

    // Got HELO (Handshake part 1) from client
    // Will emit HELLO with timestamp and register clientId
    socket.on('helo', function (data) {
        log.debug('HELO from '+socket.id);
        socket.emit('hello',{ ticks:     Date.now(),             // timestamp
                              clientUID: socket.id,              // unique ID
                              mtypes:    JSON.stringify( MTYPE ) // config
                            });
        session_registry.push(socket.id);
        log.debug(session_registry.length + ' clients connected.');
//        session_registry.forEach(function (client, index, object) {
//          log.debug('#' + index + ': ' + client);
//        });

        // Send the home page as welcome content
        data.source = 'home';
        data.target = 'container';
        sendContent(socket, data);
    });

    // Got DISCONNECT for client
    // Will deregister clientId
    socket.on('disconnect', function () {
        log.debug('Client '+socket.id+' disconnected');
        session_registry.splice(session_registry.indexOf(socket.id), 1);
//        for (var key in session_registry) {
//          if (session_registry.hasOwnProperty(key)) {
//            log.debug('key is: ' + key + ', value is: ' + session_registry[key]);
//          }
//        }
    });

    // Got MESSAGE
    socket.on('message', function (data) {
      if (typeof data.type === 'undefined' || data.type === null)
      {
        log('MISSING MESSAGETYPE from '+socket.id);
      }
      else
      {
        switch (data.type.value)
        {
          case MTYPE.CLICKEVENT.value:
            handleClickevent(socket, data);
            break;

          default:
            log.debug('MESSAGE from '+socket.id+' w/ unknown type : '+data.type.name);
            break;
        }
      }
    });

});

function handleClickevent(socket, data) {
  log.debug( data.type.name.toUpperCase()+' from '+socket.id+' source: '+data.source);

  switch (data.source)
  {
    case 'home':
    case 'oooops':
    case 'action':
    case 'c-a1':
    case 'c-a2':
    case 'c-b1':
      data.target = 'container';
      sendContent(socket, data);
      break;

    default:
      log.debug('MESSAGE from '+socket.id+' w/ unknown source : '+data.source);
      break;
  }
}

function sendContent(socket, data) {
  data.content = renderTemplate( data );
  sendRawContent(socket, data)
}

function renderTemplate( data ) {
  // Get template from cache or load and store in cache
  template = template_cache[data.source];
  if(typeof template === 'undefined' || template === null) {
      try {
          template = fs.readFileSync('static/template/'+data.source+'.pug');
          if( logLevel !== log4js.levels.DEBUG ) {
              template_cache[data.source] = template;
          }
      } catch (e) {
          template = template_cache['error404'];
      }
  }
  return pug.render( template, { data: data } );
}

function sendRawContent(socket, data) {
  socket.emit('message',{ ticks:  Date.now(),
                          type:   MTYPE.CONTENT,
                          origin: 'server',
                          target:  data.target,
                          content: data.content
                        });
}

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
