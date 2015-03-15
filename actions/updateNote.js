
var dispatcher = require('./notelloDispatcher');
var api = require('../common/api');
var _ = require('underscore');
var lscache = require('ls-cache');
var updateUserNotes = require('./updateUserNotes');

var _updateNoteDatabase = _.debounce(function (updatedNote) {

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

}, 3000);

var updateNoteAction = function (updatedNote) {

	if (!updatedNote.noteId) {
		return false;
	}
		
	dispatcher.dispatchDiscrete('updateNoteCompleted', updatedNote);
	
	if (lscache.get('isAuthenticated')) {

		_updateNoteDatabase(updatedNote);

	} else {

		lscache.set('unAuthNote_' + updatedNote.noteId, updatedNote);
	}
};

module.exports = updateNoteAction;
