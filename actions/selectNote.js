
var dispatcher = require('./notelloDispatcher');
var lscache = require('ls-cache');
var api = require('../common/api');

var selectNoteAction = function (noteId) {

	dispatcher.dispatchDiscrete('selectedNoteChange');

	if (!noteId || noteId === '') {
		dispatcher.dispatchDiscrete('selectedNote', null);
		return;
	}

	if (lscache.get('isAuthenticated')) {

		api({
			url: 'api/note/' + noteId,
			method: 'get',
			cache: false,
			success: function (resp) {
				
				dispatcher.dispatchDiscrete('selectedNote', {

					noteId: resp.noteId,
					noteTitle: resp.noteTitle,
					noteText: resp.noteText
				});
		    }
		});

	} else {

		dispatcher.dispatchDiscrete('selectedNote', lscache.get('unAuthNote_' + noteId));
	}

};

module.exports = selectNoteAction;
