'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var getDisplayName = function getDisplayName(Component) {
  return 'router(' + (Component.displayName || Component.name || Component.constructor && Component.constructor.name || 'Unknown') + ')';
};

var isRouteFound = function isRouteFound(title) {
  return function (result) {
    return result && [].concat(title).includes(result.title);
  };
};

var hoc = function hoc(title, options) {
  return function (Component) {
    var _class, _temp;

    return _temp = _class = function (_React$Component) {
      _inherits(_class, _React$Component);

      function _class(props, context) {
        _classCallCheck(this, _class);

        var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props, context));

        _this.toShow = function () {
          var state = _this.context.store.getState();

          if (!state.router || !state.router.result) {
            // eslint-disable-next-line no-console
            console.error('/HOC/ Router | There is no route found in `state.router.result`');
            return;
          }

          // Absolute mode, we are looking in top level only
          var result = state.router.result;
          if (options && options.absolute) {
            var _show = isRouteFound(title)(result);
            if (_show !== _this.state.show) {
              _this.setState(function (innerState) {
                return _extends({}, innerState, { show: _show });
              });
            }

            return;
          }

          // Either way we are looking top down the result tree
          var show = isRouteFound(title)(result);
          while (result && !show) {
            result = result.parent;
            show = isRouteFound(title)(result);
          }

          if (show !== _this.state.show) {
            _this.setState(function (innerState) {
              return _extends({}, innerState, { show: show });
            });
          }
        };

        _this.state = { show: false };
        return _this;
      }

      _createClass(_class, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
          var _this2 = this;

          // subscribe
          this.unsubscribe = this.context.store.subscribe(function () {
            _this2.toShow();
          });

          // run in once
          this.toShow();
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          this.unsubscribe();
        }
      }, {
        key: 'render',
        value: function render() {
          if (!this.state.show) return null;

          return _react2.default.createElement(Component, this.props);
        }
      }]);

      return _class;
    }(_react2.default.Component), _class.displayName = getDisplayName(Component), _class.contextTypes = {
      store: function store() {
        return null;
      } }, _temp;
  };
};

hoc.absolute = function (title, options) {
  return hoc(title, _extends({}, options, { absolute: true }));
};

exports.default = hoc;