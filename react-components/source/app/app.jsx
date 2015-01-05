'use strict';

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
var api = require('../../../common/api');
var _ = require('underscore');
// Components
var Desk = require('../desk/desk');
var Bookcase = require('../bookcase/bookcase');
// Stores
var bookshelfStore = require('../../../stores/bookshelfStore');

React.initializeTouchEvents(true);

var isMobile = false;
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	isMobile = true;
}

var App = React.createClass({

	_bookShelfUpdated: function () {

	    this.setState({
	    	showFormBlocker: false,
			isViewingBookshelf: bookshelfStore.isViewingBookshelf
		});
		
	},

	getInitialState: function () {

		return {
			isViewingBookshelf: bookshelfStore.isViewingBookshelf,
			showFormBlocker: false
		};
	},

	componentDidMount: function() {

		var app = this;

		api.register(function () {

			app.setState({
				showFormBlocker: true
			});

		});
		
	    bookshelfStore.onChange(this._bookShelfUpdated);
  	},

	render: function () {

		var classes = cx({
			'container': true,
			'is-mobile': isMobile,
			'is-desktop': !isMobile
		});

		return  <div id="divContainer" className={classes}>
					<Bookcase isViewingBookshelf={this.state.isViewingBookshelf} />
					<Desk isViewingBookshelf={this.state.isViewingBookshelf} />
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
