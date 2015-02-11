
var assign = require('object-assign');
var Dispatcher = require('./Dispatcher');
var actions = {};

module.exports = assign(new Dispatcher(), {

	registerDiscrete: function (actionName, callback) {

		if (this.actionList.indexOf(actionName) !== -1) {

			actions[actionName] = callback;
		} else {
			throw new Error(actionName + ' is not in the actionList array for the notelloDispatcher.');
		}
	},

	dispatchDiscrete: function (actionName, payLoad) {

		if (actions.hasOwnProperty(actionName)) {

			actions[actionName](payLoad);
		}
	},

	actionList: [

		'viewBookshelf',
		'hideBookshelf',
		'sendLoginEmail',
		'attemptedLogin',
		'loggedIn',
		'loggedOut',
		'resetToken',
		'shelfHidden',
		'getNoteCompleted',
		'getUserNotesCompleted',
		'updateUserNotesCompleted',
		'updateNoteCompleted',
		'createNoteCompleted',
		'selectedNote',
		'createNotebookCompleted',
		'createBoxCompleted',
		'modalClosed',
		'modalOpened'
	]
});
