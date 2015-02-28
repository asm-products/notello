var xmlObjects = require('../');
var Readable = require('stream').Readable;
var util = require('util');
var test = require('tape');

var xmlString = '<item><title>My Buddy</title><description>My buddy and me</description></item>';

test('objects from xml strings', function(t) {
  var xmlObjectsStream = xmlObjects();

  xmlObjectsStream.once('data', function(data) {
    t.deepEqual(data, {
      item: {
        title: ['My Buddy'],
        description: ['My buddy and me']
      }
    });
    t.end();
  });

  xmlObjectsStream.write(xmlString);
});

test('accepts xml2js options', function(t) {
  var xmlObjectsStream = xmlObjects({explicitRoot: false, explicitArray: false});

  xmlObjectsStream.once('data', function(data) {
    t.deepEqual(data, {
      title: 'My Buddy',
      description: 'My buddy and me'
    });
    t.end()
  })

  xmlObjectsStream.write(xmlString)
});