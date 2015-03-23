
var React = require('react');
var ReactAddons = require('react-addons');
var cx = ReactAddons.classSet;
var bookshelfStore = require('../../../stores/bookshelfStore');
var Sortable = require('../../../common/sortable');
var SortableMixin = require('../../../common/sortable-mixin');
var selectNoteAction = require('../../../actions/selectNote');
var selectedNoteStore = require('../../../stores/selectedNoteStore');

var usernotesComponent = React.createClass({

    //mixins: [SortableMixin],

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

	sortableOptions: {
        ref: 'userNoteContainer',
        model: 'userNotes'
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

		var self = this;

		return 	<div ref="userNoteContainer" className="usernotes-wrapper">
					{this.state.userNotes && this.state.userNotes.map(function (item) {

						var usernoteTitleClasses = cx({
							'usernote-title': true,
							'usernote-title-selected': item.noteId === self.state.selectedNoteId
						});

						var boxTitleClasses = cx({
							'box-title': true,
							'box-title-selected': item.boxId === self.state.selectedBoxId
						}),
							boxItemClasses = cx({
							'archive-box': true,
							'box-item-selected': item.boxId === self.state.selectedBoxId
						})
							boxContainerClasses = cx({
							'generic-transition usernote-item': true,
							'box-item-container-selected': item.boxId === self.state.selectedBoxId
						});

						if (item.itemType === 'note' && !self.state.selectedBoxId) {

							return  <span key={item.noteId} className="generic-transition usernote-item" onClick={self.handleNoteClick.bind(self, item.noteId)} onTouchEnd={self.handleNoteClick.bind(self, item.noteId)}>
										<img src="dist/images/paper.png" className="paper" />
										<span className={usernoteTitleClasses}>{item.noteTitle || 'New Note'}</span>
									</span>;

						} else if (item.itemType === 'notebook' && !self.state.selectedBoxId) {

							return <img key={item.notebookId} src="dist/images/notebook.png" className="notebook usernote-item" />;

						} else if (item.itemType === 'box' && 
							(!self.state.selectedBoxId || self.state.selectedBoxId === item.boxId)) {

							return <span key={item.boxId} title="You can drag and drop notes and notebooks here" className={boxContainerClasses} onClick={self.handleBoxClick.bind(self, item.boxId)} onTouchEnd={self.handleBoxClick.bind(self, item.boxId)}>
										<img src="dist/images/archivebox.png" className={boxItemClasses} />
										<span className={boxTitleClasses}>{item.boxTitle || 'New Box'}</span>
										<span title="Close this box" className="ion-close-circled close-box-button" onClick={self.handleCloseBox} onTouchEnd={self.handleCloseBox}></span>
									</span>;
						}
					})}
				</div>;
	}

});

module.exports = usernotesComponent;
