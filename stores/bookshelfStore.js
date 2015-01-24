var notelloDispatcher = require('../actions/notelloDispatcher');
var Store = require('../common/store');
var assign = require('object-assign');

var bookShelfStore = assign(new Store(), {

	isViewingBookshelf: false,
	isDoneAnimating: true
});

notelloDispatcher.registerDiscrete('viewBookshelf', function () {

	bookShelfStore.isViewingBookshelf = true;
	bookShelfStore.isDoneAnimating = false;
	bookShelfStore.save();
});

notelloDispatcher.registerDiscrete('hideBookshelf', function () {

	bookShelfStore.isViewingBookshelf = false;
	bookShelfStore.isDoneAnimating = false;
	bookShelfStore.save();
});

notelloDispatcher.registerDiscrete('shelfHidden', function () {

	bookShelfStore.isViewingBookshelf = false;
	bookShelfStore.isDoneAnimating = true;
	bookShelfStore.save();
});

module.exports = bookShelfStore;
