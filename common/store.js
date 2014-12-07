
var Store = function () {
	this.callbacks = [];
};

Store.prototype.save = function () {
	this.callbacks.map(function (callback) {
		callback();
	});
};

Store.prototype.onChange = function (callback) {
	this.callbacks.push(callback);
};

module.exports = Store;
