var React = require('react');
var ReactAddons = require('react-addons');
var cx = ReactAddons.classSet;

var linksComponent = React.createClass({

	render: function () {

		var classes = cx({
			'links-container generic-transition': true,
			'link-show': this.props.linkArray.length > 0
		});

		var margin = Math.max(this.props.lineCount, 7) * 40;

		return 	<div className={classes} style={{ marginTop: margin + 'px' }}>
					<div className="links-sub-container">
						{this.props.linkArray.map(function (link, index) {

							return <a href={link} key={index} className="notepad-link generic-transition" target="_blank">{link}</a>;
						})}
					</div>
				</div>;
	}

});

module.exports = linksComponent;
