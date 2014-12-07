'use strict';

var es5Shim = require('../../../node_modules/es5-shim/es5-shim');
var es5Sham = require('../../../node_modules/es5-shim/es5-sham');
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var Routes = Router.Routes;
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
// Components
var Desk = require('../desk/desk');
var Bookcase = require('../bookcase/bookcase');
// Stores
var bookshelfStore = require('../../../stores/bookshelfStore');

React.initializeTouchEvents(true);

var App = React.createClass({

	_bookShelfUpdated: function () {

	    this.setState({
			isViewingBookshelf: bookshelfStore.isViewingBookshelf
		});
		
	},

	getInitialState: function () {

		return {
			isViewingBookshelf: bookshelfStore.isViewingBookshelf
		};
	},

	componentDidMount: function() {

	    bookshelfStore.onChange(this._bookShelfUpdated);
  	},

	render: function () {

		return  <div id="divContainer" className="container">
					<Bookcase isViewingBookshelf={this.state.isViewingBookshelf} />
					<Desk isViewingBookshelf={this.state.isViewingBookshelf} />
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
