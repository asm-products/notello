var request = require('request');
var xmlNodes = require('xml-nodes');
var xmlObjects = require('../');

request('http://news.yahoo.com/rss/entertainment')
  .pipe(xmlNodes('item'))
  .pipe(xmlObjects({explicitRoot: false, explicitArray: false, mergeAttrs: true}))
  .on('data', function(data) {
    console.log(data.title);
  });
