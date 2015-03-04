var React = require('react');
var Notepad = require('../notepad/notepad');
var Bookcase = require('../bookcase/bookcase');
var hideBookshelf = require('../../../actions/hideBookshelf');
var ReactAddons = require('react-addons');
var cx = ReactAddons.classSet;
var Header = require('../header/header');
var _ = require('underscore');
var $ = require('jquery');
var selectedNoteStore = require('../../../stores/selectedNoteStore');
var viewBookShelfAction = require('../../../actions/viewBookshelf');

var deskComponent = React.createClass({

	_adjustMinHeight: _.throttle(function () {

		var deskDOMNode = this.refs.divDesk.getDOMNode();
		var calculatedHeight = window.innerHeight - deskDOMNode.offsetTop;

		deskDOMNode.style.minHeight = calculatedHeight + 'px';

	}, 50),

	handleClick: function (event) {

		event.preventDefault();

		if (this.props.isViewingBookshelf) {

			if ('activeElement' in document) {
		    	document.activeElement.blur();
			}
			
			hideBookshelf();
		}
	},

	componentDidMount: function () {

		var self = this;

		selectedNoteStore.onChange(function () {
			self.forceUpdate();
		});
		this._adjustMinHeight();
		$(window).resize(this._adjustMinHeight);
	},

	handleBlankUserNotesClick: function (event) {

		viewBookShelfAction();
	},

	render: function () {

		var classes = cx({
			desk: true,
			'animate-desk': this.props.isViewingBookshelf,
			'animating-desk': !this.props.isDoneAnimating
		});

		return 	<div className="desk-container">
					<div id="divDesk" ref="divDesk" className={classes} onTouchEnd={this.handleClick} onClick={this.handleClick}>
						<Header isViewingBookshelf={this.props.isViewingBookshelf} />
						<Notepad isViewingBookshelf={this.props.isViewingBookshelf} />
						{!selectedNoteStore.noteId && <div className="noselected-item" onClick={this.handleBlankUserNotesClick} onTouchEnd={this.handleBlankUserNotesClick}>
							CREATE OR SELECT A NOTE
						</div>}
					</div>
				</div>
	}

});

module.exports = deskComponent;
