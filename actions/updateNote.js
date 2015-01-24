
var dispatcher = require('./notelloDispatcher');
var api = require('../common/api');

var updateNoteAction = function (noteId, noteText) {

	api({
		url: 'api/note/' + noteId,
		method: 'post',
		data: {
			'_METHOD': 'PUT',
			noteText: noteText
		},
		success: function () {
			
			dispatcher.dispatchDiscrete('updateNoteCompleted');
	    }
	});
};

module.exports = updateNoteAction;
