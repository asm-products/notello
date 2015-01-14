var notelloDispatcher = require('../actions/notelloDispatcher');
var Store = require('../common/store');
var assign = require('object-assign');

var bookShelfStore = assign(new Store(), {

	isViewingBookshelf: false
});

notelloDispatcher.registerDiscrete('viewBookshelf', function () {

	bookShelfStore.isViewingBookshelf = true;
	bookShelfStore.save();
});

notelloDispatcher.registerDiscrete('hideBookshelf', function () {

	bookShelfStore.isViewingBookshelf = false;
	bookShelfStore.save();
});

module.exports = bookShelfStore;
