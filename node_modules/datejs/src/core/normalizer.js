
(function () {
	var $D = Date;
	var $P = $D.Parsing;

	$P.Numerizer = {
		DIRECT_NUMS : [
			["eleven", "11"],
			["twelve", "12"],
			["thirteen", "13"],
			["fourteen", "14"],
			["fifteen", "15"],
			["sixteen", "16"],
			["seventeen", "17"],
			["eighteen", "18"],
			["nineteen", "19"],
			["zero", "0"],
			["one", "1"],
			["two", "2"],
			["three", "3"],
			["four(\\W|$)", "4$1"],  //matches four but not "fourty" or "fourteen"
			["five", "5"],
			["six(\\W|$)", "6$1"], // as with four
			["seven(\\W|$)", "7$1"], // etc
			["eight(\\W|$)", "8$1"],
			["nine(\\W|$)", "9$1"],
			["ten", "10"],
			["\\ba[\\b^$]", "1"] // doesn't make sense for an "a" at the end to be a 1
		],
		ORDINALS : [
			["first", "1"],
			["third", "3"],
			["fourth", "4"],
			["fifth", "5"],
			["sixth", "6"],
			["seventh", "7"],
			["eighth", "8"],
			["ninth", "9"],
			["tenth", "10"],
			["twelfth", "12"],
			["twentieth", "20"],
			["thirtieth", "30"],
			["fourtieth", "40"],
			["fiftieth", "50"],
			["sixtieth", "60"],
			["seventieth", "70"],
			["eightieth", "80"],
			["ninetieth", "90"]
		],
		TEN_PREFIXES : [
			["twenty", 20],
			["thirty", 30],
			["forty", 40],
			["fifty", 50],
			["sixty", 60],
			["seventy", 70],
			["eighty", 80],
			["ninety", 90]
		],
		BIG_PREFIXES : [
			["hundred", 100],
			["thousand", 1000],
			["million", 1000000],
			["billion", 1000000000],
			["trillion", 1000000000000],
		],
		andition: function(s) {
			var r = /<num>(\d+)( | and )<num>(\d+)(?=[^\w]|$)/i;
			//var r = /<num>(\d+)( | and )(\d+)/i;
			var matches, replacement;
			while(s.match(r) !== null) {
				matches = s.match(r);
				replacement = Number(matches[1]) + Number(matches[3]);
				s = s.replace(matches[0], replacement);
			}
			return s;
		},
	};
	$P.Numerizer.numerize = function (s) {
		var $N = this;
		// preprocess
		s = s.replace(/ +|([^\d])-([^\d])/, "$1 $2");
		s = s.replace(/a half/, "haAlf"); // else half will be mutilated. Do it later - at the end.
		// easy/direct replacements
		this.DIRECT_NUMS.forEach(function(dn){
			s = s.replace(new RegExp(dn[0], ["i"]), "<num>" + dn[1]);
		});
		this.ORDINALS.forEach(function(on){
			s = s.replace(new RegExp(on[0], ["i"]), "<num>" + on[1] + on[0].slice(-2));
		});
		// ten, twenty, etc.
		this.TEN_PREFIXES.forEach(function(tp){
			s = s.replace(new RegExp("(?:"+tp[0]+") *<num>(\\d(?=[^\\d]|$))*", ["i"]), function (matx, p1) {
				return "<num>" + (tp[1] + Number(p1));
			});
		});
		this.TEN_PREFIXES.forEach(function(tp){
			s = s.replace(new RegExp(tp[0], ["i"]), "<num>" + tp[1]);
		});
		// hundreds, thousands, millions, etc.
		this.BIG_PREFIXES.forEach(function(bp){
			s = s.replace(new RegExp("(?:<num>)?(\\d*) *"+bp[0], ["i"]), function (match, p1) {
				return (p1 === null || p1 === undefined) ? bp[1] : "<num>" + (bp[1] * Number(p1));
			});
			s = $N.andition(s);
		});

		// fractional addition
		s = s.replace(/(\d+)(?: | and |-)*haAlf/i,  function(match, p1){
			return (parseFloat(p1) + 0.5);
		});
		s = s.replace(/<num>/g, "");
		return s;
	};

	$P.pre_normalize = function(s) {
		s = s.toLowerCase();
		s = s.replace(/\b(\d{2})(\d{2})(\d{4})\b/, "$3 $2 $1");
		s = s.replace(/\b(\d{2})\.(\d{2})\.(\d{4})\b/, "$3 $2 $1");
		s = s.replace(/\b([ap])\.m\.?/, "$1m");
		s = s.replace(/(\s+|:\d{2}|:\d{2}\.\d{3})\-(\d{2}:?\d{2})\b/, "$1tzminus$2");
		s = s.replace(/\./, ":");
		s = s.replace(/([ap]):m:?/, "$1m");
		s = s.replace(/['"]/, "");
		s = s.replace(/,/, " ");
		s = s.replace(/^second /, "2nd ");
		s = s.replace(/\bsecond (of|day|month|hour|minute|second)\b/, "2nd $1");
		s = $P.Numerizer.numerize(s);
		s = s.replace(/([\/\-\,\@])/, " $1 ");
		s = s.replace(/(?:^|\s)0(\d+:\d+\s*pm?\b)/, " $1");
		s = s.replace(/\btoday\b/, "this day");
		s = s.replace(/\btomm?orr?ow\b/, "next day");
		s = s.replace(/\byesterday\b/, "last day");
		s = s.replace(/\bnoon\b/, "12:00pm");
		s = s.replace(/\bmidnight\b/, "24:00");
		s = s.replace(/\bnow\b/, "this second");
		s = s.replace("quarter", "15");
		s = s.replace("half", "30");
		s = s.replace(/(\d{1,2}) (to|till|prior to|before)\b/, "$1 minutes past");
		s = s.replace(/(\d{1,2}) (after|past)\b/, "$1 minutes future");
		s = s.replace(/\b(?:ago|before(?: now)?)\b/, "past");
		s = s.replace(/\bthis (?:last|past)\b/, "last");
		s = s.replace(/\b(?:in|during) the (morning)\b/, "$1");
		s = s.replace(/\b(?:in the|during the|at) (afternoon|evening|night)\b/, "$1");
		s = s.replace(/\btonight\b/, "this night");
		s = s.replace(/\b\d+:?\d*[ap]\b/,"\0m");
		s = s.replace(/\b(\d{2})(\d{2})(am|pm)\b/, "$1:$2$3");
		s = s.replace(/(\d)([ap]m|oclock)\b/, "$1 $2");
		s = s.replace(/\b(hence|after|from)\b/, "future");
		s = s.replace(/^\s?an? /i, "1 ");
		s = s.replace(/\b(\d{4}):(\d{2}):(\d{2})\b/, "$1 / $2 / $3");
		s = s.replace(/\b0(\d+):(\d{2}):(\d{2}) ([ap]m)\b/, "$1:$2:$3 $4");
		return s;
	};
}());