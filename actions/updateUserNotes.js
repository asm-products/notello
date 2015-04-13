
var dispatcher = require('./notelloDispatcher');
var api = require('../common/api');
var lscache = require('ls-cache');
var _ = require('underscore');

var _updateUserNoteDatabase = _.debounce(function (updatedUserNotes, append) {

	api({
		url: 'api/usernotes',
		method: 'post',
		data: {
			'_METHOD': 'PUT',
			usernotes: updatedUserNotes,
			append: append
		},
		success: function (resp) {
			dispatcher.dispatchDiscrete('updateUserNotesCompleted', resp.userNotes);
	    }
	});

}, 3000);

var updateUserNotesAction = function (userNotes, append) {

	if (lscache.get('isAuthenticated')) {		
		
		_updateUserNoteDatabase(userNotes, append);

	} else {

		lscache.set('unAuthUserNotes', userNotes);
	}
	
	dispatcher.dispatchDiscrete('updateUserNotesCompleted', userNotes);
};

module.exports = updateUserNotesAction;
