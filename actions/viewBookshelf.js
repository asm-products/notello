
var dispatcher = require('./notelloDispatcher');

var viewBookshelfAction = function () {
	
	dispatcher.dispatchDiscrete('viewBookshelf');
};

module.exports = viewBookshelfAction;
