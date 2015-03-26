
var dispatcher = require('./notelloDispatcher');
var api = require('../common/api');
var lscache = require('ls-cache');
var _ = require('underscore');

var _updateUserNoteDatabase = _.debounce(function (updatedUserNotes) {

	api({
		url: 'api/usernotes',
		method: 'post',
		data: {
			'_METHOD': 'PUT',
			usernotes: updatedUserNotes
		},
		success: function (resp) {
			
			dispatcher.dispatchDiscrete('updateUserNotesCompleted');
	    }
	});

}, 3000);

var updateUserNotesAction = function (userNotes) {
		
	dispatcher.dispatchDiscrete('updateUserNotesCompleted');

	if (lscache.get('isAuthenticated')) {		
		
		_updateUserNoteDatabase(userNotes);

	} else {

		lscache.set('unAuthUserNotes', userNotes);
	}
};

module.exports = updateUserNotesAction;
