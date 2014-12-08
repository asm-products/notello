var React = require('react');
var ReactAddons = require('react-addons');
var cx = ReactAddons.classSet;
var ModalForm = require('../modal-form/modalForm');

var loginComponent = React.createClass({

	getInitialState: function () {

		return { 
			shouldShowModal: false,
			email: null
		};
	},

	handleClick: function (event) {

		this.setState({ 
			shouldShowModal: true,
			email: null
		});
	},

	handleClose: function (event) {

		this.setState({ 
			shouldShowModal: false,
			email: ''
		});
	},

	handleSubmit: function (event) {


	},

	render: function () {

		return 	<div className="login-container">
					<span className="login-btn bracket-animation" onTouchEnd={this.handleClick} onClick={this.handleClick}>LOGIN</span>
					<ModalForm onClose={this.handleClose} onSubmit={this.handleSubmit} show={this.state.shouldShowModal} buttonText="SEND LOGIN EMAIL">
						<span className="email-icon ion-android-mail" />
						<input id="txtEmailAddress" style={{ paddingLeft: '40px' }} type="email"
						 placeholder="Enter email address" className="padded-input" value={this.state.email}  />
					</ModalForm>
				</div>;
	}

});

module.exports = loginComponent;
