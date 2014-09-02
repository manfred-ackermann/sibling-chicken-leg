/* Get all Nodes
 ***********************/
function all_nodes() {
  return 'MATCH (nodes)'+
//         ' WHERE nodes.name="vhead0"'+
         ' RETURN nodes'
};

/* Get simple result (Test Query)
 ********************************/
function test_query() {
  return 'MATCH p = shortestPath((a)-[r*..64]-(b))'+
        ' WHERE (a.ip_addr = "192.168.57.111") AND (b.ip_addr = "172.27.4.116")' +
        ' RETURN a,b,p';
};

module.exports.all_nodes  = all_nodes;
module.exports.test_query = test_query;