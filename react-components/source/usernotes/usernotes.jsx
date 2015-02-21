
var React = require('react');
var ReactAddons = require('react-addons');
var cx = ReactAddons.classSet;
var bookshelfStore = require('../../../stores/bookshelfStore');
var Sortable = require('../../../common/sortable');
var SortableMixin = require('../../../common/sortable-mixin');
var selectNoteAction = require('../../../actions/selectNote');

var usernotesComponent = React.createClass({

    mixins: [SortableMixin],

	_haveUsernotes: function () {

		this.setState({
			userNotes: bookshelfStore.userNotes
		});
	},

	sortableOptions: {
        ref: 'userNoteContainer',
        model: 'userNotes'
    },

	getInitialState: function () {

		return {
			userNotes: bookshelfStore.userNotes || []
		};
	},

	componentDidMount: function () {

		bookshelfStore.onChange(this._haveUsernotes);
	},

	handleNoteClick: function (noteId) {

		selectNoteAction(noteId);
	},

	render: function () {

		var self = this;

		return 	<div ref="userNoteContainer" className="usernotes-wrapper">
					{this.state.userNotes && this.state.userNotes.map(function (item) {

						if (item.itemType === 'note') {
							return  <span className="generic-transition usernote-item">
										<img key={item.noteId} src="dist/images/paper.png" className="paper" onClick={self.handleNoteClick.bind(self, item.noteId)} />
										<span className="usernote-title">{item.noteTitle || 'New Note'}</span>
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
