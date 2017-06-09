var  socket = io.connect(); // creating a new websocket connection
const DEBUG = true;

/******************************************************************************
 * Register all anquors to send clk+id and log id of every link clicked
 ******************************************************************************/
$( 'a' ).click( function ( event ) {
  if( $( '#' + event.target.id ).hasClass( 'emit' ) ) {
    socket.emit( 'message', {  ticks:   Date.now(),
                              source:  event.target.id });
  }
});

/******************************************************************************
 * WS Message Handling: connect (got connected to server)
 ******************************************************************************/
socket.on( 'connect', function() {
  log( 'Connected to server' );
  socket.emit( 'helo', { ticks: Date.now() } );
});

/******************************************************************************
 * WS HELLO in response to HELO request
 ******************************************************************************/
socket.on( 'hello', function ( data ) {
  // get my UID
  $( '#alert' ).html( 'Connected' );
  log( 'HELLO  => c/s offset: ' + ( Date.now() - data.ticks ) + ' ticks.');
});

/******************************************************************************
 * WS Message Handling: disconnect (got disconnected from server)
 ******************************************************************************/
socket.on( 'disconnect', function() {
  log( 'Lost server connection' );
});

/******************************************************************************
 * WS Message Handling
 ******************************************************************************/
socket.on( 'message', function ( data ) {
  log( 'Got message: ' + JSON.stringify( data ) );
  $( '#container').html( JSON.stringify( data ) );
});

function log( message ) {
    if( DEBUG ){
        console.log( message );
    }
}