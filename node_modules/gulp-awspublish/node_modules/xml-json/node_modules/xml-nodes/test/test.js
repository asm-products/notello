var test = require('tap').test
  , fs = require('fs')
  , xmlNodes = require('../index.js')

test('xmlNodes', function(t) {
  var count = 0
  
  t.plan(1)

  fs.createReadStream(__dirname + '/mrss.xml')
    .pipe(xmlNodes('item'))
    .on('data', function(data) {
      ++count
    })
    .on('end', function() {
      t.equal(count, 34, '34 items should have been emitted')
      t.end()
    })
})

test('nested nodes', function(t) {
  t.plan(2)

  fs.createReadStream(__dirname + '/nested.xml')
    .pipe(xmlNodes('item'))
    .on('data', function(chunk) {
      var test = /\n<\/item>$/.test(chunk)
      t.ok(test, 'does not split on nested node')
    })
})

test('self-closing tags', function(t) {
  t.plan(3)

  fs.createReadStream(__dirname + '/self-closing-tags.xml')
    .pipe(xmlNodes('vehicle'))
    .on('data', function(chunk) {
      var isSelfClosing = /\/>$/.test(chunk)
      t.ok(isSelfClosing, 'splits self-closing tags')
    })
})

test('order', function(t) {
  t.plan(3)

  var orderedIds = ['5131', '1406', '5005']

  fs.createReadStream(__dirname + '/self-closing-tags.xml')
    .pipe(xmlNodes('vehicle'))
    .on('data', function(chunk) {
      var hasNextId = RegExp('id="' + orderedIds.shift() + '"').test(chunk)
      t.ok(hasNextId, 'emits chunks in order')
    })
})