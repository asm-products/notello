'use strict';

// External libraries
var es5Shim = require('../../../node_modules/es5-shim/es5-shim');
var es5Sham = require('../../../node_modules/es5-shim/es5-sham');
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
// Actions and other stuff
var api = require('../../../common/api');
var authenticateAction = require('../../../actions/authenticate');
// Components
var Desk = require('../desk/desk');
var Bookcase = require('../bookcase/bookcase');
var ModalForm = require('../modal-form/modalForm');
// Stores
var bookshelfStore = require('../../../stores/bookshelfStore');
var loginStore = require('../../../stores/loginStore');

React.initializeTouchEvents(true);

var isMobile = false;
if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
	isMobile = true;
}

var App = React.createClass({

	_bookShelfUpdated: function () {

	    this.setState({
	    	showFormBlocker: false,
			isViewingBookshelf: bookshelfStore.isViewingBookshelf
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
			showFormBlocker: false
		};

	},

	componentDidMount: function() {

		var app = this,
			tempAuthToken = $.cookie('tempAuthToken'),
			tempAuthTokenArray = tempAuthToken && tempAuthToken.split(':'),
			email =  tempAuthTokenArray && tempAuthTokenArray[0];

		api.register(function () {

			app.setState({
				showFormBlocker: true
			});

		});
		
	    bookshelfStore.onChange(app._bookShelfUpdated);
	    loginStore.onChange(app._loginStoreUpdated);

	    if (tempAuthToken && (tempAuthToken === 'invalid' || tempAuthToken === 'expired')) {

	    	app.refs.mainModalForm.open();

	    } else if (tempAuthToken) {
	    	
			authenticateAction(email, tempAuthToken);
	    }

		$.removeCookie('tempAuthToken');
  	},

  	handleModalSubmit: function () {

  		this.refs.mainModalForm.close();
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
					<Desk isViewingBookshelf={this.state.isViewingBookshelf} />
					<ModalForm ref="mainModalForm" modalTitle="ERROR" btnSubmitText="OK" onSubmit={this.handleModalSubmit} >
						<p className="p-modal-text">
							<span className="span-modal-text">{tempAuthToken === 'expired' && 'This login token has expired.'}</span>
							<span className="span-modal-text">{tempAuthToken === 'invalid' && 'That login token has either already been used or is invalid.'}</span>
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
