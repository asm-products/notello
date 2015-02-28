#!/usr/bin/env node

var convert = require('./')
var fs = require('fs')
var ldj = require('ldjson-stream')
var args = require('minimist')(process.argv.slice(2))

var first = args._[0]
var second = args._[1]

var usage = 'Usage: xml-json <file> <filter>, or cat file.xml | xml-json <filter>' +
'\n<filter> is the name of the XML node name you wish to match from the input' +
'\nOutputs: newline delimited JSON, one matched node per line'

run()

function run() {
  if (!first || first === 'help')
    return console.error(usage)
  
  var input = getStream(first)
  var converter = convert(second, args)
  input.pipe(converter).pipe(ldj.serialize()).pipe(process.stdout)
}

function getStream(uri) {
  if (fs.existsSync(uri)) {
    return fs.createReadStream(uri)
  } else {
    // shift args
    second = first
    return process.stdin
  }
}
