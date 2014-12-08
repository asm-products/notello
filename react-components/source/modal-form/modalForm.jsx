var React = require('react');
var ReactAddons = require('react-addons');
var cx = ReactAddons.classSet;
var $ = require('jquery');

var modalFormComponent = React.createClass({

	_modalContainer: null,
	_modalWrapper: null,

	componentDidMount: function () {

		this._modalContainer = $(this.refs.modalContainer.getDOMNode());
		this._modalWrapper = $(this.refs.modalWrapper.getDOMNode());
	},

	getInitialState: function () {

		return {
			isValid: null
		};
	},

	toggleFade: function () {

		if (this.props.show) {

			this._modalContainer.fadeIn(200).find('input').first().focus();

		} else {

			this._modalContainer.fadeOut(200);
		}
	},

	handleClose: function (event) {

		this.props.onClose(event);
	},

	handleSubmit: function (event) {

  		event.preventDefault();
  		event.stopPropagation();

  		// Got frustrated here with react and did straight up jQuery
  		// I'm sure there's a "proper" way to do this type of recurring 
  		// animation in react.
  		var modalWrapper = this._modalWrapper.get(0);

  		modalWrapper.className = 'modal-form-wrapper';
  		setTimeout(function () { 
  			modalWrapper.className = 'modal-form-wrapper modal-shake';
  		}, 1);

  		this.setState({
  			isValid: false
  		});

  		this.props.onSubmit(event);
	},

	handleClick: function (event) {

  		event.stopPropagation();
	},

	render: function () {

		var props = this.props;

		setTimeout(this.toggleFade, 1);

		return 	<div ref="modalContainer" className="modal-form-component" onClick={this.handleClick}>
					<div className="modal-background"></div>
					<div ref="modalWrapper" className="modal-form-wrapper">
						<span className="span-close ion-ios-close-outline" onTouchEnd={this.handleClose} onClick={this.handleClose}></span>
						<label className="lbl-form" htmlFor="txtEmailAddress">LOGIN</label>
						<hr className="hr-form" />
						<form action="" onSubmit={this.handleSubmit} autoCorrect="off">
							{React.Children.map(props.children, function (child) {
								return <div className="input-wrapper">{child}</div>;
							})}
							<input ref="btnSubmitEmail" type="submit" className="submit-btn" value="SEND LOGIN EMAIL" />
						</form>
					</div>
				</div>;
	}

});

module.exports = modalFormComponent;
