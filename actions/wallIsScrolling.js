var dispatcher = require('./notelloDispatcher');

var wallIsScrolling = function (isWallScrolling) {

	dispatcher.dispatchDiscrete('wallIsScrolling', isWallScrolling);
};

module.exports = wallIsScrolling;
