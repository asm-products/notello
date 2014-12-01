
var assign = require('object-assign');
var Dispatcher = require('./Dispatcher');
var actions = {};

module.exports = assign(new Dispatcher(), {

	registerDiscrete: function (actionName, callback) {

		if (this.actionList.indexOf(actionName) !== -1) {

			actions[actionName] = callback;
		}
	},

	dispatchDiscrete: function (actionName, payLoad) {

		if (actions.hasOwnProperty(actionName)) {

			actions[actionName](payLoad);
		}
	},

	actionList: ['viewBookshelf', 'hideBookshelf', 'sendLoginEmail']
});
