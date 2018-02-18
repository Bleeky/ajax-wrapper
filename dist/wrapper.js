'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _deepmerge = require('deepmerge');

var _deepmerge2 = _interopRequireDefault(_deepmerge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AjaxWrapper = function () {
  function AjaxWrapper(apiDefs) {
    (0, _classCallCheck3.default)(this, AjaxWrapper);

    this.apiDefs = apiDefs;
    this.routes = [];
    this.requestMiddlewares = [];
    this.errorMiddlewares = [];

    this.buildUrl = this.buildUrl.bind(this);
    this.defBuilder = this.defBuilder.bind(this);
    this.init = this.init.bind(this);

    this.init();
  }

  (0, _createClass3.default)(AjaxWrapper, [{
    key: 'buildUrl',
    value: function buildUrl(url) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var query = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      // eslint-disable-line
      var finalUrl = url;
      Object.keys(params).forEach(function (param) {
        finalUrl = finalUrl.replace(':' + param, params[param]);
      });
      if (query.constructor === Object && Object.keys(query).length > 0) {
        finalUrl = finalUrl.concat('?', Object.keys(query).map(function (key) {
          return encodeURIComponent(key) + '=' + encodeURIComponent(query[key]);
        }).join('&'));
      } else if (query.constructor === String) {
        finalUrl = finalUrl.concat('?', query);
      }
      return finalUrl;
    }
  }, {
    key: 'defBuilder',
    value: function defBuilder(def, req) {
      var middlewaresArgs = {};
      this.requestMiddlewares.forEach(function (middleware) {
        if (!def.ignoreMiddlewares || !def.ignoreMiddlewares.find(function (ignore) {
          return ignore === middleware.name;
        })) {
          middlewaresArgs = (0, _extends4.default)({}, middlewaresArgs, middleware.handler());
        }
      });
      var mergedReqSettings = (0, _deepmerge2.default)(middlewaresArgs, req);
      mergedReqSettings = (0, _deepmerge2.default)({
        method: def.method,
        responseType: def.responseType ? def.responseType : 'json',
        headers: { 'Content-Type': def.contentType ? def.responseType : 'application/json' }
      }, mergedReqSettings);
      return mergedReqSettings;
    }
  }, {
    key: 'addRequestMiddlewares',
    value: function addRequestMiddlewares(middlewares) {
      var _this = this;

      for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        params[_key - 1] = arguments[_key];
      }

      middlewares.forEach(function (middleware) {
        _this.requestMiddlewares = [].concat((0, _toConsumableArray3.default)(_this.requestMiddlewares), [{ name: middleware.name, handler: function handler() {
            return middleware.handler.apply(middleware, params);
          } }]);
      });
    }
  }, {
    key: 'addErrorMiddlewares',
    value: function addErrorMiddlewares(middlewares) {
      var _this2 = this;

      for (var _len2 = arguments.length, params = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        params[_key2 - 1] = arguments[_key2];
      }

      middlewares.forEach(function (middleware) {
        _this2.errorMiddlewares = [].concat((0, _toConsumableArray3.default)(_this2.errorMiddlewares), [{ name: middleware.name, handler: function handler(request) {
            return middleware.handler.apply(middleware, [request].concat(params));
          } }]);
      });
    }
  }, {
    key: 'init',
    value: function init() {
      var _this3 = this;

      var routes = {};
      Object.keys(this.apiDefs).forEach(function (key) {
        routes = (0, _extends4.default)({}, routes, (0, _defineProperty3.default)({}, '' + key, function undefined() {
          var reqSettings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { params: {}, body: null, query: {} };
          return fetch(_this3.buildUrl(_this3.apiDefs[key].url, reqSettings.params, reqSettings.query), _this3.defBuilder(_this3.apiDefs[key], reqSettings)).then(function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(response) {
              var data;
              return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      if (response) {
                        _context.next = 2;
                        break;
                      }

                      throw new Error('No response');

                    case 2:
                      if (response.ok) {
                        _context.next = 8;
                        break;
                      }

                      _this3.errorMiddlewares.forEach(function (middleware) {
                        if (!_this3.apiDefs[key].ignoreMiddlewares || !_this3.apiDefs[key].ignoreMiddlewares.find(function (ignore) {
                          return ignore === middleware.name;
                        })) {
                          middleware.handler(response);
                        }
                      });
                      _context.next = 6;
                      return response.json();

                    case 6:
                      data = _context.sent;
                      throw { message: 'Request error: status is ' + response.status + ' (' + response.statusText + ')', status: response.status, data: data.data };

                    case 8:
                      if (!(response.status === 204 || _this3.apiDefs[key].responseType === 'no-content')) {
                        _context.next = 10;
                        break;
                      }

                      return _context.abrupt('return', null);

                    case 10:
                      _context.t0 = _this3.apiDefs[key].responseType;
                      _context.next = _context.t0 === 'text/plain' ? 13 : _context.t0 === 'blob' ? 14 : 15;
                      break;

                    case 13:
                      return _context.abrupt('return', response.text());

                    case 14:
                      return _context.abrupt('return', response.blob());

                    case 15:
                      return _context.abrupt('return', response.json());

                    case 16:
                    case 'end':
                      return _context.stop();
                  }
                }
              }, _callee, _this3);
            }));

            return function (_x4) {
              return _ref.apply(this, arguments);
            };
          }());
        }));
      });
      this.routes = routes;
    }
  }]);
  return AjaxWrapper;
}();

exports.default = AjaxWrapper;