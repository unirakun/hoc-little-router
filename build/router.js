'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var hoc = function hoc(title, options) {
  var isRouteFound = function isRouteFound(result) {
    return result && [].concat(title).includes(result.title);
  };

  // This is genrated prop name to avoid overlaping props given from parent
  var propName = 'show_' + title;

  var mapStateToProps = function mapStateToProps(state) {
    if (!state.router || !state.router.result) {
      // eslint-disable-next-line no-console
      console.error('/HOC/ Router | There is no route found in `state.router.result`');
      return {};
    }

    // Absolute mode, we are looking in top level only
    var result = state.router.result;
    if (options && options.absolute) {
      return _defineProperty({}, propName, isRouteFound(result));
    }

    // Either way we are looking top down the result tree
    var found = isRouteFound(result);
    while (result && !found) {
      result = result.parent;
      found = isRouteFound(result);
    }

    return _defineProperty({}, propName, !!found);
  };

  return function (Component) {
    return (0, _reactRedux.connect)(mapStateToProps)(function (props) {
      if (!props[propName]) return null;

      // Like omit
      // We delete this propse so the child don't see it
      var newProps = _extends({}, props);
      delete newProps[propName];

      return _react2.default.createElement(Component, newProps);
    });
  };
};

hoc.absolute = function (title, options) {
  return hoc(title, _extends({}, options, { absolute: true }));
};

exports.default = hoc;