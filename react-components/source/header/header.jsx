var React = require('react');
var ReactAddons = require('react-addons');
var cx = ReactAddons.classSet;
var viewBookshelf = require('../../../actions/viewBookshelf');
var Login = require('../login/login');

var headerComponent = React.createClass({

	handleClick: function (event) {

		event.preventDefault();
		event.stopPropagation();

		if ('activeElement' in document) {
		    document.activeElement.blur();
		}

		viewBookshelf();
	},

	render: function () {

		var bookShelfIconClasses = cx({
			'bracket-animation': true,
			'bookshelf-icon': true,
		    'invisible': this.props.isViewingBookshelf
		});

		return 	<header className="header">
					<span className={bookShelfIconClasses} title="View bookshelf" onTouchEnd={this.handleClick} onClick={this.handleClick}>
						<img src="dist/images/bookshelf.png" />
					</span>
					<div className="logo generic-transition">Notello<sup>alpha</sup></div>
					<Login />
				</header>;
	}

});

module.exports = headerComponent;
