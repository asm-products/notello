var React = require('react');
var ReactAddons = require('react-addons');
var cx = ReactAddons.classSet;
var ModalForm = require('../modal-form/modalForm');

var loginComponent = React.createClass({

	getInitialState: function () {

		return { 
			email: ''
		};
	},

	handleClick: function (event) {

		this.refs.ModalForm.open();
	},

	handleClose: function (event) {

		this.setState({ 
			email: ''
		});
	},

	handleChange: function(event) {

		this.setState( {email: event.target.value} );
	},

	handleSubmit: function (event) {

		// TODO: Attempt login here
		alert('success');
	},

	render: function () {

		return 	<div className="login-container">
					<span className="login-btn bracket-animation" onTouchEnd={this.handleClick} onClick={this.handleClick}>LOGIN</span>
					<ModalForm ref="ModalForm" onClose={this.handleClose} onSubmit={this.handleSubmit} buttonText="SEND LOGIN EMAIL">
						<span className="email-icon ion-android-mail" />
						<input id="txtEmailAddress" isRequired={true} requiredMessage="Email is required" regex="^\S+@\S+$" regexMessage="Invalid email" style={{ paddingLeft: '40px' }} type="text"
						 placeholder="Enter email address" onChange={this.handleChange} className="padded-input" value={this.state.email}  />
					</ModalForm>
				</div>;
	}

});

module.exports = loginComponent;
