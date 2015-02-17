var notelloDispatcher = require('../actions/notelloDispatcher');
var Store = require('../common/store');
var assign = require('object-assign');

var selectedNoteStore = assign(new Store(), {

	noteId: null,
	noteTitle: '',
	noteText: ''
});

notelloDispatcher.registerDiscrete('createNoteCompleted', function (notePayload) {

	selectedNoteStore.noteId = notePayload.newNote.noteId;
	selectedNoteStore.noteTitle = notePayload.newNote.noteTitle;
	selectedNoteStore.noteText = notePayload.newNote.noteText;

	selectedNoteStore.save();
});

notelloDispatcher.registerDiscrete('selectedNote', function (note) {

	selectedNoteStore.noteId = note.noteId;
	selectedNoteStore.noteTitle = note.noteTitle;
	selectedNoteStore.noteText = note.noteText;

	selectedNoteStore.save();
});

module.exports = selectedNoteStore;
