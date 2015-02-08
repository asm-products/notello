var React = require('react');
var ReactAddons = require('react-addons');
var cx = ReactAddons.classSet;
var Searchbar = require('../searchbar/searchbar');
var $ = require('jquery');
var NewItem = require('../newitem/newitem');
var UserNotes = require('../usernotes/usernotes');

var bookcaseComponent = React.createClass({

	handleAddItem: function (event) {

		this.refs.newItem.open();
	},

	render: function () {

		var classes = cx({
			bookcase: true,
			'bookcase-shown': this.props.isViewingBookshelf
		});

		return 	<div ref="divBookcase" className={classes}>
					<div className="wall">
						<div className="shelf">
							<div className="top-shelf shelf-border">
								<Searchbar />
								<div className="logo">Notello</div>
							</div>
							<div className="item-container">
								<span className="add-item ion-plus-circled" title="Add a new note, notebook, or box" onClick={this.handleAddItem} onTouchEnd={this.handleAddItem} style={{ width: '40px' }}></span>
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
