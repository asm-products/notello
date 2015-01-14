
var dispatcher = require('./notelloDispatcher');

var logout = function () {

	dispatcher.dispatchDiscrete('loggedOut');
};

module.exports = logout;
