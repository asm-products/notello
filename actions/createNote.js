
var dispatcher = require('./notelloDispatcher');
var api = require('../common/api');

var createNoteAction = function (noteTitle, noteText) {

	api({
		url: 'api/note',
		method: 'post',
		data: {
			noteTitle: noteTitle,
			noteText: noteText
		},
		success: function (result) {
			
			dispatcher.dispatchDiscrete('createNoteCompleted', {

				noteId: result.noteId,
				noteTitle: noteTitle,
				noteText: noteText
			});
	    }
	});
};

module.exports = createNoteAction;
