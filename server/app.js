var express = require('express');
var path = require('path');
var config = require('./config/environment/index');


var routes = require('./routes');


var app = express();


var server = require('http').createServer(app);
require('./config/express')(app);
routes(app);


app.listen(config.port, function() {
	console.log("Listening on port " + config.port);
});