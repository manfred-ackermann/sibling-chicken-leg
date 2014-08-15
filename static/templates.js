/*
 * Produce a nice table
 * 
 * Expects: (JSON)data
 */
var jade_nodes = [
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
  '     td= val.n.id',
  '     td= val.n.data.name',
  '     td= val.n.data.ip_addr',
  '     td= val.n.data.operation_system'
];

