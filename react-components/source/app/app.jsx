'use strict';

// External libraries
var es5Shim = require('../../../node_modules/es5-shim/es5-shim');
var es5Sham = require('../../../node_modules/es5-shim/es5-sham');
var dateJS = require('datejs');
var React = require('react');
var ReactAddons = require('react-addons');
var cx = ReactAddons.classSet;
var Router = require('react-router');
var Route = Router.Route;
var Routes = Router.Routes;
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var _ = require('underscore');
var $ = require('jquery');
var cookie = require('jquery.cookie');
var domUtils= require('../../../common/dom-utils');
var lscache = require('ls-cache');
// Actions and other stuff
var api = require('../../../common/api');
var authenticateAction = require('../../../actions/authenticate');
var resetTokenAction = require('../../../actions/resetToken');
var hideBookshelfAction = require('../../../actions/hideBookshelf');
var logoutAction = require('../../../actions/logout');
var getUserNotesAction = require('../../../actions/getUserNotes');
// Components
var Desk = require('../desk/desk');
var Bookcase = require('../bookcase/bookcase');
var ModalForm = require('../modal-form/modalForm');
// Stores
var bookshelfStore = require('../../../stores/bookshelfStore');
var loginStore = require('../../../stores/loginStore');
var modalStore = require('../../../stores/modalStore');

React.initializeTouchEvents(true);

var isMobile = domUtils.isMobile;

var currentDate = new Date();

var getSessionMinutes = function () {
	currentDate = new Date();
	currentDate.setMinutes(currentDate.getMinutes() + 60);

	return currentDate;
};

var App = React.createClass({

	_sessionInterval: null,

	_sessionTimeoutTime: getSessionMinutes(),

	_bookShelfUpdated: function () {

	    this.setState({
	    	showFormBlocker: false,
			isViewingBookshelf: bookshelfStore.isViewingBookshelf,
			isDoneAnimating: bookshelfStore.isDoneAnimating
		});
		
	},

	_loginStoreUpdated: function () {

		this.setState({
	    	showFormBlocker: false
		});
	},

	getInitialState: function () {

		return {
			isViewingBookshelf: bookshelfStore.isViewingBookshelf,
			showFormBlocker: false,
			sessionTimeLeft: null
		};

	},

	componentDidMount: function() {

		var app = this,
			self = app,
			tempAuthToken = $.cookie('tempAuthToken'),
			tempAuthTokenArray = tempAuthToken && tempAuthToken.split(':'),
			email =  tempAuthTokenArray && tempAuthTokenArray[0];

		api.register(function () {
			
			self._sessionTimeoutTime = getSessionMinutes();

			app.setState({
				showFormBlocker: true
			});

		}, function () {

			app.setState({
				showFormBlocker: false
			});

		});
		
	    bookshelfStore.onChange(app._bookShelfUpdated);
	    loginStore.onChange(app._loginStoreUpdated);

	    if (tempAuthToken && (tempAuthToken === 'invalid' || tempAuthToken === 'expired')) {

	    	app.refs.mainModalForm.open();

	    }

	    // If user is authenticated, we need a client side session interval to auto logout the user eventually.
		if (lscache.get('isAuthenticated') === true) {

			var timeLeft = Math.floor((self._sessionTimeoutTime - Date.now()) / 1000);

			if (timeLeft < 60) {
				self.refs.sessionTimerModalForm.open();
			}

			self._sessionInterval = setInterval(function () {

				timeLeft = Math.floor((self._sessionTimeoutTime - Date.now()) / 1000);
				
				if (timeLeft < 2) {
		
					self._sessionTimeoutTime = getSessionMinutes();
					self.refs.sessionTimerModalForm.close();
					clearInterval(self._sessionInterval);
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

  	handleModalSubmit: function () {

  		this.refs.mainModalForm.close();
  	},

	handleAutomatedLogoutClose: function (event) {

		this._sessionTimeoutTime = getSessionMinutes();
	},

	handleAutomatedLogoutSubmit: function (event) {

		this.refs.sessionTimerModalForm.close();
		this._sessionTimeoutTime = getSessionMinutes();
	},

	render: function () {

		var classes = cx({
			'container': true,
			'is-mobile': isMobile,
			'is-desktop': !isMobile
		});

		var tempAuthToken = $.cookie('tempAuthToken');

		return  <div id="divContainer" className={classes}>
					<Bookcase isViewingBookshelf={this.state.isViewingBookshelf} />
					<Desk isViewingBookshelf={this.state.isViewingBookshelf} isDoneAnimating={this.state.isDoneAnimating} />
					<ModalForm ref="mainModalForm" modalTitle="ERROR" btnSubmitText="OK" onSubmit={this.handleModalSubmit} >
						<p className="p-modal-text">
							<span className="span-modal-text">{tempAuthToken === 'expired' && 'This login token has expired.'}</span>
							<span className="span-modal-text">{tempAuthToken === 'invalid' && 'That login token has either already been used or is invalid.'}</span>
						</p>
					</ModalForm>
					<ModalForm ref="sessionTimerModalForm" modalTitle="AUTOMATED LOGOUT" btnSubmitText="STAY LOGGED IN" onClose={this.handleAutomatedLogoutClose} onSubmit={this.handleAutomatedLogoutSubmit}>
						<p className="p-modal-text">
							<span className="span-modal-text">Your session is about to expire in <span className="second-ticker">{this.state.sessionTimeLeft || '60'}</span> seconds.</span>
							<br />
							<span className="span-modal-text">Click the button below to stay logged in. </span>
						</p>
					</ModalForm>
					{this.state.showFormBlocker && <div className="div-form-blocker"></div>}
			    </div>;
	}
});

var appComponent = React.render(

    <Routes location="history">
		<Route name="app" path="/" handler={App}>
		</Route>
	</Routes>,

    document.body
);

$(function () {

	hideBookshelfAction();
	resetTokenAction();
	getUserNotesAction();
});
