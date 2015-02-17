var notelloDispatcher = require('../actions/notelloDispatcher');
var Store = require('../common/store');
var assign = require('object-assign');

var bookShelfStore = assign(new Store(), {

	isViewingBookshelf: false,
	isDoneAnimating: true,
	userNotes: null
});

notelloDispatcher.registerDiscrete('viewBookshelf', function () {

	bookShelfStore.isViewingBookshelf = true;
	bookShelfStore.isDoneAnimating = false;
	bookShelfStore.save();
});

notelloDispatcher.registerDiscrete('hideBookshelf', function () {

	bookShelfStore.isViewingBookshelf = false;
	bookShelfStore.save();
});

notelloDispatcher.registerDiscrete('shelfHidden', function () {

	bookShelfStore.isViewingBookshelf = false;
	bookShelfStore.isDoneAnimating = true;
	bookShelfStore.save();
});

notelloDispatcher.registerDiscrete('createNoteCompleted', function (createNotePayload) {

	bookShelfStore.userNotes = createNotePayload.userNotes;
	bookShelfStore.save();
});

notelloDispatcher.registerDiscrete('createNotebookCompleted', function (userNotes) {

	bookShelfStore.userNotes = userNotes;
	bookShelfStore.save();
});

notelloDispatcher.registerDiscrete('getUserNotesCompleted', function (userNotes) {

	bookShelfStore.userNotes = userNotes;
	bookShelfStore.save();
});

module.exports = bookShelfStore;
