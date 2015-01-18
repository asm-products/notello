
var $ = require('jquery');
var _ = require('underscore');
var lscache = require('ls-cache');

var preProcessingCallbacks = [];
var postProcessingCallbacks = [];

var api = function (options) {

	preProcessingCallbacks.map(function (callback) {
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

			postProcessingCallbacks.map(function (callback) {
				callback();
			});
		}
	});

	options.type = 'json';

	if (lscache.get('authToken')) {

		options.headers = {
        	'X-Authorization': lscache.get('authToken')
		};
	}

	$.ajax(options);
};

api.register = function (preProcessingCallback, postProcessingCallback) {

	preProcessingCallbacks.push(preProcessingCallback);
	postProcessingCallbacks.push(postProcessingCallback);
};

module.exports = api;
