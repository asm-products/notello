
var assign = require('object-assign');
var Dispatcher = require('./Dispatcher');
var actions = {};

module.exports = assign(new Dispatcher(), {

	registerDiscrete: function (actionName, callback) {

		if (this.actionList.indexOf(actionName) !== -1) {

			if (!actions[actionName]) {

				actions[actionName] = [callback];

			} else {

				actions[actionName].push(callback);
			}

		} else {

			throw new Error(actionName + ' is not in the actionList array for the notelloDispatcher.');
		}
	},

	dispatchDiscrete: function (actionName, payLoad) {

		if (actions.hasOwnProperty(actionName)) {

			actions[actionName].map(function (callback) {

				callback(payLoad);
			});
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
