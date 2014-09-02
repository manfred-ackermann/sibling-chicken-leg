/*
 * JADE TEMPLATES
 *
 * Used by clients.js to get the JADE code to render the received data.
 * Implemented in functions so it's like a getter and by the read-only.
 * 
 */
var tpl = {

  /* Graph Network Hamburg
   *****************************
   */
  VIEW_NETWORK_HAMBURG: function () {
    return join2str( [
      '#row.row: #col-md-12.col-md-12: #panel-body.panel-body',
      ' #chart.chart'
    ]);
  },
  
  /* Graph Network Hamburg
   *****************************
   */
  D3_STUB: function () {
    return join2str( [
      '#row.row: #col-md-12.col-md-12: #panel-body.panel-body',
      ' #chart.chart'
    ]);
  },
  
  /* Table of nodes with details
   *****************************
   * Context: (JSON) data{
   *                       nodes:{ id:,
   *                           data: { name:,
   *                                   ip_addr:,
   *                                   operation_system }
   *                         }
   *                     }
   */
  NODES_TABLE: function () {
    return join2str( [
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
      '     td= val.nodes.id',
      '     td= val.nodes.data.name',
      '     td= val.nodes.data.ip_addr',
      '     td= val.nodes.data.operation_system'
    ]);
  },

  /* Home Screen
   *************
   * Context: NONE
   */
  HOME: function () {
    return join2str( [
      'p: em Network and Application Monitor and Analysis',
      '#col-md-12.col-md-12',
      ' p Please select a menu entry to get a list of Nodes or Relations or '+
         'select a view from the dropdown menu to get a graph.',
      ' p BTW: Only "Nodes" and "View//Network/Hamburg" react with data.',
      'p: small &copy; 2014 - Manfred Ackermann ' ]);
  },
};

function join2str( myarray ) {
  var output = '';
  for (var i=0;i<myarray.length;i++){
    output += myarray[i];
    output += "\n";
  }
  return output;
}