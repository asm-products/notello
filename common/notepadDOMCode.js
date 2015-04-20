var domUtils = require('./dom-utils');
var _s = require('underscore.string');

var notepadDOMCode = {

	moveCursor: function (domNode) {

		var currentPosition = domUtils.getCaret(domNode);
		var text = _s.insert(domNode.value, currentPosition, 'D258DC19ED0D4065AAB60FEAAC8029A6');

		return text;
	},

	replaceCursor: function (text) {

		return text.replace(/D258DC19ED0D4065AAB60FEAAC8029A6/, domUtils.iOS ? '' : '<span id="spanCaret" style="display: inline;" class="caret blink-me">|</span>');
	},

	showCaret: function () {

		var caret = document.getElementById('spanCaret');

		if (caret) {
			
			caret.style.display = 'inline';
		}
	},

	hideCaret: function () {

		var caret = document.getElementById('spanCaret');

		if (caret) {

			caret.style.display = 'none';
		}
	},

	sanitizeHTML: function (html) {

		var newHTML = html.replace('<span id="spanCaret" style="display: inline;" class="caret blink-me">|</span>', '');

		return newHTML.replace(/(<[^>]*>)/g, '').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
	}

};

module.exports = notepadDOMCode;
