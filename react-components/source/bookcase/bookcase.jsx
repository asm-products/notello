var React = require('react');
var ReactAddons = require('react-addons');
var cx = ReactAddons.classSet;
var Searchbar = require('../searchbar/searchbar');

var bookcaseComponent = React.createClass({

	render: function () {

		var classes = cx({
			bookcase: true,
			'bookcase-shown': this.props.isViewingBookshelf
		});

		return 	<div ref="divBookcase" className={classes}>
					<div className="wall">
						<div className="shelf">
							<div className="shelf-border"></div>
							<div style={{ height: '100px' }}>
								<Searchbar />
								<img src="dist/images/archivebox.png" className="archive-box" />
								<img src="dist/images/notebook.png" className="notebook" />
								<img src="dist/images/paper.png" className="paper" />
								<span className="add-item ion-plus-circled" title="Add a new item"></span>
							</div>
							<div className="shelf-border"></div>
						</div>
					</div>
				</div>;
	}

});

module.exports = bookcaseComponent;
