var notelloDispatcher = require('../actions/notelloDispatcher');
var Store = require('../common/store');
var assign = require('object-assign');
var lscache = require('ls-cache');

var selectedNoteStore = assign(new Store(), {

	noteId: null,
	noteTitle: '',
	noteText: ''
});

notelloDispatcher.registerDiscrete('createNoteCompleted', function (notePayload) {

	selectedNoteStore.noteId = notePayload.newNote.noteId;
	selectedNoteStore.noteTitle = notePayload.newNote.noteTitle;
	selectedNoteStore.noteText = notePayload.newNote.noteText;

	if (!lscache.get('isAuthenticated')) {
		lscache.set('lastSelectedNote', selectedNoteStore.noteId);
	}

	selectedNoteStore.save();
});

notelloDispatcher.registerDiscrete('updateNoteCompleted', function (notePayload) {

	selectedNoteStore.noteId = notePayload.noteId;
	selectedNoteStore.noteTitle = notePayload.noteTitle;
	selectedNoteStore.noteText = notePayload.noteText;

	if (!lscache.get('isAuthenticated')) {
		lscache.set('lastSelectedNote', selectedNoteStore.noteId);
	}

	selectedNoteStore.save();
});

notelloDispatcher.registerDiscrete('selectedNote', function (note) {

	selectedNoteStore.noteId = note.noteId;
	selectedNoteStore.noteTitle = note.noteTitle;
	selectedNoteStore.noteText = note.noteText;

	if (!lscache.get('isAuthenticated')) {
		lscache.set('lastSelectedNote', selectedNoteStore.noteId);
	}

	selectedNoteStore.save();
});

module.exports = selectedNoteStore;
