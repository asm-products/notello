
var React = require('react');
var ReactAddons = require('react-addons');
var cx = ReactAddons.classSet;
var bookshelfStore = require('../../../stores/bookshelfStore');

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

		bookshelfStore.onChange(this._haveUsernotes);
	},

	render: function () {

		console.log(this.state.userNotes);

		return 	<div style={{ display: 'inline-block' }}>
					{this.state.userNotes && this.state.userNotes.map(function (item) {

						if (item.itemType === 'note') {
							return <img key={item.noteId} src="dist/images/paper.png" className="paper" />;
						}

						if (item.itemType === 'notebook') {
							return <img key={item.notebookId} src="dist/images/notebook.png" className="notebook" />
						}

						if (item.itemType === 'box') {
							return <img key={item.boxId} src="dist/images/archivebox.png" className="archive-box" />;
						}
					})}
				</div>;
	}

});

module.exports = usernotesComponent;
