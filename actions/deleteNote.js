
var dispatcher = require('./notelloDispatcher');
var api = require('../common/api');

var deleteNoteAction = function (noteId) {

	api({
		url: 'api/note',
		method: 'post',
		data: {
			'_METHOD': 'DELETE',
			noteId: noteId
		},
		success: function () {
			
			dispatcher.dispatchDiscrete('deleteNoteCompleted');
	    }
	});
};

module.exports = deleteNoteAction;
