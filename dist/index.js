'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _db = require('./db');

var _db2 = _interopRequireDefault(_db);

var _middleware = require('./middleware');

var _middleware2 = _interopRequireDefault(_middleware);

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

var _config = require('./config.json');

var _config2 = _interopRequireDefault(_config);

var _lookup = require('./lookup');

var _lookup2 = _interopRequireDefault(_lookup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// require('dotenv').config();
// import {} from 'dotenv/config';
var app = (0, _express2.default)();
var fileopts = {
  root: __dirname + '/views/',
  dotfiles: 'deny',
  headers: {
    'x-timestamp': Date.now(),
    'x-sent': true
  }
};
app.server = _http2.default.createServer(app);

// logger
app.use((0, _morgan2.default)('dev'));

// 3rd party middleware
app.use((0, _cors2.default)({
  exposedHeaders: _config2.default.corsHeaders
}));

app.use(_bodyParser2.default.json({
  limit: _config2.default.bodyLimit
}));

// connect to db
(0, _db2.default)(function (db) {

  // internal middleware
  app.use((0, _middleware2.default)({ config: _config2.default, db: db }));

  // api router
  app.use('/api', (0, _api2.default)({ config: _config2.default, db: db }));
  app.get('/find/:id', function (req, res) {
    // console.log(api.find);
    // api.find(req, res);
    _lookup2.default.find(req, res);
  });
  app.post('/update', function (req, res) {
    _lookup2.default.update(req, res);
  });
  app.get('/', function (req, res) {
    res.sendFile('home.html', fileopts);
  });
  app.server.listen(process.env.PORT || _config2.default.port, function () {
    console.log('Started on port ' + app.server.address().port);
  });
});

exports.default = app;
//# sourceMappingURL=index.js.map