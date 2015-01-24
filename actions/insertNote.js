
var dispatcher = require('./notelloDispatcher');
var api = require('../common/api');

var insertNoteAction = function (noteText) {

	api({
		url: 'api/note',
		method: 'post',
		data: {
			noteText: noteText
		},
		success: function () {
			
			dispatcher.dispatchDiscrete('insertNoteCompleted');
	    }
	});
};

module.exports = insertNoteAction;
