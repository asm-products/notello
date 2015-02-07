
var dispatcher = require('./notelloDispatcher');
var api = require('../common/api');
var _ = require('underscore');

var updateNoteAction = _.debounce(function (noteId, noteTitle, noteText) {

	api({
		url: 'api/note/' + noteId,
		method: 'post',
		data: {
			'_METHOD': 'PUT',
			noteTitle: noteTitle,
			noteText: noteText
		},
		success: function () {
			
			dispatcher.dispatchDiscrete('updateNoteCompleted');
	    }
	});

}, 5000);

module.exports = updateNoteAction;
