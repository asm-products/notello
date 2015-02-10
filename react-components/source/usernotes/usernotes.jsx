
var React = require('react');
var ReactAddons = require('react-addons');
var cx = ReactAddons.classSet;
var bookshelfStore = require('../../../stores/bookshelfStore');
var Sortable = require('../../../common/sortable');

var usernotesComponent = React.createClass({

	_haveUsernotes: function () {

		this.setState({
			userNotes: bookshelfStore.userNotes
		});
	},

	getInitialState: function () {

		return {
			userNotes: bookshelfStore.userNotes || []
		};
	},

	componentDidMount: function () {

		var sortable = Sortable.create(this.refs.userNoteContainer.getDOMNode(), {
			ghostClass: "ghost"
		});

		bookshelfStore.onChange(this._haveUsernotes);
	},

	render: function () {

		return 	<div ref="userNoteContainer" style={{ display: 'inline-block', minHeight: '100px' }}>
					{this.state.userNotes && this.state.userNotes.map(function (item) {

						if (item.itemType === 'note') {
							return <img key={item.noteId} src="dist/images/paper.png" className="paper usernote-item" />;
						}

						if (item.itemType === 'notebook') {
							return <img key={item.notebookId} src="dist/images/notebook.png" className="notebook usernote-item" />
						}

						if (item.itemType === 'box') {
							return <img key={item.boxId} src="dist/images/archivebox.png" className="archive-box usernote-item" />;
						}
					})}
				</div>;
	}

});

module.exports = usernotesComponent;
