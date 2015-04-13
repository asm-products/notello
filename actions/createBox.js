
var dispatcher = require('./notelloDispatcher');
var api = require('../common/api');
var lscache = require('ls-cache');
var domUtility = require('../common/dom-utils');

var createBoxAction = function (userNotes, boxTitle) {

	if (!userNotes) {
		userNotes = [];
	}

	userNotes.push({

		boxId: domUtility.randomUUID(),
		itemType: 'box',
		boxTitle: boxTitle,
		items: []
	});

	if (lscache.get('isAuthenticated')) {	

		api({
			url: 'api/usernotes',
			method: 'post',
			data: {
				'_METHOD': 'PUT',
				usernotes: userNotes
			},
			success: function (result) {
		    }
		});

	} else {

		lscache.set('unAuthUserNotes', userNotes);
	}

	//dispatcher.dispatchDiscrete('createBoxCompleted', userNotes);
	dispatcher.dispatchDiscrete('updateUserNotesCompleted', userNotes);
};

module.exports = createBoxAction;
