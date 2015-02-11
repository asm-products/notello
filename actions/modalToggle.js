
var dispatcher = require('./notelloDispatcher');

var modalToggle = {

	opened: function () {

		dispatcher.dispatchDiscrete('modalOpened');
	},

	closed: function () {

		dispatcher.dispatchDiscrete('modalClosed');
	}
};

module.exports = modalToggle;
