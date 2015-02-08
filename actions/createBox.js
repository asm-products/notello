
var dispatcher = require('./notelloDispatcher');
var api = require('../common/api');

var createBoxAction = function (userNotes, boxName) {

	if (!userNotes) {
		userNotes = [];
	}

	userNotes.push({

		itemType: 'box',
		boxName: boxName
	});

	dispatcher.dispatchDiscrete('createBoxCompleted', userNotes);

	api({
		url: 'api/usernotes',
		method: 'post',
		data: {
			'_METHOD': 'PUT',
			userNotes: userNotes
		},
		success: function (result) {
			
			dispatcher.dispatchDiscrete('createBoxCompleted', result.userNotes);
	    }
	});
};

module.exports = createBoxAction;
