"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require("babel-runtime/helpers/defineProperty");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require("babel-runtime/helpers/extends");

var _extends4 = _interopRequireDefault(_extends3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var combineWrappers = function combineWrappers(wrappers, _ref, _ref2) {
  var _ref$reqMiddlewares = _ref.reqMiddlewares,
      reqMiddlewares = _ref$reqMiddlewares === undefined ? [] : _ref$reqMiddlewares,
      _ref$reqMiddlewarePar = _ref.reqMiddlewareParams,
      reqMiddlewareParams = _ref$reqMiddlewarePar === undefined ? null : _ref$reqMiddlewarePar;
  var _ref2$errMiddlewares = _ref2.errMiddlewares,
      errMiddlewares = _ref2$errMiddlewares === undefined ? [] : _ref2$errMiddlewares,
      _ref2$errMiddlewaresP = _ref2.errMiddlewaresParams,
      errMiddlewaresParams = _ref2$errMiddlewaresP === undefined ? null : _ref2$errMiddlewaresP;

  var wrapped = {};
  Object.keys(wrappers).forEach(function (key) {
    wrappers[key].addRequestMiddlewares(reqMiddlewares, reqMiddlewareParams);
    wrappers[key].addErrorMiddlewares(errMiddlewares, errMiddlewaresParams);
    wrapped = (0, _extends4.default)((0, _defineProperty3.default)({}, key, wrappers[key].routes), wrapped);
  });
  return wrapped;
};

exports.default = combineWrappers;