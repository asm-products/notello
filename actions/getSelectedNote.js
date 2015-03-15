
var dispatcher = require('./notelloDispatcher');
var api = require('../common/api');
var lscache = require('ls-cache');
var selectedNoteAction = require('./selectNote');

var getSelectedNoteAction = function () {

	if (lscache.get('isAuthenticated')) {		

		api({
			url: 'api/selected',
			method: 'get',
			success: function (resp) {
				
				selectedNoteAction(resp.noteId);
		    }
		});

	} else {

		selectedNoteAction(lscache.get('lastSelectedNote'));
	}
};

module.exports = getSelectedNoteAction;
