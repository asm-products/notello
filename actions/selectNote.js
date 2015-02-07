
var dispatcher = require('./notelloDispatcher');

var selectNoteAction = function (noteId, noteTitle, noteText) {
			
	dispatcher.dispatchDiscrete('selectedNote');

};

module.exports = selectNoteAction;
