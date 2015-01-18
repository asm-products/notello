var React = require('react');
var ReactAddons = require('react-addons');
var cx = ReactAddons.classSet;
var ModalForm = require('../modal-form/modalForm');
var sendLoginEmailAction = require('../../../actions/sendLoginEmail');
var logoutAction = require('../../../actions/logout');
var loginStore = require('../../../stores/loginStore');
var lscache = require('ls-cache');
var $ = require('jquery');
var cookie = require('jquery.cookie');
var domUtils = require('../../../common/dom-utils');
var authenticateAction = require('../../../actions/authenticate');

var currentDate = new Date();

var getSessionMinutes = function () {
	currentDate = new Date();
	currentDate.setMinutes(currentDate.getMinutes() + 60);

	return currentDate;
};

var loginComponent = React.createClass({

	_sessionInterval: null,

	_sessionTimeoutTime: getSessionMinutes(),

	_loginStoreUpdated: function () {

		this.refs.ModalForm.close();

		this.setState({
			loading: false,
			pendingLogin: loginStore.pendingLogin,
			isAuthenticated: lscache.get('isAuthenticated'),
			email: lscache.get('email')
		});
	},

	componentDidMount: function () {

		var self = this,
			tempAuthToken = $.cookie('tempAuthToken'),
			tempAuthTokenArray = tempAuthToken && tempAuthToken.split(':'),
			email =  tempAuthTokenArray && tempAuthTokenArray[0];

		// Register loginStore handler
		loginStore.onChange(self._loginStoreUpdated);

		if (tempAuthToken) {
	    	
			authenticateAction(email, tempAuthToken);
	    }
		$.removeCookie('tempAuthToken');

		// If user is authenticated, we need a client side session interval to auto logout the user eventually.
		if (this.state.isAuthenticated) {

			var timeLeft = Math.floor((self._sessionTimeoutTime - Date.now()) / 1000);

			if (timeLeft < 60) {
				self.refs.sessionTimerModalForm.open();
			}

			self._sessionInterval = setInterval(function () {

				timeLeft = Math.floor((self._sessionTimeoutTime - Date.now()) / 1000);

				if (timeLeft < 2) {
		
					self._sessionTimeoutTime = getSessionMinutes();
					self.refs.sessionTimerModalForm.close();
					logoutAction();

				} else if (timeLeft < 60 && !self.refs.sessionTimerModalForm.isOpened()) {

					self.refs.sessionTimerModalForm.open();
				}

				self.setState({
					sessionTimeLeft: timeLeft
				});

			}, 1000);
		}
	},

	getInitialState: function () {

		return { 
			loading: false,
			pendingLogin: loginStore.pendingLogin,
			isAuthenticated: lscache.get('isAuthenticated'),
			email: lscache.get('email'),
			sessionTimeLeft: null
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

		this.setState({ loading: true });
	},

	handleLogout: function (event) {

		logoutAction();
	},

	handleAutomatedLogoutClose: function (event) {

		this._sessionTimeoutTime = getSessionMinutes();
	},

	handleAutomatedLogoutSubmit: function (event) {

		this.refs.sessionTimerModalForm.close();
		this._sessionTimeoutTime = getSessionMinutes();
	},

	render: function () {

		return 	<div className="login-container">
					{!this.state.isAuthenticated && !this.state.pendingLogin && <span className="login-btn bracket-animation" onTouchEnd={this.handleClick} onClick={this.handleClick}>LOGIN</span>}
					{!this.state.isAuthenticated && this.state.pendingLogin  && <span className="span-login-status subtle-blink">CHECK YOUR EMAIL</span>}
					{this.state.isAuthenticated && <span className="login-btn bracket-animation" title={'Logged in as: ' + this.state.email} onTouchEnd={this.handleLogout} onClick={this.handleLogout}>LOGOUT</span>}
					<ModalForm ref="ModalForm" loading={this.state.loading} modalTitle="LOGIN" btnSubmitText="SEND LOGIN EMAIL" onClose={this.handleClose} onSubmit={this.handleSubmit} buttonText="SEND LOGIN EMAIL">
						<span className="email-icon ion-android-mail" />
						<input id="txtEmailAddress" name="email" isRequired={true} requiredMessage="Email is required" regex="^\S+@\S+$" regexMessage="Invalid email" style={{ paddingLeft: '40px' }} type="text"
						 placeholder="Enter email address" onChange={this.handleChange} className="padded-input" value={this.state.email}  />
					</ModalForm>
					<ModalForm ref="sessionTimerModalForm" modalTitle="AUTOMATED LOGOUT" btnSubmitText="STAY LOGGED IN" onClose={this.handleAutomatedLogoutClose} onSubmit={this.handleAutomatedLogoutSubmit}>
						<p className="p-modal-text">
							<span className="span-modal-text">Your session is about to expire in <span className="second-ticker">{this.state.sessionTimeLeft || '60'}</span> seconds.</span>
							<br />
							<span className="span-modal-text">Click the button below to stay logged in. </span>
						</p>
					</ModalForm>
				</div>;
	}

});

module.exports = loginComponent;
