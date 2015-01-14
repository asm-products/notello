
var dispatcher = require('./notelloDispatcher');
var api = require('../common/api');

var sendLoginEmailAction = function (email) {

	api({
		url: 'api/login',
		method: 'post',
		data: { email: email },
		success: function (resp) {
			
			dispatcher.dispatchDiscrete('attemptedLogin');
	    }
	});
};

module.exports = sendLoginEmailAction;
