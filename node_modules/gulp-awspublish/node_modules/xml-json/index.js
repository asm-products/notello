var xmlNodes = require('xml-nodes')
var xmlObjects = require('xml-objects')
var pumpify = require('pumpify')
var extend = require('extend')

module.exports = function(nodeFilter, opts) {
  var nodes = xmlNodes(nodeFilter)
  var objOpts = extend({explicitRoot: false, explicitArray: false, mergeAttrs: true}, opts)
  var objects = xmlObjects(objOpts)
  return pumpify.obj(nodes, objects)
}
