
var dispatcher = require('./notelloDispatcher');

var selectNoteAction = function (noteId) {

	if (lscache.get('isAuthenticated')) {

		
			

	} else {

		dispatcher.dispatchDiscrete('selectedNote', lscache.get('unAuthNote_' + noteId));
	}

};

module.exports = selectNoteAction;
