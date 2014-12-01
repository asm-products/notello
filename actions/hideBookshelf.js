
var dispatcher = require('./notelloDispatcher');

var hideBookshelfAction = function () {
	
	dispatcher.dispatchDiscrete('hideBookshelf');
};

module.exports = hideBookshelfAction;
