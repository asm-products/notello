var React = require('react');
var ReactAddons = require('react-addons');
var cx = ReactAddons.classSet;
var ModalForm = require('../modal-form/modalForm');
var sendLoginEmailAction = require('../../../actions/sendLoginEmail');
var logoutAction = require('../../../actions/logout');
var loginStore = require('../../../stores/loginStore');
var lscache = require('ls-cache');

var loginComponent = React.createClass({

	_loginStoreUpdated: function () {

		this.refs.ModalForm.close();

		this.setState({
			loginStatus: lscache.get('loginStatus')
		});
	},

	componentDidMount: function () {

		loginStore.onChange(this._loginStoreUpdated);
	},

	getInitialState: function () {

		return { 
			email: lscache.get('email'),
			loginStatus: lscache.get('loginStatus')
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

		sendLoginEmailAction(this.state.email);
	},

	handleLogout: function (event) {

		logoutAction();
	},

	render: function () {

		return 	<div className="login-container">
					{this.state.loginStatus === 'unauthenticated' && <span className="login-btn bracket-animation" onTouchEnd={this.handleClick} onClick={this.handleClick}>LOGIN</span>}
					{this.state.loginStatus === 'pending' && <span className="span-login-status subtle-blink">CHECK YOUR EMAIL</span>}
					<ModalForm ref="ModalForm" onClose={this.handleClose} onSubmit={this.handleSubmit} buttonText="SEND LOGIN EMAIL">
						<span className="email-icon ion-android-mail" />
						<input id="txtEmailAddress" isRequired={true} requiredMessage="Email is required" regex="^\S+@\S+$" regexMessage="Invalid email" style={{ paddingLeft: '40px' }} type="text"
						 placeholder="Enter email address" onChange={this.handleChange} className="padded-input" value={this.state.email}  />
					</ModalForm>
				</div>;
	}

});

module.exports = loginComponent;
