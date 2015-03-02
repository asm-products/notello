
var $ = require('jquery');
var _ = require('underscore');
var lscache = require('ls-cache');

var preProcessingCallbacks = [];
var postProcessingCallbacks = [];

var domUtils = require('../common/dom-utils');

var handleError = function (errorText) {

	if (!domUtils.isDebug) {

		window.location = 'error';

	} else {

		document.body.style.background = 'white';
		document.body.innerHTML = errorText;
	}
};

var api = function (options) {

	preProcessingCallbacks.map(function (callback) {
		callback();
	});

	options.error = function (resp) {

		handleError(resp.responseText);
	};

	options.success = _.wrap(options.success, function (successFunction, data, textStatus, jqXHR) {

		// This should always be JSON so if HTML came back we can assume there was an unhandled error
		if(jqXHR.getResponseHeader('content-type') === 'text/html') {

			handleError(data);

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
