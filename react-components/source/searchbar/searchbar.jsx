var React = require('react');
var ReactAddons = require('react-addons');
var cx = ReactAddons.classSet;
var domUtils = require('../../../common/dom-utils');
var bookShelfStore = require('../../../stores/bookshelfStore');

var searchbarComponent = React.createClass({

	getInitialState: function () {
		return {
			isFocused: false
		};
	},

	handleFocus: function (event) {

		this.setState({
			isFocused: true
		});
	},

	handleBlur: function (event) {

		this.setState({
			isFocused: false
		});
	},

	render: function () {

		var classes = cx({
			'searchbar-container': true,
			'search-focused': this.state.isFocused
		});

		return 	<div className={classes}>
					<div className="searchbar-wrapper generic-transition">
						<label htmlFor="txtSearch">
							<span className="search ion-android-search" title="Search notes"></span>
						</label>
						<input id="txtSearch" type="text" placeholder="Search your notes" className="search-text generic-transition" onBlur={this.handleBlur} onFocus={this.handleFocus} disabled={domUtils.isMobile && !bookShelfStore.isViewingBookshelf} />
					</div>
				</div>;
	}

});

module.exports = searchbarComponent;
