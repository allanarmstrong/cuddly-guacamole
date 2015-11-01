var path = require('path');
var _ = require('lodash');
var settings = require('../settings');

var all = {

	port: process.env.port || 3000,

	root: path.normalize(__dirname + '/../../..'),
};
module.exports = _.merge(
  all,
  require('./' + process.env.NODE_ENV + '.js') || {});