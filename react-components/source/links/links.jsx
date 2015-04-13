var React = require('react');
var ReactAddons = require('react-addons');
var cx = ReactAddons.classSet;

var linksComponent = React.createClass({

	render: function () {

		var classes = cx({
			'links-container': true,
			'link-show': this.props.linkArray.length > 0
		});

		return 	<div className="links-container">
					{this.props.linkArray.map(function (link) {

						return <a href={link} target="_blank" className="notepad-link">{link}</a>;
					})}
				</div>;
	}

});

module.exports = linksComponent;
