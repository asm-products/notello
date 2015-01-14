/** @jsx React.DOM */
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var Routes = Router.Routes;
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;

var App = React.createClass({displayName: 'App',

	render: function () {

		return React.DOM.div(null, "d");
	}
});

var appComponent = React.render(
    Routes({location: "history"}, 
		Route({name: "app", path: "/", handler: App}
		)
	),
    document.getElementById('reactApp')
);