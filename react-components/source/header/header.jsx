var React = require('react');
var ReactAddons = require('react-addons');
var cx = ReactAddons.classSet;
var viewBookshelf = require('../../../actions/viewBookshelf');
var Login = require('../login/login');

var headerComponent = React.createClass({

	handleClick: function (event) {

		viewBookshelf();
	},

	render: function () {

		var classes = cx({
			'bookshelf-icon': true,
			'generic-transition': true,
			'visible': !this.props.isViewingBookshelf,
		    'invisible': this.props.isViewingBookshelf
		});

		return 	<header className="header">
					<span className={classes} title="View bookshelf" onClick={this.handleClick}><img src="dist/images/bookshelf.png" /></span>
					<Login />
				</header>;
	}

});

module.exports = headerComponent;
