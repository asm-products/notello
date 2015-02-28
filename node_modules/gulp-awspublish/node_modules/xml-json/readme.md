# xml-json

convert xml to json on the command line, streaming and pure JS. extracts all matched xml elements by node name and stream them out at line delimited JSON. can only match one node name at a time.

[![NPM](https://nodei.co/npm/xml-json.png?global=true)](https://nodei.co/npm/xml-json/)

## usage

you must specify both a input stream and a xml node filter. conversion of all input xml is not supported at this time. all nodes that match your filter node name will be returned one at a time as JSON.

```
npm install xml-json -g
xml-json <file> <xml node name>
```

or `cat something.xml | xml-json <xml node name>`

## examples

```BASH
curl "http://news.yahoo.com/rss/entertainment" | xml-json item
```

```BASH
xml-json data.xml entry
```
