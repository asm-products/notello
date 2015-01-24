
var dispatcher = require('./notelloDispatcher');
var api = require('../common/api');

var updateUserNotesAction = function (userNotes) {

	api({
		url: 'api/usernotes',
		method: 'post',
		data: {
			'_METHOD': 'PUT',
			'usernotes': userNotes
		},
		success: function (resp) {
			
			dispatcher.dispatchDiscrete('updateUserNotesCompleted');
	    }
	});
};

module.exports = updateUserNotesAction;
