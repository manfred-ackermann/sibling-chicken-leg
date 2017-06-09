# sibling-chicken-leg


-Just another try to setup a senseful working environment to build a system that
has a Neo4j Graph Database as data sink and node.js as middleware to interface
with humans using a html-interface to-

Start with a framework

*show the actual network and application situasion so
it's helpful to identify problems and their source*
 
On the node.js side the following extensions are identified to do the job:
- GitHub [strongloop/express](//github.com/strongloop/express) (Web Development Framework)
- GitHub [Automattic/socket.io](//github.com/Automattic/socket.io) (Realtime application framework)
- GitHub [nomiddlename/log4js-node](//github.com/nomiddlename/log4js-node) (log4js logger middleware)

and last but not least Bootstrap. The IDE I use is [Cloud9](//c9.io)

That's it ... now let's see how far it get's.

## Current Status

> Note: This application is in the early stages of development, is incomplete, and not by any means guaranteed to be stable. If you have input, or are interested in contributing to development or testing, __please contact me!__ My email address is on my [github account](https://github.com/manfred-ackermann).

## Installation

```bash
git clone https://github.com/manfred-ackermann/sibling-chicken-leg.git
cd sibling-chicken-leg
npm install 
```

## Usage

Just start the app and direct your browser to http://127.0.0.1:8080.

```bash
nodejs app.js
```

## History

2014.08.21 - Got stuck on asking the right questions the right way to the neo4j
             grah db and using d3 the right way. On 3d I got a clue how to use
             the force design but still I need the right data first. Also I have
             to create the right test data and a update data worker.

2014.08.15 - Got the jade template renderer included in a helpful maner, broke
             thinks up into reasonable pieces, included a better logging, worked
             on message handling and interaction and finally D3 painted the
             first rectangle.

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
