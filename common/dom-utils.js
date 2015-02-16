
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

	isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),

	randomUUID: function () {
		
		var s = [], itoh = '0123456789ABCDEF';

		// Make array of random hex digits. The UUID only has 32 digits in it, but we
		// allocate an extra items to make room for the '-'s we'll be inserting.
		for (var i = 0; i < 36; i++) s[i] = Math.floor(Math.random()*0x10);

		// Conform to RFC-4122, section 4.4
		s[14] = 4;  // Set 4 high bits of time_high field to version
		s[19] = (s[19] & 0x3) | 0x8;  // Specify 2 high bits of clock sequence

		// Convert to hex chars
		for (var i = 0; i < 36; i++) s[i] = itoh[s[i]];

		// Insert '-'s
		s[8] = s[13] = s[18] = s[23] = '-';

		return s.join('');
	}
};

module.exports = publicMembers;
