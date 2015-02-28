xml-nodes
=========
> Streaming XML node splitter

Have a large XML file and only interesting in one type of tag? `xml-nodes` accepts a tag name and returns a stream which emits each tag as a string.

[![build status](https://secure.travis-ci.org/timhudson/xml-nodes.png)](http://travis-ci.org/timhudson/xml-nodes)

install
-------

With [npm](https://npmjs.org/) do:

```
npm install xml-nodes
```

example
-------

```javascript
var request = require('request')
  , xmlNodes = require('xml-nodes')

request('http://news.yahoo.com/rss/entertainment')
  .pipe(xmlNodes('item'))
  .pipe(process.stdout)
```

license
-------

MIT
