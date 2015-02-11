var React = require('react');
var ReactAddons = require('react-addons');
var cx = ReactAddons.classSet;
var _s = require('underscore.string');
var domUtils = require('../../../common/dom-utils');
var moment = require('moment');
var $ = require('jquery');
var updateNoteAction = require('../../../actions/updateNote');
var selectedNoteStore = require('../../../stores/selectedNoteStore');
var bookShelfStore = require('../../../stores/bookshelfStore');
var modalStore = require('../../../stores/modalStore');

var cursor = null;

var moveCursor = function (domNode) {

	var currentPosition = domUtils.getCaret(domNode);
	var text = _s.insert(domNode.value, currentPosition, 'D258DC19ED0D4065AAB60FEAAC8029A6');

	return text;
};

var replaceCursor = function (text) {

	return text.replace(/D258DC19ED0D4065AAB60FEAAC8029A6/, domUtils.iOS ? '' : '<span id="spanCaret" style="display: inline;" class="caret blink-me">|</span>');
};

var showCaret = function () {

	var caret = document.getElementById('spanCaret');

	if (caret) {
		
		caret.style.display = 'inline';
	}
};

var hideCaret = function () {

	var caret = document.getElementById('spanCaret');

	if (caret) {

		caret.style.display = 'none';
	}
};

var notepadComponent = React.createClass({

	_selectedNote: function () {

		this.setState({
			noteId: selectedNoteStore.noteId,
			noteTitle: selectedNoteStore.noteTitle,
			noteText: selectedNoteStore.noteText
		});
	},

	_modalOpened: function () {

		this.forceUpdate();
	},

	getInitialState: function() {
    	return {
    		noteId: null,
    		noteTitle: '',
    		noteText: ''
    	};
	},

	componentDidMount: function () {

		selectedNoteStore.onChange(this._selectedNote);
		modalStore.onChange(this._modalOpened);
	},

	handleChange: function (event) {

		var text = moveCursor(event.target);
		var lines = text.split(/\r\n|\r|\n/g);
		var finalTextArray = [];
		var finalText = '';

		lines.map(function (line) {

			var words = line.split(' ');
			var styledText = [];
			var outputText = '';

			words.map(function (word) {

				if (_s.startsWith(word, '#') || _s.startsWith(word, 'D258DC19ED0D4065AAB60FEAAC8029A6#')) {

					word = '<span class="hashtag">' + word + '</span>';
				}

				styledText.push(word);
			});

			outputText = styledText.join('&nbsp;');

			outputText = replaceCursor(outputText);

			finalTextArray.push(outputText);
		});

		finalText = finalTextArray.join('\r\n');

		updateNoteAction(this.state.noteId, this.state.noteTitle, finalText);
		
	    this.setState({ 
	    	noteText: finalText
	    });
		
		showCaret();
	},

	handleTitleChange: function (event) {

		updateNoteAction(this.state.noteId, event.target.value, this.state.noteText);

		this.setState({
			noteTitle: event.target.value
		});
	},

	handleBlur: function (event) {

		hideCaret();
	},

	render: function () {

		var lineCount = Math.floor($('#txtHiddenTextArea').prop('scrollHeight') / 40) || this.state.noteText.split(/\r\n|\r|\n/g).length;

		var calculatedNotepadHeight = lineCount < 8 ? 360 : 360 + ((lineCount - 7) * 40);

		var value = this.state.noteText.replace(/(?:\r\n|\r|\n)/g, '<br />');

		var txtAreaCSSClasses = cx({
			'ios': domUtils.iOS,
			'txt-area': true,
			'txt-area-hidden': true,
			'hide': this.props.isViewingBookshelf
		});

		var shouldBeDisabled = (modalStore.numberOfModalsOpened > 0) || (domUtils.isMobile && bookShelfStore.isViewingBookshelf);

		return 	<div className="notepad" style={{ height: calculatedNotepadHeight + 'px' }}>
					<div className="pink-divider"></div>
					<div className="notepad-header">
						<input className="notepad-title" type="text" maxLength="25" placeholder="Enter a title" onChange={this.handleTitleChange} disabled={shouldBeDisabled} />
						<span className="notepad-date">{moment(new Date()).format("MM/DD/YYYY")}</span>
					</div>
					<div className="txt-area txt-area-div" dangerouslySetInnerHTML={{__html: value}}></div>
					<textarea id="txtArea" className={txtAreaCSSClasses} onBlur={this.handleBlur} onFocus={this.handleChange} onKeyDown={this.handleChange} 
					onKeyUp={this.handleChange} onClick={this.handleChange} onChange={this.handleChange} disabled={shouldBeDisabled}></textarea>
					<textarea id="txtHiddenTextArea" style={{ display: 'none' }} defaultValue={this.state.noteText} />
				</div>;
	}

});

module.exports = notepadComponent;
