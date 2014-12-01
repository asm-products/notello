
var reqwest = require('reqwest');

var api = function (options) {

	options.failure = function (resp) {

		// Error should already have been logged on server side
		window.location = 'error';
	};

	reqwest(options);
};

module.exports = api;
