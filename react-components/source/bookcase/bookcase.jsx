var React = require('react');
var ReactAddons = require('react-addons');
var cx = ReactAddons.classSet;

var bookcaseComponent = React.createClass({

	render: function () {

		var classes = cx({
			'bookcase-shown': this.props.isViewingBookshelf,
			bookcase: true
		});

		return 	<div ref="divBookcase" className={classes}>
					<div className="wall">
						<div className="shelf">
							<img src="dist/images/bookshelf-small.jpg" className="img-shelf" />
						</div>
						<div className="shelf">
							<img src="dist/images/bookshelf-small.jpg" className="img-shelf" />
						</div>
					</div>
				</div>;
	}

});

module.exports = bookcaseComponent;
