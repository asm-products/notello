
var dispatcher = require('./notelloDispatcher');
var api = require('../common/api');
var lscache = require('ls-cache');

var updateSelectedNoteAction = function (noteId) {

	if (lscache.get('isAuthenticated')) {		

		api({
			url: 'api/selected/' + noteId,
			method: 'post',
			data: {
				'_METHOD': 'PUT'
			},
			success: function (resp) {
				
				// Nothing to do here
		    }
		});

	} else {

		lscache.set('lastSelectedNote', noteId);
	}
};

module.exports = updateSelectedNoteAction;
