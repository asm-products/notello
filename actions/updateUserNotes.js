
var dispatcher = require('./notelloDispatcher');
var api = require('../common/api');

// TODO: Handle offline persistence
var updateUserNotesAction = function (userNotes) {

	api({
		url: 'api/usernotes',
		method: 'post',
		data: {
			'_METHOD': 'PUT',
			usernotes: userNotes
		},
		success: function (resp) {
			
			dispatcher.dispatchDiscrete('updateUserNotesCompleted');
	    }
	});
};

module.exports = updateUserNotesAction;
