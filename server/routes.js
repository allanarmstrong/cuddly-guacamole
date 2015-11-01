

var express = require('express');
var path = require('path');

module.exports = function(app) {

	app.use('/', function(req, res) {
		res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
	});
};