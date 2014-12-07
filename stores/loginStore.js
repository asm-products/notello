var notelloDispatcher = require('../actions/notelloDispatcher');
var Store = require('../common/store');
var assign = require('object-assign');

var loginStore = assign(new Store(), {

	attemptedLogin: false,
	email: null,
	authToken: null
});

notelloDispatcher.registerDiscrete('attemptedLogin', function () {

	loginStore.attemptedLogin = true;

	loginStore.save();
});

notelloDispatcher.registerDiscrete('loggedIn', function (email, authToken) {

	loginStore.email = email;
	loginStore.authToken = authToken;

	loginStore.save();
});

notelloDispatcher.registerDiscrete('loggedOut', function () {

	loginStore.attemptedLogin = false;
	loginStore.email = null;
	loginStore.authToken = null;

	loginStore.save();
});

module.exports = loginStore;
