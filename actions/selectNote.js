
var dispatcher = require('./notelloDispatcher');
var lscache = require('ls-cache');

var selectNoteAction = function (noteId) {

	if (lscache.get('isAuthenticated')) {

		api({
			url: 'api/note/' + noteId,
			method: 'get',
			cache: false,
			success: function (resp) {
				
				dispatcher.dispatchDiscrete('selectedNote', {

					noteId: resp.noteId,
					noteText: resp.noteText
				});
		    }
		});

	} else {

		dispatcher.dispatchDiscrete('selectedNote', lscache.get('unAuthNote_' + noteId));
	}

};

module.exports = selectNoteAction;
