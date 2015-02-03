var React = require('react');
var ReactAddons = require('react-addons');
var cx = ReactAddons.classSet;
var Searchbar = require('../searchbar/searchbar');
var ModalForm = require('../modal-form/modalForm');
var $ = require('jquery');

var bookcaseComponent = React.createClass({

	handleOpened: function () {

		var self = this;

		// Chrome really sucks here for some reason. It's calculations for margins were way off.
		// Not sure what other browsers are doing with this.

		setTimeout(function () {

			$(self.refs.formTwo.getDOMNode()).css({
				display: 'inline-block',
				width: '100%'
			});

		}, 1);

		setTimeout(function () {

			$(self.refs.formOne.getDOMNode()).css({
				display: 'inline-block',
				width: '100%'
			});

		}, 10);
		
	},

	getInitialState: function () {

		return {
			shouldSlide: false,
			itemType: null
		};
	},

	handleAddItem: function (event) {

		this.refs.addNewItemModal.open();
	},

	handleNewNote: function (event) {

		this.setState({
			shouldSlide: true,
			itemType: 'note'
		});
	},

	handleNewNoteBook: function (event) {

		this.setState({
			shouldSlide: true,
			itemType: 'notebook'
		});
	},

	handleNewBox: function (event) {

		this.setState({
			shouldSlide: true,
			itemType: 'box'
		});
	},

	render: function () {

		var classes = cx({
			bookcase: true,
			'bookcase-shown': this.props.isViewingBookshelf
		});

		var buttonClasses = 'submit-btn ion ion-load text-left';

		var firstFormClasses = cx({
			'form-one button-transition': true,
			'slide': this.state.shouldSlide
		});

		var secondFormClasses = cx({
			'form-two button-transition': true,
			'slide-second-form': this.state.shouldSlide
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
					<ModalForm ref="addNewItemModal" showSubmit={false} modalTitle="ADD NEW ITEM" onOpened={this.handleOpened}>
						<div ref="formOne" className={firstFormClasses}>
							<div className="input-wrapper">
								<button ref="btnNewNote" className={buttonClasses} style={{ height: '50px' }} onClick={this.handleNewNote}>
									<img src="dist/images/paper-icon.png" className="item-icon" /> <span className="valign-middle new-button-text">NEW NOTE</span>
								</button>
							</div>
							<div className="input-wrapper">
								<button ref="btnNewNoteBook" className={buttonClasses} style={{ height: '50px' }} onClick={this.handleNewNoteBook}>
									<img src="dist/images/notebook-icon.png" className="item-icon" /> <span className="valign-middle new-button-text">NEW NOTEBOOK</span>
								</button>
							</div>
							<div className="input-wrapper">
								<button ref="btnNewBox" className={buttonClasses} style={{ height: '50px' }} onClick={this.handleNewBox}>
									<img src="dist/images/archivebox.png" className="item-icon" /> <span className="valign-middle new-button-text">NEW BOX</span>
								</button>
							</div>
						</div>
						<div ref="formTwo" className={secondFormClasses}>
							<div className="input-wrapper">
								{this.state.itemType !== 'note' && <input id="txtItemName" name="itemName" isRequired={true} requiredMessage="Name is required" type="text"
								 placeholder={'Enter name of the ' + this.state.itemType} className="padded-input" value={this.state.email} />}
							</div>
						 </div>
					</ModalForm>
				</div>;
	}

});

module.exports = bookcaseComponent;
