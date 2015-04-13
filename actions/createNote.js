
var dispatcher = require('./notelloDispatcher');
var api = require('../common/api');
var lscache = require('ls-cache');
var updateUserNotesAction = require('../actions/updateUserNotes');
var domUtility = require('../common/dom-utils');

var _updateUserNotes = function (userNotes, noteId, noteTitle) {

	// Modify usernotes array
	userNotes.push({
		itemType: 'note',
		noteId: noteId,
		noteTitle: noteTitle
	});

	updateUserNotesAction(userNotes);
};

var createNoteAction = function (userNotes, noteTitle, noteText) {

	// Get animation going
	dispatcher.dispatchDiscrete('selectedNoteChange');

	// The new note to create
	var newNote = {

		noteId: domUtility.randomUUID(),
		noteTitle: noteTitle,
		noteText: noteText
	};

	// Update usernotes to make it seem seamless
	_updateUserNotes(userNotes, newNote.noteId, noteTitle);

	if (lscache.get('isAuthenticated')) {		

		// Add this note to the database
		api({
			url: 'api/note',
			method: 'post',
			data: {
				noteId: newNote.noteId,
				noteTitle: noteTitle,
				noteText: noteText
			},
			success: function (result) {

		    }
		});

		dispatcher.dispatchDiscrete('selectedNote', newNote);

	} else {

		// Create lscache entry for this new note
		lscache.set('unAuthNote_' + newNote.noteId, newNote);

		// Let the stores know the selected note can be changed
		dispatcher.dispatchDiscrete('selectedNote', lscache.get('unAuthNote_' + newNote.noteId));
	}

	dispatcher.dispatchDiscrete('createNoteCompleted', {
		userNotes: userNotes,
		newNote: newNote
	});
};

module.exports = createNoteAction;
