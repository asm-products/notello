var notelloDispatcher = require('../actions/notelloDispatcher');
var Store = require('../common/store');
var assign = require('object-assign');

var modalStore = assign(new Store(), {

	numberOfModalsOpened: 0
});

notelloDispatcher.registerDiscrete('modalOpened', function () {

	modalStore.numberOfModalsOpened += 1;

	modalStore.save();
});

notelloDispatcher.registerDiscrete('modalClosed', function () {

	modalStore.numberOfModalsOpened = modalStore.numberOfModalsOpened === 0 ? 0 : (modalStore.numberOfModalsOpened - 1);

	modalStore.save();
});

module.exports = modalStore;
