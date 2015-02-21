
var dispatcher = require('./notelloDispatcher');
var api = require('../common/api');
var lscache = require('ls-cache');

var deleteNoteAction = function (noteId) {

	if (lscache.get('isAuthenticated')) {

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

	} else {

		lscache.remove('unAuthNote_' + noteId);
		dispatcher.dispatchDiscrete('deleteNoteCompleted');
	}
};

module.exports = deleteNoteAction;
