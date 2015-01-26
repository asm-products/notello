
var dispatcher = require('./notelloDispatcher');
var _ = require('underscore');

var hideBookshelfAction = function () {
	
	dispatcher.dispatchDiscrete('hideBookshelf');

	_.delay(function () {

		dispatcher.dispatchDiscrete('shelfHidden');

	}, 500);
};

module.exports = hideBookshelfAction;
