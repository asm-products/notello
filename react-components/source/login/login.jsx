var React = require('react');
var ReactAddons = require('react-addons');
var cx = ReactAddons.classSet;

var loginComponent = React.createClass({

	_blurTimeout: null,

	handleCloseLogin: function (event) {

		this.setState({
			readyToLogin: false
		});
	},

	handleClick: function (event) {

		this.refs.txtEmailAddress.getDOMNode().focus();

		this.setState({
			readyToLogin: true
		});
	},

	handleBlur: function (event) {

		var self = this;

		clearTimeout(self._blurTimeout);

		this._blurTimeout = setTimeout(function () {

			if (document.activeElement !== self.refs.btnSubmitLoginEmail.getDOMNode() && document.activeElement !== self.refs.txtEmailAddress.getDOMNode()) {

				self.setState({
					readyToLogin: false
				});
			}

		}, 5000);
	},

	handleSubmit: function (event) {

  		event.preventDefault();
  		event.stopPropagation();
	},

	getInitialState: function () {

		return {
			readyToLogin: false
		};
	},

	render: function () {

		var isBigScreen = window.screen.width > 500;

		var linkClasses = cx({
			'login-btn': true,
			'big-screen-login': isBigScreen,
			'slide-in-right': !this.state.readyToLogin,
			'slide-off-right': this.state.readyToLogin
		});

		var inputClasses = cx({
			'input-container': true,
			'big-screen-login': isBigScreen,
			'slide-in-right': this.state.readyToLogin,
			'slide-off-right': !this.state.readyToLogin
		});

		return 	<div>
					<span className={linkClasses} onClick={this.handleClick}>LOGIN</span>
					<form action="" onSubmit={this.handleSubmit} className={inputClasses} autoCorrect="off">
						<span className="span-close" onClick={this.handleCloseLogin}><img src="dist/images/button-delete.png" /></span>
						<label className="lbl-login" htmlFor="txtEmailAddress">LOGIN</label>
						<input id="txtEmailAddress" ref="txtEmailAddress" type="email" className="txt-email" placeholder="Enter email address" tabIndex="4" onBlur={this.handleBlur} required />
						<input ref="btnSubmitLoginEmail" type="submit" className="login-submit-btn" tabIndex="5" value="SEND LOGIN EMAIL" onBlur={this.handleBlur} />
					</form>
				</div>;
	}

});

module.exports = loginComponent;
