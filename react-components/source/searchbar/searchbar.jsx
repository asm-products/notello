var React = require('react');
var ReactAddons = require('react-addons');
var cx = ReactAddons.classSet;

var searchbarComponent = React.createClass({

	handleClick: function (event) {

		alert('test');
	},

	render: function () {

		return <span className="search ion-android-search" title="Search notes" onClick={this.handleClick}></span>;
	}

});

module.exports = searchbarComponent;
