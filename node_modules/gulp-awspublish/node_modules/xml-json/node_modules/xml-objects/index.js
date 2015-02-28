var Transform = require('stream').Transform
  , util = require('util')
  , xml2js = require('xml2js')

module.exports = function(options) {
  return new XmlToObj(options)
}

function XmlToObj(options) {
  this.options = options
  Transform.call(this, {
    objectMode: true
  })
}

util.inherits(XmlToObj, Transform)

XmlToObj.prototype._transform = function(chunk, encoding, done) {
  var parser = new xml2js.Parser(this.options)
    , self = this

  parser.parseString(String(chunk), function(err, obj) {
    if (err) console.log(err)
    self.push(obj)
    done(err)
  })
}