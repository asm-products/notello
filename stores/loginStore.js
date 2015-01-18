var notelloDispatcher = require('../actions/notelloDispatcher');
var Store = require('../common/store');
var assign = require('object-assign');
var lscache = require('ls-cache');
var domUtils = require('../common/dom-utils');

// The loginStore is a special store which uses lscache to store values as opposed to
// an in memory object. This is because authentication details should persist on page refreshes, etc.
var loginStore = new Store();

if (!lscache.get('isAuthenticated')) {

	loginStore.pendingLogin = false;
	lscache.set('isAuthenticated', false);
	lscache.set('email', null);
	lscache.set('authToken', null);
}

notelloDispatcher.registerDiscrete('attemptedLogin', function () {

	loginStore.pendingLogin = true;

	loginStore.save();
});

notelloDispatcher.registerDiscrete('loggedIn', function (payload) {

	loginStore.pendingLogin = false;
	lscache.set('isAuthenticated', true);
	lscache.set('email', payload.email);
	lscache.set('authToken', payload.authToken);

	loginStore.save();
});

notelloDispatcher.registerDiscrete('loggedOut', function () {

	loginStore.pendingLogin = false;
	lscache.set('isAuthenticated', false);
	lscache.set('email', null);
	lscache.set('authToken', null);

	loginStore.save();
});

notelloDispatcher.registerDiscrete('resetToken', function () {

	loginStore.save();
});

module.exports = loginStore;
