
var dispatcher = require('./notelloDispatcher');
var api = require('../common/api');

var getUserNotesAction = function () {

	api({
		url: 'api/usernotes',
		method: 'get',
		cache: false,
		success: function (resp) {
			
			dispatcher.dispatchDiscrete('getUserNotesCompleted', JSON.parse(resp.userNotes));
	    }
	});
};

module.exports = getUserNotesAction;
