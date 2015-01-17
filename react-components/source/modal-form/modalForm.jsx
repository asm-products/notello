var React = require('react');
var ReactAddons = require('react-addons');
var cx = ReactAddons.classSet;
var $ = require('jquery');
var sounds = require('../../../common/sounds');

var modalFormComponent = React.createClass({

	_modalContainer: null,
	
	_modalWrapper: null,

	_isOpened: null,

	_shake: function () {

  		// Got frustrated here with react and did straight up jQuery
  		// I'm sure there's a "proper" way to do this type of recurring animation in react.
  		var modalWrapper = this._modalWrapper.get(0);
  		sounds.play('bongos');
  		modalWrapper.className = 'modal-form-wrapper';
  		setTimeout(function () { 
  			modalWrapper.className = 'modal-form-wrapper modal-shake';
  		}, 1);
	},

	_checkValidation: function () {

		var validationMessage = '';

		{React.Children.map(this.props.children, function (child) {

			if (child.props.isRequired && child.props.value === '') {
				validationMessage += child.props.requiredMessage + '<br>';
			} else if (child.props.regex && new RegExp(child.props.regex).test(child.props.value) === false) {
				validationMessage += child.props.regexMessage + '<br>';
			}
		})}

		return validationMessage;
	},

	getInitialState: function () {

		return {
			isValid: true,
			validationMessage: ''
		};
	},

	isOpened: function () {

	},

	open: function () {

		this._isOpened = true;
		this._modalContainer.fadeIn(200);
		this._modalContainer.find('input').first().focus();
	},

	close: function () {

		this._isOpened = false;
		this._modalContainer.fadeOut(200);
	},

	componentDidMount: function () {

		this._modalContainer = $(this.refs.modalContainer.getDOMNode());
		this._modalWrapper = $(this.refs.modalWrapper.getDOMNode());
	},

	handleClose: function (event) {

		this.close();
  		this._modalWrapper.get(0).className = 'modal-form-wrapper';
		this.props.onClose(event);

		if ('activeElement' in document) {
    		document.activeElement.blur();
		}

		this.setState({
  			isValid: true,
			validationMessage: ''
  		});
	},

	handleSubmit: function (event) {

  		event.preventDefault();
  		event.stopPropagation();

  		var validationMessage = this._checkValidation();

  		if (validationMessage !== '') {
  		
  			this._shake();

  		} else {

  			this.props.onSubmit(event);
  		}

  		this.setState({
  			isValid: validationMessage === '',
  			validationMessage: validationMessage
  		});
	},

	handleClick: function (event) {

  		event.stopPropagation();
	},

	render: function () {

		var props = this.props;

		var btnSubmitText = this.props.loading ? <span className="ion-load-d"></span> : props.btnSubmitText;

		return 	<div ref="modalContainer" className="modal-form-component" onClick={this.handleClick}>
					<div className="modal-background"></div>
					<div ref="modalWrapper" className="modal-form-wrapper">
						<span className="span-close ion-ios-close-outline" onTouchEnd={this.handleClose} onClick={this.handleClose}></span>
						<label className="lbl-form" htmlFor="txtEmailAddress">{props.modalTitle}</label>
						<hr className="hr-form" />
						<div className={ cx({'modal-validation-container': true, 'hide': this.state.isValid }) }
							dangerouslySetInnerHTML={{__html: this.state.validationMessage}}>
						</div>
						<form action="" onSubmit={this.handleSubmit} autoComplete="on" autoCorrect="off">
							{React.Children.map(props.children, function (child) {
								return <div className="input-wrapper">{child}</div>;
							})}
							<button ref="btnSubmitEmail" type="submit" onTouchEnd={this.handleSubmit} className="submit-btn ion ion-load">
								{btnSubmitText}
							</button>
						</form>
					</div>
				</div>;
	}

});

module.exports = modalFormComponent;
