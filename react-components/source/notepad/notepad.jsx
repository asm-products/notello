var React = require('react');
var ReactAddons = require('react-addons');
var cx = ReactAddons.classSet;
var _s = require('underscore.string');
var domUtils = require('../../../common/dom-utils');
var moment = require('moment');

var moveCursor = function (domNode) {

	var currentPosition = domUtils.getCaret(domNode);
	var text = _s.insert(domNode.value, currentPosition, 'D258DC19ED0D4065AAB60FEAAC8029A6');

	return text;
};

var cursor = null;

var notepadComponent = React.createClass({

	getInitialState: function() {
    	return {
    		value: ''
    	};
	},

	handleChange: function (event) {

		var text = moveCursor(event.target);
		var words = text.split(' ');
		var styledText = [];
		var outputText = '';

		words.map(function (word) {

			if (_s.startsWith(word, '#')) {

				word = '<span class="hashtag">' + word + '</span>';
			}

			styledText.push(word);
		});

		outputText = styledText.join('&nbsp;');

		outputText = outputText.replace(/D258DC19ED0D4065AAB60FEAAC8029A6/, domUtils.iOS ? '' : '<span id="spanCaret" style="display: inline;" class="caret blink-me">|</span>');

	    this.setState({ value: outputText });
	},

	handleBlur: function (event) {

		document.getElementById('spanCaret').style.display = 'none';
	},

	render: function () {

		var value = this.state.value.replace(/(?:\r\n|\r|\n)/g, '<br />');

		var txtAreaCSSClasses = cx({
			'ios': domUtils.iOS,
			'txt-area': true,
			'txt-area-hidden': true,
			'hide': this.props.isViewingBookshelf
		});

		return 	<div className="notepad">
					<div className="pink-divider"></div>
					<div className="notepad-header">
						<input className="notepad-title" type="text" maxLength="14" placeholder="Enter a title" />
						<span className="notepad-date">{moment(new Date()).format("MM/DD/YYYY")}</span>
					</div>
					<div className="txt-area" dangerouslySetInnerHTML={{__html: value}}></div>
					<textarea id="txtArea" className={txtAreaCSSClasses} onKeyDown={this.handleChange} onBlur={this.handleBlur}
					onKeyUp={this.handleChange} onFocus={this.handleChange} onClick={this.handleChange} onChange={this.handleChange}></textarea>
				</div>;
	}

});

module.exports = notepadComponent;
