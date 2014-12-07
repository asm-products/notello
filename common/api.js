
var $ = require('jquery');

var api = function (options) {

	options.failure = function (resp) {

		// Error should already have been logged on server side
		window.location = 'error';
	};

	options.type = 'json';

	$.ajax(options);
};

module.exports = api;
