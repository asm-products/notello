
var dispatcher = require('./notelloDispatcher');
var api = require('../common/api');
var _ = require('underscore');
var lscache = require('ls-cache');

_updateNoteDatabase = _.debounce(function (updatedNote) {

	api({
		url: 'api/note/' + updatedNote.noteId,
		method: 'post',
		data: {
			'_METHOD': 'PUT',
			noteTitle: updatedNote.noteTitle,
			noteText: updatedNote.noteText
		},
		success: function () {
			
			dispatcher.dispatchDiscrete('updateNoteCompleted', updatedNote);
	    }
	});

}, 5000);

var updateNoteAction = function (noteId, noteTitle, noteText) {

	var updatedNote = {
		noteId: noteId,
		noteTitle: noteTitle,
		noteText: noteText
	};
	
	if (lscache.get('isAuthenticated')) {

		_updateNoteDatabase(updatedNote);

	} else {

		lscache.set('unAuthNote_' + noteId, updatedNote);
		
		dispatcher.dispatchDiscrete('updateNoteCompleted', updatedNote);
	}
};

module.exports = updateNoteAction;
