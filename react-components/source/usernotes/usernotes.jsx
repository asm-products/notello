
var React = require('react');
var ReactAddons = require('react-addons');
var cx = ReactAddons.classSet;
var bookshelfStore = require('../../../stores/bookshelfStore');
var selectNoteAction = require('../../../actions/selectNote');
var selectedNoteStore = require('../../../stores/selectedNoteStore');
var UserNoteItem = require('../usernote-item/usernote-item');
var _ = require('underscore');

var usernotesComponent = React.createClass({

	_haveUsernotes: function () {

		var filteredUserNotes = [];

		if (bookshelfStore.userNotes) {

			filteredUserNotes = bookshelfStore.userNotes.filter(function (userNote) {

				if (!bookshelfStore.searchText || bookshelfStore.searchText === '') {
					return true;
				}

				return userNote.noteTitle && userNote.noteTitle.indexOf(bookshelfStore.searchText) !== -1;
			});

		}

		this.setState({
			userNotes: filteredUserNotes
		});
	},

	_selectedNoteChange: function () {

		this.setState({
			selectedNoteId: selectedNoteStore.noteId
		});
	},

	getInitialState: function () {

		return {
			selectedNoteId: null,
			selectedBoxId: null,
			userNotes: bookshelfStore.userNotes || []
		};
	},

	componentDidMount: function () {

		selectedNoteStore.onChange(this._selectedNoteChange);
		bookshelfStore.onChange(this._haveUsernotes);
	},

	handleNoteClick: function (noteId) {

		if (bookshelfStore.wallIsScrolling) {
			return false;
		}

		if (this.state.selectedNoteId !== noteId) {

			selectNoteAction(noteId);

			this.setState({
				selectedNoteId: noteId
			});
		}
	},

	handleBoxClick: function (boxId) {

		if (bookshelfStore.wallIsScrolling) {
			return false;
		}

		if (boxId !== this.state.selectedBoxId) {

			this.setState({
				selectedBoxId: boxId
			});
		}
	},

	handleCloseBox: function (event) {

		event.stopPropagation();

		this.setState({
			selectedBoxId: null
		});
	},

	render: function () {

		var self = this,
			displayNotes = self.state.selectedBoxId ? [_.findWhere(self.state.userNotes, { boxId: self.state.selectedBoxId })].concat(_.findWhere(self.state.userNotes, { boxId: self.state.selectedBoxId }).items) : self.state.userNotes;

		return 	<div ref="userNoteContainer" className="usernotes-wrapper">
					{displayNotes.map(function (item) {

						var id = item.noteId || item.notebookId || item.boxId,
							title = item.noteTitle || item.notebookTitle || item.boxTitle,
							clickHandler;

						if (item.itemType === 'note') {

							clickHandler = self.handleNoteClick.bind(self, id);

						} else if (item.itemType === 'box' && (!self.state.selectedBoxId || self.state.selectedBoxId === id)) {

							clickHandler = self.handleBoxClick.bind(self, id);
						} 

						if (clickHandler) {
							return <UserNoteItem key={id} id={id} itemTitle={title} selectedBoxId={self.state.selectedBoxId} selectedNoteId={self.state.selectedNoteId} onCloseBox={self.handleCloseBox} clickHandler={clickHandler} itemType={item.itemType} />;
						}
					})}
					{bookshelfStore.userNotes && bookshelfStore.userNotes.length > 0 && <UserNoteItem id="trashCan" itemTitle="Trash" itemType="trash" />};
				</div>;
	}

});

module.exports = usernotesComponent;
