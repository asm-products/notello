
var api = require('../common/api');
var lscache = require('ls-cache');
var dispatcher = require('./notelloDispatcher');
var getUserNotesAction = require('./getUserNotes');

var resetTokenAction = function () {
	api({
		url: 'api/token',
		method: 'get',
		cache: false,
		success: function (resp) {
			
			// If the token is not valid
			if (resp.token !== 'InvalidToken') {

				lscache.set('authToken', resp.token);
				dispatcher.dispatchDiscrete('resetToken');

			}

			getUserNotesAction();
	    }
	});
};

module.exports = resetTokenAction;
