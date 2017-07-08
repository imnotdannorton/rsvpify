'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _facets = require('../models/facets');

var _facets2 = _interopRequireDefault(_facets);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var lookup = {};
var mongoUrl = process.env.MONGODB_URI;
var guest = new _mongoose2.default.Schema({
  name: String,
  attending: Boolean,
  guests: Number,
  request: String
});

lookup.find = function (req, res) {
  var id = req.params.id;
  var results = [];
  _facets2.default.forEach(function (item) {
    if (item.id == id) {
      results.push(item);
    }
  });
  res.json({ 'results': results });
};

exports.default = lookup;
//# sourceMappingURL=index.js.map