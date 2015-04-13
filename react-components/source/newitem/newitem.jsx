var React = require('react');
var ReactAddons = require('react-addons');
var cx = ReactAddons.classSet;
var Searchbar = require('../searchbar/searchbar');
var ModalForm = require('../modal-form/modalForm');
var $ = require('jquery');
var createNoteAction = require('../../../actions/createNote');
var hideBookshelfAction = require('../../../actions/hideBookshelf');
var bookshelfStore = require('../../../stores/bookshelfStore');
var createNotebookAction = require('../../../actions/createNotebook');
var createBoxAction = require('../../../actions/createBox');
var domUtils = require('../../../common/dom-utils');
var getUserNotesAction = require('../../../actions/getUserNotes');

var bookcaseComponent = React.createClass({

	getInitialState: function () {

		return {
			shouldSlide: false,
			itemType: null,
			itemName: null
		};
	},

	open: function () {

		this.setState({
			shouldSlide: false,
			itemType: null
		});

		$(this.refs.formOne.getDOMNode()).attr('style', '');
		$(this.refs.formTwo.getDOMNode()).attr('style', '');

		$(this.refs.formTwo.getDOMNode()).css('width', '100%');
		
		this.refs.addNewItemModal.open();
	},

	handleOpened: function () {

		var self = this;

		// Chrome really sucks here for some reason. It's calculations for margins were way off.
		// Not sure what other browsers are doing with this.
		setTimeout(function () {

			$(self.refs.formOne.getDOMNode()).css('width', '100%');

			$(self.refs.formOne.getDOMNode()).css('opacity', '1');
			$(self.refs.formTwo.getDOMNode()).css('opacity', '1');

		}, 50);
		
	},

	handleNewNote: function (event) {

		this.setState({
			shouldSlide: false,
			itemType: null
		});

		this.refs.addNewItemModal.close();

		createNoteAction(bookshelfStore.userNotes || [], '', '');
	},

	handleNewNoteBook: function (event) {

		// TODO: handle new box and hand new notebook can probably be abstracted away

		var self = this;

		self.setState({
			shouldSlide: true,
			itemType: 'notebook'
		});

		if (!domUtils.isSafari) {
			setTimeout(function () {
				$(self.refs.itemName.getDOMNode()).focus();
			}, 1);
		}
	},

	handleNewBox: function (event) {

		var self = this;

		self.setState({
			shouldSlide: true,
			itemType: 'box',
			itemName: ''
		});

		if (!domUtils.isSafari) {
			setTimeout(function () {
				$(self.refs.itemName.getDOMNode()).focus();
			}, 1);
		}
	},

	handleCreate: function (event) {
		
		this.setState({
			shouldSlide: false,
			itemType: null
		});

		this.refs.addNewItemModal.close();

		if (this.state.itemType === 'box') {

			createBoxAction(bookshelfStore.userNotes, this.state.itemName);

		} else if (this.state.itemType === 'notebook') {

			createNotebookAction(bookshelfStore.userNotes, this.state.itemName);
		}
	},

	handleItemNameChange: function (event) {

		this.setState({
			itemName: event.target.value
		});
	},

	render: function () {

		var buttonClasses = 'submit-btn ion ion-load text-left generic-transition';

		var firstFormClasses = cx({
			'form-one button-transition': true,
			'slide': this.state.shouldSlide
		});

		var secondFormClasses = cx({
			'form-two button-transition': true,
			'slide-second-form': this.state.shouldSlide
		});

		return 	<ModalForm ref="addNewItemModal" showSubmit={false} modalTitle="ADD NEW ITEM" onOpened={this.handleOpened} onSubmit={this.handleCreate}>
					<div ref="formOne" className={firstFormClasses}>
						<div className="input-wrapper">
							<button ref="btnNewNote" type="button" className={buttonClasses} style={{ height: '50px' }} onClick={this.handleNewNote}>
								<img src="dist/images/paper-icon.png" className="item-icon" /> <span className="valign-middle new-button-text">NEW NOTE</span>
							</button>
						</div>
						<div className="input-wrapper">
							<button ref="btnNewBox" type="button" className={buttonClasses} style={{ height: '50px' }} onClick={this.handleNewBox}>
								<img src="dist/images/archivebox.png" className="item-icon" /> <span className="valign-middle new-button-text">NEW BOX</span>
							</button>
						</div>
						<div className="input-wrapper disabled-wrapper" title="Coming soon">
							<button ref="btnNewNoteBook" type="button" disabled={true} className={buttonClasses} style={{ height: '50px' }} onClick={this.handleNewNoteBook}>
								<img src="dist/images/notebook-icon.png" className="item-icon" /> <span className="valign-middle new-button-text">NEW NOTEBOOK</span> 
								<span className="coming-soon">(COMING SOON)</span>
							</button>
						</div>
					</div>
					<div ref="formTwo" className={secondFormClasses}>
						<div className="input-wrapper">
							{this.state.itemType !== 'note' && <input id="txtItemName" ref="itemName" name="itemName" isRequired={true} requiredMessage="Name is required" type="text"
							 placeholder={'Enter name of the ' + this.state.itemType} className="padded-input" value={this.state.itemName} onChange={this.handleItemNameChange} 
							 disabled={!this.state.shouldSlide} />}
						</div>
						<div className="input-wrapper">
							{this.state.itemType !== 'note' && <button ref="btnCreate" type="submit" className="submit-btn ion ion-load generic-transition">
								CREATE
							</button>}
						</div>
					 </div>
				</ModalForm>;
	}

});

module.exports = bookcaseComponent;
