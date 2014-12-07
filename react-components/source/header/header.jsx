var React = require('react');
var ReactAddons = require('react-addons');
var cx = ReactAddons.classSet;
var viewBookshelf = require('../../../actions/viewBookshelf');
var Login = require('../login/login');

var headerComponent = React.createClass({

	handleClick: function (event) {

		event.stopPropagation();

		viewBookshelf();
	},

	render: function () {

		var classes = cx({
			'bookshelf-icon': true,
			'generic-transition': true,
		    'invisible': this.props.isViewingBookshelf
		});

		return 	<header className="header">
					<span className={classes} title="View bookshelf" onTouchEnd={this.handleClick} onClick={this.handleClick}><img src="dist/images/bookshelf.png" /></span>
					<div className="logo">Notello</div>
					<Login />
				</header>;
	}

});

module.exports = headerComponent;
