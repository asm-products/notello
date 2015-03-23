
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

	//dispatcher.dispatchDiscrete('createBoxCompleted', userNotes);

	if (lscache.get('isAuthenticated')) {	

		api({
			url: 'api/usernotes',
			method: 'post',
			data: {
				'_METHOD': 'PUT',
				userNotes: userNotes
			},
			success: function (result) {
				
				//dispatcher.dispatchDiscrete('createBoxCompleted', result.userNotes);
		    }
		});

	} else {

		lscache.set('unAuthUserNotes', userNotes);
	}
};

module.exports = createBoxAction;
