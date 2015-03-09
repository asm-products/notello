
var dispatcher = require('./notelloDispatcher');
var api = require('../common/api');

var getNoteAction = function (noteId) {

	api({
		url: 'api/note/' + noteId,
		method: 'get',
		cache: false,
		success: function (resp) {
			
			dispatcher.dispatchDiscrete('getNoteCompleted', {

				noteId: resp.noteId,
				noteTitle: resp.noteTitle,
				noteText: resp.noteText
			});
	    }
	});
};

module.exports = getNoteAction;
