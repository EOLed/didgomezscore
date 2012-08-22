BETA: Did Gomez Score?
======================

*Development is still in progress. Until the 2.0.0 milestone has been marked completed, don't
expect a stable webapp.*

This is a node.js rewrite of the mildly popular website didgomezscore.com. Didgomezscore.com
strives to be the leading source of indicating whether Scott Gomez has scored.

The goal of this node.js rewrite, personally, is to:

1. Learn more about Node.JS and Redis.
2. Lessen the load on the server in the event that Gomez takes more than a year to score again.


##Server Prerequisites

1. [Node.JS](nodejs.org)
2. [npm](http://npmjs.org)
3. [redis-server](http://redis.io)


##Installation

    git clone git@github.com:achan/didgomezscore.git
    cd didgomezscore
    npm install
    node app.js


##Roadmap

The [2.0.0](http://semver.org) milestone is to simply port the existing PHP webapp into a node.js webapp. Any
plans for new functionality will be placed in the 2.1.0 milestone.
