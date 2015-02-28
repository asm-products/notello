var request = require('request')
  , xmlNodes = require('../index.js')

request('http://news.yahoo.com/rss/entertainment')
  .pipe(xmlNodes('item'))
  .pipe(process.stdout)
