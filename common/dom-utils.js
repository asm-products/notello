
var publicMembers = {

	getCaret: function(node) {

	  	if (node.selectionStart) {
	    	return node.selectionStart;
	  	} else if (!document.selection) {
	    	return 0;
	  	}

		var c = '\001',
		  	sel = document.selection.createRange(),
		    dul = sel.duplicate(),
		    len = 0;

		dul.moveToElementText(node);
		sel.text = c;
		len = dul.text.indexOf(c);
		sel.moveStart('character', -1);
		sel.text = '';
		
		return len;
	},

	stringToBoolean: function (stringObj) {

		return stringObj === 'true' ? true : false;
	},

	iOS: ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false ),

	isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
};

module.exports = publicMembers;
