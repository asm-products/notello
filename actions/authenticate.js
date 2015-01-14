
var dispatcher = require('./notelloDispatcher');

var authenticate = function (email, authToken) {

	dispatcher.dispatchDiscrete('loggedIn', {

		'email': email,
		'authToken': authToken
	});
};

module.exports = authenticate;
