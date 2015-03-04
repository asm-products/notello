
var dispatcher = require('./notelloDispatcher');
var api = require('../common/api');
var lscache = require('ls-cache');
var createNoteAction = require('./createNote')

var getUserNotesAction = function () {

	var isAuthenticated = lscache.get('isAuthenticated');
	var unAuthUserNotes = lscache.get('unAuthUserNotes');

	if (isAuthenticated) {

		api({
			url: 'api/usernotes',
			method: 'get',
			cache: false,
			success: function (resp) {
				
				dispatcher.dispatchDiscrete('getUserNotesCompleted', JSON.parse(resp.userNotes));
		    }
		});

	} else if (unAuthUserNotes) {

		dispatcher.dispatchDiscrete('getUserNotesCompleted', unAuthUserNotes);

	} else {

		// Create a default document
		createNoteAction([], '', '');
	}
};

module.exports = getUserNotesAction;
