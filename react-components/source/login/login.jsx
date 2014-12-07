var React = require('react');
var ReactAddons = require('react-addons');
var cx = ReactAddons.classSet;
var ModalForm = require('../modal-form/modalForm');

var loginComponent = React.createClass({

	getInitialState: function () {

		return { shouldShowModal: false };
	},

	handleClick: function (event) {

		this.setState({ shouldShowModal: true });
	},

	handleClose: function (event) {

		this.setState({ shouldShowModal: false });
	},

	handleSubmit: function (event) {


	},

	render: function () {

		return 	<div className="login-container">
					<span className="login-btn" onTouchEnd={this.handleClick} onClick={this.handleClick}>LOGIN</span>
					<ModalForm onClose={this.handleClose} onSubmit={this.handleSubmit} show={this.state.shouldShowModal} buttonText="SEND LOGIN EMAIL">
						<input id="txtEmailAddress" type="email" placeholder="Enter email address" required />
					</ModalForm>
				</div>;
	}

});

module.exports = loginComponent;
