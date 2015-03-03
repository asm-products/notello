
var gulp = require('gulp');
var handleErrors = require('../utils/handleErrors');
var AWS = require('aws-sdk'); 
var fs = require('fs');
var config = require('../config').publish;
var Q = require('../../node_modules/q');

gulp.task('publish', function () {

	var deferred = Q.defer();

	var s3 = new AWS.S3({
		region: config.region
	});

	var iteratorMarker = 0;

	var contentType = {

		jpg: 'image/jpeg',
		png: 'image/png',
		css: 'text/css',
		js: 'application/javascript'	
	};

	config.src.map(function (source) {

		var extension = source.key.split('.').pop();

		fs.readFile(source.path, function (err, data) {

  			if (err) { throw err; }

			var params = {
				Bucket: config.bucket,
		    	CacheControl: 'max-age=86400, no-transform, public',
				Key: source.key,
				Body: data,
				ACL: 'public-read',
				ContentType: contentType[extension]
			};

			s3.putObject(params, function(err, data) {

				iteratorMarker++;

				if (err) {

					console.log(err);

				} else {

					console.log('Successfully uploaded ' + source.key + ' to ' + config.bucket);
				}

				if (iteratorMarker === config.src.length) {

					deferred.resolve();
				}

			});

		});
	});

  	return deferred.promise;
});
