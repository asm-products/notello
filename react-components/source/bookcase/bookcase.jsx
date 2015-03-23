var React = require('react');
var ReactAddons = require('react-addons');
var cx = ReactAddons.classSet;
var Searchbar = require('../searchbar/searchbar');
var NewItem = require('../newitem/newitem');
var UserNotes = require('../usernotes/usernotes');
var _ = require('underscore');
var wallIsScrollingAction = require('../../../actions/wallIsScrolling');

var bookcaseComponent = React.createClass({

	handleAddItem: function (event) {

		this.refs.newItem.open();
	},

	_detectStoppedScrolling: _.debounce(function(){
		wallIsScrollingAction(false);
	}, 400),

	handleScroll: function (event) {

		wallIsScrollingAction(true);

		this._detectStoppedScrolling();
	},

	render: function () {

		var classes = cx({
			bookcase: true,
			'bookcase-shown': this.props.isViewingBookshelf
		});

		return 	<div ref="divBookcase" className={classes}>
					<Searchbar />
					<div className="wall" onScroll={this.handleScroll}>
						<div className="shelf">
							<div className="top-shelf shelf-border">
								<div className="logo">Notello</div>
							</div>
							<div className="item-container">
								<span className="add-item ion-plus-circled" title="Add a new note, notebook, or box" onClick={this.handleAddItem} onTouchEnd={this.handleAddItem}></span>
								<UserNotes />
							</div>
							<div className="bottom-shelf shelf-border"></div>
						</div>
					</div>
					<NewItem ref="newItem" />
				</div>;
	}

});

module.exports = bookcaseComponent;
