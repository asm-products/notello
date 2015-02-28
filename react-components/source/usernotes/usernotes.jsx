
var React = require('react');
var ReactAddons = require('react-addons');
var cx = ReactAddons.classSet;
var bookshelfStore = require('../../../stores/bookshelfStore');
var Sortable = require('../../../common/sortable');
var SortableMixin = require('../../../common/sortable-mixin');
var selectNoteAction = require('../../../actions/selectNote');
var selectedNoteStore = require('../../../stores/selectedNoteStore');

var usernotesComponent = React.createClass({

    mixins: [SortableMixin],

	_haveUsernotes: function () {

		var filteredUserNotes = [];

		if (bookshelfStore.userNotes) {

			filteredUserNotes = bookshelfStore.userNotes.filter(function (userNote) {

				if (!bookshelfStore.searchText || bookshelfStore.searchText === '') {
					return true;
				}

				return userNote.noteTitle && userNote.noteTitle.indexOf(bookshelfStore.searchText) !== -1;
			});

			console.log(filteredUserNotes);

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
			userNotes: bookshelfStore.userNotes || []
		};
	},

	componentDidMount: function () {

		selectedNoteStore.onChange(this._selectedNoteChange);
		bookshelfStore.onChange(this._haveUsernotes);
	},

	handleNoteClick: function (noteId) {

		selectNoteAction(noteId);
	},

	render: function () {

		var self = this;

		return 	<div ref="userNoteContainer" className="usernotes-wrapper">
					{this.state.userNotes && this.state.userNotes.map(function (item) {

						var usernoteTitleClasses = cx({
							'usernote-title': true,
							'usernote-title-selected': item.noteId === self.state.selectedNoteId
						});

						if (item.itemType === 'note') {
							return  <span key={item.noteId} className="generic-transition usernote-item" onClick={self.handleNoteClick.bind(self, item.noteId)}>
										<img src="dist/images/paper.png" className="paper" />
										<span className={usernoteTitleClasses}>{item.noteTitle || 'New Note'}</span>
									</span>;
						}

						if (item.itemType === 'notebook') {
							return <img key={item.notebookId} src="dist/images/notebook.png" className="notebook usernote-item" />;
						}

						if (item.itemType === 'box') {
							return <img key={item.boxId} src="dist/images/archivebox.png" className="archive-box usernote-item" />;
						}
					})}
				</div>;
	}

});

module.exports = usernotesComponent;
