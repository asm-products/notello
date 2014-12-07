var React = require('react');
var ReactAddons = require('react-addons');
var cx = ReactAddons.classSet;
var $ = require('jquery');

var modalFormComponent = React.createClass({

	toggleFade: function () {

		if (this.props.show) {

			$(this.refs.modalContainer.getDOMNode()).fadeIn(200);

		} else {

			$(this.refs.modalContainer.getDOMNode()).fadeOut(200);
		}
	},

	handleClose: function (event) {

		this.props.onClose(event);
	},

	handleSubmit: function (event) {

  		event.preventDefault();
  		event.stopPropagation();

  		this.props.onSubmit(event);
	},

	render: function () {

		var props = this.props;

		setTimeout(this.toggleFade, 1);

		return 	<div ref="modalContainer" className="modal-form-component">
					<div className="modal-background"></div>
					<div className="modal-form-wrapper">
						<span className="span-close ion-ios-close-outline" onTouchEnd={this.handleClose} onClick={this.handleClose}></span>
						<label className="lbl-form" htmlFor="txtEmailAddress">LOGIN</label>
						<hr className="hr-form" />
						<form action="" onSubmit={this.handleSubmit} autoCorrect="off">
							{React.Children.map(props.children, function (child) {
								return <div className="input-wrapper">{child}</div>;
							})}
							<input ref="btnSubmitEmail" type="submit" className="submit-btn" value="SEND LOGIN EMAIL" />
						</form>
					</div>
				</div>;
	}

});

module.exports = modalFormComponent;
