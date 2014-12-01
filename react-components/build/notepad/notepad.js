/** @jsx React.DOM */
var React = require('react');

var notepadComponent = React.createClass({displayName: 'notepadComponent',

	render: function () {
		return React.DOM.div(null, "test");
	}

});

module.exports = notepadComponent;
