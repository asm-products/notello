
var dispatcher = require('./notelloDispatcher');
var api = require('../common/api');

var sendLoginEmailAction = function (email) {

	var data = {
		email: email
	};

	api({
		url: 'api/login',
		method: 'post',
		data: data,
		success: function (resp) {
			
			dispatcher.dispatchDiscrete('attemptedLogin');
	    }
	});
};

module.exports = sendLoginEmailAction;
