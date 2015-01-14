
var $ = require('jquery');
var _ = require('underscore');

var callbacks = [];

var api = function (options) {

	callbacks.map(function (callback) {
		callback();
	});

	options.error = function (resp) {

		// Error should already have been logged on server side
		// TODO: Make sure this doesn't happen in production
		document.body.style.background = 'white';
		document.body.innerHTML = resp.responseText;
	};

	options.success = _.wrap(options.success, function (successFunction, data, textStatus, jqXHR) {

		// This should always be JSON so if HTML came back we can assume there was an unhandled error
		if(jqXHR.getResponseHeader('content-type') === 'text/html') {

			document.body.style.background = 'white';
			document.body.innerHTML = data;

		} else {

			successFunction(data);
		}
	});

	options.type = 'json';

	$.ajax(options);
};

api.register = function (callback) {

	callbacks.push(callback);
};

module.exports = api;
