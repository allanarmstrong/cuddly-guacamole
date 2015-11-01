var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./environment');

module.exports = function(app) {
	var env = app.get('env');
	app.set('view engine', 'html');


	app.use(bodyParser.urlencoded({extended: false}));
	app.use(bodyParser.json());
	app.use(cookieParser());
	if ('production' === env) {
		app.use(express.static(path.join(config.root, 'public')));
		app.set('appPath', path.join(config.root, 'public'));
	}

	if ('development' === env) {
		app.use(require('connect-livereload')());
		app.use(express.static(path.join(config.root, 'client')));
		app.set('appPath', path.join(config.root, 'client'));
	}
};