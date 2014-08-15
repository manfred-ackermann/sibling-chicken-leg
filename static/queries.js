// Build the query
var all_nodes = [
  'MATCH (n)',
//  'WHERE n.name="vhead0"',
  'RETURN n'
];

module.exports.all_nodes = all_nodes.join('\n');
