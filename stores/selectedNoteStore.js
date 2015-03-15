var notelloDispatcher = require('../actions/notelloDispatcher');
var Store = require('../common/store');
var assign = require('object-assign');
var lscache = require('ls-cache');
var updateSelectedNoteAction = require('../actions/updateSelectedNote');

var selectedNoteStore = assign(new Store(), {

	noteId: null,
	noteTitle: '',
	noteText: '',
	isChanging: false
});

notelloDispatcher.registerDiscrete('deleteNoteCompleted', function () {

	selectedNoteStore.noteId = null;
	selectedNoteStore.noteTitle = '';
	selectedNoteStore.noteText = '';

	if (!lscache.get('isAuthenticated')) {
		lscache.remove('lastSelectedNote');
	}

	selectedNoteStore.save();
});

notelloDispatcher.registerDiscrete('createNoteCompleted', function (notePayload) {

	selectedNoteStore.noteId = notePayload.newNote.noteId;
	selectedNoteStore.noteTitle = notePayload.newNote.noteTitle;
	selectedNoteStore.noteText = notePayload.newNote.noteText;

	updateSelectedNoteAction(selectedNoteStore.noteId);

	selectedNoteStore.save();
});

notelloDispatcher.registerDiscrete('updateNoteCompleted', function (notePayload) {

	selectedNoteStore.noteId = notePayload.noteId;
	selectedNoteStore.noteTitle = notePayload.noteTitle;
	selectedNoteStore.noteText = notePayload.noteText;

	selectedNoteStore.save();
});

notelloDispatcher.registerDiscrete('selectedNote', function (note) {

	if (note && note.noteId !== selectedNoteStore.noteId) {

		selectedNoteStore.isChanging = false;
		selectedNoteStore.noteId = note.noteId;
		selectedNoteStore.noteTitle = note.noteTitle;
		selectedNoteStore.noteText = note.noteText;

		updateSelectedNoteAction(selectedNoteStore.noteId);

		selectedNoteStore.save();
	}

});

notelloDispatcher.registerDiscrete('selectedNoteChange', function () {

	selectedNoteStore.isChanging = true;

	selectedNoteStore.save();
});

module.exports = selectedNoteStore;
