sibling-chicken-leg
===================

Just another try to setup a senseful working environment to build a system that
has a Neo4j Graph Database as data sink and node.js as middleware to interface
with humans using a html-interface to

*show the actual network and application situasion so
it's helpful to identify problems and their source*
 
On the node.js side the following extensions are identified to do the job:
- GitHub strongloop/express (Web Development Framework)
- GitHub caolan/async (Async utilities for node and the browser)
- GitHub bretcope/neo4j-js (client library for accessing neo4j databases)
- GitHub mbostock/d3 (A JavaScript visualization library for HTML and SVG)
- GitHub expressjs/morgan (http request logger middleware)
- GitHub visionmedia/jade (robust, elegant, feature rich template engine)

and last but not least Bootstrap. IDE I use is http://c9.io

That's it ... now let's see how far it get's.

History
-------
2014.08.11 - Requested data from db by cypher and when delivered it to clients
             web frontend by using websockets. Also cleaned up logging a bit.
             Have to thought about propper logging.

2014.08.10 - I'm quite fine with the Bootstrap and Websockets integration and
             now going on with connection to Neo4j, requesting data and getting
             it to the client. After that I'll go for the visualistion (d3). I
             thing jade will not be of a big help because all data will be 
             rendered by d3, but who knows. At least I remember jade was a cool
             help on more text oriented content.
             
2014.08.05 - Prototype that implements websockets and a static delivered html
             page that makes use of bootstrap framework. When data.xml is 
             altered the content on the webpage changes.
