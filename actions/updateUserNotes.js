
var dispatcher = require('./notelloDispatcher');
var api = require('../common/api');
var lscache = require('ls-cache');

var updateUserNotesAction = function (userNotes) {

	if (lscache.get('isAuthenticated')) {		

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

	} else {

		lscache.set('unAuthUserNotes', userNotes);
		
		dispatcher.dispatchDiscrete('updateUserNotesCompleted');
	}
};

module.exports = updateUserNotesAction;
