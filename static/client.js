var socket = io.connect(), // creating a new websocket connection
    whoami = '',           // my unique client identifier
    MTYPE  = {};           // MessageTypes

const DEBUG = true;

/******************************************************************************
 * Register all anquors to send clk+id and log id of every link clicked
 ******************************************************************************/
$('a').click( function (event) {
  //TODO: $('a').setProperty('class','inactive');
  //      $('#'+event.target.id).setProperty('class','active');
  //$('li').removeClass('active');
  //$('#'+event.target.id).addClass('active');

  if( $('#'+event.target.id).hasClass('emit') ) {
    socket.emit('message',{ ticks:   Date.now(),
                            type:    MTYPE.CLICKEVENT,
                            source:  event.target.id });
    log('MESSAGE to server type: '+MTYPE.CLICKEVENT.name+' source: '+event.target.id);
  }
});

/******************************************************************************
 * WS Message Handling: connect (got connected to server)
 ******************************************************************************/
socket.on('connect', function(){
  log('Connected server');
  socket.emit('helo',{ ticks: Date.now() });
});

/******************************************************************************
 * WS HELLO in response to HELO request
 ******************************************************************************/
socket.on('hello', function (data) {
  // get my UID
  whoami = data.clientUID;
  MTYPE  = JSON.parse( data.mtypes );

  $('#alert').html('ID:'+whoami);


  log('HELLO '+whoami+' => c/s offset: '+(Date.now()-data.ticks)+' ticks.');
});

/******************************************************************************
 * WS Message Handling: disconnect (got disconnected from server)
 ******************************************************************************/
socket.on('disconnect', function(){
  whoami = '';
  log('Lost Server');
});

/******************************************************************************
 * WS Message Handling
 ******************************************************************************/
socket.on('message', function (data) {
  if (typeof data.type === 'undefined' || data.type === null) {
    if (typeof data.origin === 'undefined' || data.origin === null) {
      log('MISSING MESSAGETYPE from UNKNOWN');
    } else {
      log('MISSING MESSAGETYPE from '+data.origin);
    }
  } else {
    switch (data.type.value)
    {
      case MTYPE.CONTENT.value:
        updateContent(data);
        break;

      default:
        log('UNKNOWN MESSAGETYPE from '+data.origin+' type: '+data.type.name);
        break;
    }
  }
});

/******************************************************************************
 * Display content at container
 ******************************************************************************/
function updateContent(data) {
  log(data.type.name.toUpperCase()+' from '+data.origin+' target: '+data.target);

  $('#'+data.target).html(data.content);
}

function log(message) {
    if(DEBUG){
        console.log(message);
    }
}
