
var dispatcher = require('./notelloDispatcher');

var searchAction = function (searchText) {

	dispatcher.dispatchDiscrete('search', searchText);
};

module.exports = searchAction;
