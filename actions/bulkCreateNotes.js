
var dispatcher = require('./notelloDispatcher');
var api = require('../common/api');
var lscache = require('ls-cache');
var updateUserNotesAction = require('../actions/updateUserNotes');
var domUtility = require('../common/dom-utils');

var bulkCreateNotesAction = function (userNotes, notes) {

	if (!notes || notes.length === 0) {
		return;
	}

	api({
		url: 'api/notes',
		method: 'post',
		data: {
			notes: notes
		},
		success: function () {

			updateUserNotesAction(userNotes);
		}
	});
};

module.exports = bulkCreateNotesAction;
