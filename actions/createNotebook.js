
var dispatcher = require('./notelloDispatcher');
var api = require('../common/api');

var createNotebookAction = function (userNotes, notebookName) {

	if (!userNotes) {
		userNotes = [];
	}

	userNotes.push({

		itemType: 'notebook',
		notebookName: notebookName,
		notes: [{
			itemType: 'note',
			noteTitle: '',
			noteText: ''
		}]
	});

	dispatcher.dispatchDiscrete('createNotebookCompleted', userNotes);

	api({
		url: 'api/usernotes',
		method: 'post',
		data: {
			'_METHOD': 'PUT',
			userNotes: userNotes
		},
		success: function (result) {
			
			dispatcher.dispatchDiscrete('createNotebookCompleted', result.userNotes);
	    }
	});
};

module.exports = createNotebookAction;
