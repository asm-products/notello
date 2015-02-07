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
  		}, 100);
	},

	_checkValidation: function () {

		var validationMessage = '';

		var setValidationMessage = function (child) {

			if (child.props && child.props.isRequired && !child.props.value) {

				validationMessage += child.props.requiredMessage + '<br>';

			} else if (child.props && child.props.regex && new RegExp(child.props.regex).test(child.props.value) === false) {

				validationMessage += child.props.regexMessage + '<br>';

			} else if (child.props) {

				if (React.Children.count(child.props.children) > 1) {

					React.Children.map(child.props.children, setValidationMessage);

				} else if (React.Children.count(child.props.children) === 1) {

					setValidationMessage(child.props.children);
				}
			}

		};

		React.Children.map(this.props.children, setValidationMessage);

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

		var self = this;

		this._isOpened = true;
		this._modalContainer.fadeIn(200, function () {
			if (self.props.onOpened) {
				self.props.onOpened();
			}
		});
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

  		if (this.props.onClose) {

			this.props.onClose(event);
  		}

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

  			if (this.props.onSubmit) {
  				this.props.onSubmit(event);
  			}
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
						<form action="" onSubmit={this.handleSubmit} autoComplete="on" autoCorrect="off" style={{ whiteSpace: 'nowrap', textAlign: 'center', overflow: 'hidden' }}>
							{React.Children.map(props.children, function (child) {
								return child.type === 'div' ? child : <div className="input-wrapper">{child}</div>;
							})}
							{this.props.showSubmit !== false && <button ref="btnSubmitEmail" type="submit" onTouchEnd={this.handleSubmit} className="submit-btn ion ion-load generic-transition">
								{btnSubmitText}
							</button>}
						</form>
					</div>
				</div>;
	}

});

module.exports = modalFormComponent;
