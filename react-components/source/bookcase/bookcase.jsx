var React = require('react');
var ReactAddons = require('react-addons');
var cx = ReactAddons.classSet;
var Searchbar = require('../searchbar/searchbar');
var ModalForm = require('../modal-form/modalForm');

var bookcaseComponent = React.createClass({

	getInitialState: function () {

		return {
			shouldSlide: false
		};
	},

	handleAddItem: function (event) {

		this.refs.addNewItemModal.open();
	},

	handleNewNote: function (event) {


		this.setState({
			shouldSlide: true
		});
	},

	handleNewNoteBook: function (event) {

		this.setState({
			shouldSlide: true
		});
	},

	handleNewBox: function (event) {


		this.setState({
			shouldSlide: true
		});
	},

	render: function () {

		var classes = cx({
			bookcase: true,
			'bookcase-shown': this.props.isViewingBookshelf
		});

		var buttonClasses = cx({
			'submit-btn ion ion-load text-left button-transition': true,
			'slide': this.state.shouldSlide
		});

		return 	<div ref="divBookcase" className={classes}>
					<div className="wall">
						<div className="shelf">
							<div className="top-shelf shelf-border">
								<Searchbar />
								<div className="logo">Notello</div>
							</div>
							<div style={{ height: '100px', paddingLeft: '130px' }}>
								<img src="dist/images/archivebox.png" className="archive-box" />
								<img src="dist/images/notebook.png" className="notebook" />
								<img src="dist/images/paper.png" className="paper" />
								<span className="add-item ion-plus-circled" title="Add a new item" onClick={this.handleAddItem} onTouchEnd={this.handleAddItem}></span>
							</div>
							<div className="bottom-shelf shelf-border"></div>
						</div>
					</div>
					<ModalForm ref="addNewItemModal" showSubmit={false} modalTitle="ADD NEW ITEM">
							<button ref="btnNewNote" className={buttonClasses} style={{ height: '50px' }} onClick={this.handleNewNote}>
								<img src="dist/images/paper-icon.png" className="item-icon" /> <span className="valign-middle new-button-text">NEW NOTE</span>
							</button>
							<button ref="btnNewNoteBook" className={buttonClasses} style={{ height: '50px' }} onClick={this.handleNewNoteBook}>
								<img src="dist/images/notebook-icon.png" className="item-icon" /> <span className="valign-middle new-button-text">NEW NOTEBOOK</span>
							</button>
							<button ref="btnNewBox" className={buttonClasses} style={{ height: '50px' }} onClick={this.handleNewBox}>
								<img src="dist/images/archivebox.png" className="item-icon" /> <span className="valign-middle new-button-text">NEW BOX</span>
							</button>
					</ModalForm>
				</div>;
	}

});

module.exports = bookcaseComponent;
