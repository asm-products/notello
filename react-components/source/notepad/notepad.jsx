// Libraries
var React = require('react');
var ReactAddons = require('react-addons');
var cx = ReactAddons.classSet;
var _s = require('underscore.string');
var moment = require('moment');
var $ = require('jquery');
var _ = require('underscore');
var rangy = require('rangy');
// Common code
var domUtils = require('../../../common/dom-utils');
var sounds = require('../../../common/sounds');
var notepadCode = require('../../../common/notepadDOMCode');
// Actions
var updateNoteAction = require('../../../actions/updateNote');
var updateUserNotesAction = require('../../../actions/updateUserNotes');
var deleteNoteAction = require('../../../actions/deleteNote');
// Stores
var selectedNoteStore = require('../../../stores/selectedNoteStore');
var bookShelfStore = require('../../../stores/bookshelfStore');
var modalStore = require('../../../stores/modalStore');
// Components
var ModalForm = require('../modal-form/modalForm');
var Links = require('../links/links');

var notepadComponent = React.createClass({

	_slideTimeout: null,

	_selectedNote: function () {

		var self = this;

		if (selectedNoteStore.isChanging) {

			$(self.refs.txtArea.getDOMNode()).val(notepadCode.sanitizeHTML(selectedNoteStore.noteText));

			clearTimeout(self._slideTimeout);

			self.setState({
				noteSelectionAnimating: true
			});

			sounds.play('swoosh');

		} else if (selectedNoteStore.noteId && selectedNoteStore.noteId !== self.state.noteId) {

			// This is a different note so we need to animate it in
			self._slideTimeout = setTimeout(function () {

				self.setState({
					noteSelectionAnimating: false,
					noteId: selectedNoteStore.noteId,
					noteTitle: selectedNoteStore.noteTitle,
					noteText: selectedNoteStore.noteText
				});

				$(self.refs.txtArea.getDOMNode()).val(notepadCode.sanitizeHTML(selectedNoteStore.noteText));
				$(self.refs.txtHiddenTextArea.getDOMNode()).val(notepadCode.sanitizeHTML(selectedNoteStore.noteText));

				self._slideTimeout = setTimeout(function () {

					self.setState({
						noteSelectionAnimating: null
					});

					notepadCode.hideCaret();

				}, 250);

			}, 550);

		} else if (selectedNoteStore.noteId) { // This is the same note

			self.setState({
				noteSelectionAnimating: null,
				noteId: selectedNoteStore.noteId,
				noteTitle: selectedNoteStore.noteTitle,
				noteText: selectedNoteStore.noteText
			});

		} else { // There is no note so we need to hide the notepad
			
			clearTimeout(self._slideTimeout);

			self.setState({
				noteSelectionAnimating: true
			});
		}

	},

	_modalOpened: function () {

		this.forceUpdate();
	},

	getInitialState: function() {
    	return {
    		noteId: null,
    		noteTitle: '',
    		noteText: '',
    		noteSelectionAnimating: null
    	};
	},

	_renderInterval: null,

	componentWillUnmount: function () {

		clearInterval(this._renderInterval);
	},

	componentDidMount: function () {

		var self = this;
		
		self._selectedNote();

		selectedNoteStore.onChange(self._selectedNote);
		modalStore.onChange(self._modalOpened);

		this._renderInterval = setInterval(function() {
			self.forceUpdate();
		}, 2000);
	},

	handleChange: function (event) {

		var text = notepadCode.moveCursor(event.target);
		var lines = text.split(/\r\n|\r|\n/g);
		var finalTextArray = [];
		var finalText = '';

		lines.map(function (line) {

			var words = line.split(' ');
			var styledText = [];
			var outputText = '';

			words.map(function (word) {

				var mockWord = word.replace('D258DC19ED0D4065AAB60FEAAC8029A6', '');

				word = word.replace(/</g, '&lt;').replace(/>/g, '&gt;');

				if (_s.startsWith(mockWord, '#')) {

					word = '<span class="hashtag">' + word + '</span>';
				}

				styledText.push(word);
			});

			outputText = styledText.join('&nbsp;');

			outputText = notepadCode.replaceCursor(outputText);

			finalTextArray.push(outputText);
		});

		finalText = finalTextArray.join('\r\n');

		var highlights = finalText.split('*');
		var highlightArray = [];

		highlights.map(function (highlight, index) {

			var mockHighlight = highlight.replace('<span id="spanCaret" style="display: inline;" class="caret blink-me">|</span>', '');

			if (index !== 0 && (!_s.startsWith(mockHighlight, '&nbsp;') && 
								!_s.startsWith(mockHighlight, '<') && 
								!_s.startsWith(mockHighlight, '\r'))) {

				highlight = '<span class="highlighted-text">' + highlight + '</span>';
			}

			highlightArray.push(highlight);
		});

		finalText = highlightArray.join('*');

		updateNoteAction({
			noteId: this.state.noteId,
			noteTitle: this.state.noteTitle,
			noteText: finalText
		});
		
		notepadCode.showCaret();
	},

	handleTitleChange: function (event) {

		var self = this;

		bookShelfStore.userNotes.map(function (userNoteItem) {

			if (userNoteItem.noteId === self.state.noteId) {

				userNoteItem.noteTitle = event.target.value;

			} else if (userNoteItem.itemType === 'box') {

				userNoteItem.items.map(function (boxItem) {
					
					if (boxItem.noteId === self.state.noteId) {

						boxItem.noteTitle = event.target.value;
					}
				});
			}
		});

		updateUserNotesAction(bookShelfStore.userNotes);

		updateNoteAction({
			noteId: self.state.noteId,
			noteTitle: event.target.value,
			noteText: self.state.noteText
		});
	},

	handleTitleKeyUp: function (event) {

		if (event.which === 13) {
			$(this.refs.txtArea.getDOMNode()).focus();
		}
	},

	handleBlur: function (event) {

		notepadCode.hideCaret();
	},

	handleSettingClick: function (event) {

		this.refs.settingsModal.open();

		// TODO: This is due to a bug in safari
		if (domUtils.isSafari) {
			$('html').css('overflow', 'hidden');
		}

		this.setState({
			settingsOpened: true
		});
	},

	handleSettingsClosed: function (event) {

		// TODO: This is due to a bug in safari
		if (domUtils.isSafari) {
			$('html').removeAttr('style');
		}

		this.setState({
			settingsOpened: false
		});

	},

	handleSettingsSaved: function (event) {

		var self = this;

		deleteNoteAction(selectedNoteStore.noteId);

		bookShelfStore.userNotes = bookShelfStore.userNotes.filter(function (userNoteItem) {

			if (userNoteItem.itemType === 'box') {

				userNoteItem.items = userNoteItem.items.filter(function (boxItem) {

					return boxItem.noteId !== self.state.noteId;
				});
			}

			return userNoteItem.noteId !== self.state.noteId;
		});

		updateUserNotesAction(bookShelfStore.userNotes);
		
		this.refs.settingsModal.close();
	},

	render: function () {

		// txtHiddenTextArea is used to calculate number of lines.
		var lineCount = Math.floor($('#txtArea').prop('scrollHeight') / 40) || this.state.noteText.split(/\r\n|\r|\n/g).length;
		var oldLineCount = Math.floor($('#txtHiddenTextArea').prop('scrollHeight') / 40) || this.state.noteText.split(/\r\n|\r|\n/g).length;

		var calculatedNotepadHeight = oldLineCount < 8 ? 360 : 360 + ((oldLineCount - 7) * 40);

		var value = this.state.noteText.replace(/(?:\r\n|\r|\n)/g, '<br />');

		var sanitizedText = notepadCode.sanitizeHTML(this.state.noteText);

		var txtAreaCSSClasses = cx({
			'ios': domUtils.iOS,
			'txt-area': true,
			'txt-area-hidden': true,
			'hide': this.props.isViewingBookshelf
		});

		var shouldBeDisabled = (modalStore.numberOfModalsOpened > 0) || (domUtils.isMobile && bookShelfStore.isViewingBookshelf);

		var notepadStyle = {
			height: calculatedNotepadHeight + 'px',
			position: this.state.settingsOpened && domUtils.isSafari ? 'static' : 'relative'
		};

		var notepadClasses = cx({
			'notepad': true,
			'slidenote slidenote-in': this.state.noteSelectionAnimating === false,
			'slidenote slidenote-out': this.state.noteSelectionAnimating === true
		});

		var showSettings = false;

		var links = _.uniq(sanitizedText.match(/\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[A-Z0-9+&@#\/%=~_|]/gi) || []);

		return 	<div>
					<div className={notepadClasses} style={notepadStyle}>
						<div className="pink-divider"></div>
						<div className="notepad-header">
							<input className="notepad-title" type="text" maxLength="25" placeholder="Enter a title" onChange={this.handleTitleChange} 
							disabled={shouldBeDisabled} value={this.state.noteTitle} onKeyUp={this.handleTitleKeyUp} />
							{showSettings && <span className="generic-transition notepad-gear ion-gear-b" onTouchEnd={this.handleSettingClick} onClick={this.handleSettingClick}></span>}
						</div>
						<div ref="txtAreaContent" className="txt-area txt-area-div" dangerouslySetInnerHTML={{__html: value}}></div>
						<textarea id="txtArea" ref="txtArea" className={txtAreaCSSClasses} onBlur={this.handleBlur} onFocus={this.handleChange} onKeyDown={this.handleChange} 
						onKeyUp={this.handleChange} onClick={this.handleChange} onChange={this.handleChange} disabled={shouldBeDisabled} defaultValue={sanitizedText}></textarea>
						<textarea id="txtHiddenTextArea" ref="txtHiddenTextArea" className={txtAreaCSSClasses} style={{ height: 'auto', zIndex: 2, visibility: 'hidden' }} readOnly value={sanitizedText} />
						<ModalForm ref="settingsModal" btnSubmitText="DELETE NOTE" modalTitle="SETTINGS" onSubmit={this.handleSettingsSaved} onClose={this.handleSettingsClosed}>
						</ModalForm>
						<Links linkArray={links} lineCount={lineCount} />
					</div>
				</div>;
	}

});

module.exports = notepadComponent;
