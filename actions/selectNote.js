
var dispatcher = require('./notelloDispatcher');
var lscache = require('ls-cache');

var selectNoteAction = function (noteId) {

	if (lscache.get('isAuthenticated')) {

		// TODO: Get from db

	} else {

		dispatcher.dispatchDiscrete('selectedNote', lscache.get('unAuthNote_' + noteId));
	}

};

module.exports = selectNoteAction;
