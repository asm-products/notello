var React = require('react');
var Notepad = require('../notepad/notepad');
var Bookcase = require('../bookcase/bookcase');
var hideBookshelf = require('../../../actions/hideBookshelf');
var ReactAddons = require('react-addons');
var cx = ReactAddons.classSet;
var Header = require('../header/header');

var deskComponent = React.createClass({

	handleClick: function (event) {

		event.preventDefault();

		hideBookshelf();
	},

	componentDidMount: function () {

		var deskDOMNode = this.refs.divDesk.getDOMNode();
		var calculatedHeight = window.innerHeight - deskDOMNode.offsetTop;

		deskDOMNode.style.minHeight = calculatedHeight + 'px';
	},

	render: function () {

		var classes = cx({
			desk: true,
			'animate-desk': this.props.isViewingBookshelf
		});

		return 	<div className="desk-container">
					<div id="divDesk" ref="divDesk" className={classes} onTouchEnd={this.handleClick} onClick={this.handleClick}>
						<Header isViewingBookshelf={this.props.isViewingBookshelf} />
						<Notepad isViewingBookshelf={this.props.isViewingBookshelf} />
					</div>
				</div>
	}

});

module.exports = deskComponent;
